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

/** [{ selector, body, start, inReduced }]；@media / @supports 里的规则照收，记下是否在减动效块里 */
export function parseRules(css) {
  const rules = [];
  const walk = (text, offset, inReduced) => {
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
          walk(body, offset + i + 1, inReduced || /prefers-reduced-motion\s*:\s*reduce/.test(selector));
        } else if (selector) {
          rules.push({ selector, body, start: offset + i - head.length, inReduced });
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
  walk(css, 0, false);
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

/** 选择器的主体：最后一个复合选择器里的类名（含伪元素的也只取类名）。`.a .b:hover` → 'b' */
export function subject(selector) {
  const last = unwrapGlobal(selector).trim().split(/\s+|>|\+|~/).filter(Boolean).pop() || '';
  return (last.match(/\.[\w-]+/g) || []).map((name) => name.slice(1)).join('|');
}

export function declarations(body) {
  return body
    .split(';')
    .map((one) => one.trim())
    .filter((one) => one.includes(':'))
    .map((one) => [one.slice(0, one.indexOf(':')).trim(), one.slice(one.indexOf(':') + 1).trim()]);
}
