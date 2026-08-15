'use client';

// 知识点弱项（Weak topics）的数据与纯计算。
//
// 数据源是构建期生成的 public\exam\topics.json（知识点 → qid 倒排 + 按库覆盖），
// 只在用户打开进度面板时才取，和错题榜懒取单题 JSON 同一个思路：
// 它对 deck 首屏毫无用处，没道理让每次冷启动都替这个板块买单。
//
// 口径写死「做过的题的正确率」（Lifetime accuracy on attempted questions）：
// 分子是该知识点下用户答过的题的（总作答次数 − 总错次），分母是总作答次数。
// 没做过的题既不进分子也不进分母——这里回答的是「我做过的这类题做得怎么样」，
// 不是「这类题我掌握了百分之多少」。

// 显式带扩展名：测试用 node --experimental-strip-types 直接跑这个模块，
// ESM 解析器不会替你补 .ts（records.ts 里的 './i18n.ts' 同理）
import { EXAM_DATA } from './config.ts';
import type { IndexEntry } from './exam';
import { pickQids, type Records } from './records.ts';

export interface TopicCoverage {
  /** 这个库里整理过知识点的题数 */
  tagged: number;
  /** 这个库进了索引的总题数，也就是覆盖率的分母 */
  total: number;
}

export interface TopicsData {
  v: number;
  /** 12 词规范表；byTopic 只列真有题的那些 */
  vocab: string[];
  byTopic: Record<string, number[]>;
  coverage: Record<string, TopicCoverage>;
}

/**
 * 一个知识点下做过的不同题少于这个数就不下结论。
 * 三道题错两道算不上「弱项」，只是抽样太小——宁可不说，也别把噪声说成结论。
 */
export const WEAK_TOPIC_MIN_QUESTIONS = 5;

/** 「练这类题」一次最多抽多少道 */
export const TOPIC_PRACTICE_LIMIT = 10;

// ---- 懒取与缓存 ----
//
// 缓存放模块级而不是组件 state：面板一退就卸载，挂在 state 上等于每开一次重取一遍。
// 失败不缓存，下次打开还能再试。

let cache: TopicsData | null = null;
let inflight: Promise<TopicsData> | null = null;

/** 已经取到的那份；没取过返回 null（组件用它做首帧初值，省掉一次闪烁） */
export function cachedTopics(): TopicsData | null {
  return cache;
}

