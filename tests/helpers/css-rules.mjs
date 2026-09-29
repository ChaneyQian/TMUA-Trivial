// 把 CSS 拍平成规则列表的小工具（源码级守卫用）：规则写在第几个字符、在不在减动效块里、
// 选择器的特异性与「主体」。和 reduced-motion.test.mjs 里那套同一个口径，给光效开关的守卫复用。
import fs from 'node:fs';
import path from 'node:path';

export function cssFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return cssFiles(full);
    return entry.name.endsWith('.css') ? [full] : [];
  });
}

export const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/**
 * [{ selector, body, start, inReduced, at }]。@media / @supports 里的规则照收：inReduced 记是否在
 * 减动效块里，at 记最里层那个 @ 块的前导（顶格规则为 null），比如 '@media (min-width: 640px)'
 */
export function parseRules(css) {
  const rules = [];
  const walk = (text, offset, inReduced, at) => {
    let i = 0;
    let head = '';
    while (i < text.length) {
      const ch = text[i];
      if (ch === '{') {
        let depth = 1;
        let k = i + 1;
        while (k < text.length && depth > 0) {
          if (text[k] === '{') depth++;
          else if (text[k] === '}') depth--;
          k++;
        }
        const body = text.slice(i + 1, k - 1);
        const selector = head.trim();
        if (selector.startsWith('@')) {
          const reduced = inReduced || /prefers-reduced-motion\s*:\s*reduce/.test(selector);
          walk(body, offset + i + 1, reduced, selector.replace(/\s+/g, ' '));
        } else if (selector) {
          rules.push({ selector, body, start: offset + i - head.length, inReduced, at });
        }
        head = '';
        i = k;
        continue;
      }
      if (ch === '}') {
        head = '';
        i++;
        continue;
      }
      head += ch;
      i++;
    }
  };
  walk(css, 0, false, null);
  return rules;
}

/** CSS Modules 的 :global(…) 只是个壳，编译后不存在，不算特异性 */
export const unwrapGlobal = (selector) => selector.replace(/:global\(([^()]*)\)/g, '$1');

/** [id 数, 类/伪类/属性数]。元素选择器不计——模块化 CSS 里没有裸元素规则参与竞争 */
export function specificity(selector) {
  const plain = unwrapGlobal(selector);
  const ids = (plain.match(/#[\w-]+/g) || []).length;
  const classes =
    (plain.match(/\.[\w-]+/g) || []).length +
    (plain.match(/\[[^\]]*\]/g) || []).length +
    (plain.match(/(?<!:):(?!:)[\w-]+/g) || []).length;
  return [ids, classes];
}

export const cmpSpec = (a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);

/**
 * 选择器的主体：最后一个复合选择器里的类名，带上伪元素。
 * `.a .b:hover` → 'b'；`.a .b::after` → 'b::after'（单冒号的老写法 :before / :after 同论）。
 * 伪元素必须算进主体：`.b { animation: none }` 管不到 `.b::after` 身上的动画。
 */
export function subject(selector) {
  const last = unwrapGlobal(selector).trim().split(/\s+|>|\+|~/).filter(Boolean).pop() || '';
  const classes = (last.match(/\.[\w-]+/g) || []).map((name) => name.slice(1)).join('|');
  const pseudo = last.match(/::?(before|after|first-line|first-letter|marker|placeholder|backdrop|selection)\b/);
  return pseudo ? `${classes}::${pseudo[1]}` : classes;
}

const PSEUDO_ELEMENT = /^::?(before|after|first-line|first-letter|marker|placeholder|backdrop|selection)$/;

/** 一个复合选择器里的限定条件：元素名、类名、属性选择器、伪类（伪元素归主体管，不在这里；* 不算限定） */
function qualifiers(compound) {
  return new Set(
    [
      ...(compound.match(/^[a-z][\w-]*/i) || []),
      ...(compound.match(/\.[\w-]+/g) || []),
      ...(compound.match(/\[[^\]]*\]/g) || []),
      ...(compound.match(/(?<!:):(?!:)[\w-]+(?:\([^)]*\))?/g) || []),
    ].filter((q) => !PSEUDO_ELEMENT.test(q)),
  );
}

