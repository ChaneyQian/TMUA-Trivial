import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { ZONES } from '../src/components/deck/zones.ts';

// 设置页环境光（区色光晕 + 坐标纸网格 + 光标聚光）。
// 这组测试盯三件事：
//   1. 只在 setup / loading 相出现——考试与 Diagnostic 模拟正式机考，一丝环境光都不许漏进去
//   2. 跟手那条路径不进 React、rAF 节流、页面隐藏即停、卸载即清
//   3. 动效只走 transform / opacity，强弱按三套主题分档（护眼主题压到最弱）

const AMBIENT = 'src/components/ambient/AmbientBackdrop.tsx';
const AMBIENT_CSS = 'src/components/ambient/Ambient.module.css';
const EXAM = 'src/components/exam/ExamApp.tsx';

/** 结构断言要看真正跑起来的代码，注释里提一嘴不算 */
function codeOnly(source) {
  return source
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

const examCode = codeOnly(fs.readFileSync(EXAM, 'utf8'));
const ambient = fs.readFileSync(AMBIENT, 'utf8');
const ambientCode = codeOnly(ambient);
const css = fs.readFileSync(AMBIENT_CSS, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

/** 取一条顶格书写的规则的声明体（选择器列表里的同名项、媒体查询里缩进的同名规则都不算） */
function ruleBody(selector) {
  const pattern = new RegExp(`(^|\\n)${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\{`, 'g');
  const hit = [...css.matchAll(pattern)].find((m) => !/,\s*$/.test(css.slice(0, m.index)));
  assert.ok(hit, `找不到样式规则 ${selector}`);
  return css.slice(hit.index, css.indexOf('}', hit.index));
}

/** 把 @keyframes 名 → 关键帧里出现过的属性名 */
function keyframeProps() {
  const out = new Map();
  for (const match of css.matchAll(/@keyframes\s+([\w-]+)\s*\{/g)) {
    let depth = 1;
    let k = match.index + match[0].length;
    const start = k;
    while (k < css.length && depth > 0) {
      if (css[k] === '{') depth++;
      else if (css[k] === '}') depth--;
      k++;
    }
    const body = css.slice(start, k - 1);
    out.set(match[1], new Set([...body.matchAll(/([\w-]+)\s*:/g)].map((m) => m[1])));
  }
  return out;
}

test('the backdrop mounts exactly once, inside the setup/loading branch and under the stage', () => {
  const mounts = examCode.match(/<AmbientBackdrop\b/g) || [];
  assert.equal(mounts.length, 1, '只挂一处');

  const setupAt = examCode.indexOf("if (phase === 'setup' || phase === 'loading') {");
  const diagnosticAt = examCode.indexOf("if (phase === 'diagnostic') {");
  const mountAt = examCode.indexOf('<AmbientBackdrop');
  assert.ok(setupAt > 0, 'setup / loading 的渲染分支还在');
  assert.ok(setupAt < mountAt && mountAt < diagnosticAt, '环境光属于设置页分支，别的相一概没有');

  // fixed + z-index 0 的一层，靠树序画在内容之下：必须排在 .stage 之前
  const stageAt = examCode.indexOf('className={styles.stage}', setupAt);
  assert.ok(mountAt < stageAt, '环境光要挂在 .stage 前面，树序在后就会盖住内容');

  // 颜色跟前牌 / 当前展开的区走——两者在 ExamApp 里是同一个真源
  assert.match(examCode, /<AmbientBackdrop zone=\{frontZone\} \/>/);
});

test('the exam and diagnostic runtimes carry no ambient light, grid or cursor effect', () => {
  // 考试运行时的返回体（CBT 界面）从这一行起
  const examAt = examCode.indexOf('if (!q) return null;');
  assert.ok(examAt > 0);
  assert.doesNotMatch(examCode.slice(examAt), /Ambient|ambient|lens|spotlight/i);

  // Diagnostic 的答题页与成绩页是独立组件，也不许引它
  for (const file of [
    'src/components/diagnostic/DiagnosticRunner.tsx',
    'src/components/diagnostic/DiagnosticResult.tsx',
  ]) {
    assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /AmbientBackdrop|components\/ambient/, file);
  }

  // 卸载即无残留：它只动自己的节点，不往 <html> / <body> 上写任何东西，
  // 否则切到考试相之后那些痕迹还挂在全局
  assert.doesNotMatch(
    ambientCode,
    /document\.(documentElement|body)\.(style|classList|dataset|setAttribute)/,
  );
});

test('the spotlight is rAF-throttled, stays out of React, and cleans up after itself', () => {
  // 跟手走 rAF：一帧最多写一次变量；页面隐藏时不排帧，离开窗口 / 失焦 / 隐藏即熄
  assert.match(ambientCode, /requestAnimationFrame\(paint\)/);
  assert.match(ambientCode, /cancelAnimationFrame\(frame\)/);
  assert.match(ambientCode, /!frame && !document\.hidden/);
  assert.match(ambientCode, /if \(document\.hidden\) dim\(\)/);
  assert.match(ambientCode, /if \(!e\.relatedTarget\) dim\(\)/);

  // 只写本层元素上的 CSS 变量，不触发 React 重渲染
  assert.match(ambientCode, /lens\.style\.setProperty\('--mx'/);
  assert.match(ambientCode, /lens\.style\.setProperty\('--my'/);
  assert.doesNotMatch(ambientCode, /useState|useReducer|forceUpdate/, '跟手路径不许有 React state');

  // 只给能悬停的精确指针；减动效下整个不开
  assert.match(ambientCode, /'\(hover: hover\) and \(pointer: fine\)'/);
  assert.match(ambientCode, /'\(prefers-reduced-motion: reduce\)'/);
  assert.match(ambientCode, /e\.pointerType !== 'mouse'/);

  // 加了几个监听就摘几个，一一对应
  const pairs = (verb) =>
    [...ambientCode.matchAll(new RegExp(`(\\w+)\\.${verb}\\('(\\w+)', (\\w+)`, 'g'))]
      .map((m) => `${m[1]}.${m[2]}:${m[3]}`)
      .sort();
  const added = pairs('addEventListener');
  assert.ok(added.length >= 4, '指针移动 / 离窗 / 失焦 / 可见性四个监听都得在');
  assert.deepEqual(pairs('removeEventListener'), added, '卸载时每个监听都要摘掉');

  // 纯装饰：读屏跳过、不吃点击
  assert.match(ambient, /aria-hidden="true"/);
  assert.match(ruleBody('.backdrop'), /pointer-events: none/);
});

test('glow layers crossfade by opacity and drift on transform only, no blur anywhere', () => {
  // 关键帧只许 transform / opacity
  const frames = keyframeProps();
  assert.ok(frames.size >= 3, '三团光斑各自漂移');
  for (const [name, props] of frames) {
    for (const prop of props) {
      assert.ok(['transform', 'opacity'].includes(prop), `@keyframes ${name} 动了 ${prop}`);
    }
  }

  // 过渡同理：只许 opacity，visibility 只是淡出走完后的 0s 收尾
  for (const [, value] of css.matchAll(/transition:([^;]*);/g)) {
    const props = value
      // 按顶层逗号切：cubic-bezier(…) 里的逗号不算
      .split(/,(?![^(]*\))/)
      .map((part) => part.trim().split(/\s+/)[0])
      .filter((prop) => prop && prop !== 'none');
    for (const prop of props) {
      assert.ok(['opacity', 'visibility'].includes(prop), `过渡了非合成器属性 ${prop}`);
    }
  }

  // 大面积模糊一律不许：光斑的软边全靠渐变色标
  assert.doesNotMatch(css, /filter\s*:/);
  assert.doesNotMatch(css, /backdrop-filter/);

  // 换区靠每区一层的 opacity 交叉淡变（~900ms），不去过渡渐变本身
  assert.match(ruleBody('.glow'), /opacity 900ms/);
  assert.match(ruleBody('.glowOn'), /opacity: 1/);
  assert.doesNotMatch(css, /transition:[^;]*background/);
  assert.match(ambientCode, /ZONES\.map\(\(z\) =>/);
  assert.match(ambientCode, /z\.id === zone \? styles\.glowOn : ''/);
  assert.match(ambientCode, /data-zone=\{zone\}/);

  // 漂移周期 30–60s（alternate：单程时长 × 2）；不在场的层暂停
  const durations = [...css.matchAll(/animation: drift\w+ (\d+)s ease-in-out infinite alternate/g)].map(
    (m) => Number(m[1]),
  );
  assert.equal(durations.length, 3);
  for (const seconds of durations) {
    assert.ok(seconds * 2 >= 30 && seconds * 2 <= 60, `漂移一个来回 ${seconds * 2}s，不在 30–60s 内`);
  }
  assert.match(ruleBody('.glow .spot'), /animation-play-state: paused/);
  assert.match(ruleBody('.glowOn .spot'), /animation-play-state: running/);
});

test('the paper grid and the cursor lens are aligned and the lens only exists for a fine pointer', () => {
  // 30px 一格、150px 一条主线；两层共用同一套背景定义，原点钉在左上角才能逐像素对齐
  assert.match(css, /\.grid,\s*\n\.lensGrid \{/);
  assert.match(css, /150px 150px,\s*150px 150px,\s*30px 30px,\s*30px 30px/);
  assert.match(css, /background-position: -1px -1px/);
  assert.match(ruleBody('.grid'), /mask-image: radial-gradient/);

  // 透镜整体平移、里层网格反向平移：跟手只改 transform，不重绘
  assert.match(ruleBody('.lens'), /transform: translate3d\(calc\(var\(--mx\) - var\(--r\)\)/);
  assert.match(ruleBody('.lensGrid'), /transform: translate3d\(calc\(var\(--r\) - var\(--mx\)\)/);
  assert.match(ruleBody('.lens'), /display: none/);
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\) \{\s*\.lens \{\s*display: block;/);
});

test('three themes get three strengths: pastel, luminous, and barely-there sepia', () => {
  const level = (block, name) => {
    const hit = block.match(new RegExp(`--${name}: ([\\d.]+);`));
    assert.ok(hit, `缺 --${name}`);
    return Number(hit[1]);
  };
  const light = ruleBody('.backdrop');
  const dark = ruleBody(":global([data-theme='dark']) .backdrop");
  const sepia = ruleBody(":global([data-theme='sepia']) .backdrop");

  // 浅色：峰值不透明度约 0.18–0.28；深色约 0.35–0.5；护眼再往下压
  for (const name of ['spot-a', 'spot-b', 'spot-c']) {
    const l = level(light, name);
    const d = level(dark, name);
    const s = level(sepia, name);
    assert.ok(l >= 0.18 && l <= 0.28, `浅色 ${name} = ${l}`);
    assert.ok(d >= 0.3 && d <= 0.5 && d > l, `深色 ${name} = ${d} 要比浅色亮`);
    assert.ok(s < l && s <= 0.16, `护眼 ${name} = ${s} 要压到最弱`);
  }

  // 护眼主题：光斑换暖色，网格与聚光用墨色
  assert.match(css, /:global\(\[data-theme='sepia'\]\) \.spotA \{\s*--c: color-mix\(in srgb, var\(--tint\) \d+%, #[0-9a-f]{6}\)/);
  assert.match(sepia, /--grid-minor: rgb\(61 50 38/);
  assert.match(sepia, /--lit-minor: rgb\(139 94 47/);
});

test('every zone carries the tints the backdrop and the front card read', () => {
  for (const zone of ZONES) {
    assert.match(zone.tint, /^#[0-9a-f]{6}$/i, `${zone.id} 缺区色`);
    assert.match(zone.tint2, /^#[0-9a-f]{6}$/i, `${zone.id} 缺副色`);
  }
  // 四个区各占一个色相，撞色就分不出现在站在哪张卡前
  assert.equal(new Set(ZONES.map((zone) => zone.tint)).size, ZONES.length);
  // 9.0 的区色就是充电条满格那道青，与卡面、横幅同一套视觉
  assert.equal(ZONES.find((zone) => zone.id === 'trivial')?.tint, '#00c8c2');
  assert.equal(ZONES.find((zone) => zone.id === 'classic')?.tint, '#4a6cf7');
});
