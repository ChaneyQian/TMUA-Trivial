'use client';

// 配色的 React 读法：订阅 lib/theme 的切换事件，读 <html data-theme>（同 lib/useFx 的写法）。
// 静态导出按「浅色」预渲染（getServerSnapshot），水合后按真实的 data-theme 再渲染一次；
// 页面本身的颜色从首帧起就由 CSS 按首帧脚本写好的 data-theme 决定，不靠这里。

import { useSyncExternalStore } from 'react';
import { currentTheme, subscribeTheme, type Theme } from './theme.ts';

const onServer = (): Theme => 'light';

export function useTheme(): Theme {
  return useSyncExternalStore(subscribeTheme, currentTheme, onServer);
}
