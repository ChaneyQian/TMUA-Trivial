// 一次只放一个进去（Design §22 P8-A4：开考防连点）。
//
// 开考从点下去到题目载入完成是一段异步：按钮在 phase 变成 'loading' 的那次渲染之后才置灰，
// 连点、按住 Enter 的连发、别处代码的重复调用，都可能在那之前再敲一次 start()。
// 这里在调用方持有的一个旗子（React 里是 useRef，跨渲染不丢）上把关：
//   - 前一次还没结束（成功、失败都算结束）时再来的一律不认，返回 undefined，task 一行都不跑
//   - task 是同步调用的：它 await 之前的那段同步代码（requestFullscreen）仍在用户手势的调用链里
//   - 结束时（含抛错）放下旗子；抛错照原样抛给调用方
//
// 纯函数、不碰 DOM，node --test 直接测。

export interface Flag {
  current: boolean;
}

export async function runExclusive<T>(flag: Flag, task: () => Promise<T>): Promise<T | undefined> {
  if (flag.current) return undefined;
  flag.current = true;
  try {
    return await task();
  } finally {
    flag.current = false;
  }
}
