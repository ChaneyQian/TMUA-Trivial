'use client';

// 做题记录与错题统计。
//
// 存在浏览器 localStorage 里：本站是纯静态托管（GitHub Pages 只发文件、
// 收不到也存不了数据），所以记录只留在用户自己这台设备上，不会上传到任何地方。
// 跨设备同步见 README 的说明。

import type { IndexEntry, ExamDb } from './exam';

const KEY = 'mcq-test:records:v1';
/** 会话日志上限，防止长期使用后无限膨胀 */
const MAX_SESSIONS = 200;

/** 单题统计：做过几次 / 错过几次 / 最后一次时间与对错 */
export interface QuestionStat {
  a: number; // attempts
  w: number; // wrong
  t: number; // last timestamp (ms)
  c: 0 | 1;  // last correct
}

/** 一次考试的汇总 */
export interface SessionRecord {
  ts: number;
  db: string;
  mode: 'practice' | 'mock';
  n: number;        // 题数
  right: number;    // 答对
  answered: number; // 作答数
  sec: number;      // 用时
}

export interface Records {
  v: 1;
  q: Record<string, QuestionStat>;
  s: SessionRecord[];
}

const EMPTY: Records = { v: 1, q: {}, s: [] };

export function loadRecords(): Records {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    if (parsed?.v !== 1 || typeof parsed.q !== 'object') return EMPTY;
    return { v: 1, q: parsed.q || {}, s: Array.isArray(parsed.s) ? parsed.s : [] };
  } catch {
    return EMPTY;
  }
}

function save(r: Records): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(r));
  } catch {
    // 隐私模式或配额满：静默降级，不影响做题
  }
}

/** 记录一次考试：逐题累计，再写一条会话汇总。只统计真正作答过的题。 */
export function recordSession(
  results: { qid: number; correct: boolean; answered: boolean }[],
  session: Omit<SessionRecord, 'ts'>
): Records {
  const r = loadRecords();
  const now = Date.now();
  for (const item of results) {
    if (!item.answered) continue; // 未作答不计入错题频次，否则会把「没来得及做」算成「不会做」
    const k = String(item.qid);
    const cur = r.q[k] || { a: 0, w: 0, t: 0, c: 1 as 0 | 1 };
    r.q[k] = {
      a: cur.a + 1,
      w: cur.w + (item.correct ? 0 : 1),
      t: now,
      c: item.correct ? 1 : 0,
    };
  }
  r.s.unshift({ ts: now, ...session });
  if (r.s.length > MAX_SESSIONS) r.s.length = MAX_SESSIONS;
  save(r);
  return r;
}

export function clearRecords(): Records {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  return EMPTY;
}

// ---------------- 统计 ----------------

export interface Overview {
  seen: number;      // 做过的不同题数
  attempts: number;  // 总作答次数
  wrong: number;     // 总错误次数
  wrongNow: number;  // 当前仍处于「最后一次做错」状态的题数
  sessions: number;
}

export function overview(r: Records): Overview {
  let attempts = 0;
  let wrong = 0;
  let wrongNow = 0;
  const keys = Object.keys(r.q);
  for (const k of keys) {
    const s = r.q[k];
    attempts += s.a;
    wrong += s.w;
    if (s.c === 0) wrongNow++;
  }
  return { seen: keys.length, attempts, wrong, wrongNow, sessions: r.s.length };
}

/** 错题频次排行：错得最多的排前面，同分则最近做的排前面 */
export function wrongRanking(r: Records, limit = 10): { qid: number; stat: QuestionStat }[] {
  return Object.entries(r.q)
    .filter(([, s]) => s.w > 0)
    .map(([k, s]) => ({ qid: Number(k), stat: s }))
    .sort((x, y) => y.stat.w - x.stat.w || y.stat.t - x.stat.t)
    .slice(0, limit);
}

// ---------------- 抽题策略 ----------------

