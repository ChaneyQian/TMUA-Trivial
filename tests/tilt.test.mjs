import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { TILT_MAX_DEG, settleDelay, shouldSettle, tiltPose } from '../src/lib/tilt.ts';
import { REDUCED_MOTION, installFakeDom, restoreGlobals } from './helpers/fake-dom.mjs';

// 卡片随指针倾斜（P8-A2 前牌；P8-B 工牌会共用）。
//   1. lib/tilt.ts 的换算：纯函数，直接算
//   2. components/fx/useCardTilt.ts 的挂载逻辑：用一套最小的假 DOM 跑行为，
//      不靠源码正则——节流、只认鼠标、媒体条件、收手、摘除，全部看它真的做了什么

const HOOK = 'src/components/fx/useCardTilt.ts';

// 一张 340 × 486 的前牌，放在视口里随便一个位置：换算只认相对位置
const RECT = { left: 100, top: 50, width: 340, height: 486 };
/** 卡面上的相对位置（0–1，可越界）→ 姿态 */
const at = (fx, fy, max) =>
  tiltPose(RECT.left + RECT.width * fx, RECT.top + RECT.height * fy, RECT, max);

test('the centre of the card is level, with the glare dead centre', () => {
  const pose = at(0.5, 0.5);
  assert.deepEqual(pose, { rx: 0, ry: 0, gx: 50, gy: 50 });
  // 不留带符号的零：-0deg 写进样式虽然等价，比对与日志里却是个坑
  assert.ok(Object.is(pose.rx, 0) && Object.is(pose.ry, 0));
});

test('the four corners reach ±maxDeg on both axes, and the side under the pointer lifts', () => {
  assert.equal(TILT_MAX_DEG, 6);
  // 左上角：上缘抬起（rotateX 负）、左缘抬起（rotateY 正）
  assert.deepEqual(at(0, 0), { rx: -6, ry: 6, gx: 0, gy: 0 });
  assert.deepEqual(at(1, 0), { rx: -6, ry: -6, gx: 100, gy: 0 });
  assert.deepEqual(at(0, 1), { rx: 6, ry: 6, gx: 0, gy: 100 });
  assert.deepEqual(at(1, 1), { rx: 6, ry: -6, gx: 100, gy: 100 });

  // 四边中点只推一个轴
  assert.deepEqual(at(1, 0.5), { rx: 0, ry: -6, gx: 100, gy: 50 });
  assert.deepEqual(at(0, 0.5), { rx: 0, ry: 6, gx: 0, gy: 50 });
  assert.deepEqual(at(0.5, 1), { rx: 6, ry: 0, gx: 50, gy: 100 });
  assert.deepEqual(at(0.5, 0), { rx: -6, ry: 0, gx: 50, gy: 0 });

  // 中间是线性的：四分点正好半程
  assert.deepEqual(at(0.75, 0.25), { rx: -3, ry: -3, gx: 75, gy: 25 });

  // 最大角可配（工牌打算用 ±8°），四角跟着到 ±maxDeg
  assert.deepEqual(at(1, 1, 8), { rx: 8, ry: -8, gx: 100, gy: 100 });
  assert.deepEqual(at(0, 0, 8), { rx: -8, ry: 8, gx: 0, gy: 0 });
});

test('a pointer outside the box is clamped to the nearest edge, never past ±maxDeg', () => {
  // 指针在卡外一点点、或卡正在补间时，一律夹紧
  for (const [fx, fy] of [
    [-3, 2],
    [9, -9],
    [0.2, 1.7],
    [1.01, -0.01],
    [-0.4, 0.5],
  ]) {
    const pose = at(fx, fy);
    assert.ok(Math.abs(pose.rx) <= 6 && Math.abs(pose.ry) <= 6, `${fx},${fy} 越过了 ±6°`);
    assert.ok(pose.gx >= 0 && pose.gx <= 100 && pose.gy >= 0 && pose.gy <= 100, `${fx},${fy} 高光出界`);
  }
  // 夹紧就是贴到最近的那条边上，不是随便截一个数
  assert.deepEqual(at(-3, 2), at(0, 1));
  assert.deepEqual(at(9, -9), at(1, 0));
  assert.deepEqual(at(-0.4, 0.5), at(0, 0.5));
});

