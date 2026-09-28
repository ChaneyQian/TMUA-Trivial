'use client';

// 卡片随指针的轻微 3D 倾斜 + 跟手高光。可复用：前牌（CardDeck）在用，
// P8-B 的工牌也会共用它——两处手感一致。
//
// 用法：
//   const tiltRef = useCardTilt<HTMLDivElement>({ maxDeg: 6 });
//   <div ref={tiltRef} className={styles.card}>   ← 收指针、量尺寸、挂变量的一层（本身不转）
//     <div className={styles.tilt}>…</div>       ← 真正倾斜的里层：怎么用变量由各自的 CSS 决定
//   </div>
//
// 钩子只往 ref 元素上写这几样，别的一概不碰（不写 transform，不动 class）：
//   --tilt-rx / --tilt-ry   两个轴的倾角，带 deg 单位（正中为 0）
//   --glare-x / --glare-y   高光圆心，占元素宽 / 高的百分比
//   --tilt-on               1 = 正在跟手，0 = 已收手；纯数字，可以进 calc
//   data-tilting            跟手期间存在。CSS 靠它切「跟手」与「回弹」两套过渡，
//                           也靠它只在跟手时挂 3D transform（静止时不常驻合成层）
//
// 纪律：
//   - 只认鼠标，且只在 (hover: hover) and (pointer: fine)、非减动效时启用：
//     触屏没有悬停；减动效下由交互触发的动效一概不做。媒体条件中途变了也跟着收手
//   - pointermove 走 rAF 节流，一帧最多写一次变量，不进 React：pointermove 与刷新率
//     同频，每帧 setState 就是每帧重渲染整棵子树
//   - 量的是 ref 元素（不倾斜的外层）的包围盒。量正在倾斜的那层的话，
//     它一歪包围盒就变，倾角会追着自己跑。在输入阶段量、一帧一次，rAF 里只写不读
//   - 离开 / 失焦 / 页面隐藏 / 停用 / 卸载即收手；收手只摘变量，回正的补间交给 CSS
//
// 换算本身（指针 → 角度 / 高光坐标）是 lib/tilt.ts 里的纯函数。这里用带扩展名的
// 相对路径引它（同 lib 里的写法），整个模块在 node --test 里也能直接加载。

import { useCallback, type RefCallback } from 'react';
import { TILT_MAX_DEG, tiltPose } from '../../lib/tilt.ts';

export const FINE_POINTER = '(hover: hover) and (pointer: fine)';
export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** 钩子会写的全部 CSS 变量；卸载时逐个摘掉 */
export const TILT_VARS = ['--tilt-rx', '--tilt-ry', '--glare-x', '--glare-y', '--tilt-on'] as const;

export interface CardTiltOptions {
  /** 最大倾角（度），默认 6 */
  maxDeg?: number;
  /** false 时不挂监听、不写变量；从 true 翻到 false 会先收手复位。默认 true */
  enabled?: boolean;
}

/**
 * 返回一个 ref 回调，挂到「不倾斜的外层」上。选项变了回调才换身份
 * （React 会先摘旧的、再挂新的），所以每次渲染都传字面量对象也没关系。
 */
export function useCardTilt<T extends HTMLElement>({
  maxDeg = TILT_MAX_DEG,
  enabled = true,
}: CardTiltOptions = {}): RefCallback<T> {
  return useCallback(
    (node: T | null) => {
      if (!node || !enabled) return;
      return attachCardTilt(node, maxDeg);
    },
    [enabled, maxDeg],
  );
}

/**
 * 不经 React 直接挂上倾斜：返回摘除函数（即 React 19 的 ref 清理）。
 * 摘除后元素上不留任何变量与属性，重复摘是幂等的；同一个元素只挂一次
 * （React 的 ref 本来就是一挂一摘，自己手动调用时别叠挂）。
 */
export function attachCardTilt(node: HTMLElement, maxDeg: number = TILT_MAX_DEG): () => void {
  const fine = window.matchMedia(FINE_POINTER);
  const reduced = window.matchMedia(REDUCED_MOTION);
  let frame = 0;
  let live = false;
  let x = 0;
  let y = 0;
  let rect: DOMRect | null = null;

  /** rAF 里只写不读：包围盒在输入阶段已经量好 */
  const apply = () => {
    frame = 0;
    if (!rect) return;
    const pose = tiltPose(x, y, rect, maxDeg);
    const style = node.style;
    style.setProperty('--tilt-rx', `${pose.rx.toFixed(2)}deg`);
    style.setProperty('--tilt-ry', `${pose.ry.toFixed(2)}deg`);
    style.setProperty('--glare-x', `${pose.gx.toFixed(1)}%`);
    style.setProperty('--glare-y', `${pose.gy.toFixed(1)}%`);
    if (!live) {
      live = true;
      style.setProperty('--tilt-on', '1');
      node.dataset.tilting = '';
    }
  };

  /** 收手：停帧、摘倾角。高光坐标留着，让高光在原地淡出，不先跳回正中再淡 */
  const settle = () => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    if (!live) return;
    live = false;
    node.style.removeProperty('--tilt-rx');
    node.style.removeProperty('--tilt-ry');
    node.style.setProperty('--tilt-on', '0');
    delete node.dataset.tilting;
  };

  const onMove = (e: PointerEvent) => {
    // 触屏横滑归 CardDeck 的 touch 那一套；这里只认鼠标
    if (e.pointerType !== 'mouse' || !fine.matches || reduced.matches) return;
    x = e.clientX;
    y = e.clientY;
    // 这一帧已经排上了：只记下最新的坐标。页面隐藏时不排帧——
    // 后台标签页的 rAF 本来就会被冻住，排了也只是悬着
    if (frame || document.hidden) return;
    // 一帧只量一次包围盒，而且在输入阶段量：这时上一帧的样式刚算完、这一帧
    // 还没人写过。挪到 rAF 里量，会撞上同一帧里先跑的写入（跟手补间、
    // 环境光透镜的变量），逼出一次同步样式计算——实测每帧多算一遍样式
    rect = node.getBoundingClientRect();
    frame = window.requestAnimationFrame(apply);
  };

  const onVisibility = () => {
    if (document.hidden) settle();
  };

  const onMedia = () => {
    if (!fine.matches || reduced.matches) settle();
  };

  node.addEventListener('pointermove', onMove, { passive: true });
  node.addEventListener('pointerleave', settle);
  window.addEventListener('blur', settle);
  document.addEventListener('visibilitychange', onVisibility);
  fine.addEventListener('change', onMedia);
  reduced.addEventListener('change', onMedia);

  return () => {
    node.removeEventListener('pointermove', onMove);
    node.removeEventListener('pointerleave', settle);
    window.removeEventListener('blur', settle);
    document.removeEventListener('visibilitychange', onVisibility);
    fine.removeEventListener('change', onMedia);
    reduced.removeEventListener('change', onMedia);
    settle();
    // 摘干净：这个元素接下来可能是一张后牌，身上不该留着前牌的姿态
    for (const name of TILT_VARS) node.style.removeProperty(name);
  };
}
