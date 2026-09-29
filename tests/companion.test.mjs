import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { attrValue, balanced, code, effects, jsxOpening, namedImports } from './helpers/source.mjs';

const componentPath = 'src/components/companion/PixelCompanion.tsx';
const cssPath = 'src/components/companion/PixelCompanion.module.css';

test('the color scheme selects a packaged Codex pet rig in the bottom-right corner', () => {
  assert.equal(fs.existsSync(componentPath), true, 'missing PixelCompanion component');
  assert.equal(fs.existsSync(cssPath), true, 'missing PixelCompanion styles');
  assert.equal(
    fs.existsSync('public/pets/clawd-laptop/spritesheet.webp'),
    true,
    'missing Clawd Laptop spritesheet',
  );
  assert.equal(fs.existsSync('public/pets/clawd-laptop/pet.json'), true, 'missing pet metadata');
  assert.equal(fs.existsSync('public/pets/guga/spritesheet.webp'), true, 'missing Guga spritesheet');
  assert.equal(fs.existsSync('public/pets/guga/pet.json'), true, 'missing Guga metadata');
  assert.equal(fs.existsSync('public/pets/frieren/spritesheet.webp'), true, 'missing Frieren spritesheet');
  assert.equal(fs.existsSync('public/pets/frieren/pet.json'), true, 'missing Frieren metadata');

  const component = fs.readFileSync(componentPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');
  const page = fs.readFileSync('src/app/page.tsx', 'utf8');

  assert.match(page, /<PixelCompanion\s*\/>/);
  assert.match(component, /aria-label="和 Trivial 小助手互动"/);
  assert.match(component, /light:\s*'guga'/);
  assert.match(component, /dark:\s*'frieren'/);
  assert.match(component, /sepia:\s*'clawd-laptop'/);
  assert.match(component, /MutationObserver/);
  assert.match(component, /NEXT_PUBLIC_BASE_PATH/);
  assert.match(component, /clawd-laptop\/spritesheet\.webp/);
  assert.match(component, /guga\/spritesheet\.webp/);
  assert.match(component, /frieren\/spritesheet\.webp/);
  assert.match(component, /onClick=/);
  assert.match(component, /role="status"/);
  assert.match(component, /running-right/);
  assert.match(component, /running-left/);
  assert.match(component, /waving/);
  assert.match(component, /jumping/);
  assert.match(component, /failed/);
  assert.match(component, /waiting/);
  assert.match(component, /running/);
  assert.match(component, /review/);
  assert.match(component, /IDLE_DURATIONS/);
  assert.match(component, /mcq-test:pet-command/);
  assert.match(component, /\[data-pet-target="grade"\]/);
  assert.match(component, /requestAnimationFrame/);
  assert.match(component, /onPointerDown=/);
  assert.match(component, /onPointerMove=/);
  assert.match(component, /onPointerUp=/);
  assert.match(component, /onLostPointerCapture=/);
  assert.match(component, /window\.addEventListener\('pointerup'/);
  assert.match(css, /position:\s*fixed/);
  assert.match(css, /right:\s*max\(/);
  assert.match(css, /bottom:\s*max\(/);
  assert.match(css, /background-image:\s*var\(--pet-sheet\)/);
  assert.match(css, /image-rendering:\s*pixelated/);
  assert.match(css, /background-position/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test('practice grading drives the pet reaction and grade-button travel', () => {
  const exam = fs.readFileSync('src/components/exam/ExamApp.tsx', 'utf8');

  assert.match(exam, /data-pet-target="grade"/);
  assert.match(exam, /mcq-test:pet-command/);
  assert.match(exam, /state:\s*'failed'/);
  assert.match(exam, /state:\s*'review'/);
  assert.match(exam, /moveTo:\s*'grade'/);
});

test('with effects off the pet freezes its looping frames but still plays one-shot reactions', async () => {
  const { framePlan, settleHeld, shownFrame } = await import('../src/components/companion/framePlan.ts');

  // 正常：循环与一次性动作都按帧时长往下走
  assert.equal(framePlan(true, false, false), 'run');
  assert.equal(framePlan(false, false, false), 'run');
  // 光效关：循环冻住；一次性反馈（庆祝 / 跳一下 / 答错）照放
  assert.equal(framePlan(true, false, true), 'hold');
  assert.equal(framePlan(false, false, true), 'run');
  // 减动效（光效开关不论）：循环冻住，一次性动作直接落到它之后的状态——与原先一致
  for (const fxOff of [false, true]) {
    assert.equal(framePlan(true, true, fxOff), 'hold');
    assert.equal(framePlan(false, true, fxOff), 'skip');
  }
  // 冻住的一律画第 0 帧（静止姿势），不停在切换那一刻碰巧走到的中间帧
  assert.equal(shownFrame(3, 'hold'), 0);
  assert.equal(shownFrame(3, 'run'), 3);
  assert.equal(shownFrame(0, 'skip'), 0);
  // 状态里记的帧也归零：「开 → 关 → 开」重新打开时从第 0 帧播起，不跳回冻结前的第 3 帧；
  // 已在第 0 帧就原样返回（同一个对象，React 不重渲染）
  const midLoop = { state: 'idle', frame: 3, run: 2, after: 'idle' };
  assert.deepEqual(settleHeld(midLoop), { ...midLoop, frame: 0 });
  assert.equal(midLoop.frame, 3, '不改原对象');
  const atRest = { state: 'idle', frame: 0, run: 2, after: 'idle' };
  assert.equal(settleHeld(atRest), atRest);

  // 哪些算「一次性反馈」：动画表里 loop: false 的正好是庆祝、跳一下、答错三样
  const source = fs.readFileSync(componentPath, 'utf8');
  const component = code(source);
  const oneShots = [...component.matchAll(/'?([\w-]+)'?: \{ row: \d+, durations: \w+, loop: false \}/g)].map((m) => m[1]);
  assert.deepEqual(oneShots.sort(), ['failed', 'jumping', 'waving']);

  // 接线（剥过注释、按结构查）：组件读光效开关
  assert.ok(namedImports(source, '@/lib/useFx').has('useFx'), '要从 @/lib/useFx 读光效开关');
  assert.match(component, /const fxOff = useFx\(\) (?:=== 'off'|!== 'on');/);

  // 计时的 effect：随动画状态、减动效、光效开关重跑（依赖先后不论），按 framePlan 分三路；
  // 冻住那一路把状态里的帧归零（settleHeld），不是直接 return 了事
  const planCall = /framePlan\(config\.loop, reducedMotion, fxOff\)/;
  const timer = effects(component).find((e) => e.deps && ['animation', 'reducedMotion', 'fxOff'].every((d) => e.deps.includes(d)));
  assert.ok(timer, '计时的 effect 要随动画状态、减动效、光效开关重跑');
  assert.match(timer.body, planCall);
  const holdAt = timer.body.search(/if \((?:plan === 'hold'|'hold' === plan)\) \{/);
  assert.ok(holdAt >= 0, '冻住那一路要有自己的分支');
  assert.match(balanced(timer.body, timer.body.indexOf('{', holdAt)), /setAnimation\([^]*settleHeld\(/, '冻住时状态里的帧要归零');

  // 渲染：画面上的帧只从 shownFrame 来，计划与 effect 用同一份 framePlan（写成一行还是先存变量都行）
  const drawn = component.match(/const (\w+) = shownFrame\(animation\.frame, ([^;]+)\);/);
  assert.ok(drawn, '渲染要用 shownFrame 取画面上的帧');
  const [, frameVar, planArg] = drawn;
  const planVar = planArg.match(/^\w+$/)?.[0];
  assert.ok(planCall.test(planArg) || (planVar && new RegExp(`const ${planVar} = framePlan\\(config\\.loop, reducedMotion, fxOff\\);`).test(component)));
  const spriteX = component.match(/['"]--sprite-x['"]: `([^`]*)`/)?.[1] ?? '';
  assert.match(spriteX, new RegExp(`\\b${frameVar}\\b`), '--sprite-x 要按画面上的帧算');
  assert.doesNotMatch(spriteX, /animation\.frame/, '画面上的帧只从 shownFrame 来');
  assert.equal(attrValue(jsxOpening(component, 'className={styles.sprite}').attrs.get('data-frame')), frameVar);
});
