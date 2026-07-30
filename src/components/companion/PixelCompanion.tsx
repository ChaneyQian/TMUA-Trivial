'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import petImage from '@/assets/codex-companion.png';
import styles from './PixelCompanion.module.css';

type Point = { x: number; y: number };
type Motion = 'idle' | 'jumping' | 'waving' | 'running-left' | 'running-right';

interface DragState {
  pointerId: number;
  startPointer: Point;
  startOffset: Point;
  moved: boolean;
}

const CLICK_REACTIONS: Exclude<Motion, 'idle' | 'running-left' | 'running-right'>[] = [
  'jumping',
  'waving',
];

const LABELS: Record<Motion, string> = {
  idle: 'Trivial 小助手正在待机',
  jumping: 'Trivial 小助手跳了一下',
  waving: 'Trivial 小助手向你挥手',
  'running-left': 'Trivial 小助手向左跑',
  'running-right': 'Trivial 小助手向右跑',
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export default function PixelCompanion() {
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const reactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reactionIndexRef = useRef(0);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [motion, setMotion] = useState<Motion>('idle');
  const [motionKey, setMotionKey] = useState(0);

  useEffect(() => () => {
    if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
  }, []);

  const settleToIdle = (delay = 760) => {
    if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
    reactionTimerRef.current = setTimeout(() => setMotion('idle'), delay);
  };

  const react = () => {
    const next = CLICK_REACTIONS[reactionIndexRef.current % CLICK_REACTIONS.length];
    reactionIndexRef.current += 1;
    setMotion(next);
    setMotionKey((value) => value + 1);
    settleToIdle(next === 'jumping' ? 700 : 900);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startPointer: { x: event.clientX, y: event.clientY },
      startOffset: offset,
      moved: false,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startPointer.x;
    const dy = event.clientY - drag.startPointer.y;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    drag.moved = true;

    const nextX = clamp(drag.startOffset.x + dx, -Math.max(0, window.innerWidth - 142), 0);
    const nextY = clamp(drag.startOffset.y + dy, -Math.max(0, window.innerHeight - 166), 0);
    setOffset({ x: nextX, y: nextY });
    setMotion(dx < 0 ? 'running-left' : 'running-right');
  };

  const finishPointer = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    suppressClickRef.current = drag.moved;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (drag.moved) settleToIdle(260);
  };

  const onClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    react();
  };

  return (
    <aside
      className={styles.companion}
      style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
      aria-label="Trivial 像素小助手"
    >
      <div className={styles.scaleLayer}>
        <div className={`${styles.statusBubble} ${motion !== 'idle' ? styles.statusBubbleVisible : ''}`}>
          {motion === 'waving' ? 'Hi!' : motion === 'jumping' ? '♪' : '···'}
        </div>
        <button
          type="button"
          className={styles.petButton}
          aria-label="和 Trivial 小助手互动"
          onClick={onClick}
          onPointerCancel={finishPointer}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finishPointer}
        >
          <span
            key={motionKey}
            className={`${styles.petMotion} ${styles[motion]}`}
            data-motion={motion}
            aria-hidden="true"
          >
            <span className={styles.petCrop}>
              <img src={petImage.src} alt="" draggable={false} className={styles.petImage} />
            </span>
            <span className={`${styles.spark} ${styles.sparkOne}`}>✦</span>
            <span className={`${styles.spark} ${styles.sparkTwo}`}>·</span>
            <span className={`${styles.spark} ${styles.sparkThree}`}>✦</span>
          </span>
        </button>
        <span className={styles.srOnly} role="status" aria-live="polite">
          {LABELS[motion]}
        </span>
      </div>
    </aside>
  );
}
