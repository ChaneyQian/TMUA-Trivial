'use client';

// 成绩页的大比分（Design §26 P11-1）：进成绩页时分子从 0 滚到做对题数，约 600ms、ease-out，分母不动。
//
// - 读屏只念静态的终值（视觉隐藏的「17 / 20」）；滚动中的那串数 aria-hidden，一帧也不报给读屏。
// - 减动效、光效关（<html data-fx="off">）、标签页在后台、0 分：直接显示终值，不滚（lib/resultReview 的 shouldCountUp）。
// - 只在挂上时滚一次：成绩页里的重渲染（导出转圈、横幅冒出来）不会让它重来。
// - 兜底：后台标签页里 rAF 不跑——切走（visibilitychange）、中途关了光效，都立刻跳到终值；
//   另有一个比时长多等一截的定时器，rAF 卡住了也保证最后停在正确的数上（lib/resultReview 的 startCountUp）。
// - 刚挂上时主线程要排一页公式，帧会卡；进度按帧累加、每帧有上限，卡住只是暂停，不会从 0 直接跳到终值。
// - 不抖：分子的格子由看不见的终值撑定宽度，数字等宽（Result.module.css 的 .countSlot），只换字。

import { useEffect, useRef, useState } from 'react';
import { currentFx, subscribeFx } from '@/lib/fx';
import { shouldCountUp, startCountUp, type CountUpHost } from '@/lib/resultReview';
import styles from './Result.module.css';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** 此刻能不能滚（只在浏览器里问；成绩页不预渲染，这里只是防御） */
function countUpAllowed(target: number): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  const reducedMotion = typeof window.matchMedia === 'function' && window.matchMedia(REDUCED_MOTION).matches;
  return shouldCountUp({ target, reducedMotion, fx: currentFx(), hidden: document.hidden });
}

/** 浏览器里的计数宿主：rAF 走帧、setTimeout 兜底；切到后台或中途关了光效就立刻收尾 */
function browserHost(): CountUpHost {
  return {
    requestFrame: (cb) => window.requestAnimationFrame(cb),
    cancelFrame: (id) => window.cancelAnimationFrame(id),
    setTimer: (cb, ms) => window.setTimeout(cb, ms),
    clearTimer: (id) => window.clearTimeout(id),
    onInterrupt: (cb) => {
      document.addEventListener('visibilitychange', cb);
      const unsubscribeFx = subscribeFx(cb);
      return () => {
        document.removeEventListener('visibilitychange', cb);
        unsubscribeFx();
      };
    },
  };
}

export default function ScoreCount({ right, total }: { right: number; total: number }) {
  // 首帧就定好：不滚的直接是终值，不会先闪一帧 0
  const [shown, setShown] = useState(() => (countUpAllowed(right) ? 0 : right));
  /** 已经真的走过帧了。之后 effect 再跑（right 变了——成绩页里不该发生）就直接跳终值，不重滚 */
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current || !countUpAllowed(right)) {
      setShown(right);
      return;
    }
    return startCountUp(
      right,
      (value) => {
        startedRef.current = true;
        setShown(value);
      },
      browserHost(),
    );
  }, [right]);

  return (
    <>
      <span className={styles.srOnly}>
        {right} / {total}
      </span>
      <span aria-hidden="true">
        <span className={styles.countSlot}>
          <span className={styles.countGhost}>{right}</span>
          <span>{shown}</span>
        </span>
        <span className={styles.countRest}> / {total}</span>
      </span>
    </>
  );
}
