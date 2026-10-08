// 05 密卷（Sealed Papers）的开放窗口与密码门槛。
//
// 用户 2026-10-08：「限时开放一下 MAT/TMUA 2024/2025 密卷内容；输入密码（略）即可
// （单独出个卡片模块）」。题池是 build-data 打了 sealed 的那批题（TMUA / MAT 的 2024、2025 卷）。
// 密码明文不进仓库——源码、测试、设计文档里都只有它的哈希；明文由用户自己掌握。
//
// 这是一道门槛，不是加密：本站是纯静态站，题目 JSON（public/exam/q/*.json）本身就公开放着，
// 谁都能直接取；密码只挡随手点进来的人，和管理调试页那道门是同一条先例（app/admin/page.tsx）。
// 这句话只写在代码注释里，不写到界面上给用户看（Design §16 的先例：界面上不出现写给维护者的话）。
//
// 代码里只存密码的 SHA-256 十六进制，不存明文；输入经 crypto.subtle.digest 算出来再比对。
// crypto.subtle 只在安全上下文里有（https 与 localhost / 127.0.0.1 都算）：拿不到时 checkSealedPassword
// 回 'unsupported'，面板据此给一句兜底提示，不抛错、不白屏。
//
// 改期：只改 SEALED_WINDOW 的两个时刻。换密码：只改 SEALED_PASSWORD_SHA256，新值这样算——
//   node -e "console.log(require('crypto').createHash('sha256').update('新密码').digest('hex'))"
// 解锁记录存的是本期印记（sealedStamp：until + 哈希前 12 位），所以改期、换密码之后旧解锁自然失效，
// 不用另写迁移；窗口过期后印记还在也不再生效（sealedAccess 同时看窗口）。
//
// 纯函数为主，时间一律由调用方传进来（now），node --test 直接测边界与时区。

import { SEALED_UNLOCK_KEY } from './storage.ts';

export interface SealedWindow {
  /** 开放起点（含），带时区的 ISO 8601 */
  from: string;
  /** 开放的最后一秒（含）：写到 23:59:59，这一整秒里都还开着 */
  until: string;
}

/** 本期开放窗口，北京时间。改期只改这两个字符串 */
export const SEALED_WINDOW: SealedWindow = {
  from: '2026-10-08T00:00:00+08:00',
  until: '2026-10-31T23:59:59+08:00',
};

/** 密码的 SHA-256（小写十六进制）。明文不进代码 */
export const SEALED_PASSWORD_SHA256 = '933d3878fadd4b2b69ca6fb316d454612d1696e832a497d77487adc8b404581e';

/** 连续输错几次进入冷却 */
export const SEALED_MAX_FAILS = 5;
/** 冷却多久（毫秒）。防手滑也防随手试；冷却完了计数从零起 */
export const SEALED_COOLDOWN_MS = 30_000;

/** 窗口三态：还没开 / 开着 / 本期已结束 */
export type SealedPhase = 'before' | 'open' | 'ended';

/**
 * 窗口的毫秒边界：[start, end)。end = until + 1 秒——until 写的是最后一秒，含。
 * 字符串解析不出来（写坏了）时两端都是 NaN，sealedPhase 按「已结束」处理：宁可关着，不能误开
 */
export function sealedBounds(window: SealedWindow = SEALED_WINDOW): { start: number; end: number } {
  const start = Date.parse(window.from);
  const until = Date.parse(window.until);
  return { start, end: Number.isFinite(until) ? until + 1000 : Number.NaN };
}

export function sealedPhase(now: number, window: SealedWindow = SEALED_WINDOW): SealedPhase {
  const { start, end } = sealedBounds(window);
  if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(now)) return 'ended';
  if (now < start) return 'before';
  return now < end ? 'open' : 'ended';
}

export function isSealedOpen(now: number, window: SealedWindow = SEALED_WINDOW): boolean {
  return sealedPhase(now, window) === 'open';
}

/**
 * 离下一次换相还有多少毫秒（开放前 → 开门那一刻；开放中 → 关门那一刻）；已结束就没有下一次，返回 null。
 * 页面挂着跨过边界时，卡面要自己翻过去，不等用户刷新
 */
