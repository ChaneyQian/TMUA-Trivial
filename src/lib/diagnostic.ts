'use client';

// Diagnostic Test 的规则常量与纯计算。
//
// 结构是仿 TMUA 的两卷制：Paper 1（Problem Solving 20 题）→ 中场休息 →
// Paper 2（Data Sufficiency 20 题），全场 40 题。卷是**固定**的，零随机：
// 卷内顺序就是难度升序，两次机会各用一套互不重题的卷（定义见 public/exam/diag.json）。

// 显式带扩展名：测试用 node --experimental-strip-types 直接跑这个模块，
// ESM 解析器不会替你补 .ts（records.ts 里的 './i18n.ts' 同理）
import { EXAM_DATA } from './config.ts';
import type { IndexEntry } from './exam';

/** 每卷题数 */
export const DIAGNOSTIC_PAPER_SIZE = 20;
/** 一场诊断的总题数（两卷） */
export const DIAGNOSTIC_TOTAL = DIAGNOSTIC_PAPER_SIZE * 2;
/** 每题基础时长（秒）。银行滚存只在卷内有效，Paper 2 开场清零 */
export const DIAGNOSTIC_BASE_SECONDS = 120;
/** 正确率达到这个比例即 Pass */
export const DIAGNOSTIC_PASS_RATIO = 0.9;
/** 一共只有两次机会，用完就只剩 365 题那条路 */
export const DIAGNOSTIC_MAX_ATTEMPTS = 2;
/** 剩余秒数低到这个数，倒计时转成警示色 */
export const DIAGNOSTIC_WARN_SECONDS = 30;
/** 倒计时刷新间隔。比 1s 密是为了让归零那一刻的自动确认不迟到 */
export const DIAGNOSTIC_TICK_MS = 250;

/** 通过需要答对多少题 */
export function passMark(total = DIAGNOSTIC_TOTAL): number {
  return Math.ceil(total * DIAGNOSTIC_PASS_RATIO);
}

/**
 * 按截止时间戳算剩余秒数。
 * 绝不能改成「每 tick 减一」：后台标签页被浏览器限流后 setInterval 会被拉长甚至冻住，
 * 那样 Alt-Tab 就是一个免费暂停键，而且冻住的 left 还会被 bankAfter 原样滚进时间银行——
 * 切出去越久，攒到的时间越多。压力测试的立身之本就在这一条。
 */
export function remainingSeconds(deadline: number, now: number = Date.now()): number {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}

/**
 * 当题可用秒数 = 基础时长 + 银行余额。
 * 提前确认省下的时间滚存进银行，下一题就能多用这么久。
 */
export function budgetFor(bank: number): number {
  return DIAGNOSTIC_BASE_SECONDS + Math.max(0, Math.floor(bank));
}

/** 开一道新题：从此刻起算 budgetFor(bank) 秒 */
export function deadlineFrom(bank: number, now: number = Date.now()): number {
  return now + budgetFor(bank) * 1000;
}

/**
 * 确认当题后银行的新余额 = 当题剩下的秒数。
 * 归零自动跳题时 left 是 0，银行自然清空——拖满时间的人不该攒到时间。
 */
export function bankAfter(left: number): number {
  return Math.max(0, Math.floor(left));
}

/** 正确率 ≥ 90% 即通过。一道都没有的场次不算通过 */
export function isPass(right: number, total: number): boolean {
  return total > 0 && right >= passMark(total);
}

/**
 * 允许答错几题还能过。
 * 不写成 total * (1 - RATIO)：0.1 在二进制里是无限小数，会算出差一的结果。
 */
export function allowedMisses(total = DIAGNOSTIC_TOTAL): number {
  return Math.max(0, total - passMark(total));
}

// ---- 机会 ----

export interface DiagnosticProgress {
  passed?: boolean;
  attempts?: number;
}

/** 还剩几次机会 */
export function attemptsLeft(diag?: DiagnosticProgress): number {
  return Math.max(0, DIAGNOSTIC_MAX_ATTEMPTS - (diag?.attempts || 0));
}

/** 还能不能考。通过之后就不必再考了 */
export function canAttempt(diag?: DiagnosticProgress): boolean {
  if (diag?.passed) return false;
  return attemptsLeft(diag) > 0;
}

/**
 * 这一次该用第几套卷（0 起）。第 1 次机会用套一，第 2 次用套二。
 * 机会用尽（或已通过）返回 -1 让调用方硬失败——此前的 Math.min 静默降级
 * 会在越界时安静地重发套二，把「仅两次机会」这条最重的规则架空。
 */
export function setIndexForAttempt(diag?: DiagnosticProgress): number {
  if (!canAttempt(diag)) return -1;
  return diag?.attempts || 0;
}

// ---- 固定卷 ----

export interface DiagnosticSet {
  /** Paper 1（Problem Solving）的 qid，难度升序 */
  p1: number[];
  /** Paper 2（Data Sufficiency）的 qid，难度升序 */
  p2: number[];
}

export interface DiagnosticSets {
  sets: DiagnosticSet[];
}

/** 固定卷定义。只在真的要进 Diagnostic 时才取，不占冷启动 */
export async function fetchDiagnosticSets(): Promise<DiagnosticSets> {
  const res = await fetch(`${EXAM_DATA}/diag.json`);
  if (!res.ok) throw new Error(`diag.json ${res.status}`);
  return res.json();
}

/** 诊断题在索引里的那一池，仅用于「数据是否就绪」的兜底判断 */
export function diagnosticPool(index: IndexEntry[] | null): IndexEntry[] {
  return (index || []).filter((entry) => entry.diag);
}

/** 倒计时显示。诊断里可用时间不会超过一小时，m:ss 够用 */
export function fmtCountdown(totalSec: number): string {
  const safe = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
