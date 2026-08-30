'use client';

// 卷面进度墙（Paper progress）的数据与纯计算。
//
// 数据源是构建期生成的 public\exam\papers.json（卷 → qid 清单），只在用户
// 打开进度面板时才取——和 topics.json 同一个思路：它对 deck 首屏毫无用处，
// 没道理让每次冷启动都替这面墙买单。
//
// 口径写死「已做过的题数 / 卷内总题数」：分子是这套卷里作答过至少一次的题，
// 分母是这套卷进了索引、且用户当前够得着的题。做对做错都算「做过」——
// 这面墙回答的是「哪几套卷我还没碰过」，不是「我做得对不对」（那是复烤区的事）。
//
// 成绩页的完卷横幅（papersJustCompleted）也长在这个模块里：它问的是
// 「本场把哪几套卷做满了」，答案必须与这面墙同一条判据，否则两处会互相打脸。

// 显式带扩展名：测试用 node --experimental-strip-types 直接跑这个模块，
// ESM 解析器不会替你补 .ts（records.ts 里的 './i18n.ts' 同理）
import { EXAM_DATA } from './config.ts';
import type { Records } from './records.ts';

export interface PaperEntry {
  /** 「库|卷号」，全站唯一；React key 与分组都用它 */
  key: string;
  db: string;
  /** 展示用卷号全名，与考试页题头的 sourceLabel 同一条规则 */
  label: string;
  /** 卷内进了索引的题，与 index 同序（降序） */
  qids: number[];
}

export interface PapersData {
  v: number;
  papers: PaperEntry[];
}

// ---- 懒取与缓存 ----
//
// 缓存放模块级而不是组件 state：面板一退就卸载，挂在 state 上等于每开一次重取一遍。
// 失败不缓存，下次打开还能再试。整段与 topics.ts 同构，刻意长得一样。

let cache: PapersData | null = null;
let inflight: Promise<PapersData> | null = null;

/** 已经取到的那份；没取过返回 null（组件用它做首帧初值，省掉一次闪烁） */
export function cachedPapers(): PapersData | null {
  return cache;
}

