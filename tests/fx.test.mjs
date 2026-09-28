import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import { FX_EVENT, inferFx, isFx, resolveFx } from '../src/lib/fx.ts';
import { FX_KEY } from '../src/lib/storage.ts';
import { cmpSpec, cssFiles, declarations, parseRules, specificity, stripComments, subject } from './helpers/css-rules.mjs';
import { installFakeDom, restoreGlobals } from './helpers/fake-dom.mjs';

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

// ---------------------------------------------------------------------------
// 关着的时候：环境光不渲染、区色投影不画、纯装饰的无限动画停掉

const OFF = /\[data-fx='off'\]/;

test('every endless decorative animation has an off switch that really wins, and none comes back under it', () => {
  const offenders = [];
  const covered = [];
  for (const file of cssFiles('src')) {
    const where = path.relative('src', file).replace(/\\/g, '/');
    const rules = parseRules(stripComments(fs.readFileSync(file, 'utf8')));
    const offRules = rules.filter((rule) => !rule.inReduced && OFF.test(rule.selector));
    const plainRules = rules.filter((rule) => !rule.inReduced && !OFF.test(rule.selector));

    // 哪些主体上跑着无限循环
    const endless = new Set();
    for (const rule of plainRules) {
      for (const [prop, value] of declarations(rule.body)) {
        const loops =
          (prop === 'animation' && /\binfinite\b/.test(value)) ||
          (prop === 'animation-iteration-count' && value === 'infinite');
        if (loops) for (const selector of rule.selector.split(',')) endless.add(subject(selector));
      }
    }

    // 这些主体上的每一条动画声明（含只改 name / duration 的变体），都得被一条「光效关」规则
    // 用 animation: none 真正压住：特异性更高，或相同且写在后面
    for (const rule of plainRules) {
      for (const [prop, value] of declarations(rule.body)) {
        if (prop !== 'animation' && !prop.startsWith('animation-')) continue;
        if (value === 'none' || value.startsWith('none')) continue;
        for (const selector of rule.selector.split(',')) {
          const subj = subject(selector);
          if (!endless.has(subj)) continue;
          const spec = specificity(selector);
          const won = offRules.some(
            (off) =>
              declarations(off.body).some(([p, v]) => (p === 'animation' || p === 'animation-name') && v === 'none') &&
              off.selector.split(',').some((offSel) => {
                if (!OFF.test(offSel) || subject(offSel) !== subj) return false;
                const order = cmpSpec(specificity(offSel), spec);
                return order > 0 || (order === 0 && off.start > rule.start);
              }),
          );
          if (won) covered.push(`${where} ${subj}`);
          else offenders.push(`${where}  ${selector.trim()} { ${prop}: ${value} }`);
        }
      }
    }

    // 「光效关」的规则自己不许再带无限循环回来
    for (const off of offRules) {
      for (const [prop, value] of declarations(off.body)) {
        if (prop.startsWith('animation') && /\binfinite\b/.test(value)) offenders.push(`${where}  ${off.selector} 又带回了无限循环`);
      }
    }
  }
  assert.deepEqual(offenders, [], `光效关时还停不下来的无限动画：\n  ${offenders.join('\n  ')}`);

  // 需求点名的几样都在册：公告药丸呼吸灯、充电条满格流光、公告标题流光、环境光斑漂移
  const names = new Set(covered);
  for (const expected of [
    'components/notice/Notice.module.css pillDot',
    'components/exam/Exam.module.css libraryChargeFill',
    'components/exam/Exam.module.css libraryChargeLabel',
    'components/notice/Notice.module.css headline',
    'components/ambient/Ambient.module.css spotA',
    'components/exam/Exam.module.css chargeLight',
    'components/badge/IdBadge.module.css ribbonTail',
  ]) {
    assert.ok(names.has(expected), `${expected} 没有被光效开关管到`);
  }
});

