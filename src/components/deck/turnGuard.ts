// 转牌守卫（交叉审查 2026-09-29）。
//
// 中宽屏上侧牌露出大半张，第一下点它把它转到前位——牌还在指针底下滑（与槽位位移的过渡同长），
// 紧跟着的第二下就落到这张新前牌的命中层（展开面板）或快速开始（直接开考、进全屏）上。
// 审查方实测 1440 宽下快速双击侧牌贴前牌那一截，12 次开考 7 次。
// 所以转牌之后的这段时间里，卡上的点击一律不认——同 Diagnostic 那 300ms 防连跳的思路。
//
// 键盘不受影响：Enter 展开是焦点所在处的操作，没有「牌在指针底下滑」的问题；但焦点若停在
// 快速开始上，Enter / 空格走的是按钮自己的点击，照样过这道守卫，转牌中途不会误开考。
//
// 纯函数、不碰 DOM，node --test 直接测；CardDeck 把 TURN_MS 写成 --turn-ms 交给样式表，
// 槽位位移的过渡读的就是它——守卫窗口和过渡时长只有这一个出处。

/** 转牌的过渡时长，也是转牌后不认点击的窗口（毫秒） */
export const TURN_MS = 350;

/**
 * 距上次转牌过了多久才接受卡上的激活（点击命中层、快速开始）。
 * lastTurnAt 为 -Infinity（还没转过）时一律接受；时钟回拨（now 早于上次转牌）也接受——
 * 宁可放过一次，不能把卡锁死。
 */
export function acceptsActivation(lastTurnAt: number, now: number, windowMs: number = TURN_MS): boolean {
  if (!Number.isFinite(lastTurnAt) || !Number.isFinite(now)) return true;
  const elapsed = now - lastTurnAt;
  return elapsed < 0 || elapsed >= windowMs;
}
