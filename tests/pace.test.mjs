import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

// 限时节奏条（P11，Design §27）：Mock 答题页倒计时下面那一条细进度条 + 一句节奏提示。
// 这组测试盯四件事：
//   1. 口径（lib/pace.ts 纯函数）：领先秒数＝已作答 × 每题预算 − 已用秒数；|领先| < 60 正好，
//      ≥ 60 快 / 慢 N 分钟（向下取整）；剩余 ≤ 300 秒警示；不可信的输入一律不炸、不出 NaN
//   2. 动效：只有填充那 1s linear 的 scaleX 补间；减动效、光效关时真的没有（按层叠现算谁赢）；
//      全程无 animation——不闪、不脉冲、不循环
//   3. 对比度：三套主题下文字 ≥ 4.5 : 1、条与刻度 ≥ 3 : 1（顶栏是固定蓝，主题换了也得照算一遍）
//   4. 接线：只在 Mock 的答题页顶栏渲染、与倒计时同一条 5 分钟线、条 aria-hidden、不进 aria-live

import { PACE_EVEN_SECONDS, PACE_WARN_SECONDS, formatPace, pace } from '../src/lib/pace.ts';
import {
  FX_OFF_ROOT,
  cascade,
  cmpSpec,
  compounds,
  declarations,
  overrides,
  parseRules,
  parseTransition,
  px,
  specificity,
  stripComments,
  subject,
  timeMs,
  unwrapGlobal,
} from './helpers/css-rules.mjs';
import { attrValue, balanced, calls, code, jsxByClass, jsxChildren, jsxOpening } from './helpers/source.mjs';

const EXAM_PATH = 'src/components/exam/ExamApp.tsx';
const BAR_PATH = 'src/components/exam/PaceBar.tsx';
const BAR_CSS = fs.readFileSync('src/components/exam/PaceBar.module.css', 'utf8');
const EXAM_CSS = fs.readFileSync('src/components/exam/Exam.module.css', 'utf8');
// 先剥掉顶上的 @import：parseRules 不认无块的 @ 语句，会把它和紧跟的 :root 粘成一个 @ 块（见 tmua-grade.test）
const GLOBALS = fs.readFileSync('src/app/globals.css', 'utf8').replace(/@import[^;]*;/g, '');

/** TMUA 一卷：20 题 75 分钟，每题预算 225 秒。elapsed 秒过去、答了 answered 题 */
const at = (elapsed, answered, { total = 20, totalSec = 4500 } = {}) =>
  pace({ totalSec, secondsLeft: totalSec - elapsed, answered, total });

// ================= 1. 口径 =================

test('the even band is 60 s wide each way: 59 s is on pace, 60 and 61 tip over, ahead and behind alike', () => {
  assert.equal(PACE_EVEN_SECONDS, 60);
  // 答了 2 题＝挣到 450 秒
  assert.equal(at(450, 2).leadSec, 0);
  assert.equal(at(450, 2).band, 'even');

  for (const [elapsed, lead, band] of [
    [391, 59, 'even'],
    [390, 60, 'ahead'],
    [389, 61, 'ahead'],
    [509, -59, 'even'],
    [510, -60, 'behind'],
    [511, -61, 'behind'],
  ]) {
    const p = at(elapsed, 2);
    assert.equal(p.leadSec, lead, `用了 ${elapsed} 秒答了 2 题，领先应是 ${lead} 秒`);
    assert.equal(p.band, band, `领先 ${lead} 秒应是 ${band}`);
    assert.equal(p.minutes, band === 'even' ? 0 : 1);
  }

  // 一题没答、刚开考：正好；一分钟过去还一题没答：慢 1 分钟（口径如此，见 §27 取舍）
  assert.equal(at(0, 0).band, 'even');
  assert.equal(at(59, 0).band, 'even');
  assert.deepEqual([at(60, 0).band, at(60, 0).minutes], ['behind', 1]);
});

