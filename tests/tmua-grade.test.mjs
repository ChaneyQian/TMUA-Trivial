import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

// 成绩页的「TMUA 估分」（lib/tmuaGrade.ts，Design §24）。
// 用户 2026-10-14：「补一下20题的分数规则（2025版）」——一卷 20 题、两卷合计 40 分，再按当年换算表折成 1.0–9.0。
// 这组测试盯三件事：
//   1. 换算表本身：41 档一档不缺、lo ≤ hi、随分数单调不降，且逐档与用户给的原表一字不差
//   2. 估分口径：20 题 ×2 折算、40 题直接查、其它题数不估
//   3. 成绩页的显示条件：全 TMUA 族、题数 20 / 40、不是「重练这些」场次——判断收在纯函数里，
//      ExamApp 只是把本场的题、对题数和来源标记交给它
// 另有一条样式守卫：估分那一块三套主题下文字对比度都过 AA，且不带动效（成绩页属答题流程，保持安静）

import {
  TMUA_GRADE_TABLES,
  TMUA_GRADE_YEAR,
  estimateTmuaGrade,
  formatTmuaGrade,
  isTmuaFamily,
  resultTmuaEstimate,
} from '../src/lib/tmuaGrade.ts';
import { cascade } from './helpers/css-rules.mjs';
import { readExamJson } from './helpers/exam-data.mjs';
import { calls, code, jsxByClass, jsxChildren, namedImports } from './helpers/source.mjs';

const EXAM_PATH = 'src/components/exam/ExamApp.tsx';
const EXAM_CSS = 'src/components/exam/Exam.module.css';
const GLOBALS = 'src/app/globals.css';

/**
 * 用户给的 2025 年换算表，原样抄进来（「原始分 成绩」，档与档之间用 | 隔开）。
 * 拿它和 lib 里的表互相对照：两边各抄一遍，抄错一处测试就红
 */
const USER_TABLE_2025 =
  '40 9.0 | 39 9.0 | 38 9.0 | 37 8.9 | 36 8.7 | 35 8.5–8.6 | 34 8.1–8.3 | 33 7.6–7.8 | 32 7.3–7.5 | ' +
  '31 6.9–7.1 | 30 6.6–6.7 | 29 6.3–6.4 | 28 6.0–6.1 | 27 5.9–6.0 | 26 5.8 | 25 5.6–5.7 | 24 5.4–5.5 | ' +
  '23 5.2–5.3 | 22 4.9–5.1 | 21 4.5–4.7 | 20 3.8–4.1 | 19 3.6–3.8 | 18 3.3–3.5 | 17 3.0–3.2 | 16 2.8–3.0 | ' +
  '15 2.5–2.7 | 14 2.2–2.4 | 13 2.0–2.2 | 12 2.0–2.2 | 11 1.8 | 10 1.7 | 9 1.5 | 8 1.4 | 7 1.3 | 6 1.2 | ' +
  '5 1.0 | 4 1.0 | 3 1.0 | 2 1.0 | 1 1.0 | 0 1.0';

const table = TMUA_GRADE_TABLES[2025];
const band = (raw) => {
  const found = table.find((b) => b.raw === raw);
  assert.ok(found, `2025 表里没有 ${raw} 分这一档`);
  return found;
};
const grade = (raw) => formatTmuaGrade(band(raw));
const byRaw = [...table].sort((a, b) => a.raw - b.raw);

/** 一场 n 道题，库名都是 db */
const session = (n, db = 'TMUA') => Array.from({ length: n }, () => ({ database: db }));

test('the current table is 2025, with exactly 41 bands: one for every raw mark 0–40', () => {
  assert.equal(TMUA_GRADE_YEAR, 2025);
  assert.ok(Array.isArray(table), '2025 年的表不见了');
  assert.equal(table.length, 41);
  assert.deepEqual(
    byRaw.map((b) => b.raw),
    Array.from({ length: 41 }, (_, i) => i),
    '0–40 每个原始分恰好一档',
  );
});

test('every band has lo ≤ hi, one decimal place, inside 1.0–9.0', () => {
  for (const { raw, lo, hi } of table) {
    assert.ok(lo <= hi, `${raw} 分：lo ${lo} > hi ${hi}`);
    for (const v of [lo, hi]) {
      assert.ok(v >= 1 && v <= 9, `${raw} 分：${v} 不在 1.0–9.0 里`);
      assert.equal(Number(v.toFixed(1)), v, `${raw} 分：${v} 不止一位小数`);
    }
  }
});

