'use client';

// 工牌展示：首登时挂绳吊着工牌落下 → 之后收成设置卡左上角的 3D 丝带 → 点丝带再取出。
// 工牌本体是独立浮层（不嵌在题库展示卡里），翻开后变成左右双页：左联系方式、右赞助。
//
// P8-B（2026-09）：正面做成实体证件——CR80 竖版比例、切边 + 倒角高光、冲孔 + 金属鸭嘴扣、
// 证件式字段、微缩印字防伪线、右下角全息贴片；随指针轻倾 ±8°，指针停住约 0.9 秒就回平
// （倾斜中的字会发软，读字时指针通常是停着的）。背面原生排版，二维码只留码区本身。

import { useCallback, useEffect, useRef, useState } from 'react';
import { useCardTilt } from '@/components/fx/useCardTilt';
import { holdOverlay } from '@/lib/overlay';
import { BADGE_SEEN_KEY as SEEN_KEY } from '@/lib/storage';
import { onBadgeKey } from './focusTrap';
import styles from './IdBadge.module.css';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** 工牌上的身份信息，要改文案只动这里 */
const IDENTITY = {
  org: 'MCQ TEST',
  name: 'Chaney Qian',
  title: '数学爱好者',
  team: 'COMPETITION COACH',
  location: 'Zhejiang',
  // 构建期注入（见 next.config.ts），每次部署自动更新
  serial: `Last Update ${process.env.NEXT_PUBLIC_BUILD_DATE || ''}`.trim(),
};

/** 证件式字段：小标签 + 值。值沿用上面的身份信息，不另写 */
const FIELDS = [
  { label: 'ROLE', value: IDENTITY.team },
  { label: 'REGION', value: IDENTITY.location },
];

/**
 * 背面两页的文字：逐字转写自原来那两张截图（微信名片、赞赏码），不改写、不增删。
 * 昵称第二字按像素与候选字形比对为「栉」（U+6809）。赞赏码那句的引号是原图里的直引号，
 * 原图在「~」后折行，这里照样分两行
 */
const CONTACT = {
  nickname: '桔栉',
  region: 'Zhejiang Hangzhou',
  hint: 'Scan QR code to add me as a friend',
};
const TIP = {
  quote: ['"赞助将全额用于维持cc max5x订阅~', '感谢大家"'],
  caption: "桔栉's Tip Code",
};

/** 挂绳织带与防伪线上的重复印字（纯装饰，读屏不念） */
const STRAP_PRINT = 'MCQ TEST · TMUA · '.repeat(14);
const MICROPRINT = 'TMUA · MAT · STEP · '.repeat(9);

const ASSETS = {
  avatar: `${BASE_PATH}/badge/avatar.jpg`,
  // 两张码都是从最初入库的原始截图（1095b41，960×1418 / 1213×1213）里裁出的精确子区域：
  // 不改色、不重绘、不缩放，<img> 的宽高即文件像素。显示时一律是缩小（见测试里的 SHA-256 钉子）
  contact: `${BASE_PATH}/badge/contact-code.png`,
  tip: `${BASE_PATH}/badge/tip-code.png`,
};

// 动画时长，和 CSS 里的 keyframes / transition 一一对应，改一处要改两处
const DROP_MS = 1450;
const FOLD_MS = 640;
const FLY_MS = 700;

/** 正面随指针倾斜：±8°；指针停住这么久就回平（见 useCardTilt 的 settleMs） */
const TILT_DEG = 8;
const SETTLE_MS = 900;

type Stage = 'stowed' | 'dropping' | 'resting' | 'flying';

/** 程序聚焦时不亮焦点环（FocusOptions.focusVisible，TS 的 DOM 库还没收录这个字段） */
const QUIET_FOCUS: FocusOptions & { focusVisible?: boolean } = { focusVisible: false };

/**
 * 头带上的坐标纸与函数曲线，呼应经典区封面。viewBox 是 300 × 100，头带本身是 300u × 104u：
 * 按 SVG 默认的 xMidYMid meet 等比缩放（1 个 viewBox 单位 = 1u），上下各留 2u 空白，不拉伸
 */
function BandArt() {
  return (
    <svg className={styles.bandArt} viewBox="0 0 300 100" aria-hidden="true" focusable="false">
      <path className={styles.bandAxis} d="M0 66H300M58 0V100" />
      <path
        className={styles.bandCurve}
        d="M-4 88C22 88 36 42 70 40S118 78 152 74S200 22 236 24S286 58 304 60"
      />
      <circle className={styles.bandDot} cx="70" cy="40" r="2.6" />
      <circle className={styles.bandDot} cx="152" cy="74" r="2.6" />
      <circle className={styles.bandDot} cx="236" cy="24" r="2.6" />
    </svg>
  );
}

