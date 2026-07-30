'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import styles from './PixelCompanion.module.css';

type Point = { x: number; y: number };
type SpriteState =
  | 'idle'
  | 'running-right'
  | 'running-left'
  | 'waving'
  | 'jumping'
  | 'failed'
  | 'waiting'
  | 'running'
  | 'review';
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
  after: SpriteState;
}

interface PetCommandDetail {
  state?: SpriteState;
  after?: SpriteState;
  moveTo?: 'grade' | 'home';
}

const CELL_WIDTH = 192;
const CELL_HEIGHT = 208;
const PET_EVENT = 'mcq-test:pet-command';
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

const PET_SPRITES: Record<PetId, string> = {
  guga: `${BASE_PATH}/pets/guga/spritesheet.webp`,
  frieren: `${BASE_PATH}/pets/frieren/spritesheet.webp`,
  'clawd-laptop': `${BASE_PATH}/pets/clawd-laptop/spritesheet.webp`,
};

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

// Codex pet atlas: 8 columns × 9 rows, with the app's native frame timing.
const IDLE_DURATIONS = [280, 110, 110, 140, 140, 320];
const RUN_DURATIONS = [120, 120, 120, 120, 120, 120, 120, 220];
const WAVE_DURATIONS = [140, 140, 140, 280];
const JUMP_DURATIONS = [140, 140, 140, 140, 280];
const FAILED_DURATIONS = [140, 140, 140, 140, 140, 140, 140, 240];
const WAITING_DURATIONS = [150, 150, 150, 150, 150, 260];
const ACTIVE_DURATIONS = [120, 120, 120, 120, 120, 220];
const REVIEW_DURATIONS = [150, 150, 150, 150, 150, 280];

const ANIMATIONS: Record<
  SpriteState,
  { row: number; durations: readonly number[]; loop: boolean }
> = {
  idle: { row: 0, durations: IDLE_DURATIONS, loop: true },
  'running-right': { row: 1, durations: RUN_DURATIONS, loop: true },
  'running-left': { row: 2, durations: RUN_DURATIONS, loop: true },
  waving: { row: 3, durations: WAVE_DURATIONS, loop: false },
  jumping: { row: 4, durations: JUMP_DURATIONS, loop: false },
  failed: { row: 5, durations: FAILED_DURATIONS, loop: false },
  waiting: { row: 6, durations: WAITING_DURATIONS, loop: true },
  running: { row: 7, durations: ACTIVE_DURATIONS, loop: true },
  review: { row: 8, durations: REVIEW_DURATIONS, loop: true },
};

const STATE_LABELS: Record<SpriteState, string> = {
  idle: '正在待机',
  'running-right': '向右移动',
  'running-left': '向左移动',
  waving: '正在庆祝',
  jumping: '跳了一下',
  failed: '发现这题答错了',
  waiting: '正在等你选择答案',
  running: '正在陪你解题',
  review: '正在和你复盘',
};

