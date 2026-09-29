// 小助手逐帧动画在「减动效」与「光效关」下怎么收（纯函数：PixelCompanion 的计时与渲染、测试共用一份）。
//
//   减动效：循环帧冻住；一次性动作（庆祝 / 跳一下 / 答错）也不放，直接落到它之后的状态。
//   光效关：只冻循环帧——待机、等待、陪解题、复盘这些只要页面开着就一直在换帧，是持续的重绘；
//           一次性反馈动作照放：它们是对操作的回应（点了它、答错了），几帧就停。
//   冻住的循环一律停在第 0 帧（每一行的静止姿势），不停在切换那一刻碰巧走到的中间帧。

/** run：按帧时长往下走；hold：冻在第 0 帧；skip：一次性动作不放，直接落到之后的状态 */
export type FramePlan = 'run' | 'hold' | 'skip';

export function framePlan(loop: boolean, reducedMotion: boolean, fxOff: boolean): FramePlan {
  if (reducedMotion) return loop ? 'hold' : 'skip';
  return loop && fxOff ? 'hold' : 'run';
}

/** 画在屏幕上的那一帧：冻住时是第 0 帧，其余照状态里记的帧 */
export function shownFrame(frame: number, plan: FramePlan): number {
  return plan === 'hold' ? 0 : frame;
}