test('off means no ambient layer at all and a plain static shadow on the front card', () => {
  const exam = fs.readFileSync('src/components/exam/ExamApp.tsx', 'utf8');
  const ambientCss = stripComments(fs.readFileSync('src/components/ambient/Ambient.module.css', 'utf8'));
  const deckCss = stripComments(fs.readFileSync('src/components/deck/Deck.module.css', 'utf8'));
  const tilt = fs.readFileSync('src/components/fx/useCardTilt.ts', 'utf8');

  // ExamApp：关着时整个不渲染环境光（不是透明）。钩子在所有提前 return 之前无条件调用
  assert.match(exam, /\{fx === 'on' && <AmbientBackdrop zone=\{frontZone\} \/>\}/);
  const hookAt = exam.indexOf('const fx = useFx();');
  assert.ok(hookAt > 0 && hookAt < exam.indexOf("if (phase === 'setup' || phase === 'loading') {"));
  assert.match(exam, /import \{ useFx \} from '@\/lib\/useFx';/);

  // 水合之前那一瞬（静态 HTML 按「开」预渲染）：CSS 按首帧的 data-fx 把整层藏掉
  assert.match(ambientCss, /:global\(:root\[data-fx='off'\]\) \.backdrop \{\s*display: none;\s*\}/);

  // 前牌：区色投影不画，只剩 .tilt 那圈中性阴影；倾斜钩子把开关折进「是否启用」
  assert.match(deckCss, /:global\(:root\[data-fx='off'\]\) \.tilt::before \{\s*display: none;\s*\}/);
  assert.match(deckCss, /\n\.tilt \{[^}]*box-shadow: 0 10px 30px/);
  assert.match(tilt, /const fx = useFx\(\);\s*const active = enabled && fx === 'on';/);
  assert.match(tilt, /if \(!node \|\| !active\) return;/);
  assert.match(tilt, /\[active, maxDeg\]/);
});

const { attachCardTilt } = await import('../src/components/fx/useCardTilt.ts');
const { attachSpotlight } = await import('../src/components/ambient/spotlight.ts');

test('with effects off the tilt and the spotlight attach nothing; switching off mid-effect settles at once', (t) => {
  t.after(restoreGlobals);
  const rect = { left: 0, top: 0, width: 340, height: 486 };

  for (const attach of [attachCardTilt, attachSpotlight]) {
    // 关着：一个监听都不挂，摘除函数是空的、可以放心调
    let dom = installFakeDom({ fx: 'off' });
    let node = dom.element(rect);
    const everything = () =>
      [node, dom.win, dom.doc, ...Object.values(dom.queries)].reduce((sum, target) => sum + target.count(), 0);
    const detach = attach(node);
    assert.equal(everything(), 0, `${attach.name}：光效关时不许挂任何监听`);
    detach();
    detach();
    restoreGlobals();

    // 开着挂上，跟手 / 亮起之后关掉光效：同一条收手路径，立刻复位、撤掉排着的帧
    dom = installFakeDom({ fx: 'on' });
    node = dom.element(rect);
    const off = attach(node);
    const target = attach === attachCardTilt ? node : dom.win;
    const move = (x, y) => target.emit('pointermove', { pointerType: 'mouse', clientX: x, clientY: y });
    move(300, 60);
    dom.flush();
    const active = () => (attach === attachCardTilt ? 'tilting' in node.dataset : node.dataset.lit === 'true');
    assert.equal(active(), true, `${attach.name}：开着时照常跟手`);
    move(310, 70); // 关掉时还排着一帧
    dom.setFx('off');
    assert.equal(active(), false, `${attach.name}：关掉光效要立刻收手`);
    assert.equal(dom.pending(), 0, `${attach.name}：排着的帧要撤掉`);
    move(320, 80);
    assert.equal(dom.pending(), 0, `${attach.name}：关着时不再跟`);
    // 再打开：挂着的这一份下一下移动就接着跟（React 那边另会按开关重挂）
    dom.setFx('on');
    move(330, 90);
    dom.flush();
    assert.equal(active(), true, `${attach.name}：开回来接着跟`);
    off();
    restoreGlobals();
  }
});
