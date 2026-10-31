import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

// 成绩页 P11（Design §26）：揭晓（大比分滚动计数、TMUA 估分刻度尺）+ 逐题回顾导航（题号结果条、只看错题、窄屏横滚）。
// 这组测试盯四件事：
//   1. lib/resultReview 的纯函数：计数缓动、刻度尺定位、估分读屏文本、题号状态与筛选
//   2. 减动效 / 光效关下没有动画：分子不滚（shouldCountUp）、色块不扫（样式表里的关闭规则真的赢）
//   3. 三套主题的对比度：文字 4.5:1、色块 / 刻度线 / 边框 / 旗标这类图形 3:1
//   4. 接线：ExamApp 把本场的题、作答、标记交给纯函数，组件只管画——按语义查，不写死整段 JSX

import {
  COUNT_UP_GRACE_MS,
  COUNT_UP_MS,
  RULER_MAX,
  RULER_MIN,
  RULER_MIN_BAND_PCT,
  VERDICT_MARK,
  VERDICT_TEXT,
  canFilterMissed,
  countUpValue,
  easeOutCubic,
  isReviewShown,
  reviewAnchorId,
  reviewCellLabel,
  reviewCells,
  reviewTally,
  reviewVerdict,
  rulerBand,
  rulerPercent,
  rulerSweep,
  rulerTicks,
  shouldCountUp,
  speakTmuaGrade,
  startCountUp,
} from '../src/lib/resultReview.ts';
import { TMUA_GRADE_TABLES, formatTmuaGrade } from '../src/lib/tmuaGrade.ts';
import { currentFx, subscribeFx } from '../src/lib/fx.ts';
import { FX_OFF_ROOT, cascade, overrides, parseRules, stripComments, timeMs } from './helpers/css-rules.mjs';
import { REDUCED_MOTION as FAKE_REDUCED_MOTION, installFakeDom, restoreGlobals } from './helpers/fake-dom.mjs';
import { attrValue, code, effects, jsxByClass, jsxChildren, jsxOpening, namedFn, namedImports } from './helpers/source.mjs';

const EXAM_PATH = 'src/components/exam/ExamApp.tsx';

const near = (actual, expected, msg) => assert.ok(Math.abs(actual - expected) < 1e-9, `${msg ?? ''} ${actual} ≠ ${expected}`);

// ---------------------------------------------------------------------------
// 1. 纯函数

test('the count-up eases out from 0 to the final score in 600ms and never overshoots', () => {
  assert.equal(COUNT_UP_MS, 600);
  assert.equal(easeOutCubic(0), 0);
  assert.equal(easeOutCubic(1), 1);
  assert.equal(easeOutCubic(-1), 0, '夹在 0–1');
  assert.equal(easeOutCubic(2), 1);
  assert.equal(easeOutCubic(Number.NaN), 1, '认不出的进度当作已经到头');
  // ease-out：前一半时间走完大半
  assert.ok(easeOutCubic(0.5) > 0.8);

  for (const target of [1, 7, 17, 20, 40, 100]) {
    assert.equal(countUpValue(target, 0), 0, `${target}：起点是 0`);
    assert.equal(countUpValue(target, COUNT_UP_MS), target, `${target}：到时长正好是终值`);
    assert.equal(countUpValue(target, COUNT_UP_MS * 5), target, `${target}：之后一直是终值`);
    let prev = 0;
    for (let ms = 0; ms <= COUNT_UP_MS; ms++) {
      const v = countUpValue(target, ms);
      assert.ok(Number.isInteger(v), `${target} @${ms}ms：${v} 不是整数`);
      assert.ok(v >= prev, `${target} @${ms}ms：从 ${prev} 倒退到 ${v}`);
      assert.ok(v <= target, `${target} @${ms}ms：${v} 超过了终值`);
      prev = v;
    }
    // 前快后慢：时长过半时已经过了终值的一半
    assert.ok(countUpValue(target, COUNT_UP_MS / 2) >= target / 2, `${target}：不是 ease-out`);
  }
  // 负的时间（时钟回拨之类）当作还没开始
  assert.equal(countUpValue(17, -50), 0);
});

test('nothing to count up means the final value straight away', () => {
  assert.equal(countUpValue(0, 0), 0);
  assert.equal(countUpValue(0, 300), 0);
  assert.equal(countUpValue(17, 100, 0), 17, '时长为 0 直接是终值');
  assert.equal(countUpValue(17, Number.NaN), 17, '时间认不出就直接是终值');
  assert.ok(Number.isNaN(countUpValue(Number.NaN, 100)), '终值本身认不出就原样返回，不编一个数');
  assert.equal(countUpValue(2.5, 100), 2.5);
});

test('the count-up only runs when motion is welcome, the tab is visible and there is something to count', () => {
  const ok = { target: 17, reducedMotion: false, fx: 'on', hidden: false };
  assert.equal(shouldCountUp(ok), true);
  assert.equal(shouldCountUp({ ...ok, reducedMotion: true }), false, '减动效下不滚');
  assert.equal(shouldCountUp({ ...ok, fx: 'off' }), false, '光效关时不滚');
  assert.equal(shouldCountUp({ ...ok, hidden: true }), false, '后台标签页 rAF 不跑：直接终值');
  assert.equal(shouldCountUp({ ...ok, target: 0 }), false, '0 分没什么可滚');
  assert.equal(shouldCountUp({ ...ok, target: Number.NaN }), false);
});

