'use client';

// 中/英切换钮。按钮上显示的是「按下去会切到的语言」（中文界面上写 EN，
// 反之写 中），这是切换控件的常规读法，比显示当前语言少一层歧义。

import { useLang } from '@/lib/LangContext';
import styles from './LangToggle.module.css';

export default function LangToggle() {
  const { t, toggle, lang } = useLang();

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={t.langToggle.aria}
      title={t.langToggle.title}
      lang={lang === 'zh' ? 'en' : 'zh-CN'}
    >
      {t.langToggle.label}
    </button>
  );
}