/**
 * 选择器拆成复合选择器链：[{ comb, quals }]，comb 是它与前一个之间的组合符
 * （' ' 后代、'>' 子、'+' 紧邻兄弟、'~' 兄弟；第一个为 null）。括号 / 方括号里的不拆
 */
export function compounds(selector) {
  const plain = unwrapGlobal(selector).trim();
  const out = [];
  let current = '';
  let depth = 0;
  let comb = null;
  for (const ch of plain) {
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    if (depth === 0 && /[\s>+~]/.test(ch)) {
      if (current) {
        out.push({ comb, text: current });
        current = '';
        comb = ' ';
      }
      if (!/\s/.test(ch)) comb = ch;
      continue;
    }
    current += ch;
  }
  if (current) out.push({ comb, text: current });
  return out.map(({ comb: c, text }) => ({ comb: c, quals: qualifiers(text) }));
}

/** 「光效关」开关本身的限定条件：写在 :root 上的 data-fx='off' */
export const FX_OFF_ROOT = [':root', "[data-fx='off']"];

/**
 * off 选中的元素是不是 sel 选中的超集（结构上）：off 的每个复合选择器都能按次序、按组合符对到 sel 的
 * 某个复合选择器上，且限定条件是它的子集。
 * - 主体（最后一个）对主体；
 * - 后代（空格）：对到 sel 里更靠前、且中间只隔着后代 / 子组合符的任何一个（祖先链上的哪一层都行）；
 * - 子（>）：只能对到紧挨着的前一个，且 sel 那里也得是 >——`.a > .b` 管不到 `.a .b` 里隔代的 .b；
 * - 紧邻兄弟（+）只认 +；兄弟（~）认 + 与 ~（紧邻的必定也是兄弟）。
 * allow 里的限定条件（开关本身，写在 :root 上）整段略过：:root 是一切元素的祖先，只要后面接的是后代组合符
 */
export function selects(offSel, sel, allow = []) {
  let off = compounds(offSel);
  const on = compounds(sel);
  // 开头只含开关条件的那一段（:root[data-fx='off']）略过；它后面必须是后代组合符
  while (off.length > 1 && off[0].quals.size && [...off[0].quals].every((q) => allow.includes(q))) {
    if (off[1].comb !== ' ') return false;
    off = [{ ...off[1], comb: null }, ...off.slice(2)];
  }
  const fits = (o, s) => [...o.quals].every((q) => s.quals.has(q));
  const match = (i, j) => {
    if (i === 0) return true;
    const c = off[i].comb;
    if (c === '>' || c === '+') return j > 0 && on[j].comb === c && fits(off[i - 1], on[j - 1]) && match(i - 1, j - 1);
    if (c === '~') return j > 0 && (on[j].comb === '+' || on[j].comb === '~') && fits(off[i - 1], on[j - 1]) && match(i - 1, j - 1);
    for (let k = j - 1; k >= 0; k--) {
      if (on[k + 1].comb !== ' ' && on[k + 1].comb !== '>') break;
      if (fits(off[i - 1], on[k]) && match(i - 1, k)) return true;
    }
    return false;
  };
  return on.length > 0 && off.length > 0 && fits(off[off.length - 1], on[on.length - 1]) && match(off.length - 1, on.length - 1);
}

/**
 * offSel（规则 off 里的一条选择器）是不是真把 sel（规则 rule 里的一条）选中的每个元素都压住了：
 * - 主体相同（伪元素单独算）；
 * - 它选中的是 sel 的超集（按复合选择器与组合符逐段对，见 selects）：`.slotFront .body` 只管前牌的正文，
 *   盖不住所有 `.body`；`.a > .b` 只管直接子元素，盖不住 `.a .b`；
 * - 层叠上赢：特异性更高，或相同且写在后面。
 */
export function overrides(off, offSel, rule, sel, { allow = [] } = {}) {
  if (subject(offSel) !== subject(sel)) return false;
  if (!selects(offSel, sel, allow)) return false;
  const order = cmpSpec(specificity(offSel), specificity(sel));
  return order > 0 || (order === 0 && off.start > rule.start);
}

export function declarations(body) {
  return body
    .split(';')
    .map((one) => one.trim())
    .filter((one) => one.includes(':'))
    .map((one) => [one.slice(0, one.indexOf(':')).trim(), one.slice(one.indexOf(':') + 1).trim()]);
}