test('minutes are whole minutes rounded down, never rounded to nearest', () => {
  for (const [elapsed, answered, band, minutes] of [
    [450 - 119, 2, 'ahead', 1],
    [450 - 120, 2, 'ahead', 2],
    [450 - 179, 2, 'ahead', 2],
    [450 - 180, 2, 'ahead', 3],
    [450 + 119, 2, 'behind', 1],
    [450 + 120, 2, 'behind', 2],
    [450 + 179, 2, 'behind', 2],
    // 一题没答就过了 10 分 59 秒
    [659, 0, 'behind', 10],
  ]) {
    const p = at(elapsed, answered);
    assert.deepEqual([p.band, p.minutes], [band, minutes], `用 ${elapsed} 秒答 ${answered} 题`);
  }

  // 预算不是整秒（7 题 27 分钟，每题 231.43 秒）：领先带小数，照样向下取整
  const odd = at(574, 3, { total: 7, totalSec: 1620 });
  assert.ok(Math.abs(odd.leadSec - (3 * 1620) / 7 + 574) < 1e-9);
  assert.deepEqual([odd.band, odd.minutes], ['ahead', 2]);

  // 先乘后除：7 × (1980 / 7) 是 1979.999…，那样 120 秒的领先会被算成 1 分钟
  const exact = at(1860, 7, { total: 7, totalSec: 1980 });
  assert.equal(exact.leadSec, 120);
  assert.equal(exact.minutes, 2);
});

test('the warning starts at exactly 300 s left, the same line the countdown turns yellow on', () => {
  assert.equal(PACE_WARN_SECONDS, 300);
  assert.equal(at(4500 - 301, 10).warn, false);
  assert.equal(at(4500 - 300, 10).warn, true);
  assert.equal(at(4500 - 299, 10).warn, true);
  assert.equal(at(4500, 10).warn, true);

  // 总时长本身 ≤ 5 分钟：从第一秒起就是警示色（同一条规则，不另开例外）
  assert.equal(pace({ totalSec: 300, secondsLeft: 300, answered: 0, total: 2 }).warn, true);
  assert.equal(pace({ totalSec: 240, secondsLeft: 240, answered: 0, total: 2 }).warn, true);
  assert.equal(pace({ totalSec: 360, secondsLeft: 360, answered: 0, total: 2 }).warn, false);

  // warn 看的是没被总时长截过的剩余秒数：和倒计时那行 `secondsLeft <= 300` 逐秒一致
  assert.equal(pace({ totalSec: 200, secondsLeft: 400, answered: 0, total: 2 }).warn, false);
});

test('the bar fills with elapsed time and the pace mark sits at answered / total', () => {
  assert.equal(at(0, 0).elapsedRatio, 0);
  assert.equal(at(2250, 0).elapsedRatio, 0.5);
  assert.equal(at(4500, 0).elapsedRatio, 1);
  assert.equal(at(0, 0).paceRatio, 0);
  assert.equal(at(100, 5).paceRatio, 0.25);
  assert.equal(at(100, 20).paceRatio, 1);
  // 刻度就是「已作答 × 预算 / 总时长」
  assert.equal(at(100, 5).paceRatio, (5 * 225) / 4500);
});

