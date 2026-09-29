// 工牌浮层开着时的全局按键：Esc 收起；Tab / Shift+Tab 只在几个停靠点之间循环（轻量焦点陷阱）。
//
// 浮层是 aria-modal 的对话框，可 Tab 一按焦点就跑到身后被遮住的设置页上——看不见焦点在哪，
// 回车还会按到看不见的按钮。工牌上能操作的只有两样：卡片本身（翻开 / 合上）和「收起工牌」，
// 焦点就在这两者之间转。
//
// 纯函数、不碰 DOM 全局（当前焦点由调用方传进来），node --test 直接跑（见 tests/badge.test.mjs）。

/** 按键事件里用得到的那几样 */
export interface BadgeKeyEvent {
  key: string;
  shiftKey: boolean;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  preventDefault(): void;
}

export interface Focusable {
  focus(): void;
}

/**
 * 此刻的停靠点：卡片，外加「收起工牌」——但它在提示行里，落下途中提示行还没淡入
 * （opacity 0，约 1.25s 后才出现），落稳之前不当停靠点，免得焦点停在一个看不见的按钮上
 */
export function badgeStops<T>(stage: string, card: T | null, stowButton: T | null): (T | null)[] {
  return stage === 'dropping' ? [card] : [card, stowButton];
}

/**
 * Tab / Shift+Tab 该把焦点交给谁：停靠点里的下一个 / 上一个，首尾相接。
 * 还没挂载的停靠点（null）跳过；焦点不在停靠点上（比如在 body 上）时，Tab 去第一个、Shift+Tab 去最后一个。
 * 不是 Tab、带了 Alt / Ctrl / Meta（那是浏览器或系统的组合键）、或一个停靠点都没有时返回 null：不拦
 */
export function nextFocus<T extends Focusable>(
  e: Pick<BadgeKeyEvent, 'key' | 'shiftKey' | 'altKey' | 'ctrlKey' | 'metaKey'>,
  stops: readonly (T | null | undefined)[],
  active: unknown,
): T | null {
  if (e.key !== 'Tab' || e.altKey || e.ctrlKey || e.metaKey) return null;
  const list = stops.filter((stop): stop is T => stop != null);
  if (list.length === 0) return null;
  const at = list.indexOf(active as T);
  if (e.shiftKey) return list[at <= 0 ? list.length - 1 : at - 1];
  return list[at < 0 ? 0 : (at + 1) % list.length];
}

/**
 * 浮层开着时挂在 window 上的 keydown：Esc 收起；Tab / Shift+Tab 在停靠点之间循环（拦下默认的焦点移动）。
 * 处理了返回 true。
 *
 * Esc 不拦冒泡：这个监听挂在 window 上，是冒泡的最后一站，拦了也没有下家。设置页那边的 Esc
 * 「退回选区」（ExamApp 里 .stage 的 onKeyDown）早在冒泡途中就跑过了——挡住它的是那里自己的判断：
 * 页面上有 aria-modal 的对话框（这张工牌浮层）就不动
 */
export function onBadgeKey(
  e: BadgeKeyEvent,
  stops: readonly (Focusable | null | undefined)[],
  active: unknown,
  stow: () => void,
): boolean {
  if (e.key === 'Escape') {
    stow();
    return true;
  }
  const next = nextFocus(e, stops, active);
  if (!next) return false;
  e.preventDefault();
  next.focus();
  return true;
}
