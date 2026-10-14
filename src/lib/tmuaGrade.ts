// TMUA 估分：本场做对题数 → 1.0–9.0 的成绩（成绩页「TMUA 估分」那一行的唯一来源，Design §24）。
//
// 用户 2026-10-14：「补一下20题的分数规则（2025版）」。TMUA 正式成绩是两卷合计 40 分
// （每卷 20 题、一题一分），再按当年的换算表折成 1.0–9.0。换算表每年随考生表现重定，
// 同一原始分在表上常常是一个区间——照原样保留区间，不取中点、不四舍五入。
//
// 口径（主控定）：
//   - 本场 20 题＝一卷的量：做对题数 ×2 折算到 40 分制再查表。等于假设另一卷发挥一样，所以只是估计；
//   - 本场 40 题＝两卷的量：直接查表；
//   - 其它题数一律不估（返回 null），不外推、不按比例缩放。
//   成绩页还要再看本场的题是不是全来自 TMUA / TMUA Mock、是不是「重练这些」场次——见 resultTmuaEstimate。
//
// 换年份表：在 TMUA_GRADE_TABLES 里加一年（41 档，0–40 各一档，单值档写 lo === hi），
// 再把 TMUA_GRADE_YEAR 指过去；成绩页的小字会跟着显示新的年份。
// tests/tmua-grade.test.mjs 校验档数、lo ≤ hi、单调不降，并逐档对照用户给的原表。
//
// 纯函数、零依赖：node --test 直接测。

/** 换算表的一档 */
export interface TmuaGradeBand {
  /** 40 分制的原始分 */
  raw: number;
  /** 成绩区间的下端与上端；单值档 lo === hi */
  lo: number;
  hi: number;
}

/** 2025 年换算表（用户给定）。从 40 分往下，逐行照原表抄 */
const TABLE_2025: readonly TmuaGradeBand[] = [
  { raw: 40, lo: 9.0, hi: 9.0 },
  { raw: 39, lo: 9.0, hi: 9.0 },
  { raw: 38, lo: 9.0, hi: 9.0 },
  { raw: 37, lo: 8.9, hi: 8.9 },
  { raw: 36, lo: 8.7, hi: 8.7 },
  { raw: 35, lo: 8.5, hi: 8.6 },
  { raw: 34, lo: 8.1, hi: 8.3 },
  { raw: 33, lo: 7.6, hi: 7.8 },
  { raw: 32, lo: 7.3, hi: 7.5 },
  { raw: 31, lo: 6.9, hi: 7.1 },
  { raw: 30, lo: 6.6, hi: 6.7 },
  { raw: 29, lo: 6.3, hi: 6.4 },
  { raw: 28, lo: 6.0, hi: 6.1 },
  { raw: 27, lo: 5.9, hi: 6.0 },
  { raw: 26, lo: 5.8, hi: 5.8 },
  { raw: 25, lo: 5.6, hi: 5.7 },
  { raw: 24, lo: 5.4, hi: 5.5 },
  { raw: 23, lo: 5.2, hi: 5.3 },
  { raw: 22, lo: 4.9, hi: 5.1 },
  { raw: 21, lo: 4.5, hi: 4.7 },
  { raw: 20, lo: 3.8, hi: 4.1 },
  { raw: 19, lo: 3.6, hi: 3.8 },
  { raw: 18, lo: 3.3, hi: 3.5 },
  { raw: 17, lo: 3.0, hi: 3.2 },
  { raw: 16, lo: 2.8, hi: 3.0 },
  { raw: 15, lo: 2.5, hi: 2.7 },
  { raw: 14, lo: 2.2, hi: 2.4 },
  { raw: 13, lo: 2.0, hi: 2.2 },
  { raw: 12, lo: 2.0, hi: 2.2 },
  { raw: 11, lo: 1.8, hi: 1.8 },
  { raw: 10, lo: 1.7, hi: 1.7 },
  { raw: 9, lo: 1.5, hi: 1.5 },
  { raw: 8, lo: 1.4, hi: 1.4 },
  { raw: 7, lo: 1.3, hi: 1.3 },
  { raw: 6, lo: 1.2, hi: 1.2 },
  { raw: 5, lo: 1.0, hi: 1.0 },
  { raw: 4, lo: 1.0, hi: 1.0 },
  { raw: 3, lo: 1.0, hi: 1.0 },
  { raw: 2, lo: 1.0, hi: 1.0 },
  { raw: 1, lo: 1.0, hi: 1.0 },
  { raw: 0, lo: 1.0, hi: 1.0 },
];