export interface PickOptions {
  /** 只从没做过的题里抽 */
  excludeSeen: boolean;
  /** 优先补入做错过的题 */
  mixWrong: boolean;
}

/** 混入错题时，错题最多占整卷的比例 */
const WRONG_SHARE = 1 / 3;

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 按设置挑出本次要考的 qid。
 *
 * 两个选项同时开启时的语义：以没做过的新题为主，再用做错过的题补足（最多 1/3）。
 * 「排除已做过」本身会把错题也排除掉，但既然用户明确要求混入错题，
 * 就把错题当成例外放回来——否则两个选项一起勾等于第二个失效。
 */
export function pickQids(
  index: IndexEntry[],
  db: ExamDb,
  count: number,
  opts: PickOptions,
  r: Records
): number[] {
  const inDb = index.filter((e) => db === 'ALL' || e.db === db);

  const isSeen = (qid: number) => r.q[String(qid)] !== undefined;
  const isWrongNow = (qid: number) => r.q[String(qid)]?.c === 0;

  let wrongPool: number[] = [];
  if (opts.mixWrong) {
    wrongPool = shuffle(inDb.filter((e) => isWrongNow(e.qid)).map((e) => e.qid));
  }

  const basePool = shuffle(
    inDb
      .filter((e) => (opts.excludeSeen ? !isSeen(e.qid) : true))
      .map((e) => e.qid)
  );

  const picked: number[] = [];
  const take = (list: number[], n: number) => {
    for (const qid of list) {
      if (picked.length >= count || n <= 0) break;
      if (picked.includes(qid)) continue;
      picked.push(qid);
      n--;
    }
  };

  if (opts.mixWrong) take(wrongPool, Math.ceil(count * WRONG_SHARE));
  take(basePool, count - picked.length);
  // 新题不够时，用剩下的错题补满，再不够就放开限制
  if (picked.length < count && opts.mixWrong) take(wrongPool, count - picked.length);
  if (picked.length < count && opts.excludeSeen) {
    take(shuffle(inDb.map((e) => e.qid)), count - picked.length);
  }

  return shuffle(picked);
}

/** 设置页用：当前条件下还剩多少题可抽 */
export function availableCount(index: IndexEntry[], db: ExamDb, opts: PickOptions, r: Records): number {
  const inDb = index.filter((e) => db === 'ALL' || e.db === db);
  if (!opts.excludeSeen) return inDb.length;
  const fresh = inDb.filter((e) => r.q[String(e.qid)] === undefined).length;
  if (!opts.mixWrong) return fresh;
  return fresh + inDb.filter((e) => r.q[String(e.qid)]?.c === 0).length;
}

// ---------------- 导出 / 导入 ----------------

export function exportRecords(r: Records): string {
  return JSON.stringify(r, null, 2);
}

/** 导入并与现有记录合并；返回合并后的结果，格式不对则抛错 */
export function importRecords(text: string): Records {
  const incoming = JSON.parse(text);
  if (incoming?.v !== 1 || typeof incoming.q !== 'object') {
    throw new Error('文件格式不对，应为本站导出的记录 JSON');
  }
  const cur = loadRecords();
  const merged: Records = { v: 1, q: { ...cur.q }, s: [...cur.s] };
  for (const [k, raw] of Object.entries(incoming.q as Record<string, QuestionStat>)) {
    const s = raw;
    const old = merged.q[k];
    merged.q[k] = old
      ? { a: old.a + s.a, w: old.w + s.w, t: Math.max(old.t, s.t), c: s.t >= old.t ? s.c : old.c }
      : s;
  }
  const seenTs = new Set(merged.s.map((x) => x.ts));
  for (const s of (incoming.s || []) as SessionRecord[]) {
    if (!seenTs.has(s.ts)) merged.s.push(s);
  }
  merged.s.sort((a, b) => b.ts - a.ts);
  if (merged.s.length > MAX_SESSIONS) merged.s.length = MAX_SESSIONS;
  save(merged);
  return merged;
}
