'use client';

// 成绩回顾面板。setup 相的第三个子视图，和 deck / 配置面板共用 .stage 的同一格。
//
// 只读分析 + 记录管理（XLSX 导入导出从配置面板搬到了这里）。
// 无任何解锁门槛：第一次打开也要能看，空态自己说话。

import { useEffect, useMemo, useRef, useState } from 'react';
import { EXAM_DATA } from '@/lib/config';
import type { IndexEntry } from '@/lib/exam';
import { useLang } from '@/lib/LangContext';
import { wrongRanking, type Records } from '@/lib/records';
import {
  MISSED_LIMIT,
  TREND_LIMIT,
  chartGeometry,
  fmtClock,
  fmtDate,
  fmtPercent,
  practiceOverview,
  practiceQids,
  trendPoints,
} from '@/lib/progress';
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
import styles from './Progress.module.css';

/** 错题榜行里要显示的题面信息，懒取单题 JSON 得到 */
interface QuestionBrief {
  paper: string;
  year: number;
  number: string;
}

interface Props {
  records: Records;
  index: IndexEntry[] | null;
  /**
   * 弱项图「练这类题」能摸到的范围，由外层按 9.0 的状态划好
   * （indexForLibraryMode，已排除 hidden 与 diag）。
   * 面板不该知道那套规则，也绝不能成为绕过它的后门
   */
  topicScope: IndexEntry[];
  onBack: () => void;
  /** 重练榜上这几道；同步直调，requestFullscreen 认的是手势链 */
  onRetry: (qids: number[]) => void;
  /** 弱项图开一场练习；同样必须同步直调 */
  onPractice: (qids: number[]) => void;
  retryDisabled: boolean;
  /** 抽题失败信息。进度视图下这里是唯一的出口 */
  error: string;
  dbLabel: (db: string) => string;
  tools: {
    busy: boolean;
    message: string;
    indexReady: boolean;
    /** 整档记录条数（含诊断题），决定导出/清空能不能点 */
    recordCount: number;
    onFile: (file: File) => void;
    onExport: () => void;
    onClear: () => void;
  };
}

function sourceLabel(brief: QuestionBrief): string {
  const paper = !brief.year || brief.paper.includes(String(brief.year))
    ? brief.paper
    : `${brief.paper} ${brief.year}`;
  return brief.number ? `${paper} · ${brief.number}` : paper;
}