test('the ruler maps 1.0–9.0 onto 0–100% with integer ticks 1…9', () => {
  assert.equal(RULER_MIN, 1);
  assert.equal(RULER_MAX, 9);
  assert.equal(rulerPercent(1), 0);
  assert.equal(rulerPercent(9), 100);
  assert.equal(rulerPercent(5), 50);
  near(rulerPercent(8.1), 88.75);
  assert.equal(rulerPercent(0), 0, '夹在两端之内');
  assert.equal(rulerPercent(12), 100);
  assert.equal(rulerPercent(Number.NaN), 0);
  assert.deepEqual(
    rulerTicks().map((t) => t.value),
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
  assert.deepEqual(
    rulerTicks().map((t) => t.pct),
    [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100],
  );
});

test('the band covers the estimate range, single values get a minimum width, and it never leaves the ruler', () => {
  // 区间照实画
  const b34 = rulerBand(8.1, 8.3);
  near(b34.left, 88.75, '8.1 的左缘');
  near(b34.width, 2.5, '8.1–8.3 的宽度');
  // 单值档：以那个值为中心撑到最小宽度
  const b36 = rulerBand(8.7, 8.7);
  near(b36.width, RULER_MIN_BAND_PCT);
  near(b36.left + b36.width / 2, rulerPercent(8.7), '单值档以那个值为中心');
  // 碰到两端往里挪
  assert.deepEqual(rulerBand(9, 9), { left: 100 - RULER_MIN_BAND_PCT, width: RULER_MIN_BAND_PCT });
  assert.deepEqual(rulerBand(1, 1), { left: 0, width: RULER_MIN_BAND_PCT });
  // lo / hi 写反了也照样画
  assert.deepEqual(rulerBand(8.3, 8.1), rulerBand(8.1, 8.3));

  // 换算表里的每一档：落在尺内、不窄于最小宽度、盖住整个区间
  for (const band of TMUA_GRADE_TABLES[2025]) {
    const { left, width } = rulerBand(band.lo, band.hi);
    const tag = `${band.raw} 分（${formatTmuaGrade(band)}）`;
    assert.ok(left >= 0 && left + width <= 100 + 1e-9, `${tag}：色块出了尺`);
    assert.ok(width >= RULER_MIN_BAND_PCT - 1e-9, `${tag}：色块窄于最小宽度`);
    assert.ok(left <= rulerPercent(band.lo) + 1e-9 && left + width >= rulerPercent(band.hi) - 1e-9, `${tag}：色块没盖住区间`);
  }
});

test('the sweep layer runs from the ruler start to the band, and parks the band exactly where rulerBand put it', () => {
  for (const [lo, hi] of [
    [8.1, 8.3],
    [8.7, 8.7],
    [9, 9],
    [1, 1],
    [3.8, 4.1],
  ]) {
    const band = rulerBand(lo, hi);
    const sweep = rulerSweep(band);
    near(sweep.width, band.left + band.width, `${lo}–${hi} 扫出层宽度`);
    // 色块在扫出层里的左缘（占扫出层的百分比）换回全尺就是 band.left
    near((sweep.bandLeft / 100) * sweep.width, band.left, `${lo}–${hi} 色块落点`);
    assert.ok(sweep.bandLeft >= 0 && sweep.bandLeft <= 100);
  }
  assert.deepEqual(rulerSweep({ left: 0, width: 0 }), { width: 0, bandLeft: 0 });
});

test('the estimate reads as "8.1 至 8.3" for screen readers, never as a dash', () => {
  assert.equal(speakTmuaGrade({ lo: 8.1, hi: 8.3 }), '8.1 至 8.3');
  assert.equal(speakTmuaGrade({ lo: 8.7, hi: 8.7 }), '8.7');
  assert.equal(speakTmuaGrade({ lo: 9, hi: 9 }), '9.0');
  assert.equal(speakTmuaGrade({ lo: 6, hi: 6.1 }), '6.0 至 6.1');
  // 与视觉上的 formatTmuaGrade 一一对应：只是把 en dash 换成「 至 」
  for (const band of TMUA_GRADE_TABLES[2025]) {
    const spoken = speakTmuaGrade(band);
    assert.doesNotMatch(spoken, /[–-]/, `${band.raw} 分：读屏文本里还有连接号`);
    assert.equal(spoken.replace(' 至 ', '–'), formatTmuaGrade(band), `${band.raw} 分`);
  }
});

/** ExamApp 里的 sameLabel，原样去类型求出来：题号条的对错口径必须与成绩页判分同一个 */
function examSameLabel() {
  const fn = namedFn(fs.readFileSync(EXAM_PATH, 'utf8'), 'sameLabel');
  assert.ok(fn, 'ExamApp 里找不到 sameLabel');
  const js = ts.transpileModule(`__out = function sameLabel${fn};`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText;
  return new Function(`let __out;\n${js}\nreturn __out;`)();
}

test('each question is right, wrong or blank — judged exactly like the score', () => {
  assert.equal(reviewVerdict(null, 'b'), 'blank');
  assert.equal(reviewVerdict(undefined, 'b'), 'blank');
  assert.equal(reviewVerdict('', 'b'), 'blank');
  assert.equal(reviewVerdict('b', 'b'), 'right');
  assert.equal(reviewVerdict('B', 'b'), 'right', '标号不分大小写（MAT 体例是小写）');
  assert.equal(reviewVerdict('c', 'B'), 'wrong');

  // 与 ExamApp 的 sameLabel 逐个对拍：right ⇔ sameLabel 为真；blank ⇔ 没作答
  const sameLabel = examSameLabel();
  for (const selected of [null, 'a', 'A', 'b', 'B', 'e']) {
    for (const answer of ['a', 'B', 'e']) {
      const verdict = reviewVerdict(selected, answer);
      assert.equal(verdict === 'right', sameLabel(selected, answer), `${selected} vs ${answer}`);
      assert.equal(verdict === 'blank', !selected, `${selected} vs ${answer}`);
    }
  }
});

test('one cell per question, aligned with answers and flags', () => {
  const questions = [{ answer: 'a' }, { answer: 'b' }, { answer: 'c' }, { answer: 'd' }];
  const cells = reviewCells(questions, ['a', 'c', null], [false, true, true]);
  assert.deepEqual(cells, [
    { index: 0, verdict: 'right', flagged: false },
    { index: 1, verdict: 'wrong', flagged: true },
    { index: 2, verdict: 'blank', flagged: true },
    // 作答 / 标记表短了：按未答、未标记
    { index: 3, verdict: 'blank', flagged: false },
  ]);
  assert.deepEqual(reviewCells([], [], []), []);
});

test('every cell tells its state in words, and the three states carry three different marks', () => {
  assert.equal(reviewCellLabel({ index: 2, verdict: 'wrong', flagged: true }), '第 3 题，答错，已标记');
  assert.equal(reviewCellLabel({ index: 0, verdict: 'right', flagged: false }), '第 1 题，答对');
  assert.equal(reviewCellLabel({ index: 99, verdict: 'blank', flagged: false }), '第 100 题，未答');
  assert.deepEqual(VERDICT_TEXT, { right: '答对', wrong: '答错', blank: '未答' });
  // 不只靠颜色：三种结局三个不同的符号
  assert.deepEqual(VERDICT_MARK, { right: '✓', wrong: '✗', blank: '–' });
  assert.equal(new Set(Object.values(VERDICT_MARK)).size, 3);
});

test('"wrong only" keeps wrong and unanswered cards, and is switched off when everything is right', () => {
  const cells = reviewCells([{ answer: 'a' }, { answer: 'b' }, { answer: 'c' }], ['a', 'a', null], [true, false, false]);
  assert.deepEqual(reviewTally(cells), { right: 1, wrong: 1, blank: 1, flagged: 1, missed: 2 });
  assert.equal(canFilterMissed(cells), true);
  // 没开筛选：全显示
  assert.deepEqual(
    cells.map((c) => isReviewShown(c, false)),
    [true, true, true],
  );
  // 开了：答错与未答（未答按 TMUA 口径也算错）
  assert.deepEqual(
    cells.map((c) => isReviewShown(c, true)),
    [false, true, true],
  );
  // 全对：没什么可筛
  const perfect = reviewCells([{ answer: 'a' }, { answer: 'b' }], ['a', 'B'], []);
  assert.equal(canFilterMissed(perfect), false);
  assert.equal(reviewTally(perfect).missed, 0);
  assert.equal(canFilterMissed([]), false);
  // 找不到格子就别把卡藏起来
  assert.equal(isReviewShown(undefined, true), true);
});

/**
 * 手摇的计数宿主：帧按给定时间戳一帧一帧地放，定时器手动到点，中断信号手动发。
 * 记下挂着的帧 / 定时器 / 监听，验收尾时都摘干净了
 */
function fakeHost() {
  const frames = new Map();
  const timers = new Map();
  const interrupts = new Set();
  let next = 1;
  return {
    host: {
      requestFrame: (cb) => (frames.set(next, cb), next++),
      cancelFrame: (id) => frames.delete(id),
      setTimer: (cb, ms) => (timers.set(next, { cb, ms }), next++),
      clearTimer: (id) => timers.delete(id),
      onInterrupt: (cb) => (interrupts.add(cb), () => interrupts.delete(cb)),
    },
    frame(now) {
      const due = [...frames.values()];
      frames.clear();
      for (const cb of due) cb(now);
    },
    fireTimer() {
      const due = [...timers.values()];
      timers.clear();
      for (const { cb } of due) cb();
    },
    interrupt: () => [...interrupts].forEach((cb) => cb()),
    timerMs: () => [...timers.values()].map((t) => t.ms),
    live: () => frames.size + timers.size + interrupts.size,
  };
}

test('the count-up driver steps once per frame from the first frame on, and lands exactly on the score', () => {
  const fake = fakeHost();
  const seen = [];
  startCountUp(17, (v) => seen.push(v), fake.host);
  assert.deepEqual(fake.timerMs(), [COUNT_UP_MS + COUNT_UP_GRACE_MS], '兜底定时器比时长多等一点');
  // 时间从第一帧算起：第一帧在 5000ms（之前主线程在排公式），这一帧报的是 0
  for (let now = 5000; now <= 5000 + COUNT_UP_MS + 32; now += 16) fake.frame(now);
  assert.equal(seen[0], 0);
  assert.equal(seen.at(-1), 17, '最后停在终值');
  assert.equal(seen.filter((v) => v === 17).length >= 1, true);
  for (let i = 1; i < seen.length; i++) assert.ok(seen[i] >= seen[i - 1], `第 ${i} 帧倒退：${seen[i - 1]} → ${seen[i]}`);
  // 收尾后一切都摘干净，之后再怎么走帧、定时器到点，都不再报值
  assert.equal(fake.live(), 0, '帧 / 定时器 / 监听没摘干净');
  const count = seen.length;
  fake.frame(99999);
  fake.fireTimer();
  fake.interrupt();
  assert.equal(seen.length, count);
});

test('a frozen rAF (background tab) still lands on the score: the fallback timer finishes it', () => {
  const fake = fakeHost();
  const seen = [];
  startCountUp(17, (v) => seen.push(v), fake.host);
  fake.frame(0);
  fake.frame(100);
  // 之后 rAF 不再来（标签页被藏起来了）
  fake.fireTimer();
  assert.equal(seen.at(-1), 17);
  assert.equal(fake.live(), 0);
});

test('hiding the tab or switching effects off mid-count jumps straight to the score', () => {
  const fake = fakeHost();
  const seen = [];
  startCountUp(20, (v) => seen.push(v), fake.host);
  fake.frame(0);
  fake.frame(48);
  fake.interrupt();
  assert.equal(seen.at(-1), 20);
  assert.ok(seen.length <= 3, '中断之后不再一帧帧地走');
  assert.equal(fake.live(), 0);
});

test('stopping (unmount) mid-count removes everything and reports nothing more', () => {
  const fake = fakeHost();
  const seen = [];
  const stop = startCountUp(20, (v) => seen.push(v), fake.host);
  fake.frame(0);
  stop();
  assert.equal(fake.live(), 0);
  fake.frame(1000);
  fake.fireTimer();
  fake.interrupt();
  assert.deepEqual(seen, [0], '卸载后不补终值（组件都没了）');
  stop();
});

test('each review card gets its own anchor id', () => {
  assert.equal(reviewAnchorId(0), 'review-q-1');
  assert.equal(reviewAnchorId(19), 'review-q-20');
  const ids = Array.from({ length: 100 }, (_, i) => reviewAnchorId(i));
  assert.equal(new Set(ids).size, 100);
  for (const id of ids) assert.match(id, /^[a-z][\w-]*$/, `${id} 不是合法的 id`);
});

// ---------------------------------------------------------------------------
// 2. 大比分滚动计数：组件接线、减动效 / 光效关、读屏

const SCORE_COUNT = 'src/components/result/ScoreCount.tsx';
const RESULT_CSS = 'src/components/result/Result.module.css';
const EXAM_CSS = 'src/components/exam/Exam.module.css';
const GLOBALS = 'src/app/globals.css';

/** 组件源码里的一个顶层 function，去类型后求出来；scope 里的名字当外部变量传进去 */
function componentFn(file, name, scope = {}) {
  const fn = namedFn(fs.readFileSync(file, 'utf8'), name);
  assert.ok(fn, `${file} 里找不到 ${name}`);
  const js = ts.transpileModule(`__out = function ${name}${fn};`, {
    fileName: 'snippet.tsx',
    compilerOptions: { target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.React },
  }).outputText;
  const names = Object.keys(scope);
  return new Function(...names, `let __out;\n${js}\nreturn __out;`)(...names.map((n) => scope[n]));
}

test('the score counts up only when motion is welcome: reduced motion, effects off and a hidden tab all show the final value', (t) => {
  t.after(restoreGlobals);
  const allowedIn = ({ reduced = false, fx = 'on', hidden = false } = {}, target = 17) => {
    const dom = installFakeDom({ reduced, fx });
    dom.doc.hidden = hidden;
    const allowed = componentFn(SCORE_COUNT, 'countUpAllowed', {
      window: dom.win,
      document: dom.doc,
      shouldCountUp,
      currentFx,
      REDUCED_MOTION: FAKE_REDUCED_MOTION,
    });
    return allowed(target);
  };
  assert.equal(allowedIn(), true);
  assert.equal(allowedIn({ reduced: true }), false, '减动效下不滚');
  assert.equal(allowedIn({ fx: 'off' }), false, '光效关时不滚');
  assert.equal(allowedIn({ hidden: true }), false, '后台标签页里不滚');
  assert.equal(allowedIn({}, 0), false, '0 分不滚');
  // 组件问的就是减动效这条媒体查询
  assert.match(fs.readFileSync(SCORE_COUNT, 'utf8'), /'\(prefers-reduced-motion: reduce\)'/);
});

test('the browser host ends the count when the tab is hidden or effects are switched off, and lets go of both on cleanup', (t) => {
  t.after(restoreGlobals);
  const dom = installFakeDom();
  const host = componentFn(SCORE_COUNT, 'browserHost', { window: dom.win, document: dom.doc, subscribeFx })();
  let hits = 0;
  const off = host.onInterrupt(() => hits++);
  dom.doc.emit('visibilitychange');
  assert.equal(hits, 1, '切到后台要收尾');
  dom.setFx('off');
  assert.equal(hits, 2, '中途关光效要收尾');
  off();
  assert.equal(dom.doc.count() + dom.win.count(), 0, '退订后监听要摘干净');
  dom.doc.emit('visibilitychange');
  assert.equal(hits, 2);
  // 帧与定时器就是浏览器的 rAF / setTimeout
  const frame = host.requestFrame(() => {});
  assert.equal(dom.pending(), 1);
  host.cancelFrame(frame);
  assert.equal(dom.pending(), 0);
});

test('ScoreCount decides on the first render, counts through startCountUp once, and never restarts', () => {
  const src = code(fs.readFileSync(SCORE_COUNT, 'utf8'));
  const imported = namedImports(fs.readFileSync(SCORE_COUNT, 'utf8'), '@/lib/resultReview');
  for (const name of ['shouldCountUp', 'startCountUp']) assert.ok(imported.has(name), `ScoreCount 没有从 lib/resultReview 引入 ${name}`);
  // 首帧就定好：能滚从 0 起，不能滚直接是终值——不会先闪一帧 0
  const init = src.match(/const \[(\w+), (\w+)\] = useState\(\(\) => \((.+?)\)\);/);
  assert.ok(init, '显示值得用惰性初值的 useState');
  const [, shown, setShown, initial] = init;
  assert.equal(initial, 'countUpAllowed(right) ? 0 : right');

  // 只有一个 effect，只跟 right 走（成绩页里的重渲染不让它重跑）
  const all = effects(src);
  assert.equal(all.length, 1, 'ScoreCount 只该有一个 effect');
  const [effect] = all;
  assert.deepEqual(effect.deps, ['right']);
  // 跑过帧了、或此刻不该滚：直接终值；否则把清理函数交还给 React（卸载即停）
  assert.match(effect.body, new RegExp(`if \\((\\w+)\\.current \\|\\| !countUpAllowed\\(right\\)\\) \\{ ${setShown}\\(right\\); return; \\}`));
  assert.match(effect.body, /return startCountUp\(right, /);
  assert.match(effect.body, /browserHost\(\)/);
  // 显示的就是这个值
  assert.match(src, new RegExp(`\\{${shown}\\}`));
});

test('screen readers get the final score at once; the rolling digits are hidden from them and cannot shift the layout', () => {
  const source = fs.readFileSync(SCORE_COUNT, 'utf8');
  // 读屏念的是视觉隐藏的静态终值
  const sr = jsxByClass(source, 'srOnly');
  assert.equal(sr.length, 1);
  assert.equal(code(jsxChildren(source, sr[0])), '{right} / {total}');
  // 滚动的那串数（连同分母）整块 aria-hidden
  const slot = jsxByClass(source, 'countSlot')[0];
  assert.ok(slot, '分子的格子不见了');
  const hiddenWrap = source.lastIndexOf('aria-hidden="true"', slot.start);
  assert.ok(hiddenWrap > sr[0].end && hiddenWrap < slot.start, '滚动的数字不在 aria-hidden 里');
  // 格子由看不见的终值撑定宽度
  const ghost = jsxByClass(source, 'countGhost')[0];
  assert.equal(code(jsxChildren(source, ghost)), '{right}');

  const css = fs.readFileSync(RESULT_CSS, 'utf8');
  const slotRule = cascade(css, '.countSlot');
  assert.equal(slotRule.display, 'inline-grid');
  assert.equal(slotRule['font-variant-numeric'], 'tabular-nums', '数字要等宽');
  assert.equal(cascade(css, '.countSlot > *')['grid-area'], '1 / 1', '终值与滚动的数叠在同一格');
  assert.equal(cascade(css, '.countGhost').visibility, 'hidden');
  assert.equal(cascade(css, '.srOnly').position, 'absolute');
  // 计数是 rAF 换字，样式上一条动画 / 过渡都没有
  for (const sel of ['.countSlot', '.countGhost', '.countRest']) {
    const rule = cascade(css, sel);
    for (const prop of ['animation', 'animation-name', 'transition', 'transition-property']) {
      assert.equal(rule[prop], undefined, `${sel} 带了 ${prop}`);
    }
  }
});

test('ExamApp shows the score through ScoreCount, inside the big score', () => {
  const source = fs.readFileSync(EXAM_PATH, 'utf8');
  assert.match(code(source), /import ScoreCount from '@\/components\/result\/ScoreCount';/);
  const [big] = jsxByClass(source, 'scoreBig');
  assert.ok(big, '大比分不见了');
  const inside = code(jsxChildren(source, big));
  const count = jsxOpening(inside, '<ScoreCount');
  assert.ok(count, '大比分里没有 ScoreCount');
  assert.equal(attrValue(count.attrs.get('right')), 'right');
  assert.equal(attrValue(count.attrs.get('total')), 'questions.length');
  // 分子就是成绩页算的那个对题数
  assert.match(code(source), /const right = questions\.filter\(\(qq, i\) => sameLabel\(answers\[i\], qq\.answer\)\)\.length;/);
});

// ---------------------------------------------------------------------------
// 3. TMUA 估分刻度尺

const RULER = 'src/components/result/TmuaRuler.tsx';

/** createElement 的替身：只留下 type / props / children（同 answer-feedback.test 的做法） */
const REACT = { createElement: (type, props, ...children) => ({ type, props: props ?? {}, children: children.flat() }) };
/** CSS Modules 的替身：styles.xxx 就是 'xxx' */
const STYLES = new Proxy({}, { get: (_, key) => (typeof key === 'string' ? key : undefined) });

/** 渲染树里按类名找元素 */
function findAll(node, cls, out = []) {
  if (!node || typeof node !== 'object') return out;
  if (String(node.props?.className ?? '').split(/\s+/).includes(cls)) out.push(node);
  for (const child of node.children ?? []) findAll(child, cls, out);
  return out;
}

/** 把 TmuaRuler 原样跑一遍（JSX 转 createElement），返回渲染树 */
function renderRuler(lo, hi) {
  const Ruler = componentFn(RULER, 'TmuaRuler', {
    React: REACT,
    styles: STYLES,
    rulerBand,
    rulerSweep,
    rulerTicks,
    TICKS: rulerTicks(),
  });
  return Ruler({ lo, hi });
}

const pct = (value) => Number.parseFloat(String(value).replace('%', ''));

test('the ruler is a silent picture: integer ticks 1…9 and one band where rulerBand puts it', () => {
  for (const [lo, hi] of [
    [8.1, 8.3],
    [8.7, 8.7],
    [9, 9],
    [1, 1],
    [3.8, 4.1],
  ]) {
    const tree = renderRuler(lo, hi);
    assert.equal(tree.props.className, 'ruler');
    assert.equal(tree.props['aria-hidden'], 'true', '刻度尺是纯图形，读屏不念（估分的字就在旁边）');
    const ticks = findAll(tree, 'rulerTick');
    const labels = findAll(tree, 'rulerLabel');
    assert.deepEqual(
      ticks.map((t) => pct(t.props.style.left)),
      [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100],
    );
    assert.deepEqual(
      labels.map((l) => l.children.join('')),
      ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    );
    // 色块：扫出层宽到色块右缘，色块在扫出层里的左缘换回全尺正好是 rulerBand 的 left
    const [sweep] = findAll(tree, 'rulerSweep');
    const [band] = findAll(tree, 'rulerBand');
    assert.ok(sweep && band, `${lo}–${hi}：色块不见了`);
    assert.ok(findAll(sweep, 'rulerBand').length === 1, '色块得在扫出层里面');
    const want = rulerBand(lo, hi);
    near(pct(sweep.props.style.width), want.left + want.width, `${lo}–${hi} 扫出层宽度`);
    near((pct(band.props.style.left) / 100) * pct(sweep.props.style.width), want.left, `${lo}–${hi} 色块左缘`);
    assert.equal(findAll(tree, 'rulerBand').length, 1, '尺上只有本场估分这一块');
  }
  // 不标任何主观阈值
  assert.doesNotMatch(fs.readFileSync(RULER, 'utf8').replace(/\/\/.*$/gm, ''), /录取|目标|cutoff|target|threshold/i);
});

test('the band sweeps in once from the left (transform only, ≤ 500ms) and stays put under reduced motion or effects off', () => {
  const css = fs.readFileSync(RESULT_CSS, 'utf8');
  const sweep = cascade(css, '.rulerSweep');
  assert.equal(sweep['transform-origin'], 'left center', '从尺的左端扫出来');
  const [name, duration, ...rest] = sweep.animation.split(/\s+(?![^(]*\))/);
  assert.equal(name, 'rulerSweep');
  assert.ok(timeMs(duration) > 0 && timeMs(duration) <= 500, `扫出 ${duration}，要 ≤ 500ms`);
  assert.doesNotMatch(sweep.animation, /infinite/, '只放一次');
  assert.ok(!rest.some((part) => /^\d+$/.test(part) && Number(part) > 1), '只放一次');
  // 关键帧只动 transform
  const frames = stripComments(css).match(/@keyframes rulerSweep \{([\s\S]*?)\n\}/);
  assert.ok(frames, '找不到 rulerSweep 的关键帧');
  const props = [...frames[1].matchAll(/([\w-]+):/g)].map((m) => m[1]);
  assert.deepEqual([...new Set(props)], ['transform']);

  // 减动效与光效关各有一条把它关掉、且在层叠上真的赢了的规则
  const rules = parseRules(stripComments(css));
  const on = rules.find((r) => !r.inReduced && r.selector === '.rulerSweep');
  const offBy = (pick, allow) =>
    rules.some(
      (r) =>
        pick(r) &&
        /animation:\s*none/.test(r.body) &&
        r.selector.split(',').some((sel) => overrides(r, sel, on, '.rulerSweep', { allow })),
    );
  assert.ok(offBy((r) => r.inReduced), '减动效下色块还在扫');
  assert.ok(
    offBy((r) => !r.inReduced && /data-fx='off'/.test(r.selector), FX_OFF_ROOT),
    '光效关时色块还在扫',
  );
});

/** 颜色值 → [r, g, b]：#rrggbb 与 var()（按主题 token 展开） */
function rgb(value, env) {
  let v = String(value ?? '').trim();
  for (let i = 0; i < 5 && /var\(/.test(v); i++) {
    v = v.replace(/var\((--[\w-]+)\)/g, (_, name) => {
      assert.ok(name in env, `token ${name} 没定义`);
      return env[name];
    });
  }
  const m = v.match(/^#([0-9a-f]{6})$/i);
  assert.ok(m, `认不出的颜色：${value} → ${v}`);
  return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
}
function luminance(c) {
  const [r, g, b] = c.map((v) => (v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
/** 三套主题的 token。globals.css 先剥掉 @import（parseRules 不认无块的 @ 语句，见 tmua-grade.test） */
function themeTokens(theme) {
  const globals = fs.readFileSync(GLOBALS, 'utf8').replace(/@import[^;]*;/g, '');
  const base = cascade(globals, ':root');
  assert.ok(base['--surface'] && base['--text-muted'], '浅色主题的 token 没读出来');
  return theme === 'light' ? base : { ...base, ...cascade(globals, `:root[data-theme="${theme}"]`) };
}
const THEMES = ['light', 'dark', 'sepia'];

test('the ruler reads at AA in light, dark and sepia: labels 4.5:1, band, ticks and baseline 3:1', () => {
  const css = fs.readFileSync(RESULT_CSS, 'utf8');
  const exam = fs.readFileSync(EXAM_CSS, 'utf8');
  const box = cascade(exam, '.tmuaGrade');
  const figures = [];
  for (const theme of THEMES) {
    const env = themeTokens(theme);
    const bg = rgb(box.background ?? box['background-color'], env);
    const label = cascade(css, '.rulerLabels').color ?? cascade(css, '.ruler').color ?? box.color;
    const ratio = contrast(rgb(label, env), bg);
    figures.push(`${theme} 数字 ${ratio.toFixed(2)}`);
    assert.ok(ratio >= 4.5, `${theme} 主题下刻度数字只有 ${ratio.toFixed(2)} : 1`);
    for (const sel of ['.rulerBand', '.rulerTick', '.rulerTrack::before']) {
      const rule = cascade(css, sel);
      const g = contrast(rgb(rule.background ?? rule['background-color'], env), bg);
      figures.push(`${theme} ${sel} ${g.toFixed(2)}`);
      assert.ok(g >= 3, `${theme} 主题下 ${sel} 只有 ${g.toFixed(2)} : 1`);
    }
  }
});

test('the estimate sits beside its ruler; sighted readers see 8.1–8.3, screen readers hear 8.1 至 8.3', () => {
  const source = fs.readFileSync(EXAM_PATH, 'utf8');
  assert.ok(namedImports(source, '@/lib/resultReview').has('speakTmuaGrade'));
  assert.match(code(source), /import TmuaRuler from '@\/components\/result\/TmuaRuler';/);
  const [grade] = jsxByClass(source, 'tmuaGrade');
  assert.ok(grade, '估分块不见了');
  const inside = jsxChildren(source, grade);
  const estimate = code(source).match(/const (\w+) = resultTmuaEstimate\(/)[1];

  // 视觉上的 8.1–8.3：读屏跳过
  const [value] = jsxByClass(inside, 'tmuaGradeValue');
  assert.equal(value.attrs.get('aria-hidden'), '"true"', '带 en dash 的估分值要对读屏藏起来');
  assert.equal(code(jsxChildren(inside, value)), `{formatTmuaGrade(${estimate})}`);
  // 读屏念的是「至」
  const sr = jsxOpening(inside, 'resultStyles.srOnly');
  assert.ok(sr, '估分块里没有读屏用的文本');
  assert.equal(code(jsxChildren(inside, sr)), `{speakTmuaGrade(${estimate})}`);
  // 刻度尺拿的就是这一场的区间
  const ruler = jsxOpening(inside, '<TmuaRuler');
  assert.ok(ruler, '估分块里没有刻度尺');
  assert.equal(attrValue(ruler.attrs.get('lo')), `${estimate}.lo`);
  assert.equal(attrValue(ruler.attrs.get('hi')), `${estimate}.hi`);
  // 7.5+ Diagnostic 的成绩页不接这些
  const diag = fs.readFileSync('src/components/diagnostic/DiagnosticResult.tsx', 'utf8');
  assert.doesNotMatch(diag, /TmuaRuler|ScoreCount|components\/result/);
});

// ---------------------------------------------------------------------------
// 4. 题号结果条 + 只看错题

const REVIEW = 'src/components/result/ReviewSection.tsx';
const resultReview = await import('../src/lib/resultReview.ts');

/**
 * 把一个组件模块整份去类型、转成 CommonJS 跑起来：react 的钩子换成可控的替身，
 * jsx 运行时只留下 { type, props }，CSS Module 的类名就是键名本身，lib 用真的
 */
function loadComponent(file, { state = {} } = {}) {
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    fileName: file,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const jsx = (type, props) => ({ type, props: props ?? {} });
  const hooks = {
    useState: (initial) => ['value' in state ? state.value : typeof initial === 'function' ? initial() : initial, (v) => (state.set = v)],
    useId: () => ':r1:',
  };
  const modules = {
    react: hooks,
    'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'Fragment' },
    '@/lib/resultReview': resultReview,
    './Result.module.css': { __esModule: true, default: STYLES },
  };
  const module = { exports: {} };
  new Function('require', 'module', 'exports', js)(
    (name) => {
      assert.ok(name in modules, `${file} 引了测试没准备的模块 ${name}`);
      return modules[name];
    },
    module,
    module.exports,
  );
  return module.exports.default;
}

/** 渲染树（jsx 运行时版：子节点在 props.children）里按条件找元素 */
function walk(node, pick, out = []) {
  if (Array.isArray(node)) {
    for (const n of node) walk(n, pick, out);
    return out;
  }
  if (!node || typeof node !== 'object') return out;
  if (pick(node)) out.push(node);
  walk(node.props?.children, pick, out);
  return out;
}
const byClass = (tree, cls) => walk(tree, (n) => String(n.props?.className ?? '').split(/\s+/).includes(cls));
const textOf = (node) =>
  Array.isArray(node) ? node.map(textOf).join('') : node && typeof node === 'object' ? textOf(node.props?.children) : node == null || node === false ? '' : String(node);

/** 渲染一次 ReviewSection：wrongOnly 是它那颗开关此刻的状态；children 收到的 shown 记下来 */
function renderReview(cells, wrongOnly = false) {
  const state = { value: wrongOnly };
  const Review = loadComponent(REVIEW, { state });
  let shown = null;
  const tree = Review({
    cells,
    children: (fn) => {
      shown = fn;
      return 'CARDS';
    },
  });
  return { tree, shown, state };
}

const SESSION = reviewCells(
  [{ answer: 'a' }, { answer: 'b' }, { answer: 'c' }, { answer: 'd' }, { answer: 'e' }],
  ['a', 'c', null, 'D', null],
  [false, true, false, true, false],
);

test('the strip has one button per question that says its state in words, with marks and a flag shape', () => {
  const { tree } = renderReview(SESSION);
  const cells = byClass(tree, 'cell');
  assert.equal(cells.length, 5);
  for (const [i, button] of cells.entries()) {
    const cell = SESSION[i];
    assert.equal(button.type, 'button');
    assert.equal(button.props.type, 'button');
    assert.equal(button.props['aria-label'], reviewCellLabel(cell));
    // 符号随结局走（不只靠颜色）、题号照写
    assert.equal(textOf(byClass(button, 'cellMark')), VERDICT_MARK[cell.verdict]);
    assert.equal(textOf(byClass(button, 'cellNum')), String(i + 1));
    // 旗标：只有本场标记过的才有那枚角标
    assert.equal(byClass(button, 'cellFlag').length, cell.flagged ? 1 : 0, `第 ${i + 1} 题的旗标`);
    // 结局类：答错 / 未答各有自己的类，答对只是底类
    const cls = button.props.className.split(' ');
    assert.equal(cls.includes('cellWrong'), cell.verdict === 'wrong');
    assert.equal(cls.includes('cellBlank'), cell.verdict === 'blank');
    assert.equal(button.props.disabled, false, '没开筛选时每一格都点得动');
  }
  // 标题与区块关联、题数汇总
  const [section] = walk(tree, (n) => n.type === 'section');
  const [title] = walk(tree, (n) => n.type === 'h2');
  assert.equal(section.props['aria-labelledby'], title.props.id);
  assert.equal(textOf(title), '逐题回顾');
  assert.match(textOf(byClass(tree, 'navTally')), /答对 2 · ✗ 答错 1 · – 未答 2 · 标记 2/);
  // 有序列表：读屏报「共 5 项」
  assert.equal(walk(tree, (n) => n.type === 'ol').length, 1);

  // 100 题也一格不少
  const many = reviewCells(Array.from({ length: 100 }, () => ({ answer: 'a' })), [], []);
  assert.equal(byClass(renderReview(many).tree, 'cell').length, 100);
});

test('the "wrong only" switch is a real toggle button, labelled for unanswered too, and disabled with "全部答对" when nothing is wrong', () => {
  const off = renderReview(SESSION, false);
  const [filter] = byClass(off.tree, 'filter');
  assert.equal(filter.type, 'button');
  assert.equal(filter.props['aria-pressed'], false);
  assert.equal(filter.props.disabled, false);
  assert.match(textOf(filter), /只看错题（含未答）/);
  // 点一下就翻转开关状态（函数式更新，连点不丢）
  filter.props.onClick();
  assert.equal(typeof off.state.set, 'function');
  assert.equal(off.state.set(false), true);
  assert.equal(off.state.set(true), false);

  const on = renderReview(SESSION, true);
  assert.equal(byClass(on.tree, 'filter')[0].props['aria-pressed'], true);

  // 全对：禁用、写「全部答对」；就算状态里残留着「开」，也不算在筛
  const perfect = reviewCells([{ answer: 'a' }, { answer: 'b' }], ['a', 'b'], []);
  const done = renderReview(perfect, true);
  const [locked] = byClass(done.tree, 'filter');
  assert.equal(locked.props.disabled, true);
  assert.equal(locked.props['aria-pressed'], false);
  assert.match(textOf(locked), /全部答对/);
  assert.doesNotMatch(textOf(locked), /只看错题/);
  assert.deepEqual(perfect.map((_, i) => done.shown(i)), [true, true]);
  assert.equal(byClass(done.tree, 'listFiltered').length, 0);
});

test('with "wrong only" on, right answers fade out of reach on the strip and their cards are hidden, wrong and blank stay', () => {
  const off = renderReview(SESSION, false);
  assert.deepEqual(SESSION.map((_, i) => off.shown(i)), [true, true, true, true, true]);
  assert.equal(byClass(off.tree, 'list').length, 1);
  assert.equal(byClass(off.tree, 'listFiltered').length, 0);

  const on = renderReview(SESSION, true);
  // 卡片：只剩答错与未答
  assert.deepEqual(
    SESSION.map((_, i) => on.shown(i)),
    SESSION.map((c) => c.verdict !== 'right'),
  );
  // 题号条：答对的格子还在（看得见整卷分布），只是禁用
  const cells = byClass(on.tree, 'cell');
  assert.equal(cells.length, SESSION.length);
  assert.deepEqual(
    cells.map((c) => c.props.disabled),
    SESSION.map((c) => c.verdict === 'right'),
  );
  // 列表至少一屏高，页面不会短到滚动位置被夹回去
  assert.equal(byClass(on.tree, 'listFiltered').length, 1);
  assert.equal(cascade(fs.readFileSync(RESULT_CSS, 'utf8'), '.listFiltered')['min-height'], '100vh');
  assert.equal(textOf(byClass(on.tree, 'list')), 'CARDS', '卡片由调用方画，放在列表里');
});

test('clicking a cell scrolls to that card (instantly under reduced motion) and moves focus to its title', (t) => {
  t.after(restoreGlobals);
  for (const reduced of [false, true]) {
    const dom = installFakeDom({ reduced });
    const calls = [];
    const target = {
      focus: (opts) => calls.push(['focus', opts]),
      scrollIntoView: (opts) => calls.push(['scroll', opts]),
    };
    dom.doc.getElementById = (id) => (id === reviewAnchorId(3) ? target : null);
    const [, , , fourth] = byClass(renderReview(SESSION).tree, 'cell');
    fourth.props.onClick();
    assert.deepEqual(calls, [
      // 先给焦点、不让 focus 自己瞬移；再按偏好平滑或瞬时滚过去
      ['focus', { preventScroll: true }],
      ['scroll', { behavior: reduced ? 'auto' : 'smooth', block: 'start' }],
    ]);
    // 找不到卡（不该发生）就什么也不做，不抛错
    dom.doc.getElementById = () => null;
    fourth.props.onClick();
    restoreGlobals();
  }
});

test('ExamApp hands the session to reviewCells and renders the cards inside ReviewSection, hidden rather than unmounted', () => {
  const source = fs.readFileSync(EXAM_PATH, 'utf8');
  const exam = code(source);
  assert.match(exam, /import ReviewSection from '@\/components\/result\/ReviewSection';/);
  const imported = namedImports(source, '@/lib/resultReview');
  for (const name of ['reviewCells', 'reviewAnchorId', 'VERDICT_TEXT']) assert.ok(imported.has(name), `没有引入 ${name}`);

  // 本场的题、作答、标记三张表原样交给纯函数，组件里不另判对错
  const made = exam.match(/const (\w+) = reviewCells\(questions, answers, flagged\);/);
  assert.ok(made, '题号条的数据不是 reviewCells(questions, answers, flagged)');
  const cellsVar = made[1];
  const section = jsxOpening(source, '<ReviewSection');
  assert.ok(section, '成绩页里没有 ReviewSection');
  assert.equal(attrValue(section.attrs.get('cells')), cellsVar);
  // 结果条在成绩卡之后、成绩页之内
  assert.ok(source.indexOf('<ReviewSection') > jsxByClass(source, 'scoreCard')[0].end);
  assert.ok(source.indexOf('<ReviewSection') < source.indexOf('// ================= CBT 考试界面 ================='));

  // 回顾卡在 ReviewSection 的 children 里：按它给的 shown 收起（hidden，不卸载）
  const inside = jsxChildren(source, section);
  const param = code(inside).match(/^\{\((\w+)\) =>/)?.[1];
  assert.ok(param, 'ReviewSection 的 children 应当是 (shown) => 卡片');
  const [card] = jsxByClass(inside, 'reviewCard');
  assert.ok(card, '回顾卡不在 ReviewSection 里');
  assert.equal(attrValue(card.attrs.get('hidden')), `!${param}(i)`);
  // 卡片标题是跳转与焦点的落点：id 与题号条同一个来源、可被程序聚焦但不进 Tab 顺序
  const title = jsxOpening(inside, 'id={reviewAnchorId(i)}');
  assert.ok(title, '回顾卡标题没有 reviewAnchorId(i)');
  assert.equal(title.name, 'h3');
  assert.equal(attrValue(title.attrs.get('tabIndex')), '-1');
  assert.match(attrValue(title.attrs.get('className')), /resultStyles\.cardTitle/);
  // 标题的结局说明给读屏，与题号条同一个口径
  assert.match(code(jsxChildren(inside, title)), new RegExp(`VERDICT_TEXT\\[${cellsVar}\\[i\\]\\.verdict\\]`));
  // 只有一处画回顾卡
  assert.equal(jsxByClass(source, 'reviewCard').length, 1);
});

test('the strip reads at AA in light, dark and sepia, and tells the states apart without colour', () => {
  const css = fs.readFileSync(RESULT_CSS, 'utf8');
  const nav = cascade(css, '.nav');
  const cell = cascade(css, '.cell');
  const wrong = cascade(css, '.cellWrong');
  const blank = cascade(css, '.cellBlank');
  const figures = [];
  for (const theme of THEMES) {
    const vars = theme === 'light' ? {} : cascade(css, `:global(:root[data-theme='${theme}']) .nav`);
    const env = { ...themeTokens(theme), ...nav, ...vars };
    assert.ok(env['--rv-ok'] && env['--rv-bad'] && env['--rv-flag'], `${theme} 的结局色没读出来`);
    const navBg = rgb(nav.background, env);
    const kinds = [
      ['答对', cell, cascade(css, '.cellMark').color],
      ['答错', { ...cell, ...wrong }, cascade(css, '.cellWrong .cellMark').color],
      ['未答', { ...cell, ...blank }, cascade(css, '.cellBlank .cellMark').color],
    ];
    const check = (what, fg, bg, min) => {
      const ratio = contrast(rgb(fg, env), bg);
      figures.push(`${theme} ${what} ${ratio.toFixed(2)}`);
      assert.ok(ratio >= min, `${theme} 主题下${what}只有 ${ratio.toFixed(2)} : 1（要 ${min}）`);
    };
    for (const [kind, rule, mark] of kinds) {
      const bg = rgb(rule.background, env);
      check(`${kind}格的题号`, rule.color ?? cell.color, bg, 4.5);
      check(`${kind}格的符号`, mark, bg, 4.5);
      // 边框是图形：对格子外面（区块底色）3:1
      const borderColor = rule.border.split(/\s+/).slice(2).join(' ');
      check(`${kind}格的边框`, borderColor, navBg, 3);
      check(`${kind}格上的旗标`, cascade(css, '.cellFlag').background, bg, 3);
    }
    check('题数汇总', cascade(css, '.navTally').color, navBg, 4.5);
    check('开关的字', cascade(css, '.filter').color, rgb(cascade(css, '.filter').background, env), 4.5);
    check('开关的字（全对禁用）', cascade(css, '.filter:disabled').color, rgb(cascade(css, '.filter').background, env), 4.5);
    check('拨杆（关）', cascade(css, '.knob').background, navBg, 3);
    check('拨杆底（开）', cascade(css, ".filter[aria-pressed='true'] .switch").background, navBg, 3);
    check(
      '拨杆钮（开）',
      cascade(css, ".filter[aria-pressed='true'] .knob").background,
      rgb(cascade(css, ".filter[aria-pressed='true'] .switch").background, env),
      3,
    );
  }

  // 不只靠颜色：三种结局的边框（粗细 + 线型）两两不同；旗标是个形状
  const shapes = [cell, { ...cell, ...wrong }, { ...cell, ...blank }].map((r) => r.border.split(/\s+/).slice(0, 2).join(' '));
  assert.equal(new Set(shapes).size, 3, `边框分不开：${shapes.join(' / ')}`);
  assert.match(cascade(css, '.cellFlag')['clip-path'], /polygon\(/);
});

test('the strip wraps instead of scrolling sideways, and the switch knob snaps under reduced motion', () => {
  const css = fs.readFileSync(RESULT_CSS, 'utf8');
  const cells = cascade(css, '.cells');
  assert.equal(cells.display, 'grid');
  const track = cells['grid-template-columns'].match(/^repeat\(auto-fill, minmax\(([\d.]+)rem, 1fr\)\)$/);
  assert.ok(track, `题号格要自动换行铺满：${cells['grid-template-columns']}`);
  // 320px 宽（卡片内约 270px）也至少排得下 5 列
  assert.ok(Number(track[1]) * 16 * 5 + 4 * 0.4 * 16 <= 270, `格子最窄 ${track[1]}rem，320px 宽排不下 5 列`);
  assert.equal(cascade(css, '.cell').width, '100%');

  const rules = parseRules(stripComments(css));
  const knob = rules.find((r) => !r.inReduced && r.selector === '.knob');
  assert.match(knob.body, /transition: transform/);
  assert.ok(
    rules.some((r) => r.inReduced && /transition:\s*none/.test(r.body) && r.selector.split(',').some((sel) => overrides(r, sel, knob, '.knob'))),
    '减动效下拨杆还在滑',
  );
});
