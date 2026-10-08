'use client';

// 设置页一级：堆叠功能卡（Classic / Grill / 9.0 Trivial / 标化题库 / 密卷）。
// 前牌完整、左右各露一张后牌的边缘，多出来的牌沉到居中的第三层；
// 点后牌转到前位，点前牌展开为配置面板。
//
// 全部卡面数据来自 zones.ts，这里不写单卡分支——卡的张数也一样，
// 槽位是按环形位次算出来的，加一张卡不需要动这个组件。

import { useEffect, useRef, type CSSProperties } from 'react';
import { useCardTilt } from '@/components/fx/useCardTilt';
import BusySpinner from '@/components/setup/BusySpinner';
import { playIntro } from '@/lib/intro';
import { useLang } from '@/lib/LangContext';
import examStyles from '../exam/Exam.module.css';
import styles from './Deck.module.css';
import { TURN_MS, acceptsActivation, activationSource, type ActivationSource } from './turnGuard';
import { ZONES, ringOffset, slotForOffset, stepZone, zoneById, type SlotName, type ZoneId } from './zones';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** 槽位名 → 样式类。deep（五张牌起才用到）与第三层同位、整张淡出，见 Deck.module.css 的 .slotDeep */
const SLOT_CLASS: Record<SlotName, string> = {
  front: styles.slotFront,
  right: styles.slotRight,
  left: styles.slotLeft,
  back: styles.slotBack,
  deep: styles.slotDeep,
};

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
  /**
   * 此刻进不去的区与原因（开放窗口外的密卷）。卡照样能转到前位看；前位时命中层念的就是这句原因，
   * 快速开始照样摆着但置灰（置灰由 quickStart.disabled 管）——与 locked 不同：
   * 锁着等密码 / 等充能的卡压根不摆快速开始
   */
  closed?: Partial<Record<ZoneId, string>>;
  /** 覆盖卡面副文；给空/不传就用字典里的默认文案 */
  subs?: Partial<Record<ZoneId, string>>;
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
    /** 正在开考（点下去到题目载入完成）：挂转圈与 aria-busy。防连点靠 disabled 与 start() 的重入守卫 */
    busy?: boolean;
    onStart: () => void;
  };
}

