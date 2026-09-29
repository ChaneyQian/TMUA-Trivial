// 转牌守卫（交叉审查 2026-09-29）。
//
// 中宽屏上侧牌露出大半张，第一下点它把它转到前位——牌还在指针底下滑（与槽位位移的过渡同长），
// 紧跟着的第二下就落到这张新前牌的命中层（展开面板）或快速开始（直接开考、进全屏）上。
// 审查方实测 1440 宽下快速双击侧牌贴前牌那一截，12 次开考 7 次。
// 所以转牌之后的这段时间里，指针在卡上的点击一律不认——同 Diagnostic 那 300ms 防连跳的思路。
//
// 键盘不存在「牌在指针底下滑」的问题，所以命中层上键盘触发的激活照常接受：鼠标点侧牌之后焦点
// 就停在那张牌的命中层上（tabIndex -1 的按钮），紧接着按 Enter / 空格展开是有意的操作，不该被吞掉
// （第 5 轮审查）。快速开始例外：它直接开考，不论键盘还是指针都等牌停稳，转牌中途不会误开考。
//
// 纯函数、不碰 DOM，node --test 直接测；CardDeck 把 TURN_MS 写成 --turn-ms 交给样式表，
// 槽位位移的过渡读的就是它——守卫窗口和过渡时长只有这一个出处。

/** 转牌的过渡时长，也是转牌后不认指针点击的窗口（毫秒） */
export const TURN_MS = 350;

/** 这一下激活从哪来：指针（鼠标、触屏、笔）点的，还是键盘在按钮上按 Enter / 空格合成的 */
export type ActivationSource = 'pointer' | 'keyboard';

/**
 * 从 click 事件认来源：detail 是连击数，指针点的从 1 起；键盘在按钮上按 Enter / 空格合成的
 * click 为 0（程序里调 el.click() 也是 0——同样不是「牌在指针底下滑」，一并按键盘算）
 */
export function activationSource(event: { detail: number }): ActivationSource {
  return event.detail === 0 ? 'keyboard' : 'pointer';
}

export interface ActivationOptions {
  /** 默认按指针算：调用方不说来源就走最严的那条 */
  source?: ActivationSource;
  windowMs?: number;
}

/**
 * 距上次转牌过了多久才接受卡上的激活。
 * - 指针：TURN_MS 之内不认
 * - 键盘：照常接受
 * lastTurnAt 为 -Infinity（还没转过）时一律接受；时钟回拨（now 早于上次转牌）也接受——
 * 宁可放过一次，不能把卡锁死。
 */
export function acceptsActivation(
  lastTurnAt: number,
  now: number,
  { source = 'pointer', windowMs = TURN_MS }: ActivationOptions = {},
): boolean {
  if (source === 'keyboard') return true;
  if (!Number.isFinite(lastTurnAt) || !Number.isFinite(now)) return true;
  const elapsed = now - lastTurnAt;
  return elapsed < 0 || elapsed >= windowMs;
}
