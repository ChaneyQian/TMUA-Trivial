import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { cascade } from './helpers/css-rules.mjs';
import { jsxChildren, jsxOpening } from './helpers/source.mjs';

// Diagnostic 顶栏提示的对比度（P8-A5 顺带修）。
// 「单向作答 · 不可回看 · 全程不显示对错」与「含滚存 +Ns」原先用主题色 token（--text-muted / --accent）
// 压在 CBT 副栏的固定蓝 #647fb8 上，三套主题实测只有 1.10–1.52 : 1，几乎看不见。
// 副栏是固定色，白字在它上面也只有 3.99 : 1（小字不够 4.5），所以两条提示垫一块主顶栏同色的
// #3c5c9e 底、写白字：(1 + 0.05) / (0.1108 + 0.05) = 6.53 : 1。
//
// 这里按层叠求值：取提示最终的前景色与它实际压着的底色（自己有底就用自己的，没有就是副栏的），
// var() 按三套主题的 token 展开，按 WCAG 2 的相对亮度现算对比度

const RUNNER = 'src/components/diagnostic/DiagnosticRunner.tsx';
const DIAG_CSS = fs.readFileSync('src/components/diagnostic/Diagnostic.module.css', 'utf8');
const EXAM_CSS = fs.readFileSync('src/components/exam/Exam.module.css', 'utf8');
const GLOBALS = fs.readFileSync('src/app/globals.css', 'utf8');

/** 三套主题的 token：浅色是 :root 本身，另两套在它上面覆盖 */
function tokens(theme) {
  const base = cascade(GLOBALS, ':root');
  return theme === 'light' ? base : { ...base, ...cascade(GLOBALS, `:root[data-theme="${theme}"]`) };
}

/** 颜色值 → [r, g, b, a]：#rgb / #rrggbb / rgb() / rgba()（逗号或空格写法）/ white / black，var() 按 env 展开 */
function parseColor(value, env) {
  let v = String(value ?? '').trim();
  for (let i = 0; i < 5 && /var\(/.test(v); i++) {
    v = v.replace(/var\((--[\w-]+)\)/g, (_, name) => {
      assert.ok(name in env, `token ${name} 没定义`);
      return env[name];
    });
  }
  if (v === 'white') return [255, 255, 255, 1];
  if (v === 'black') return [0, 0, 0, 1];
  let m = v.match(/^#([0-9a-f]{3})$/i);
  if (m) return [...m[1]].map((c) => parseInt(c + c, 16)).concat(1);
  m = v.match(/^#([0-9a-f]{6})$/i);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)).concat(1);
  m = v.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/);
  if (m) {
    const alpha = m[4] === undefined ? 1 : m[4].endsWith('%') ? Number.parseFloat(m[4]) / 100 : Number(m[4]);
    return [Number(m[1]), Number(m[2]), Number(m[3]), alpha];
  }
  throw new Error(`认不出的颜色：${value}`);
}

/** 半透明的前景叠在不透明的底上 */
const over = ([r, g, b, a], [R, G, B]) => [r * a + R * (1 - a), g * a + G * (1 - a), b * a + B * (1 - a), 1];

/** WCAG 2 相对亮度与对比度 */
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

test('the contrast helper agrees with known WCAG figures', () => {
  assert.equal(contrast([255, 255, 255], [0, 0, 0]).toFixed(1), '21.0');
  assert.equal(contrast([255, 255, 255], [255, 255, 255]).toFixed(1), '1.0');
  // #767676 是白底上恰好过 4.5 的那档灰
  assert.ok(contrast(parseColor('#767676', {}), [255, 255, 255]) >= 4.5);
  assert.ok(contrast(parseColor('#777777', {}), [255, 255, 255]) < 4.5);
  assert.deepEqual(parseColor('rgb(0 0 0 / 50%)', {}), [0, 0, 0, 0.5]);
});

test('the diagnostic sub-bar hints read at 4.5:1 or better in every theme', () => {
  // 两条提示确实挂在 CBT 副栏里（底色从这里来）
  const runner = fs.readFileSync(RUNNER, 'utf8');
  const bar0 = jsxOpening(runner, 'className={examStyles.cbtSubbar}');
  assert.ok(bar0, 'Diagnostic 的副栏不见了');
  const inside = jsxChildren(runner, bar0);
  for (const cls of ['oneWay', 'bank']) assert.match(inside, new RegExp(`styles\\.${cls}\\b`), `${cls} 不在副栏里了`);

  const bar = cascade(EXAM_CSS, '.cbtSubbar');
  const figures = [];
  for (const theme of ['light', 'dark', 'sepia']) {
    const env = tokens(theme);
    const barBg = parseColor(bar.background ?? bar['background-color'], env);
    assert.equal(barBg[3], 1, '副栏底色得是不透明的');
    for (const cls of ['.oneWay', '.bank']) {
      const d = cascade(DIAG_CSS, cls);
      const ownBg = d.background ?? d['background-color'];
      const bg = ownBg ? over(parseColor(ownBg, env), barBg) : barBg;
      // 没写 color 就继承副栏的
      const fg = over(parseColor(d.color ?? bar.color, env), bg);
      const ratio = contrast(fg, bg);
      figures.push(`${theme} ${cls} ${ratio.toFixed(2)}`);
      assert.ok(ratio >= 4.5, `${theme} 主题下 ${cls} 只有 ${ratio.toFixed(2)} : 1`);
    }
  }
  // 副栏是固定色，提示也得是固定色——当初就是主题 token 压在固定蓝上才看不见：三套主题同一个数
  assert.equal(new Set(figures.map((f) => f.split(' ').pop())).size, 1, figures.join(' / '));

  // 垫底只加左右内边距：行高不变，副栏不因此长高
  for (const cls of ['.oneWay', '.bank']) {
    const d = cascade(DIAG_CSS, cls);
    for (const side of ['padding-top', 'padding-bottom']) {
      assert.ok(!d[side] || /^0(px|rem|em)?$/.test(d[side]), `${cls} 的 ${side} 是 ${d[side]}，副栏会长高`);
    }
  }
});
