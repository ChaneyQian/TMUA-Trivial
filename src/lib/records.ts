'use client';

import type { IndexEntry, ExamDb } from './exam';
import { s as strings } from './i18n.ts';

const KEY = 'mcq-test:records:v1';
const MAX_SESSIONS = 200;
const MAX_IMPORT_BYTES = 5 * 1024 * 1024;
export const HIDDEN_UNLOCK_COUNT = 365;

export interface QuestionStat {
  a: number;
  w: number;
  t: number;
  c: 0 | 1;
}

export interface SessionRecord {
  ts: number;
  db: string;
  mode: 'practice' | 'mock';
  n: number;
  right: number;
  answered: number;
  sec: number;
}

export interface Records {
  v: 1;
  q: Record<string, QuestionStat>;
  s: SessionRecord[];
}

export interface SessionResult {
  qid: number;
  selected: string | null;
  answer: string;
  correct: boolean;
  answered: boolean;
}

export interface SessionInput {
  db: string;
  mode: 'practice' | 'mock';
  n: number;
  right: number;
  answered: number;
  sec: number;
}

export function createEmptyRecords(): Records {
  return { v: 1, q: {}, s: [] };
}

export function loadRecords(): Records {
  if (typeof window === 'undefined') return createEmptyRecords();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return createEmptyRecords();
    const parsed = JSON.parse(raw);
    if (parsed?.v !== 1 || typeof parsed.q !== 'object') return createEmptyRecords();
    return { v: 1, q: parsed.q || {}, s: Array.isArray(parsed.s) ? parsed.s : [] };
  } catch {
    return createEmptyRecords();
  }
}

export function saveRecords(records: Records): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(records));
  } catch {
    // Private browsing or a full quota should not prevent the current test.
  }
}

export function addSession(
  records: Records,
  results: SessionResult[],
  session: SessionInput,
  identity: { now?: number } = {},
): Records {
  const now = identity.now ?? Date.now();
  const q = { ...records.q };
  for (const item of results) {
    if (!item.answered) continue;
    const key = String(item.qid);
    const previous = q[key] || { a: 0, w: 0, t: 0, c: 1 as 0 | 1 };
    q[key] = {
      a: previous.a + 1,
      w: previous.w + (item.correct ? 0 : 1),
      t: now,
      c: item.correct ? 1 : 0,
    };
  }
  const s = [{ ts: now, ...session }, ...records.s].slice(0, MAX_SESSIONS);
  return { v: 1, q, s };
}

export function recordSession(results: SessionResult[], session: SessionInput): Records {
  const records = addSession(loadRecords(), results, session);
  saveRecords(records);
  return records;
}

export function clearRecords(): Records {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  return createEmptyRecords();
}

export interface Overview {
  seen: number;
  attempts: number;
  wrong: number;
  wrongNow: number;
  sessions: number;
}

export function overview(records: Records): Overview {
  let attempts = 0;
  let wrong = 0;
  let wrongNow = 0;
  const stats = Object.values(records.q);
  for (const stat of stats) {
    attempts += stat.a;
    wrong += stat.w;
    if (stat.c === 0) wrongNow++;
  }
  return { seen: stats.length, attempts, wrong, wrongNow, sessions: records.s.length };
}

export function wrongRanking(records: Records, limit = 10): { qid: number; stat: QuestionStat }[] {
  return Object.entries(records.q)
    .filter(([, stat]) => stat.w > 0)
    .map(([key, stat]) => ({ qid: Number(key), stat }))
    .sort((x, y) => y.stat.w - x.stat.w || y.stat.t - x.stat.t)
    .slice(0, limit);
}

export interface PickOptions {
  excludeSeen: boolean;
  mixWrong: boolean;
}

export type PickMode = 'random' | 'wrong-and-new' | 'new-only';
export type LibraryMode = 'classic' | 'hidden';

export function validCompletedCount(index: IndexEntry[], records: Records): number {
  // 365 题解锁进度只认练习池的题；diag（诊断集）另有自己的解锁路径（Pass ≥90%），
  // 两条路不互相漏水
  const validQids = new Set(index.filter((entry) => !entry.diag).map((entry) => entry.qid));
  return Object.entries(records.q).filter(
    ([qid, stat]) => validQids.has(Number(qid)) && stat.a >= 1,
  ).length;
}

export function isHiddenModeUnlocked(index: IndexEntry[], records: Records): boolean {
  return validCompletedCount(index, records) >= HIDDEN_UNLOCK_COUNT;
}

export function hiddenUnlockProgress(index: IndexEntry[], records: Records): number {
  return Math.min(1, validCompletedCount(index, records) / HIDDEN_UNLOCK_COUNT);
}

