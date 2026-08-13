'use client';

// Grill（复烤区）的组卷。
//
// 池子 = records.grill 里那批 qid ∩ 当前索引。求交是必须的：题库换代后
// 绑定集里可能留着已经不存在的 qid，直接拿去取题会 404 掉整场。
//
// 挑题本身一行新逻辑都不写——把绑定集做成一个「小索引」喂给既有的 pickQids，
// 三种抽题策略、错题优先的配比全部原样复用。

// 显式带扩展名：测试用 node --experimental-strip-types 直接跑这个模块，
// ESM 解析器不会替你补 .ts（records.ts 里的 './i18n.ts' 同理）
import type { IndexEntry } from './exam';
import {
  availableCount,
  optionsForPickMode,
  pickQids,
  type PickMode,
  type Records,
} from './records.ts';

/** 面板上的题数快捷档；实际上限是可用题数 */
export const GRILL_COUNT_CHOICES = [5, 10, 20];

/**
 * 绑定集在当前索引里还找得到的那些题，保持索引自身的顺序。
 * 诊断题的 answer/solution 在这里是公开的——事后把题烤明白正是 Grill 的分工。
 */
export function grillEntries(index: IndexEntry[] | null, records: Records): IndexEntry[] {
  const bound = new Set(records.grill || []);
  if (bound.size === 0) return [];
  return (index || []).filter((entry) => bound.has(entry.qid));
}

/** 绑定了多少题（含悬空的） */
export function boundCount(records: Records): number {
  return records.grill?.length || 0;
}

/** 题库里已经找不到、只能丢掉的绑定 qid 数量 */
export function danglingCount(index: IndexEntry[] | null, records: Records): number {
  if (!index) return 0;
  return Math.max(0, boundCount(records) - grillEntries(index, records).length);
}

/** 某个抽题策略下还能凑出多少题 */
export function grillAvailable(
  index: IndexEntry[] | null,
  records: Records,
  mode: PickMode,
): number {
  const entries = grillEntries(index, records);
  if (entries.length === 0) return 0;
  return availableCount(entries, 'ALL', optionsForPickMode(mode), records);
}

/** 按策略从绑定集里挑 count 道题 */
export function pickGrillQids(
  index: IndexEntry[] | null,
  records: Records,
  count: number,
  mode: PickMode,
): number[] {
  const entries = grillEntries(index, records);
  if (entries.length === 0) return [];
  return pickQids(entries, 'ALL', Math.max(1, count), optionsForPickMode(mode), records);
}

/** 题数档位：去掉超出可用量的档，末尾补一个「全部」 */
export function grillCountOptions(available: number): number[] {
  const usable = GRILL_COUNT_CHOICES.filter((n) => n < available);
  return available > 0 ? [...usable, available] : [];
}
