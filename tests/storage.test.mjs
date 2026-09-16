import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import * as storage from '../src/lib/storage.ts';
// 键的**取值**怎么迁移写在 records.ts 里，这里连过来一起钉住
import { loadLogicFilter, saveLogicFilter } from '../src/lib/records.ts';

const layoutPath = 'src/app/layout.tsx';

function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

test('every browser-storage key is registered in one place, namespaced and versioned', () => {
  const keys = Object.entries(storage).filter(([name]) => name.endsWith('_KEY'));

  // 9 个键 + 一个待迁移的旧裸键
  assert.equal(keys.length, 10, `storage.ts 登记了 ${keys.length} 个键，预期 10 个`);

  const namespaced = keys.filter(([name]) => name !== 'LEGACY_THEME_KEY');
  assert.equal(namespaced.length, 9);
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

  // pet-command 是 CustomEvent 的事件名，从来没写进过存储，不许混进这张表
  assert.equal(
    Object.values(storage).some((value) => String(value).includes('pet-command')),
    false,
  );
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
    for (const hit of source.match(/'mcq-test:[^']+'/g) || []) {
      // 事件名不是存储键；首屏内联脚本没法 import，键名在那里只能是字面量
      if (hit.includes('pet-command')) continue;
      if (normalized.endsWith(layoutPath) && hit === `'${storage.THEME_KEY}'`) continue;
      strays.push(`${normalized}  ${hit}`);
    }
  }
  assert.deepEqual(strays, [], `这些键该从 lib/storage.ts 取：\n  ${strays.join('\n  ')}`);
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
  const exam = fs.readFileSync('src/components/exam/ExamApp.tsx', 'utf8');
  assert.match(exam, /localStorage\.setItem\(THEME_KEY, v\)/);
  assert.doesNotMatch(exam, /localStorage\.setItem\('theme'/);
  assert.match(exam, /THEME_KEY[\s\S]*?from '@\/lib\/storage'/);
});