test('degenerate input never leaks NaN or a runaway angle into the styles', () => {
  const rest = { rx: 0, ry: 0, gx: 50, gy: 50 };
  // 还没布局 / display: none 的元素没有尺寸
  assert.deepEqual(tiltPose(10, 10, { left: 0, top: 0, width: 0, height: 0 }), rest);
  assert.deepEqual(tiltPose(10, 10, { left: 0, top: 0, width: NaN, height: 100 }), rest);
  // 坏坐标当正中
  assert.deepEqual(tiltPose(NaN, NaN, RECT), rest);
  assert.deepEqual(tiltPose(Infinity, -Infinity, RECT), rest);
  // 负的 / 坏的最大角：取绝对值 / 回落默认值
  assert.deepEqual(at(1, 1, -6), at(1, 1, 6));
  assert.deepEqual(at(1, 1, NaN), at(1, 1));
});

// ---------------------------------------------------------------------------
// 挂载逻辑：最小假 DOM（tests/helpers/fake-dom.mjs，环境光的聚光测试也用这一套）

/** 装好假 DOM，再造一张挂在 RECT 位置的「前牌」 */
function fakeDom(options) {
  const dom = installFakeDom(options);
  const node = dom.element(RECT);
  return {
    ...dom,
    node,
    props: node.props,
    reads: node.reads,
    /** 在卡面相对位置 (fx, fy) 处来一下 pointermove */
    move(fx, fy, pointerType = 'mouse') {
      node.emit('pointermove', {
        pointerType,
        clientX: RECT.left + RECT.width * fx,
        clientY: RECT.top + RECT.height * fy,
      });
    },
  };
}

const { attachCardTilt, useCardTilt, TILT_VARS } = await import('../src/components/fx/useCardTilt.ts');

test('pointer moves are rAF-throttled into one write per frame, on CSS variables only', (t) => {
  t.after(restoreGlobals);
  const dom = fakeDom();
  const detach = attachCardTilt(dom.node, 6);

  // 一帧里来三下：只排一帧、只量一次、只写最后那一下
  dom.move(0.2, 0.2);
  dom.move(0.6, 0.4);
  dom.move(1, 0);
  assert.equal(dom.pending(), 1, '一帧最多排一次');
  assert.equal(dom.props.size, 0, '不在事件里同步写样式');
  dom.flush();
  assert.equal(dom.reads(), 1);
  assert.equal(dom.props.get('--tilt-rx'), '-6.00deg');
  assert.equal(dom.props.get('--tilt-ry'), '-6.00deg');
  assert.equal(dom.props.get('--glare-x'), '100.0%');
  assert.equal(dom.props.get('--glare-y'), '0.0%');
  assert.equal(dom.props.get('--tilt-on'), '1');
  assert.equal(dom.node.dataset.tilting, '', '跟手期间挂 data-tilting');
  // 只写自己那几个变量：槽位 transform、横滑的 --drag 一个字都不碰
  assert.deepEqual([...dom.props.keys()].sort(), [...TILT_VARS].sort());

  // 下一帧接着跟
  dom.move(0.5, 0.5);
  dom.flush();
  assert.equal(dom.props.get('--tilt-rx'), '0.00deg');
  assert.equal(dom.props.get('--tilt-ry'), '0.00deg');
  detach();
});

test('only a fine, hovering mouse tilts; touch, coarse pointers and reduced motion never do', (t) => {
  t.after(restoreGlobals);

  // 触屏与笔：横滑归 CardDeck 的 touch 那一套
  let dom = fakeDom();
  let detach = attachCardTilt(dom.node);
  dom.move(0.9, 0.1, 'touch');
  dom.move(0.9, 0.1, 'pen');
  assert.equal(dom.pending(), 0);
  detach();

  // 没有悬停 / 粗指针的设备
  dom = fakeDom({ fine: false });
  detach = attachCardTilt(dom.node);
  dom.move(0.9, 0.1);
  assert.equal(dom.pending(), 0);
  detach();

  // 减动效
  dom = fakeDom({ reduced: true });
  detach = attachCardTilt(dom.node);
  dom.move(0.9, 0.1);
  assert.equal(dom.pending(), 0);
  assert.equal(dom.props.size, 0);
  detach();

  // 跟手途中打开减动效：立刻收手，之后也不再跟
  dom = fakeDom();
  detach = attachCardTilt(dom.node);
  dom.move(0.9, 0.1);
  dom.flush();
  assert.equal(dom.node.dataset.tilting, '');
  dom.setMedia(REDUCED_MOTION, true);
  assert.equal('tilting' in dom.node.dataset, false);
  dom.move(0.2, 0.2);
  assert.equal(dom.pending(), 0);
  // 关掉减动效：下一下移动就接着跟，不用重新挂
  dom.setMedia(REDUCED_MOTION, false);
  dom.move(0.2, 0.2);
  dom.flush();
  assert.equal(dom.node.dataset.tilting, '');
  detach();
});

