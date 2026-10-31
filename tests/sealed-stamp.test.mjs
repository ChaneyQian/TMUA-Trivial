import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

// 05 密卷的封存态（Design §25，用户 2026-10-31：「密卷改成封 图标（期待明年再见）」）：
// 本期窗口一过，卡面压一枚朱红「封」字印章，徽章 / 副文 / 提示行改成「封存 + 期待明年再见」。
// 守的几件事：只有 ended 才盖章（before / open / 首帧不知道「现在」都不盖）、印章是装饰（aria-hidden）而那句话读屏念得到、
// 中英文案、盖章动效只放一次且在减动效 / 光效关下关掉（按层叠语义查，不按字面）、三套主题的对比度。

import { DICT } from '../src/lib/i18n.ts';
import { SEALED_STAMP_GLYPH, SEALED_WINDOW, sealedPhase } from '../src/lib/sealed.ts';
import { cascade, declarations, FX_OFF_ROOT, overrides, parseRules, splitValue, stripComments, subject, timeMs } from './helpers/css-rules.mjs';
import { attrValue, code, fnBody, jsxByClass, jsxChildren, jsxOpening } from './helpers/source.mjs';

const EXAM = 'src/components/exam/ExamApp.tsx';
const DECK = 'src/components/deck/CardDeck.tsx';
const DECK_CSS = 'src/components/deck/Deck.module.css';
const GATE = 'src/components/sealed/SealedGate.tsx';
const GLOBALS = 'src/app/globals.css';
const read = (file) => fs.readFileSync(file, 'utf8');
const at = (iso) => Date.parse(iso);

/** ExamApp 递给 CardDeck 的 stamps 表达式，按给定的 phase 求值（表达式里用到别的变量就会 ReferenceError，等于钉死「只看 phase」） */
function stampsFor(phase, lang = 'zh') {
  const deck = jsxOpening(code(read(EXAM)), '<CardDeck');
  assert.ok(deck, '找不到 <CardDeck');
  const expr = attrValue(deck.attrs.get('stamps'));
  assert.ok(expr, 'CardDeck 没有接 stamps');
  return new Function('sealedPhaseNow', 't', 'SEALED_STAMP_GLYPH', `return (${expr});`)(phase, DICT[lang], SEALED_STAMP_GLYPH);
}

test('the seal goes on the sealed card only once the round has ended, and on no other card', () => {
  assert.equal(SEALED_STAMP_GLYPH, '封');
  // 首帧（还不知道「现在」）、开门前、开着（解没解锁都一样）：不盖章
  for (const phase of [null, 'before', 'open']) assert.equal(stampsFor(phase), undefined, `${phase} 不该有印章`);
  // 结束了：只盖在 05 上，印面是「封」，读屏那句取字典
  for (const lang of ['zh', 'en']) {
    assert.deepEqual(stampsFor('ended', lang), { sealed: { glyph: '封', label: DICT[lang].sealed.stampLabel } });
  }

  // 拿真实时刻过一遍：窗口的最后一毫秒还没有章，下一毫秒就有（跟着 sealedPhase 走，不另起一套时间判断）
  const until = at(SEALED_WINDOW.until);
  for (const [now, stamped] of [
    [at('2026-10-07T12:00:00+08:00'), false],
    [at('2026-10-20T12:00:00+08:00'), false],
    [until + 999, false],
    [until + 1000, true],
    [at('2027-01-01T00:00:00+08:00'), true],
  ]) {
    assert.equal(stampsFor(sealedPhase(now)) !== undefined, stamped, new Date(now).toISOString());
  }

  // CardDeck 只在拿到这张卡的印章时才画：别的卡 DOM 里压根没有这个节点
  const deck = code(read(DECK));
  const decl = deck.match(/const (\w+) = stamps\?\.\[zone\.id\];/);
  assert.ok(decl, '找不到按卡取印章的那一句');
  const stamp = decl[1];
  const [tag] = jsxByClass(deck, 'stamp');
  assert.ok(tag, '找不到印章节点');
  assert.match(deck.slice(Math.max(0, tag.start - 40), tag.start), new RegExp(`\\{${stamp} && \\($`), '印章要由这张卡的 stamp 开关');
  assert.match(jsxChildren(deck, tag), new RegExp(`\\{${stamp}\\.glyph\\}`), '印面字取 stamp.glyph');
  // 徽章、摘要行的附加样式也只挂在带印章的卡上（不带的卡 className 一字不差）
  for (const cls of ['badgeStamped', 'quickSummaryWrap']) {
    assert.match(deck, new RegExp(`\\$\\{ ?${stamp} \\? \` \\$\\{styles\\.${cls}\\}\` : '' ?\\}`), `${cls} 要只挂在带印章的卡上`);
  }
});

