'use client';

// Grill（复烤区）——错题与弱项的复盘区。
//
// 三块，从窄到宽：
//   1. 诊断绑定题：Diagnostic 里考过的那批题，组卷走 P0 建好的
//      start({ qids }) 通道 + practice 模式，考试引擎一行没动
//   2. 最常做错：全站错题榜 + 「重练这些」，练的就是榜上列出来的那几行
//   3. 知识点复盘：按 topics 聚合做过的题，每行一个「练这类题」
//
// 后两块是 P6 从进度面板搬过来的（Design §9/§13 定的行为一条没改）。
// 搬家的理由是分工：进度面板回答「我练到哪儿了」（趋势、卷面、记录文件），
// 复烤区回答「我该回头做哪些题」——两个问题各归各的卡，而不是把
// 「重练这些」和「练这类题」两个按钮埋在一屏统计数字底下。
//
// 面板照旧不认得 9.0 的解锁规则：范围由外层划好递进来（topicScope），
// 这里既不判断也不绕过。

import { useEffect, useMemo, useRef, useState } from 'react';

import { EXAM_DATA } from '@/lib/config';
import type { IndexEntry } from '@/lib/exam';
import { useLang } from '@/lib/LangContext';
import { grillAvailable, grillCountOptions, boundCount, danglingCount } from '@/lib/grill';
import { MISSED_LIMIT, fmtPercent, practiceQids } from '@/lib/progress';
import { wrongRanking, type PickMode, type Records } from '@/lib/records';
import {
  WEAK_TOPIC_MIN_QUESTIONS,
  cachedTopics,
  loadTopics,
  pickTopicQids,
  thinTopicCount,
  topicEntries,
  topicReach,
  topicRows,
  weakTopics,
  type TopicsData,
} from '@/lib/topics';
import examStyles from '../exam/Exam.module.css';
import styles from './Grill.module.css';

/** 错题榜行里要显示的题面信息，懒取单题 JSON 得到 */
interface QuestionBrief {
  paper: string;
  year: number;
  number: string;
}

interface Props {
  index: IndexEntry[] | null;
  records: Records;
  /**
   * 「练这类题」能摸到的范围，由外层按 9.0 的状态划好
   * （reachableIndex，已排除 diag，未解锁时不含扩展池）。
   * 面板不该知道那套规则，也绝不能成为绕过它的后门
   */
  topicScope: IndexEntry[];
  pickMode: PickMode;
  onPickMode: (mode: PickMode) => void;
  count: number;
  onCount: (n: number) => void;
  busy: boolean;
  onStart: () => void;
  /** 空态里指路：直接去 9.0 的 Diagnostic 介绍页 */
  onGoDiagnostic: () => void;
  /** 重练榜上这几道；同步直调，requestFullscreen 认的是手势链 */
  onRetry: (qids: number[]) => void;
  /** 弱项图开一场练习；同样必须同步直调 */
  onPractice: (qids: number[]) => void;
  dbLabel: (db: string) => string;
  /** 抽题失败信息。复烤视图下这里是唯一的出口 */
  error: string;
  /**
   * 上一场从这个区开出去的成绩回执，外层已经按来源取好文案；空串＝没有。
   * 三块的动作原来只有出错才有红字，正常路径一句反馈都没有——
   * 这条就是那句「你刚才做的事有结果了」。一次性、不落盘（外层管生命周期）
   */
  receipt: string;
}

function sourceLabel(brief: QuestionBrief): string {
  const paper =
    !brief.year || brief.paper.includes(String(brief.year))
      ? brief.paper
      : `${brief.paper} ${brief.year}`;
  return brief.number ? `${paper} · ${brief.number}` : paper;
}