const normalizeSelector = (selector) => selector.trim().replace(/\s+/g, ' ');

/** 按顶层空白切分属性值：'0 calc((100% - var(--w)) / 2)' → ['0', 'calc((100% - var(--w)) / 2)'] */
export function splitValue(value) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const ch of String(value).trim()) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (depth === 0 && /\s/.test(ch)) {
      if (current) parts.push(current);
      current = '';
    } else current += ch;
  }
  if (current) parts.push(current);
  return parts;
}

/** 简写拆成长写，后写的长写照常盖掉先写的简写（反之亦然）；拆不了的原样留着 */
function expand(prop, value, out) {
  if (prop === 'overflow') {
    const [x, y = x] = splitValue(value);
    out['overflow-x'] = x;
    out['overflow-y'] = y;
    return;
  }
  const box = /^(margin|padding)(?:-(inline|block))?$/.exec(prop);
  if (box) {
    const [base, axis] = [box[1], box[2]];
    const parts = splitValue(value);
    if (axis) {
      const [start, end = start] = parts;
      const [a, b] = axis === 'inline' ? ['left', 'right'] : ['top', 'bottom'];
      out[`${base}-${a}`] = start;
      out[`${base}-${b}`] = end;
    } else {
      const [top, right = top, bottom = top, left = right] = parts;
      Object.assign(out, { [`${base}-top`]: top, [`${base}-right`]: right, [`${base}-bottom`]: bottom, [`${base}-left`]: left });
    }
    return;
  }
  out[prop] = value;
}

/**
 * 某条精确选择器（按空白归一后逐字比对）在样式表里的层叠结果：同特异性下写在后面的赢。
 * 默认只看顶格（不在 @media / @supports 里）的规则；media 传一段媒体条件文字时只看那个块里的。
 * overflow / margin / padding（含 -inline / -block）的简写拆成长写。返回 { 属性: 值 }。
 */
export function cascade(css, selector, { media = null } = {}) {
  const want = normalizeSelector(selector);
  const at = media === null ? null : `@media ${media}`.replace(/\s+/g, ' ');
  const out = {};
  for (const rule of parseRules(stripComments(css))) {
    if (rule.at !== at) continue;
    if (!rule.selector.split(',').some((one) => normalizeSelector(one) === want)) continue;
    for (const [prop, value] of declarations(rule.body)) expand(prop, value, out);
  }
  return out;
}

/**
 * 长度表达式求值（单位 px）：env['%'] 是百分比的基准，env['--x'] 是 var(--x) 的值，
 * env.rem 是根字号（默认 16：站点没改 html 的字号），env.em 是元素自己的字号（不给则 em 求不出）。
 * 只认 px / rem / em / % / var() / calc() 与 + − × ÷、括号；auto 之类的关键字、缺了的变量都返回 NaN
 */
export function evalLength(value, env = {}) {
  let missing = false;
  const rem = env.rem ?? 16;
  const expr = String(value)
    .trim()
    .replace(/var\((--[\w-]+)\)/g, (_, name) => {
      if (!(name in env)) missing = true;
      return `(${env[name]})`;
    })
    .replace(/(\d*\.?\d+)%/g, (_, n) => {
      if (!('%' in env)) missing = true;
      return `(${n} / 100 * ${env['%']})`;
    })
    .replace(/(\d*\.?\d+)rem\b/g, (_, n) => `(${n} * ${rem})`)
    .replace(/(\d*\.?\d+)em\b/g, (_, n) => {
      if (!('em' in env)) missing = true;
      return `(${n} * ${env.em})`;
    })
    .replace(/(\d*\.?\d+)px\b/g, '$1')
    .replace(/\bcalc\(/g, '(');
  if (missing || !/^[\d.\s+\-*/()]+$/.test(expr)) return Number.NaN;
  try {
    return Number(Function(`"use strict"; return (${expr});`)());
  } catch {
    return Number.NaN;
  }
}

/** 只含 px 的长度：'48px'、'calc(40px + 8px)'、'calc(56px - 8px)'；认不出返回 NaN */
export const px = (value) => evalLength(value);

/** 时间求值成毫秒：'120ms'、'0.12s'、'var(--turn-ms)'（env 里给毫秒数）、'calc(var(--turn-ms) / 2)'；认不出返回 NaN */
export function timeMs(value, env = {}) {
  const expr = String(value)
    .trim()
    .replace(/(\d*\.?\d+)ms\b/g, '$1')
    .replace(/(\d*\.?\d+)s\b/g, '($1 * 1000)');
  return evalLength(expr, env);
}

/** 按顶层逗号切分（括号里的逗号不切）：transition 列表、cubic-bezier 的参数不会被拆开 */
function splitCommas(value) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const ch of String(value)) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else current += ch;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