test('grades never go down as the raw mark goes up (lo and hi each)', () => {
  for (let i = 1; i < byRaw.length; i++) {
    const [prev, cur] = [byRaw[i - 1], byRaw[i]];
    assert.ok(cur.lo >= prev.lo, `lo 在 ${prev.raw}→${cur.raw} 分处倒退：${prev.lo} → ${cur.lo}`);
    assert.ok(cur.hi >= prev.hi, `hi 在 ${prev.raw}→${cur.raw} 分处倒退：${prev.hi} → ${cur.hi}`);
  }
});

test('the table reads back exactly as the user wrote it, band by band', () => {
  const ours = [...table]
    .sort((a, b) => b.raw - a.raw)
    .map((b) => `${b.raw} ${formatTmuaGrade(b)}`)
    .join(' | ');
  assert.equal(ours, USER_TABLE_2025);
});

test('spot checks against the original table', () => {
  assert.equal(grade(40), '9.0');
  assert.equal(grade(37), '8.9');
  assert.equal(grade(35), '8.5–8.6');
  assert.equal(grade(34), '8.1–8.3');
  assert.equal(grade(26), '5.8');
  assert.equal(grade(20), '3.8–4.1');
  // 13 与 12 同档
  assert.equal(grade(13), '2.0–2.2');
  assert.equal(grade(12), '2.0–2.2');
  assert.equal(grade(11), '1.8');
  for (const raw of [5, 4, 3, 2, 1, 0]) assert.equal(grade(raw), '1.0', `${raw} 分`);
  // 单值档存成 lo === hi，不是只存一个数
  assert.deepEqual({ lo: band(36).lo, hi: band(36).hi }, { lo: 8.7, hi: 8.7 });
  assert.deepEqual({ lo: band(34).lo, hi: band(34).hi }, { lo: 8.1, hi: 8.3 });
});

test('a 20-question session is doubled onto the 40-mark scale', () => {
  assert.deepEqual(estimateTmuaGrade(17, 20), { year: 2025, raw: 34, lo: 8.1, hi: 8.3, scaled: true });
  assert.deepEqual(estimateTmuaGrade(20, 20), { year: 2025, raw: 40, lo: 9.0, hi: 9.0, scaled: true });
  assert.deepEqual(estimateTmuaGrade(0, 20), { year: 2025, raw: 0, lo: 1.0, hi: 1.0, scaled: true });
  assert.equal(formatTmuaGrade(estimateTmuaGrade(17, 20)), '8.1–8.3');
  assert.equal(formatTmuaGrade(estimateTmuaGrade(20, 20)), '9.0');
  assert.equal(formatTmuaGrade(estimateTmuaGrade(0, 20)), '1.0');
  // 20 题只落在偶数分上：每一个都查得到
  for (let right = 0; right <= 20; right++) {
    const est = estimateTmuaGrade(right, 20);
    assert.equal(est?.raw, right * 2, `${right} 对`);
    assert.deepEqual({ lo: est.lo, hi: est.hi }, { lo: band(right * 2).lo, hi: band(right * 2).hi });
  }
});

test('a 40-question session is looked up directly', () => {
  assert.deepEqual(estimateTmuaGrade(34, 40), { year: 2025, raw: 34, lo: 8.1, hi: 8.3, scaled: false });
  assert.deepEqual(estimateTmuaGrade(37, 40), { year: 2025, raw: 37, lo: 8.9, hi: 8.9, scaled: false });
  assert.deepEqual(estimateTmuaGrade(13, 40), { year: 2025, raw: 13, lo: 2.0, hi: 2.2, scaled: false });
  for (let right = 0; right <= 40; right++) assert.equal(estimateTmuaGrade(right, 40)?.raw, right);
});

test('any other question count gets no estimate', () => {
  for (const total of [5, 10, 19, 21, 100, 0, 1, 39, 41]) {
    for (const right of [0, Math.min(total, 3), total]) {
      assert.equal(estimateTmuaGrade(right, total), null, `${right} / ${total}`);
    }
  }
});

test('impossible scores and unknown years get no estimate rather than a made-up one', () => {
  assert.equal(estimateTmuaGrade(21, 20), null);
  assert.equal(estimateTmuaGrade(-1, 20), null);
  assert.equal(estimateTmuaGrade(41, 40), null);
  assert.equal(estimateTmuaGrade(8.5, 20), null);
  assert.equal(estimateTmuaGrade(Number.NaN, 20), null);
  assert.equal(estimateTmuaGrade(17, 20, 2019), null, '没有这一年的表就不估');
  assert.deepEqual(estimateTmuaGrade(17, 20, 2025), estimateTmuaGrade(17, 20));
});

