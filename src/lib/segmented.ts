// 分段单选组（components/setup/SegmentedGroup）的纯逻辑，node --test 直接测，不碰 DOM、不认 React：
//   1. 键盘：当前索引 + 按键 + 禁用表 → 焦点（连同选中）该落到第几项
//   2. roving tabindex：整组只留一个 Tab 位，落在哪一项
//   3. 滑动指示块：各项的布局盒 + 选中项 → 指示块画在哪；折成多行、没有选中项时不画
//
// 键盘契约照 WAI-ARIA 的单选组：←/↑ 上一项、→/↓ 下一项，到头绕回另一头；选择跟随焦点。
// 另加 Home / End（需求 §22 P8-A3）。禁用项一律跳过——它本来也拿不到焦点。

/** 一项的布局盒：offsetLeft / offsetTop / offsetWidth / offsetHeight（相对组容器，不受 transform 影响） */
export interface SegBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** 方向键的步进：左、上是上一项，右、下是下一项 */
const STEP: Readonly<Record<string, number>> = {
  ArrowLeft: -1,
  ArrowUp: -1,
  ArrowRight: 1,
  ArrowDown: 1,
};

/**
 * 按了 key 之后焦点（连同选中）该落到第几项。
 * - ←/↑ 上一项、→/↓ 下一项，到头绕回另一头；Home / End 第一个 / 最后一个可用项；禁用项一律跳过
 * - 不是这六个键、组是空的、或全部禁用：返回 null——调用方什么都不做，也不拦浏览器的默认行为
 * - 只有一个可用项：方向键落回它自己（调用方照常拦下默认行为，页面不会跟着滚）
 * - current 不在范围里（比如 -1）时按「站在第一项之前」算：→ 到第一个可用项，← 到最后一个
 */
export function nextSegIndex(current: number, key: string, disabled: readonly boolean[]): number | null {
  const n = disabled.length;
  if (n === 0 || disabled.every(Boolean)) return null;
  if (key === 'Home') return disabled.indexOf(false);
  if (key === 'End') return disabled.lastIndexOf(false);
  const step = STEP[key];
  if (!step) return null;
  let at = Number.isInteger(current) && current >= 0 && current < n ? current : step > 0 ? -1 : n;
  for (let k = 0; k < n; k++) {
    at = (at + step + n) % n;
    if (!disabled[at]) return at;
  }
  return null;
}

/**
 * roving tabindex 的那一个 Tab 位：选中项；没有选中项（或选中项被禁用了，拿不到焦点）就是第一个可用项；
 * 全部禁用返回 -1（整组都不可聚焦，本来也没什么可按的）
 */
export function tabStopIndex(checked: number, disabled: readonly boolean[]): number {
  if (Number.isInteger(checked) && checked >= 0 && checked < disabled.length && !disabled[checked]) return checked;
  return disabled.indexOf(false);
}

/**
 * 指示块该画在哪：就是选中项的布局盒。以下几种不画（返回 null），选中项自己带底色：
 * - 没有选中项（题目数量填了个不在预设里的数）
 * - 各项不在同一行（窄屏折成了多行）：指示块只会横着滑，跨行的位置算出来也是错的
 * - 选中项还没排版（宽或高为 0，比如所在的面板还没显示）
 */
export function indicatorBox(items: readonly SegBox[], checked: number): SegBox | null {
  if (!Number.isInteger(checked) || checked < 0 || checked >= items.length) return null;
  const top = items[0].y;
  if (items.some((item) => item.y !== top)) return null;
  const box = items[checked];
  if (!(box.w > 0 && box.h > 0)) return null;
  return { x: box.x, y: box.y, w: box.w, h: box.h };
}

/** 两个盒是不是同一个位置与尺寸（没变就不用重写、更不能打断正在走的滑动） */
export function sameBox(a: SegBox | null, b: SegBox | null): boolean {
  if (!a || !b) return a === b;
  return a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;
}
