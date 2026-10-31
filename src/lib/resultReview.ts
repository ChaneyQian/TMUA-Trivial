// 成绩页的「揭晓」与逐题回顾导航（Design §26 P11）：组件只管画，算的都在这里。
//
//   - 大比分滚动计数：countUpValue（ease-out，到时长正好是终值）、shouldCountUp（什么时候干脆不滚）
//   - TMUA 估分刻度尺：1.0–9.0 上的刻度与估分色块的位置（百分比）、估分的读屏文本（「8.1 至 8.3」）
//   - 题号结果条：每题答对 / 答错 / 未答、有没有标记、读屏名、筛「只看错题」后谁还显示
//
// 纯函数、零依赖：node --test 直接测。

// ---------------------------------------------------------------------------
// 大比分滚动计数

/** 分子从 0 滚到终值的时长 */
export const COUNT_UP_MS = 600;

/** ease-out（三次）：前快后慢，t 夹在 0–1 */
export function easeOutCubic(t: number): number {
  const c = Number.isFinite(t) ? Math.min(1, Math.max(0, t)) : 1;
  return 1 - (1 - c) ** 3;
}

/**
 * 动画开始后 elapsedMs 毫秒时分子该显示几：0 起、ease-out、取整，单调不降；
 * 到 / 过了时长一律是终值。终值不是正整数（0 分、意外的 NaN）就直接是它本身——没什么可滚的
 */
export function countUpValue(target: number, elapsedMs: number, durationMs: number = COUNT_UP_MS): number {
  if (!Number.isInteger(target) || target <= 0) return target;
  if (!(durationMs > 0) || !(elapsedMs < durationMs)) return target;
  if (!(elapsedMs > 0)) return 0;
  return Math.min(target, Math.round(target * easeOutCubic(elapsedMs / durationMs)));
}

/**
 * 进成绩页时要不要滚：减动效、光效关、标签页在后台（rAF 不跑，等切回来再从 0 滚是在演旧戏）、
 * 终值是 0 或不是正整数，都直接显示终值
 */
export function shouldCountUp({
  target,
  reducedMotion,
  fx,
  hidden,
}: {
  target: number;
  reducedMotion: boolean;
  fx: 'on' | 'off';
  hidden: boolean;
}): boolean {
  return Number.isInteger(target) && target > 0 && !reducedMotion && fx !== 'off' && !hidden;
}

/** 计数驱动要用到的几样宿主能力：组件里接 window / document，测试里接假的 */
export interface CountUpHost {
  requestFrame: (cb: (now: number) => void) => number;
  cancelFrame: (id: number) => void;
  setTimer: (cb: () => void, ms: number) => number;
  clearTimer: (id: number) => void;
  /** 「立刻收尾」的信号（标签页切到后台、中途关了光效）；返回退订函数 */
  onInterrupt: (cb: () => void) => () => void;
}

/** 兜底定时器比时长多等的那一点：正常情况下帧早就收尾了，它只管 rAF 被冻住的时候 */
export const COUNT_UP_GRACE_MS = 250;

/**
 * 跑一次滚动计数：每帧 onValue(此刻的值)，最后一定 onValue(target) 收尾一次——
 * 帧走满时长、兜底定时器到点、收到中断信号，三者谁先到谁收尾，之后再不报值。
 * 时间从第一帧算起（不是从调用时）：第一帧之前主线程忙着排公式，也不会一上来就跳过半程。
 * 返回 stop（卸载时调）：停掉帧、定时器与监听，不再报值、也不补终值（组件都没了）
 */
export function startCountUp(
  target: number,
  onValue: (value: number) => void,
  host: CountUpHost,
  durationMs: number = COUNT_UP_MS,
): () => void {
  let start: number | null = null;
  let frame = 0;
  let timer = 0;
  let unsubscribe = () => {};
  let over = false;
  const teardown = () => {
    over = true;
    host.cancelFrame(frame);
    host.clearTimer(timer);
    unsubscribe();
  };
  const finish = () => {
    if (over) return;
    teardown();
    onValue(target);
  };
  const step = (now: number) => {
    if (over) return;
    if (start === null) start = now;
    const elapsed = now - start;
    if (elapsed >= durationMs) {
      finish();
      return;
    }
    onValue(countUpValue(target, elapsed, durationMs));
    frame = host.requestFrame(step);
  };
  frame = host.requestFrame(step);
  timer = host.setTimer(finish, durationMs + COUNT_UP_GRACE_MS);
  unsubscribe = host.onInterrupt(finish);
  // 宿主同步就收了尾（假宿主里可能）：刚挂上的监听也得摘掉
  if (over) unsubscribe();
  return () => {
    if (!over) teardown();
  };
}

// ---------------------------------------------------------------------------
// TMUA 估分刻度尺

/** 刻度尺的两端：TMUA 成绩的全量程 */
export const RULER_MIN = 1;
export const RULER_MAX = 9;

/**
 * 估分色块的最小宽度（占全尺的百分比）。单值档（8.7、9.0……）lo === hi，照实画是零宽；
 * 区间档最窄的是 0.1 分＝1.25%，比它再窄一点点也认得出。2% 在 320px 宽的手机上约 5px
 */
export const RULER_MIN_BAND_PCT = 2;

