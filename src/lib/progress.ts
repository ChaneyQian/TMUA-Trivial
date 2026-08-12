'use client';

// 进度面板的纯计算。放在这里而不是组件里，是为了让「算什么」和「怎么画」分开：
// 折线的取点、口径、诊断题过滤都不该藏在 JSX 里。

import type { IndexEntry } from './exam';
import type { Records, SessionRecord } from './records';

/** 折线最多画多少场 */
export const TREND_LIMIT = 30;
/** 错题榜最多列多少条 */
export const MISSED_LIMIT = 10;

/**
 * 练习池的 qid 集合。diag（GMAT 诊断集）永远排除——那批题按设计全程不显示对错，
 * 一旦漏进错题榜或「重练这些」，就等于把诊断答案泄出去了。
 */
export function practiceQids(index: IndexEntry[] | null): Set<number> {
  const out = new Set<number>();
  for (const entry of index || []) if (!entry.diag) out.add(entry.qid);
  return out;
}

export interface PracticeOverview {
  seen: number;
  attempts: number;
  wrongNow: number;
  /** 已作答题目的累计正确率（0–1），attempts 为 0 时是 0 */
  accuracy: number;
}

/**
 * 只统计练习池的概览。records.overview() 一视同仁地数所有 qid，
 * 但诊断题的对错是永不示人的——统计条说「14 道当前错题」、错题榜只列得出 12 条，
 * 用户会以为榜坏了。两边必须用同一个池子。
 */
export function practiceOverview(records: Records, pool: Set<number>): PracticeOverview {
  let seen = 0;
  let attempts = 0;
  let wrong = 0;
  let wrongNow = 0;
  for (const [qid, stat] of Object.entries(records.q)) {
    if (!pool.has(Number(qid))) continue;
    seen++;
    attempts += stat.a;
    wrong += stat.w;
    if (stat.c === 0) wrongNow++;
  }
  return {
    seen,
    attempts,
    wrongNow,
    accuracy: attempts > 0 ? (attempts - wrong) / attempts : 0,
  };
}

export interface TrendPoint {
  session: SessionRecord;
  /** 0–1；n 为 0 时按 0 记，不产生 NaN */
  accuracy: number;
  /** 每题平均秒数 */
  pace: number;
}

/**
 * records.s 是新场次在前（addSession 用 unshift 语义），画图要按时间正序，
 * 所以先截最近 TREND_LIMIT 场再反转。
 */
export function trendPoints(records: Records, limit = TREND_LIMIT): TrendPoint[] {
  return records.s
    .slice(0, limit)
    .reverse()
    .map((session) => ({
      session,
      accuracy: session.n > 0 ? session.right / session.n : 0,
      pace: session.n > 0 ? session.sec / session.n : 0,
    }));
}

/** 某题在本场开始之前的历史；没做过返回 null */
export function historyFor(records: Records | null, qid: number): { a: number; w: number } | null {
  const stat = records?.q[String(qid)];
  return stat ? { a: stat.a, w: stat.w } : null;
}

export function fmtPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}

/** 轴标与详情行都用纯数字日期，中英通吃，不必进字典 */
export function fmtDate(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fmtClock(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = Math.round(totalSec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export interface ChartGeometry {
  width: number;
  height: number;
  x: (i: number) => number;
  /** 正确率折线的 y（0–1 → 像素） */
  lineY: (ratio: number) => number;
  /** 用时细柱的 y 起点与高度 */
  barTop: (ratio: number) => number;
  barBottom: number;
  band: number;
  lineTop: number;
  lineBottom: number;
}

/**
 * 折线在上、用时细柱在下，共用一个 viewBox。
 * 双 y 轴在 320px 宽下读不出来，所以第二条 series 降级成底部柱子。
 */
export function chartGeometry(count: number): ChartGeometry {
  const width = 320;
  const height = 140;
  const left = 14;
  const right = 306;
  const lineTop = 10;
  const lineBottom = 92;
  const barBottom = 132;
  const barTop0 = 104;
  const span = right - left;
  const step = count > 1 ? span / (count - 1) : 0;
  return {
    width,
    height,
    lineTop,
    lineBottom,
    barBottom,
    band: count > 1 ? step : span,
    x: (i) => (count > 1 ? left + i * step : left + span / 2),
    lineY: (ratio) => lineBottom - Math.max(0, Math.min(1, ratio)) * (lineBottom - lineTop),
    barTop: (ratio) => barBottom - Math.max(0, Math.min(1, ratio)) * (barBottom - barTop0),
  };
}
