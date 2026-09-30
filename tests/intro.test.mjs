import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

import { DICT } from '../src/lib/i18n.ts';
import { INTRO_SEEN_KEY } from '../src/lib/storage.ts';
import {
  INTRO_EVENT,
  afterIntro,
  closeIntro,
  introState,
  playIntro,
  readIntroEnv,
  resetIntroForTests,
  shouldAutoplayIntro,
  takeIntroOpener,
} from '../src/lib/intro.ts';
import { cascade } from './helpers/css-rules.mjs';
import { attrValue, balanced, code, effects, jsxChildren, jsxOpening, namedImports } from './helpers/source.mjs';

// 大厅片头（用户 2026-09-30：「把片头放到站点首页，首次进站播一次可跳过，为教程」）。这一组盯：
//   1. 该不该自动播（纯函数）与片头状态、首登弹出的排队（lib/intro，假 window / 存储 / navigator 真跑）
//   2. 组件接线：静音行内自动播、WebM 在前 MP4 在后、海报、失败直接关、跳过 / Esc / 播完、对话框语义、遮罩标记
//   3. 工牌与公告的首登弹出排在片头后面；片头只挂在大厅
//   4. 入库素材：WebM 原样、MP4 没有音轨、海报 ≤ 80KB

const OVERLAY = 'src/components/intro/IntroOverlay.tsx';
const EXAM = 'src/components/exam/ExamApp.tsx';
const BADGE = 'src/components/badge/IdBadge.tsx';
const NOTICE = 'src/components/notice/NoticeBoard.tsx';