test('leaving settles the card: angles go, the glare stays put to fade out in place', (t) => {
  t.after(restoreGlobals);
  const dom = fakeDom();
  const detach = attachCardTilt(dom.node);
  dom.move(0.8, 0.3);
  dom.flush();

  // 离开时还排着一帧：要撤掉，不然离开之后又被它写回去
  dom.move(0.9, 0.2);
  assert.equal(dom.pending(), 1);
  dom.node.emit('pointerleave');
  assert.equal(dom.pending(), 0, '收手要撤掉排着的帧');
  assert.equal(dom.props.has('--tilt-rx'), false);
  assert.equal(dom.props.has('--tilt-ry'), false);
  assert.equal(dom.props.get('--tilt-on'), '0');
  assert.equal('tilting' in dom.node.dataset, false, '回弹的补间靠摘掉 data-tilting 触发');
  assert.equal(dom.props.get('--glare-x'), '80.0%', '高光原地淡出，不先跳回正中');

  // 失焦、页面隐藏同样收手；隐藏期间不排帧
  dom.move(0.1, 0.1);
  dom.flush();
  dom.win.emit('blur');
  assert.equal('tilting' in dom.node.dataset, false);

  dom.move(0.1, 0.1);
  dom.flush();
  dom.doc.hidden = true;
  dom.doc.emit('visibilitychange');
  assert.equal('tilting' in dom.node.dataset, false);
  dom.move(0.3, 0.3);
  assert.equal(dom.pending(), 0, '页面隐藏时不排帧');
  detach();
});

test('detaching removes every listener and the pose, but leaves the glare where it was', (t) => {
  t.after(restoreGlobals);
  const dom = fakeDom();
  const targets = [dom.node, dom.win, dom.doc, ...Object.values(dom.queries)];
  const before = targets.map((target) => target.count());

  const detach = attachCardTilt(dom.node);
  assert.ok(
    targets.every((target, k) => target.count() > before[k]),
    '指针 / 离开 / 失焦 / 可见性 / 两条媒体查询都要有监听',
  );
  dom.move(0.7, 0.2);
  dom.flush();
  dom.move(0.2, 0.2); // 摘除时还排着一帧

  // 换牌：ref 从旧前牌上摘下
  detach();
  assert.deepEqual(
    targets.map((target) => target.count()),
    before,
    '加了几个监听就摘几个',
  );
  assert.equal(dom.pending(), 0, '排着的帧一并撤掉');
  assert.equal('tilting' in dom.node.dataset, false, '这张牌接下来是后牌，不许留着前牌的姿态');
  // 倾角与开关摘掉；高光坐标留下——旧前牌的高光在原地淡出，而不是先跳回正中再淡
  assert.deepEqual([...dom.props.keys()].sort(), ['--glare-x', '--glare-y']);
  assert.equal(dom.props.get('--glare-x'), '70.0%');
  assert.equal(dom.props.get('--glare-y'), '20.0%');

  // 幂等：再摘一次、或摘完再来事件，都不出错、不复活
  detach();
  dom.move(0.9, 0.9);
  assert.equal(dom.pending(), 0);
  assert.equal(dom.props.get('--glare-x'), '70.0%');
});

