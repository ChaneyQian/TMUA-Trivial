'use client';

// 成绩页的逐题回顾导航（Design §26 P11-2）：成绩卡与逐题回顾卡之间的一块——
// 题号结果条（1…N，答对 / 答错 / 未答 + 本场标记）与「只看错题（含未答）」开关，下面接回顾卡本身。
//
// - 回顾卡仍由 ExamApp 画（children 是个函数：交给它「第 i 题现在显不显示」）；这里只管筛选状态与跳转。
// - 筛掉的卡用 hidden 收起而不卸载：切回来不用重排一遍公式，解析的展开状态也留着。
// - 点格子：滚到那张卡（减动效时瞬时），焦点落到卡片标题上（标题 tabIndex={-1}，id 见 reviewAnchorId）。
// - 「只看错题」开着时答对的格子仍留在条上（整卷对错的分布看得见），淡下去、禁用——它的卡已经收起来了。
//   不做「点了自动关筛选」：隐式改开关状态，按钮上写的和页面上显示的就对不上了。
// - 切开关不丢焦点（就是这颗按钮自己）；卡片收起后列表至少一屏高，页面不会短到滚动位置被往回夹。

import { useId, useState, type ReactNode } from 'react';
import {
  VERDICT_MARK,
  canFilterMissed,
  isReviewShown,
  reviewAnchorId,
  reviewCellLabel,
  reviewTally,
  type ReviewCell,
} from '@/lib/resultReview';
import styles from './Result.module.css';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

const CELL_CLASS = {
  right: styles.cell,
  wrong: `${styles.cell} ${styles.cellWrong}`,
  blank: `${styles.cell} ${styles.cellBlank}`,
} as const;

/** 滚到第 index 题的回顾卡并把焦点交给它的标题 */
function jumpTo(index: number) {
  const target = document.getElementById(reviewAnchorId(index));
  if (!target) return;
  const reduced = typeof window.matchMedia === 'function' && window.matchMedia(REDUCED_MOTION).matches;
  // 先给焦点（不让 focus 自己瞬移），再按偏好平滑或瞬时滚过去
  target.focus({ preventScroll: true });
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
}

export default function ReviewSection({
  cells,
  children,
}: {
  cells: readonly ReviewCell[];
  /** 逐题回顾卡；shown(i) 是第 i 题的卡现在该不该显示 */
  children: (shown: (index: number) => boolean) => ReactNode;
}) {
  const [wrongOnly, setWrongOnly] = useState(false);
  const titleId = useId();
  const tally = reviewTally(cells);
  const filterable = canFilterMissed(cells);
  // 全对时开关禁用，筛选也就不存在
  const filtering = wrongOnly && filterable;
  const shown = (index: number) => isReviewShown(cells[index], filtering);

  return (
    <>
      <section className={styles.nav} aria-labelledby={titleId}>
        <div className={styles.navHead}>
          <h2 id={titleId} className={styles.navTitle}>
            逐题回顾
          </h2>
          <p className={styles.navTally}>
            <span aria-hidden="true">{VERDICT_MARK.right}</span> 答对 {tally.right} ·{' '}
            <span aria-hidden="true">{VERDICT_MARK.wrong}</span> 答错 {tally.wrong} ·{' '}
            <span aria-hidden="true">{VERDICT_MARK.blank}</span> 未答 {tally.blank}
            {tally.flagged > 0 && ` · 标记 ${tally.flagged}`}
          </p>
          <button
            type="button"
            className={styles.filter}
            aria-pressed={filtering}
            disabled={!filterable}
            onClick={() => setWrongOnly((on) => !on)}
          >
            <span className={styles.switch} aria-hidden="true">
              <span className={styles.knob} />
            </span>
            {filterable ? '只看错题（含未答）' : '全部答对'}
          </button>
        </div>
        <ol className={styles.cells}>
          {cells.map((cell) => (
            <li key={cell.index}>
              <button
                type="button"
                className={CELL_CLASS[cell.verdict]}
                aria-label={reviewCellLabel(cell)}
                disabled={!shown(cell.index)}
                onClick={() => jumpTo(cell.index)}
              >
                <span className={styles.cellMark} aria-hidden="true">
                  {VERDICT_MARK[cell.verdict]}
                </span>
                <span className={styles.cellNum} aria-hidden="true">
                  {cell.index + 1}
                </span>
                {cell.flagged && <span className={styles.cellFlag} aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ol>
      </section>
      <div className={filtering ? `${styles.list} ${styles.listFiltered}` : styles.list}>{children(shown)}</div>
    </>
  );
}