export function loadPapers(): Promise<PapersData> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = fetch(`${EXAM_DATA}/papers.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`papers.json HTTP ${res.status}`);
        return res.json() as Promise<PapersData>;
      })
      .then((data) => {
        // 形状闸：代理/CDN 返回 200 的错误体、将来 v2 改结构命中旧缓存，
        // 都会走到这里。只校 res.ok 挡不住它们，畸形数据一旦入缓存，
        // 面板一打开就在 papers 迭代处炸掉整个应用——「取不到就整块不渲染」
        // 这句承诺必须包含「取到了但不是那份数据」
        if (data?.v !== 1 || !Array.isArray(data.papers)) {
          throw new Error('papers.json shape mismatch');
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
export function resetPapersCache(): void {
  cache = null;
  inflight = null;
}

// ---- 聚合 ----

export interface PaperProgress {
  key: string;
  db: string;
  label: string;
  /** 卷内做过（作答过至少一次）的题数 */
  done: number;
  /** 卷内够得着的题数，也就是格子上那个分母 */
  total: number;
  /** 0–1；total 为 0 的卷压根不产出，所以不会有 NaN */
  ratio: number;
}

/**
 * 这道题算不算「做过」。做对做错都算，一次都没作答才不算。
 * 抽成一个名字是因为完卷横幅（papersJustCompleted）要用同一条判据——
 * 横幅说「这卷做满了」而墙上还差一格，那是两套算法在打架。
 */
function attempted(records: Records, qid: number): boolean {
  const stat = records.q[String(qid)];
  return !!stat && stat.a > 0;
}

/**
 * 每套卷的完成度。
 *
 * reach 是「用户当前够得着的题」（reachableIndex 划的，已排除 diag，
 * 未解锁时不含扩展池）。整卷都够不着就整条不产出——于是锁定用户的墙上
 * 连 Mock 的卷名都不会出现。**不剧透这件事就落在这一行**：面板不认得
 * 解锁规则，它只知道有些 qid 不在给它的那个集合里。
 */
export function paperProgress(
  data: PapersData,
  reach: ReadonlySet<number>,
  records: Records,
): PaperProgress[] {
  const rows: PaperProgress[] = [];
  for (const paper of data.papers) {
    let total = 0;
    let done = 0;
    for (const qid of paper.qids) {
      if (!reach.has(qid)) continue;
      total++;
      if (attempted(records, qid)) done++;
    }
    if (total === 0) continue;
    rows.push({
      key: paper.key,
      db: paper.db,
      label: paper.label,
      done,
      total,
      ratio: done / total,
    });
  }
  return rows;
}

/**
 * 本场交卷让哪几套卷从「未做满」跨到「做满」——完卷横幅要报的就是这批卷。
 *
 * before 是开考那一刻的记录快照（ExamApp 的 historyAtStartRef，与成绩页
 * 逐题历史同一份），answered 是本场**作答过**的 qid。跳过的题不算做过，
 * 这与 addSession 的口径一致（它也只给 answered 的题 a+1），两边不一致
 * 就会出现「横幅说满了、下次打开墙上还差一格」。
 *
 * 只报跨线的卷：before 就已经满档的卷不在结果里，所以同一套卷做第二遍
 * 不会再弹一次。整卷都够不着的卷压根不产出（同 paperProgress 的 reach 口径），
 * 于是锁定用户不会因为一场复烤而在横幅上看见扩展卷的卷名。
 */
export function papersJustCompleted(
  data: PapersData,
  reach: ReadonlySet<number>,
  before: Records,
  answered: ReadonlySet<number>,
): PaperProgress[] {
  const rows: PaperProgress[] = [];
  for (const paper of data.papers) {
    let total = 0;
    let was = 0;
    let now = 0;
    for (const qid of paper.qids) {
      if (!reach.has(qid)) continue;
      total++;
      const seen = attempted(before, qid);
      if (seen) was++;
      if (seen || answered.has(qid)) now++;
    }
    // total === 0 是「整卷够不着」；was === total 是「本来就满了」，
    // 两种都不该上榜
    if (total === 0 || was >= total || now < total) continue;
    rows.push({ key: paper.key, db: paper.db, label: paper.label, done: now, total, ratio: 1 });
  }
  return rows;
}

export interface PaperGroup {
  db: string;
  papers: PaperProgress[];
}

/**
 * 按库分组，保持 papers.json 里的顺序（库按站内固定顺序，库内新卷在前）。
 * 排序在构建期做完了，这里只是把连续的同库行收成一段——排序逻辑只该有一处。
 */
export function paperGroups(rows: PaperProgress[]): PaperGroup[] {
  const groups: PaperGroup[] = [];
  for (const row of rows) {
    const last = groups[groups.length - 1];
    if (last && last.db === row.db) last.papers.push(row);
    else groups.push({ db: row.db, papers: [row] });
  }
  return groups;
}

/** 颜色档数：0 = 一题没做，4 = 整卷做完 */
export const PAPER_LEVELS = 5;

/**
 * 格子的深浅档。
 *
 * 0 与 4 是两个「说得出名字」的状态（没碰过 / 做完了），必须各自独占一档，
 * 不能被四舍五入吃掉：做了 1/25 和一题没做长得一样，人会以为自己没做过；
 * 24/25 显示成满档，则等于替用户宣布完卷。中间三档才按比例分。
 */
export function paperLevel(done: number, total: number): number {
  if (total <= 0 || done <= 0) return 0;
  if (done >= total) return PAPER_LEVELS - 1;
  const ratio = done / total;
  if (ratio < 1 / 3) return 1;
  if (ratio < 2 / 3) return 2;
  return 3;
}

/** 分组小标题已经写了库名，格子上重复一遍纯属浪费那点宽度 */
const DB_PREFIX: Record<string, string> = {
  TMUA: 'TMUA',
  TMUA_MOCK: 'TMUA Mock',
  MAT: 'MAT',
  SMC: 'SMC',
  ECAA: 'ECAA',
  AMC: 'AMC',
};

/**
 * 格子上那行短名：去掉库名前缀，再收掉 ECAA 每套卷都带的那串固定后缀
 * （「Section 1 Part B」对区分是哪套卷毫无帮助）。
 * 剪不动就原样留着——宁可一个格子宽一点，也别把卷号剪成认不出来的样子；
 * 完整卷名与精确题数在悬停提示里另有一份。
 */
export function paperShort(label: string, db: string): string {
  const prefix = DB_PREFIX[db];
  const stripped =
    prefix && label.startsWith(`${prefix} `) ? label.slice(prefix.length + 1) : label;
  const short = stripped.replace(/\s*Section 1 Part B\s*/i, ' ').trim();
  return short || label;
}