export default function ProgressPanel({
  records,
  index,
  topicScope,
  onBack,
  onRetry,
  onPractice,
  retryDisabled,
  error,
  dbLabel,
  tools,
}: Props) {
  const { t } = useLang();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const points = useMemo(() => trendPoints(records, TREND_LIMIT), [records]);
  // 选中态存场次的 ts 而不是下标：重练回来后新场次入列，下标会指到别人身上
  const [pickedTs, setPickedTs] = useState<number | null>(null);
  const pickedIndex = pickedTs === null ? -1 : points.findIndex((p) => p.session.ts === pickedTs);

  // diag（GMAT 诊断集）必须挡在错题榜之外：那批题设计上全程不显示对错，
  // 漏进来就等于把诊断答案泄出去。先整体排序再过滤，最后才截断——
  // 反过来先截 10 条的话，前 10 全是诊断题就会得到空榜。
  const practice = useMemo(() => practiceQids(index), [index]);
  // 统计块和错题榜共用同一个池子，否则会出现「14 道当前错题、榜上只有 12 条」
  const stats = useMemo(() => practiceOverview(records, practice), [records, practice]);
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
        // 取不到就降级只显 qid：题库换代后旧 qid 会 404，不该让整个面板塌掉
        if (item.status === 'fulfilled') next[item.value.qid] = item.value.data;
      }
      setBriefs((prev) => ({ ...prev, ...next }));
    });
    return () => {
      alive = false;
    };
  }, [missed]);

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

  // 弱项统计走练习池，和上面的统计块、错题榜同一个口径（diag 一律在外）。
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

  const geo = chartGeometry(points.length);
  const maxPace = Math.max(1, ...points.map((p) => p.pace));
  const line = points.map((p, i) => `${geo.x(i)},${geo.lineY(p.accuracy)}`).join(' ');
  const detail = pickedIndex >= 0 ? points[pickedIndex] : undefined;

  const detailText = (point: (typeof points)[number]) =>
    t.progress.sessionDetail(
      fmtDate(point.session.ts),
      dbLabel(point.session.db),
      point.session.mode === 'mock' ? t.setup.mockShort : t.setup.practice,
      point.session.right,
      point.session.n,
      fmtClock(point.session.sec),
    );

  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <button type="button" className={styles.back} onClick={onBack}>
          {t.progress.back}
        </button>
        <h2 className={styles.title}>{t.progress.title}</h2>
      </div>

      <div className={styles.tiles}>
        <span className={styles.tile}>
          <strong>{stats.seen}</strong>
          {t.progress.tileSeen}
        </span>
        <span className={styles.tile}>
          <strong>{stats.attempts > 0 ? fmtPercent(stats.accuracy) : '—'}</strong>
          {t.progress.tileAccuracy}
        </span>
        <span className={styles.tile}>
          <strong>{stats.wrongNow}</strong>
          {t.progress.tileWrong}
        </span>
        <span className={styles.tile}>
          <strong>{records.s.length}</strong>
          {t.progress.tileSessions}
        </span>
      </div>
      <p className={styles.note}>{t.progress.accuracyNote}</p>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h3 className={styles.sectionTitle}>{t.progress.sessionsTitle}</h3>
          {points.length > 0 && (
            <span className={styles.sectionSub}>
              {t.progress.sessionsSub(points.length, records.s.length)}
            </span>
          )}
        </div>

        {points.length === 0 ? (
          <p className={styles.empty}>{t.progress.sessionsEmpty}</p>
        ) : (
          <>
            <svg
              className={styles.chart}
              viewBox={`0 0 ${geo.width} ${geo.height}`}
              role="img"
              aria-label={t.progress.sessionsAria}
            >
              {/* 0 / 50 / 100% 三条参考线 */}
              {[0, 0.5, 1].map((ratio) => (
                <line
                  key={ratio}
                  className={styles.grid}
                  x1={geo.x(0)}
                  x2={geo.x(points.length - 1)}
                  y1={geo.lineY(ratio)}
                  y2={geo.lineY(ratio)}
                  vectorEffect="non-scaling-stroke"
                />
              ))}

              {/* 底部细柱＝每题平均用时。双 y 轴在 320px 宽下读不出来，降级成柱子 */}
              {points.map((p, i) => (
                <rect
                  key={`pace-${p.session.ts}-${i}`}
                  className={styles.pace}
                  x={geo.x(i) - Math.min(6, geo.band / 3)}
                  y={geo.barTop(p.pace / maxPace)}
                  width={Math.min(12, Math.max(2, (geo.band / 3) * 2))}
                  height={Math.max(1, geo.barBottom - geo.barTop(p.pace / maxPace))}
                />
              ))}

              <polyline
                className={styles.line}
                points={line}
                vectorEffect="non-scaling-stroke"
              />

              {detail && (
                <circle
                  className={styles.dot}
                  cx={geo.x(pickedIndex)}
                  cy={geo.lineY(detail.accuracy)}
                  r={3.5}
                />
              )}

              {/* 命中区：线上不画可见的点（375px 会糊成一片），
                  但每场都铺一块透明矩形，触屏也点得中 */}
              {points.map((p, i) => (
                <rect
                  key={`hit-${p.session.ts}-${i}`}
                  className={styles.hit}
                  x={geo.x(i) - (geo.band || geo.width) / 2}
                  y={0}
                  width={geo.band || geo.width}
                  height={geo.height}
                  onClick={() => setPickedTs(p.session.ts)}
                />
              ))}
            </svg>

            {/* svg 上的 role="img" 会把整棵子树变成呈现性内容，读屏拿不到里面的数据；
                命中矩形又不是可聚焦元素。与其铺 30 个 tab 停靠点把面板其余部分推到很后面，
                不如在图下补一份等价的纯文本清单——键盘和读屏一次就能读完整条趋势。 */}
            <ul className={styles.srOnly} aria-label={t.progress.sessionsAria}>
              {points.map((p) => (
                <li key={`sr-${p.session.ts}`}>{detailText(p)}</li>
              ))}
            </ul>

            <div className={styles.axis} aria-hidden="true">
              <span>{fmtDate(points[0].session.ts)}</span>
              <span>{fmtDate(points[points.length - 1].session.ts)}</span>
            </div>

            <div className={styles.legend}>
              <span className={styles.legendLine}>{t.progress.legendAccuracy}</span>
              <span className={styles.legendBar}>{t.progress.legendPace}</span>
            </div>

            <p className={styles.detail} role="status">
              {detail ? detailText(detail) : t.progress.sessionPick}
            </p>
          </>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h3 className={styles.sectionTitle}>{t.progress.missedTitle}</h3>
          {/* 榜上有行才出现，出现即字面为真：练的就是下面列的这几道 */}
          {missed.length > 0 && (
            <button
              type="button"
              className={styles.retry}
              disabled={retryDisabled}
              onClick={() => onRetry(missed.map((row) => row.qid))}
            >
              {t.progress.missedRetry}
            </button>
          )}
        </div>

        {/* 抽题失败在 progress 视图下没有别的出口：errMsg 挂在配置面板、
            deckHint 挂在 CardDeck，这里都没有 */}
        {error && <p className={styles.error}>{error}</p>}

        {missed.length === 0 ? (
          <p className={styles.empty}>{t.progress.missedEmpty}</p>
        ) : (
          <ol className={styles.missedList} role="list">
            {missed.map((row) => {
              const brief = briefs[row.qid];
              return (
                <li key={row.qid} className={styles.missedRow}>
                  <span className={styles.missedName}>
                    {brief ? sourceLabel(brief) : t.progress.missedFallback(row.qid)}
                  </span>
                  <span className={styles.missedStat}>
                    {t.progress.missedRow(row.stat.w, row.stat.a)}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
        {briefsLoading && <p className={styles.note}>{t.progress.missedLoading}</p>}
      </section>

      {/* 知识点弱项。topics.json 没到位（还在取、或取失败）时整块不出现 */}
      {topics && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h3 className={styles.sectionTitle}>{t.progress.weakTitle}</h3>
            <span className={styles.sectionSub}>{t.progress.weakNote}</span>
          </div>

          {weak.length === 0 ? (
            <p className={styles.empty}>{t.progress.weakEmpty(WEAK_TOPIC_MIN_QUESTIONS)}</p>
          ) : (
            <ul className={styles.topicList} role="list">
              {weak.map((row) => {
                const pool = topicPools.get(row.topic) || [];
                return (
                  <li key={row.topic} className={styles.topicRow}>
                    <span className={styles.topicName}>{t.progress.topicName(row.topic)}</span>
                    <span className={styles.topicStat}>
                      {t.progress.weakRow(row.questions, fmtPercent(row.accuracy))}
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
                      aria-label={t.progress.weakPracticeAria(t.progress.topicName(row.topic))}
                      // 池子为空（这个知识点的题都在还没解开的范围里）就置灰
                      disabled={retryDisabled || pool.length === 0}
                      // 点的时候才抽题：抽题带随机，渲染期算等于每次重渲染都换一批。
                      // 直调不包异步，requestFullscreen 认的是手势链
                      onClick={() => onPractice(pickTopicQids(pool, records))}
                    >
                      {t.progress.weakPractice}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {/* 够不上门槛的知识点为什么不在榜上，得有个交代 */}
          {weak.length > 0 && thin > 0 && (
            <p className={styles.note}>{t.progress.weakThin(thin, WEAK_TOPIC_MIN_QUESTIONS)}</p>
          )}
          {/* 打标覆盖按库差得极远，做过的题里有多少真进了分析必须如实说 */}
          {reach && reach.analysed < reach.attempted && (
            <p className={styles.note}>
              {t.progress.weakCoverage(
                reach.analysed,
                reach.attempted,
                reach.banks.map((db) => dbLabel(db)).join(' · '),
              )}
            </p>
          )}
        </section>
      )}

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t.records.field}</h3>
        <div className={styles.recordActions}>
          <button
            type="button"
            className={styles.ghost}
            onClick={() => fileRef.current?.click()}
            disabled={tools.busy || !tools.indexReady}
          >
            {t.records.importBtn}
          </button>
          <button
            type="button"
            className={styles.ghost}
            onClick={tools.onExport}
            disabled={tools.busy || tools.recordCount === 0}
          >
            {t.records.exportBtn}
          </button>
          <button
            type="button"
            className={styles.ghost}
            onClick={tools.onClear}
            disabled={tools.busy || tools.recordCount === 0}
          >
            {t.records.clearBtn}
          </button>
          <input
            ref={fileRef}
            className={styles.fileInput}
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={(event) => {
              const file = event.target.files?.[0];
              // 先清空 value 再交出去：File 已经拿在手里了，这样同一个文件
              // 连选两次也还会触发 change
              event.target.value = '';
              if (file) tools.onFile(file);
            }}
          />
        </div>
        {tools.message && <p className={styles.note}>{tools.message}</p>}
      </section>
    </div>
  );
}
