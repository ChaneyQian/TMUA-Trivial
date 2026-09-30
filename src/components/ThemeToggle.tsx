'use client';

// 大厅的配色圆钮（用户 2026-09-30：「颜色切换的控件也单独放一个出来到主页」）。
// 与光效钮、中/英钮同款的圆钮，排在光效钮左边；点开一个小弹层，三块色块（浅色 / 深色 / 护眼，
// 各画出自己那套的底色、卡面、正文与强调色）做成单选组，选了即时生效。
//
// 状态只有一个来源：lib/theme（答题页的「Color Scheme」下拉框也读写它），所以两处永远一致。
//
// 键盘与读屏：
//   - 圆钮：aria-haspopup="dialog" + aria-expanded，Enter / 空格开合
//   - 弹层是非模态的小对话框（role="dialog"，名字就是「配色」），里面一个 radiogroup：
//     roving tabindex、←/↑ 上一项 →/↓ 下一项（首尾循环）、Home / End、选择跟随焦点——
//     与配置面板的 SegmentedGroup 同一套契约，按键落点直接用 lib/segmented 的纯函数
//   - 打开时焦点落到当前选中的那块；Esc 或点弹层外关闭，关了焦点回到圆钮；Tab 走出弹层就收起（不困焦点）
//   - Esc 在这里就地拦下、不再往上冒：配置面板那一层的 Esc 是「退回选区」，关个弹层不该顺带把面板也退了
//
// 动效只有弹层出现时的一下淡入（操作反馈，光效关也照常；减动效下瞬时，见样式表）。

import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react';
import { useLang } from '@/lib/LangContext';
import { nextSegIndex, tabStopIndex } from '@/lib/segmented';
import { THEMES, currentTheme, setTheme } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';
import langStyles from './LangToggle.module.css';
import styles from './ThemeToggle.module.css';

/** 三块色块都可选：键盘契约的禁用表恒为全 false */
const NONE_DISABLED = THEMES.map(() => false);

const SWATCH_CLASS = {
  light: styles.swatchLight,
  dark: styles.swatchDark,
  sepia: styles.swatchSepia,
} as const;

export default function ThemeToggle() {
  const { t } = useLang();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const popoverId = useId();
  const titleId = useId();

  const checked = THEMES.indexOf(theme);
  const tabStop = tabStopIndex(checked, NONE_DISABLED);

  /** 收起弹层；refocus：焦点回到圆钮 */
  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  };

  // 打开时焦点落到当前选中的那块（只在打开的那一下，之后方向键自己挪）
  useEffect(() => {
    if (open) itemRefs.current[THEMES.indexOf(currentTheme())]?.focus();
  }, [open]);

  // 点弹层外关闭。用 pointerdown：点到别的按钮上时，那颗按钮照常拿到焦点、照常被按下；
  // 点在空白处时浏览器会把焦点清到 <body>（在这一下之后才处理），那就等它处理完把焦点交回圆钮。
  // 这个计时器不随 effect 的清理撤掉：setOpen(false) 一提交清理就跑，撤了它焦点就永远回不来（实测踩过）
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setOpen(false);
      window.setTimeout(() => {
        const active = document.activeElement;
        if (!active || active === document.body || !active.isConnected) buttonRef.current?.focus();
      }, 0);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Escape' || !open) return;
    e.preventDefault();
    e.stopPropagation();
    close(true);
  };

  // Tab 走出弹层（焦点落到这一簇之外）就收起：非模态弹层不困焦点，也不留一个没人管的弹层开着
  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null;
    if (open && next && !rootRef.current?.contains(next)) setOpen(false);
  };

  const onItemKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const next = nextSegIndex(index, e.key, NONE_DISABLED);
    if (next === null) return;
    e.preventDefault();
    itemRefs.current[next]?.focus();
    if (next !== checked) setTheme(THEMES[next]);
  };

  return (
    <div ref={rootRef} className={styles.anchor} onKeyDown={onKeyDown} onBlur={onBlur}>
      <button
        ref={buttonRef}
        type="button"
        className={`${langStyles.toggle} ${styles.button}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        aria-label={t.themeToggle.aria}
        title={t.themeToggle.title}
        onClick={() => setOpen((v) => !v)}
      >
        {/* 调色板：轮廓随按钮文字色，一颗强调色的颜料点 */}
        <svg className={styles.icon} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
          <path
            className={styles.palette}
            d="M12 3.6c-4.8 0-8.6 3.6-8.6 8.2 0 4.6 3.7 8.4 8.3 8.4 1.1 0 1.9-.8 1.9-1.8 0-.5-.2-.9-.5-1.3-.3-.3-.4-.7-.4-1.1 0-1 .8-1.7 1.8-1.7h2c2.6 0 4.5-1.9 4.5-4.4 0-3.5-4-6.3-9-6.3z"
          />
          <circle className={styles.dotAccent} cx="7.9" cy="11.3" r="1.45" />
          <circle className={styles.dot} cx="10.3" cy="7.6" r="1.45" />
          <circle className={styles.dot} cx="14.7" cy="7.8" r="1.45" />
        </svg>
      </button>

      {open && (
        <div id={popoverId} className={styles.popover} role="dialog" aria-labelledby={titleId}>
          <div id={titleId} className={styles.title}>
            {t.themeToggle.aria}
          </div>
          <div className={styles.options} role="radiogroup" aria-labelledby={titleId}>
            {THEMES.map((name, i) => (
              <button
                key={name}
                ref={(node) => {
                  itemRefs.current[i] = node;
                }}
                type="button"
                role="radio"
                aria-checked={i === checked}
                tabIndex={i === tabStop ? 0 : -1}
                className={styles.option}
                onClick={() => setTheme(name)}
                onKeyDown={(e) => onItemKey(e, i)}
              >
                {/* 色块画的是那一套自己的颜色（底色、卡面、正文、强调色），不随当前主题变：一眼看得出切过去的样子 */}
                <span className={`${styles.swatch} ${SWATCH_CLASS[name]}`} aria-hidden="true">
                  <span className={styles.swatchCard} />
                </span>
                <span className={styles.label}>{t.themeToggle.options[name]}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