test('grades always print with one decimal place; ranges use an en dash', () => {
  assert.equal(formatTmuaGrade({ lo: 8.7, hi: 8.7 }), '8.7');
  assert.equal(formatTmuaGrade({ lo: 8.1, hi: 8.3 }), '8.1–8.3');
  assert.equal(formatTmuaGrade({ lo: 9, hi: 9 }), '9.0');
  assert.equal(formatTmuaGrade({ lo: 1, hi: 1 }), '1.0');
  assert.equal(formatTmuaGrade({ lo: 6, hi: 6.1 }), '6.0–6.1');
  assert.doesNotMatch(formatTmuaGrade({ lo: 8.1, hi: 8.3 }), /-/, '区间用 en dash，不用连字符');
});

test('only a session made entirely of TMUA / TMUA Mock questions counts as the TMUA family', () => {
  assert.equal(isTmuaFamily(session(20, 'TMUA')), true);
  assert.equal(isTmuaFamily(session(20, 'TMUA_MOCK')), true);
  // 混合场次逐题看：TMUA 与 Mock 混着也算
  assert.equal(isTmuaFamily([...session(10, 'TMUA'), ...session(10, 'TMUA_MOCK')]), true);
  // 混进一道别的库就不算
  for (const other of ['MAT', 'SMC', 'ECAA', 'AMC', 'DIAG75', 'GMAT', '']) {
    assert.equal(isTmuaFamily([...session(19, 'TMUA'), { database: other }]), false, `混进 ${other || '空库名'}`);
  }
  assert.equal(isTmuaFamily([]), false, '空场次不算');
});

test('the built question files really carry the library names the family check expects', () => {
  // 防库名漂移：题目 JSON 的 database 字段由 build-data 的 indexDatabase 写（TMUA Mock 落成 TMUA_MOCK）。
  // 哪天那边改了写法，这里先红，而不是成绩页上的估分悄悄消失
  const index = readExamJson('index.json', Array.isArray);
  for (const db of ['TMUA', 'TMUA_MOCK']) {
    const entry = index.find((e) => e.db === db);
    assert.ok(entry, `index 里没有 ${db} 的题`);
    const question = readExamJson(`q/${entry.qid}.json`, (q) => q && q.qid === entry.qid);
    assert.equal(question.database, db, `${db} 的题目 JSON 写的库名是 ${question.database}`);
    assert.equal(isTmuaFamily([question]), true, `${db} 的题没被认成 TMUA 族`);
  }
  for (const db of ['MAT', 'SMC', 'ECAA']) {
    const entry = index.find((e) => e.db === db);
    if (!entry) continue;
    const question = readExamJson(`q/${entry.qid}.json`, (q) => q && q.qid === entry.qid);
    assert.equal(isTmuaFamily([question]), false, `${db} 的题被认成了 TMUA 族`);
  }
});

test('the result page estimate: whole TMUA family, 20 or 40 questions, never a "retry these" session', () => {
  const right17 = { questions: session(20), right: 17 };
  assert.equal(formatTmuaGrade(resultTmuaEstimate({ ...right17, origin: null })), '8.1–8.3');
  assert.equal(formatTmuaGrade(resultTmuaEstimate({ questions: session(20, 'TMUA_MOCK'), right: 20, origin: null })), '9.0');
  assert.deepEqual(
    resultTmuaEstimate({ questions: session(40), right: 34, origin: null }),
    estimateTmuaGrade(34, 40),
  );
  // 重练的是错题，估分没有意义
  assert.equal(resultTmuaEstimate({ ...right17, origin: 'retry' }), null);
  // 规则只排除重练：复烤区另两条路照常估
  assert.notEqual(resultTmuaEstimate({ ...right17, origin: 'grill' }), null);
  assert.notEqual(resultTmuaEstimate({ ...right17, origin: 'topic' }), null);
  // 混进一道 MAT、题数不对，都不估
  assert.equal(resultTmuaEstimate({ questions: [...session(19), { database: 'MAT' }], right: 17, origin: null }), null);
  assert.equal(resultTmuaEstimate({ questions: session(19), right: 17, origin: null }), null);
  assert.equal(resultTmuaEstimate({ questions: session(10), right: 10, origin: null }), null);
});

