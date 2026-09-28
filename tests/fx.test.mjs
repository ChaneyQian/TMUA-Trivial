import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { FX_EVENT, inferFx, isFx, resolveFx } from '../src/lib/fx.ts';
import { FX_KEY } from '../src/lib/storage.ts';

// 光效开关（用户 2026-10）。这一组盯：
//   1. 偏好的读法与默认推断（纯函数）
//   2. 首帧脚本：键名与 storage.ts 一致、判据与 inferFx 逐条一致、推断结果不写回
// 开关的消费方（环境光不渲染、倾斜 / 聚光收手、装饰动画停掉、按钮）在后面几条里

const LAYOUT = 'src/app/layout.tsx';

test('a stored choice wins; otherwise the device decides, and only a weak or data-saving one defaults to off', () => {
  assert.equal(isFx('on'), true);
  assert.equal(isFx('off'), true);
  for (const junk of [null, undefined, '', 'ON', '1', 'true', 0]) assert.equal(isFx(junk), false);

  // 普通设备：开
  assert.equal(inferFx({ hardwareConcurrency: 8, deviceMemory: 8 }), 'on');
  assert.equal(inferFx({}), 'on', '什么都拿不到（Safari / Firefox）就按开');
  // 省流量、≤ 2 核、≤ 2GB 内存：关
  assert.equal(inferFx({ connection: { saveData: true }, hardwareConcurrency: 16, deviceMemory: 8 }), 'off');
  assert.equal(inferFx({ hardwareConcurrency: 2, deviceMemory: 8 }), 'off');
  assert.equal(inferFx({ hardwareConcurrency: 1 }), 'off');
  assert.equal(inferFx({ hardwareConcurrency: 4, deviceMemory: 2 }), 'off');
  assert.equal(inferFx({ deviceMemory: 0.5 }), 'off');
  // 边界：3 核、4GB 算够；省流量没开（false）不算；0 / 缺失是「不知道」，不当低配
  assert.equal(inferFx({ hardwareConcurrency: 3, deviceMemory: 4 }), 'on');
  assert.equal(inferFx({ connection: { saveData: false } }), 'on');
  assert.equal(inferFx({ connection: null }), 'on');
  assert.equal(inferFx({ hardwareConcurrency: 0, deviceMemory: 0 }), 'on');

  // 用户手动切过的存值优先于推断，认不出的存值当没有
  const weak = { hardwareConcurrency: 2 };
  assert.equal(resolveFx('on', weak), 'on', '低配设备上用户自己打开了，就开');
  assert.equal(resolveFx('off', { hardwareConcurrency: 16 }), 'off');
  assert.equal(resolveFx(null, weak), 'off');
  assert.equal(resolveFx('neon', { hardwareConcurrency: 16 }), 'on');

  // 事件名不是存储键
  assert.notEqual(FX_EVENT, FX_KEY);
});

/** 把首帧脚本原样跑起来：假的 localStorage / document / navigator */
function runFxInit(store, device = {}) {
  const source = fs.readFileSync(LAYOUT, 'utf8');
  const body = source.match(/const FX_INIT = `([\s\S]*?)`;/)?.[1];
  assert.ok(body, '找不到 FX_INIT');
  const documentStub = { documentElement: { dataset: {} } };
  const writes = [];
  const localStorageStub = store.throws
    ? {
        getItem() {
          throw new Error('storage disabled');
        },
        setItem() {
          throw new Error('storage disabled');
        },
      }
    : {
        getItem: (k) => (k in store ? store[k] : null),
        setItem: (k, v) => writes.push([k, v]),
        removeItem: (k) => writes.push([k, null]),
      };
  new Function('localStorage', 'document', 'navigator', body)(localStorageStub, documentStub, device);
  return { fx: documentStub.documentElement.dataset.fx, writes };
}

test('the first-paint script agrees with resolveFx case by case and never writes the guess back', () => {
  const source = fs.readFileSync(LAYOUT, 'utf8');
  // 键名是字面量（内联脚本没法 import），与登记处一致
  assert.match(source, new RegExp(`const FX_INIT = \`[^\`]*var K='${FX_KEY}'`));
  // 挂进 <head>，和配色脚本一样在首帧前跑
  assert.match(source, /<script dangerouslySetInnerHTML=\{\{ __html: FX_INIT \}\} \/>/);
  assert.ok(source.indexOf('__html: FX_INIT') < source.indexOf('<body>'), '得在 <body> 之前');

  const devices = [
    {},
    { hardwareConcurrency: 8, deviceMemory: 8 },
    { hardwareConcurrency: 2, deviceMemory: 8 },
    { hardwareConcurrency: 1 },
    { hardwareConcurrency: 4, deviceMemory: 2 },
    { deviceMemory: 0.5 },
    { hardwareConcurrency: 3, deviceMemory: 4 },
    { connection: { saveData: true }, hardwareConcurrency: 16 },
    { connection: { saveData: false } },
    { connection: null },
    { hardwareConcurrency: 0, deviceMemory: 0 },
  ];
  for (const stored of [undefined, 'on', 'off', 'neon', '']) {
    for (const device of devices) {
      const store = stored === undefined ? {} : { [FX_KEY]: stored };
      const { fx, writes } = runFxInit(store, device);
      assert.equal(fx, resolveFx(store[FX_KEY] ?? null, device), `存值 ${stored}，设备 ${JSON.stringify(device)}`);
      assert.deepEqual(writes, [], '推断结果不写回存储');
    }
  }
  // 隐私模式 / 配额满：读炸了也要按设备推断写上属性
  assert.equal(runFxInit({ throws: true }, { hardwareConcurrency: 2 }).fx, 'off');
  assert.equal(runFxInit({ throws: true }, { hardwareConcurrency: 8 }).fx, 'on');
});
