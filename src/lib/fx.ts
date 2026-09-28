// 光效开关（用户 2026-10：「部分渲染可能会卡顿，所以提供开关」）。
//
// 管的：大厅的环境光（区色光晕、坐标纸网格、光标聚光）、前牌的倾斜与高光、前牌的区色投影、
// 纯装饰的无限循环动画（公告药丸呼吸灯、充电条满格流光、公告标题流光、工牌丝带摆动……）。
// 不管的：操作反馈类的过渡（转牌、展开、按钮按压）——关了反而难用。
// prefers-reduced-motion: reduce 另走各处自己的降级块：不论开关，动效都按关处理。
//
// 真源是 <html data-fx="on|off">：
//   - 首帧前由 app/layout.tsx 的内联脚本 FX_INIT 写好：有存值用存值，没有就按设备推断
//     （推断结果不写回存储），CSS 从第一帧起就按它生效，不闪
//   - 运行中由 setFx 改：改属性、落盘、广播 FX_EVENT；订阅方（useFx、useCardTilt、
//     attachSpotlight）据此立刻收手或恢复
//
// 用带扩展名的相对路径引依赖（同 lib 里的写法），整个模块在 node --test 里也能直接加载。

import { FX_KEY } from './storage.ts';

export type Fx = 'on' | 'off';

/** 运行中切换时在 window 上广播的事件名（事件名，不是存储键） */
export const FX_EVENT = 'mcq-test:fx-change';

export function isFx(value: unknown): value is Fx {
  return value === 'on' || value === 'off';
}

/** navigator 上用得到的三样（都是可选的：Safari / Firefox 大多没有 connection 与 deviceMemory） */
export interface FxDevice {
  connection?: { saveData?: boolean } | null;
  hardwareConcurrency?: number;
  deviceMemory?: number;
}

/**
 * 没有存值时的默认：开了省流量模式、≤ 2 个逻辑核、≤ 2GB 内存的设备默认关，其余默认开。
 * 拿不到的指标不算数（0 或缺失都当「不知道」，不当低配）。
 * 同一套判据在 app/layout.tsx 的首帧脚本里还有一份字面量版本，测试逐条对拍
 */
export function inferFx(device: FxDevice): Fx {
  if (device.connection?.saveData === true) return 'off';
  const cores = device.hardwareConcurrency;
  if (typeof cores === 'number' && cores > 0 && cores <= 2) return 'off';
  const memory = device.deviceMemory;
  if (typeof memory === 'number' && memory > 0 && memory <= 2) return 'off';
  return 'on';
}

/** 存值（用户手动切过）优先；没有、或是认不出的值（比如同 origin 邻居写的）才推断 */
export function resolveFx(stored: string | null | undefined, device: FxDevice): Fx {
  return isFx(stored) ? stored : inferFx(device);
}

/** 当前生效的档位：读 <html data-fx>。首帧脚本没跑（不该发生）时按开 */
export function currentFx(): Fx {
  return document.documentElement.dataset.fx === 'off' ? 'off' : 'on';
}

/** 用户手动切换：改属性（CSS 立刻生效）、落盘（以后就以存值为准）、广播给订阅方 */
export function setFx(next: Fx): void {
  document.documentElement.dataset.fx = next;
  try {
    localStorage.setItem(FX_KEY, next);
  } catch {}
  window.dispatchEvent(new Event(FX_EVENT));
}

/** 订阅运行中的切换；返回退订函数 */
export function subscribeFx(onChange: () => void): () => void {
  window.addEventListener(FX_EVENT, onChange);
  return () => window.removeEventListener(FX_EVENT, onChange);
}