test('the seal is decoration only; what it means reaches screen readers through the card', () => {
  const deck = code(read(DECK));
  const [tag] = jsxByClass(deck, 'stamp');
  assert.equal(tag.attrs.get('aria-hidden'), '"true"', '印章要 aria-hidden');
  const stamp = deck.match(/const (\w+) = stamps\?\.\[zone\.id\];/)[1];

  // 后牌：命中层名字照旧（「05 密卷，转到前位」），那句话放在描述里
  const hit = jsxOpening(deck, 'className={styles.hit}');
  assert.equal(attrValue(hit.attrs.get('aria-description')), `${stamp} && !isFront ? ${stamp}.label : undefined`);
  // 前牌：命中层念的是 closed 那句原因——结束时就是 blockEnded，里面有「封存」与「明年再见」
  assert.match(attrValue(hit.attrs.get('aria-label')), /closed\?\.\[zone\.id\] \? closed\[zone\.id\]/);
  // 转到它时的播报（role=status 里的 srOnly）带上那句话
  const front = deck.match(/const (\w+) = stamps\?\.\[front\];/);
  assert.ok(front, '找不到前牌的印章');
  const [status] = jsxByClass(deck, 'srOnly');
  assert.match(jsxChildren(deck, status), new RegExp(`\\{${front[1]} && \` \\$\\{${front[1]}\\.label\\}\`\\}`));

  // ExamApp：结束时的原因就是 blockEnded（阻挡提示、前牌命中层、快速开始摘要共用）
  const exam = code(read(EXAM));
  assert.match(exam, /if \(id === 'sealed' && sealedPhaseNow === 'ended'\) return t\.sealed\.blockEnded;/);
  // 页面挂着跨过关门那一刻、配置页上的密码面板就地换成的也是这句
  assert.match(code(read(GATE)), /phase === 'before' \? t\.sealed\.blockNotYet : t\.sealed\.blockEnded/);
});

test('both languages say sealed for this year and see you next year', () => {
  const zh = DICT.zh;
  assert.equal(zh.cardBadge.ended, '已封存');
  assert.equal(zh.sealed.subEnded, '本期已封存 · 期待明年再见');
  assert.equal(zh.sealed.blockEnded, '密卷本期已封存，期待明年再见');
  assert.equal(zh.sealed.stampLabel, '已封存，期待明年再见');
  const en = DICT.en;
  assert.equal(en.cardBadge.ended, 'Sealed');
  assert.equal(en.sealed.subEnded, 'Sealed for this year · See you next year');
  assert.equal(en.sealed.blockEnded, 'The Sealed Papers are closed for this year — see you next year');
  assert.equal(en.sealed.stampLabel, 'Sealed for this year — see you next year');

  // 两层意思都在：封存（closed / sealed）+ 期待明年再见；阻挡那句要带卡名（前牌命中层只念它）
  for (const text of [zh.sealed.subEnded, zh.sealed.blockEnded, zh.sealed.stampLabel]) {
    assert.match(text, /封存/);
    assert.match(text, /期待明年再见/);
  }
  for (const text of [en.sealed.subEnded, en.sealed.blockEnded, en.sealed.stampLabel]) {
    assert.match(text, /sealed|closed/i);
    assert.match(text, /see you next year/i);
  }
  assert.match(zh.sealed.blockEnded, new RegExp(zh.zone.title.sealed));
  assert.match(en.sealed.blockEnded, new RegExp(en.zone.title.sealed));
  // 开门前的文案不受影响
  assert.equal(zh.sealed.blockNotYet, '密卷即将开放');
  assert.equal(en.sealed.blockNotYet, 'Sealed Papers opens soon');
});

/** 印章相关的样式主体 */
const STAMP_SUBJECTS = /^(stamp|stampPress|stampGlyph|badgeStamped|quickSummaryWrap)(::\w+)?$/;

