// 题数上滑替换（components/setup/RollingText，Design §22 P8-A4 第 8 条）的状态推演，node --test 直接测。
//
// 一份 Roll 记着：此刻显示的文字、正在退场的上一份（没有就是 null）、换过几次（gen，动画元素的 key 靠它换新，
// 换新才会从头播）。首帧 gen 为 0——刚挂上的不播；文字没变就原样返回同一个对象（渲染期调用不会来回重渲染）。

/** 上滑替换一次的时长（与 RollingText.module.css 的 220ms 对齐） */
export const ROLL_MS = 220;

export interface Roll {
  text: string;
  prev: string | null;
  gen: number;
}

/** 刚挂上：只有这一份，不播 */
export function startRoll(text: string): Roll {
  return { text, prev: null, gen: 0 };
}

/** 文字变了：新的进场、旧的退场，gen + 1；没变就原样返回 */
export function rollTo(roll: Roll, text: string): Roll {
  if (roll.text === text) return roll;
  return { text, prev: roll.text, gen: roll.gen + 1 };
}

/** 这一轮播完（gen 对得上）：摘掉退场的那份；又换过一次了（gen 对不上）就别动，让新的那轮自己收尾 */
export function settleRoll(roll: Roll, gen: number): Roll {
  if (roll.gen !== gen || roll.prev === null) return roll;
  return { ...roll, prev: null };
}