export default function GrillPanel({
  index,
  records,
  topicScope,
  pickMode,
  onPickMode,
  count,
  onCount,
  busy,
  onStart,
  onGoDiagnostic,
  onRetry,
  onPractice,
  dbLabel,
  error,
  receipt,
}: Props) {
  const { t } = useLang();

  // ---- 1. 诊断绑定集 ----
  const bound = boundCount(records);
  const dangling = danglingCount(index, records);
  const available = grillAvailable(index, records, pickMode);
  const choices = grillCountOptions(available);

  // 切到更窄的策略后，选中的题数可能超出新上限——pickGrillQids 会悄悄截断，
  // 但界面上就成了「显示 20、实抽 3」。超限时直接落到「全部」档，显示与行为对齐
  useEffect(() => {
    if (available > 0 && count > available) onCount(available);
  }, [available, count, onCount]);

  // ---- 2. 最常做错 ----
  //
  // diag（GMAT 诊断集）必须挡在错题榜之外：那批题设计上全程不显示对错，
  // 漏进来就等于把诊断答案泄出去。先整体排序再过滤，最后才截断——
  // 反过来先截 10 条的话，前 10 全是诊断题就会得到空榜。
  const practice = useMemo(() => practiceQids(index), [index]);
  const missed = useMemo(
    () =>
      wrongRanking(records, Number.POSITIVE_INFINITY)
        .filter((row) => practice.has(row.qid))
        .slice(0, MISSED_LIMIT),
    [records, practice],
  );

  const [briefs, setBriefs] = useState<Record<number, QuestionBrief>>({});
  const [pendingBatches, setPendingBatches] = useState(0);
  const briefsLoading = pendingBatches > 0;
  // 已经发过请求的 qid。用 ref 而不是看 briefs 里有没有：404 的那些永远进不了
  // briefs，靠 briefs 判重会让 effect 无限重取
  const requestedRef = useRef<Set<number>>(new Set());

  // 榜上这几条才取单题 JSON：题源信息不在 index 里，但为它扩 index
  // 等于让每次冷启动替这个面板买单
  useEffect(() => {
    const wanted = missed.map((row) => row.qid).filter((qid) => !requestedRef.current.has(qid));
    if (wanted.length === 0) return;
    for (const qid of wanted) requestedRef.current.add(qid);

    let alive = true;
    // 计数而不是布尔：两批请求重叠时，先回来的那批不该把后一批的加载态清掉
    setPendingBatches((n) => n + 1);
    Promise.allSettled(
      wanted.map(async (qid) => {
        const res = await fetch(`${EXAM_DATA}/q/${qid}.json`);
        if (!res.ok) throw new Error(String(res.status));
        return { qid, data: (await res.json()) as QuestionBrief };
      }),
    ).then((results) => {
      setPendingBatches((n) => Math.max(0, n - 1));
      if (!alive) return;
      const next: Record<number, QuestionBrief> = {};
      for (const item of results) {
        // 取不到就降级只显 qid：题库换代后旧 qid 会 404，不该让整块塌掉
        if (item.status === 'fulfilled') next[item.value.qid] = item.value.data;
      }
      setBriefs((prev) => ({ ...prev, ...next }));
    });
    return () => {
      alive = false;
    };
  }, [missed]);

  // ---- 3. 知识点复盘 ----
  //
  // 知识点倒排表只在这个面板打开时才取，和上面那批单题 JSON 同一个思路：
  // 它对 deck 首屏毫无用处。缓存在模块里，开一次取一次是浪费。
  // 取不到就整块不渲染——弱项分析没有降级形态，宁可缺席也别摆个空壳
  const [topics, setTopics] = useState<TopicsData | null>(() => cachedTopics());
  useEffect(() => {
    if (topics) return;
    let alive = true;
    loadTopics()
      .then((data) => {
        if (alive) setTopics(data);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [topics]);

  // 弱项统计走练习池，和错题榜同一个口径（diag 一律在外）。
  // 逻辑推理开关不参与：这里统计的是「做过的题」，那层滤网管的是随机抽题
  const allTopicRows = useMemo(
    () => (topics ? topicRows(topics, records, practice) : []),
    [topics, records, practice],
  );
  const weak = useMemo(() => weakTopics(allTopicRows), [allTopicRows]);
  const thin = thinTopicCount(allTopicRows);
  const reach = useMemo(
    () => (topics ? topicReach(topics, records, index) : null),
    [topics, records, index],
  );
  // 每行的可练池。空池要把按钮置灰，所以渲染时就得知道它有多大
  const topicPools = useMemo(() => {
    if (!topics) return new Map<string, IndexEntry[]>();
    return new Map(weak.map((row) => [row.topic, topicEntries(topics, row.topic, topicScope)]));
  }, [topics, weak, topicScope]);

  const modes: { id: PickMode; label: string; hint: string }[] = [
    { id: 'random', label: t.setup.pickRandom, hint: t.setup.pickRandomHint },
    { id: 'wrong-and-new', label: t.setup.pickWrongNew, hint: t.setup.pickWrongNewHint },
    { id: 'new-only', label: t.setup.pickNewOnly, hint: t.setup.pickNewOnlyHint },
  ];

  /**
   * 三块全空 —— 一次诊断没考过、一道题没做错、一个知识点也不够格。
   * 这时三个空态摞在一起只是三遍「什么都没有」，不如整卡说一次话。
   *
   * topics 还在路上时 weak 也是空的，于是「战绩全对的人」可能先看到整卡空态、
   * 取回来再翻成三块。那要求同时满足「零绑定 + 零错题 + 有够格的知识点」，
   * 罕见且自愈；反过来押「等 topics 落地再判断」，会让取不到 topics.json 的人
   * 永远卡在三个空块上，那个坏得更久。
   */
  const allEmpty = bound === 0 && missed.length === 0 && weak.length === 0;

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>{t.grill.title}</h2>
      <p className={styles.lead}>{t.grill.lead}</p>

      {/* 抽题失败在复烤视图下没有别的出口：errMsg 挂在配置面板、
          deckHint 挂在 CardDeck，这里都没有。三个按钮共用这一处回执，
          所以摆在最上面而不是跟在某一个按钮后面 */}
      {error && <div className={examStyles.errMsg}>{error}</div>}

      {/* 上一场的回执，摆在三块之上（与出错红字同一处「本区总反馈」的位置，
          但排在它后面——出错要优先被看见）。它跨越了空态分支：三块全空时
          本来就开不出场次，实际不会同时出现，写在外面只是不必重复两遍 */}
      {receipt && (
        <p className={styles.receipt} role="status">
          {receipt}
        </p>
      )}

      {allEmpty ? (
        <div className={styles.emptyBox}>
          <p className={styles.emptyTitle}>{t.grill.emptyTitle}</p>
          <p className={styles.emptyHint}>{t.grill.emptyHint}</p>
          <button type="button" className={styles.ghost} onClick={onGoDiagnostic}>
            {t.grill.goDiagnostic}
          </button>
        </div>
      ) : (
        <>
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h3 className={styles.sectionTitle}>{t.grill.boundTitle}</h3>
              {bound > 0 && (
                <span className={styles.sectionSub}>
                  {t.grill.bound(bound)}
                  {/* 题库换代后绑定的 qid 可能已经不存在，如实说明，别让用户对不上数 */}
                  {dangling > 0 && <> · {t.grill.dangling(dangling)}</>}
                </span>
              )}
            </div>

            {bound === 0 ? (
              <>
                <p className={styles.empty}>{t.grill.boundEmpty}</p>
                <button type="button" className={styles.ghost} onClick={onGoDiagnostic}>
                  {t.grill.goDiagnostic}
                </button>
              </>
            ) : (
              <>
                <div className={examStyles.fieldLabel}>{t.setup.fieldPick}</div>
                <div className={examStyles.segRow}>
                  {modes.map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      className={`${examStyles.segBtn} ${pickMode === mode.id ? examStyles.segActive : ''}`}
                      onClick={() => onPickMode(mode.id)}
                    >
                      {mode.label}
                      <span className={examStyles.segHint}>{mode.hint}</span>
                    </button>
                  ))}
                </div>

                <div className={examStyles.fieldLabel}>{t.grill.fieldCount(available)}</div>
                <div className={examStyles.segRow}>
                  {choices.map((n, i) => (
                    <button
                      key={n}
                      type="button"
                      className={`${examStyles.segBtn} ${count === n ? examStyles.segActive : ''}`}
                      onClick={() => onCount(n)}
                    >
                      {/* 最后一档就是「全部」，省得用户自己算上限 */}
                      {i === choices.length - 1 && n === available ? `${t.grill.countAll} (${n})` : n}
                    </button>
                  ))}
                </div>

                <button
                  className={examStyles.startBtn}
                  // 直调，不包异步：requestFullscreen 只认用户手势的同步调用链
                  onClick={onStart}
                  disabled={busy || !index || available === 0}
                >
                  {busy ? t.setup.picking : t.grill.start}
                </button>
                {available === 0 && <div className={examStyles.errMsg}>{t.grill.empty}</div>}
              </>
            )}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h3 className={styles.sectionTitle}>{t.grill.missedTitle}</h3>
              {/* 榜上有行才出现，出现即字面为真：练的就是下面列的这几道 */}
              {missed.length > 0 && (
                <button
                  type="button"
                  className={styles.retry}
                  disabled={busy || !index}
                  onClick={() => onRetry(missed.map((row) => row.qid))}
                >
                  {t.grill.missedRetry}
                </button>
              )}
            </div>

            {missed.length === 0 ? (
              <p className={styles.empty}>{t.grill.missedEmpty}</p>
            ) : (
              <ol className={styles.missedList} role="list">
                {missed.map((row) => {
                  const brief = briefs[row.qid];
                  return (
                    <li key={row.qid} className={styles.missedRow}>
                      <span className={styles.missedName}>
                        {brief ? sourceLabel(brief) : t.grill.missedFallback(row.qid)}
                      </span>
                      <span className={styles.missedStat}>
                        {t.grill.missedRow(row.stat.w, row.stat.a)}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
            {briefsLoading && <p className={styles.note}>{t.grill.missedLoading}</p>}
          </section>

          {/* 知识点复盘。topics.json 没到位（还在取、或取失败）时整块不出现 */}
          {topics && (
            <section className={styles.section}>
              <div className={styles.sectionHead}>
                <h3 className={styles.sectionTitle}>{t.grill.weakTitle}</h3>
                <span className={styles.sectionSub}>{t.grill.weakNote}</span>
              </div>

              {weak.length === 0 ? (
                <p className={styles.empty}>{t.grill.weakEmpty(WEAK_TOPIC_MIN_QUESTIONS)}</p>
              ) : (
                <ul className={styles.topicList} role="list">
                  {weak.map((row) => {
                    const pool = topicPools.get(row.topic) || [];
                    return (
                      <li key={row.topic} className={styles.topicRow}>
                        <span className={styles.topicName}>{t.grill.topicName(row.topic)}</span>
                        <span className={styles.topicStat}>
                          {t.grill.weakRow(row.questions, fmtPercent(row.accuracy))}
                        </span>
                        {/* 横条只是把上面那个百分比画出来，读屏念文字就够了 */}
                        <span className={styles.topicBar} aria-hidden="true">
                          <span
                            className={styles.topicFill}
                            style={{ width: `${Math.round(row.accuracy * 100)}%` }}
                          />
                        </span>
                        <button
                          type="button"
                          className={`${styles.ghost} ${styles.topicPractice}`}
                          aria-label={t.grill.weakPracticeAria(t.grill.topicName(row.topic))}
                          // 池子为空（这个知识点的题都在还没解开的范围里）就置灰
                          disabled={busy || !index || pool.length === 0}
                          // 点的时候才抽题：抽题带随机，渲染期算等于每次重渲染都换一批。
                          // 直调不包异步，requestFullscreen 认的是手势链
                          onClick={() => onPractice(pickTopicQids(pool, records))}
                        >
                          {t.grill.weakPractice}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* 够不上门槛的知识点为什么不在榜上，得有个交代 */}
              {weak.length > 0 && thin > 0 && (
                <p className={styles.note}>{t.grill.weakThin(thin, WEAK_TOPIC_MIN_QUESTIONS)}</p>
              )}
              {/* 打标覆盖按库差得极远，做过的题里有多少真进了分析必须如实说 */}
              {reach && reach.analysed < reach.attempted && (
                <p className={styles.note}>
                  {t.grill.weakCoverage(
                    reach.analysed,
                    reach.attempted,
                    reach.banks.map((db) => dbLabel(db)).join(' · '),
                  )}
                </p>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