test('the stamp is pressed once, briefly, on the compositor, and stays still under reduced motion or with effects off', () => {
  const css = stripComments(read(DECK_CSS));
  const rules = parseRules(css);
  const OFF = /\[data-fx='off'\]/;

  const animated = [];
  for (const rule of rules) {
    if (rule.inReduced || OFF.test(rule.selector) || (rule.at ?? '').startsWith('@keyframes')) continue;
    for (const [prop, value] of declarations(rule.body)) {
      if (!prop.startsWith('animation') && !prop.startsWith('transition')) continue;
      if (value === 'none' || value.startsWith('none')) continue;
      for (const selector of rule.selector.split(',')) {
        if (STAMP_SUBJECTS.test(subject(selector))) animated.push({ rule, selector, prop, value });
      }
    }
  }
  assert.ok(animated.length > 0, '盖章动效不见了');

  for (const { rule, selector, prop, value } of animated) {
    // 只用动画、不用过渡；一次、≤ 400ms（连延时）
    assert.equal(prop, 'animation', `${selector} 用了 ${prop}`);
    assert.doesNotMatch(value, /\binfinite\b/, '盖章只放一次');
    const tokens = splitValue(value);
    const times = tokens.filter((token) => /^(?:\d*\.)?\d+m?s$/.test(token)).map((token) => timeMs(token));
    assert.ok(times.length >= 1);
    assert.ok(times.reduce((a, b) => a + b, 0) <= 400, `${selector} 一共 ${times.join(' + ')}ms，超过 400ms`);
    const count = tokens.find((token) => /^\d+$/.test(token));
    assert.ok(count === undefined || count === '1', '只放一次');

    // 关键帧只动 transform / opacity：从大一圈、透明压下来，落到原大
    const name = tokens.find((token) => rules.some((r) => r.at === `@keyframes ${token}`));
    assert.ok(name, `${value} 找不到关键帧`);
    const frames = rules.filter((r) => r.at === `@keyframes ${name}`);
    for (const frame of frames) {
      for (const [p] of declarations(frame.body)) assert.ok(p === 'transform' || p === 'opacity', `关键帧动了 ${p}`);
    }
    const from = Object.fromEntries(declarations(frames.find((f) => f.selector === 'from' || f.selector === '0%').body));
    const to = Object.fromEntries(declarations(frames.find((f) => f.selector === 'to' || f.selector === '100%').body));
    assert.equal(from.opacity, '0');
    assert.match(from.transform, /scale\(1\.2\)/);
    assert.equal(to.opacity, '1');
    assert.match(to.transform, /scale\(1\)/);

    // 减动效：降级块里有一条真盖得住它的 animation: none（选中的是超集、层叠上赢）
    const reduced = rules.some(
      (off) =>
        off.inReduced &&
        declarations(off.body).some(([p, v]) => p === 'animation' && v === 'none') &&
        off.selector.split(',').some((offSel) => overrides(off, offSel, rule, selector)),
    );
    assert.ok(reduced, `${selector} 在 prefers-reduced-motion 下没被真正关掉`);
    // 光效关：一条 :root[data-fx='off'] 规则同样真盖得住
    const fxOff = rules.some(
      (off) =>
        !off.inReduced &&
        OFF.test(off.selector) &&
        declarations(off.body).some(([p, v]) => (p === 'animation' || p === 'animation-name') && v === 'none') &&
        off.selector.split(',').some((offSel) => OFF.test(offSel) && overrides(off, offSel, rule, selector, { allow: FX_OFF_ROOT })),
    );
    assert.ok(fxOff, `${selector} 在光效关时没被真正关掉`);
  }

  // 结束态是静态的样子：.stamp 本身带同一个旋转，动画摘掉时不跳
  assert.match(cascade(css, '.stamp').transform, /^rotate\(var\(--stamp-rot\)\)$/);

  // 组件侧：动效类只挂在前牌上、只挂到它放完一次为止；放过的记在模块级（deck 卸载再挂载也不重盖）
  const deckSrc = read(DECK);
  const deck = code(deckSrc);
  const [tag] = jsxByClass(deck, 'stamp');
  assert.match(attrValue(tag.attrs.get('className')), /isFront && !pressedStamps\.has\(zone\.id\) \? styles\.stampPress : ''/);
  assert.match(fnBody(attrValue(tag.attrs.get('onAnimationEnd'))), /pressedStamps\.add\(zone\.id\)/);
  const declared = deck.indexOf('const pressedStamps = new Set');
  assert.ok(declared >= 0 && declared < deck.indexOf('export default function CardDeck'), 'pressedStamps 要在组件外（模块级）');
});