test('useCardTilt hands maxDeg and enabled through to the element', (t) => {
  t.after(restoreGlobals);
  // 真跑一遍钩子（服务端渲染里 useCallback 照常返回回调），拿到它交给 ref 的那个函数
  const refs = {};
  function Probe() {
    refs.badge = useCardTilt({ maxDeg: 8 }); // P8-B 工牌要 ±8°
    refs.plain = useCardTilt();
    refs.off = useCardTilt({ enabled: false });
    return null;
  }
  renderToStaticMarkup(createElement(Probe));

  // ±8°：指针在右下角，两个轴都到 8
  let dom = fakeDom();
  let cleanup = refs.badge(dom.node);
  dom.move(1, 1);
  dom.flush();
  assert.equal(dom.props.get('--tilt-rx'), '8.00deg');
  assert.equal(dom.props.get('--tilt-ry'), '-8.00deg');
  cleanup();

  // 不传就是 ±6°
  dom = fakeDom();
  cleanup = refs.plain(dom.node);
  dom.move(0, 0);
  dom.flush();
  assert.equal(dom.props.get('--tilt-rx'), '-6.00deg');
  assert.equal(dom.props.get('--tilt-ry'), '6.00deg');
  cleanup();

  // 停用：一个监听都不挂，也没有清理函数
  dom = fakeDom();
  const targets = [dom.node, dom.win, dom.doc, ...Object.values(dom.queries)];
  assert.equal(refs.off(dom.node), undefined);
  assert.equal(targets.reduce((sum, target) => sum + target.count(), 0), 0);
  dom.move(1, 1);
  assert.equal(dom.pending(), 0);
  // React 卸载时用 null 调 ref：什么也不做
  assert.equal(refs.badge(null), undefined);
});

