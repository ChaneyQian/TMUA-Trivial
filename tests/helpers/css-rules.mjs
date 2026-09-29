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

/** 选择器里的限定条件：类名、属性选择器、伪类（伪元素归主体管，不在这里） */
function qualifiers(selector) {
  const plain = unwrapGlobal(selector);
  return new Set(
    [
      ...(plain.match(/\.[\w-]+/g) || []),
      ...(plain.match(/\[[^\]]*\]/g) || []),
      ...(plain.match(/(?<!:):(?!:)[\w-]+(?:\([^)]*\))?/g) || []),
    ].filter((q) => !PSEUDO_ELEMENT.test(q)),
  );
}

/** 「光效关」开关本身的限定条件：写在 :root 上的 data-fx='off' */
export const FX_OFF_ROOT = [':root', "[data-fx='off']"];

/**
 * offSel（规则 off 里的一条选择器）是不是真把 sel（规则 rule 里的一条）选中的每个元素都压住了：
 * - 主体相同（伪元素单独算）；
 * - 它用到的限定条件（类、属性、伪类）除开关本身（allow）之外全都出现在 sel 里——
 *   即它选中的是 sel 的超集：`.slotFront .body` 只管前牌的正文，盖不住所有 `.body`；
 * - 层叠上赢：特异性更高，或相同且写在后面。
 */
export function overrides(off, offSel, rule, sel, { allow = [] } = {}) {
  if (subject(offSel) !== subject(sel)) return false;
  const want = qualifiers(sel);
  for (const q of qualifiers(offSel)) if (!want.has(q) && !allow.includes(q)) return false;
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
 * env.rem 是根字号（默认 16：站点没改 html 的字号）。
 * 只认 px / rem / % / var() / calc() 与 + − × ÷、括号；auto 之类的关键字、缺了的变量都返回 NaN
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
