'use client';

// 分段单选组（Design §22 P8-A3）：配置面板的题库 / 逻辑推理题 / 模式 / 抽题范围 / 题目数量五组、
// 复烤区的抽题范围 / 题目数量两组，统一用它。
//
// 读屏与键盘按 WAI-ARIA 的单选组来：
//   - role="radiogroup" + aria-labelledby 指向组标题；每项 role="radio" + aria-checked
//   - roving tabindex：整组只有一个 tabIndex=0（选中项；没有选中项就是第一个可用项），Tab 进组停一次、再 Tab 出组
//   - ←/↑ 上一项、→/↓ 下一项（首尾循环）、Home / End 首尾，跳过禁用项；选择跟随焦点
// 「按了哪个键落到第几项」「Tab 位在哪」「指示块画在哪」是 lib/segmented 里的纯函数，这里只把它们接到 DOM 上。
//
// 滑动选中块：组里垫一块绝对定位的指示块，选中项变了就滑过去（位移走 transform，宽度见样式表的说明）。
// 位置量的是 offsetLeft / offsetTop / offsetWidth / offsetHeight——布局值，不受 transform 影响：
// 面板入场的缩放、按钮按下去的 0.97 都不会让它量歪。只有「选中项变了」这一种情况补间滑过去；
// 首帧、改窗口尺寸、换语言、字体到位、选项文字变了（题库按钮上的题数）一律就地摆好，不滑。
// 各项折成多行时不画指示块（算出来的位置跨行就是错的），选中项自己带底色，和没有 JS 时一样。

import { useCallback, useEffect, useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { nextSegIndex, placeIndicator, tabStopIndex, type SegBox } from '@/lib/segmented';
import examStyles from '../exam/Exam.module.css';
import styles from './SegmentedGroup.module.css';

export interface SegmentedOption<V extends string | number> {
  value: V;
  label: ReactNode;
  /** 标签下面那行小字（题数、模式说明） */
  hint?: ReactNode;
  disabled?: boolean;
}

interface Props<V extends string | number> {
  /** 组标题元素的 id：读屏念组名靠它 */
  labelledBy: string;
  options: readonly SegmentedOption<V>[];
  /** 当前选中的值；不在 options 里（比如题数填了个不在预设里的数）＝组内没有选中项 */
  value: V | null;
  onChange: (value: V) => void;
  /** 加在组容器上的类（排版用） */
  className?: string;
}

export default function SegmentedGroup<V extends string | number>({
  labelledBy,
  options,
  value,
  onChange,
  className,
}: Props<V>) {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLSpanElement | null>(null);
  const disabled = options.map((option) => Boolean(option.disabled));
  const checked = options.findIndex((option) => option.value === value);
  const tabStop = tabStopIndex(checked, disabled);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    // 带修饰键的组合留给浏览器与系统（Alt+← 是后退）
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const next = nextSegIndex(index, event.key, disabled);
    if (next === null) return;
    // 方向键不许顺带滚页面；Home / End 同理
    event.preventDefault();
    itemRefs.current[next]?.focus();
    if (next !== checked) onChange(options[next].value);
  };

  // ---- 滑动选中块 ----
  // 最新的选中下标：ResizeObserver / 字体到位的回调是异步来的，从 ref 读，别读到哪一次渲染的旧闭包
  const checkedRef = useRef(checked);
  /** 指示块此刻停在哪（null：没画） */
  const shownRef = useRef<SegBox | null>(null);

  /**
   * 量一遍、摆指示块（lib/segmented 的 placeIndicator）：animate 为真且指示块本来就在场时才滑过去，
   * 否则就地摆好；不画时摘掉 data-slide，选中项自己带底色
   */
  const place = useCallback((animate: boolean) => {
    const row = rowRef.current;
    const bar = barRef.current;
    if (!row || !bar) return;
    shownRef.current = placeIndicator(row, bar, itemRefs.current, checkedRef.current, shownRef.current, animate);
  }, []);

  // 选项变了（换区后题库列表不同）就地摆；只有同一组选项里选中项变了才滑
  const optionsKey = options.map((option) => String(option.value)).join('\u0000');
  const placedRef = useRef<{ key: string; checked: number } | null>(null);
  useLayoutEffect(() => {
    itemRefs.current.length = options.length;
    checkedRef.current = checked;
    const prev = placedRef.current;
    placedRef.current = { key: optionsKey, checked };
    place(prev !== null && prev.key === optionsKey && prev.checked !== checked);
  }, [optionsKey, checked, options.length, place]);

  // 尺寸会变的几种情况：窗口缩放（组宽变了、换行变了）、换语言与选项文字变了（项宽变了）、字体到位
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const again = () => place(false);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(again);
    if (observer) {
      observer.observe(row);
      for (const item of itemRefs.current) if (item) observer.observe(item);
    }
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) again();
    });
    return () => {
      alive = false;
      observer?.disconnect();
    };
  }, [optionsKey, place]);

  const rowClass = [examStyles.segRow, styles.group, className].filter(Boolean).join(' ');

  return (
    <div ref={rowRef} role="radiogroup" aria-labelledby={labelledBy} className={rowClass}>
      <span ref={barRef} className={styles.indicator} aria-hidden="true" />
      {options.map((option, i) => (
        <button
          key={String(option.value)}
          ref={(node) => {
            itemRefs.current[i] = node;
          }}
          type="button"
          role="radio"
          aria-checked={i === checked}
          tabIndex={i === tabStop ? 0 : -1}
          disabled={option.disabled}
          className={`${examStyles.segBtn} ${styles.item} ${i === checked ? examStyles.segActive : ''}`}
          onClick={() => onChange(option.value)}
          onKeyDown={(event) => onKeyDown(event, i)}
        >
          {option.label}
          {option.hint !== undefined && <span className={examStyles.segHint}>{option.hint}</span>}
        </button>
      ))}
    </div>
  );
}
