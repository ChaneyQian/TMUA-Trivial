'use client';

// 设置页一级：三张堆叠功能卡（Classic / Grill / 9.0 Trivial）。
// 前牌完整、左右各露一张后牌的边缘；点后牌转到前位，点前牌展开为配置面板。
//
// 全部卡面数据来自 zones.ts，这里不写单卡分支。

import { useEffect, useRef } from 'react';
import { useLang } from '@/lib/LangContext';
import examStyles from '../exam/Exam.module.css';
import styles from './Deck.module.css';
import { ZONES, ringOffset, stepZone, zoneById, type ZoneId } from './zones';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

// 手势判定：8px 死区内不锁轴（避免点击被误判成滑动），
// 之后要么滑够 40px，要么甩得比 0.35px/ms 快
const SWIPE_DEAD_ZONE = 8;
const SWIPE_DISTANCE = 40;
const SWIPE_VELOCITY = 0.35;
/** 跟手位移打个折，滑到底也不会把后牌拽出容器 */
const DRAG_RUBBER = 0.55;

type Axis = 'none' | 'x' | 'y';

export interface DeckCharge {
  unlocked: boolean;
  /** 0–1 */
  progress: number;
  value: number;
  max: number;
}

interface Props {
  front: ZoneId;
  /** 转牌（不展开） */
  onFront: (id: ZoneId) => void;
  /** 展开前牌为配置面板；能不能展开由调用方判断 */
  onOpen: (id: ZoneId) => void;
  /** 每张卡右上角的状态徽章文案 */
  badges: Record<ZoneId, string>;
  /** 哪些区当前是锁定态 */
  locked: Record<ZoneId, boolean>;
  charge: DeckCharge;
  /** 展开动画期间 deck 退场（280ms 后由调用方卸载） */
  leaving: boolean;
  /** 从配置面板返回时把焦点收回 deck；首次加载不抢焦点 */
  autoFocus: boolean;
  hint: string;
  /** 提示行上方的进度入口：一条可点的统计条 */
  progress: {
    label: string;
    onOpen: () => void;
  };
  /** 前牌上的快速开始：不进面板，直接用当前配置起考 */
  quickStart: {
    label: string;
    /** 会用哪套配置，一行说清 */
    summary: string;
    disabled: boolean;
    onStart: () => void;
  };
}