const EASING = /^(?:ease|ease-in|ease-out|ease-in-out|linear|step-start|step-end)$|^(?:cubic-bezier|steps|linear)\(/;
const TIME = /^-?(?:\d*\.)?\d+m?s$|^(?:var|calc)\(/;

/**
 * transition 简写拆成一项一项：[{ property, duration, delay, easing }]，时间保持原文（交给 timeMs 求值）。
 * 写法不论：'opacity 120ms ease 120ms'、'opacity 0.12s 0.12s ease-out'、'transform var(--turn-ms) cubic-bezier(…)'
 */
export function parseTransition(value) {
  if (!value || value.trim() === 'none') return [];
  return splitCommas(value).map((item) => {
    const tokens = splitValue(item);
    const times = tokens.filter((t) => TIME.test(t));
    return {
      property: tokens.find((t) => !TIME.test(t) && !EASING.test(t)) ?? 'all',
      duration: times[0] ?? '0s',
      delay: times[1] ?? '0s',
      easing: tokens.find((t) => EASING.test(t)) ?? 'ease',
    };
  });
}

/**
 * 「光效关」守卫：凡跑无限循环的主体（伪元素单独算），其每一条动画声明（含只改 name / duration 的变体）
 * 都得被一条 :root[data-fx='off'] 规则用 animation: none（或 animation-name: none）真正压住——
 * 特异性更高，或相同且写在后面；「光效关」规则自己也不许带回无限循环。
 * 返回 { offenders: [文字说明…], covered: [主体…] }
 */
export function endlessOffenders(css) {
  const OFF = /\[data-fx='off'\]/;
  const rules = parseRules(stripComments(css));
  const offRules = rules.filter((rule) => !rule.inReduced && OFF.test(rule.selector));
  const plainRules = rules.filter((rule) => !rule.inReduced && !OFF.test(rule.selector));
  const offenders = [];
  const covered = [];

  const endless = new Set();
  for (const rule of plainRules) {
    for (const [prop, value] of declarations(rule.body)) {
      const loops =
        (prop === 'animation' && /\binfinite\b/.test(value)) ||
        (prop === 'animation-iteration-count' && value === 'infinite');
      if (loops) for (const selector of rule.selector.split(',')) endless.add(subject(selector));
    }
  }

  for (const rule of plainRules) {
    for (const [prop, value] of declarations(rule.body)) {
      if (prop !== 'animation' && !prop.startsWith('animation-')) continue;
      if (value === 'none' || value.startsWith('none')) continue;
      // 暂停（遮罩开着时的 animation-play-state: paused）不会让任何东西动起来，不需要关闭开关
      if (prop === 'animation-play-state' && value === 'paused') continue;
      for (const selector of rule.selector.split(',')) {
        const subj = subject(selector);
        if (!endless.has(subj)) continue;
        const won = offRules.some(
          (off) =>
            declarations(off.body).some(([p, v]) => (p === 'animation' || p === 'animation-name') && v === 'none') &&
            off.selector
              .split(',')
              .some((offSel) => OFF.test(offSel) && overrides(off, offSel, rule, selector, { allow: FX_OFF_ROOT })),
        );
        if (won) covered.push(subj);
        else offenders.push(`${selector.trim()} { ${prop}: ${value} }`);
      }
    }
  }

  for (const off of offRules) {
    for (const [prop, value] of declarations(off.body)) {
      if (prop.startsWith('animation') && /\binfinite\b/.test(value)) offenders.push(`${off.selector} 又带回了无限循环`);
    }
  }
  return { offenders, covered };
}
