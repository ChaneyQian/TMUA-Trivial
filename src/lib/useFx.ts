'use client';

// 光效开关的 React 读法：订阅 lib/fx 的切换事件，读 <html data-fx>。
// 服务端 / 静态导出按「开」预渲染（getServerSnapshot），水合时 React 先按「开」对上预渲染的 HTML，
// 紧接着按真实的 data-fx 再渲染一次——关着的用户那一瞬间看不到环境光，靠的是 CSS 从首帧起
// 就按 data-fx="off" 把它藏掉（Ambient.module.css），不是靠这里。

import { useSyncExternalStore } from 'react';
import { currentFx, subscribeFx, type Fx } from './fx.ts';

const onServer = (): Fx => 'on';

export function useFx(): Fx {
  return useSyncExternalStore(subscribeFx, currentFx, onServer);
}
