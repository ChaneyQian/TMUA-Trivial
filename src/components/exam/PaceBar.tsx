// 限时节奏条（Design §27，P11）：只挂在 Mock 答题页顶栏的倒计时下面。
// 一条 4px 的细条画「时间已用比例」，上面一道淡色刻度画「按已答题数该用到哪儿」；
// 底下一句 On pace / N min ahead / N min behind。口径全在 lib/pace.ts，这里只管画。
//
// - 条和刻度纯图形、aria-hidden：剩余时间那行字已经在，节奏那句是普通文本，读屏按需读到；
//   不进 aria-live——数值每秒都在变，档位也随答题变化，播报只会吵（取舍见 §27）。
// - 填充走 transform: scaleX()，不改 width；过渡 1s linear，减动效 / 光效关时取消（见 CSS）。
// - 每秒跟着倒计时重渲染的只有这一小块；memo 住，答题页别处的重渲染（选项、标记）不连带它，
//   它自己也只做几次四则运算。
import { memo, type CSSProperties } from 'react';
import { formatPace, pace } from '@/lib/pace';
import styles from './PaceBar.module.css';

interface PaceBarProps {
  /** 本场总时长（秒）：开考时与截止时刻一起定死的那个数（ExamApp 的 examSec），不是渲染时的配置 */
  totalSec: number;
  secondsLeft: number;
  /** 本场每题的作答（非空即已作答）；长度就是题数 */
  answers: readonly (string | null)[];
}

function PaceBar({ totalSec, secondsLeft, answers }: PaceBarProps) {
  const answered = answers.filter(Boolean).length;
  const p = pace({ totalSec, secondsLeft, answered, total: answers.length });

  return (
    <div className={`${styles.pace} ${p.warn ? styles.warn : ''}`} data-band={p.band}>
      <div className={styles.track} aria-hidden="true">
        <div className={styles.rail}>
          <div className={styles.fill} style={{ transform: `scaleX(${p.elapsedRatio})` }} />
        </div>
        {p.paceRatio > 0 && (
          <div className={styles.mark} style={{ '--pace-at': p.paceRatio } as CSSProperties} />
        )}
      </div>
      <div className={styles.text}>{formatPace(p)}</div>
    </div>
  );
}

export default memo(PaceBar);
