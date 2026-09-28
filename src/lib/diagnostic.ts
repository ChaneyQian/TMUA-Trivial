'use client';

// 7.5+ Diagnostic 的规则常量与纯计算（用户 2026-09-28 拍板，Design §21）。
//
// 每场 10 题、单卷、不设中场休息。两次机会：第一次考卷一，第二次考卷二。
// 卷是**固定**的、零随机，卷内顺序就是出题顺序（定义见 public/exam/diag.json，
// 构建期由 scripts/diag75-papers.mjs 组卷）。计时沿用「每题基准秒数 + 时间银行」。
// GMAT 两卷制（40 题、36/40、中场休息）已下线，它的单题只留给复烤区。

// 显式带扩展名：测试用 node --experimental-strip-types 直接跑这个模块，
// ESM 解析器不会替你补 .ts（records.ts 里的 './i18n.ts' 同理）
import { EXAM_DATA } from './config.ts';

/** diag.json 里的考试名；形状闸认它 */
export const DIAGNOSTIC_EXAM = '7.5+';
/** 每卷题数 */
export const DIAGNOSTIC_PAPER_SIZE = 10;
/** 每题基准时长（秒）。提前确认省下的时间滚存进下一题（TMUA 实考约 225 秒一题） */
export const DIAGNOSTIC_BASE_SECONDS = 240;
/** 通过线：一卷 10 题答对 8 题 */
export const DIAGNOSTIC_PASS_RIGHT = 8;
/** 一共只有两次机会，各用一卷；用完就只剩 365 题那条路 */
export const DIAGNOSTIC_MAX_ATTEMPTS = 2;
/** 剩余秒数低到这个数，倒计时转成警示色 */
export const DIAGNOSTIC_WARN_SECONDS = 30;
/** 倒计时刷新间隔。比 1s 密是为了让归零那一刻的自动确认不迟到 */
export const DIAGNOSTIC_TICK_MS = 250;

/**
 * 通过需要答对多少题。8/10 按比例折算到实际题数（正常就是 10 题 → 8）。
 * 整数运算，不经浮点：0.8 在二进制里不是有限小数，乘出来可能差一
 */
export function passMark(total = DIAGNOSTIC_PAPER_SIZE): number {
  return Math.ceil((Math.max(0, total) * DIAGNOSTIC_PASS_RIGHT) / DIAGNOSTIC_PAPER_SIZE);
}

/** 答对数达到通过线即通过。一道都没有的场次不算通过 */
export function isPass(right: number, total: number): boolean {
  return total > 0 && right >= passMark(total);
}

