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
import { cascade } from './helpers/css-rules.mjs';
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
