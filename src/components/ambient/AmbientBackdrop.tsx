'use client';

// 设置页（选区 deck / 配置面板 / 成绩回顾）底下的环境光：
//   a) 区色光晕：每区一层、三团超大 radial-gradient，换区靠两层 opacity 交叉淡变
//   b) 坐标纸网格：极淡的 1px 方格，边缘渐隐，呼应封面的方格纸
//   c) 光标聚光：鼠标附近的网格线被区色照亮一点（只给有鼠标的设备）
//
// 只在 setup / loading 两相挂载。考试与 Diagnostic 模拟的是正式机考，
// 那里不许出现任何环境光、网格或跟随光标的东西——挂载点见 ExamApp 的设置页分支。
//
// 性能纪律：
//   - 光斑是静态渐变，只用 transform 慢漂（合成器层），不上 blur 滤镜；
//   - 换区不去过渡渐变本身，每区一层、只过渡 opacity；
//   - 聚光走 rAF 节流，只往本层元素上写 CSS 变量，不触发 React 重渲染；
//     透镜整体用 transform 平移、里层网格反向平移抵消，跟手全程不重绘。

import { useEffect, useRef, type CSSProperties } from 'react';
import { ZONES, zoneById, type ZoneId } from '@/components/deck/zones';
import styles from './Ambient.module.css';

/** 聚光只给「能悬停的精确指针」：触屏没有悬停，光也就无处可跟 */
const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

type TintVars = CSSProperties & Record<'--tint' | '--tint2', string>;

function tintVars(id: ZoneId): TintVars {
  const zone = zoneById(id);
  return { '--tint': zone.tint, '--tint2': zone.tint2 };
}

export default function AmbientBackdrop({ zone }: { zone: ZoneId }) {
  const lensRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const lens = lensRef.current;
    if (!lens) return;
    // 跟手移动本身就是交互触发的动效，减动效下整个不开；触屏同样不开
    if (!window.matchMedia(FINE_POINTER).matches) return;
    if (window.matchMedia(REDUCED_MOTION).matches) return;

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

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      // 页面隐藏时不排帧：后台标签页的 rAF 本来就会被冻住，排了也只是悬着
      if (!frame && !document.hidden) frame = window.requestAnimationFrame(paint);
    };

    const dim = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      if (lit) {
        lit = false;
        delete lens.dataset.lit;
      }
    };

    // 指针离开窗口时 pointerout 的 relatedTarget 为 null；窗口内换元素时不为 null
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) dim();
    };
    const onVisibility = () => {
      if (document.hidden) dim();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerout', onOut);
    window.addEventListener('blur', dim);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerout', onOut);
      window.removeEventListener('blur', dim);
      document.removeEventListener('visibilitychange', onVisibility);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={styles.backdrop} data-zone={zone} style={tintVars(zone)} aria-hidden="true">
      {/* 每区一层、各带自己的区色，当前区那层 opacity 1。换区时新旧两层同时过渡，
          颜色就平滑地换过去了；快速连切时每层各走各的淡变，不会出现某层半透明时
          被就地改色的硬切 */}
      {ZONES.map((z) => (
        <div
          key={z.id}
          className={`${styles.glow} ${z.id === zone ? styles.glowOn : ''}`}
          data-zone={z.id}
          style={tintVars(z.id)}
        >
          <span className={`${styles.spot} ${styles.spotA}`} />
          <span className={`${styles.spot} ${styles.spotB}`} />
          <span className={`${styles.spot} ${styles.spotC}`} />
        </div>
      ))}
      <div className={styles.grid} />
      <div ref={lensRef} className={styles.lens}>
        <div className={styles.lensGrid} />
      </div>
    </div>
  );
}