/** 允许答错几题还能过 */
export function allowedMisses(total = DIAGNOSTIC_PAPER_SIZE): number {
  return Math.max(0, total - passMark(total));
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
 * 单卷制之后银行从第一题一路滚到最后一题，没有「换卷清零」这一步
 */
export function bankAfter(left: number): number {
  return Math.max(0, Math.floor(left));
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

/** 还能不能考（不看卷有没有出齐，那是 diagnosticStatus 的事）。通过之后就不必再考了 */
export function canAttempt(diag?: DiagnosticProgress): boolean {
  if (diag?.passed) return false;
  return attemptsLeft(diag) > 0;
}

/**
 * 这一次该考第几卷（0 起）：第 1 次机会卷一，第 2 次卷二。
 * 机会用尽（或已通过）返回 -1 让调用方硬失败——静默降级成「再发一遍卷二」
 * 会把「仅两次机会」这条最重的规则架空。
 */
export function paperIndexForAttempt(diag?: DiagnosticProgress): number {
  if (!canAttempt(diag)) return -1;
  return diag?.attempts || 0;
}

// ---- 卷（diag.json v2）----

export type DiagnosticPaperId = 'p1' | 'p2';

export interface DiagnosticPaper {
  id: DiagnosticPaperId;
  /** 出题顺序；卷二凑不满 10 道已复核题时是 null（准备中） */
  qids: number[] | null;
}

export interface DiagnosticPapers {
  v: 2;
  exam: typeof DIAGNOSTIC_EXAM;
  papers: DiagnosticPaper[];
}

const PAPER_IDS: readonly DiagnosticPaperId[] = ['p1', 'p2'];

function isQidList(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((qid) => Number.isSafeInteger(qid) && (qid as number) > 0)
  );
}

/**
 * 形状闸（与 topics.ts / papers.ts 同款）：代理/CDN 返回 200 的错误体、改了结构
 * 撞上旧缓存，只校 res.ok 一个都挡不住。畸形数据进了 state，介绍页就是一条
 * TypeError 白屏路径——取不到就按「题库尚未就绪」处理，这句承诺必须包含
 * 「取到了但不是那份数据」。
 *
 * 旧的 v1（GMAT 两卷制 { v: 1, sets }）一律拒收：下线了的考试不能因为一份旧缓存
 * 死灰复燃。卷一必须是满的；卷二可以是 null（准备中）
 */
export function parseDiagnosticPapers(data: unknown): DiagnosticPapers {
  const d = data as { v?: unknown; exam?: unknown; papers?: unknown } | null;
  const papers = d?.papers;
  const ok =
    !!d &&
    d.v === 2 &&
    d.exam === DIAGNOSTIC_EXAM &&
    Array.isArray(papers) &&
    papers.length === PAPER_IDS.length &&
    papers.every((paper, i) => {
      const p = paper as { id?: unknown; qids?: unknown } | null;
      if (!p || p.id !== PAPER_IDS[i]) return false;
      return isQidList(p.qids) || (i > 0 && p.qids === null);
    });
  if (!ok) throw new Error('diag.json shape mismatch');
  return d as DiagnosticPapers;
}

/** 卷定义。只在 9.0 还锁着（也就是真有可能要考）时才取，不占冷启动 */
export async function fetchDiagnosticPapers(): Promise<DiagnosticPapers> {
  const res = await fetch(`${EXAM_DATA}/diag.json`);
  if (!res.ok) throw new Error(`diag.json ${res.status}`);
  return parseDiagnosticPapers(await res.json());
}

/** 介绍页与开考闸共用的判定结果 */
export type DiagnosticStatus =
  /** 可以开考：第 nth 次机会，考 paper 这一卷，按 qids 的顺序出题 */
  | { kind: 'ready'; nth: number; paper: DiagnosticPaperId; qids: number[] }
  /** 这次该考的卷还没出齐（卷二准备中）：不能开始，这次机会也不扣 */
  | { kind: 'pending'; nth: number; paper: DiagnosticPaperId }
  /** diag.json 还没取到，或取不到 / 形状不对 */
  | { kind: 'unavailable' }
  /** 两次机会都用完了 */
  | { kind: 'exhausted' }
  /** 已经通过（解锁之后本来就看不到介绍页，兜底） */
  | { kind: 'passed' };

/**
 * 第 n 次机会考哪一卷、现在能不能开考。介绍页的按钮与 startDiagnostic 的闸
 * 都只认这一个函数，两处判据不会分叉。
 *
 * 机会只在交卷时消耗（recordDiagnostic），这里从不改记录：卷二准备中的人
 * 看到的是 pending，attempts 原样不动，等卷二出齐自动变成 ready。
 */
export function diagnosticStatus(
  papers: DiagnosticPapers | null,
  diag?: DiagnosticProgress,
): DiagnosticStatus {
  if (diag?.passed) return { kind: 'passed' };
  const index = paperIndexForAttempt(diag);
  if (index < 0) return { kind: 'exhausted' };
  if (!papers) return { kind: 'unavailable' };
  const nth = index + 1;
  const paper = papers.papers[index];
  const id = PAPER_IDS[index];
  // 形状闸保证卷一永远是满的，所以走进这个分支的只会是卷二
  if (!paper || !isQidList(paper.qids)) return { kind: 'pending', nth, paper: id };
  return { kind: 'ready', nth, paper: id, qids: [...paper.qids] };
}

// ---- 键盘 ----

/**
 * 键盘选项：1–9 按序号，字母按选项自己的标号（大小写不敏感）。
 *
 * 4–12 个选项（A–L）、MAT 体例的小写 (a)–(e)、老卷的罗马标号都走这一条：
 * 字母键拿去匹配标号本身，所以按 a 选中 MAT 的 (a)，按 L 选中第 12 个选项；
 * 罗马标号里 ii / iii / iv 这类多字母的只能用数字键（单字母的 i、v 字母键也认）。
 * 找不到返回 null——按了个不存在的选项，什么都不发生
 */
export function choiceForKey(labels: readonly string[], key: string): string | null {
  if (/^[1-9]$/.test(key)) return labels[Number(key) - 1] ?? null;
  if (/^[a-zA-Z]$/.test(key)) {
    return labels.find((label) => label.toLowerCase() === key.toLowerCase()) ?? null;
  }
  return null;
}

/** 倒计时显示。一卷 10 题 × 240 秒，银行滚满也不过 40 分钟，m:ss 够用 */
export function fmtCountdown(totalSec: number): string {
  const safe = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