/** 按年份组织的换算表。换年份：加一年，再改 TMUA_GRADE_YEAR */
export const TMUA_GRADE_TABLES: Readonly<Record<number, readonly TmuaGradeBand[]>> = {
  2025: TABLE_2025,
};

/** 成绩页现在用哪一年的表 */
export const TMUA_GRADE_YEAR = 2025;

/** 一卷的题数（一题一分） */
export const TMUA_PAPER_QUESTIONS = 20;
/** 正式成绩的满分：两卷合计 */
export const TMUA_FULL_MARKS = 40;

/** 一次估分的结果 */
export interface TmuaEstimate {
  /** 用的是哪一年的换算表 */
  year: number;
  /** 折算到 40 分制之后的原始分 */
  raw: number;
  lo: number;
  hi: number;
  /** true：本场 20 题，raw 是做对题数 ×2 折算来的；false：本场 40 题，直接查的表 */
  scaled: boolean;
}

/**
 * 做对 right 道、本场共 total 道 → 估分；不估时返回 null。
 * 只认 20 题（×2 折算）与 40 题（直接查）；right 不是 0…total 之间的整数、或没有那一年的表，也不估——
 * 宁可不显示，也不编一个分出来
 */
export function estimateTmuaGrade(
  right: number,
  total: number,
  year: number = TMUA_GRADE_YEAR,
): TmuaEstimate | null {
  if (total !== TMUA_PAPER_QUESTIONS && total !== TMUA_FULL_MARKS) return null;
  if (!Number.isInteger(right) || right < 0 || right > total) return null;
  const table = TMUA_GRADE_TABLES[year];
  if (!table) return null;
  const scaled = total === TMUA_PAPER_QUESTIONS;
  const raw = scaled ? right * 2 : right;
  const band = table.find((b) => b.raw === raw);
  if (!band) return null;
  return { year, raw, lo: band.lo, hi: band.hi, scaled };
}

/** 区间连接号：en dash（U+2013），不是连字符 */
const EN_DASH = '–';

/** 显示格式：始终一位小数；单值 `8.7`，区间 `8.1–8.3` */
export function formatTmuaGrade({ lo, hi }: { lo: number; hi: number }): string {
  return lo === hi ? lo.toFixed(1) : `${lo.toFixed(1)}${EN_DASH}${hi.toFixed(1)}`;
}

/**
 * TMUA 族的库名。题目 JSON 的 database 字段由 scripts/build-data.mjs 的 indexDatabase 写：
 * 真题是 'TMUA'，题库源里的顶层库「TMUA Mock」落进来叫 'TMUA_MOCK'。
 * 带空格的 'TMUA Mock' 是源目录名，现在不会出现在题目 JSON 里；一并认下，
 * 免得哪天构建脚本改了写法，估分悄无声息地从成绩页上消失（测试拿真实产物钉着现在的写法）
 */
const TMUA_FAMILY: ReadonlySet<string> = new Set(['TMUA', 'TMUA_MOCK', 'TMUA Mock']);

/**
 * 本场每一道题都来自 TMUA 或 TMUA Mock。逐题看题目自己的库名，不看选区上的 db：
 * 选「混合」时一场里可能有 MAT / SMC 等，掺进一道就不算。空场次不算
 */
export function isTmuaFamily(questions: readonly { database: string }[]): boolean {
  return questions.length > 0 && questions.every((q) => TMUA_FAMILY.has(q.database));
}

/**
 * 成绩页要不要显示估分、显示什么——显示条件全在这里，组件只管把本场的东西交进来：
 *   - 「重练这些」进来的场次（origin === 'retry'）不估：重练的是错题，估分没有意义；
 *   - 本场不全是 TMUA 族不估；
 *   - 题数不是 20 / 40 不估（estimateTmuaGrade 的口径）。
 * Mock 与练习模式一视同仁。7.5+ Diagnostic 有自己的成绩页，不走这里
 */
export function resultTmuaEstimate({
  questions,
  right,
  origin,
}: {
  questions: readonly { database: string }[];
  right: number;
  /** 本场从复烤区哪一块开出来的（ExamApp 的 GrillOrigin）；不是复烤区来的为 null */
  origin: string | null;
}): TmuaEstimate | null {
  if (origin === 'retry') return null;
  if (!isTmuaFamily(questions)) return null;
  return estimateTmuaGrade(right, questions.length);
}
