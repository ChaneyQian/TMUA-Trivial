// 限时节奏条：Mock 答题页倒计时下面那一条细进度条 + 一句「On pace / N min ahead / N min behind」
// （Design §27，P11）。这里是它的全部口径；组件（components/exam/PaceBar.tsx）只管画。
//
// 口径（用户确认；节奏公式经主控 2026-10-31 裁定：正在做的那一题享有完整预算）：
//   - 进度条＝时间已用比例：已用秒数 / 总秒数，夹在 0–1；
//   - 每题预算＝总秒数 / 题数；挣到的时间 earned＝已作答题数 × 预算。分三段：
//       已用 ≤ earned                    → 领先 earned − 已用；
//       earned < 已用 ≤ earned + 预算     → 正好：当前这题还在它自己的预算里；
//       已用 > earned + 预算              → 落后 已用 −（earned + 预算）。
//     全部答完时没有「当前题」，落后按 earned 算（实际上 earned 已是总时长，落后不了，只为边界安全）。
//     为什么不直接用「earned − 已用」：那样节奏完全均匀的人每题做到一半就被提示落后，答完又跳回正好；
//   - |领先|、|落后| < 60 秒 →「节奏正好」；领先 ≥ 60 →「快 N 分钟」；落后 ≥ 60 →「慢 N 分钟」，N 向下取整；
//   - 最后 5 分钟（剩余 ≤ 300 秒，和倒计时那行的 timeWarn 同一条线）换警示色。
//     总时长本身 ≤ 5 分钟时从一开始就是警示色——同一条规则的自然结果，不另开例外。
//
// 输入不可信也不炸：非有限数按 0，负数夹到 0，剩余秒数超过总秒数按总秒数算（已用不会是负的），
// 已作答题数夹在 0–题数之间；题数或总秒数为 0 时没有节奏可言，一律「正好」、进度为 0。
// 只有 warn 看的是夹到 0 以上、但没被总秒数截过的剩余秒数：要和倒计时那行逐秒一致。
//
// 纯函数、零依赖：node --test 直接测（tests/pace.test.mjs）。

/** 「节奏正好」的半宽：领先或落后不到这么多秒都算正好 */
export const PACE_EVEN_SECONDS = 60;

/** 最后这么多秒换警示色（倒计时那行的 timeWarn 也读它） */
export const PACE_WARN_SECONDS = 300;

export type PaceBand = 'even' | 'ahead' | 'behind';

export interface PaceInput {
  /** 本场总时长（秒） */
  totalSec: number;
  /** 倒计时此刻的剩余秒数 */
  secondsLeft: number;
  /** 已作答（答案非空）的题数 */
  answered: number;
  /** 本场题数 */
  total: number;
}

export interface Pace {
  /** 时间已用比例，0–1 */
  elapsedRatio: number;
  /** 「节奏位置」刻度：已作答题数 × 预算 / 总时长 ＝ 已作答 / 题数，0–1 */
  paceRatio: number;
  /**
   * 领先秒数：领先为正；落后为负，且只算超出当前这题预算的部分；当前这题还在自己的预算里时为 0。
   * 可以带小数（预算不一定是整秒）
   */
  leadSec: number;
  band: PaceBand;
  /** 领先或落后的整分钟数（向下取整）；正好时为 0 */
  minutes: number;
  /** 最后 5 分钟 */
  warn: boolean;
}

const finite = (n: number): number => (Number.isFinite(n) ? n : 0);

/**
 * 三段式的领先秒数（调用方保证 count > 0、whole > 0、0 ≤ done ≤ count）。
 * 先乘后除：done × whole 是整数，除一次只舍入一次——写成 done × (whole / count) 时
 * 7 × (1980 / 7) 会算成 1979.999…，整分钟的边界就差一档。当前题的截止同理写成 (done + 1) × whole / count
 */
function lead(elapsed: number, done: number, count: number, whole: number): number {
  const earned = (done * whole) / count;
  if (elapsed <= earned) return earned - elapsed;
  // 全部答完就没有「当前题」：截止就是 earned 本身
  const due = done < count ? ((done + 1) * whole) / count : earned;
  return elapsed > due ? due - elapsed : 0;
}

export function pace({ totalSec, secondsLeft, answered, total }: PaceInput): Pace {
  const whole = Math.max(0, finite(totalSec));
  const left = Math.max(0, finite(secondsLeft));
  const count = Math.max(0, Math.floor(finite(total)));
  const done = Math.min(count, Math.max(0, Math.floor(finite(answered))));
  const elapsed = whole - Math.min(left, whole);

  const elapsedRatio = whole > 0 ? elapsed / whole : 0;
  const paceRatio = count > 0 ? done / count : 0;
  const leadSec = count > 0 && whole > 0 ? lead(elapsed, done, count, whole) : 0;
  const away = Math.abs(leadSec);
  const band: PaceBand = away < PACE_EVEN_SECONDS ? 'even' : leadSec > 0 ? 'ahead' : 'behind';

  return {
    elapsedRatio,
    paceRatio,
    leadSec,
    band,
    minutes: band === 'even' ? 0 : Math.floor(away / 60),
    warn: left <= PACE_WARN_SECONDS,
  };
}

/**
 * 节奏那句话。答题页顶栏（计时器、题号、Flag for Review）通篇英文、不随界面语言切换，
 * 这句跟着周围写英文：「On pace」「2 min ahead」「3 min behind」
 */
export function formatPace({ band, minutes }: Pick<Pace, 'band' | 'minutes'>): string {
  if (band === 'even') return 'On pace';
  return `${minutes} min ${band}`;
}
