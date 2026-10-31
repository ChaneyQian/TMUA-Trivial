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
} from '../src/lib/resultReview.ts';
import { TMUA_GRADE_TABLES, formatTmuaGrade } from '../src/lib/tmuaGrade.ts';
import { namedFn } from './helpers/source.mjs';

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

test('each review card gets its own anchor id', () => {
  assert.equal(reviewAnchorId(0), 'review-q-1');
  assert.equal(reviewAnchorId(19), 'review-q-20');
  const ids = Array.from({ length: 100 }, (_, i) => reviewAnchorId(i));
  assert.equal(new Set(ids).size, 100);
  for (const id of ids) assert.match(id, /^[a-z][\w-]*$/, `${id} 不是合法的 id`);
});
