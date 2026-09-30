'use client';

// 分段单选组（Design §22 P8-A3）：配置面板的题库 / 逻辑推理题 / 模式 / 抽题范围 / 题目数量五组、
// 复烤区的抽题范围 / 题目数量两组，统一用它。
//
// 读屏与键盘按 WAI-ARIA 的单选组来：
//   - role="radiogroup" + aria-labelledby 指向组标题；每项 role="radio" + aria-checked
//   - roving tabindex：整组只有一个 tabIndex=0（选中项；没有选中项就是第一个可用项），Tab 进组停一次、再 Tab 出组
//   - ←/↑ 上一项、→/↓ 下一项（首尾循环）、Home / End 首尾，跳过禁用项；选择跟随焦点
// 「按了哪个键落到第几项」「Tab 位在哪」是 lib/segmented 里的纯函数，这里只把它们接到 DOM 上。

import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { nextSegIndex, tabStopIndex } from '@/lib/segmented';
import examStyles from '../exam/Exam.module.css';

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

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      className={className ? `${examStyles.segRow} ${className}` : examStyles.segRow}
    >
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
          className={`${examStyles.segBtn} ${i === checked ? examStyles.segActive : ''}`}
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