const BUBBLE_TEXT: Record<SpriteState, string> = {
  idle: '',
  'running-right': '→',
  'running-left': '←',
  waving: 'Nice!',
  jumping: '♪',
  failed: '×',
  waiting: '…',
  running: '···',
  review: '?',
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function easeInOut(progress: number): number {
  return progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
}

export default function PixelCompanion() {
  const companionRef = useRef<HTMLElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const offsetRef = useRef<Point>({ x: 0, y: 0 });
  const travelFrameRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);
  const suppressClickRef = useRef(false);
  const tapReactionRef = useRef<'waving' | 'jumping'>('waving');
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [theme, setTheme] = useState<ThemeName>('light');
  const [animation, setAnimation] = useState<AnimationState>({
    state: 'idle',
    frame: 0,
    run: 0,
    after: 'idle',
  });

  const commitOffset = useCallback((next: Point) => {
    offsetRef.current = next;
    setOffset(next);
  }, []);

  const play = useCallback((state: SpriteState, after: SpriteState = 'idle') => {
    setAnimation((current) => ({ state, frame: 0, run: current.run + 1, after }));
  }, []);

  const cancelTravel = useCallback(() => {
    if (travelFrameRef.current !== null) cancelAnimationFrame(travelFrameRef.current);
    travelFrameRef.current = null;
  }, []);

  const animateTo = useCallback(
    (target: Point, finalState: SpriteState) => {
      cancelTravel();
      const start = offsetRef.current;
      const dx = target.x - start.x;
      const dy = target.y - start.y;
      const distance = Math.hypot(dx, dy);

      if (reducedMotionRef.current || distance < 4) {
        commitOffset(target);
        play(finalState);
        return;
      }

      play(dx < 0 ? 'running-left' : 'running-right');
      const startedAt = performance.now();
      const duration = clamp(distance * 1.45, 480, 1450);

      const step = (now: number) => {
        const progress = clamp((now - startedAt) / duration, 0, 1);
        const eased = easeInOut(progress);
        commitOffset({ x: start.x + dx * eased, y: start.y + dy * eased });
        if (progress < 1) {
          travelFrameRef.current = requestAnimationFrame(step);
        } else {
          travelFrameRef.current = null;
          play(finalState);
        }
      };

      travelFrameRef.current = requestAnimationFrame(step);
    },
    [cancelTravel, commitOffset, play],
  );

  const moveToGrade = useCallback(
    (finalState: SpriteState, attempt = 0) => {
      const pet = companionRef.current;
      const target = document.querySelector<HTMLElement>('[data-pet-target="grade"]');
      if ((!pet || !target) && attempt < 18) {
        travelFrameRef.current = requestAnimationFrame(() => moveToGrade(finalState, attempt + 1));
        return;
      }
      if (!pet || !target) {
        play(finalState);
        return;
      }

      const petRect = pet.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const gap = 10;
      const roomOnRight = targetRect.right + gap + petRect.width <= window.innerWidth - 8;
      const desiredLeft = roomOnRight
        ? targetRect.right + gap
        : clamp(targetRect.right - petRect.width, 8, window.innerWidth - petRect.width - 8);
      const desiredTop = roomOnRight
        ? clamp(targetRect.bottom - petRect.height, 8, window.innerHeight - petRect.height - 8)
        : clamp(targetRect.top - petRect.height + 12, 8, window.innerHeight - petRect.height - 8);
      const current = offsetRef.current;
      const next = {
        x: clamp(current.x + desiredLeft - petRect.left, -Math.max(0, window.innerWidth - petRect.width), 0),
        y: clamp(current.y + desiredTop - petRect.top, -Math.max(0, window.innerHeight - petRect.height), 0),
      };
      animateTo(next, finalState);
    },
    [animateTo, play],
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      reducedMotionRef.current = media.matches;
      setReducedMotion(media.matches);
    };
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
    const receiveCommand = (event: Event) => {
      const detail = (event as CustomEvent<PetCommandDetail>).detail || {};
      const state = detail.state || 'idle';
      if (detail.moveTo === 'grade') moveToGrade(state);
      else if (detail.moveTo === 'home') animateTo({ x: 0, y: 0 }, state);
      else play(state, detail.after || (state === 'failed' ? 'review' : 'idle'));
    };
    window.addEventListener(PET_EVENT, receiveCommand);
    return () => window.removeEventListener(PET_EVENT, receiveCommand);
  }, [animateTo, moveToGrade, play]);

  useEffect(() => {
    const finishOutside = () => {
      const drag = dragRef.current;
      if (!drag) return;
      suppressClickRef.current = drag.moved;
      dragRef.current = null;
      if (drag.moved) play('jumping');
    };

    window.addEventListener('pointerup', finishOutside);
    window.addEventListener('pointercancel', finishOutside);
    return () => {
      window.removeEventListener('pointerup', finishOutside);
      window.removeEventListener('pointercancel', finishOutside);
    };
  }, [play]);

  useEffect(() => () => cancelTravel(), [cancelTravel]);

  useEffect(() => {
    const config = ANIMATIONS[animation.state];
    if (reducedMotion) {
      if (!config.loop) {
        const timer = window.setTimeout(
          () => setAnimation((current) => ({ ...current, state: current.after, frame: 0 })),
          0,
        );
        return () => window.clearTimeout(timer);
      }
      return;
    }

    const timer = window.setTimeout(() => {
      setAnimation((current) => {
        if (current.state !== animation.state || current.run !== animation.run) return current;
        const nextFrame = current.frame + 1;
        if (nextFrame < config.durations.length) return { ...current, frame: nextFrame };
        if (config.loop) return { ...current, frame: 0 };
        return { ...current, state: current.after, frame: 0 };
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
    cancelTravel();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startPointer: { x: event.clientX, y: event.clientY },
      startOffset: offsetRef.current,
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

    commitOffset({ x: nextX, y: nextY });
    setAnimation((current) =>
      current.state === nextState
        ? current
        : { state: nextState, frame: 0, run: current.run + 1, after: 'idle' },
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
    '--pet-sheet': `url("${PET_SPRITES[petId]}")`,
  } as CSSProperties;

  return (
    <aside
      ref={companionRef}
      className={`${styles.companion} ${petClass}`}
      style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
      aria-label={`${petName} 动态小助手`}
      data-pet={petId}
    >
      <div className={styles.scaleLayer}>
        <div className={`${styles.statusBubble} ${animation.state !== 'idle' ? styles.statusBubbleVisible : ''}`}>
          {BUBBLE_TEXT[animation.state]}
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