export function msUntilSealedChange(now: number, window: SealedWindow = SEALED_WINDOW): number | null {
  const phase = sealedPhase(now, window);
  const { start, end } = sealedBounds(window);
  if (phase === 'before') return start - now;
  if (phase === 'open') return end - now;
  return null;
}

/** 本期结束那天的月、日，按 until 里写的那个时区（北京时间）读，不随浏览器时区换算 */
export function sealedUntilDate(window: SealedWindow = SEALED_WINDOW): { month: number; day: number } {
  const m = /^\d{4}-(\d{2})-(\d{2})/.exec(window.until);
  return { month: Number(m?.[1] ?? 0), day: Number(m?.[2] ?? 0) };
}

/** 本期印记：解锁时写进存储的就是它。改期（until 变）或换密码（哈希变）都会让旧印记对不上 */
export function sealedStamp(
  window: SealedWindow = SEALED_WINDOW,
  hash: string = SEALED_PASSWORD_SHA256,
): string {
  return `${window.until}|${hash.slice(0, 12)}`;
}

/** 能不能进密卷：存着的是本期印记，且此刻在窗口内。两条缺一不可 */
export function sealedAccess(
  stored: string | null,
  now: number,
  window: SealedWindow = SEALED_WINDOW,
  hash: string = SEALED_PASSWORD_SHA256,
): boolean {
  return stored === sealedStamp(window, hash) && isSealedOpen(now, window);
}

// ---- 存储（键在 lib/storage.ts 登记）----
// 无痕模式 / 配额满 / 存储被禁：读回 null、写静默失败——最坏是刷新后要再输一次密码

export function loadSealedStamp(): string | null {
  try {
    return localStorage.getItem(SEALED_UNLOCK_KEY);
  } catch {
    return null;
  }
}

export function saveSealedUnlock(stamp: string = sealedStamp()): void {
  try {
    localStorage.setItem(SEALED_UNLOCK_KEY, stamp);
  } catch {}
}

export function clearSealedUnlock(): void {
  try {
    localStorage.removeItem(SEALED_UNLOCK_KEY);
  } catch {}
}

// ---- 密码 ----

/** 安全上下文里才有 crypto.subtle（https、localhost）；http 的局域网地址上没有 */
export function sealedCryptoReady(): boolean {
  return typeof globalThis.crypto?.subtle?.digest === 'function';
}

/** 字符串的 SHA-256 小写十六进制；没有 crypto.subtle 时返回 null */
export async function sha256Hex(text: string): Promise<string | null> {
  if (!sealedCryptoReady()) return null;
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export type SealedCheck = 'ok' | 'wrong' | 'unsupported';

/**
 * 比对一次密码。首尾空白不算（手机输入法偶尔补一个空格），大小写算。
 * 环境不支持就回 'unsupported'，摘要本身出错（极少见）也按它处理，不抛到界面上
 */
export async function checkSealedPassword(
  input: string,
  hash: string = SEALED_PASSWORD_SHA256,
): Promise<SealedCheck> {
  try {
    const got = await sha256Hex(input.trim());
    if (got === null) return 'unsupported';
    return got === hash.toLowerCase() ? 'ok' : 'wrong';
  } catch {
    return 'unsupported';
  }
}

// ---- 输错冷却 ----

/** 连续输错的计数与冷却截止时刻。只活在页面内存里（刷新即清零）：这是门槛不是防线 */
export interface SealedTries {
  fails: number;
  lockedUntil: number;
}

export const NO_SEALED_TRIES: SealedTries = { fails: 0, lockedUntil: 0 };

/** 冷却还剩多少毫秒；不在冷却里就是 0 */
export function sealedCooldownLeft(tries: SealedTries, now: number): number {
  return Math.max(0, tries.lockedUntil - now);
}

/**
 * 记一次输错。第 SEALED_MAX_FAILS 次进入 SEALED_COOLDOWN_MS 的冷却，计数归零——冷却完了重新给满次数。
 * 冷却中的提交不该走到这里（面板会挡），走到了也不延长冷却、不计数
 */
export function noteSealedFailure(tries: SealedTries, now: number): SealedTries {
  if (sealedCooldownLeft(tries, now) > 0) return tries;
  const fails = tries.fails + 1;
  if (fails >= SEALED_MAX_FAILS) return { fails: 0, lockedUntil: now + SEALED_COOLDOWN_MS };
  return { fails, lockedUntil: 0 };
}
