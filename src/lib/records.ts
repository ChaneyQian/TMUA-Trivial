'use client';

import type { IndexEntry, ExamDb } from './exam';

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
  const validQids = new Set(index.map((entry) => entry.qid));
  return Object.entries(records.q).filter(
    ([qid, stat]) => validQids.has(Number(qid)) && stat.a >= 1,
  ).length;
}

export function isHiddenModeUnlocked(index: IndexEntry[], records: Records): boolean {
  return validCompletedCount(index, records) >= HIDDEN_UNLOCK_COUNT;
}

export function indexForLibraryMode(index: IndexEntry[], mode: LibraryMode): IndexEntry[] {
  return mode === 'hidden' ? index : index.filter((entry) => !entry.hidden);
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

const HEADERS = ['QID', '最后作答时间', '最近结果', '错误次数', '作答次数'] as const;

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
        stat.c ? '正确' : '错误',
        stat.w,
        stat.a,
      ]),
  ];

  return writeExcelFile(rows, {
    sheet: '做题记录',
    columns: [{ width: 18 }, { width: 22 }, { width: 12 }, { width: 12 }, { width: 12 }],
    stickyRowsCount: 1,
    dateFormat: 'yyyy-mm-dd hh:mm:ss',
  }).toBlob();
}

function integerValue(value: ImportedCell, field: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) {
    throw new Error(`记录文件格式错误：${field} 不是有效整数`);
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
  throw new Error('记录文件格式错误：最后作答时间无效');
}

export async function importRecordsWorkbook(
  input: Blob | ArrayBuffer,
  validQids: ReadonlySet<number>,
): Promise<Records> {
  const size = input instanceof ArrayBuffer ? input.byteLength : input.size;
  if (size > MAX_IMPORT_BYTES) throw new Error('记录文件过大，最大支持 5 MB');

  const readExcelFile = (await import('read-excel-file/browser')).default;
  let sheets;
  try {
    sheets = await readExcelFile(input);
  } catch {
    throw new Error('无法读取 Excel，请选择本站导出的 .xlsx 记录文件');
  }

  const sheet = sheets.find((item) => item.sheet === '做题记录');
  if (!sheet) throw new Error('这不是有效的 MCQ Test 记录文件：缺少“做题记录”工作表');
  // read-excel-file declares date cells as `typeof Date`, while its runtime API returns Date instances.
  const rows = sheet.data as unknown as ImportedCell[][];
  const header = rows[0] || [];
  if (HEADERS.some((name, index) => header[index] !== name)) {
    throw new Error('MCQ Test 记录文件格式错误：表头不匹配');
  }

  const q: Record<string, QuestionStat> = {};
  for (const [index, row] of rows.slice(1).entries()) {
    if (row.every((value) => value === null)) continue;
    const line = index + 2;
    const qid = integerValue(row[0], `第 ${line} 行 QID`);
    if (qid === 0) throw new Error(`记录文件格式错误：第 ${line} 行 QID 无效`);
    if (!validQids.has(qid)) {
      throw new Error(`记录文件包含无效 QID ${qid}：该题不在当前题库`);
    }
    if (q[String(qid)]) throw new Error(`记录文件格式错误：QID ${qid} 重复`);
    const result = row[2];
    if (result !== '正确' && result !== '错误') {
      throw new Error(`记录文件格式错误：第 ${line} 行最近结果只能是正确或错误`);
    }
    const wrong = integerValue(row[3], `第 ${line} 行错误次数`);
    const attempts = integerValue(row[4], `第 ${line} 行作答次数`);
    if (wrong > attempts) throw new Error(`记录文件格式错误：第 ${line} 行错误次数不能超过作答次数`);
    q[String(qid)] = {
      a: attempts,
      w: wrong,
      t: timeValue(row[1]),
      c: result === '正确' ? 1 : 0,
    };
  }

  return { v: 1, q, s: [] };
}