export default function IdBadge() {
  const [stage, setStage] = useState<Stage>('stowed');
  const [opened, setOpened] = useState(false);

  const ribbonRef = useRef<HTMLButtonElement | null>(null);
  const badgeRef = useRef<HTMLButtonElement | null>(null);
  const stowRef = useRef<HTMLButtonElement | null>(null);
  const timersRef = useRef<number[]>([]);
  const reducedRef = useRef(false);
  /** 这次落下是首登自动落下（没有任何用户操作）还是点丝带取出 */
  const autoDropRef = useRef(false);

  // 只在静止挂着、且合着（正面朝外）时跟手；落下 / 收起的摆动里不叠倾斜。
  // 减动效、没有悬停的设备、光效关着时钩子自己一个监听都不挂
  const tiltRef = useCardTilt<HTMLDivElement>({
    maxDeg: TILT_DEG,
    settleMs: SETTLE_MS,
    enabled: stage === 'resting' && !opened,
  });

  const after = useCallback((ms: number, run: () => void) => {
    const id = window.setTimeout(run, reducedRef.current ? 0 : ms);
    timersRef.current.push(id);
  }, []);

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) window.clearTimeout(id);
    timersRef.current = [];
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      reducedRef.current = media.matches;
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  // 首登才主动落下；之后默认收着，靠丝带召回
  useEffect(() => {
    let seen = true;
    try {
      seen = !!localStorage.getItem(SEEN_KEY);
      if (!seen) localStorage.setItem(SEEN_KEY, '1');
    } catch {}
    if (seen) return;
    autoDropRef.current = true;
    setStage('dropping');
    after(DROP_MS, () => setStage('resting'));
  }, [after]);

  const show = useCallback(() => {
    clearTimers();
    autoDropRef.current = false;
    setOpened(false);
    setStage('dropping');
    after(DROP_MS, () => setStage('resting'));
  }, [after, clearTimers]);

  /** 收工牌：先合上双页，再顺着挂绳收回上方（纯 CSS，不需要量位置） */
  const stow = useCallback(() => {
    if (stage === 'stowed' || stage === 'flying') return;
    clearTimers();
    const foldFirst = opened;
    setOpened(false);

    after(foldFirst ? FOLD_MS : 0, () => {
      setStage('flying');
      after(FLY_MS, () => {
        setStage('stowed');
        ribbonRef.current?.focus();
      });
    });
  }, [after, clearTimers, opened, stage]);

  const visible = stage !== 'stowed';
  const interactive = stage === 'resting' || stage === 'dropping';

  const toggle = useCallback(() => {
    if (interactive) setOpened((v) => !v);
  }, [interactive]);

  useEffect(() => {
    if (!visible) return;
    // Esc 收起；Tab / Shift+Tab 只在卡片与「收起工牌」之间循环（轻量焦点陷阱，见 ./focusTrap）：
    // 否则焦点会跑到身后被遮住的设置页上，看不见在哪、回车还会按到看不见的按钮
    const onKey = (e: KeyboardEvent) => {
      onBadgeKey(e, [badgeRef.current, stowRef.current], document.activeElement, stow);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, stow]);

  // 浮层在屏上（落下、挂着、收起途中）就在 <html> 上挂遮罩标记（lib/overlay）：身后设置页的
  // 光标聚光看见它就熄灯、不再逐帧重画——否则浮层的整屏 backdrop-filter 要跟着每帧重算
  useEffect(() => {
    if (!visible) return;
    return holdOverlay();
  }, [visible]);

  // 浮层期间锁掉背景滚动，否则滚轮会推动身后的设置页
  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  // 焦点移进浮层（模态对话框的本分）。首登自动落下时页面上还没有任何操作，
  // 浏览器会把这次程序聚焦当成键盘聚焦、亮起焦点环——一圈贴着卡边的光圈读起来像卡的描边。
  // 那一次静默聚焦；键盘用户一按键焦点环照常出现，点丝带取出则交给浏览器自己判断
  useEffect(() => {
    if (stage === 'resting') badgeRef.current?.focus(autoDropRef.current ? QUIET_FOCUS : undefined);
  }, [stage]);

  return (
    <>
      <button
        ref={ribbonRef}
        type="button"
        className={styles.ribbon}
        onClick={show}
        aria-expanded={visible}
        aria-label={visible ? '工牌已取出' : '取出作者工牌'}
        title="作者工牌"
      >
        <span className={styles.ribbonFold} aria-hidden="true" />
        <span className={styles.ribbonTail} aria-hidden="true">
          <span className={styles.ribbonSheen} />
          <span className={styles.ribbonWord}>ID</span>
        </span>
      </button>

      {visible && (
        <div
          className={`${styles.overlay} ${stage === 'flying' ? styles.overlayLeaving : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="作者工牌"
          onClick={stow}
        >
          <div
            className={styles.stage}
            onClick={(e) => e.stopPropagation()}
          >
            <span className={styles.lanyard} aria-hidden="true">
              {/* 两股织带从上方分开、向下收进压扣：绕颈挂绳本来就是一个环，
                  画成一根竖条会像电线。压扣下挂一只开口圈，圈上吊鸭嘴扣，扣舌插进卡顶的冲孔 */}
              <span className={`${styles.strap} ${styles.strapLeft}`}>
                <span className={styles.strapPrint}>{STRAP_PRINT}</span>
              </span>
              <span className={`${styles.strap} ${styles.strapRight}`}>
                <span className={styles.strapPrint}>{STRAP_PRINT}</span>
              </span>
              <span className={styles.ring} />
              <span className={styles.crimp} />
              <span className={styles.clip} />
            </span>

            <div className={styles.flyer}>
              <div className={styles.fit}>
                {/* 翻开后正面朝里，卡片按钮的背面收不到点击，
                    所以整个跨页兜住 toggle：合上/翻开都点得动 */}
                <div
                  className={`${styles.spread} ${opened ? styles.spreadOpen : ''}`}
                  onClick={toggle}
                >
                  {/* 右页：常驻，合上时被左翼盖住。合着时读屏也不念（看不见的就不念） */}
                  <div
                    className={`${styles.page} ${styles.rightPage}`}
                    aria-hidden={opened ? undefined : true}
                  >
                    <div className={styles.back}>
                      <span className={styles.backBand}>赞助 · TIP</span>
                      <span className={styles.backBody}>
                        <img
                          className={`${styles.code} ${styles.codeTip}`}
                          src={ASSETS.tip}
                          width={648}
                          height={648}
                          alt="微信赞助码"
                          draggable={false}
                        />
                        <span className={styles.quote}>
                          {TIP.quote[0]}
                          <br />
                          {TIP.quote[1]}
                        </span>
                        <span className={styles.backCaption}>{TIP.caption}</span>
                      </span>
                      <span className={styles.backMicro} aria-hidden="true">
                        {MICROPRINT}
                      </span>
                    </div>
                  </div>

                  {/* 左翼：绕右边缘（书脊）翻转。合上=正面工牌，翻开=联系方式 */}
                  <div className={`${styles.page} ${styles.leaf} ${opened ? styles.leafOpen : ''}`}>
                    <div
                      className={`${styles.face} ${styles.faceInner}`}
                      aria-hidden={opened ? undefined : true}
                    >
                      <div className={styles.back}>
                        <span className={styles.backBand}>联系 · WECHAT</span>
                        <span className={styles.backBody}>
                          <span className={styles.nickname}>{CONTACT.nickname}</span>
                          <span className={styles.region}>{CONTACT.region}</span>
                          <img
                            className={`${styles.code} ${styles.codeContact}`}
                            src={ASSETS.contact}
                            width={801}
                            height={801}
                            alt="微信联系方式二维码"
                            draggable={false}
                          />
                          <span className={styles.backCaption}>{CONTACT.hint}</span>
                        </span>
                        <span className={styles.backMicro} aria-hidden="true">
                          {MICROPRINT}
                        </span>
                      </div>
                    </div>

                    <div className={`${styles.face} ${styles.faceOuter}`}>
                      {/* 倾斜钩子挂在这层：它不转，只收指针、量尺寸、挂变量；给景深。
                          真正倾斜的是里面的卡（量正在倾斜的那层，倾角会追着自己跑） */}
                      <div ref={tiltRef} className={styles.tiltHost}>
                        <button
                          ref={badgeRef}
                          type="button"
                          className={styles.card}
                          onClick={(e) => {
                            e.stopPropagation(); // 免得跨页的 toggle 再翻一次
                            toggle();
                          }}
                          aria-expanded={opened}
                          aria-label={opened ? '合上工牌' : '翻开工牌，查看联系方式与赞助码'}
                        >
                          <span className={styles.band}>
                            <BandArt />
                            <span className={styles.org}>{IDENTITY.org}</span>
                            <span className={styles.punch} aria-hidden="true" />
                            <span className={styles.chip} aria-hidden="true" />
                          </span>

                          <span className={styles.photoFrame}>
                            <img className={styles.photo} src={ASSETS.avatar} alt="作者卡通形象" />
                          </span>

                          <span className={styles.name}>{IDENTITY.name}</span>
                          <span className={styles.title}>{IDENTITY.title}</span>

                          <span className={styles.fields}>
                            {FIELDS.map((field) => (
                              <span key={field.label} className={styles.field}>
                                <span className={styles.fieldLabel}>{field.label}</span>
                                <span className={styles.fieldValue}>{field.value}</span>
                              </span>
                            ))}
                          </span>

                          <span className={styles.microprint} aria-hidden="true">
                            {MICROPRINT}
                          </span>

                          <span className={styles.foot}>
                            <span className={styles.idBlock}>
                              <span className={styles.barcode} aria-hidden="true" />
                              <span className={styles.serial}>{IDENTITY.serial}</span>
                            </span>
                            <span className={styles.holo} aria-hidden="true" />
                          </span>

                          <span className={styles.sheen} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.hintRow}>
              <span className={styles.hint}>
                {opened ? '再次点击工牌合上' : '点击工牌翻开 · 联系方式与赞助码'}
              </span>
              <button ref={stowRef} type="button" className={styles.stowBtn} onClick={stow}>
                收起工牌
              </button>
            </div>
          </div>
        </div>
      )}

      <span className={styles.srOnly} role="status">
        {visible ? (opened ? '工牌已翻开' : '工牌已取出') : '工牌已收起'}
      </span>
    </>
  );
}
