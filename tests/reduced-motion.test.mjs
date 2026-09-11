import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

/**
 * 减动效纪律的源码级守卫。
 *
 * 原先各处只查「prefers-reduced-motion 块里有没有 animation: none」，
 * 而层叠是按特异性算的：`.libraryChargeReady .chargeLight`（0,2,0）会把裸
 * `.chargeLight`（0,1,0）的 animation: none 顶掉——降级块写了，灯照旧在呼吸。
 * 这类 bug 只能在源码层面查，运行时看不出来（没人在 CI 里开减动效跑浏览器）。
 *
 * 判据：每一条开了动效的规则，减动效块里都必须有一条关掉它的规则，且那条
 * 在层叠上真的赢得了——特异性更高，或特异性相同且写在后面。
 */

const SRC = 'src';

/** transition 只管「会动的」属性。配色、边框、filter 的补间不是 motion，不在本纪律内 */
const MOTION = /\b(transform|translate|rotate|scale|width|height|top|left|right|bottom|margin|padding|opacity|all)\b/;

function cssFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return cssFiles(full);
    return entry.name.endsWith('.css') ? [full] : [];
  });
}

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** 把 CSS 拍平成规则列表，记下每条规则在不在减动效块里、写在第几个字符 */
function parseRules(css) {
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

/** [id 数, 类/伪类/属性数]。元素选择器不计——本站的模块化 CSS 里没有裸元素规则参与竞争 */
function specificity(selector) {
  const ids = (selector.match(/#[\w-]+/g) || []).length;
  const classes =
    (selector.match(/\.[\w-]+/g) || []).length +
    (selector.match(/\[[^\]]*\]/g) || []).length +
    (selector.match(/(?<!:):(?!:)[\w-]+/g) || []).length;
  return [ids, classes];
}

const cmpSpec = (a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);

/** 选择器的主体：最后一个复合选择器里的类名。`.a .b:hover` → ['b'] */
function subject(selector) {
  const last = selector.trim().split(/\s+|>|\+|~/).filter(Boolean).pop() || '';
  return (last.match(/\.[\w-]+/g) || []).map((name) => name.slice(1)).join('|');
}

function declarations(body) {
  return body
    .split(';')
    .map((one) => one.trim())
    .filter((one) => one.includes(':'))
    .map((one) => [one.slice(0, one.indexOf(':')).trim(), one.slice(one.indexOf(':') + 1).trim()]);
}

/** 返回这份 CSS 里「降级块没真的盖住」的动效规则 */
function uncoveredMotion(css) {
  const rules = parseRules(stripComments(css));
  const reduced = rules.filter((rule) => rule.inReduced);
  if (reduced.length === 0) return [];

  const misses = [];
  for (const rule of rules) {
    if (rule.inReduced) continue;
    for (const [prop, value] of declarations(rule.body)) {
      const family =
        prop === 'animation' || prop.startsWith('animation-')
          ? 'animation'
          : prop === 'transition' || prop.startsWith('transition-')
            ? 'transition'
            : null;
      if (!family) continue;
      if (value === 'none' || value.startsWith('none')) continue;
      if (family === 'transition' && !MOTION.test(value)) continue;

      for (const selector of rule.selector.split(',')) {
        const subj = subject(selector);
        if (!subj) continue;
        const spec = specificity(selector);
        const won = reduced.some((off) => {
          if (!declarations(off.body).some(([p, v]) => p === family && v === 'none')) return false;
          return off.selector.split(',').some((offSel) => {
            if (subject(offSel) !== subj) return false;
            const order = cmpSpec(specificity(offSel), spec);
            return order > 0 || (order === 0 && off.start > rule.start);
          });
        });
        if (!won) misses.push(`${selector.trim()} { ${prop}: ${value} }`);
      }
    }
  }
  return misses;
}

test('every animated rule is really beaten by the reduced-motion block, not just named in it', () => {
  const offenders = [];
  for (const file of cssFiles(SRC)) {
    const misses = uncoveredMotion(fs.readFileSync(file, 'utf8'));
    for (const miss of misses) offenders.push(`${path.relative(SRC, file)}  ${miss}`);
  }
  assert.deepEqual(
    offenders,
    [],
    `这些动效在 prefers-reduced-motion 下没被真正关掉（降级块的特异性输了，或压根没列）：\n  ${offenders.join('\n  ')}`,
  );
});

test('the specificity guard has teeth', () => {
  // 反面：降级块只写基础类名，而动效开在「父类 + 基础类」上——正是充电条那盏灯的原形
  const weak = `
    .light { animation: breathe 2s infinite; }
    .ready .light { animation-name: breatheOpen; }
    @media (prefers-reduced-motion: reduce) {
      .light { animation: none; }
    }
  `;
  assert.equal(uncoveredMotion(weak).length, 1, '低特异性的降级必须被判为没盖住');

  // 正面：把高特异性那条也列进降级块就通过
  const strong = weak.replace('.light { animation: none; }', '.light, .ready .light { animation: none; }');
  assert.deepEqual(uncoveredMotion(strong), []);

  // transition 同理：只关 animation 不算数
  const move = `
    .fill { transition: width 520ms ease; }
    @media (prefers-reduced-motion: reduce) {
      .fill { animation: none; }
    }
  `;
  assert.equal(uncoveredMotion(move).length, 1, 'width 补间也是动效，animation: none 关不掉它');
  assert.deepEqual(
    uncoveredMotion(move.replace('.fill { animation: none; }', '.fill { animation: none; transition: none; }')),
    [],
  );

  // 配色类补间不在本纪律内：它不产生位移，硬关掉只会让按钮 hover 变生硬
  const tint = `
    .btn { transition: border-color 200ms ease, background 200ms ease; }
    @media (prefers-reduced-motion: reduce) { .btn { animation: none; } }
  `;
  assert.deepEqual(uncoveredMotion(tint), []);
});
