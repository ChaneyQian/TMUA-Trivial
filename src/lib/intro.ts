// 大厅片头（用户 2026-09-30：「把片头放到站点首页，首次进站播一次可跳过，为教程」）。
//
// 这个模块管两件事，都不碰 React：
//   1. 该不该自动播（shouldAutoplayIntro，纯函数）：没看过、没开减动效、没开省流量，三条都满足才播。
//      后两种只是不自动播，不记「已看」——哪天关了减动效 / 省流量，第一次进站照样会播
//   2. 片头此刻的状态（'auto' 首登自动播 / 'replay' 手动重播 / 'closed'）与首登弹出的排队：
//      工牌落下（IdBadge）、公告弹出（NoticeBoard）在片头自动播着的时候都等它关了再按原逻辑出现
//      （afterIntro），片头不自动播时一切照旧、立刻出现
//
// 状态在模块里（整个页面只有一份片头），第一次被问到时才判定，之后不再变——判定前后谁先问都拿到同一个答案：
// React 的 effect 按树序跑，工牌的首登 effect 比片头自己的更早，谁先问都得一致。
// 重播（playIntro）不影响排队：那时首登该出现的早就出现过了。
//
// 用带扩展名的相对路径引依赖（同 lib 里的写法），整个模块在 node --test 里也能直接加载。

import { INTRO_SEEN_KEY } from './storage.ts';

/** 判定自动播要看的三样 */
export interface IntroEnv {
  /** 看过（跳过 / 播完 / 加载失败）了 */
  seen: boolean;
  /** prefers-reduced-motion: reduce */
  reducedMotion: boolean;
  /** navigator.connection.saveData（Chrome 系；Safari / Firefox 没有这个字段，当没开） */
  saveData: boolean;
}

/** 首次进站才自动播；减动效、省流量的用户不自动播（手动点「看片头」照样能播） */
export function shouldAutoplayIntro(env: IntroEnv): boolean {
  return !env.seen && !env.reducedMotion && !env.saveData;
}

/**
 * 从浏览器读判定要的三样。存储读不到（隐私模式禁用、配额满）按「看过」算：
 * 记不住「已看」的话，每次进站都要再看一遍 15 秒——宁可少播，入口一直在卡组底下（同工牌的首登）
 */
export function readIntroEnv(): IntroEnv {
  let seen = true;
  try {
    seen = localStorage.getItem(INTRO_SEEN_KEY) !== null;
  } catch {}
  const reducedMotion =
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } | null }).connection;
  return { seen, reducedMotion, saveData: connection?.saveData === true };
}

/** 'auto'：首登自动在播；'replay'：手动点「看片头」在播；'closed'：没在播 */
export type IntroState = 'auto' | 'replay' | 'closed';

/** 状态变化时在 window 上广播的事件名（事件名，不是存储键） */
export const INTRO_EVENT = 'mcq-test:intro-change';

let state: IntroState | null = null;
/** 手动重播时按下的那个按钮：片头关了焦点回到它（Safari 点按钮不给焦点，不能靠 activeElement） */
let opener: HTMLElement | null = null;

function emit(): void {
  window.dispatchEvent(new Event(INTRO_EVENT));
}

/** 片头此刻的状态。第一次问到时按 readIntroEnv 判定要不要自动播，之后只由下面几个函数改 */
export function introState(): IntroState {
  if (state === null) state = shouldAutoplayIntro(readIntroEnv()) ? 'auto' : 'closed';
  return state;
}

/** 手动播（卡组底下的「看片头」）：减动效、省流量、看过的都能播——那是用户自己选的。正在播时不理 */
export function playIntro(from?: HTMLElement | null): void {
  if (introState() !== 'closed') return;
  opener = from ?? null;
  state = 'replay';
  emit();
}

/** 片头关了（跳过、播完、加载失败）：记「已看」，排着队的首登弹出这时才出现 */
export function closeIntro(): void {
  if (introState() === 'closed') return;
  try {
    localStorage.setItem(INTRO_SEEN_KEY, '1');
  } catch {}
  state = 'closed';
  emit();
}

/** 取走重播时记下的按钮（取一次就清掉，免得下一次自动播把焦点送回一个旧按钮） */
export function takeIntroOpener(): HTMLElement | null {
  const from = opener;
  opener = null;
  return from;
}

/** 订阅状态变化；返回退订函数 */
export function subscribeIntro(onChange: () => void): () => void {
  window.addEventListener(INTRO_EVENT, onChange);
  return () => window.removeEventListener(INTRO_EVENT, onChange);
}

/**
 * 首登弹出的排队：片头首登自动播着就等它关了再跑 run，否则立刻跑。
 * 返回取消函数（effect 的清理）：还在等的话就不再等；已经跑过了就什么都不做
 */
export function afterIntro(run: () => void): () => void {
  if (introState() !== 'auto') {
    run();
    return () => {};
  }
  let waiting = true;
  const stop = subscribeIntro(() => {
    if (!waiting || introState() === 'auto') return;
    waiting = false;
    stop();
    run();
  });
  return () => {
    if (!waiting) return;
    waiting = false;
    stop();
  };
}

/** 只给测试用：把模块状态清回「还没判定」 */
export function resetIntroForTests(): void {
  state = null;
  opener = null;
}
