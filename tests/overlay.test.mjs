import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import path from 'node:path';

import { cssFiles, declarations, overrides, parseRules, stripComments, subject } from './helpers/css-rules.mjs';
import { installFakeDom, restoreGlobals } from './helpers/fake-dom.mjs';
import { code, effects, namedFn, namedImports } from './helpers/source.mjs';

// 整屏遮罩标记（lib/overlay 的 <html data-overlay>）与它的几头：
//   - 工牌浮层、解锁过渡层在屏上时挂着它（components/badge/IdBadge、exam/ExamApp 的 UnlockOverlay）
//   - 设置页的光标聚光看见它就熄灯、不再逐帧重画（components/ambient/spotlight）
//   - 各样式表里的无限循环动画在它底下一律暂停（:root[data-overlay] … { animation-play-state: paused }）
// 为什么：遮罩带 backdrop-filter，身后每变一帧整屏模糊就得重算一遍；这时身后本来就看不清（交叉审查 2026-09-29）

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
  const held = effects(badge).filter(({ body }) => body.includes('holdOverlay('));
  assert.equal(held.length, 1, '只在一处挂标记');
  assert.deepEqual(held[0].deps, ['visible']);
  // 按语义判——把这段 effect 真跑一遍：不在屏上什么都不挂；在屏上挂一份，清理函数就是那份的 release
  const run = new Function('visible', 'holdOverlay', held[0].body);
  const release = () => {};
  let holds = 0;
  const hold = () => (holds++, release);
  assert.equal(run(false, hold), undefined, '不在屏上不该挂标记');
  assert.equal(holds, 0);
  assert.equal(run(true, hold), release, '清理函数得是 release，收好时标记才会摘掉');
  assert.equal(holds, 1);
  // visible 的口径：落下、挂着、收起途中都算，收好（stowed）才不算——把定义按四个阶段求一遍
  const visibleExpr = /const visible = ([^;]+);/.exec(badge)?.[1];
  assert.ok(visibleExpr, '找不到 visible 的定义');
  const visibleIn = new Function('stage', `return (${visibleExpr});`);
  for (const stage of ['dropping', 'resting', 'flying']) assert.equal(Boolean(visibleIn(stage)), true, `${stage} 时浮层在屏上`);
  assert.equal(Boolean(visibleIn('stowed')), false);

  // 聚光那头：现判与订阅都从 lib/overlay 来（行为见上面几条）；它自己不往 <html> 上写（见 ambient.test）
  const spot = code(fs.readFileSync('src/components/ambient/spotlight.ts', 'utf8'));
  const names = namedImports(spot, '../../lib/overlay.ts');
  assert.ok(names.has('overlayOpen') && names.has('subscribeOverlay'));
  assert.doesNotMatch(spot, /document\.documentElement/);
});

// ---------------------------------------------------------------------------
// 遮罩底下的无限循环动画：一律暂停

const OVERLAY = /\[data-overlay\]/;
const FX_OFF = /\[data-fx='off'\]/;
/** 遮罩标记本身的限定条件：写在 :root 上的 data-overlay */
const OVERLAY_ROOT = [':root', '[data-overlay]'];

/**
 * 这份样式表里「遮罩开着时还会接着跑」的无限动画声明。能把播放状态设回 running 的只有简写 animation
 * （它会重置全部长写）与 animation-play-state 本身；每一条都得被一条 :root[data-overlay] 下的
 * animation-play-state: paused 真正压住——选中的是它的超集，且特异性更高或同特异性写在后面
 */
function unpausedUnderOverlay(css) {
  const rules = parseRules(stripComments(css)).filter((rule) => !rule.inReduced && !/^@keyframes/.test(rule.at ?? ''));
  const pauses = rules.filter(
    (rule) => OVERLAY.test(rule.selector) && declarations(rule.body).some(([p, v]) => p === 'animation-play-state' && v === 'paused'),
  );
  const plain = rules.filter((rule) => !OVERLAY.test(rule.selector) && !FX_OFF.test(rule.selector));
  const endless = new Set();
  for (const rule of plain) {
    for (const [prop, value] of declarations(rule.body)) {
      if ((prop === 'animation' || prop === 'animation-iteration-count') && /\binfinite\b/.test(value)) {
        for (const selector of rule.selector.split(',')) endless.add(subject(selector));
      }
    }
  }
  const offenders = [];
  const covered = new Set();
  for (const rule of plain) {
    for (const [prop, value] of declarations(rule.body)) {
      if (prop !== 'animation' && prop !== 'animation-play-state') continue;
      if (/^none\b/.test(value) || value === 'paused') continue;
      for (const selector of rule.selector.split(',')) {
        const subj = subject(selector);
        if (!endless.has(subj)) continue;
        const won = pauses.some((pause) =>
          pause.selector.split(',').some((pauseSel) => OVERLAY.test(pauseSel) && overrides(pause, pauseSel, rule, selector, { allow: OVERLAY_ROOT })),
        );
        if (won) covered.add(subj);
        else offenders.push(`${selector.trim()} { ${prop}: ${value} }`);
      }
    }
  }
  return { offenders, covered: [...covered], pauses };
}