/** 把一段（可能带 TS 语法的）函数体包成能调用的函数，形参按 names 传 */
function runnable(body, names) {
  const js = ts.transpileModule(`function __run(${names.join(', ')}) {\n${body}\n}`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText;
  return new Function(`${js}\nreturn __run;`)();
}

test('the intro autoplays only on a first visit, and never for reduced motion or data saver', () => {
  for (const seen of [false, true]) {
    for (const reducedMotion of [false, true]) {
      for (const saveData of [false, true]) {
        assert.equal(
          shouldAutoplayIntro({ seen, reducedMotion, saveData }),
          !seen && !reducedMotion && !saveData,
          `seen=${seen} reduced=${reducedMotion} saveData=${saveData}`,
        );
      }
    }
  }
});

/**
 * 装一套假的浏览器环境：window（事件 + matchMedia）、localStorage、navigator.connection。
 * store 为 null 表示存储整个被禁用（读写都抛）
 */
function fakeBrowser(t, { store = new Map(), reduced = false, saveData, connection = true } = {}) {
  const listeners = new Map();
  const win = {
    addEventListener: (type, fn) => {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(fn);
    },
    removeEventListener: (type, fn) => listeners.get(type)?.delete(fn),
    dispatchEvent: (event) => {
      for (const fn of [...(listeners.get(event.type) ?? [])]) fn(event);
      return true;
    },
    matchMedia: (query) => {
      assert.equal(query, '(prefers-reduced-motion: reduce)');
      return { matches: reduced };
    },
  };
  const writes = [];
  const storage =
    store === null
      ? {
          getItem() {
            throw new Error('storage disabled');
          },
          setItem() {
            throw new Error('storage disabled');
          },
        }
      : {
          getItem: (k) => (store.has(k) ? store.get(k) : null),
          setItem: (k, v) => {
            writes.push([k, String(v)]);
            store.set(k, String(v));
          },
        };
  const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  globalThis.window = win;
  globalThis.localStorage = storage;
  Object.defineProperty(globalThis, 'navigator', {
    value: connection ? { connection: saveData === undefined ? {} : { saveData } } : {},
    configurable: true,
    writable: true,
  });
  resetIntroForTests();
  t.after(() => {
    delete globalThis.window;
    delete globalThis.localStorage;
    if (originalNavigator) Object.defineProperty(globalThis, 'navigator', originalNavigator);
    resetIntroForTests();
  });
  return { writes, heard: () => listeners.get(INTRO_EVENT)?.size ?? 0 };
}

test('a first visit plays automatically; first-visit popups wait for it, and closing records it as seen', (t) => {
  const store = new Map();
  const env = fakeBrowser(t, { store });
  assert.deepEqual(readIntroEnv(), { seen: false, reducedMotion: false, saveData: false });
  assert.equal(introState(), 'auto');
  assert.deepEqual(env.writes, [], '判定本身不写存储：只有真的关了才记「已看」');

  // 工牌、公告的首登弹出排队：片头在播就不跑
  const ran = [];
  afterIntro(() => ran.push('badge'));
  const cancel = afterIntro(() => ran.push('cancelled'));
  afterIntro(() => ran.push('notice'));
  cancel(); // 等待中的被取消（effect 清理）就不再跑
  assert.deepEqual(ran, []);

  // 正在自动播时手动重播：不理
  playIntro(null);
  assert.equal(introState(), 'auto');

  closeIntro();
  assert.equal(introState(), 'closed');
  assert.deepEqual(env.writes, [[INTRO_SEEN_KEY, '1']], '跳过 / 播完 / 失败都记「已看」');
  assert.deepEqual(ran, ['badge', 'notice'], '片头关了，排着队的按原来的先后出现，取消了的不出现');
  assert.equal(env.heard(), 0, '跑过的等待方都退订了');

  // 关过之后再问：不自动播、排队的立刻跑
  afterIntro(() => ran.push('later'));
  assert.deepEqual(ran, ['badge', 'notice', 'later']);
  closeIntro(); // 重复关无害
  assert.equal(env.writes.length, 1);

  // 下次进站（模块状态清零、存储里有「已看」）：不自动播
  resetIntroForTests();
  assert.equal(introState(), 'closed');
});

test('reduced motion, data saver, a seen flag or dead storage keep it from autoplaying, and write nothing', (t) => {
  for (const [label, options] of [
    ['减动效', { reduced: true }],
    ['省流量', { saveData: true }],
    ['看过了', { store: new Map([[INTRO_SEEN_KEY, '1']]) }],
    ['存储被禁用', { store: null }],
  ]) {
    const env = fakeBrowser(t, options);
    assert.equal(introState(), 'closed', `${label}：不自动播`);
    const ran = [];
    afterIntro(() => ran.push(1));
    assert.deepEqual(ran, [1], `${label}：工牌 / 公告照旧立刻出现`);
    assert.deepEqual(env.writes, [], `${label}：只是不自动播，不记「已看」`);
  }
  // 省流量没开、拿不到 connection（Safari / Firefox）都当没开
  fakeBrowser(t, { saveData: false });
  assert.equal(introState(), 'auto');
  fakeBrowser(t, { connection: false });
  assert.equal(introState(), 'auto');
});

test('the decision is taken once: whoever asks first, everyone gets the same answer', (t) => {
  const store = new Map();
  fakeBrowser(t, { store });
  assert.equal(introState(), 'auto');
  store.set(INTRO_SEEN_KEY, '1'); // 判定之后存储变了（别的标签页记了「已看」）：这一页不跟着改口
  assert.equal(introState(), 'auto');
});

test('the watch-intro link replays it for anyone, and focus goes back to the button that asked', (t) => {
  const env = fakeBrowser(t, { reduced: true, saveData: true });
  assert.equal(introState(), 'closed');
  const button = { name: 'watch' };
  playIntro(button);
  assert.equal(introState(), 'replay', '减动效、省流量的用户手动点也能播');
  // 重播不挡首登弹出（那时它们早就出现过了）
  const ran = [];
  afterIntro(() => ran.push(1));
  assert.deepEqual(ran, [1]);
  assert.equal(takeIntroOpener(), button);
  assert.equal(takeIntroOpener(), null, '取一次就清掉');
  playIntro(null); // 正在播时再点：不理
  assert.equal(introState(), 'replay');
  closeIntro();
  assert.equal(introState(), 'closed');
  assert.deepEqual(env.writes, [[INTRO_SEEN_KEY, '1']]);
  assert.notEqual(INTRO_EVENT, INTRO_SEEN_KEY, '事件名不是存储键');
});

// ---------------------------------------------------------------------------
// 组件接线（.tsx 不能直接 import：按房规在剥掉注释的源码上按结构判）

test('the video is muted, inline, autoplaying, poster-backed, WebM first and MP4 second', () => {
  const src = code(fs.readFileSync(OVERLAY, 'utf8'));
  const video = jsxOpening(src, '<video');
  assert.ok(video, '找不到 <video>');
  for (const flag of ['muted', 'playsInline', 'autoPlay']) assert.equal(video.attrs.get(flag), true, `<video> 少了 ${flag}`);
  assert.equal(attrValue(video.attrs.get('preload')), 'auto');
  assert.equal(attrValue(video.attrs.get('poster')), 'INTRO_MEDIA.poster');
  assert.equal(video.attrs.has('loop'), false, '播完要能收到 ended');
  assert.equal(attrValue(video.attrs.get('controls')), 'needsTap', '只在自动播放被拦下时亮出控件');

  const inner = jsxChildren(src, video);
  const sources = [...inner.matchAll(/<source\b/g)].map((m) => jsxOpening(inner, '<source', m.index));
  assert.equal(sources.length, 2);
  assert.equal(attrValue(sources[0].attrs.get('src')), 'INTRO_MEDIA.webm', '先 WebM');
  assert.match(attrValue(sources[0].attrs.get('type')), /^video\/webm; codecs="vp9"$/);
  assert.equal(attrValue(sources[1].attrs.get('src')), 'INTRO_MEDIA.mp4', '后 MP4');
  assert.equal(attrValue(sources[1].attrs.get('type')), 'video/mp4');

  const mediaAt = src.indexOf('export const INTRO_MEDIA = {');
  assert.ok(mediaAt >= 0, '找不到 INTRO_MEDIA');
  const media = balanced(src, src.indexOf('{', mediaAt));
  assert.match(media, /webm: `\$\{BASE_PATH\}\/intro\/intro\.webm`/);
  assert.match(media, /mp4: `\$\{BASE_PATH\}\/intro\/intro\.mp4`/);
  assert.match(media, /poster: `\$\{BASE_PATH\}\/intro\/intro-poster\.jpg`/);

  // 显式 play() 一次：静音先落实，被拦下（NotAllowedError）才亮控件
  const play = effects(src).find(({ body }) => body.includes('.play()'));
  assert.ok(play, '找不到 play() 那段 effect');
  assert.deepEqual(play.deps, []);
  assert.ok(play.body.indexOf('video.muted = true') < play.body.indexOf('.play()'), '静音要在 play() 之前');
  assert.match(play.body, /NotAllowedError[\s\S]*setNeedsTap\(true\)/);
});

test('ended fades it out, skip and Esc fade it out, and a load failure closes it at once', () => {
  const src = code(fs.readFileSync(OVERLAY, 'utf8'));
  const video = jsxOpening(src, '<video');
  const inner = jsxChildren(src, video);
  const mp4 = jsxOpening(inner, 'INTRO_MEDIA.mp4');

  // 各处交给 finish 的参数：true＝淡出再关，false＝直接关。按语义判——把 handler 真跑一遍
  const handler = (raw) => {
    const calls = [];
    const fn = new Function('finish', `return (${attrValue(raw)});`)((fade) => calls.push(fade));
    return { fn, calls };
  };
  const ended = handler(video.attrs.get('onEnded'));
  ended.fn();
  assert.deepEqual(ended.calls, [true], '播完：淡出');

  // <video> 自己的 error（解码失败）直接关；从 <source> 冒上来的（React 会把它往上派）不理——WebM 失败要退到 MP4
  const videoError = handler(video.attrs.get('onError'));
  const self = {};
  videoError.fn({ target: self, currentTarget: self });
  videoError.fn({ target: { tagName: 'SOURCE' }, currentTarget: self });
  assert.deepEqual(videoError.calls, [false]);
  // 最后一份 <source> 也失败：直接关
  const lastSource = handler(mp4.attrs.get('onError'));
  lastSource.fn({});
  assert.deepEqual(lastSource.calls, [false]);
  // 第一份（WebM）失败不关，交给浏览器退到下一份
  const webm = jsxOpening(inner, 'INTRO_MEDIA.webm');
  assert.equal(webm.attrs.has('onError'), false);

  const skip = jsxOpening(src, 'ref={skipRef}');
  assert.equal(attrValue(skip.attrs.get('type')), 'button');
  const click = handler(skip.attrs.get('onClick'));
  click.fn();
  assert.deepEqual(click.calls, [true], '跳过：淡出');
  assert.equal(jsxChildren(src, skip).trim(), '{t.intro.skip}');

  // Esc 与焦点陷阱走工牌那套 focusTrap：停靠点是「跳过」（亮出控件时再加上视频），Esc 等于跳过
  assert.ok(namedImports(src, '@/components/badge/focusTrap').has('onBadgeKey'));
  const keydown = effects(src).find(({ body }) => body.includes("'keydown'"));
  assert.ok(keydown);
  for (const dep of ['needsTap', 'finish']) assert.ok(keydown.deps.includes(dep), `keydown effect 少了依赖 ${dep}`);
  const listeners = [];
  const fakeWindow = {
    addEventListener: (type, fn) => listeners.push([type, fn]),
    removeEventListener: (type, fn) => listeners.splice(listeners.findIndex((l) => l[1] === fn), 1),
  };
  for (const needsTap of [false, true]) {
    const seen = [];
    const finishes = [];
    const run = runnable(keydown.body, ['needsTap', 'finish', 'videoRef', 'skipRef', 'onBadgeKey', 'window', 'document']);
    const cleanup = run(
      needsTap,
      (fade) => finishes.push(fade),
      { current: 'video' },
      { current: 'skip' },
      (e, stops, active, stow) => {
        seen.push({ stops, active });
        stow();
      },
      fakeWindow,
      { activeElement: 'skip' },
    );
    assert.equal(listeners.length, 1);
    listeners[0][1]({ key: 'Escape' });
    assert.deepEqual(seen[0].stops, needsTap ? ['video', 'skip'] : ['skip']);
    assert.equal(seen[0].active, 'skip');
    assert.deepEqual(finishes, [true], 'Esc 等于跳过：淡出');
    cleanup();
    assert.equal(listeners.length, 0, '清理时摘掉监听');
  }

  // finish：加载失败、或开着减动效时不等淡出，直接关；其余淡出 FADE_MS 之后才关（淡出期间首登弹出还在等）；
  // 只关一次。按语义判——把 finish 真跑一遍
  const finish = effects(src, 'useCallback').find(({ body }) => body.includes('doneRef.current = true'));
  assert.ok(finish, '找不到 finish');
  assert.deepEqual(finish.deps, []);
  const fadeMs = Number(/const FADE_MS = (\d+);/.exec(src)?.[1]);
  const css = fs.readFileSync('src/components/intro/IntroOverlay.module.css', 'utf8');
  assert.match(css, new RegExp(`transition: opacity ${fadeMs}ms`), '淡出时长和样式表对不上');
  const runFinish = runnable(finish.body, ['fade', 'doneRef', 'videoRef', 'window', 'closeIntro', 'setLeaving', 'fadeTimerRef', 'FADE_MS']);
  for (const [fade, reduced, immediate] of [
    [false, false, true],
    [false, true, true],
    [true, true, true],
    [true, false, false],
  ]) {
    const log = [];
    const timers = [];
    const doneRef = { current: false };
    const win = {
      matchMedia: () => ({ matches: reduced }),
      setTimeout: (fn, ms) => (timers.push([fn, ms]), 7),
    };
    const args = [
      doneRef,
      { current: { pause: () => log.push('pause') } },
      win,
      () => log.push('close'),
      (v) => log.push(`leaving:${v}`),
      { current: null },
      fadeMs,
    ];
    runFinish(fade, ...args);
    if (immediate) {
      assert.deepEqual(log, ['pause', 'close'], `fade=${fade} reduced=${reduced}：直接关`);
      assert.equal(timers.length, 0);
    } else {
      assert.deepEqual(log, ['pause', 'leaving:true'], '先淡出，还没关');
      assert.equal(timers.length, 1);
      assert.equal(timers[0][1], fadeMs);
      timers[0][0]();
      assert.deepEqual(log, ['pause', 'leaving:true', 'close'], '淡出走完才关');
    }
    runFinish(true, ...args);
    runFinish(false, ...args);
    assert.equal(log.filter((l) => l === 'close').length, 1, '只关一次');
  }
});

test('unmounting mid-fade still closes the intro, so a click-through to quick start cannot lose the seen flag', () => {
  // 审查 2026-10-01：淡出的 360ms 里遮罩不接指针，点击穿到大厅上点了「快速开始」，大厅连同片头一起卸载，
  // 淡出计时被撤、closeIntro 不跑——「已看」没写，回大厅 / 下次进站又重播。按语义判：把 finish 与卸载清理真跑一遍
  const src = code(fs.readFileSync(OVERLAY, 'utf8'));
  const finish = effects(src, 'useCallback').find(({ body }) => body.includes('doneRef.current = true'));
  const unmount = effects(src).find(({ body, deps }) => deps?.length === 0 && body.includes('fadeTimerRef') && body.includes('closeIntro'));
  assert.ok(finish && unmount, '找不到 finish 或卸载清理');
  const runFinish = runnable(finish.body, ['fade', 'doneRef', 'videoRef', 'window', 'closeIntro', 'setLeaving', 'fadeTimerRef', 'FADE_MS']);
  const mount = runnable(`return (${unmount.body});`, ['fadeTimerRef', 'window', 'closeIntro']);

  const scene = () => {
    const timers = new Map();
    let next = 1;
    const log = [];
    const win = {
      matchMedia: () => ({ matches: false }),
      setTimeout: (fn) => (timers.set(next, fn), next++),
      clearTimeout: (id) => (log.push(`clear:${id}`), timers.delete(id)),
    };
    const fadeTimerRef = { current: null };
    const close = () => log.push('close');
    const fire = () => {
      for (const [id, fn] of [...timers]) {
        timers.delete(id);
        fn();
      }
    };
    const doFinish = () => runFinish(true, { current: false }, { current: { pause() {} } }, win, close, () => {}, fadeTimerRef, 360);
    const cleanup = () => mount(fadeTimerRef, win, close)();
    return { log, fadeTimerRef, fire, doFinish, cleanup };
  };

  // 淡出途中卸载：当场关（且只关一次），撤掉的计时不会再补一次
  let s = scene();
  s.doFinish();
  assert.deepEqual(s.log, [], '还在淡出，没关');
  s.cleanup();
  assert.deepEqual(s.log, ['clear:1', 'close'], '卸载时还有待关的计时：撤掉它、当场关');
  s.fire();
  assert.equal(s.log.filter((l) => l === 'close').length, 1);

  // 淡出走完才卸载：计时里已经关过，卸载什么都不做
  s = scene();
  s.doFinish();
  s.fire();
  assert.deepEqual(s.log, ['close']);
  assert.equal(s.fadeTimerRef.current, null, '计时跑完要清掉记号');
  s.cleanup();
  assert.deepEqual(s.log, ['close'], '不重复关');

  // 没在淡出就卸载（比如 StrictMode 的模拟卸载）：什么都不做
  s = scene();
  s.cleanup();
  assert.deepEqual(s.log, []);
});

test('it is a labelled modal dialog that takes focus, holds the overlay mark and locks the page behind', () => {
  const src = code(fs.readFileSync(OVERLAY, 'utf8'));
  const dialog = jsxOpening(src, 'role="dialog"');
  assert.equal(attrValue(dialog.attrs.get('aria-modal')), 'true');
  assert.equal(attrValue(dialog.attrs.get('aria-label')), 't.intro.aria');
  assert.equal(DICT.zh.intro.aria, '片头教程');
  assert.equal(DICT.en.intro.aria, 'Intro tutorial');
  assert.equal(DICT.zh.intro.skip, '跳过');
  assert.equal(DICT.en.intro.skip, 'Skip');

  // 遮罩标记：挂载时挂、卸载时摘（清理函数就是 holdOverlay 的 release）
  assert.ok(namedImports(src, '@/lib/overlay').has('holdOverlay'));
  const held = effects(src).filter(({ body }) => body.includes('holdOverlay('));
  assert.equal(held.length, 1);
  assert.deepEqual(held[0].deps, []);
  const release = () => {};
  assert.equal(new Function('holdOverlay', `return (${held[0].body});`)(() => release), release);

  // 焦点：打开时落到「跳过」（首登自动弹出时静默聚焦），关了回到重播按钮 / 打开前的焦点
  const focus = effects(src).find(({ body }) => body.includes('skipRef.current?.focus('));
  assert.ok(focus);
  const run = runnable(focus.body, ['auto', 'skipRef', 'takeIntroOpener', 'document', 'HTMLElement', 'QUIET_FOCUS']);
  class El {
    constructor(name) {
      this.name = name;
      this.isConnected = true;
      this.focused = [];
    }
    focus(options) {
      this.focused.push(options);
    }
  }
  const QUIET = { focusVisible: false };
  for (const [auto, opener, activeName, expectBack] of [
    [false, 'watch', 'body', 'watch'],
    [true, null, 'body', null],
    [true, null, 'ribbon', 'ribbon'],
  ]) {
    const skip = new El('skip');
    const body = new El('body');
    const els = { watch: new El('watch'), ribbon: new El('ribbon'), body };
    const doc = { body, activeElement: els[activeName] };
    const cleanup = run(auto, { current: skip }, () => (opener ? els[opener] : null), doc, El, QUIET);
    assert.equal(skip.focused.length, 1, '打开时焦点落到「跳过」');
    assert.equal(skip.focused[0] === QUIET, auto, '首登自动弹出时静默聚焦');
    cleanup();
    for (const [name, el] of Object.entries(els)) {
      assert.equal(el.focused.length, name === expectBack ? 1 : 0, `关了之后焦点回到 ${expectBack}，不是 ${name}`);
    }
  }

  // 锁住身后滚动，关了还原
  const lock = effects(src).find(({ body }) => body.includes('document.body.style.overflow'));
  assert.ok(lock);
  const bodyStyle = { overflow: 'auto' };
  const cleanupLock = new Function('document', lock.body)({ body: { style: bodyStyle } });
  assert.equal(bodyStyle.overflow, 'hidden');
  cleanupLock();
  assert.equal(bodyStyle.overflow, 'auto');

  // 状态从 lib/intro 来；静态导出按「没在播」预渲染
  assert.match(src, /useSyncExternalStore\(subscribeIntro, introState, closedOnServer\)/);
  assert.match(src, /const closedOnServer = \(\): IntroState => 'closed';/);
});

test('the intro lives in the lobby only, and the badge and notice wait for it on a first visit', () => {
  const exam = code(fs.readFileSync(EXAM, 'utf8'));
  assert.equal(exam.split('<IntroOverlay />').length - 1, 1, '只挂一处');
  const at = exam.indexOf('<IntroOverlay />');
  assert.ok(at > exam.indexOf("if (phase === 'setup' || phase === 'loading') {"), '挂在大厅');
  assert.ok(at < exam.search(/if \(phase === 'diagnostic'\) \{/), '答题页、Diagnostic 没有');

  // 工牌：首登落下那段整个包在 afterIntro 里——片头在播时一动不动，关了才照原逻辑落下
  const badge = code(fs.readFileSync(BADGE, 'utf8'));
  assert.ok(namedImports(badge, '@/lib/intro').has('afterIntro'));
  const drop = effects(badge).find(({ body }) => body.includes('localStorage.getItem(SEEN_KEY)'));
  assert.ok(drop);
  const runDrop = runnable(`return (${drop.body});`, ['afterIntro', 'localStorage', 'SEEN_KEY', 'setStage', 'after', 'DROP_MS', 'autoDropRef']);
  let queued = null;
  const stages = [];
  const store = new Map();
  const cancel = () => {};
  const ret = runDrop(
    (fn) => {
      queued = fn;
      return cancel;
    },
    { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) },
    'seen-key',
    (stage) => stages.push(stage),
    (_ms, fn) => fn(),
    1450,
    { current: false },
  );
  assert.equal(ret, cancel, 'effect 的清理就是 afterIntro 的取消');
  assert.deepEqual(stages, [], '片头在播：工牌不落下，也不先记「已亮相」');
  assert.equal(store.size, 0);
  queued();
  assert.deepEqual(stages, ['dropping', 'resting'], '片头关了：照原逻辑落下');
  assert.equal(store.get('seen-key'), '1');

  // 公告：同样整个包在 afterIntro 里
  const notice = code(fs.readFileSync(NOTICE, 'utf8'));
  assert.ok(namedImports(notice, '@/lib/intro').has('afterIntro'));
  const pop = effects(notice).find(({ body }) => body.includes('localStorage.getItem(NOTICE_KEY)'));
  assert.ok(pop);
  const runPop = runnable(pop.body, ['afterIntro', 'localStorage', 'NOTICE_KEY', 'NOTICE_ID', 'setOpen']);
  let pending = null;
  const opened = [];
  runPop(
    (fn) => {
      pending = fn;
      return () => {};
    },
    { getItem: () => null },
    'k',
    'id',
    (v) => opened.push(v),
  );
  assert.deepEqual(opened, [], '片头在播：公告不弹');
  pending();
  assert.deepEqual(opened, [true], '片头关了：照原逻辑弹出');
});

test('the deck hint row ends with a keyboard-operable watch-intro link that replays it', () => {
  const deck = code(fs.readFileSync('src/components/deck/CardDeck.tsx', 'utf8'));
  assert.ok(namedImports(deck, '@/lib/intro').has('playIntro'));
  // 在提示行（「← → 切换功能区 · Enter 展开 · 也可左右滑动」那一行）里，排在那句提示之后
  const keys = jsxOpening(deck, 'className={styles.keys}');
  assert.ok(keys, '找不到提示行');
  const inner = jsxChildren(deck, keys);
  assert.ok(inner.trimStart().startsWith('{t.deck.keys}'), '提示原文在前');
  const link = jsxOpening(inner, 'className={styles.introLink}');
  assert.ok(link && link.name === 'button', '是真按钮（键盘可达、Enter / 空格可按），不是 <a> 或 <span>');
  assert.ok(inner.indexOf('{t.deck.keys}') < link.start, '链接在提示之后');
  assert.equal(attrValue(link.attrs.get('type')), 'button');
  assert.equal(link.attrs.has('tabIndex'), false, '不许被挪出 Tab 序');
  assert.equal(jsxChildren(inner, link).trim(), '{t.intro.watch}');
  assert.equal(DICT.zh.intro.watch, '看片头');
  assert.equal(DICT.en.intro.watch, 'Watch intro');
  // 按语义判：点下去就是 playIntro，并把按钮自己交过去（关了焦点回来）
  const plays = [];
  const onClick = new Function('playIntro', `return (${attrValue(link.attrs.get('onClick'))});`)((from) => plays.push(from));
  const button = { name: 'watch' };
  onClick({ currentTarget: button });
  assert.deepEqual(plays, [button]);

  // 样式：看得出是链接（下划线），不折行
  const css = fs.readFileSync('src/components/deck/Deck.module.css', 'utf8');
  const rule = cascade(css, '.introLink');
  assert.equal(rule['text-decoration'], 'underline');
  assert.equal(rule['white-space'], 'nowrap');
});

// ---------------------------------------------------------------------------
// 入库素材

/** MP4 顶层的盒子：[{ type, start, size }] */
function mp4Boxes(buf, from = 0, to = buf.length) {
  const out = [];
  for (let at = from; at + 8 <= to; ) {
    let size = buf.readUInt32BE(at);
    const type = buf.toString('latin1', at + 4, at + 8);
    if (size === 1) size = Number(buf.readBigUInt64BE(at + 8));
    if (size === 0) size = to - at;
    out.push({ type, start: at, size });
    at += size;
  }
  return out;
}

test('the intro media ship as agreed: WebM as delivered, a silent MP4 fallback, a light poster', () => {
  const webm = fs.readFileSync('public/intro/intro.webm');
  const mp4 = fs.readFileSync('public/intro/intro.mp4');
  const poster = fs.readFileSync('public/intro/intro-poster.jpg');

  // WebM（EBML 头）不到 3MB；MP4 只是兜底，给个上限免得哪天换进一份没压过的
  assert.equal(webm.readUInt32BE(0), 0x1a45dfa3, 'intro.webm 不是 WebM / Matroska');
  assert.ok(webm.length < 3 * 1024 * 1024, `intro.webm ${webm.length} 字节`);
  assert.ok(mp4.length < 6 * 1024 * 1024, `intro.mp4 ${mp4.length} 字节`);

  // MP4：moov 在 mdat 前面（边下边播，不用等整份下完），且没有音轨（网页版静音是用户定的）
  const top = mp4Boxes(mp4);
  const types = top.map((box) => box.type);
  assert.ok(types.includes('moov') && types.includes('mdat'));
  assert.ok(types.indexOf('moov') < types.indexOf('mdat'), 'moov 要在 mdat 前面（faststart）');
  const moov = top.find((box) => box.type === 'moov');
  const tracks = mp4Boxes(mp4, moov.start + 8, moov.start + moov.size).filter((box) => box.type === 'trak');
  const handlers = tracks.map((trak) => {
    const region = mp4.subarray(trak.start, trak.start + trak.size);
    const at = region.indexOf('hdlr', 0, 'latin1');
    // hdlr：4 字节版本与标志、4 字节 pre_defined，之后才是 handler_type
    return region.toString('latin1', at + 12, at + 16);
  });
  assert.deepEqual(handlers, ['vide'], 'MP4 只该有一条视频轨，不能带音轨');

  // 海报：JPEG、≤ 80KB、16:9
  assert.equal(poster.readUInt16BE(0), 0xffd8, '海报不是 JPEG');
  assert.ok(poster.length <= 80 * 1024, `海报 ${poster.length} 字节，超过 80KB`);
  let at = 2;
  let size = null;
  while (at < poster.length) {
    const marker = poster.readUInt16BE(at);
    const length = poster.readUInt16BE(at + 2);
    if (marker >= 0xffc0 && marker <= 0xffc3) {
      size = { height: poster.readUInt16BE(at + 5), width: poster.readUInt16BE(at + 7) };
      break;
    }
    at += 2 + length;
  }
  assert.ok(size, '读不到海报尺寸');
  assert.equal(size.width * 9, size.height * 16, `海报 ${size.width}×${size.height} 不是 16:9`);
});
