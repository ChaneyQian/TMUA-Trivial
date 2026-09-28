// 设置页环境光的两件非渲染逻辑，单独成模块好直接用 node --test 测：
//   tintVars       某个区的两道区色，写成 CSS 变量（光晕层与聚光的线都读它）
//   attachSpotlight 光标聚光：透镜跟到指针处，只写 CSS 变量与 data-lit，不进 React
//
// 用带扩展名的相对路径引依赖（同 lib 里的写法），整个模块在 node 里也能直接加载。

import type { CSSProperties } from 'react';
import { zoneById, type ZoneId } from '../deck/zones.ts';
import { FINE_POINTER, REDUCED_MOTION } from '../fx/useCardTilt.ts';

export type TintVars = CSSProperties & Record<'--tint' | '--tint2', string>;

/** 区色 → CSS 变量。换区时 AmbientBackdrop 把它写在最外层，透镜里亮起的网格线就跟着换色 */
export function tintVars(id: ZoneId): TintVars {
  const zone = zoneById(id);
  return { '--tint': zone.tint, '--tint2': zone.tint2 };
}

/**
 * 光标聚光：透镜整体 transform 到指针处（CSS 那边读 --mx / --my），亮起时挂 data-lit。
 *
 * - 只认鼠标，且只在 (hover: hover) and (pointer: fine)、非减动效时亮：每一下移动都现判，
 *   媒体条件中途变了（接上 / 拔掉鼠标、打开减动效）也订阅着——变得不满足就熄，
 *   恢复后下一下移动自然重新亮起
 * - pointermove 走 rAF 节流，一帧最多写一次；页面隐藏时不排帧
 * - 指针离开窗口 / 窗口失焦 / 页面隐藏即熄
 * 返回摘除函数：监听一一摘掉、排着的帧撤掉、熄灯。
 */
export function attachSpotlight(lens: HTMLElement): () => void {
  const fine = window.matchMedia(FINE_POINTER);
  const reduced = window.matchMedia(REDUCED_MOTION);
  let frame = 0;
  let lit = false;
  let x = 0;
  let y = 0;

  const paint = () => {
    frame = 0;
    lens.style.setProperty('--mx', `${x}px`);
    lens.style.setProperty('--my', `${y}px`);
    if (!lit) {
      lit = true;
      lens.dataset.lit = 'true';
    }
  };

  const dim = () => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    if (!lit) return;
    lit = false;
    delete lens.dataset.lit;
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || !fine.matches || reduced.matches) return;
    x = e.clientX;
    y = e.clientY;
    // 页面隐藏时不排帧：后台标签页的 rAF 本来就会被冻住，排了也只是悬着
    if (!frame && !document.hidden) frame = window.requestAnimationFrame(paint);
  };

  // 指针离开窗口时 pointerout 的 relatedTarget 为 null；窗口内换元素时不为 null
  const onOut = (e: PointerEvent) => {
    if (!e.relatedTarget) dim();
  };
  const onVisibility = () => {
    if (document.hidden) dim();
  };
  const onMedia = () => {
    if (!fine.matches || reduced.matches) dim();
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerout', onOut);
  window.addEventListener('blur', dim);
  document.addEventListener('visibilitychange', onVisibility);
  fine.addEventListener('change', onMedia);
  reduced.addEventListener('change', onMedia);

  return () => {
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerout', onOut);
    window.removeEventListener('blur', dim);
    document.removeEventListener('visibilitychange', onVisibility);
    fine.removeEventListener('change', onMedia);
    reduced.removeEventListener('change', onMedia);
    dim();
  };
}
