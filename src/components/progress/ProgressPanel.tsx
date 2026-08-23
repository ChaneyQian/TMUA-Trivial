'use client';

// 成绩回顾面板。setup 相的第三个子视图，和 deck / 配置面板共用 .stage 的同一格。
//
// 回答的是「我练到哪儿了」：统计块、最近场次趋势、卷面进度墙、记录文件工具。
// 「我该回头做哪些题」归复烤区（错题榜与知识点复盘 P6 搬去了那边）。
//
// 无任何解锁门槛：第一次打开也要能看，空态自己说话。

import { useEffect, useMemo, useRef, useState } from 'react';
import type { IndexEntry } from '@/lib/exam';
import { useLang } from '@/lib/LangContext';
import type { Records } from '@/lib/records';
import {
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
  cachedPapers,
  loadPapers,
  paperGroups,
  paperLevel,
  paperProgress,
  paperShort,
  type PapersData,
} from '@/lib/papers';
import styles from './Progress.module.css';

interface Props {
  records: Records;
  index: IndexEntry[] | null;
  /**
   * 用户当前够得着的题，由外层按 9.0 的状态划好
   * （reachableIndex，已排除 diag，未解锁时不含扩展池）。
   * 卷面进度墙的分母就是它——面板不该知道解锁规则，
   * 「锁定用户看不见扩展卷的卷名」这件事全靠这个集合落实
   */
  reachable: IndexEntry[];
  onBack: () => void;
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

export default function ProgressPanel({
  records,
  index,
  reachable,
  onBack,
  dbLabel,
  tools,
}: Props) {
  const { t } = useLang();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const points = useMemo(() => trendPoints(records, TREND_LIMIT), [records]);
  // 选中态存场次的 ts 而不是下标：重练回来后新场次入列，下标会指到别人身上
  const [pickedTs, setPickedTs] = useState<number | null>(null);
  const pickedIndex = pickedTs === null ? -1 : points.findIndex((p) => p.session.ts === pickedTs);

  // diag（GMAT 诊断集）必须挡在统计之外：那批题设计上全程不显示对错。
  // 统计块与 deck 上那条统计条共用同一个池子，否则两处数字会对不上
  const practice = useMemo(() => practiceQids(index), [index]);
  const stats = useMemo(() => practiceOverview(records, practice), [records, practice]);

  // 卷面清单只在这个面板打开时才取：它对 deck 首屏毫无用处。
  // 缓存在模块里，开一次取一次是浪费。取不到就整块不渲染——
  // 一面画不出格子的墙没有降级形态，宁可缺席也别摆个空壳
  const [papers, setPapers] = useState<PapersData | null>(() => cachedPapers());
  useEffect(() => {
    if (papers) return;
    let alive = true;
    loadPapers()
      .then((data) => {
        if (alive) setPapers(data);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [papers]);

  // 墙的范围口径：外层递进来的「够得着的题」。整卷都够不着的卷连行都不产出，
  // 于是锁定用户的墙上不会冒出 Mock 的卷名
  const reachSet = useMemo(() => new Set(reachable.map((entry) => entry.qid)), [reachable]);
  const wall = useMemo(
    () => (papers ? paperGroups(paperProgress(papers, reachSet, records)) : []),
    [papers, reachSet, records],
  );

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

      {/* 卷面进度墙。papers.json 没到位（还在取、或取失败）时整块不出现。
          一套卷一个小方格，颜色深浅＝这套卷已做题数的占比 */}
      {wall.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h3 className={styles.sectionTitle}>{t.progress.papersTitle}</h3>
            <span className={styles.sectionSub}>{t.progress.papersNote}</span>
          </div>

          {wall.map((group) => (
            <div key={group.db} className={styles.paperGroup}>
              <div className={styles.paperGroupName}>{dbLabel(group.db)}</div>
              <ul className={styles.paperWall} role="list">
                {group.papers.map((paper) => (
                  <li
                    key={paper.key}
                    className={`${styles.paperCell} ${
                      styles[`lv${paperLevel(paper.done, paper.total)}`]
                    }`}
                    // 缩写省掉的那截卷名、以及精确题数：悬停给 title，
                    // 键盘与触屏拿不到 title，同一句再给 aria-label ——
                    // 否则 Specimen 那格读屏只能听到光秃秃的「P1」
                    title={t.progress.paperCell(paper.label, paper.done, paper.total)}
                    aria-label={t.progress.paperCell(paper.label, paper.done, paper.total)}
                  >
                    <span className={styles.paperName}>{paperShort(paper.label, paper.db)}</span>
                    <span className={styles.paperCount}>
                      {paper.done}/{paper.total}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