test('the hook is a stable ref callback that stays out of React state', () => {
  const src = fs
    .readFileSync(HOOK, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
  // 返回 ref 回调；选项不变身份就不变，React 不会每次渲染都摘了重挂
  assert.match(
    src,
    /export function useCardTilt<T extends HTMLElement>\(\{\s*maxDeg = TILT_MAX_DEG,\s*enabled = true,\s*settleMs = 0,\s*\}: CardTiltOptions = \{\}\): RefCallback<T>/,
  );
  assert.match(src, /useCallback\(/);
  // 「是否启用」= enabled 且光效开着（lib/useFx）；选项或开关一变，回调换身份、React 摘了重挂。
  // 回平时长不在依赖里：走 ref 现读（改它不该把正倾着的卡摔平一次），见下方的行为测试
  assert.match(src, /\[active, maxDeg\]/);
  assert.match(src, /attachCardTilt\(node, maxDeg, \(\) => settleRef\.current\)/);
  assert.match(src, /if \(!node \|\| !active\) return;/);
  // 跟手路径不许有 React state；也不许自己去写 transform
  assert.doesNotMatch(src, /useState|useReducer|forceUpdate/);
  assert.doesNotMatch(src, /\.style\.transform|setProperty\('transform'|--drag/);
  // 换算走 lib 里那个纯函数，不在钩子里另写一份
  assert.match(src, /from '\.\.\/\.\.\/lib\/tilt\.ts'/);
  assert.match(src, /tiltPose\(x, y, rect, maxDeg\)/);
  // 量包围盒在输入阶段、一帧一次；rAF 回调里只写不读（不逼出同步样式计算）
  const apply = src.slice(src.indexOf('const apply = () => {'), src.indexOf('const settle = () => {'));
  assert.doesNotMatch(apply, /getBoundingClientRect|offsetWidth|offsetHeight|getComputedStyle/);
  const onMove = src.slice(src.indexOf('const onMove = (e: PointerEvent) => {'), src.indexOf('const onVisibility'));
  assert.match(onMove, /if \(frame \|\| document\.hidden\) return;\s*rect = node\.getBoundingClientRect\(\);/);
});

// ---------------------------------------------------------------------------
// 停住回平（settleMs）：工牌用，前牌不启用。
//   1. lib/tilt.ts 的判定：纯函数，直接算
//   2. 挂载逻辑：在假 DOM 上再装一只手摇的时钟（setTimeout / clearTimeout / performance.now），
//      只在这个文件里装——没启用回平的挂载一个定时器都不该排，也就不需要它

test('settling is off unless given a positive finite delay, then due once the pointer has rested that long', () => {
  // 规整：只认正的有限毫秒数
  assert.equal(settleDelay(900), 900);
  assert.equal(settleDelay(0.5), 0.5);
  for (const off of [undefined, 0, -1, -900, NaN, Infinity, -Infinity]) {
    assert.equal(settleDelay(off), 0, `${off} 应当是不启用`);
  }

  // 不启用：停多久都不回平
  for (const off of [undefined, 0, -5, NaN, Infinity]) {
    assert.equal(shouldSettle(0, 1e9, off), false, `${off} 不该回平`);
  }

  // 启用：差一毫秒不回平，正好到点与之后都回平
  assert.equal(shouldSettle(1000, 1899, 900), false);
  assert.equal(shouldSettle(1000, 1899.999, 900), false);
  assert.equal(shouldSettle(1000, 1900, 900), true);
  assert.equal(shouldSettle(1000, 5000, 900), true);
  assert.equal(shouldSettle(1000, 1000, 900), false, '刚动过');

  // 时钟倒退当「刚动过」；坏时间一律不回平（宁可多倾一会儿，不在没停的时候摔平）
  assert.equal(shouldSettle(5000, 1000, 900), false);
  assert.equal(shouldSettle(NaN, 5000, 900), false);
  assert.equal(shouldSettle(1000, NaN, 900), false);
  assert.equal(shouldSettle(-Infinity, 5000, 900), false);
});

/** 给假 window 装一只手摇时钟：advance(ms) 按到期先后跑定时器，跑的时候 now 正好停在到期那一刻 */
function installClock(win) {
  let now = 0;
  let nextId = 1;
  const timers = new Map();
  win.performance = { now: () => now };
  win.setTimeout = (fn, ms = 0) => {
    const id = nextId++;
    timers.set(id, { fn, at: now + Math.max(0, Number(ms) || 0) });
    return id;
  };
  win.clearTimeout = (id) => {
    timers.delete(id);
  };
  return {
    /** 排着还没到期的定时器数 */
    timers: () => timers.size,
    advance(ms) {
      const end = now + ms;
      for (;;) {
        let due = null;
        for (const [id, timer] of timers) if (timer.at <= end && (!due || timer.at < due[1].at)) due = [id, timer];
        if (!due) break;
        timers.delete(due[0]);
        now = due[1].at;
        due[1].fn();
      }
      now = end;
    },
  };
}

test('with settleMs the card levels off after the pointer rests, and tilts again on the next move', (t) => {
  t.after(restoreGlobals);
  const dom = fakeDom();
  const clock = installClock(dom.win);
  const detach = attachCardTilt(dom.node, 8, 900);

  dom.move(1, 1);
  dom.flush();
  assert.equal(dom.node.dataset.tilting, '');
  assert.equal(dom.props.get('--tilt-rx'), '8.00deg');
  assert.equal(clock.timers(), 1, '一次跟手只排一个停住检查');

  // 差一毫秒：还倾着
  clock.advance(899);
  assert.equal(dom.node.dataset.tilting, '');
  // 到点：回平——和离开同一条收手路径：摘姿态、摘 data-tilting，高光坐标留在原地
  clock.advance(1);
  assert.equal('tilting' in dom.node.dataset, false);
  assert.equal(dom.props.has('--tilt-rx'), false);
  assert.equal(dom.props.has('--tilt-ry'), false);
  assert.equal(dom.props.get('--tilt-on'), '0');
  assert.equal(dom.props.get('--glare-x'), '100.0%', '贴片停在最后的颜色上，不跳回正中');
  assert.equal(clock.timers(), 0, '回平之后不再排定时器');

  // 再动再倾
  dom.move(0, 0);
  dom.flush();
  assert.equal(dom.node.dataset.tilting, '');
  assert.equal(dom.props.get('--tilt-rx'), '-8.00deg');
  assert.equal(clock.timers(), 1);
  detach();
  assert.equal(clock.timers(), 0, '摘除时撤掉定时器');
});

test('moving keeps the card tilted: the rest timer counts from the last move, with one timer at a time', (t) => {
  t.after(restoreGlobals);
  const dom = fakeDom();
  const clock = installClock(dom.win);
  const detach = attachCardTilt(dom.node, 8, 900);

  // 0、500、1000 各动一下（每下都跑一帧）：定时器不随每下重排，始终只有一个
  dom.move(0.2, 0.2);
  dom.flush();
  clock.advance(500);
  dom.move(0.4, 0.4);
  dom.flush();
  assert.equal(clock.timers(), 1);
  clock.advance(500);
  dom.move(0.6, 0.6);
  dom.flush();
  assert.equal(clock.timers(), 1);

  // 第一个检查在 900 到点：离最后一次移动（1000）还差得远，改约到 1900
  clock.advance(899); // now = 1899
  assert.equal(dom.node.dataset.tilting, '', '最后一次移动之后还没停够 900');
  assert.equal(clock.timers(), 1);
  clock.advance(1); // now = 1900
  assert.equal('tilting' in dom.node.dataset, false, '从最后一次移动起停满 900 才回平');

  // 一帧里的连动也只按最后一下算：排着帧的那几下同样刷新「最后一次移动」
  dom.move(0.1, 0.1);
  dom.flush();
  clock.advance(800);
  dom.move(0.3, 0.3);
  dom.move(0.5, 0.5); // 同一帧里的第二下
  dom.flush();
  clock.advance(899);
  assert.equal(dom.node.dataset.tilting, '');
  clock.advance(1);
  assert.equal('tilting' in dom.node.dataset, false);
  detach();
});

test('without settleMs nothing is timed: the deck front card stays tilted while the pointer rests', (t) => {
  t.after(restoreGlobals);
  const dom = fakeDom();
  const clock = installClock(dom.win);
  let reads = 0;
  dom.win.performance = { now: () => (reads++, 0) };
  const detach = attachCardTilt(dom.node, 6);

  dom.move(1, 0);
  dom.flush();
  clock.advance(60_000);
  assert.equal(dom.node.dataset.tilting, '', '前牌不启用回平：停多久都倾着，直到离开');
  assert.equal(clock.timers(), 0, '一个定时器都不排');
  assert.equal(reads, 0, '也不读时钟');
  dom.node.emit('pointerleave');
  assert.equal('tilting' in dom.node.dataset, false);
  detach();

  // 坏值同不启用
  for (const bad of [0, -1, NaN, Infinity]) {
    const again = fakeDom();
    const c = installClock(again.win);
    const off = attachCardTilt(again.node, 6, bad);
    again.move(1, 1);
    again.flush();
    c.advance(10_000);
    assert.equal(again.node.dataset.tilting, '', `settleMs = ${bad} 应当不启用`);
    assert.equal(c.timers(), 0);
    off();
    restoreGlobals();
  }
});

test('leaving, hiding or switching effects off while tilted also clears the rest timer', (t) => {
  t.after(restoreGlobals);
  for (const leave of [
    (dom) => dom.node.emit('pointerleave'),
    (dom) => dom.win.emit('blur'),
    (dom) => {
      dom.doc.hidden = true;
      dom.doc.emit('visibilitychange');
    },
    (dom) => dom.setMedia(REDUCED_MOTION, true),
    (dom) => dom.setFx('off'),
  ]) {
    const dom = fakeDom();
    const clock = installClock(dom.win);
    const detach = attachCardTilt(dom.node, 8, 900);
    dom.move(0.9, 0.9);
    dom.flush();
    assert.equal(clock.timers(), 1);
    leave(dom);
    assert.equal('tilting' in dom.node.dataset, false);
    assert.equal(clock.timers(), 0, '收手时撤掉停住检查');
    detach();
    restoreGlobals();
  }
});

test('useCardTilt hands settleMs through, read live: changing it does not re-attach', (t) => {
  t.after(restoreGlobals);
  const refs = {};
  function Probe({ settleMs }) {
    refs.badge = useCardTilt({ maxDeg: 8, settleMs });
    refs.plain = useCardTilt({ maxDeg: 8 });
    return null;
  }
  renderToStaticMarkup(createElement(Probe, { settleMs: 900 }));

  // 工牌：±8°、停住 900ms 回平
  let dom = fakeDom();
  let clock = installClock(dom.win);
  let cleanup = refs.badge(dom.node);
  dom.move(1, 1);
  dom.flush();
  assert.equal(dom.props.get('--tilt-rx'), '8.00deg');
  clock.advance(900);
  assert.equal('tilting' in dom.node.dataset, false);
  cleanup();
  assert.equal(clock.timers(), 0);
  restoreGlobals();

  // 不传：与前牌一样不回平
  dom = fakeDom();
  clock = installClock(dom.win);
  cleanup = refs.plain(dom.node);
  dom.move(1, 1);
  dom.flush();
  clock.advance(5_000);
  assert.equal(dom.node.dataset.tilting, '');
  assert.equal(clock.timers(), 0);
  cleanup();
});
