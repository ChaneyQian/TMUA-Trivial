'use client';

// 光效开关钮：挨着右上角的中/英钮，同款圆形。开 / 关见 lib/fx。
//
// 图标的亮 / 暗由 CSS 按 <html data-fx> 决定，不由 React 状态决定：静态导出的 HTML 按「开」
// 预渲染，关着的用户在水合前也该看到「关」的图标，不闪一下。读屏用的 aria-pressed 与
// aria-label 由 React 给（水合之后才可能被读到）。

import { setFx } from '@/lib/fx';
import { useLang } from '@/lib/LangContext';
import { useFx } from '@/lib/useFx';
import langStyles from './LangToggle.module.css';
import styles from './FxToggle.module.css';

export default function FxToggle() {
  const { t } = useLang();
  const on = useFx() === 'on';

  return (
    <button
      type="button"
      className={`${langStyles.toggle} ${styles.fx}`}
      onClick={() => setFx(on ? 'off' : 'on')}
      aria-pressed={on}
      aria-label={on ? t.fxToggle.ariaOn : t.fxToggle.ariaOff}
      title={t.fxToggle.title}
    >
      {/* 四角星：开时实心、带一颗小星；关时只剩空心轮廓 */}
      <svg className={styles.icon} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          className={styles.star}
          d="M11 3.5c.5 3.9 2.6 6 6.5 6.5-3.9.5-6 2.6-6.5 6.5-.5-3.9-2.6-6-6.5-6.5 3.9-.5 6-2.6 6.5-6.5z"
        />
        <path
          className={styles.spark}
          d="M18 14.5c.2 1.5 1 2.3 2.5 2.5-1.5.2-2.3 1-2.5 2.5-.2-1.5-1-2.3-2.5-2.5 1.5-.2 2.3-1 2.5-2.5z"
        />
      </svg>
    </button>
  );
}