test('unsafe inputs stay safe: no NaN, ratios inside 0–1, nothing to pace means on pace', () => {
  const sane = (p, label) => {
    for (const key of ['elapsedRatio', 'paceRatio', 'leadSec', 'minutes']) {
      assert.ok(Number.isFinite(p[key]), `${label}：${key} = ${p[key]}`);
    }
    for (const key of ['elapsedRatio', 'paceRatio']) {
      assert.ok(p[key] >= 0 && p[key] <= 1, `${label}：${key} = ${p[key]} 越出 0–1`);
    }
    assert.ok(['even', 'ahead', 'behind'].includes(p.band), label);
    assert.equal(typeof p.warn, 'boolean', label);
    assert.ok(Number.isInteger(p.minutes) && p.minutes >= 0, label);
  };

  // 0 题：没有预算可言
  const noQuestions = pace({ totalSec: 4500, secondsLeft: 1000, answered: 3, total: 0 });
  sane(noQuestions, 'total = 0');
  assert.deepEqual(
    [noQuestions.band, noQuestions.leadSec, noQuestions.paceRatio, noQuestions.minutes],
    ['even', 0, 0, 0],
  );
  assert.equal(noQuestions.elapsedRatio, 3500 / 4500);

  // 0 秒：没有进度可言；剩余 0 也就是最后 5 分钟
  const noTime = pace({ totalSec: 0, secondsLeft: 0, answered: 3, total: 20 });
  sane(noTime, 'totalSec = 0');
  assert.deepEqual([noTime.elapsedRatio, noTime.leadSec, noTime.band, noTime.warn], [0, 0, 'even', true]);

  // 剩余比总时长还多：已用不会是负的
  const early = pace({ totalSec: 600, secondsLeft: 900, answered: 0, total: 4 });
  sane(early, 'secondsLeft > totalSec');
  assert.deepEqual([early.elapsedRatio, early.leadSec, early.band], [0, 0, 'even']);

  // 剩余是负的：按 0 算，整条走满
  const late = pace({ totalSec: 600, secondsLeft: -30, answered: 4, total: 4 });
  sane(late, 'secondsLeft < 0');
  assert.deepEqual([late.elapsedRatio, late.leadSec, late.band, late.warn], [1, 0, 'even', true]);

  // 已作答夹在 0–题数
  assert.equal(pace({ totalSec: 600, secondsLeft: 600, answered: -2, total: 4 }).paceRatio, 0);
  assert.equal(pace({ totalSec: 600, secondsLeft: 600, answered: 9, total: 4 }).paceRatio, 1);
  assert.equal(pace({ totalSec: 600, secondsLeft: 600, answered: 9, total: 4 }).leadSec, 600);

  // 负的总时长、负的题数、NaN、Infinity 都不炸
  for (const input of [
    { totalSec: -600, secondsLeft: 300, answered: 1, total: 4 },
    { totalSec: 600, secondsLeft: 300, answered: 1, total: -4 },
    { totalSec: Number.NaN, secondsLeft: Number.NaN, answered: Number.NaN, total: Number.NaN },
    { totalSec: Infinity, secondsLeft: Infinity, answered: Infinity, total: Infinity },
    { totalSec: 600, secondsLeft: -Infinity, answered: 2.7, total: 4.9 },
  ]) {
    sane(pace(input), JSON.stringify(input));
  }
});

test('the line reads On pace / N min ahead / N min behind', () => {
  assert.equal(formatPace(at(450, 2)), 'On pace');
  assert.equal(formatPace(at(391, 2)), 'On pace');
  assert.equal(formatPace(at(390, 2)), '1 min ahead');
  assert.equal(formatPace(at(450 + 185, 2)), '3 min behind');
  assert.equal(formatPace({ band: 'ahead', minutes: 12 }), '12 min ahead');
});

// ================= 2. 动效 =================

/**
 * 一个 .fill 元素在某种处境下最终拿到的 transition：
 * 选出所有选得中它的规则（主体是 fill，祖先上的条件都在这处境里成立），按特异性、再按先后取胜者。
 * 处境：reduced（减动效）、fxOff（<html data-fx="off">）、warn（最后 5 分钟，.pace 上多一个 .warn）。
 * 别的 @media 块里的规则一律当作生效——那样「重新打开过渡」的规则躲不过去
 */
function finalTransition(css, { reduced = false, fxOff = false, warn = false } = {}) {
  const ancestors = new Set([':root', '.pace', '.track', '.rail']);
  if (fxOff) ancestors.add("[data-fx='off']");
  if (warn) ancestors.add('.warn');
  let winner = null;
  for (const rule of parseRules(stripComments(css))) {
    if (rule.inReduced && !reduced) continue;
    const decls = declarations(rule.body).filter(([prop]) => prop === 'transition' || prop.startsWith('transition-'));
    if (decls.length === 0) continue;
    for (const selector of rule.selector.split(',')) {
      if (subject(selector) !== 'fill') continue;
      const chain = compounds(selector);
      const last = chain[chain.length - 1];
      if (![...last.quals].every((q) => q === '.fill')) continue;
      if (!chain.slice(0, -1).every((c) => [...c.quals].every((q) => ancestors.has(q)))) continue;
      const spec = specificity(selector);
      if (!winner || cmpSpec(spec, winner.spec) > 0 || (cmpSpec(spec, winner.spec) === 0 && rule.start > winner.start)) {
        winner = { spec, start: rule.start, decls, selector };
      }
    }
  }
  if (!winner) return [];
  const shorthand = winner.decls.find(([prop]) => prop === 'transition');
  assert.ok(shorthand, `${winner.selector} 只写了 transition 的长写，这条守卫只认简写`);
  return parseTransition(shorthand[1]);
}

