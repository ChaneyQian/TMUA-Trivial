// 整屏遮罩的全局标记：<html data-overlay>。
//
// 为什么要有：工牌浮层这类整屏遮罩带 backdrop-filter（把身后的页面整屏模糊）。遮罩底下的内容
// 每变一帧，浏览器就得把整屏的模糊重算一遍。设置页的光标聚光正是这种「每帧都在变」的东西：
// 遮罩一盖，聚光本来就看不见了，却还跟着指针逐帧重画、逼着整屏重新模糊（交叉审查 2026-09-29）。
// 遮罩开着时在 <html> 上挂 data-overlay，聚光（components/ambient/spotlight）每一下移动都现判它、
// 也订阅它的切换：挂上就熄灯、撤掉排着的帧、不再排新帧；摘掉之后下一下移动照常亮起。
//
// 用法：遮罩出现时 const release = holdOverlay()，消失时 release()。可以叠——两个遮罩都开着时
// 摘掉一个，标记还在；release 重复调用无害。标记从无到有、从有到无时在 window 上广播 OVERLAY_EVENT。
//
// 用带扩展名的相对路径引依赖（同 lib 里的写法），整个模块在 node --test 里也能直接加载。

/** 标记变化时在 window 上广播的事件名 */
export const OVERLAY_EVENT = 'mcq-test:overlay-change';

/** 此刻开着的遮罩数（按 holdOverlay 的份数计） */
let holders = 0;

/** 此刻有没有整屏遮罩开着：读 <html data-overlay> */
export function overlayOpen(): boolean {
  return Boolean(document.documentElement.dataset.overlay);
}

/** 按当前份数挂 / 摘标记；只在有无变化时广播 */
function sync(): void {
  const dataset = document.documentElement.dataset;
  const open = holders > 0;
  if (open === Boolean(dataset.overlay)) return;
  if (open) dataset.overlay = 'open';
  else delete dataset.overlay;
  window.dispatchEvent(new Event(OVERLAY_EVENT));
}

/** 遮罩出现：记一份、挂上标记。返回摘掉这一份的函数（重复调用无害） */
export function holdOverlay(): () => void {
  holders++;
  sync();
  let held = true;
  return () => {
    if (!held) return;
    held = false;
    holders = Math.max(0, holders - 1);
    sync();
  };
}

/** 订阅标记的有无变化；返回退订函数 */
export function subscribeOverlay(onChange: () => void): () => void {
  window.addEventListener(OVERLAY_EVENT, onChange);
  return () => window.removeEventListener(OVERLAY_EVENT, onChange);
}
