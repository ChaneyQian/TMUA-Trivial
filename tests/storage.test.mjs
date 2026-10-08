import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import * as storage from '../src/lib/storage.ts';
// 键的**取值**怎么迁移写在 records.ts 里，这里连过来一起钉住
import { loadLogicFilter, saveLogicFilter } from '../src/lib/records.ts';

const layoutPath = 'src/app/layout.tsx';

/**
 * 源码里的存储键字面量：命名空间 + 版本号，'mcq-test:名字:vN'（体例见第一条测试）。
 * 版本号就是存储键的记号——事件名（'mcq-test:fx-change'、'mcq-test:pet-command'、
 * 'mcq-test:overlay-change'……）不带版本号，自然不算，不必逐个放行；
 * 反过来，带了版本号的哪怕长得像事件名，也照样当键
 */
const STORAGE_KEY_LITERAL = /(['"`])mcq-test:[a-z0-9-]+:v\d+\1/g;

function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

test('every browser-storage key is registered in one place, namespaced and versioned', () => {
  const keys = Object.entries(storage).filter(([name]) => name.endsWith('_KEY'));

  // 12 个键 + 一个待迁移的旧裸键（2026-10 加了光效开关 FX_KEY，2026-09-30 加了片头已看 INTRO_SEEN_KEY，
  // 2026-10-08 加了 05 密卷的解锁印记 SEALED_UNLOCK_KEY）
  assert.equal(keys.length, 13, `storage.ts 登记了 ${keys.length} 个键，预期 13 个`);

  const namespaced = keys.filter(([name]) => name !== 'LEGACY_THEME_KEY');
  assert.equal(namespaced.length, 12);
  assert.equal(storage.FX_KEY, 'mcq-test:fx:v1');
  assert.equal(storage.INTRO_SEEN_KEY, 'mcq-test:intro-seen:v1');
  assert.equal(storage.SEALED_UNLOCK_KEY, 'mcq-test:sealed-unlock:v1');
  for (const [name, value] of namespaced) {
    // GitHub Pages 上同 origin 住着这个账号的其他项目，localStorage 是共享的：
    // 裸键随时会和邻居撞上
    assert.match(value, /^mcq-test:[a-z-]+:v\d+$/, `${name} 的取值不合命名空间体例：${value}`);
  }
  assert.equal(
    new Set(namespaced.map(([, value]) => value)).size,
    namespaced.length,
    '两个常量指向了同一个键',
  );
  assert.equal(storage.LEGACY_THEME_KEY, 'theme');
  assert.equal(storage.THEME_KEY, 'mcq-test:theme:v1');

  // 反查：登记处里凡以 mcq-test: 开头的取值都带版本号——事件名（不带版本号）混不进这张表
  for (const [name, value] of Object.entries(storage)) {
    if (typeof value !== 'string' || !value.startsWith('mcq-test:')) continue;
    assert.match(value, /^mcq-test:[a-z0-9-]+:v\d+$/, `${name} 像是个事件名，不该登记在存储键里：${value}`);
  }
});

/**
 * 逻辑推理开关 2026-09-16 从两态改成三档（全部 / 仅逻辑题 / 排除），
 * 键刻意没动：换键等于把所有存量用户的选择静默清空，而上面那条键清单
 * 也会跟着从 10 变 11。迁移因此只发生在**取值**上。
 */
test('the logic-reasoning key survives the two-state to three-way change, old values and all', (t) => {
  const store = new Map();
  globalThis.window = {};
  globalThis.localStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  };
  t.after(() => {
    delete globalThis.localStorage;
    delete globalThis.window;
  });

  assert.equal(storage.LOGIC_REASONING_KEY, 'mcq-test:logic-reasoning:v1', '键不许改名或升版');

  // 两态时代写下的值：'1' 是勾着（含逻辑题）、'0' 是取消勾选（不含）
  for (const [stored, expected] of [
    ['1', 'all'],
    ['0', 'exclude'],
    ['all', 'all'],
    ['only', 'only'],
    ['exclude', 'exclude'],
    ['maybe', 'all'],
    ['', 'all'],
  ]) {
    store.set(storage.LOGIC_REASONING_KEY, stored);
    assert.equal(loadLogicFilter(), expected, `存着 ${JSON.stringify(stored)} 时读出的档位不对`);
  }

  store.delete(storage.LOGIC_REASONING_KEY);
  assert.equal(loadLogicFilter(), 'all', '没存过就是「全部」');

  // 新写入一律是三档的字面量，不再回写 '1' / '0'
  saveLogicFilter('only');
  assert.equal(store.get(storage.LOGIC_REASONING_KEY), 'only');
});

test('no component keeps a storage key literal of its own', () => {
  const strays = [];
  for (const file of sourceFiles('src')) {
    const normalized = file.split(path.sep).join('/');
    if (normalized.endsWith('src/lib/storage.ts')) continue;
    const source = fs.readFileSync(file, 'utf8');
    for (const hit of source.match(STORAGE_KEY_LITERAL) || []) {
      const key = hit.slice(1, -1);
      // 首屏内联脚本没法 import，键名在那里只能是字面量
      if (normalized.endsWith(layoutPath) && (key === storage.THEME_KEY || key === storage.FX_KEY)) continue;
      strays.push(`${normalized}  ${hit}`);
    }
  }
  assert.deepEqual(strays, [], `这些键该从 lib/storage.ts 取：\n  ${strays.join('\n  ')}`);
});

test('only versioned literals count as storage keys: event names pass, a versioned look-alike does not', () => {
  const keysIn = (text) => text.match(STORAGE_KEY_LITERAL) ?? [];
  // 事件名不带版本号：不是键
  assert.deepEqual(keysIn(`window.dispatchEvent(new Event('mcq-test:fx-change'))`), []);
  assert.deepEqual(keysIn(`new CustomEvent("mcq-test:pet-command", { detail })`), []);
  assert.deepEqual(keysIn('export const OVERLAY_EVENT = `mcq-test:overlay-change`;'), []);
  // 反例：带版本号的「伪事件名」照样当键——版本号就是存储键的记号
  assert.deepEqual(keysIn(`window.dispatchEvent(new Event('mcq-test:overlay-change:v2'))`), ["'mcq-test:overlay-change:v2'"]);
  // 真键：单引号、双引号、模板字符串都认
  assert.deepEqual(keysIn(`localStorage.getItem('mcq-test:zone:v1')`), ["'mcq-test:zone:v1'"]);
  assert.deepEqual(keysIn(`localStorage.setItem("mcq-test:records:v2", x)`), ['"mcq-test:records:v2"']);
  assert.deepEqual(keysIn('const k = `mcq-test:badge-seen:v1`;'), ['`mcq-test:badge-seen:v1`']);
  // 引号不成对不算（免得把两段字面量拼成一个）
  assert.deepEqual(keysIn(`'mcq-test:zone:v1"`), []);
});

/** 把首屏内联脚本原样跑起来，喂一份假的 localStorage / document */
function runThemeInit(store) {
  const source = fs.readFileSync(layoutPath, 'utf8');
  const body = source.match(/const THEME_INIT = `([\s\S]*?)`;/)?.[1];
  assert.ok(body, '找不到 THEME_INIT');
  const documentStub = { documentElement: { dataset: {} } };
  const localStorageStub = store.throws
    ? {
        getItem() {
          throw new Error('storage disabled');
        },
        setItem() {
          throw new Error('storage disabled');
        },
        removeItem() {
          throw new Error('storage disabled');
        },
      }
    : {
        getItem: (k) => (k in store ? store[k] : null),
        setItem: (k, v) => {
          store[k] = String(v);
        },
        removeItem: (k) => {
          delete store[k];
        },
      };
  new Function('localStorage', 'document', body)(localStorageStub, documentStub);
  return documentStub.documentElement.dataset.theme;
}

test('the first-paint script migrates the old bare theme key exactly once', () => {
  const { THEME_KEY, LEGACY_THEME_KEY } = storage;

  // 什么都没存过：走默认浅色，不写任何东西
  const fresh = {};
  assert.equal(runThemeInit(fresh), 'light');
  assert.deepEqual(fresh, {});

  // 老用户：旧裸键搬进命名空间，旧键当场删掉，配色照常生效
  const legacy = { [LEGACY_THEME_KEY]: 'dark' };
  assert.equal(runThemeInit(legacy), 'dark');
  assert.deepEqual(legacy, { [THEME_KEY]: 'dark' }, '旧键必须搬走并删掉');
  // 第二次进站已经没有旧键了，行为不变
  assert.equal(runThemeInit(legacy), 'dark');
  assert.deepEqual(legacy, { [THEME_KEY]: 'dark' });

  // 新键已有值时以新键为准，旧键只负责被清掉（同 origin 的垃圾不留着）
  const both = { [THEME_KEY]: 'sepia', [LEGACY_THEME_KEY]: 'dark' };
  assert.equal(runThemeInit(both), 'sepia');
  assert.deepEqual(both, { [THEME_KEY]: 'sepia' });

  // 撞上邻居写的乱值（裸键的老问题）不该让整站变成没有配色的白板
  assert.equal(runThemeInit({ [THEME_KEY]: 'neon' }), 'light');

  // 隐私模式 / 配额满：读写全炸，最后那句赋值仍要执行
  assert.equal(runThemeInit({ throws: true }), 'light');
});

test('the theme key is written through the registry, never as a literal', () => {
  // 配色的读写收拢在 lib/theme（答题页下拉框与大厅配色圆钮共用，见 tests/theme.test）
  const theme = fs.readFileSync('src/lib/theme.ts', 'utf8');
  assert.match(theme, /localStorage\.setItem\(THEME_KEY, next\)/);
  assert.match(theme, /import \{ THEME_KEY \} from '\.\/storage\.ts';/);
  for (const file of ['src/lib/theme.ts', 'src/components/exam/ExamApp.tsx']) {
    assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /localStorage\.setItem\('theme'/);
  }
});