export function indexForLibraryMode(index: IndexEntry[], mode: LibraryMode): IndexEntry[] {
  // diag（GMAT 诊断集）永不进随机练习池：那批题只属于 Diagnostic Test，
  // 设计上全程不给对错，混进 classic/9.0 会破坏「诊断不泄题」的前提
  return index.filter((entry) => !entry.diag && (mode === 'hidden' || !entry.hidden));
}

export function optionsForPickMode(mode: PickMode): PickOptions {
  if (mode === 'wrong-and-new') return { excludeSeen: true, mixWrong: true };
  if (mode === 'new-only') return { excludeSeen: true, mixWrong: false };
  return { excludeSeen: false, mixWrong: false };
}

const WRONG_SHARE = 1 / 3;

function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

export function pickQids(
  index: IndexEntry[],
  db: ExamDb,
  count: number,
  options: PickOptions,
  records: Records,
): number[] {
  const inDatabase = index.filter((entry) => db === 'ALL' || entry.db === db);
  const isSeen = (qid: number) => records.q[String(qid)] !== undefined;
  const isWrongNow = (qid: number) => records.q[String(qid)]?.c === 0;
  const wrongPool = options.mixWrong
    ? shuffle(inDatabase.filter((entry) => isWrongNow(entry.qid)).map((entry) => entry.qid))
    : [];
  const basePool = shuffle(
    inDatabase
      .filter((entry) => (options.excludeSeen ? !isSeen(entry.qid) : true))
      .map((entry) => entry.qid),
  );

  const picked: number[] = [];
  const take = (pool: number[], amount: number) => {
    for (const qid of pool) {
      if (picked.length >= count || amount <= 0) break;
      if (picked.includes(qid)) continue;
      picked.push(qid);
      amount--;
    }
  };

  if (options.mixWrong) take(wrongPool, Math.ceil(count * WRONG_SHARE));
  take(basePool, count - picked.length);
  if (picked.length < count && options.mixWrong) take(wrongPool, count - picked.length);
  return shuffle(picked);
}

export function pickQidsForMode(
  index: IndexEntry[],
  db: ExamDb,
  count: number,
  mode: PickMode,
  records: Records,
): number[] {
  return pickQids(index, db, count, optionsForPickMode(mode), records);
}

export function availableCount(
  index: IndexEntry[],
  db: ExamDb,
  options: PickOptions,
  records: Records,
): number {
  const inDatabase = index.filter((entry) => db === 'ALL' || entry.db === db);
  if (!options.excludeSeen) return inDatabase.length;
  const fresh = inDatabase.filter((entry) => records.q[String(entry.qid)] === undefined).length;
  if (!options.mixWrong) return fresh;
  return fresh + inDatabase.filter((entry) => records.q[String(entry.qid)]?.c === 0).length;
}

export function availableCountForMode(
  index: IndexEntry[],
  db: ExamDb,
  mode: PickMode,
  records: Records,
): number {
  return availableCount(index, db, optionsForPickMode(mode), records);
}

type ImportedCell = string | number | boolean | Date | null;

export const SHEET_NAME = 'Records';
export const HEADERS = ['QID', 'Last Attempt', 'Last Result', 'Wrong Count', 'Attempt Count'] as const;
const RESULT_CORRECT = 'Correct';
const RESULT_WRONG = 'Wrong';

// ---- 只读的场次表 ----
// 导出时附带，导入端不看它（仍然只认主表、仍然返回 s: []）。
// 存在的意义是让用户手里的文件留一份趋势留档——localStorage 里只保 200 场。
export const SESSIONS_SHEET_NAME = 'Sessions';
export const SESSION_HEADERS = [
  'Date',
  'Bank',
  'Mode',
  'Questions',
  'Correct',
  'Answered',
  'Seconds',
] as const;

// ---- 旧版（中文）导出文件的兼容层 ----
// 导出一律用上面的英文表名/表头，但存量用户手里还有中文导出的 .xlsx，
// 导入端必须两套都认。逐列别名而不是整行比对：混排的表头也能过。
// 下面这些中文是历史文件的识别码，不是界面文案：它们跟着用户手里已经
// 存在的 .xlsx 走，改一个字就读不了旧记录了。别跟着界面语言动。
const LEGACY_SHEET_NAME = '做题记录';
const HEADER_ALIASES: readonly (readonly string[])[] = [
  ['QID'],
  ['Last Attempt', '最后作答时间'],
  ['Last Result', '最近结果'],
  ['Wrong Count', '错误次数'],
  ['Attempt Count', '作答次数'],
];
const CORRECT_LABELS: readonly string[] = [RESULT_CORRECT, '正确'];
const WRONG_LABELS: readonly string[] = [RESULT_WRONG, '错误'];

