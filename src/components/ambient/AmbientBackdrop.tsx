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
//     聚光的监听、节流与收手都在 ./spotlight（attachSpotlight），这里只管挂与摘

import { useEffect, useRef } from 'react';
import { ZONES, type ZoneId } from '@/components/deck/zones';
import styles from './Ambient.module.css';
import { attachSpotlight, tintVars } from './spotlight';

export default function AmbientBackdrop({ zone }: { zone: ZoneId }) {
  const lensRef = useRef<HTMLDivElement | null>(null);

  // 挂一次、卸载时摘：媒体条件（有没有鼠标、减动效）由 attachSpotlight 逐次现判并订阅变化，
  // 这里不在挂载时一锤定音
  useEffect(() => {
    const lens = lensRef.current;
    if (!lens) return;
    return attachSpotlight(lens);
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
      {/* 透镜在最外层之内：它的线读的 --tint 就是上面按当前区写的那一份 */}
      <div ref={lensRef} className={styles.lens}>
        <div className={styles.lensGrid} />
      </div>
    </div>
  );
}
