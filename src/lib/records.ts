'use client';

import type { IndexEntry, ExamDb } from './exam';
import { s as strings } from './i18n.ts';
// 存储键的登记处（显式带扩展名的理由同上面那行 i18n.ts）
import { RECORDS_KEY as KEY, LOGIC_REASONING_KEY } from './storage.ts';

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

/** 一场诊断考试的战绩。passed 一旦为真就不再翻回去——解锁不可撤销 */
export interface DiagState {
  passed: boolean;
  attempts: number;
  lastTs: number;
}

export interface Records {
  v: 1;
  q: Record<string, QuestionStat>;
  s: SessionRecord[];
  /** Grill 绑定集：诊断里出现过的 qid，去重。GMAT 与 7.5+ 两场考试共用这一个集合 */
  grill?: number[];
  /**
   * 旧 GMAT 诊断的战绩（2026-09 下线）。只读保留：passed 仍算 9.0 解锁，
   * attempts 不再有任何用处——新考试单独记在 diag75，从 0 次开始
   */
  diag?: DiagState;
  /** 7.5+ Diagnostic 的战绩：两次机会、passed 即解锁 9.0 */
  diag75?: DiagState;
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

/** 一份诊断战绩的脏值清洗；不是对象就当没有 */
function normalizeDiag(value: unknown): DiagState | undefined {
  const diag = value as Partial<DiagState> | undefined;
  if (!diag || typeof diag !== 'object') return undefined;
  return {
    passed: diag.passed === true,
    attempts: Number.isSafeInteger(diag.attempts) && diag.attempts! > 0 ? diag.attempts! : 0,
    lastTs: Number.isFinite(diag.lastTs) ? Number(diag.lastTs) : 0,
  };
}

/** 本版认得的顶层字段。其余字段一律原样透传，见 normalizeRecords */
const KNOWN_RECORD_KEYS = new Set(['v', 'q', 's', 'grill', 'diag', 'diag75']);

/** 本版不认识的顶层字段（以后的版本加的），原样取出来 */
function unknownFields(raw: unknown): Record<string, unknown> {
  const extras: Record<string, unknown> = {};
  if (!raw || typeof raw !== 'object') return extras;
  for (const [key, value] of Object.entries(raw)) {
    if (!KNOWN_RECORD_KEYS.has(key)) extras[key] = value;
  }
  return extras;
}

/**
 * 存量档案没有 grill / diag / diag75 这几个字段，读到就地补默认即可——
 * 版本号仍是 1，不做迁移：加的都是可选字段。
 *
 * 反方向要小心：本版之前的代码在这里只挑自己认得的字段，**不认识的会被丢掉**，
 * 下一次落盘（练一场）就把它从 localStorage 里抹掉——所以本版上线后不能直接回滚到
 * 不认识 diag75 的旧版本，否则用户练一场就丢掉 7.5+ 战绩（Design §21 的回滚警告）。
 * 从本版起不认识的顶层字段原样透传，给以后加字段留后路：以后的版本新加的东西，
 * 就算被人退回到本版，也不会在这里被悄悄删掉。
 *
 * 7.5+ 取代 GMAT 诊断时也不改写旧字段（用户裁定 2026-09-28）：
 * diag 原样留着——通过过的人凭它保持解锁；新考试记在 diag75，
 * 没有这个字段就是 0 次，于是每个人在新考试上都从完整的两次机会起步。
 * 「迁移」就是分开记，不需要一行转换代码
 */
export function normalizeRecords(parsed: unknown): Records {
  const raw = (parsed ?? {}) as Partial<Records> & { q?: unknown; s?: unknown };
  // 不认识的字段先放进去，认得的再覆盖上来：透传的东西永远盖不掉本版的字段
  const out = {
    ...unknownFields(raw),
    v: 1,
    q: (raw.q as Records['q']) || {},
    s: Array.isArray(raw.s) ? (raw.s as SessionRecord[]) : [],
  } as Records;
  const grill = Array.isArray(raw.grill)
    ? [...new Set(raw.grill.filter((qid): qid is number => Number.isSafeInteger(qid) && qid > 0))]
    : [];
  if (grill.length > 0) out.grill = grill;
  const diag = normalizeDiag(raw.diag);
  if (diag) out.diag = diag;
  const diag75 = normalizeDiag(raw.diag75);
  if (diag75) out.diag75 = diag75;
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
  // 必须摊开 records：grill / diag / diag75 是后加的可选字段，重新构造对象会把它们丢掉——
  // 那等于每做一场普通练习就撤销一次 9.0 解锁
  return { ...records, v: 1, q, s };
}

/**
 * 7.5+ Diagnostic 交卷（GMAT 诊断已下线，考试只有这一场）。只落两件事：
 * 本场的题并入 Grill 绑定集（与 GMAT 时代同一个集合），diag75 记一次尝试。
 *
 * 刻意**不碰** q 和 s：
 *   - 写 q 会让这批题出现在错题榜、成绩页历史里，等于把对错泄出去；
 *   - 写 s 会让 right 数经 Sessions 导出表泄出去。
 * 「全程不给对错」得贯穿到落盘这一层，只留下「练过、通没通过」这两件事实。
 * 旧的 diag（GMAT 战绩）也不碰：通过过的人凭它保持解锁
 */
export function recordDiagnostic(
  records: Records,
  qids: number[],
  passed: boolean,
  identity: { now?: number } = {},
): Records {
  const now = identity.now ?? Date.now();
  const grill = [...new Set([...(records.grill || []), ...qids])];
  const previous = records.diag75;
  return {
    ...records,
    grill,
    diag75: {
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

// ---- 管理调试页的两个开关（只有 /admin 用）----
// 作用于 7.5+ 的 diag75。旧 GMAT 的 diag 一个字都不碰：那是已下线考试的历史，
// 调试新考试用不着改它，改了反而会把「旧通过者保持解锁」这条迁移规则弄脏

/** 设为 7.5+ 诊断通过（9.0 解锁）。attempts 保留已有值，没有就记 1 次 */
export function markDiagnosticPassed(records: Records, now: number = Date.now()): Records {
  return {
    ...records,
    diag75: { passed: true, attempts: records.diag75?.attempts ?? 1, lastTs: now },
  };
}

/** 重置 7.5+ 诊断战绩与 Grill 绑定集：回到「从没考过 7.5+」 */
export function resetDiagnosticRecord(records: Records): Records {
  const next = { ...records };
  delete next.diag75;
  delete next.grill;
  return next;
}

/**
 * 清空做题记录。
 * grill 与两场诊断的战绩（diag / diag75）刻意留下并回写：Diagnostic 通过一次就永久解锁 9.0
 * 是结构性承诺，不该被「清空练习记录」这个按钮顺手撤销——导入那条路径也是同样的保底。
 * 机会次数同理：清空练习记录不是重新领两次机会的后门。
 * 本版不认识的顶层字段（以后的版本加的）也原样留下：「清空」清的是练习记录（q / s），
 * 不是别人的数据
 */
export function clearRecords(previous?: Records): Records {
  const extras = unknownFields(previous);
  const kept = { ...extras, ...createEmptyRecords() } as Records;
  if (previous?.grill && previous.grill.length > 0) kept.grill = [...previous.grill];
  if (previous?.diag) kept.diag = { ...previous.diag };
  if (previous?.diag75) kept.diag75 = { ...previous.diag75 };
  try {
    if (kept.grill || kept.diag || kept.diag75 || Object.keys(extras).length > 0) {
      localStorage.setItem(KEY, JSON.stringify(kept));
    } else {
      localStorage.removeItem(KEY);
    }
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
/** 抽题池的题库范围：经典 / 9.0 扩展 / 05 密卷（见 indexForLibraryMode） */
export type LibraryMode = 'classic' | 'hidden' | 'sealed';

export function validCompletedCount(index: IndexEntry[], records: Records): number {
  // 365 题解锁进度不认 diag（诊断集）：它们另有自己的解锁路径（通过诊断），
  // 两条路不互相漏水。
  //
  // reserved 刻意**照算**（用户裁定 2026-09-28）：那两道经典区的题被 7.5+ 卷一征用后
  // 只是抽不到了，已有的作答记录不作废——不能让任何人因为这次改动从 365 掉下去、
  // 丢掉已经拿到的解锁
  const validQids = new Set(index.filter((entry) => !entry.diag).map((entry) => entry.qid));
  return Object.entries(records.q).filter(
    ([qid, stat]) => validQids.has(Number(qid)) && stat.a >= 1,
  ).length;
}

/**
 * 9.0 Trivial 的解锁：练满 365 题，**或**通过 7.5+ Diagnostic，**或**当年通过了
 * 旧的 GMAT 诊断（下线不收回）。任一达成即可，互不依赖。
 */
export function isHiddenModeUnlocked(index: IndexEntry[], records: Records): boolean {
  if (records.diag?.passed || records.diag75?.passed) return true;
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
 * diag（诊断集）两个区都不进：那批题只属于 Diagnostic，
 * 设计上全程不给对错，混进任一随机池都会破坏「诊断不泄题」的前提。
 *
 * reserved（7.5+ 卷一里原本在经典区的两道）同样两个区都不进：还没考诊断的人
 * 不该在经典区先把它们练一遍、看过答案再进考场。抽题范围三档、逻辑推理开关、
 * 卡面题数都建在这一层之上，所以一并生效
 *
 * 'sealed'（05 密卷，2026-10-08）只给打了 sealed 的题：TMUA / MAT 的 2024、2025 卷。
 * 它是从 9.0 池里按年份切出来的一片——这批题照旧 hidden，9.0 里照常有（用户方案），
 * 所以密卷与 9.0 **重叠**、与经典池仍互斥。diag / reserved 照样不进。
 * 能不能用这一档（窗口内 + 输对密码）由调用方判，这里只管划池子
 */
export function indexForLibraryMode(index: IndexEntry[], mode: LibraryMode): IndexEntry[] {
  return index.filter((entry) => {
    if (entry.diag || entry.reserved) return false;
    if (mode === 'sealed') return !!entry.sealed;
    return mode === 'hidden' ? !!entry.hidden : !entry.hidden;
  });
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
 *
 * reserved 也不算「够得着」：「练这类题」从这里取池子，不能成为练到考题的后门；
 * 卷面进度墙与完卷横幅也从这里取分母——那两套卷（TMUA 2018 P1、MAT 2023）
 * 于是按剩下的题算，不用那道再也抽不到的题也能做满，墙与横幅口径一致
 *
 * sealedAccess（05 密卷已解锁且此刻在开放窗口内）时并入密卷池：在密卷里做错的题要能在复烤区
 * 「练这类题」里出现、进度页的卷面墙要能看到那几套卷。窗口一过就不再并入——记录照旧留着，
 * 只是不再「够得着」；没解锁 9.0 的人也只多出密卷那一片，其余扩展卷照样摸不到
 */
export function reachableIndex(
  index: IndexEntry[],
  unlocked: boolean,
  sealedAccess = false,
): IndexEntry[] {
  return index.filter(
    (entry) =>
      !entry.diag && !entry.reserved && (unlocked || !entry.hidden || (sealedAccess && !!entry.sealed)),
  );
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

// 登记处在 lib/storage.ts；这里原样转出，调用方与测试不必跟着改 import
export { LOGIC_REASONING_KEY };

/** 三档（用户裁定 2026-09-16）：全部 / 仅逻辑题 / 排除逻辑题 */
export type LogicFilter = 'all' | 'only' | 'exclude';

/**
 * 'exclude' 时**只**排除已标注为逻辑推理的题。没打标的题一律留下：
 * 打标覆盖率在各库之间差得极远（MAT 只有个位数百分比），把「没标过」
 * 当成「可能是逻辑题」排掉会把整个库清空。宁可漏排，不可错排。
 *
 * 'only' 反过来只留已标注的——同一个口径的两面，所以没标过的题在这一档
 * 会全部落选（MAT 这种库因此可能缩到 0 题）。这是打标口径的直接后果，不是 bug。
 *
 * 面板的显示条件（当前 db 的 logic > 0）只挡住了其中一种情形：**同一个 db、
 * 且不再叠加别的滤网**时，'only' 至少还剩一题。它挡不住叠加——再选「仅新题」
 * 照样能归零；也挡不住「某个区×库组合一道 logic 标注都没有」——那时控件根本
 * 不渲染，而用户存着的 'only' 仍然生效。现有数据里每个组合的 logic 都 > 0，
 * 所以后一种当下不发生，但那是**数据依赖**，不是这个函数给的保证。
 */
export function indexForLogicReasoning(index: IndexEntry[], filter: LogicFilter): IndexEntry[] {
  if (filter === 'all') return index;
  if (filter === 'only') return index.filter((entry) => !!entry.logic);
  return index.filter((entry) => !entry.logic);
}

/** 当前题库范围内，这个开关到底管得到多少题 */
export interface LogicCoverage {
  /** 已标注为逻辑推理的题数——「排除」档正好排除这些，一道不多；「仅逻辑题」档只留这些 */
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
 * 顺带也是这组分段按钮的显示条件（logic > 0）。按标签口径每个库都可能有逻辑题，
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

/**
 * 默认 'all'：整个题库本来就含逻辑题，只有明确选过别的档位的人才该拿到收窄的池子。
 *
 * 键沿用两态时代的 LOGIC_REASONING_KEY，不另开新键——存量用户手里存的是
 * '1' / '0'，就地映射（'1' → all、'0' → exclude）比多一个键干净；
 * 认不出来的值一律当 'all'，和从前「不猜」的口径一致。
 */
export function loadLogicFilter(): LogicFilter {
  if (typeof window === 'undefined') return 'all';
  try {
    const raw = localStorage.getItem(LOGIC_REASONING_KEY);
    if (raw === 'all' || raw === 'only' || raw === 'exclude') return raw;
    if (raw === '0') return 'exclude';
    return 'all';
  } catch {
    return 'all';
  }
}

export function saveLogicFilter(filter: LogicFilter): void {
  try {
    localStorage.setItem(LOGIC_REASONING_KEY, filter);
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
/** 前四列：绑定集 + 旧 GMAT 诊断的战绩。线格式冻结，一个字都不许动 */
export const DIAGNOSTIC_HEADERS = ['QID', 'Passed', 'Attempts', 'Last Attempt'] as const;
/**
 * 7.5+ Diagnostic 的战绩：诊断表**追加**三列（2026-09）。导入端的表头校验
 * 只查前四列（前缀匹配、追加列留缝），这三列另查，于是：
 *   - 旧站读新文件：照旧只读前四列，绑定集与旧战绩一样不少，追加列不看；
 *   - 新站读旧文件：没有这三列，diag75 就是空的（新考试从 0 次起步）；
 *   - 追加列的表头对不上（被 Excel 挪过列，或将来又追加了别的）：只丢这三列，前四列照读
 */
export const DIAGNOSTIC75_HEADERS = ['7.5+ Passed', '7.5+ Attempts', '7.5+ Last Attempt'] as const;
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

  // 诊断表：每行自带完整战绩（旧 GMAT 三格 + 7.5+ 三格），合并时逐行取 OR / max 即可，
  // 不依赖行序。没有的那场写成「No / 0 / 空」，导入端据此认出「没考过」
  const statusCells = (diag?: DiagState) => [
    diag?.passed ? DIAG_YES : DIAG_NO,
    diag?.attempts || 0,
    diag?.lastTs ? new Date(diag.lastTs) : null,
  ];
  const legacy = statusCells(records.diag);
  const current = statusCells(records.diag75);
  const boundQids = records.grill || [];
  const diagBody =
    boundQids.length > 0
      ? boundQids.map((qid) => [qid, ...legacy, ...current])
      : // 有战绩但没绑定题（正常流程走不到，防守而已）：留一行只带状态
        records.diag || records.diag75
        ? [[null, ...legacy, ...current]]
        : [];
  const diagRows = [[...DIAGNOSTIC_HEADERS, ...DIAGNOSTIC75_HEADERS].map(headerCell), ...diagBody];

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
        columns: [
          { width: 18 },
          { width: 10 },
          { width: 12 },
          { width: 22 },
          { width: 14 },
          { width: 16 },
          { width: 22 },
        ],
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
  // 与「老文件没有这张表」走同一语义。整表的去留只看前四列，之后追加的列
  // 各查各的表头（7.5+ 那三列见 DIAGNOSTIC75_HEADERS），给格式演进留缝
  const headerMatches = (header: ImportedCell[], names: readonly string[], from: number): boolean =>
    names.every((name, i) => String(header[from + i] ?? '') === name);
  if (
    diagSheet &&
    headerMatches((diagSheet.data as unknown as ImportedCell[][])[0] || [], DIAGNOSTIC_HEADERS, 0)
  ) {
    const diagRows = diagSheet.data as unknown as ImportedCell[][];
    // 7.5+ 那三列是追加的：表头对得上才读，对不上（旧文件没有、或列被挪过）只丢这三列
    const has75 = headerMatches(diagRows[0] || [], DIAGNOSTIC75_HEADERS, DIAGNOSTIC_HEADERS.length);
    const grill: number[] = [];
    const legacy = emptyTally();
    const current = emptyTally();
    for (const row of diagRows.slice(1)) {
      if (!row || row.every((value) => value === null)) continue;
      const qid = row[0];
      if (typeof qid === 'number' && Number.isSafeInteger(qid) && qid > 0) grill.push(qid);
      absorbTally(legacy, row, 1);
      if (has75) absorbTally(current, row, DIAGNOSTIC_HEADERS.length);
    }
    const unique = [...new Set(grill)];
    if (unique.length > 0) imported.grill = unique;
    if (tallyPresent(legacy)) imported.diag = legacy;
    if (tallyPresent(current)) imported.diag75 = current;
  }

  return imported;
}

// ---- 诊断表里一段战绩列（Passed / Attempts / Last Attempt）的逐行累加 ----
// 每行都带着完整战绩，逐行取 OR / max 即可，不依赖行序。旧 GMAT 与 7.5+ 两段同一套读法

function emptyTally(): DiagState {
  return { passed: false, attempts: 0, lastTs: 0 };
}

function absorbTally(acc: DiagState, row: ImportedCell[], at: number): void {
  if (String(row[at] ?? '') === DIAG_YES) acc.passed = true;
  const attempts = row[at + 1];
  if (typeof attempts === 'number' && Number.isSafeInteger(attempts)) {
    acc.attempts = Math.max(acc.attempts, attempts);
  }
  try {
    acc.lastTs = Math.max(acc.lastTs, timeValue(row[at + 2]));
  } catch {
    // 时间列坏了不至于让整份记录导不进来，它只是个展示字段
  }
}

/** 「No / 0 / 空」就是没考过：不凭空造出一个字段 */
function tallyPresent(acc: DiagState): boolean {
  return acc.passed || acc.attempts > 0 || acc.lastTs > 0;
}

/** 两份同一场考试的战绩取并：passed 取 OR、attempts 取 max、lastTs 取新；两边都没有就没有 */
function mergeDiagState(a?: DiagState, b?: DiagState): DiagState | undefined {
  if (!a && !b) return undefined;
  return {
    passed: a?.passed === true || b?.passed === true,
    attempts: Math.max(a?.attempts || 0, b?.attempts || 0),
    lastTs: Math.max(a?.lastTs || 0, b?.lastTs || 0),
  };
}

/**
 * 把导入的诊断战绩与本机现有的合并：绑定集取并集，两场考试（旧 GMAT 的 diag、
 * 7.5+ 的 diag75）各合各的——passed 取 OR、attempts 取 max、lastTs 取新。
 * 两边都是「做过就算数」的单调量，合并只会往前不会倒退——
 * 换台机器导入不该把已经拿到的解锁弄丢，也不该把对方的成果盖掉；
 * attempts 取 max 也保证导一份旧文件进来，换不回已经用掉的机会。
 * 本机上本版不认识的顶层字段原样带过去：导入只替换文件里带着的东西
 */
export function mergeDiagnostic(local: Records, imported: Records): Records {
  const grill = [...new Set([...(local.grill || []), ...(imported.grill || [])])];
  const merged = { ...unknownFields(local), ...imported } as Records;
  if (grill.length > 0) merged.grill = grill;
  else delete merged.grill;

  const diag = mergeDiagState(local.diag, imported.diag);
  if (diag) merged.diag = diag;
  else delete merged.diag;
  const diag75 = mergeDiagState(local.diag75, imported.diag75);
  if (diag75) merged.diag75 = diag75;
  else delete merged.diag75;
  return merged;
}
