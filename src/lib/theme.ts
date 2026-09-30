// 配色（浅色 / 深色 / 护眼）的唯一状态来源。
//
// 两处能切：答题页顶栏的「Color Scheme」下拉框、大厅右上角的配色圆钮（用户 2026-09-30：
// 「颜色切换的控件也单独放一个出来到主页」）。两处都从这里读、往这里写，任一处切了另一处立刻反映出来。
//
// 真源是 <html data-theme>（CSS 按它换整套变量，见 app/globals.css）：
//   - 首帧前由 app/layout.tsx 的内联脚本 THEME_INIT 按存值写好（认 'dark' / 'sepia'，其余一律 'light'），不闪
//   - 运行中由 setTheme 改：改属性、落盘、广播 THEME_EVENT；订阅方（lib/useTheme）据此重渲染
//
// 用带扩展名的相对路径引依赖（同 lib 里的写法），整个模块在 node --test 里也能直接加载。

import { THEME_KEY } from './storage.ts';

export type Theme = 'light' | 'dark' | 'sepia';

/** 三套配色，按控件上的排列顺序 */
export const THEMES: readonly Theme[] = ['light', 'dark', 'sepia'];

/** 运行中切换时在 window 上广播的事件名（事件名，不是存储键） */
export const THEME_EVENT = 'mcq-test:theme-change';

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark' || value === 'sepia';
}

/** 当前生效的配色：读 <html data-theme>。认不出（首帧脚本没跑，不该发生）按浅色 */
export function currentTheme(): Theme {
  const theme = document.documentElement.dataset.theme;
  return isTheme(theme) ? theme : 'light';
}

/** 切换配色：改属性（CSS 立刻生效）、落盘（下次首帧就按它）、广播给订阅方 */
export function setTheme(next: Theme): void {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {}
  window.dispatchEvent(new Event(THEME_EVENT));
}

/** 订阅运行中的切换；返回退订函数 */
export function subscribeTheme(onChange: () => void): () => void {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}
