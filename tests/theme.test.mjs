import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import ts from 'typescript';

import { THEME_EVENT, THEMES, currentTheme, isTheme, setTheme, subscribeTheme } from '../src/lib/theme.ts';
import { THEME_KEY } from '../src/lib/storage.ts';
import { DICT } from '../src/lib/i18n.ts';
import * as segmented from '../src/lib/segmented.ts';
import { cascade, evalLength, px } from './helpers/css-rules.mjs';
import { attrValue, code, effects, fnBody, jsxChildren, jsxOpening, namedFn, namedImports } from './helpers/source.mjs';

// 配色的唯一状态来源（lib/theme）。用户 2026-09-30 要把配色切换也放一份到大厅，
// 答题页的「Color Scheme」下拉框保留——两处得是同一个状态：任一处切了，另一处立刻反映出来。这一组盯：
//   1. lib/theme 的读写与广播（假 window / document / 存储真跑），与首帧脚本认的取值一致
//   2. 写 <html data-theme> 与存储键的只有 lib/theme（首帧脚本除外）：答题页不再自己存一份
//   3. 大厅的配色圆钮（components/ThemeToggle）：位置、弹出语义、单选组键盘契约、Esc / 点外面关闭、
//      色块颜色与 globals.css 一致、窄屏给三颗圆钮让位

const LAYOUT = 'src/app/layout.tsx';
const EXAM = 'src/components/exam/ExamApp.tsx';