/** 成绩在尺上的位置（0–100，夹在两端之内） */
export function rulerPercent(value: number, min: number = RULER_MIN, max: number = RULER_MAX): number {
  if (!Number.isFinite(value) || !(max > min)) return 0;
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

/** 整数刻度 1…9，各自的位置 */
export function rulerTicks(min: number = RULER_MIN, max: number = RULER_MAX): { value: number; pct: number }[] {
  const out: { value: number; pct: number }[] = [];
  for (let v = Math.ceil(min); v <= max; v++) out.push({ value: v, pct: rulerPercent(v, min, max) });
  return out;
}

/**
 * 估分色块：{ left, width }（百分比）。区间照实画；比最小宽度窄的（含单值档）以区间中点为中心撑到最小宽度，
 * 碰到尺的两端就往里挪，整块始终落在 0–100 之内
 */
export function rulerBand(
  lo: number,
  hi: number,
  { min = RULER_MIN, max = RULER_MAX, minWidth = RULER_MIN_BAND_PCT }: { min?: number; max?: number; minWidth?: number } = {},
): { left: number; width: number } {
  const [a, b] = [rulerPercent(Math.min(lo, hi), min, max), rulerPercent(Math.max(lo, hi), min, max)];
  if (b - a >= minWidth) return { left: a, width: b - a };
  const width = Math.min(100, minWidth);
  const left = Math.min(100 - width, Math.max(0, (a + b) / 2 - width / 2));
  return { left, width };
}

/**
 * 入场「从尺的左端扫出来」那一层的几何：扫出层从 0 铺到色块右缘（width，百分比），
 * 色块在扫出层里的左缘（bandLeft，占扫出层的百分比）。扫出层整体 scaleX 0 → 1、原点在左，
 * 色块就从尺的左端一路长到它的位置；停下来之后与直接画 rulerBand 一模一样
 */
export function rulerSweep(band: { left: number; width: number }): { width: number; bandLeft: number } {
  const width = band.left + band.width;
  return { width, bandLeft: width > 0 ? (band.left / width) * 100 : 0 };
}

/**
 * 估分的读屏文本：区间用「至」连起来（en dash 会被念成「短横」），单值就是那个数。
 * 视觉上仍用 formatTmuaGrade 的 `8.1–8.3`
 */
export function speakTmuaGrade({ lo, hi }: { lo: number; hi: number }): string {
  return lo === hi ? lo.toFixed(1) : `${lo.toFixed(1)} 至 ${hi.toFixed(1)}`;
}

// ---------------------------------------------------------------------------
// 题号结果条与「只看错题」

/** 一题的结局：答对 / 答错 / 未答（未答按 TMUA 口径也是错，但在条上单列，一眼看得出是没做还是做错） */
export type ReviewVerdict = 'right' | 'wrong' | 'blank';

export interface ReviewCell {
  /** 本场里的下标（0 起）；题号是 index + 1 */
  index: number;
  verdict: ReviewVerdict;
  /** 本场答题时标记过（🚩） */
  flagged: boolean;
}

/** 选了什么、正确答案是什么 → 结局。标号不分大小写（MAT 体例是小写），与 ExamApp 的 sameLabel 同一口径 */
export function reviewVerdict(selected: string | null | undefined, answer: string): ReviewVerdict {
  if (!selected) return 'blank';
  return selected.toLowerCase() === answer.toLowerCase() ? 'right' : 'wrong';
}

/** 本场每一题一格：题、作答、标记三张表按下标对齐（作答 / 标记缺了的按未答 / 未标记） */
export function reviewCells(
  questions: readonly { answer: string }[],
  answers: readonly (string | null | undefined)[],
  flagged: readonly (boolean | undefined)[],
): ReviewCell[] {
  return questions.map((q, index) => ({
    index,
    verdict: reviewVerdict(answers[index], q.answer),
    flagged: flagged[index] === true,
  }));
}

/** 结局的中文（读屏名、卡片标题后的隐藏说明共用） */
export const VERDICT_TEXT: Readonly<Record<ReviewVerdict, string>> = {
  right: '答对',
  wrong: '答错',
  blank: '未答',
};

/** 格子上的符号：不靠颜色也分得出三种结局 */
export const VERDICT_MARK: Readonly<Record<ReviewVerdict, string>> = {
  right: '✓',
  wrong: '✗',
  blank: '–',
};

/** 格子的读屏名：「第 3 题，答错，已标记」 */
export function reviewCellLabel(cell: ReviewCell): string {
  return `第 ${cell.index + 1} 题，${VERDICT_TEXT[cell.verdict]}${cell.flagged ? '，已标记' : ''}`;
}

/** 各结局的题数；missed＝答错 + 未答（「只看错题」筛出来的就是这些） */
export function reviewTally(cells: readonly ReviewCell[]): {
  right: number;
  wrong: number;
  blank: number;
  flagged: number;
  missed: number;
} {
  const count = (verdict: ReviewVerdict) => cells.filter((c) => c.verdict === verdict).length;
  const [right, wrong, blank] = [count('right'), count('wrong'), count('blank')];
  return { right, wrong, blank, flagged: cells.filter((c) => c.flagged).length, missed: wrong + blank };
}

/** 「只看错题」能不能开：一道没错（含没有题）就没什么可筛的 */
export function canFilterMissed(cells: readonly ReviewCell[]): boolean {
  return reviewTally(cells).missed > 0;
}

/** 这一题的回顾卡现在显不显示：没开筛选全显示；开了只显示答错与未答 */
export function isReviewShown(cell: ReviewCell | undefined, wrongOnly: boolean): boolean {
  if (!cell) return true;
  return !wrongOnly || cell.verdict !== 'right';
}

/** 回顾卡标题的 id（题号条跳转、焦点落点）。一页只有一个成绩页，按题号起名不会撞 */
export function reviewAnchorId(index: number): string {
  return `review-q-${index + 1}`;
}