export default function CardDeck({
  front,
  onFront,
  onOpen,
  badges,
  locked,
  charge,
  leaving,
  autoFocus,
  hint,
  progress,
  quickStart,
}: Props) {
  const { t } = useLang();
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);
  const touchRef = useRef<{ x: number; y: number; t: number; axis: Axis } | null>(null);

  useEffect(() => {
    if (autoFocus) viewportRef.current?.focus();
  }, [autoFocus]);

  /**
   * 跟手位移直接写进节点，不走 state：touchmove 的频率等于屏幕刷新率，
   * 每帧 setState 就是每帧重渲染 3 张卡 + 3 张封面。传 null 表示收手复位。
   */
  const setDrag = (px: number | null) => {
    const node = stackRef.current;
    if (!node) return;
    if (px === null) {
      node.style.removeProperty('--drag');
      node.classList.remove(styles.dragging);
      return;
    }
    node.classList.add(styles.dragging);
    node.style.setProperty('--drag', `${px}px`);
  };

  const rotate = (dir: number) => {
    setDrag(null);
    onFront(stepZone(front, dir));
  };

  /* 键盘绑在容器上（tabIndex=0），不挂 window 监听：
     exam 相那套 A–H / 1–9 / Enter / ←→ / F 是全局监听，
     deck 只有在 setup 相才渲染，两边天然不碰面。 */
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      rotate(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      rotate(-1);
    } else if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      onOpen(front);
    }
  };

  /* 触屏横滑。注意：React 的 touchmove 是 passive 挂载的，
     在这里调 preventDefault 是空操作（Chrome 还会告警）——不要加。
     纵向滚动由 .viewport 的 touch-action: pan-y 交还浏览器，本来就不需要拦。 */
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) {
      touchRef.current = null;
      return;
    }
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY, t: e.timeStamp, axis: 'none' };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const start = touchRef.current;
    if (!start || e.touches.length !== 1) return;
    const t = e.touches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (start.axis === 'none') {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_DEAD_ZONE) return;
      start.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }
    if (start.axis !== 'x') return;
    setDrag(dx * DRAG_RUBBER);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchRef.current;
    touchRef.current = null;
    // 先复位再转牌：类名是手写上去的，React 那边不知道，
    // 让它在下一次渲染之前清干净，免得留在 DOM 上
    setDrag(null);
    if (!start || start.axis !== 'x') return;
    const t = e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - start.x;
    const speed = Math.abs(dx) / Math.max(1, e.timeStamp - start.t);
    const flung = speed > SWIPE_VELOCITY && Math.abs(dx) > SWIPE_DEAD_ZONE;
    if (Math.abs(dx) < SWIPE_DISTANCE && !flung) return;
    onFront(stepZone(front, dx < 0 ? 1 : -1));
  };

  const onTouchCancel = () => {
    touchRef.current = null;
    setDrag(null);
  };

  const frontZone = zoneById(front);

  return (
    <div className={`${styles.deck} ${leaving ? styles.deckLeaving : ''}`}>
      <div className={styles.head}>
        <div className={styles.headTitle}>MCQ Test</div>
        <div className={styles.headSub}>{t.deck.headSub}</div>
      </div>

      <div
        ref={viewportRef}
        className={styles.viewport}
        role="group"
        aria-label={t.deck.groupAria}
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
      >
        <div ref={stackRef} className={styles.stack}>
          {ZONES.map((zone) => {
            const offset = ringOffset(zone.id, front);
            const slot =
              offset === 0 ? styles.slotFront : offset === 1 ? styles.slotRight : styles.slotLeft;
            const isFront = offset === 0;
            const openable = !zone.comingSoon && !locked[zone.id];
            return (
              <div key={zone.id} className={`${styles.card} ${slot}`}>
                {/* 用 backgroundImage 而不是 background 简写：简写会把样式表里的
                    background-size: cover 一并重置掉 */}
                <div className={styles.coverBox} style={{ backgroundImage: zone.grad }}>
                  {/* 图缺失时 alt="" 的 img 不渲染任何东西，底下的渐变直接透出 */}
                  <img
                    className={styles.cover}
                    src={`${BASE_PATH}/cards/${zone.cover}`}
                    alt=""
                    fetchPriority={isFront ? 'high' : 'auto'}
                    loading={isFront ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                  <span className={styles.no} aria-hidden="true">
                    {zone.no}
                  </span>
                  <span
                    className={`${styles.badge} ${locked[zone.id] ? styles.badgeLocked : ''}`}
                  >
                    {badges[zone.id]}
                  </span>
                </div>

                <div className={styles.body}>
                  <div className={styles.title}>{t.zone.title[zone.id]}</div>
                  <div className={styles.sub}>{t.zone.sub[zone.id]}</div>
                  <span className={styles.spacer} />

                  {zone.unlockPath === 'progress' && (
                    <div className={styles.charge}>
                      {/* 视觉沿用 9.0 流光充电条；切库职责交给 deck 后，
                          它不再是按钮，降为纯展示（内层保留 progressbar 语义） */}
                      {/* Ready=已充满（流光 fill + 呼吸灯），Active=当前选中的题库范围。
                          改版后「选中」由前位表达，所以 Active 绑前位而不是解锁态，
                          两态才不会压成一态：在后位是「满电待命」，转到前位才整条亮起来。 */}
                      <div
                        className={`${examStyles.libraryCharge} ${
                          charge.unlocked ? examStyles.libraryChargeReady : ''
                        } ${charge.unlocked && isFront ? examStyles.libraryChargeActive : ''}`}
                      >
                        <span className={examStyles.libraryChargeLabel}>
                          <span className={examStyles.chargeLight} aria-hidden="true" />
                          {charge.unlocked
                            ? '9.0 Trivial'
                            : t.deck.chargeLabel(charge.value, charge.max)}
                        </span>
                        <span
                          className={examStyles.libraryChargeTrack}
                          role="progressbar"
                          aria-label={t.deck.chargeAria}
                          aria-valuemin={0}
                          aria-valuemax={charge.max}
                          aria-valuenow={Math.min(charge.value, charge.max)}
                        >
                          <span
                            className={examStyles.libraryChargeFill}
                            style={{ width: `${charge.progress * 100}%` }}
                          />
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 快速开始：跳过配置面板，直接用当前配置起考。
                      即将开放 / 锁定的区不给这个入口。用 visibility 而不是条件渲染，
                      同一张卡在前位和后位的高度才一致，转牌时不会有布局跳动；
                      visibility: hidden 也顺带把它移出 tab 序、挡掉点击。 */}
                  {openable && (
                    <div
                      className={`${styles.quick} ${isFront ? '' : styles.quickIdle}`}
                      aria-hidden={isFront ? undefined : true}
                    >
                      <div className={styles.quickSummary}>{quickStart.summary}</div>
                      <button
                        type="button"
                        className={styles.quickBtn}
                        disabled={quickStart.disabled}
                        aria-label={t.deck.quickAria(quickStart.summary)}
                        onClick={(e) => {
                          // 命中层是兄弟节点、不是祖先，本来也收不到这一下；
                          // 写出来是防止日后有人把按钮挪进 .hit 里
                          e.stopPropagation();
                          // 直调，不包任何异步：requestFullscreen 认的是同步手势链
                          quickStart.onStart();
                        }}
                      >
                        {quickStart.label}
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className={styles.hit}
                  tabIndex={-1}
                  aria-label={
                    isFront
                      ? t.deck.openAria(zone.no, t.zone.title[zone.id])
                      : t.deck.frontAria(zone.no, t.zone.title[zone.id])
                  }
                  onClick={() => (isFront ? onOpen(zone.id) : onFront(zone.id))}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 进度入口。做题记录的统计与导入导出都在那后面，所以这条一直在，
          没有任何解锁门槛 */}
      <div className={styles.progressRow}>
        <button type="button" className={styles.progressBtn} onClick={progress.onOpen}>
          {progress.label}
        </button>
      </div>

      <div className={styles.hintRow}>
        <div className={styles.dots} aria-hidden="true">
          {ZONES.map((zone) => (
            <span
              key={zone.id}
              className={`${styles.dot} ${zone.id === front ? styles.dotOn : ''}`}
            />
          ))}
        </div>
        <div className={styles.hint} role="status">
          <span className={styles.srOnly}>
            {frontZone.no} {t.zone.title[frontZone.id]}
          </span>
          {hint}
        </div>
        <div className={styles.keys}>{t.deck.keys}</div>
      </div>
    </div>
  );
}