/** 把一段（可能带 TS 语法的）函数体包成能调用的函数，形参按 names 传 */
function runnable(body, names) {
  const js = ts.transpileModule(`function __run(${names.join(', ')}) {
${body}
}`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText;
  return new Function(`${js}
return __run;`)();
}

/** 装一套假的 window / document / localStorage；store 为 null 表示存储被禁用 */
function fakeDom(t, { theme = 'light', store = new Map() } = {}) {
  const listeners = new Map();
  globalThis.window = {
    addEventListener: (type, fn) => {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(fn);
    },
    removeEventListener: (type, fn) => listeners.get(type)?.delete(fn),
    dispatchEvent: (event) => {
      for (const fn of [...(listeners.get(event.type) ?? [])]) fn(event);
      return true;
    },
  };
  globalThis.document = { documentElement: { dataset: theme === undefined ? {} : { theme } } };
  globalThis.localStorage =
    store === null
      ? {
          setItem() {
            throw new Error('storage disabled');
          },
        }
      : { setItem: (k, v) => store.set(k, String(v)), getItem: (k) => store.get(k) ?? null };
  t.after(() => {
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.localStorage;
  });
  return { store, root: globalThis.document.documentElement.dataset };
}

test('the theme is read from <html data-theme>, written back there, remembered and broadcast', (t) => {
  assert.deepEqual([...THEMES], ['light', 'dark', 'sepia']);
  for (const junk of [null, undefined, '', 'Dark', 'neon', 1]) assert.equal(isTheme(junk), false);

  const { store, root } = fakeDom(t, { theme: 'sepia' });
  assert.equal(currentTheme(), 'sepia');
  let heard = 0;
  const off = subscribeTheme(() => heard++);
  setTheme('dark');
  assert.equal(root.theme, 'dark', 'CSS 读的属性立刻变');
  assert.equal(currentTheme(), 'dark');
  assert.equal(store.get(THEME_KEY), 'dark', '落盘：下次首帧脚本就按它套');
  assert.equal(heard, 1, '订阅方（答题页下拉框、大厅圆钮）收到广播');
  setTheme('light');
  assert.equal(heard, 2);
  off();
  setTheme('sepia');
  assert.equal(heard, 2, '退订之后不再收到');
  assert.notEqual(THEME_EVENT, THEME_KEY, '事件名不是存储键');

  // 认不出的属性值按浅色；存储被禁用也照样切（只是记不住）
  root.theme = 'neon';
  assert.equal(currentTheme(), 'light');
  delete root.theme;
  assert.equal(currentTheme(), 'light');
  globalThis.localStorage = {
    setItem() {
      throw new Error('storage disabled');
    },
  };
  setTheme('dark');
  assert.equal(currentTheme(), 'dark');
});

test('the first-paint script accepts exactly the themes lib/theme knows', () => {
  const source = fs.readFileSync(LAYOUT, 'utf8');
  const body = source.match(/const THEME_INIT = `([\s\S]*?)`;/)?.[1];
  assert.ok(body, '找不到 THEME_INIT');
  for (const stored of [...THEMES, 'neon', '', null]) {
    const documentStub = { documentElement: { dataset: {} } };
    const storage = {
      getItem: (k) => (k === THEME_KEY ? stored : null),
      setItem() {},
      removeItem() {},
    };
    new Function('localStorage', 'document', body)(storage, documentStub);
    assert.equal(documentStub.documentElement.dataset.theme, isTheme(stored) ? stored : 'light', `存值 ${stored}`);
  }
});

function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

test('only lib/theme writes the theme: the exam-page select reads and writes through it', () => {
  // 全仓只有 lib/theme 往 <html data-theme> 与配色存储键里写（首帧内联脚本那份字面量除外）
  const writers = [];
  for (const file of sourceFiles('src')) {
    const where = file.split(path.sep).join('/');
    if (where.endsWith(LAYOUT)) continue;
    const src = code(fs.readFileSync(file, 'utf8'));
    if (/dataset\.theme =|setAttribute\(['"]data-theme['"]|setItem\(THEME_KEY/.test(src)) writers.push(where);
  }
  assert.deepEqual(writers, ['src/lib/theme.ts']);

  // 答题页：下拉框的值来自 useTheme()，改动交给 setTheme，自己不再存一份状态
  const exam = code(fs.readFileSync(EXAM, 'utf8'));
  assert.ok(namedImports(exam, '@/lib/useTheme').has('useTheme'));
  const theme = namedImports(exam, '@/lib/theme');
  assert.ok(theme.has('setTheme') && theme.has('isTheme'));
  assert.match(exam, /const scheme = useTheme\(\);/);
  assert.doesNotMatch(exam, /setScheme\b/, '答题页不该再有自己那份配色状态');
  assert.ok(!namedImports(exam, '@/lib/storage').has('THEME_KEY'), '答题页不再自己碰配色存储键');
  const hookAt = exam.indexOf('const scheme = useTheme();');
  assert.ok(hookAt > 0 && hookAt < exam.indexOf("if (phase === 'setup' || phase === 'loading') {"), '钩子要在所有提前 return 之前');
  const select = jsxOpening(exam, 'className={styles.schemeSelect}');
  assert.ok(select && select.name === 'select', '找不到答题页的配色下拉框');
  assert.equal(attrValue(select.attrs.get('value')), 'scheme');
  const picked = [];
  new Function('changeScheme', `return (${attrValue(select.attrs.get('onChange'))});`)((v) => picked.push(v))({ target: { value: 'sepia' } });
  assert.deepEqual(picked, ['sepia'], '下拉框的改动交给 changeScheme');
  // changeScheme 按语义判：认得的值交给 setTheme，认不出的不理
  const change = namedFn(exam, 'changeScheme');
  const calls = [];
  const run = new Function('v', 'isTheme', 'setTheme', fnBody(change));
  for (const v of ['dark', 'sepia', 'light', 'neon', '']) run(v, isTheme, (x) => calls.push(x));
  assert.deepEqual(calls, ['dark', 'sepia', 'light']);
  // 下拉框的三项与 lib/theme 的三套一一对应
  const options = [...exam.matchAll(/<option value="(\w+)">/g)].map((m) => m[1]);
  assert.deepEqual(options, [...THEMES]);
});

// ---------------------------------------------------------------------------
// 大厅的配色圆钮（components/ThemeToggle）

const TOGGLE = 'src/components/ThemeToggle.tsx';
const TOGGLE_CSS = 'src/components/ThemeToggle.module.css';

test('the lobby gets a round colour-scheme button left of the effects one, in the lobby only', () => {
  const src = code(fs.readFileSync(TOGGLE, 'utf8'));
  const css = fs.readFileSync(TOGGLE_CSS, 'utf8');
  const fxCss = fs.readFileSync('src/components/FxToggle.module.css', 'utf8');
  const langCss = fs.readFileSync('src/components/LangToggle.module.css', 'utf8');
  const exam = code(fs.readFileSync(EXAM, 'utf8'));

  // 同款圆钮：用中/英钮的 .toggle（圆形、悬停 / 按下、焦点环、减动效都在那里）
  const button = jsxOpening(src, 'ref={buttonRef}');
  assert.equal(button.name, 'button');
  assert.equal(attrValue(button.attrs.get('type')), 'button');
  assert.match(attrValue(button.attrs.get('className')), /^`\$\{langStyles\.toggle\} \$\{styles\.\w+\}`$/);
  assert.match(src, /import langStyles from '\.\/LangToggle\.module\.css';/);
  // 弹出语义：aria-haspopup + aria-expanded 跟着开合，aria-controls 只在开着时指向弹层
  assert.equal(attrValue(button.attrs.get('aria-haspopup')), 'dialog');
  assert.equal(attrValue(button.attrs.get('aria-expanded')), 'open');
  assert.equal(attrValue(button.attrs.get('aria-controls')), 'open ? popoverId : undefined');
  assert.equal(attrValue(button.attrs.get('aria-label')), 't.themeToggle.aria');
  // 图标是内联 SVG，读屏不念
  assert.match(jsxChildren(src, button), /<svg [^>]*aria-hidden="true"/);

  // 位置：光效钮再往左一格——右偏移 = 光效钮的右偏移 + 钮宽 + 同样那道缝（中/英 → 光效之间的缝）
  const lang = cascade(langCss, '.toggle');
  const fxRight = px(cascade(fxCss, '.fx.fx').right);
  const gap = fxRight - px(lang.width) - px(lang.right);
  const anchor = cascade(css, '.anchor');
  assert.equal(anchor.position, 'absolute');
  assert.equal(px(anchor.right), fxRight + px(lang.width) + gap, '和光效钮之间的缝得与光效钮—中/英钮之间的一样');
  assert.equal(px(anchor.width), px(lang.width));
  assert.equal(px(anchor.height), px(lang.height));
  // 弹层右缘对齐舞台右缘（抵掉 .anchor 的偏移）：窄屏上往左展开、不出界
  assert.equal(px(cascade(css, '.popover').right), -px(anchor.right));

  // 只挂在大厅：树序排在光效钮前面（Tab 先后与视觉从左到右一致），三颗之间只隔注释
  assert.equal(exam.split('<ThemeToggle />').length - 1, 1, '只挂一处');
  assert.match(exam, /<ThemeToggle \/>\s*<FxToggle \/>\s*<LangToggle \/>/);
  const at = exam.indexOf('<ThemeToggle />');
  assert.ok(at > exam.indexOf("if (phase === 'setup' || phase === 'loading') {"));
  assert.ok(at < exam.search(/if \(phase === 'diagnostic'\) \{/), '答题页与 Diagnostic 没有（那里保留下拉框）');

  // 中英文案
  for (const lang of ['zh', 'en']) {
    const copy = DICT[lang].themeToggle;
    for (const key of ['aria', 'title']) assert.ok(copy[key]?.trim(), `${lang} themeToggle.${key} 空了`);
    assert.deepEqual(Object.keys(copy.options), [...THEMES]);
  }
  assert.equal(DICT.zh.themeToggle.aria, '配色');
  assert.equal(DICT.en.themeToggle.aria, 'Color scheme');
  assert.deepEqual(Object.values(DICT.zh.themeToggle.options), ['浅色', '深色', '护眼']);
  assert.deepEqual(Object.values(DICT.en.themeToggle.options), ['Light', 'Dark', 'Sepia']);
});

test('the popover is a radio group with the setup-panel keyboard contract, and selection is the theme itself', () => {
  const src = code(fs.readFileSync(TOGGLE, 'utf8'));
  // 状态只从 lib/theme 来：读 useTheme、写 setTheme，自己不存配色
  assert.ok(namedImports(src, '@/lib/useTheme').has('useTheme'));
  assert.ok(namedImports(src, '@/lib/theme').has('setTheme'));
  assert.doesNotMatch(src, /localStorage|dataset\.theme/);
  // 键盘契约与配置面板的 SegmentedGroup 同源：按键落点、Tab 位都用 lib/segmented 的纯函数
  const seg = namedImports(src, '@/lib/segmented');
  assert.ok(seg.has('nextSegIndex') && seg.has('tabStopIndex'));

  const popover = jsxOpening(src, 'id={popoverId}');
  assert.equal(attrValue(popover.attrs.get('role')), 'dialog');
  assert.equal(popover.attrs.has('aria-modal'), false, '非模态：不困焦点、不挡身后');
  assert.equal(attrValue(popover.attrs.get('aria-labelledby')), 'titleId');
  const group = jsxOpening(src, 'role="radiogroup"');
  assert.equal(attrValue(group.attrs.get('aria-labelledby')), 'titleId');
  const radio = jsxOpening(src, 'role="radio"');
  assert.equal(attrValue(radio.attrs.get('aria-checked')), 'i === checked');
  assert.equal(attrValue(radio.attrs.get('tabIndex')), 'i === tabStop ? 0 : -1');
  assert.equal(attrValue(radio.attrs.get('type')), 'button');

  // 按语义判：方向键 / Home / End 把焦点连同选择挪过去（选择跟随焦点），修饰键组合不拦
  const onItemKey = namedFn(src, 'onItemKey');
  const run = runnable(fnBody(onItemKey), ['e', 'index', 'nextSegIndex', 'NONE_DISABLED', 'itemRefs', 'checked', 'setTheme', 'THEMES']);
  const { nextSegIndex } = segmented;
  for (const [key, from, expect] of [
    ['ArrowRight', 0, 1],
    ['ArrowDown', 1, 2],
    ['ArrowRight', 2, 0],
    ['ArrowLeft', 0, 2],
    ['ArrowUp', 2, 1],
    ['Home', 2, 0],
    ['End', 0, 2],
    ['Tab', 0, null],
    ['a', 0, null],
  ]) {
    const focused = [];
    const set = [];
    let prevented = false;
    const items = THEMES.map((name) => ({ focus: () => focused.push(name) }));
    run(
      { key, altKey: false, ctrlKey: false, metaKey: false, preventDefault: () => (prevented = true) },
      from,
      nextSegIndex,
      THEMES.map(() => false),
      { current: items },
      from,
      (name) => set.push(name),
      THEMES,
    );
    if (expect === null) {
      assert.deepEqual([focused, set, prevented], [[], [], false], `${key} 不归单选组管`);
    } else {
      assert.deepEqual(focused, [THEMES[expect]], `${key} 从 ${THEMES[from]} 该聚焦到 ${THEMES[expect]}`);
      assert.deepEqual(set, [THEMES[expect]], `${key}：选择跟随焦点，即时切配色`);
      assert.equal(prevented, true, `${key} 不许顺带滚页面`);
    }
  }
  const alt = [];
  run({ key: 'ArrowRight', altKey: true, preventDefault() {} }, 0, nextSegIndex, [false, false, false], { current: [] }, 0, (n) => alt.push(n), THEMES);
  assert.deepEqual(alt, [], 'Alt+→ 是浏览器的前进，不拦');

  // 点一块就切到那一套
  const click = new Function('setTheme', 'name', `return (${attrValue(radio.attrs.get('onClick'))});`);
  const clicked = [];
  click((n) => clicked.push(n), 'sepia')();
  assert.deepEqual(clicked, ['sepia']);
});

test('Esc and a click outside close the popover and hand focus back to the button; Esc stops there', () => {
  const src = code(fs.readFileSync(TOGGLE, 'utf8'));
  // Esc：关弹层、焦点回圆钮，并且就地拦下——配置面板那层的 Esc 是「退回选区」，不能顺带触发
  const onKeyDown = namedFn(src, 'onKeyDown');
  const runKey = runnable(fnBody(onKeyDown), ['e', 'open', 'close']);
  const log = [];
  const event = (key) => ({ key, preventDefault: () => log.push('prevent'), stopPropagation: () => log.push('stop') });
  runKey(event('Escape'), true, (refocus) => log.push(`close:${refocus}`));
  assert.deepEqual(log, ['prevent', 'stop', 'close:true']);
  log.length = 0;
  runKey(event('Escape'), false, (refocus) => log.push(`close:${refocus}`));
  runKey(event('Enter'), true, (refocus) => log.push(`close:${refocus}`));
  assert.deepEqual(log, [], '关着时的 Esc、别的键都放行');

  const close = namedFn(src, 'close');
  const runClose = runnable(fnBody(close), ['refocus', 'setOpen', 'buttonRef']);
  const calls = [];
  const buttonRef = { current: { focus: () => calls.push('focus') } };
  runClose(true, (v) => calls.push(`open:${v}`), buttonRef);
  runClose(false, (v) => calls.push(`open:${v}`), buttonRef);
  assert.deepEqual(calls, ['open:false', 'focus', 'open:false']);

  // 点弹层外：pointerdown 在这一簇之外就收起；焦点若因此掉到 <body>，交回圆钮（点到别的按钮上则归那颗按钮）
  const outside = effects(src).find(({ body }) => body.includes("'pointerdown'"));
  assert.ok(outside);
  assert.deepEqual(outside.deps, ['open']);
  const runOutside = runnable(outside.body, ['open', 'rootRef', 'buttonRef', 'setOpen', 'document', 'window']);
  for (const [label, target, activeAfter, expectFocus] of [
    ['点在空白处', 'blank', 'body', true],
    ['点到别的按钮', 'other', 'other', false],
    ['点在弹层里', 'inside', 'inside', false],
  ]) {
    const listeners = new Map();
    const timers = [];
    const states = [];
    const focused = [];
    const body = { isConnected: true };
    const nodes = { blank: body, other: { isConnected: true }, inside: { isConnected: true } };
    const doc = {
      body,
      activeElement: null,
      addEventListener: (type, fn) => listeners.set(type, fn),
      removeEventListener: (type) => listeners.delete(type),
    };
    const win = {
      setTimeout: (fn) => (timers.push(fn), timers.length),
      clearTimeout: (id) => (timers[id - 1] = () => {}),
    };
    const root = { contains: (node) => node === nodes.inside };
    const cleanup = runOutside(true, { current: root }, { current: { focus: () => focused.push('button') } }, (v) => states.push(v), doc, win);
    listeners.get('pointerdown')({ target: nodes[target] });
    // 收起一提交 effect 就清理（deps 是 open）：回焦的计时器得挺过这次清理
    cleanup();
    doc.activeElement = nodes[activeAfter];
    for (const fn of timers) fn();
    assert.deepEqual(states, target === 'inside' ? [] : [false], `${label}：${target === 'inside' ? '不关' : '收起'}`);
    assert.deepEqual(focused, expectFocus ? ['button'] : [], `${label}：焦点${expectFocus ? '交回圆钮' : '不抢'}`);
    assert.equal(listeners.size, 0, '清理时摘掉监听');
  }
  // 关着时不挂监听
  const idle = new Map();
  runOutside(false, {}, {}, () => {}, { addEventListener: (t, fn) => idle.set(t, fn) }, {});
  assert.equal(idle.size, 0);
});

test('each swatch paints its own theme with the exact colours of globals.css', () => {
  const css = fs.readFileSync(TOGGLE_CSS, 'utf8');
  // 顶上的 @import 语句没有花括号，拍平规则的小工具会把它连同下一条规则的选择器当成一个 @ 块：先摘掉
  const globals = fs.readFileSync('src/app/globals.css', 'utf8').replace(/@import[^;]*;/g, '');
  const block = (selector) => cascade(globals, selector);
  const vars = { light: block(':root'), dark: block(':root[data-theme="dark"]'), sepia: block(':root[data-theme="sepia"]') };
  const cls = { light: '.swatchLight', dark: '.swatchDark', sepia: '.swatchSepia' };
  for (const name of THEMES) {
    const swatch = cascade(css, cls[name]);
    for (const [sw, token] of [
      ['--sw-bg', '--bg'],
      ['--sw-surface', '--surface'],
      ['--sw-text', '--text'],
      ['--sw-accent', '--accent'],
      ['--sw-border', '--border'],
    ]) {
      assert.ok(swatch[sw] && vars[name][token], `${name}：${sw} / ${token} 有一边没取到`);
      assert.equal(swatch[sw].toLowerCase(), vars[name][token].toLowerCase(), `${name} 色块的 ${sw} 与 globals.css 的 ${token} 对不上`);
    }
  }
  const src = code(fs.readFileSync(TOGGLE, 'utf8'));
  assert.match(src, /light: styles\.swatchLight, dark: styles\.swatchDark, sepia: styles\.swatchSepia/);
});

test('narrow screens make room for three round buttons, not two', () => {
  const examCss = fs.readFileSync('src/components/exam/Exam.module.css', 'utf8');
  const langCss = fs.readFileSync('src/components/LangToggle.module.css', 'utf8');
  const css = fs.readFileSync(TOGGLE_CSS, 'utf8');
  const lang = cascade(langCss, '.toggle');
  // 配置页的页签：右浮动的占位装得下整簇（最左那颗的右偏移 + 钮宽）
  const reserve = cascade(examCss, '.zoneTabs::before', { media: '(max-width: 639px)' });
  assert.equal(reserve.float, 'right');
  assert.ok(px(reserve.width) >= px(cascade(css, '.anchor').right) + px(lang.width), '让出来的宽度装不下三颗圆钮');

  // 卡组的标题与进度面板的「返回 + 标题」：窄屏（视口 < 440，三颗圆钮会压上去的那一档）整行挪到圆钮底边之下
  const clusterHeight = px(lang.height);
  const deckHead = cascade(fs.readFileSync('src/components/deck/Deck.module.css', 'utf8'), '.head', { media: '(max-width: 439px)' });
  assert.ok(px(deckHead['padding-top']) >= clusterHeight, '卡组标题没让到圆钮底下');
  const progressCss = fs.readFileSync('src/components/progress/Progress.module.css', 'utf8');
  const panelTop = evalLength(cascade(progressCss, '.panel', { media: '(max-width: 640px)' })['padding-top']);
  const headTop = px(cascade(progressCss, '.head', { media: '(max-width: 439px)' })['padding-top']);
  assert.ok(panelTop + headTop >= clusterHeight, `进度面板的返回钮与标题离面板顶边 ${panelTop + headTop}px，没让到圆钮底下`);
});

test('the zone tabs keep clear of the round-button cluster at wide widths too (≥ 640)', () => {
  // 审查 2026-10-01：≥ 640 时页签是一排 flex，原先右端没给圆钮簇留位，英文最后一个页签伸到配色钮底下（640 宽压 40px）。
  // 几何：圆钮簇贴着舞台右缘、宽 W（最左那颗的右偏移 + 钮宽）、高 H；页签这一排的内容右缘 = 舞台宽 − 右内边距。
  // 只要右内边距 ≥ W，不论舞台多宽（608–640px）、折几行、中英文，页签都在圆钮簇左边
  const examCss = fs.readFileSync('src/components/exam/Exam.module.css', 'utf8');
  const lang = cascade(fs.readFileSync('src/components/LangToggle.module.css', 'utf8'), '.toggle');
  const W = px(cascade(fs.readFileSync(TOGGLE_CSS, 'utf8'), '.anchor').right) + px(lang.width);
  assert.equal(W, 136, '圆钮簇的宽度变了，核一下窄屏与宽屏两处让位');

  const base = cascade(examCss, '.zoneTabs');
  assert.equal(base.display, 'flex', '宽屏是一排 flex：右内边距对每一行都生效（不像浮动只管第一行）');
  assert.equal(base['flex-wrap'], 'wrap');
  assert.equal(base['padding-right'], undefined, '顶格规则不该另写右内边距（会和窄屏的浮动占位叠加）');
  const wide = cascade(examCss, '.zoneTabs', { media: '(min-width: 640px)' });
  const pr = px(wide['padding-right']);
  for (const stage of [608, 620, 640]) {
    const contentRight = stage - pr;
    assert.ok(contentRight <= stage - W, `舞台 ${stage}px：页签右缘 ${contentRight} 伸进了圆钮簇（左缘 ${stage - W}）`);
  }
  // 窄屏那一档不吃这条右内边距（那里靠浮动占位只让第一行）
  assert.equal(cascade(examCss, '.zoneTabs', { media: '(max-width: 639px)' })['padding-right'], undefined);
});
