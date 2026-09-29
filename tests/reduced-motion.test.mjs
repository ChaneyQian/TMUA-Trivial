import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import { cssFiles, declarations, overrides, parseRules, stripComments, subject } from './helpers/css-rules.mjs';

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

// 解析 / 特异性 / 主体（含伪元素）与光效开关的守卫共用 tests/helpers/css-rules.mjs 一套口径。
// 主体带上伪元素：.card { transition: none } 管不到 .card::after 的补间，得单列

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
        if (!subject(selector)) continue;
        // 降级规则得选中这条动效规则选中的全部元素（超集），并在层叠上赢它
        const won = reduced.some(
          (off) =>
            declarations(off.body).some(([p, v]) => p === family && v === 'none') &&
            off.selector.split(',').some((offSel) => overrides(off, offSel, rule, selector)),
        );
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

/** 这份 CSS 在减动效块之外有没有开过动效（口径与 uncoveredMotion 相同） */
function declaresMotion(css) {
  return parseRules(stripComments(css)).some(
    (rule) =>
      !rule.inReduced &&
      declarations(rule.body).some(([prop, value]) => {
        if (value === 'none' || value.startsWith('none')) return false;
        if (prop === 'animation' || prop.startsWith('animation-')) return true;
        return (prop === 'transition' || prop.startsWith('transition-')) && MOTION.test(value);
      }),
  );
}

test('a stylesheet that moves at all must carry a reduced-motion block', () => {
  // uncoveredMotion 拿「降级块里的规则」去比对，一条降级规则都没有的文件它直接放行——
  // 于是新写一个带动效的 CSS Module、忘了写降级块，上一条测试照样全绿。
  // 这里把那道口子堵上：动了就必须有块，块里盖没盖住再交给上一条逐条查
  const offenders = cssFiles(SRC)
    .filter((file) => declaresMotion(fs.readFileSync(file, 'utf8')))
    .filter((file) => !parseRules(stripComments(fs.readFileSync(file, 'utf8'))).some((rule) => rule.inReduced))
    .map((file) => path.relative(SRC, file));
  assert.deepEqual(offenders, [], `这些样式表开了动效却没有 prefers-reduced-motion 降级块：${offenders.join(', ')}`);

  // 新加的模块确实在这道闸的扫描范围里（按目录递归扫，不靠白名单）
  const scanned = cssFiles(SRC).map((file) => path.relative(SRC, file).replace(/\\/g, '/'));
  assert.ok(scanned.includes('components/ambient/Ambient.module.css'), '环境光的样式表没被扫到');
  assert.ok(declaresMotion(fs.readFileSync('src/components/ambient/Ambient.module.css', 'utf8')));
  assert.equal(declaresMotion('.a { transition: color 200ms; }'), false, '配色补间不算动效');
  assert.equal(declaresMotion('.a { animation: spin 1s infinite; }'), true);
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

  // 伪元素单独算主体：基础类上的 transition: none 管不到它 ::after 的补间，降级块得单列
  const pseudo = `
    .dot::after { transition: opacity 200ms ease; }
    @media (prefers-reduced-motion: reduce) { .dot { transition: none; } }
  `;
  assert.equal(uncoveredMotion(pseudo).length, 1, '::after 的补间只关了基础类，必须判为没盖住');
  assert.deepEqual(
    uncoveredMotion(pseudo.replace('.dot { transition: none; }', '.dot, .dot::after { transition: none; }')),
    [],
  );

  // 降级规则得选中全部：加了限定的 `.slotFront .body` 只管前牌那块正文，特异性再高也盖不住
  // 所有 `.body`；只在深色主题下生效的那条同理
  const narrower = `
    .body { transition: opacity 120ms ease; }
    @media (prefers-reduced-motion: reduce) { .slotFront .body { transition: none; } }
  `;
  assert.equal(uncoveredMotion(narrower).length, 1, '只关了前牌的正文，侧牌的淡出照走');
  assert.deepEqual(uncoveredMotion(narrower.replace('.slotFront .body {', '.body, .slotFront .body {')), []);
  const themed = `
    .glare { transition: opacity 280ms ease; }
    @media (prefers-reduced-motion: reduce) { :global([data-theme='dark']) .glare { transition: none; } }
  `;
  assert.equal(uncoveredMotion(themed).length, 1, '只在深色主题下关，浅色与护眼照动');

  // 配色类补间不在本纪律内：它不产生位移，硬关掉只会让按钮 hover 变生硬
  const tint = `
    .btn { transition: border-color 200ms ease, background 200ms ease; }
    @media (prefers-reduced-motion: reduce) { .btn { animation: none; } }
  `;
  assert.deepEqual(uncoveredMotion(tint), []);
});