test('ExamApp asks resultTmuaEstimate, hands it the session origin, and shows it inside the score card', () => {
  const source = fs.readFileSync(EXAM_PATH, 'utf8');
  const exam = code(source);

  const imported = namedImports(source, '@/lib/tmuaGrade');
  for (const name of ['resultTmuaEstimate', 'formatTmuaGrade']) {
    assert.ok(imported.has(name), `ExamApp 没有从 lib/tmuaGrade 引入 ${name}`);
  }

  // 显示条件只走纯函数这一处，不在组件里另起一套判断
  const asks = calls(exam, 'resultTmuaEstimate');
  assert.equal(asks.length, 1, '成绩页应当恰好问一次 resultTmuaEstimate');
  const args = asks[0].args;
  assert.match(args, /\bquestions\b/, '没把本场的题交给 resultTmuaEstimate');
  assert.match(args, /\bright\b/, '没把本场的对题数交给 resultTmuaEstimate');
  // 「重练这些」的排除靠来源标记：交出去的必须就是本场那一个
  assert.match(args, /\borigin: sessionOriginRef\.current\b/, '没把本场的来源标记交给 resultTmuaEstimate');
  // 组件里不另写库名判断（那是 isTmuaFamily 的事）
  assert.doesNotMatch(exam, /isTmuaFamily\(/);
  assert.doesNotMatch(exam, /database === 'TMUA/);

  // 估分那一行在成绩卡里，开关就是 resultTmuaEstimate 的结果本身，显示的也是它
  const assigned = exam.match(/const (\w+) = resultTmuaEstimate\(/);
  assert.ok(assigned, 'resultTmuaEstimate 的结果没有存成变量');
  const estimate = assigned[1];
  const [card] = jsxByClass(source, 'scoreCard');
  assert.ok(card, '成绩卡不见了');
  const inside = code(jsxChildren(source, card));
  assert.match(
    inside,
    new RegExp(`\\{${estimate} && \\(<div className=\\{styles\\.tmuaGrade\\}>`),
    '估分那一块不在成绩卡里，或者不是只由 resultTmuaEstimate 的结果开关',
  );
  assert.match(inside, new RegExp(`formatTmuaGrade\\(${estimate}\\)`), '显示的不是这一场的估分');

  // 7.5+ Diagnostic 是另一条流程：它的成绩页不接估分
  const diagResult = fs.readFileSync('src/components/diagnostic/DiagnosticResult.tsx', 'utf8');
  assert.doesNotMatch(diagResult, /tmuaGrade/);
});

test('the estimate reads at AA in light, dark and sepia, and never moves', () => {
  const css = fs.readFileSync(EXAM_CSS, 'utf8');
  // 先剥掉顶上的 @import 语句：parseRules 不认无块的 @ 语句，会把它和紧跟的 :root 粘成一个 @ 块，
  // 浅色那套 token 就整个读不出来
  const globals = fs.readFileSync(GLOBALS, 'utf8').replace(/@import[^;]*;/g, '');
  const base = cascade(globals, ':root');
  assert.ok(base['--surface-alt'] && base['--text-muted'], '浅色主题的 token 没读出来');
  const tokens = (theme) => (theme === 'light' ? base : { ...base, ...cascade(globals, `:root[data-theme="${theme}"]`) });
  /** 只认 #rrggbb 与 var()：估分这几条规则只用主题 token */
  const rgb = (value, env) => {
    const v = String(value).trim().replace(/^var\((--[\w-]+)\)$/, (_, name) => env[name] ?? name);
    const m = v.match(/^#([0-9a-f]{6})$/i);
    assert.ok(m, `认不出的颜色：${value} → ${v}`);
    return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
  };
  const luminance = (c) => {
    const [r, g, b] = c.map((v) => (v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a, b) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };

  const box = cascade(css, '.tmuaGrade');
  const value = cascade(css, '.tmuaGradeValue');
  const note = cascade(css, '.tmuaGradeNote');
  assert.ok(box.background ?? box['background-color'], '估分那一块该有自己的底色');
  for (const theme of ['light', 'dark', 'sepia']) {
    const env = tokens(theme);
    const bg = rgb(box.background ?? box['background-color'], env);
    // 没写 color 的继承容器的
    for (const [name, color] of [
      ['.tmuaGrade', box.color],
      ['.tmuaGradeValue', value.color ?? box.color],
      ['.tmuaGradeNote', note.color ?? box.color],
    ]) {
      const ratio = contrast(rgb(color, env), bg);
      assert.ok(ratio >= 4.5, `${theme} 主题下 ${name} 只有 ${ratio.toFixed(2)} : 1`);
    }
  }

  for (const rule of [box, value, note]) {
    for (const prop of ['animation', 'animation-name', 'transition', 'transition-property']) {
      assert.equal(rule[prop], undefined, `估分的样式里出现了 ${prop}`);
    }
  }
});