export default function CardDeck({
  front,
  onFront,
  onOpen,
  badges,
  locked,
  closed,
  subs,
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
  // 前牌随鼠标轻微倾斜（见 components/fx/useCardTilt）。ref 只挂在前牌的外层上：
  // 转牌时 React 把它从旧前牌摘下（那张就地回正）、挂到新前牌上，后牌永远不倾斜。
  // deck 退场的 280ms 里停用，展开动画期间牌面不再跟手
  const tiltRef = useCardTilt<HTMLDivElement>({ enabled: !leaving });

  // 转牌守卫（./turnGuard）：记下最近一次转牌的时刻，之后 TURN_MS 内指针在卡上的点击一律不认
  // （命中层上键盘按的照常，见下）。前牌不论因何而变（点侧牌、键盘、横滑、页签换区、解锁自动转位），
  // 牌都要滑 TURN_MS，所以在 front 变了之后统一记一笔；点侧牌那条路在点击当下就先记上，不等这次渲染
  const turnedAtRef = useRef(Number.NEGATIVE_INFINITY);
  const shownFrontRef = useRef(front);
  useEffect(() => {
    if (shownFrontRef.current === front) return;
    shownFrontRef.current = front;
    turnedAtRef.current = performance.now();
  }, [front]);
  const settled = (source?: ActivationSource) => acceptsActivation(turnedAtRef.current, performance.now(), { source });

  useEffect(() => {
    if (autoFocus) viewportRef.current?.focus();
  }, [autoFocus]);

  /**
   * 跟手位移直接写进节点，不走 state：touchmove 的频率等于屏幕刷新率，
   * 每帧 setState 就是每帧重渲染全部卡面与封面。传 null 表示收手复位。
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
    // 焦点若停在前牌的快速开始上，转完那张就成了后牌、快速开始被收起（inert），
    // 焦点会掉回 <body>。先收回到牌堆容器，键盘用户接着按 ←→ / Enter 不迷路
    if (viewportRef.current && viewportRef.current !== document.activeElement &&
      viewportRef.current.contains(document.activeElement)) {
      viewportRef.current.focus();
    }
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
      // 焦点在牌里的按钮上（快速开始）：Enter / 空格归按钮自己，别抢成「展开面板」——
      // 原先这里一律 preventDefault，键盘用户按快速开始得到的是面板
      if (target && target !== e.currentTarget && target.tagName === 'BUTTON') return;
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
    <div
      className={`${styles.deck} ${leaving ? styles.deckLeaving : ''}`}
      // 转牌过渡的时长从守卫常量来：样式表里的槽位位移读 var(--turn-ms)，两边只有一个出处
      style={{ '--turn-ms': `${TURN_MS}ms` } as CSSProperties}
    >
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
            // 位次 → 槽位（规则在 zones.ts 的 slotForOffset，按牌的张数算，加卡不用回来改这里）
            const slot = SLOT_CLASS[slotForOffset(offset, ZONES.length)];
            const isFront = offset === 0;
            const openable = !zone.comingSoon && !locked[zone.id] && zone.quickStart;
            // 开放窗口外的区：快速开始照样摆着，置灰（用户方案）；锁定态那种是压根不摆
            const shut = !!closed?.[zone.id] && zone.quickStart;
            return (
              <div
                key={zone.id}
                ref={isFront ? tiltRef : undefined}
                className={`${styles.card} ${slot}`}
                // 区色：前牌那圈彩色投影取它。投影本身不补间，只过渡一层伪元素的 opacity
                style={{ '--tint': zone.tint } as CSSProperties}
              >
                {/* 倾斜只作用在 .tilt 这一层（连同两圈投影），外层 .card 的槽位
                    transform（转牌、横滑跟手）一个字都不动；.face 是卡面本体
                    （边框、底色、圆角裁切；跟手高光只在封面里） */}
                <div className={styles.tilt}>
                  <div className={styles.face}>
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
                      {/* 跟手高光：只照封面图。.coverBox 里只放图和光，不放字 */}
                      <span className={styles.glare} aria-hidden="true" />
                    </div>
                    {/* 编号与徽章落在封面上，但挂在 .face 上：.coverBox 是高光的混合隔离组，
                        放进去的字会随组先栅格、再随倾斜重采样而发虚（见 Deck.module.css） */}
                    <span className={styles.no} aria-hidden="true">
                      {zone.no}
                    </span>
                    <span
                      className={`${styles.badge} ${locked[zone.id] ? styles.badgeLocked : ''}`}
                    >
                      {badges[zone.id]}
                    </span>

                    <div className={styles.body}>
                      <div className={styles.title}>{t.zone.title[zone.id]}</div>
                      <div className={styles.sub}>{subs?.[zone.id] || t.zone.sub[zone.id]}</div>
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
                          后牌上再加 inert：不可点、不可聚焦、读屏跳过——不单靠 visibility
                          这一条样式兜着（它哪天被改成 opacity: 0，按钮就又能点、能 Tab 到了） */}
                      {(openable || shut) && (
                        <div
                          className={`${styles.quick} ${isFront ? '' : styles.quickIdle}`}
                          aria-hidden={isFront ? undefined : true}
                          inert={isFront ? undefined : true}
                        >
                          <div className={styles.quickSummary}>{quickStart.summary}</div>
                          <button
                            type="button"
                            className={styles.quickBtn}
                            disabled={quickStart.disabled}
                            aria-busy={quickStart.busy || undefined}
                            aria-label={t.deck.quickAria(quickStart.summary)}
                            onClick={(e) => {
                              // 命中层是兄弟节点、不是祖先，本来也收不到这一下；
                              // 写出来是防止日后有人把按钮挪进 .hit 里
                              e.stopPropagation();
                              // 刚转到前位、牌还在滑：不认（见 ./turnGuard）。不传来源 = 键盘按的也一样等——
                              // 快速开始直接开考，转牌中途误触的代价比多按一次大
                              if (!settled()) return;
                              // 窗口外的区：置灰之外再挡一道，不靠调用方把 disabled 算对
                              if (shut) return;
                              // 直调，不包任何异步：requestFullscreen 认的是同步手势链
                              quickStart.onStart();
                            }}
                          >
                            {quickStart.busy && <BusySpinner />}
                            {quickStart.label}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 侧位标题：左右各一份，对齐写死（贴外侧），只在对应的侧位淡入；正文在非前位整块淡出。
                        转牌时只交叉淡变、从不改对齐，所以没有文字瞬跳（见 Deck.module.css）。
                        读屏已有正文与命中层上的卡名，这两份不念 */}
                    <div className={`${styles.sideTitle} ${styles.sideTitleL}`} aria-hidden="true">
                      {t.zone.title[zone.id]}
                    </div>
                    <div className={`${styles.sideTitle} ${styles.sideTitleR}`} aria-hidden="true">
                      {t.zone.title[zone.id]}
                    </div>

                    <button
                      type="button"
                      className={styles.hit}
                      tabIndex={-1}
                      aria-label={
                        !isFront
                          ? t.deck.frontAria(zone.no, t.zone.title[zone.id])
                          : // 锁定的 9.0 展开的是 Diagnostic 介绍页，不是配置面板，
                            // 读屏念出来的就该是它真正会做的事
                            zone.unlockPath === 'progress' && locked[zone.id]
                            ? t.deck.diagnosticAria(zone.no, t.zone.title[zone.id])
                            : // 窗口外的区按 Enter 只会弹原因，念的就是那句原因
                              closed?.[zone.id]
                              ? closed[zone.id]
                              : // 锁着的密卷展开的是密码面板
                                zone.unlockPath === 'password' && locked[zone.id]
                                ? t.deck.passwordAria(zone.no, t.zone.title[zone.id])
                                : // comingSoon 卡按 Enter 只会弹「即将开放」，念「展开配置」就是骗读屏
                                  zone.comingSoon
                                  ? t.block.comingSoon(t.zone.title[zone.id])
                                  : t.deck.openAria(zone.no, t.zone.title[zone.id])
                      }
                      onClick={(e) => {
                        // 转牌之后 TURN_MS 内指针点的不认：双击侧牌的第二下会落在滑过来的新前牌上。
                        // 键盘按的照常：鼠标点侧牌后焦点就停在这层上，紧接着按 Enter / 空格展开是有意的
                        if (!settled(activationSource(e))) return;
                        if (isFront) {
                          onOpen(zone.id);
                          return;
                        }
                        // 点侧牌就是转牌：当下就记上时刻，不等 front 变了之后的那次记录
                        turnedAtRef.current = performance.now();
                        onFront(zone.id);
                      }}
                    />
                  </div>
                </div>
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
        <div className={styles.keys}>
          {t.deck.keys}
          <span aria-hidden="true"> · </span>
          {/* 片头的重播入口（lib/intro）：链接的样子、按钮的语义（它不去别的页面），Tab 得到、Enter / 空格就播。
              把自己交过去：片头关了焦点回到这里（Safari 点按钮不给焦点，不能靠 activeElement） */}
          <button type="button" className={styles.introLink} onClick={(e) => playIntro(e.currentTarget)}>
            {t.intro.watch}
          </button>
        </div>
      </div>
    </div>
  );
}
