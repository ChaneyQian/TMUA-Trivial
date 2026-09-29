import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { installFakeDom, restoreGlobals } from './helpers/fake-dom.mjs';
import { code, effects, namedImports } from './helpers/source.mjs';

// 整屏遮罩标记（lib/overlay 的 <html data-overlay>）与它的两头：
//   - 工牌浮层在屏上时挂着它（components/badge/IdBadge）
//   - 设置页的光标聚光看见它就熄灯、不再逐帧重画（components/ambient/spotlight）
// 为什么：浮层带 backdrop-filter，身后每变一帧整屏模糊就得重算一遍；聚光这时本来就看不见（交叉审查 2026-09-29）

const { OVERLAY_EVENT, holdOverlay, overlayOpen, subscribeOverlay } = await import('../src/lib/overlay.ts');
const { attachSpotlight } = await import('../src/components/ambient/spotlight.ts');

/** 假 DOM；window.dispatchEvent 转成假 window 自己的 emit（同 fx.test） */
function fakeDom(options) {
  const dom = installFakeDom(options);
  dom.win.dispatchEvent = (event) => dom.win.emit(event.type);
  return dom;
}

/** 挂上聚光；move 在视口 (x, y) 处来一下鼠标移动 */
function spotlight(dom) {
  const lens = dom.element();
  const detach = attachSpotlight(lens);
  return {
    lens,
    detach,
    move: (x, y) => dom.win.emit('pointermove', { pointerType: 'mouse', clientX: x, clientY: y }),
    lit: () => lens.dataset.lit === 'true',
  };
}

test('holdOverlay marks <html data-overlay> while any overlay is up, and broadcasts only when that flips', (t) => {
  t.after(restoreGlobals);
  const dom = fakeDom();
  const root = dom.doc.documentElement.dataset;
  let heard = 0;
  const unsubscribe = subscribeOverlay(() => heard++);

  assert.equal(overlayOpen(), false);
  const first = holdOverlay();
  assert.equal(overlayOpen(), true);
  assert.equal(root.overlay, 'open');
  assert.equal(heard, 1);

  // 叠一个：标记不变、不重复广播；摘掉其中一个，标记还在
  const second = holdOverlay();
  assert.equal(heard, 1);
  first();
  assert.equal(overlayOpen(), true, '还有一个遮罩开着');
  first(); // 重复摘无害，不会把另一份也摘掉
  assert.equal(overlayOpen(), true);
  assert.equal(heard, 1);

  second();
  assert.equal(overlayOpen(), false);
  assert.equal('overlay' in root, false, '摘干净，不留空值');
  assert.equal(heard, 2);

  unsubscribe();
  holdOverlay()();
  assert.equal(heard, 2, '退订之后不再收到');
  assert.notEqual(OVERLAY_EVENT, 'mcq-test:fx-change', '事件名不与光效开关撞');
});

test('the spotlight goes dark and stops scheduling frames the moment an overlay opens, and comes back after', (t) => {
  t.after(restoreGlobals);
  const dom = fakeDom();
  const s = spotlight(dom);

  s.move(10, 10);
  dom.flush();
  assert.equal(s.lit(), true);

  // 遮罩打开时还排着一帧：立刻熄灯、撤掉那一帧
  s.move(20, 20);
  assert.equal(dom.pending(), 1);
  const release = holdOverlay();
  assert.equal(s.lit(), false, '遮罩一开就熄灯');
  assert.equal(dom.pending(), 0, '排着的帧撤掉');

  // 开着期间：指针怎么动都不排帧、不写变量——身后一帧都不变，整屏模糊就不用重算
  const mx = s.lens.props.get('--mx');
  for (let i = 0; i < 10; i++) s.move(100 + i, 100 + i);
  assert.equal(dom.pending(), 0, '遮罩底下不再逐帧重画');
  assert.equal(s.lens.props.get('--mx'), mx);
  assert.equal(s.lit(), false);

  // 关掉：关的那一下不点灯（等指针动），之后与遮罩出现前一模一样——一帧只写最后那一下
  release();
  assert.equal(s.lit(), false);
  assert.equal(dom.pending(), 0);
  s.move(300, 200);
  s.move(310, 210);
  assert.equal(dom.pending(), 1, '一帧最多排一次，照旧');
  dom.flush();
  assert.equal(s.lit(), true);
  assert.equal(s.lens.props.get('--mx'), '310px');
  assert.equal(s.lens.props.get('--my'), '210px');
  s.detach();
});

test('a spotlight mounted under an open overlay stays dark until it goes; detaching unsubscribes', (t) => {
  t.after(restoreGlobals);
  const dom = fakeDom();
  const release = holdOverlay();
  const before = dom.win.count();
  const s = spotlight(dom);
  assert.ok(dom.win.count() > before, '挂上时订阅了遮罩的切换');

  s.move(5, 5);
  assert.equal(dom.pending(), 0, '挂上时遮罩已经开着：不亮');
  release();
  s.move(6, 6);
  dom.flush();
  assert.equal(s.lit(), true);

  // 摘除：订阅一并摘掉；之后遮罩开合都不再碰这个节点
  s.detach();
  assert.equal(dom.win.count(), before, '加了几个监听就摘几个');
  const again = holdOverlay();
  again();
  s.move(7, 7);
  assert.equal(dom.pending(), 0);
  assert.equal(s.lit(), false);
});

test('the badge holds the overlay mark for exactly as long as it is on screen', () => {
  const badge = code(fs.readFileSync('src/components/badge/IdBadge.tsx', 'utf8'));
  assert.ok(namedImports(badge, '@/lib/overlay').has('holdOverlay'));
  // visible = 落下、挂着、收起途中都算；收好（stowed）才摘。effect 的清理就是 release
  const held = effects(badge).filter(({ body }) => body.includes('holdOverlay('));
  assert.equal(held.length, 1, '只在一处挂标记');
  assert.deepEqual(held[0].deps, ['visible']);
  assert.equal(held[0].body, 'if (!visible) return; return holdOverlay();');
  assert.match(badge, /const visible = stage !== 'stowed';/);

  // 聚光那头：现判与订阅都从 lib/overlay 来（行为见上面几条）；它自己不往 <html> 上写（见 ambient.test）
  const spot = code(fs.readFileSync('src/components/ambient/spotlight.ts', 'utf8'));
  const names = namedImports(spot, '../../lib/overlay.ts');
  assert.ok(names.has('overlayOpen') && names.has('subscribeOverlay'));
  assert.doesNotMatch(spot, /document\.documentElement/);
});