const headerCell = (value: string) => ({
  value,
  fontWeight: 'bold' as const,
  textColor: '#FFFFFF',
  backgroundColor: '#17324D',
  alignVertical: 'center' as const,
  height: 24,
});

export async function exportRecordsWorkbook(records: Records): Promise<Blob> {
  const writeExcelFile = (await import('write-excel-file/browser')).default;
  const rows = [
    HEADERS.map(headerCell),
    ...Object.entries(records.q)
      .sort(([, a], [, b]) => b.t - a.t)
      .map(([qid, stat]) => [
        Number(qid),
        new Date(stat.t),
        stat.c ? RESULT_CORRECT : RESULT_WRONG,
        stat.w,
        stat.a,
      ]),
  ];

  // 场次表按时间正序（records.s 是新场次在前），读起来才像一条时间线
  const sessionRows = [
    SESSION_HEADERS.map(headerCell),
    ...[...records.s].reverse().map((session) => [
      new Date(session.ts),
      session.db,
      session.mode === 'mock' ? 'Mock' : 'Practice',
      session.n,
      session.right,
      session.answered,
      session.sec,
    ]),
  ];

  return writeExcelFile(
    [
      {
        data: rows,
        sheet: SHEET_NAME,
        columns: [{ width: 18 }, { width: 22 }, { width: 12 }, { width: 12 }, { width: 12 }],
        stickyRowsCount: 1,
        dateFormat: 'yyyy-mm-dd hh:mm:ss',
      },
      {
        data: sessionRows,
        sheet: SESSIONS_SHEET_NAME,
        columns: [
          { width: 22 },
          { width: 14 },
          { width: 12 },
          { width: 12 },
          { width: 10 },
          { width: 12 },
          { width: 10 },
        ],
        stickyRowsCount: 1,
        dateFormat: 'yyyy-mm-dd hh:mm:ss',
      },
    ],
  ).toBlob();
}

function integerValue(value: ImportedCell, field: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) {
    throw new Error(strings().errors.notInteger(field));
  }
  return value;
}

function timeValue(value: ImportedCell): number {
  if (value instanceof Date && Number.isFinite(value.getTime())) return value.getTime();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  throw new Error(strings().errors.badTime);
}

export async function importRecordsWorkbook(
  input: Blob | ArrayBuffer,
  validQids: ReadonlySet<number>,
): Promise<Records> {
  const size = input instanceof ArrayBuffer ? input.byteLength : input.size;
  if (size > MAX_IMPORT_BYTES) throw new Error(strings().errors.fileTooLarge);

  const readExcelFile = (await import('read-excel-file/browser')).default;
  let sheets;
  try {
    sheets = await readExcelFile(input);
  } catch {
    throw new Error(strings().errors.unreadable);
  }

  const sheet = sheets.find(
    (item) => item.sheet === SHEET_NAME || item.sheet === LEGACY_SHEET_NAME,
  );
  if (!sheet) {
    throw new Error(strings().errors.missingSheet(SHEET_NAME));
  }
  // read-excel-file declares date cells as `typeof Date`, while its runtime API returns Date instances.
  const rows = sheet.data as unknown as ImportedCell[][];
  const header = rows[0] || [];
  if (HEADER_ALIASES.some((names, index) => !names.includes(String(header[index] ?? '')))) {
    throw new Error(strings().errors.headerMismatch);
  }

  const q: Record<string, QuestionStat> = {};
  for (const [index, row] of rows.slice(1).entries()) {
    if (row.every((value) => value === null)) continue;
    const line = index + 2;
    const t = strings().errors;
    const qid = integerValue(row[0], t.fieldQid(line));
    if (qid === 0) throw new Error(t.badQid(line));
    if (!validQids.has(qid)) throw new Error(t.unknownQid(qid));
    if (q[String(qid)]) throw new Error(t.duplicateQid(qid));
    const result = String(row[2] ?? '');
    const isCorrect = CORRECT_LABELS.includes(result);
    if (!isCorrect && !WRONG_LABELS.includes(result)) {
      throw new Error(t.badResult(line, RESULT_CORRECT, RESULT_WRONG));
    }
    const wrong = integerValue(row[3], t.fieldWrong(line));
    const attempts = integerValue(row[4], t.fieldAttempts(line));
    if (wrong > attempts) throw new Error(t.wrongExceedsAttempts(line));
    q[String(qid)] = {
      a: attempts,
      w: wrong,
      t: timeValue(row[1]),
      c: isCorrect ? 1 : 0,
    };
  }

  return { v: 1, q, s: [] };
}
