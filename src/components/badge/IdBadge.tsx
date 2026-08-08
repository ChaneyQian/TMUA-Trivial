'use client';

// 工牌展示：首登时挂绳吊着工牌落下 → 之后收成设置卡左上角的 3D 丝带 → 点丝带再取出。
// 工牌本体是独立浮层（不嵌在题库展示卡里），翻开后变成左右双页：左联系方式、右赞助。

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './IdBadge.module.css';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
const SEEN_KEY = 'mcq-test:badge-seen:v1';

/** 工牌上的身份信息，要改文案只动这里 */
const IDENTITY = {
  org: 'MCQ TEST',
  name: 'Chaney Qian',
  title: '数学爱好者',
  team: 'COMPETITION COACH',
  // 构建期注入（见 next.config.ts），每次部署自动更新
  serial: `Last Update ${process.env.NEXT_PUBLIC_BUILD_DATE || ''}`.trim(),
};

const ASSETS = {
  avatar: `${BASE_PATH}/badge/avatar.jpg`,
  contact: `${BASE_PATH}/badge/contact-qr.png`,
  tip: `${BASE_PATH}/badge/tip-qr.png`,
};

// 动画时长，和 CSS 里的 keyframes / transition 一一对应，改一处要改两处
const DROP_MS = 1450;
const FOLD_MS = 640;
const FLY_MS = 700;

type Stage = 'stowed' | 'dropping' | 'resting' | 'flying';

export default function IdBadge() {
  const [stage, setStage] = useState<Stage>('stowed');
  const [opened, setOpened] = useState(false);

  const ribbonRef = useRef<HTMLButtonElement | null>(null);
  const flyerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLButtonElement | null>(null);
  const timersRef = useRef<number[]>([]);
  const reducedRef = useRef(false);

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
    setStage('dropping');
    after(DROP_MS, () => setStage('resting'));
  }, [after]);

  const show = useCallback(() => {
    clearTimers();
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        stow();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, stow]);

  // 浮层期间锁掉背景滚动，否则滚轮会推动身后的设置页
  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  useEffect(() => {
    if (stage === 'resting') badgeRef.current?.focus();
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
          <div className={styles.stage} onClick={(e) => e.stopPropagation()}>
            <span className={styles.lanyard} aria-hidden="true">
              {/* 两股带子从上方分开、向下收进扣子：绕颈挂绳本来就是一个环，
                  画成一根竖条会像电线 */}
              <span className={`${styles.strap} ${styles.strapLeft}`} />
              <span className={`${styles.strap} ${styles.strapRight}`} />
              <span className={styles.lanyardClip} />
            </span>

            <div ref={flyerRef} className={styles.flyer}>
              <div className={`${styles.fit} ${opened ? styles.fitOpen : ''}`}>
                {/* 翻开后正面朝里，卡片按钮的背面收不到点击，
                    所以整个跨页兜住 toggle：合上/翻开都点得动 */}
                <div
                  className={`${styles.spread} ${opened ? styles.spreadOpen : ''}`}
                  onClick={toggle}
                >
                  {/* 右页：常驻，合上时被左翼盖住 */}
                  <div className={`${styles.page} ${styles.rightPage}`}>
                    <div className={styles.qrPlate}>
                      <span className={styles.qrTab}>赞助 · TIP</span>
                      <img className={styles.qrImg} src={ASSETS.tip} alt="微信赞助码" />
                    </div>
                  </div>

                  {/* 左翼：绕右边缘（书脊）翻转。合上=正面工牌，翻开=联系方式 */}
                  <div className={`${styles.page} ${styles.leaf} ${opened ? styles.leafOpen : ''}`}>
                    <div className={`${styles.face} ${styles.faceInner}`}>
                      <div className={styles.qrPlate}>
                        <span className={styles.qrTab}>联系 · WECHAT</span>
                        <img className={styles.qrImg} src={ASSETS.contact} alt="微信联系方式二维码" />
                      </div>
                    </div>

                    <div ref={cardRef} className={`${styles.face} ${styles.faceOuter}`}>
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
                        <span className={styles.holo} aria-hidden="true" />
                        <span className={styles.cardTop}>
                          <span className={styles.dot} aria-hidden="true" />
                          <span className={styles.org}>{IDENTITY.org}</span>
                          <span className={styles.chip} aria-hidden="true" />
                        </span>

                        <span className={styles.photoFrame}>
                          <img className={styles.photo} src={ASSETS.avatar} alt="作者卡通形象" />
                          <span className={styles.photoGlow} aria-hidden="true" />
                        </span>

                        <span className={styles.name}>{IDENTITY.name}</span>
                        <span className={styles.title}>{IDENTITY.title}</span>
                        <span className={styles.rule} aria-hidden="true" />
                        <span className={styles.team}>{IDENTITY.team}</span>
                        <span className={styles.serial}>{IDENTITY.serial}</span>
                        <span className={styles.barcode} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.hintRow}>
              <span className={styles.hint}>
                {opened ? '再次点击工牌合上' : '点击工牌翻开 · 联系方式与赞助码'}
              </span>
              <button type="button" className={styles.stowBtn} onClick={stow}>
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
