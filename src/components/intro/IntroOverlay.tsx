'use client';

// 大厅片头（用户 2026-09-30）：首次进站在大厅上盖一层全屏遮罩，居中播一遍 15 秒的片头当教程；
// 右上角「跳过」或 Esc 随时跳过，播完自动淡出。之后卡组底下的「看片头」随时重播。
//
// 什么时候自动播、首登的工牌 / 公告怎么排在它后面，见 lib/intro.ts；这里只管播与关：
//   - 静音、行内播放（iOS 不全屏接管）、自动播放；<source> 先 WebM（VP9，小一半）后 MP4（H.264，
//     不认 VP9 的浏览器——比如部分 Safari——退到它）。两份素材都没有音轨（网页版静音是用户定的）
//   - 加载中显示海报图（片尾落版那一帧）；两份都加载失败（404、格式不认）或解码出错时直接关、记「已看」，
//     不把人卡在一张黑幕前面
//   - 自动播放被浏览器拦了（iOS 低电量模式连静音自动播放都拦）：亮出原生控件让人自己点播，跳过照常在
//   - 模态对话框：打开时焦点落到「跳过」、Tab 困在对话框里（复用工牌的轻量焦点陷阱）、关了焦点回到打开前的位置；
//     在屏期间挂遮罩标记（lib/overlay）让身后的无限动画暂停、聚光熄灭，并锁住身后的滚动
//   - 光效开关不管它：片头是教程内容不是装饰。减动效下淡入淡出都是瞬时的（样式表的降级块）

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { onBadgeKey } from '@/components/badge/focusTrap';
import { closeIntro, introState, subscribeIntro, takeIntroOpener, type IntroState } from '@/lib/intro';
import { useLang } from '@/lib/LangContext';
import { holdOverlay } from '@/lib/overlay';
import styles from './IntroOverlay.module.css';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** 素材在 public/intro/ 下（WebM 原样、MP4 去掉音轨、海报取 14.8s 那一帧），体积由测试钉住 */
export const INTRO_MEDIA = {
  webm: `${BASE_PATH}/intro/intro.webm`,
  mp4: `${BASE_PATH}/intro/intro.mp4`,
  poster: `${BASE_PATH}/intro/intro-poster.jpg`,
};

/** 淡出时长，和样式表里 .leaving 的过渡一致；减动效下不等 */
const FADE_MS = 360;

/** 程序聚焦时不亮焦点环（同工牌：首登自动弹出时页面上还没有任何操作，浏览器会把它当键盘聚焦） */
const QUIET_FOCUS: FocusOptions & { focusVisible?: boolean } = { focusVisible: false };

/** 静态导出按「没在播」预渲染；水合之后才按真实状态决定要不要弹出 */
const closedOnServer = (): IntroState => 'closed';

export default function IntroOverlay() {
  const state = useSyncExternalStore(subscribeIntro, introState, closedOnServer);
  if (state === 'closed') return null;
  return <IntroDialog auto={state === 'auto'} />;
}

function IntroDialog({ auto }: { auto: boolean }) {
  const { t } = useLang();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const skipRef = useRef<HTMLButtonElement | null>(null);
  const doneRef = useRef(false);
  const fadeTimerRef = useRef<number | null>(null);
  const [leaving, setLeaving] = useState(false);
  /** 自动播放被拦了：亮出原生控件，让人自己点播 */
  const [needsTap, setNeedsTap] = useState(false);

  /**
   * 关片头。fade：淡出之后再关（跳过、播完）；加载失败不淡，直接关。
   * 淡出期间片头仍算「在播」，首登的工牌 / 公告要等真正关了才出现，不与片头叠在一起
   */
  const finish = useCallback((fade: boolean) => {
    if (doneRef.current) return;
    doneRef.current = true;
    videoRef.current?.pause();
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!fade || reduced) {
      closeIntro();
      return;
    }
    setLeaving(true);
    fadeTimerRef.current = window.setTimeout(() => {
      fadeTimerRef.current = null;
      closeIntro();
    }, FADE_MS);
  }, []);

  // 淡出期间遮罩不接指针（.leaving 的 pointer-events: none），点击会穿到大厅上：这 360ms 里点「快速开始」
  // 进了答题页，整个大厅连同片头一起卸载，淡出的计时被撤——片头就再也关不上，「已看」没写，
  // 回大厅 / 下次进站又重播（审查 2026-10-01）。卸载时若还有待关的计时，当场关掉
  useEffect(
    () => () => {
      if (fadeTimerRef.current === null) return;
      window.clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
      closeIntro();
    },
    [],
  );

  // 焦点：打开时落到「跳过」，关了回到打开前的位置——手动重播回到「看片头」那颗按钮，
  // 首登自动弹出时回到弹出前的焦点（通常什么都没有，那就留在页面上，工牌落下时会自己接过焦点）
  useEffect(() => {
    const opener = takeIntroOpener();
    const active = document.activeElement;
    const back = opener ?? (active instanceof HTMLElement && active !== document.body ? active : null);
    skipRef.current?.focus(auto ? QUIET_FOCUS : undefined);
    return () => {
      if (back?.isConnected) back.focus();
    };
  }, [auto]);

  // 遮罩标记（lib/overlay）：在屏期间身后的无限动画暂停、聚光熄灭
  useEffect(() => holdOverlay(), []);

  // 锁住身后的滚动（同工牌浮层）
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Esc 跳过；Tab / Shift+Tab 困在对话框里：停靠点只有「跳过」，自动播放被拦、亮出控件时再加上视频本身
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const stops = needsTap ? [videoRef.current, skipRef.current] : [skipRef.current];
      onBadgeKey(e, stops, document.activeElement, () => finish(true));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [needsTap, finish]);

  // 自动播放：autoPlay 属性之外再显式 play() 一次，才知道有没有被浏览器拦下（拦下时 promise 以 NotAllowedError 拒绝）。
  // 静音要在 play() 之前就是真的：React 的 muted 只设属性值，这里再补一遍 defaultMuted
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    const started = video.play();
    started?.catch((error: unknown) => {
      if (error instanceof DOMException && error.name === 'NotAllowedError') setNeedsTap(true);
    });
  }, []);

  return (
    <div
      className={`${styles.overlay} ${leaving ? styles.leaving : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={t.intro.aria}
    >
      <div className={styles.frame}>
        <video
          ref={videoRef}
          className={styles.video}
          muted
          playsInline
          autoPlay
          preload="auto"
          poster={INTRO_MEDIA.poster}
          controls={needsTap}
          disablePictureInPicture
          onEnded={() => finish(true)}
          // 解码出错（文件坏了、格式其实不认）落在 <video> 自己身上；某一份 <source> 取不到或不认，error 落在那份
          // <source> 上——浏览器里它不冒泡，React 却会把它往上派到这里。WebM 那份失败是要退到 MP4 的，
          // 不能在这里就关：只认打在 <video> 本身上的
          onError={(e) => {
            if (e.target === e.currentTarget) finish(false);
          }}
        >
          <source src={INTRO_MEDIA.webm} type='video/webm; codecs="vp9"' />
          {/* 最后一份也失败＝没有能播的了（浏览器停在 NETWORK_NO_SOURCE 干等），直接关 */}
          <source src={INTRO_MEDIA.mp4} type="video/mp4" onError={() => finish(false)} />
        </video>
      </div>
      <button ref={skipRef} type="button" className={styles.skip} onClick={() => finish(true)}>
        {t.intro.skip}
      </button>
    </div>
  );
}