test('the fill moves by scaleX only, at most 1 s linear, and not at all under reduced motion or effects off', () => {
  // 正常：只补 transform，≤ 1s、linear
  for (const warn of [false, true]) {
    const items = finalTransition(BAR_CSS, { warn });
    assert.ok(items.length > 0, '填充应当有一条过渡（不然减动效的断言是空转）');
    for (const item of items) {
      assert.equal(item.property, 'transform', `填充只许补 transform，不许补 ${item.property}`);
      assert.ok(timeMs(item.duration) > 0 && timeMs(item.duration) <= 1000, `过渡 ${item.duration} 超过 1s`);
      assert.equal(timeMs(item.delay), 0);
      assert.equal(item.easing, 'linear');
    }
  }
  // 减动效 / 光效关 / 两者都开：每秒直接跳一格
  for (const env of [{ reduced: true }, { fxOff: true }, { reduced: true, fxOff: true }]) {
    for (const warn of [false, true]) {
      assert.deepEqual(finalTransition(BAR_CSS, { ...env, warn }), [], `${JSON.stringify({ ...env, warn })} 下填充还在补间`);
    }
  }

  // 这两条关闭规则也得过全仓的那两道闸的口径（与 reduced-motion / fx 测试同一套 overrides）
  const rules = parseRules(stripComments(BAR_CSS));
  const base = rules.find((r) => !r.inReduced && r.selector.trim() === '.fill');
  assert.ok(base, '基础的 .fill 规则不见了');
  const off = (pick, allow) =>
    rules.some(
      (r) =>
        pick(r) &&
        declarations(r.body).some(([p, v]) => p === 'transition' && v === 'none') &&
        r.selector.split(',').some((sel) => overrides(r, sel, base, '.fill', { allow })),
    );
  assert.ok(off((r) => r.inReduced), '减动效块里没有真正压住 .fill 的 transition: none');
  assert.ok(off((r) => !r.inReduced && /\[data-fx='off'\]/.test(r.selector), FX_OFF_ROOT), '光效关没有真正压住 .fill 的过渡');

  // 宽度从来不动：填充铺满整条、从左端缩放
  const fill = cascade(BAR_CSS, '.fill');
  assert.match(fill['transform-origin'] ?? '', /^left\b/);
  assert.equal(fill.width, undefined);
});

test('nothing on the pace bar blinks, pulses or loops, warning included', () => {
  const css = stripComments(BAR_CSS);
  assert.doesNotMatch(css, /@keyframes/);
  for (const rule of parseRules(css)) {
    for (const [prop] of declarations(rule.body)) {
      assert.ok(!prop.startsWith('animation'), `${rule.selector} 带了 ${prop}`);
    }
  }
  // 换警示色是一下子换过去：.warn 只换颜色变量，不带任何过渡
  for (const [prop] of Object.entries(cascade(BAR_CSS, '.warn'))) {
    assert.ok(prop.startsWith('--pace-'), `.warn 里多了 ${prop}`);
  }
  // 答题页不加光晕：没有阴影、滤镜、混合模式
  for (const rule of parseRules(css)) {
    for (const [prop] of declarations(rule.body)) {
      assert.ok(!['box-shadow', 'filter', 'backdrop-filter', 'mix-blend-mode', 'text-shadow'].includes(prop), `${rule.selector} 带了 ${prop}`);
    }
  }
  // 细条：3–4px
  const height = px(cascade(BAR_CSS, '.track').height);
  assert.ok(height >= 3 && height <= 4, `条高 ${height}px`);
});

