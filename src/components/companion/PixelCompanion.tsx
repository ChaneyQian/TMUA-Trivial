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
type SpriteState = 'idle' | 'running-right' | 'running-left' | 'waving' | 'jumping';
type ThemeName = 'light' | 'dark' | 'sepia';
type PetId = 'guga' | 'frieren' | 'clawd-laptop';

interface DragState {
  pointerId: number;
  startPointer: Point;
  startOffset: Point;
  moved: boolean;
}

interface AnimationState {
  state: SpriteState;
  frame: number;
  run: number;
}

const CELL_WIDTH = 192;
const CELL_HEIGHT = 208;

const PET_BY_THEME: Record<ThemeName, PetId> = {
  light: 'guga',
  dark: 'frieren',
  sepia: 'clawd-laptop',
};

const PET_NAMES: Record<PetId, string> = {
  guga: 'Guga',
  frieren: 'Frieren',
  'clawd-laptop': 'Clawd Laptop',
};

// Codex pet atlas: 8 columns × 9 rows. Clawd Laptop uses the same timing contract.
const IDLE_DURATIONS = [280, 110, 110, 140, 140, 320];
const RUN_DURATIONS = [120, 120, 120, 120, 120, 120, 120, 220];
const WAVE_DURATIONS = [140, 140, 140, 280];
const JUMP_DURATIONS = [140, 140, 140, 140, 280];

const ANIMATIONS: Record<
  SpriteState,
  { row: number; durations: readonly number[]; loop: boolean }
> = {
  idle: { row: 0, durations: IDLE_DURATIONS, loop: true },
  'running-right': { row: 1, durations: RUN_DURATIONS, loop: true },
  'running-left': { row: 2, durations: RUN_DURATIONS, loop: true },
  waving: { row: 3, durations: WAVE_DURATIONS, loop: false },
  jumping: { row: 4, durations: JUMP_DURATIONS, loop: false },
};

const STATE_LABELS: Record<SpriteState, string> = {
  idle: '正在待机',
  'running-right': '向右移动',
  'running-left': '向左移动',
  waving: '向你挥手',
  jumping: '跳了一下',
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export default function PixelCompanion() {
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const tapReactionRef = useRef<'waving' | 'jumping'>('waving');
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [theme, setTheme] = useState<ThemeName>('light');
  const [animation, setAnimation] = useState<AnimationState>({ state: 'idle', frame: 0, run: 0 });

  const play = (state: SpriteState) => {
    setAnimation((current) => ({ state, frame: 0, run: current.run + 1 }));
  };

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const updateTheme = () => {
      const value = root.dataset.theme;
      setTheme(value === 'dark' || value === 'sepia' ? value : 'light');
    };
    const observer = new MutationObserver(updateTheme);
    updateTheme();
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const finishOutside = () => {
      const drag = dragRef.current;
      if (!drag) return;
      suppressClickRef.current = drag.moved;
      dragRef.current = null;
      if (drag.moved) {
        setAnimation((current) => ({ state: 'jumping', frame: 0, run: current.run + 1 }));
      }
    };

    window.addEventListener('pointerup', finishOutside);
    window.addEventListener('pointercancel', finishOutside);
    return () => {
      window.removeEventListener('pointerup', finishOutside);
      window.removeEventListener('pointercancel', finishOutside);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const config = ANIMATIONS[animation.state];
    const timer = window.setTimeout(() => {
      setAnimation((current) => {
        if (current.state !== animation.state || current.run !== animation.run) return current;
        const nextFrame = current.frame + 1;
        if (nextFrame < config.durations.length) return { ...current, frame: nextFrame };
        if (config.loop) return { ...current, frame: 0 };
        return { state: 'idle', frame: 0, run: current.run };
      });
    }, config.durations[animation.frame]);

    return () => window.clearTimeout(timer);
  }, [animation, reducedMotion]);

  const reactToTap = () => {
    const next = tapReactionRef.current;
    tapReactionRef.current = next === 'waving' ? 'jumping' : 'waving';
    play(next);
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

    const nextX = clamp(drag.startOffset.x + dx, -Math.max(0, window.innerWidth - 134), 0);
    const nextY = clamp(drag.startOffset.y + dy, -Math.max(0, window.innerHeight - 146), 0);
    const nextState: SpriteState = dx < 0 ? 'running-left' : 'running-right';

    setOffset({ x: nextX, y: nextY });
    setAnimation((current) =>
      current.state === nextState
        ? current
        : { state: nextState, frame: 0, run: current.run + 1 },
    );
  };

  const finishPointer = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    suppressClickRef.current = drag.moved;
    dragRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (drag.moved) play('jumping');
  };

  const onClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    reactToTap();
  };

  const config = ANIMATIONS[animation.state];
  const petId = PET_BY_THEME[theme];
  const petName = PET_NAMES[petId];
  const petClass =
    petId === 'clawd-laptop'
      ? styles.clawdLaptop
      : petId === 'frieren'
        ? styles.frieren
        : styles.guga;
  const spriteStyle = {
    '--sprite-x': `${-animation.frame * CELL_WIDTH}px`,
    '--sprite-y': `${-config.row * CELL_HEIGHT}px`,
  } as CSSProperties;

  return (
    <aside
      className={`${styles.companion} ${petClass} ${animation.state.startsWith('running-') ? styles.isDragging : ''}`}
      style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
      aria-label={`${petName} 动态小助手`}
      data-pet={petId}
    >
      <div className={styles.scaleLayer}>
        <div className={`${styles.statusBubble} ${animation.state !== 'idle' ? styles.statusBubbleVisible : ''}`}>
          {animation.state === 'idle'
            ? ''
            : animation.state === 'waving'
            ? 'Hi!'
            : animation.state === 'jumping'
              ? '♪'
              : animation.state === 'running-left'
                ? '←'
                : '→'}
        </div>
        <button
          type="button"
          className={styles.petButton}
          aria-label="和 Trivial 小助手互动"
          onClick={onClick}
          onLostPointerCapture={finishPointer}
          onPointerCancel={finishPointer}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finishPointer}
        >
          <span
            className={styles.sprite}
            data-motion={animation.state}
            data-frame={animation.frame}
            style={spriteStyle}
            aria-hidden="true"
          />
        </button>
        <span className={styles.srOnly} role="status" aria-live="polite">
          {petName} {STATE_LABELS[animation.state]}
        </span>
      </div>
    </aside>
  );
}
