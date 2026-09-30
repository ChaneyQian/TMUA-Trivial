'use client';

// 题库按钮下的「N 题」：数变了就一次上滑替换——旧的上移淡出、新的自下淡入（约 220ms，Design §22 P8-A4）。
// 首帧（刚挂上）不播；减动效下瞬时换（样式表）；它是操作反馈，光效关时照播。
// 退场的那份只活一轮动画，读屏不念（aria-hidden）：按钮的名字始终是新的那个数。
// 状态怎么推演见 lib/rolling。

import { useEffect, useState } from 'react';
import { ROLL_MS, rollTo, settleRoll, startRoll } from '@/lib/rolling';
import styles from './RollingText.module.css';

export default function RollingText({ text }: { text: string }) {
  const [roll, setRoll] = useState(() => startRoll(text));
  // 文字变了就在渲染期换档（React「随 props 调整 state」的写法）：同一帧里新旧两份一起出场，不闪一帧旧数
  const next = rollTo(roll, text);
  if (next !== roll) setRoll(next);

  // 播完摘掉退场的那份。按时间摘、不等 animationend：减动效下动画不播，那个事件根本不会来
  const { gen, prev } = roll;
  useEffect(() => {
    if (prev === null) return;
    const timer = window.setTimeout(() => setRoll((current) => settleRoll(current, gen)), ROLL_MS + 40);
    return () => window.clearTimeout(timer);
  }, [gen, prev]);

  return (
    <span className={styles.roll}>
      {prev !== null && (
        <span key={`out-${gen}`} className={styles.out} aria-hidden="true">
          {prev}
        </span>
      )}
      {/* key 随 gen 换新：换一次就是一个新元素，动画从头播；gen 为 0（首帧）不挂动画 */}
      <span key={`in-${gen}`} className={gen > 0 ? styles.in : undefined}>
        {roll.text}
      </span>
    </span>
  );
}
