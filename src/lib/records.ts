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

/** Diagnostic Test 的战绩。passed 一旦为真就不再翻回去——解锁不可撤销 */
export interface DiagState {
  passed: boolean;
  attempts: number;
  lastTs: number;
}

export interface Records {
  v: 1;
  q: Record<string, QuestionStat>;
  s: SessionRecord[];
  /** Grill 绑定集：诊断里出现过的 qid，去重。P3 才会拿它组卷 */
  grill?: number[];
  diag?: DiagState;
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

/**
 * 存量档案没有 grill / diag 两个字段，读到就地补默认即可——
 * 版本号仍是 1，不做迁移：加可选字段而已，旧版本读新档案也只是看不见它们。
 */
export function normalizeRecords(parsed: unknown): Records {
  const raw = (parsed ?? {}) as Partial<Records> & { q?: unknown; s?: unknown };
  const out: Records = {
    v: 1,
    q: (raw.q as Records['q']) || {},
    s: Array.isArray(raw.s) ? (raw.s as SessionRecord[]) : [],
  };
  const grill = Array.isArray(raw.grill)
    ? [...new Set(raw.grill.filter((qid): qid is number => Number.isSafeInteger(qid) && qid > 0))]
    : [];
  if (grill.length > 0) out.grill = grill;
  const diag = raw.diag as Partial<DiagState> | undefined;
  if (diag && typeof diag === 'object') {
    out.diag = {
      passed: diag.passed === true,
      attempts: Number.isSafeInteger(diag.attempts) && diag.attempts! > 0 ? diag.attempts! : 0,
      lastTs: Number.isFinite(diag.lastTs) ? Number(diag.lastTs) : 0,
    };
  }
  return out;
}

export function loadRecords(): Records {
  if (typeof window === 'undefined') return createEmptyRecords();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return createEmptyRecords();
    const parsed = JSON.parse(raw);
    if (parsed?.v !== 1 || typeof parsed.q !== 'object') return createEmptyRecords();
    return normalizeRecords(parsed);
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
  // 必须摊开 records：grill / diag 是后加的可选字段，重新构造对象会把它们丢掉——
  // 那等于每做一场普通练习就撤销一次 9.0 解锁
  return { ...records, v: 1, q, s };
}

export function recordSession(results: SessionResult[], session: SessionInput): Records {
  const records = addSession(loadRecords(), results, session);
  saveRecords(records);
  return records;
}

/**
 * 诊断交卷。刻意**不碰** q 和 s：
 *   - 写 q 会让这批题出现在错题榜、成绩页历史里，等于把对错泄出去；
 *   - 写 s 会让 right 数经 Sessions 导出表泄出去。
 * 「全程不给对错」得贯穿到落盘这一层，只留下「练过、通没通过」这两件事实。
 */
export function recordDiagnostic(
  records: Records,
  qids: number[],
  passed: boolean,
  identity: { now?: number } = {},
): Records {
  const now = identity.now ?? Date.now();
  const grill = [...new Set([...(records.grill || []), ...qids])];
  const previous = records.diag;
  return {
    ...records,
    grill,
    diag: {
      // 通过一次就永久算通过：解锁不该因为后面考砸而被收回
      passed: previous?.passed === true || passed,
      attempts: (previous?.attempts || 0) + 1,
      lastTs: now,
    },
  };
}

/** Grill 绑定集大小，卡面副文用它 */
export function grillCount(records: Records): number {
  return records.grill?.length || 0;
}

/**
 * 清空做题记录。
 * diag 与 grill 刻意留下并回写：Diagnostic 通过一次就永久解锁 9.0 是结构性承诺，
 * 不该被「清空练习记录」这个按钮顺手撤销——导入那条路径也是同样的保底。
 */
export function clearRecords(previous?: Records): Records {
  const kept = createEmptyRecords();
  if (previous?.grill && previous.grill.length > 0) kept.grill = [...previous.grill];
  if (previous?.diag) kept.diag = { ...previous.diag };
  try {
    if (kept.grill || kept.diag) localStorage.setItem(KEY, JSON.stringify(kept));
    else localStorage.removeItem(KEY);
  } catch {}
  return kept;
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

/**
 * 9.0 Trivial 的两条解锁路：练满 365 题，**或**通过一次 Diagnostic Test。
 * 任一达成即可，互不依赖。
 */
export function isHiddenModeUnlocked(index: IndexEntry[], records: Records): boolean {
  if (records.diag?.passed) return true;
  return validCompletedCount(index, records) >= HIDDEN_UNLOCK_COUNT;
}

export function hiddenUnlockProgress(index: IndexEntry[], records: Records): number {
  return Math.min(1, validCompletedCount(index, records) / HIDDEN_UNLOCK_COUNT);
}

/**
 * 抽题池的题库范围。两个区**互斥**（用户裁定）：
 * classic 只给经典卷，9.0 Trivial 只给扩展卷，谁也不含谁。
 *
 * 从前 'hidden' 返回的是 classic ∪ hidden 全集，于是「进 9.0」实际上等于
 * 「经典池再加点料」——9.0 里抽 20 题，十有八九抽到的还是 TMUA 真题。
 * 互斥之后进哪个区就练哪批题，卡面徽章报的也是这个区自己的题量。
 *
 * diag（GMAT 诊断集）两个区都不进：那批题只属于 Diagnostic Test，
 * 设计上全程不给对错，混进任一随机池都会破坏「诊断不泄题」的前提。
 */
export function indexForLibraryMode(index: IndexEntry[], mode: LibraryMode): IndexEntry[] {
  return index.filter((entry) => !entry.diag && (mode === 'hidden' ? !!entry.hidden : !entry.hidden));
}

/**
 * 用户当前**够得着**的全部题：经典卷 ∪（解锁后的）扩展卷。
 *
 * 这不是抽题池，是复盘视图的口径。互斥那层回答的是「这一次去哪个区抽题」，
 * 而「我做过的题在各知识点上怎么样」「这套卷我做了几题」问的是另一件事——
 * 它们跨区，不该跟着互斥一起收窄，否则站在 9.0 卡前面打开复盘，
 * 就会看见自己做过的 TMUA 真题凭空消失。
 *
 * 但它同样不是后门：还没拿到 9.0 的人，这里一道扩展池的题也摸不到，
 * 连卷名都不会出现在卷面进度墙上（不剧透）。
 */
export function reachableIndex(index: IndexEntry[], unlocked: boolean): IndexEntry[] {
  return index.filter((entry) => !entry.diag && (unlocked || !entry.hidden));
}

// ---- 逻辑推理题开关 ----
//
// 单独一层，接在 indexForLibraryMode 之后，而不是给它加个参数：题库范围
// （classic / 9.0）和题型偏好是两件互不相干的事，揉进一个函数之后就再也说不清
// 「classic 且不要逻辑题」是谁的责任了。
//
// 它只收窄抽题池。365 解锁进度数的是「做过的题」，关掉开关只是抽不到新的
// 逻辑题，已经做过的照常计数——所以 validCompletedCount 拿的始终是整份索引。
// 同理，Grill 的池子是诊断绑定集、Diagnostic 是固定卷，两者都不经过这层。

export const LOGIC_REASONING_KEY = 'mcq-test:logic-reasoning:v1';

/**
 * 取消勾选时**只**排除已标注为逻辑推理的题。没打标的题一律留下：
 * 打标覆盖率在各库之间差得极远（MAT 只有个位数百分比），把「没标过」
 * 当成「可能是逻辑题」排掉会把整个库清空。宁可漏排，不可错排。
 */
export function indexForLogicReasoning(index: IndexEntry[], include: boolean): IndexEntry[] {
  return include ? index : index.filter((entry) => !entry.logic);
}

/** 当前题库范围内，这个开关到底管得到多少题 */
export interface LogicCoverage {
  /** 已标注为逻辑推理的题数——取消勾选正好排除这些，一道不多 */
  logic: number;
  /** 整理过知识点的题数（含上面那些逻辑题），也就是这个开关「看得见」的范围 */
  tagged: number;
  /** 当前范围内的总题数 */
  total: number;
}

/**
 * 面板上那行覆盖率提示的数据源。刻意接收「过滤之前」的池子：
 * 提示描述的是这个开关能做什么，不能自己随着勾选状态变来变去。
 *
 * 顺带也是勾选框的显示条件（logic > 0）。按标签口径每个库都可能有逻辑题，
 * 不再像卷别口径那样能预先写死是哪几个库。
 */
export function logicCoverage(index: IndexEntry[], db: ExamDb): LogicCoverage {
  const scope = index.filter((entry) => db === 'ALL' || entry.db === db);
  return {
    logic: scope.filter((entry) => entry.logic).length,
    tagged: scope.filter((entry) => entry.tagged).length,
    total: scope.length,
  };
}

/** 默认含逻辑题：它是题库本来的一部分，只有明确关过的人才该拿到收窄的池子 */
export function loadIncludeLogicReasoning(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return localStorage.getItem(LOGIC_REASONING_KEY) !== '0';
  } catch {
    return true;
  }
}

export function saveIncludeLogicReasoning(include: boolean): void {
  try {
    localStorage.setItem(LOGIC_REASONING_KEY, include ? '1' : '0');
  } catch {
    // 和 saveRecords 一样：无痕模式或配额满了不该拦住这次练习
  }
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
// ---- 只读的诊断表 ----
// 带上 Grill 绑定集与诊断战绩，好让记录文件换台机器也能续上。
// 老文件没有这张表，导入时跳过即可（向后兼容）。
export const DIAGNOSTIC_SHEET_NAME = 'Diagnostic';
export const DIAGNOSTIC_HEADERS = ['QID', 'Passed', 'Attempts', 'Last Attempt'] as const;
const DIAG_YES = 'Yes';
const DIAG_NO = 'No';

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

  // 诊断表：每行自带完整战绩，合并时逐行取 OR / max 即可，不依赖行序
  const diag = records.diag;
  const passedLabel = diag?.passed ? DIAG_YES : DIAG_NO;
  const attempts = diag?.attempts || 0;
  const lastTs = diag?.lastTs ? new Date(diag.lastTs) : null;
  const boundQids = records.grill || [];
  const diagBody =
    boundQids.length > 0
      ? boundQids.map((qid) => [qid, passedLabel, attempts, lastTs])
      : // 有战绩但没绑定题（正常流程走不到，防守而已）：留一行只带状态
        diag
        ? [[null, passedLabel, attempts, lastTs]]
        : [];
  const diagRows = [DIAGNOSTIC_HEADERS.map(headerCell), ...diagBody];

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
        data: diagRows,
        sheet: DIAGNOSTIC_SHEET_NAME,
        columns: [{ width: 18 }, { width: 10 }, { width: 12 }, { width: 22 }],
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

  const imported: Records = { v: 1, q, s: [] };

  // 诊断表是后加的：老文件没有这张表，跳过即可，别因此判文件无效
  const diagSheet = sheets.find((item) => item.sheet === DIAGNOSTIC_SHEET_NAME);
  // 下面按列序硬读，所以表头对不上就整表跳过——宁可少读一张附表，
  // 也别把陌生列吞进 grill/diag。文件身份已由主表校验，这里的跳过
  // 与「老文件没有这张表」走同一语义。只查前四列，之后追加的列不管，
  // 给未来的格式演进留缝
  const diagHeaderOk = (rows: ImportedCell[][]): boolean => {
    const header = rows[0] || [];
    return DIAGNOSTIC_HEADERS.every((name, i) => String(header[i] ?? '') === name);
  };
  if (diagSheet && diagHeaderOk(diagSheet.data as unknown as ImportedCell[][])) {
    const diagRows = diagSheet.data as unknown as ImportedCell[][];
    const grill: number[] = [];
    let passed = false;
    let attempts = 0;
    let lastTs = 0;
    for (const row of diagRows.slice(1)) {
      if (!row || row.every((value) => value === null)) continue;
      const qid = row[0];
      if (typeof qid === 'number' && Number.isSafeInteger(qid) && qid > 0) grill.push(qid);
      if (String(row[1] ?? '') === DIAG_YES) passed = true;
      if (typeof row[2] === 'number' && Number.isSafeInteger(row[2])) {
        attempts = Math.max(attempts, row[2]);
      }
      try {
        lastTs = Math.max(lastTs, timeValue(row[3]));
      } catch {
        // 时间列坏了不至于让整份记录导不进来，它只是个展示字段
      }
    }
    const unique = [...new Set(grill)];
    if (unique.length > 0) imported.grill = unique;
    if (passed || attempts > 0 || lastTs > 0) imported.diag = { passed, attempts, lastTs };
  }

  return imported;
}

/**
 * 把导入的诊断战绩与本机现有的合并：绑定集取并集、passed 取 OR、
 * attempts 取 max、lastTs 取新。
 * 两边都是「做过就算数」的单调量，合并只会往前不会倒退——
 * 换台机器导入不该把已经拿到的解锁弄丢，也不该把对方的成果盖掉。
 */
export function mergeDiagnostic(local: Records, imported: Records): Records {
  const grill = [...new Set([...(local.grill || []), ...(imported.grill || [])])];
  const a = local.diag;
  const b = imported.diag;
  const merged: Records = { ...imported };
  if (grill.length > 0) merged.grill = grill;
  else delete merged.grill;

  if (a || b) {
    merged.diag = {
      passed: a?.passed === true || b?.passed === true,
      attempts: Math.max(a?.attempts || 0, b?.attempts || 0),
      lastTs: Math.max(a?.lastTs || 0, b?.lastTs || 0),
    };
  } else {
    delete merged.diag;
  }
  return merged;
}