// ---- 对比度（WCAG 2）----

const luminance = (c) => {
  const [r, g, b] = c.map((v) => (v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test('the stamp and the words beside it read clearly in light, dark and sepia', () => {
  const css = stripComments(read(DECK_CSS));
  // 先剥掉 globals.css 顶上的 @import：parseRules 不认无块的 @ 语句，会把它和紧跟的 :root 粘成一个 @ 块（§24 的坑）
  const globals = read(GLOBALS).replace(/@import[^;]*;/g, '');
  const base = cascade(globals, ':root');
  assert.ok(base['--surface'] && base['--text-muted'], '浅色主题的 token 没读出来');
  const themeTokens = (theme) => (theme === 'light' ? base : { ...base, ...cascade(globals, `:root[data-theme="${theme}"]`) });
  /** 某个主体在某套主题下的层叠结果（主题覆盖写在 :global([data-theme='…']) 前缀下） */
  const ruleIn = (selector, theme) => ({
    ...cascade(css, selector),
    ...(theme === 'light' ? {} : cascade(css, `:global([data-theme='${theme}']) ${selector}`)),
  });
  /** var() 一层层解到 #rrggbb；只认 #rrggbb 与 var()，印章与正文这几条只用它们 */
  const rgb = (value, env) => {
    let v = String(value).trim();
    for (let i = 0; i < 5 && /^var\(/.test(v); i++) v = String(env[v.match(/^var\((--[\w-]+)\)$/)?.[1]] ?? v).trim();
    const m = v.match(/^#([0-9a-f]{6})$/i);
    assert.ok(m, `认不出的颜色：${value} → ${v}`);
    return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
  };

  const ink = {};
  for (const theme of ['light', 'dark', 'sepia']) {
    const tokens = themeTokens(theme);
    const stamp = ruleIn('.stamp', theme);
    const env = { ...tokens, ...stamp };
    const paper = rgb(stamp.background ?? stamp['background-color'], env);
    // 印面字（没写 color 就继承 .stamp 的）与外框：图形对象 ≥ 3 : 1
    const glyph = rgb(cascade(css, '.stampGlyph').color ?? stamp.color, env);
    assert.ok(contrast(glyph, paper) >= 3, `${theme}：「封」字只有 ${contrast(glyph, paper).toFixed(2)} : 1`);
    const frame = rgb(splitValue(stamp.border).pop(), env);
    assert.ok(contrast(frame, paper) >= 3, `${theme}：印章外框只有 ${contrast(frame, paper).toFixed(2)} : 1`);
    ink[theme] = glyph;

    // 旁边的字：徽章「已封存」（小字，AA 4.5）与副文「本期已封存 · 期待明年再见」
    const badge = ruleIn('.badgeStamped', theme);
    const badgeEnv = { ...tokens, ...badge };
    const badgeRatio = contrast(rgb(badge.color, badgeEnv), rgb(badge.background ?? badge['background-color'], badgeEnv));
    assert.ok(badgeRatio >= 4.5, `${theme}：「已封存」徽章只有 ${badgeRatio.toFixed(2)} : 1`);
    const face = cascade(css, '.face');
    const sub = cascade(css, '.sub');
    const subRatio = contrast(rgb(sub.color, tokens), rgb(face.background ?? face['background-color'], tokens));
    assert.ok(subRatio >= 4.5, `${theme}：副文只有 ${subRatio.toFixed(2)} : 1`);
  }

  // 朱红：红通道为主；深色主题上提亮一档（比浅色那枚亮）
  for (const [theme, [r, g, b]] of Object.entries(ink)) assert.ok(r > g && r > b, `${theme} 的印泥不是红色`);
  assert.ok(luminance(ink.dark) > luminance(ink.light), '深色主题的朱红要比浅色的亮');

  // 印面字体：中文衬线栈，缺字体时落到通用 serif
  const family = cascade(css, '.stampGlyph')['font-family'];
  assert.match(family, /Noto Serif SC/);
  assert.match(family, /SimSun/);
  assert.match(family, /,\s*serif$/);
});
