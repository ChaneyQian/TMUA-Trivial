// 成绩页 TMUA 估分的刻度尺（Design §26 P11-1）：1.0–9.0 一条横尺，整数刻度 1…9，色块标出本场估分区间。
//
// - 纯图形、aria-hidden：估分的文字（含读屏用的「8.1 至 8.3」）就在旁边，尺子不再念一遍。
// - 不标任何「录取线」「目标分」之类的主观阈值：尺上只有刻度和本场这一块。
// - 单值档（lo === hi）按最小宽度画，以那个值为中心；碰到两端往里挪（lib/resultReview 的 rulerBand）。
// - 色块进场时从尺的左端扫出一次（scaleX，约 450ms）；减动效 / 光效关下静态（Result.module.css）。

import { rulerBand, rulerSweep, rulerTicks } from '@/lib/resultReview';
import styles from './Result.module.css';

const TICKS = rulerTicks();

export default function TmuaRuler({ lo, hi }: { lo: number; hi: number }) {
  const sweep = rulerSweep(rulerBand(lo, hi));
  return (
    <div className={styles.ruler} aria-hidden="true">
      <div className={styles.rulerTrack}>
        {TICKS.map((tick) => (
          <span key={tick.value} className={styles.rulerTick} style={{ left: `${tick.pct}%` }} />
        ))}
        <span className={styles.rulerSweep} style={{ width: `${sweep.width}%` }}>
          <span className={styles.rulerBand} style={{ left: `${sweep.bandLeft}%` }} />
        </span>
      </div>
      <div className={styles.rulerLabels}>
        {TICKS.map((tick) => (
          <span key={tick.value} className={styles.rulerLabel} style={{ left: `${tick.pct}%` }}>
            {tick.value}
          </span>
        ))}
      </div>
    </div>
  );
}