// ================= 3. 对比度 =================

/** 颜色值 → [r, g, b, a]：#rgb / #rrggbb / rgb() / rgba()，var() 按 env 展开（同 diagnostic-contrast.test） */
function parseColor(value, env) {
  let v = String(value ?? '').trim();
  for (let i = 0; i < 5 && /var\(/.test(v); i++) {
    v = v.replace(/var\((--[\w-]+)(?:,\s*([^)]+))?\)/g, (_, name, fallback) => {
      assert.ok(name in env || fallback, `token ${name} 没定义`);
      return env[name] ?? fallback;
    });
  }
  if (v === 'white') return [255, 255, 255, 1];
  let m = v.match(/^#([0-9a-f]{3})$/i);
  if (m) return [...m[1]].map((c) => parseInt(c + c, 16)).concat(1);
  m = v.match(/^#([0-9a-f]{6})$/i);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)).concat(1);
  m = v.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/);
  if (m) {
    const alpha = m[4] === undefined ? 1 : m[4].endsWith('%') ? Number.parseFloat(m[4]) / 100 : Number(m[4]);
    return [Number(m[1]), Number(m[2]), Number(m[3]), alpha];
  }
  throw new Error(`认不出的颜色：${value} → ${v}`);
}
const over = ([r, g, b, a], [R, G, B]) => [r * a + R * (1 - a), g * a + G * (1 - a), b * a + B * (1 - a), 1];
function luminance([r, g, b]) {
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function contrast(fg, bg) {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

/** 三套主题的 token：浅色是 :root 本身，另两套在它上面覆盖 */
function tokens(theme) {
  const base = cascade(GLOBALS, ':root');
  return theme === 'light' ? base : { ...base, ...cascade(GLOBALS, `:root[data-theme="${theme}"]`) };
}

/** 某个类在某套主题下的层叠结果：顶格规则，再叠上写在 [data-theme='…'] 底下、主体就是它的规则 */
function themed(css, cls, theme) {
  const out = { ...cascade(css, `.${cls}`) };
  for (const rule of parseRules(stripComments(css))) {
    if (rule.at) continue;
    for (const selector of rule.selector.split(',')) {
      const m = unwrapGlobal(selector).match(/\[data-theme=['"]?(\w+)['"]?\]/);
      if (!m || m[1] !== theme || subject(selector) !== cls) continue;
      for (const [prop, value] of declarations(rule.body)) out[prop] = value;
    }
  }
  return out;
}

test('the contrast helper agrees with known WCAG figures', () => {
  assert.equal(contrast([255, 255, 255], [0, 0, 0]).toFixed(1), '21.0');
  assert.ok(contrast(parseColor('#767676', {}), [255, 255, 255]) >= 4.5);
  assert.ok(contrast(parseColor('#777777', {}), [255, 255, 255]) < 4.5);
  // globals.css 的浅色 token 真读得出来（没被 @import 粘掉）
  assert.ok(tokens('light')['--surface'], '浅色主题的 token 没读出来');
});

test('text reads at 4.5:1 and the bar at 3:1 on the CBT header, in light, dark and sepia, warning or not', () => {
  const timeWarn = cascade(EXAM_CSS, '.timeWarn').color;
  assert.ok(timeWarn, '倒计时的 timeWarn 颜色不见了');
  const figures = [];
  for (const theme of ['light', 'dark', 'sepia']) {
    const env = tokens(theme);
    const header = themed(EXAM_CSS, 'cbtHeader', theme);
    const headerBg = parseColor(header.background ?? header['background-color'], env);
    assert.equal(headerBg[3], 1, '顶栏底色得是不透明的');
    for (const warn of [false, true]) {
      const vars = { ...env, ...themed(BAR_CSS, 'pace', theme), ...(warn ? themed(BAR_CSS, 'warn', theme) : {}) };
      const color = (cls, prop = 'background') => {
        const rule = themed(BAR_CSS, cls, theme);
        return rule[prop] ?? rule[`${prop}-color`];
      };
      const rail = over(parseColor(color('rail'), vars), headerBg);
      const fill = over(parseColor(color('fill'), vars), rail);
      const mark = over(parseColor(color('mark'), vars), headerBg);
      const textValue = (warn ? cascade(BAR_CSS, '.warn .text').color : undefined) ?? color('text', 'color');
      const text = over(parseColor(textValue ?? header.color, vars), headerBg);
      const label = `${theme}${warn ? ' 警示' : ''}`;

      for (const [name, ratio, need] of [
        ['节奏文字 / 顶栏', contrast(text, headerBg), 4.5],
        ['填充 / 槽', contrast(fill, rail), 3],
        ['填充 / 顶栏', contrast(fill, headerBg), 3],
        ['刻度 / 顶栏', contrast(mark, headerBg), 3],
        ['刻度 / 槽', contrast(mark, rail), 3],
      ]) {
        figures.push(`${label} ${name} ${ratio.toFixed(2)}`);
        assert.ok(ratio >= need, `${label}：${name} 只有 ${ratio.toFixed(2)} : 1（要 ${need}）`);
      }

      // 警示色就是倒计时变黄的那个黄：文字与填充都是
      if (warn) {
        const yellow = parseColor(timeWarn, env);
        assert.deepEqual(text, yellow, `${label}：节奏文字不是 timeWarn 的颜色`);
        assert.deepEqual(fill, over(yellow, rail), `${label}：填充不是 timeWarn 的颜色`);
      } else {
        assert.notDeepEqual(fill, over(parseColor(timeWarn, env), rail), '平时的填充不该已经是警示色');
      }
    }
  }
  // 顶栏现在是固定蓝：三套主题的数一样。哪天顶栏随主题换色，这条会红，提醒把上面的值重看一遍
  const byTheme = (theme) => figures.filter((f) => f.startsWith(theme)).map((f) => f.split(' ').pop());
  assert.deepEqual(byTheme('dark'), byTheme('light'), figures.join(' / '));
  assert.deepEqual(byTheme('sepia'), byTheme('light'), figures.join(' / '));
});

// ================= 4. 接线 =================

/** 代码里由 `mode === 'mock' ? (…)` / `mode === 'mock' && (…)` / `mode === 'mock' && <X …/>` 守着的那几段 */
function mockGuarded(src) {
  const out = [];
  for (const m of src.matchAll(/mode === 'mock' (?:\?|&&) /g)) {
    const from = m.index + m[0].length;
    if (src[from] === '(') out.push(balanced(src, from));
    else if (src[from] === '<') {
      const tag = jsxOpening(src, src.slice(from, from + 2), from);
      out.push(tag.selfClosing ? src.slice(tag.start, tag.end) : src.slice(tag.start, tag.end) + jsxChildren(src, tag));
    }
  }
  return out;
}

test('the pace bar renders once, inside the Mock branch of the exam header, and never in practice', () => {
  const source = fs.readFileSync(EXAM_PATH, 'utf8');
  const exam = code(source);

  assert.match(exam, /import PaceBar from '(?:@\/components\/exam|\.)\/PaceBar';/, 'ExamApp 没有引入 PaceBar');
  const uses = [...exam.matchAll(/<PaceBar\b/g)];
  assert.equal(uses.length, 1, '答题页应当恰好挂一条 PaceBar');

  // 只在 Mock：它在某段由 mode === 'mock' 守着的 JSX 里（练习模式那一支是 Elapsed，碰不到它）
  const guarded = mockGuarded(exam);
  assert.ok(guarded.some((seg) => /<PaceBar\b/.test(seg)), 'PaceBar 不在 mode === \'mock\' 守着的那一支里');
  assert.ok(
    guarded.some((seg) => /<PaceBar\b/.test(seg) && /Time Remaining/.test(seg)),
    'PaceBar 应当和倒计时在同一支里',
  );

  // 而且就在答题页顶栏右侧、倒计时旁边
  const [right] = jsxByClass(source, 'cbtHeaderRight');
  assert.ok(right, '答题页顶栏右侧不见了');
  const inside = code(jsxChildren(source, right));
  assert.match(inside, /<PaceBar\b/, 'PaceBar 不在顶栏右侧');
  assert.ok(inside.indexOf('Time Remaining') < inside.indexOf('<PaceBar'), 'PaceBar 应当在倒计时下面');

  // 喂的数：总时长与开考定截止时刻同一个 minutes；剩余秒数就是倒计时那个；题数与作答从 answers 来
  assert.match(exam, /deadlineRef\.current = Date\.now\(\) \+ minutes \* 60 \* 1000/);
  const bar = jsxOpening(exam, '<PaceBar');
  assert.equal(attrValue(bar.attrs.get('totalSec')), 'minutes * 60');
  assert.equal(attrValue(bar.attrs.get('secondsLeft')), 'secondsLeft');
  assert.equal(attrValue(bar.attrs.get('answers')), 'answers');
  // 不喂内联对象 / 箭头函数：memo 才不会每次都被新引用打穿
  for (const [name, raw] of bar.attrs) {
    assert.doesNotMatch(String(raw), /=>|\{\{|\[/, `PaceBar 的 ${name} 每次渲染都是新引用`);
  }

  // 倒计时变黄与节奏条变黄是同一条线
  assert.match(exam, /import \{ PACE_WARN_SECONDS \} from '@\/lib\/pace';/);
  assert.match(exam, /secondsLeft <= PACE_WARN_SECONDS \? styles\.timeWarn : undefined/);
  assert.doesNotMatch(exam, /secondsLeft <= 300\b/);

  // 7.5+ Diagnostic 有自己的时钟，不在本次范围
  const runner = code(fs.readFileSync('src/components/diagnostic/DiagnosticRunner.tsx', 'utf8'));
  assert.doesNotMatch(runner, /PaceBar|lib\/pace/);
});

test('the bar is aria-hidden, the pace line is plain text, and nothing here is a live region', () => {
  const source = fs.readFileSync(BAR_PATH, 'utf8');
  const bar = code(source);

  const [track] = jsxByClass(source, 'track');
  assert.ok(track, '条不见了');
  assert.equal(attrValue(track.attrs.get('aria-hidden')), 'true', '条本身得 aria-hidden');
  // 填充与刻度都在条里面（跟着 aria-hidden 一起藏）
  const insideTrack = jsxChildren(source, track);
  for (const cls of ['rail', 'fill', 'mark']) assert.match(insideTrack, new RegExp(`styles\\.${cls}\\b`), `${cls} 不在条里`);

  // 那句话在条外面，读屏读得到；不进 aria-live / role=status|timer|alert（每秒都变，档位也会来回跳）
  const [text] = jsxByClass(source, 'text');
  assert.ok(text, '节奏那句不见了');
  assert.doesNotMatch(insideTrack, /styles\.text\b/);
  assert.equal(text.attrs.get('aria-hidden'), undefined);
  assert.match(code(jsxChildren(source, text)), /^\{formatPace\(\w+\)\}$/);
  assert.doesNotMatch(bar, /aria-live|role="(?:status|timer|alert|progressbar|log)"/);
  const examRight = jsxByClass(fs.readFileSync(EXAM_PATH, 'utf8'), 'cbtHeaderRight')[0];
  assert.equal(examRight.attrs.get('aria-live'), undefined, '顶栏右侧不该是 live 区');

  // 填充按 scaleX 画、不碰 width；口径只走 lib/pace 这一处
  const [fill] = jsxByClass(source, 'fill');
  assert.match(code(attrValue(fill.attrs.get('style'))), /transform: `scaleX\(\$\{\w+\.elapsedRatio\}\)`/);
  assert.doesNotMatch(bar, /\bwidth:/);
  assert.equal(calls(bar, 'pace').length, 1, '组件应当恰好问一次 pace()');
  assert.match(bar, /export default memo\(PaceBar\);/, 'PaceBar 没有 memo');
  // 警示态只由 pace() 的 warn 开关
  assert.match(bar, /\$\{\w+\.warn \? styles\.warn : ''\}/);
});
