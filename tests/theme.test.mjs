import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import { THEME_EVENT, THEMES, currentTheme, isTheme, setTheme, subscribeTheme } from '../src/lib/theme.ts';
import { THEME_KEY } from '../src/lib/storage.ts';
import { attrValue, code, fnBody, jsxOpening, namedFn, namedImports } from './helpers/source.mjs';

// 配色的唯一状态来源（lib/theme）。用户 2026-09-30 要把配色切换也放一份到大厅，
// 答题页的「Color Scheme」下拉框保留——两处得是同一个状态：任一处切了，另一处立刻反映出来。这一组盯：
//   1. lib/theme 的读写与广播（假 window / document / 存储真跑），与首帧脚本认的取值一致
//   2. 写 <html data-theme> 与存储键的只有 lib/theme（首帧脚本除外）：答题页不再自己存一份

const LAYOUT = 'src/app/layout.tsx';
const EXAM = 'src/components/exam/ExamApp.tsx';

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