export function loadTopics(): Promise<TopicsData> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = fetch(`${EXAM_DATA}/topics.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`topics.json HTTP ${res.status}`);
        return res.json() as Promise<TopicsData>;
      })
      .then((data) => {
        // 形状闸：代理/CDN 返回 200 的错误体、将来 v2 改结构命中旧缓存，
        // 都会走到这里。只校 res.ok 挡不住它们，畸形数据一旦入缓存，
        // 面板一打开就在 vocab 迭代处炸掉整个应用——「取不到就整块不渲染」
        // 这句承诺必须包含「取到了但不是那份数据」
        if (
          data?.v !== 1 ||
          !Array.isArray(data.vocab) ||
          typeof data.byTopic !== 'object' ||
          data.byTopic === null ||
          typeof data.coverage !== 'object' ||
          data.coverage === null
        ) {
          throw new Error('topics.json shape mismatch');
        }
        cache = data;
        return data;
      })
      .catch((error) => {
        inflight = null;
        throw error;
      });
  }
  return inflight;
}

/** 只给测试用：清掉模块级缓存 */
export function resetTopicsCache(): void {
  cache = null;
  inflight = null;
}

// ---- 聚合 ----

export interface TopicRow {
  topic: string;
  /** 这个知识点下用户答过的**不同题**数；n≥5 门槛看的就是它 */
  questions: number;
  /** 总作答次数（同一道题做两遍算两次） */
  attempts: number;
  wrong: number;
  /** 0–1；attempts 为 0 时是 0，不产生 NaN */
  accuracy: number;
}

/**
 * 每个知识点上「做过的题」的战绩。pool 是练习池（practiceQids 划的，已排除 diag），
 * 双保险：diag 那批题按设计全程不显示对错，任何统计都不该让它露头。
 * 一道没做过的知识点整行不产出——它在弱项图里没有位置。
 */
export function topicRows(
  data: TopicsData,
  records: Records,
  pool: ReadonlySet<number>,
): TopicRow[] {
  const rows: TopicRow[] = [];
  for (const topic of data.vocab) {
    const qids = data.byTopic[topic];
    if (!qids) continue;
    let questions = 0;
    let attempts = 0;
    let wrong = 0;
    for (const qid of qids) {
      if (!pool.has(qid)) continue;
      const stat = records.q[String(qid)];
      if (!stat || stat.a <= 0) continue;
      questions++;
      attempts += stat.a;
      wrong += stat.w;
    }
    if (questions === 0) continue;
    rows.push({
      topic,
      questions,
      attempts,
      wrong,
      accuracy: attempts > 0 ? (attempts - wrong) / attempts : 0,
    });
  }
  return rows;
}

/**
 * 够格下结论的那些行，弱的排前面。
 * 同正确率时样本大的在前——两行都是 60%，做过 20 题那行更值得先看；
 * 最后按名字兜底，好让同分同样本的顺序稳定，不随索引顺序漂。
 */
export function weakTopics(rows: TopicRow[]): TopicRow[] {
  return rows
    .filter((row) => row.questions >= WEAK_TOPIC_MIN_QUESTIONS)
    .sort(
      (a, b) =>
        a.accuracy - b.accuracy ||
        b.questions - a.questions ||
        (a.topic < b.topic ? -1 : a.topic > b.topic ? 1 : 0),
    );
}

/** 做过但还不够 5 道题的知识点数；面板用它说明「为什么这些没出现」 */
export function thinTopicCount(rows: TopicRow[]): number {
  return rows.filter((row) => row.questions < WEAK_TOPIC_MIN_QUESTIONS).length;
}

export interface TopicReach {
  /** 练习池里做过的题数 */
  attempted: number;
  /** 其中整理过知识点、真正进了上面统计的题数 */
  analysed: number;
  /** 落下的题所在、且整库打标确实过半没做完的库，按落下的题数降序 */
  banks: string[];
}

/** 一个库打标不足这个比例才够格被点名「还没整理完」 */
const LOW_COVERAGE_RATIO = 0.5;

/**
 * 这份分析实际盖住了用户做过的多少题。
 *
 * 打标覆盖在各库之间差得极远（SMC 全标完，MAT 只有 5%），一个主练 MAT 的人
 * 看到的弱项图其实只基于极少数题。这个数不披露，图就是在骗人。
 *
 * 点名哪些库要看整库覆盖率，不能只看用户自己漏了谁：TMUA 已整理 90%，
 * 一个人恰好做过它剩下 10% 里的两道，就把 TMUA 说成「还没整理完的库」，
 * 是拿个例冤枉全体。真没整理完的库（覆盖率不过半）才配进这份名单。
 */
export function topicReach(
  data: TopicsData,
  records: Records,
  index: IndexEntry[] | null,
): TopicReach {
  const tagged = new Set<number>();
  for (const qids of Object.values(data.byTopic)) {
    for (const qid of qids) tagged.add(qid);
  }

  let attempted = 0;
  let analysed = 0;
  const missing = new Map<string, number>();
  for (const entry of index || []) {
    if (entry.diag) continue;
    const stat = records.q[String(entry.qid)];
    if (!stat || stat.a <= 0) continue;
    attempted++;
    if (tagged.has(entry.qid)) {
      analysed++;
      continue;
    }
    missing.set(entry.db, (missing.get(entry.db) || 0) + 1);
  }

  const banks = [...missing.entries()]
    .filter(([db]) => {
      const cov = data.coverage[db];
      return cov && cov.total > 0 && cov.tagged / cov.total < LOW_COVERAGE_RATIO;
    })
    .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
    .map(([db]) => db);
  return { attempted, analysed, banks };
}

// ---- 「练这类题」 ----

/**
 * 某个知识点当前能练的题。
 *
 * scope 由调用方按 9.0 的状态划好（indexForLibraryMode），这里不自己判——
 * 面板不该知道解锁规则，但也绝不能成为绕过它的后门：还没拿到 9.0 的人
 * 从这条路同样摸不到扩展池的题。diag 再挡一道，虽然诊断题本就没有知识点标签。
 */
export function topicEntries(
  data: TopicsData,
  topic: string,
  scope: IndexEntry[],
): IndexEntry[] {
  const qids = new Set(data.byTopic[topic] || []);
  if (qids.size === 0) return [];
  return scope.filter((entry) => !entry.diag && qids.has(entry.qid));
}

/**
 * 从这批题里挑一场。复用既有的 pickQids：mixWrong 让错题优先占前三分之一，
 * excludeSeen 关着——复盘弱项本来就要回头做那些做过的题，排除已做等于把
 * 最该重来的题全滤掉。
 */
export function pickTopicQids(
  entries: IndexEntry[],
  records: Records,
  limit = TOPIC_PRACTICE_LIMIT,
): number[] {
  if (entries.length === 0) return [];
  return pickQids(
    entries,
    'ALL',
    Math.min(limit, entries.length),
    { excludeSeen: false, mixWrong: true },
    records,
  );
}
