'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import styles from './PixelCompanion.module.css';

type Point = { x: number; y: number };
type Motion = 'idle' | 'tap-left' | 'tap-right' | 'drag-left' | 'drag-right' | 'release';

interface DragState {
  pointerId: number;
  startPointer: Point;
  startOffset: Point;
  moved: boolean;
}

const LABELS: Record<Motion, string> = {
  idle: 'Trivial 小助手正在待机',
  'tap-left': 'Trivial 小助手回应了你的点触',
  'tap-right': 'Trivial 小助手开心地挥手',
  'drag-left': 'Trivial 小助手向左移动',
  'drag-right': 'Trivial 小助手向右移动',
  release: 'Trivial 小助手稳稳落地',
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export default function PixelCompanion() {
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const reactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tapSideRef = useRef<'left' | 'right'>('left');
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [look, setLook] = useState<Point>({ x: 0, y: 0 });
  const [motion, setMotion] = useState<Motion>('idle');
  const [motionKey, setMotionKey] = useState(0);

  useEffect(() => () => {
    if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
  }, []);

  const settleToIdle = (delay: number) => {
    if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
    reactionTimerRef.current = setTimeout(() => setMotion('idle'), delay);
  };

  const reactToTap = () => {
    const side = tapSideRef.current;
    tapSideRef.current = side === 'left' ? 'right' : 'left';
    setMotion(`tap-${side}`);
    setMotionKey((value) => value + 1);
    settleToIdle(920);
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
    if (!drag || drag.pointerId !== event.pointerId) {
      const rect = event.currentTarget.getBoundingClientRect();
      setLook({
        x: clamp(((event.clientX - rect.left) / rect.width - 0.5) * 7, -3.5, 3.5),
        y: clamp(((event.clientY - rect.top) / rect.height - 0.5) * 5, -2.5, 2.5),
      });
      return;
    }

    const dx = event.clientX - drag.startPointer.x;
    const dy = event.clientY - drag.startPointer.y;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    drag.moved = true;

    const nextX = clamp(drag.startOffset.x + dx, -Math.max(0, window.innerWidth - 154), 0);
    const nextY = clamp(drag.startOffset.y + dy, -Math.max(0, window.innerHeight - 184), 0);
    setOffset({ x: nextX, y: nextY });
    setLook({ x: dx < 0 ? -3 : 3, y: clamp(dy / 18, -2, 2) });
    setMotion(dx < 0 ? 'drag-left' : 'drag-right');
  };

  const finishPointer = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    suppressClickRef.current = drag.moved;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (drag.moved) {
      setMotion('release');
      setMotionKey((value) => value + 1);
      setLook({ x: 0, y: 0 });
      settleToIdle(520);
    }
  };

  const onClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    reactToTap();
  };

  const rigStyle = {
    '--look-x': `${look.x}px`,
    '--look-y': `${look.y}px`,
  } as CSSProperties;

  return (
    <aside
      className={`${styles.companion} ${motion.startsWith('drag') ? styles.isDragging : ''}`}
      style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
      aria-label="Trivial 动态小助手"
    >
      <div className={styles.scaleLayer}>
        <div className={`${styles.statusBubble} ${motion !== 'idle' ? styles.statusBubbleVisible : ''}`}>
          {motion.startsWith('tap') ? 'Hi!' : motion.startsWith('drag') ? '››' : '♪'}
        </div>
        <button
          type="button"
          className={styles.petButton}
          aria-label="和 Trivial 小助手互动"
          onClick={onClick}
          onPointerCancel={finishPointer}
          onPointerDown={onPointerDown}
          onPointerLeave={() => !dragRef.current && setLook({ x: 0, y: 0 })}
          onPointerMove={onPointerMove}
          onPointerUp={finishPointer}
        >
          <span
            key={motionKey}
            className={`${styles.liveRig} ${styles[motion]}`}
            data-motion={motion}
            style={rigStyle}
            aria-hidden="true"
          >
            <svg className={styles.petSvg} viewBox="0 0 160 184" role="presentation">
              <defs>
                <linearGradient id="pet-cloud" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#8b9cff" />
                  <stop offset="0.52" stopColor="#6579ed" />
                  <stop offset="1" stopColor="#465dcc" />
                </linearGradient>
                <linearGradient id="pet-body" x1="0.16" y1="0" x2="0.88" y2="1">
                  <stop offset="0" stopColor="#7188ff" />
                  <stop offset="1" stopColor="#455ed8" />
                </linearGradient>
                <linearGradient id="pet-face" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#263981" />
                  <stop offset="1" stopColor="#16265f" />
                </linearGradient>
                <filter id="pet-soft-shadow" x="-40%" y="-40%" width="180%" height="200%">
                  <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#20377f" floodOpacity="0.28" />
                </filter>
                <filter id="pet-eye-glow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="1.8" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              <ellipse className={styles.groundShadow} cx="80" cy="171" rx="40" ry="7" />

              <g className={styles.petBody} filter="url(#pet-soft-shadow)">
                <g className={styles.backArmLeft}>
                  <path d="M45 105C30 104 20 96 24 87c3-7 12-7 19-2l11 8" />
                  <ellipse cx="25" cy="89" rx="8" ry="7" />
                </g>
                <g className={styles.backArmRight}>
                  <path d="M115 105c15-1 25-9 21-18-3-7-12-7-19-2l-11 8" />
                  <ellipse cx="135" cy="89" rx="8" ry="7" />
                </g>

                <g className={styles.torso}>
                  <path
                    d="M48 100c7-11 20-17 32-17s25 6 32 17l5 31c1 12-7 22-19 24l-7 1H69l-7-1c-12-2-20-12-19-24z"
                    fill="url(#pet-body)"
                  />
                  <path className={styles.hoodSeam} d="M52 101c8 8 18 12 28 12s20-4 28-12" />
                  <path className={styles.chestMark} d="M68 128l7 5-7 5m15-10l7 5-7 5" />
                  <path className={styles.chestGlow} d="M66 143h28" />
                </g>

                <g className={styles.footLeft}>
                  <path d="M57 146c-7 7-10 17-5 22 5 6 16 1 23-10l-2-10z" fill="url(#pet-body)" />
                </g>
                <g className={styles.footRight}>
                  <path d="M103 146c7 7 10 17 5 22-5 6-16 1-23-10l2-10z" fill="url(#pet-body)" />
                </g>

                <g className={styles.head}>
                  <path
                    className={styles.cloudShell}
                    d="M35 75c-10-5-13-16-8-25 3-6 8-10 14-12-1-12 8-23 20-25 7-1 13 1 18 5 8-8 23-8 31-1 13-2 25 7 27 20 9 3 16 12 16 22 0 8-4 15-11 20 1 13-10 24-23 24H43c-13 0-23-10-22-22 3-4 8-6 14-6z"
                    fill="url(#pet-cloud)"
                  />
                  <path className={styles.cloudHighlight} d="M42 43c4-14 16-22 29-20m14-2c11-5 25 1 30 11" />
                  <rect className={styles.facePanel} x="43" y="42" width="74" height="53" rx="19" fill="url(#pet-face)" />
                  <path className={styles.faceShine} d="M55 49h40" />
                  <g className={styles.eyes} data-part="eyes" filter="url(#pet-eye-glow)">
                    <path d="M57 69c1-7 10-8 12 0" />
                    <path d="M91 69c1-7 10-8 12 0" />
                  </g>
                  <g className={styles.happyEyes}>
                    <path d="M56 71q7-9 14 0" />
                    <path d="M90 71q7-9 14 0" />
                  </g>
                  <circle className={styles.cheekLeft} cx="53" cy="80" r="2.4" />
                  <circle className={styles.cheekRight} cx="107" cy="80" r="2.4" />
                </g>
              </g>
            </svg>
            <span className={`${styles.spark} ${styles.sparkOne}`}>✦</span>
            <span className={`${styles.spark} ${styles.sparkTwo}`}>✦</span>
            <span className={`${styles.spark} ${styles.sparkThree}`}>·</span>
          </span>
        </button>
        <span className={styles.srOnly} role="status" aria-live="polite">
          {LABELS[motion]}
        </span>
      </div>
    </aside>
  );
}