test('every endless animation behind an overlay is paused while the overlay is up', () => {
  const offenders = [];
  const covered = new Set();
  for (const file of cssFiles('src')) {
    const where = path.relative('src', file).replace(/\\/g, '/');
    const result = unpausedUnderOverlay(fs.readFileSync(file, 'utf8'));
    for (const miss of result.offenders) offenders.push(`${where}  ${miss}`);
    for (const subj of result.covered) covered.add(`${where} ${subj}`);
    // 暂停规则只管暂停：不许顺手改别的（none、换动画、改时长都会让遮罩一撤就跳回起点或变样）
    for (const pause of result.pauses) {
      assert.deepEqual(declarations(pause.body), [['animation-play-state', 'paused']], `${where} ${pause.selector} 不只是暂停`);
    }
  }
  assert.deepEqual(offenders, [], `遮罩开着时还在跑的无限动画：\n  ${offenders.join('\n  ')}`);
  // 全仓搜 infinite 逐条核过的那几样都在册（新写一条无限动画不配暂停，上面那条就会红）
  for (const expected of [
    'components/badge/IdBadge.module.css ribbonTail',
    'components/ambient/Ambient.module.css spotA',
    'components/ambient/Ambient.module.css spotB',
    'components/ambient/Ambient.module.css spotC',
    'components/exam/Exam.module.css chargeLight',
    'components/exam/Exam.module.css libraryChargeFill',
    'components/exam/Exam.module.css libraryChargeLabel',
    'components/exam/Exam.module.css finishMark',
    'components/exam/Exam.module.css finishTitle',
    'components/notice/Notice.module.css pillDot',
    'components/notice/Notice.module.css headline',
  ]) {
    assert.ok(covered.has(expected), `${expected} 没有在遮罩底下暂停`);
  }
});

test('the overlay pause guard has teeth', () => {
  const PAUSE = ':global(:root[data-overlay])';
  // 缺了暂停
  assert.equal(unpausedUnderOverlay('.a { animation: spin 1s linear infinite; }').offenders.length, 1);
  assert.deepEqual(
    unpausedUnderOverlay(`.a { animation: spin 1s linear infinite; }\n${PAUSE} .a { animation-play-state: paused; }`).offenders,
    [],
  );
  // 暂停规则限定得更窄（只管 .x 底下的 .a），盖不住全部 .a
  assert.equal(
    unpausedUnderOverlay(`.a { animation: spin 1s infinite; }\n${PAUSE} .x .a { animation-play-state: paused; }`).offenders.length,
    1,
  );
  // 「父类 + 子类」的简写（会把播放状态重置回 running）特异性 (0,2,0)：没有标记前缀的暂停压不住它
  assert.equal(
    unpausedUnderOverlay('.p .a { animation: spin 1s infinite; }\n.a { animation-play-state: paused; }').offenders.length,
    1,
  );
  // 只改时长的长写不会重置播放状态，不用单独压
  assert.deepEqual(
    unpausedUnderOverlay(`.a { animation: spin 1s infinite; }\n.b:hover .a { animation-duration: 2s; }\n${PAUSE} .a { animation-play-state: paused; }`)
      .offenders,
    [],
  );
});

test('the unlock overlay holds the mark too, for exactly as long as it is mounted', () => {
  const exam = code(fs.readFileSync('src/components/exam/ExamApp.tsx', 'utf8'));
  assert.ok(namedImports(exam, '@/lib/overlay').has('holdOverlay'));
  const unlock = namedFn(exam, 'UnlockOverlay');
  assert.ok(unlock, '找不到 UnlockOverlay');
  const held = effects(unlock).filter(({ body }) => body.includes('holdOverlay('));
  assert.equal(held.length, 1, 'UnlockOverlay 里只该有一处挂标记');
  assert.deepEqual(held[0].deps, [], '挂载时挂、卸载时摘');
  // 把 effect 真跑一遍：它得把 holdOverlay 的 release 原样交回去当清理函数
  const body = /[;{}]/.test(held[0].body) ? held[0].body : `return (${held[0].body});`;
  const release = () => {};
  let calls = 0;
  const cleanup = new Function('holdOverlay', body)(() => (calls++, release));
  assert.equal(calls, 1);
  assert.equal(cleanup, release, '清理函数得是 release，卸载时标记才会摘掉');
});
