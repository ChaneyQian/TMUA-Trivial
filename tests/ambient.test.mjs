import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { ZONES } from '../src/components/deck/zones.ts';
import { FINE_POINTER, REDUCED_MOTION, installFakeDom, restoreGlobals } from './helpers/fake-dom.mjs';

// 设置页环境光（区色光晕 + 坐标纸网格 + 光标聚光）。
// 这组测试盯三件事：
//   1. 只在 setup / loading 相出现——考试与 Diagnostic 模拟正式机考，一丝环境光都不许漏进去
//   2. 跟手那条路径不进 React、rAF 节流、页面隐藏即停、卸载即清
//   3. 动效只走 transform / opacity，强弱按三套主题分档（护眼主题压到最弱）

const AMBIENT = 'src/components/ambient/AmbientBackdrop.tsx';
const AMBIENT_CSS = 'src/components/ambient/Ambient.module.css';
const SPOTLIGHT = 'src/components/ambient/spotlight.ts';
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

  // 铺满视口、跟着视口走（fixed），层级不高于内容：.stage 是 position: relative、z-index auto，
  // 环境光的 z-index 一旦大于 0 就会整片盖到内容上面
  const backdrop = ruleBody('.backdrop');
  assert.match(backdrop, /position: fixed;/);
  assert.match(backdrop, /inset: 0;/);
  const z = Number(backdrop.match(/z-index: (-?\d+);/)?.[1]);
  assert.ok(Number.isFinite(z) && z <= 0, `环境光 z-index ${z} 高过了内容`);
  const examCss = fs.readFileSync('src/components/exam/Exam.module.css', 'utf8');
  const stage = examCss.match(/\n\.stage \{[^}]*\}/)?.[0] ?? '';
  assert.match(stage, /position: relative;/);
  assert.doesNotMatch(stage, /z-index: -/, '.stage 不许沉到环境光底下');

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
  for (const source of [ambientCode, codeOnly(fs.readFileSync(SPOTLIGHT, 'utf8'))]) {
    assert.doesNotMatch(source, /document\.(documentElement|body)\.(style|classList|dataset|setAttribute)/);
  }
});

// ---------------------------------------------------------------------------
// 光标聚光：attachSpotlight 的行为，用 tests/helpers/fake-dom.mjs 那套假 DOM 真跑

const { attachSpotlight, tintVars } = await import('../src/components/ambient/spotlight.ts');

/** 装好假 DOM、挂上聚光；move 在视口 (x, y) 处来一下 pointermove */
function spotlight(options) {
  const dom = installFakeDom(options);
  const lens = dom.element();
  const targets = [dom.win, dom.doc, ...Object.values(dom.queries)];
  const before = targets.map((target) => target.count());
  const detach = attachSpotlight(lens);
  return {
    ...dom,
    lens,
    detach,
    listeners: () => targets.map((target) => target.count()),
    before,
    move(x, y, pointerType = 'mouse') {
      dom.win.emit('pointermove', { pointerType, clientX: x, clientY: y });
    },
    lit: () => lens.dataset.lit === 'true',
  };
}

test('the spotlight follows a fine mouse, one write per frame, on CSS variables only', (t) => {
  t.after(restoreGlobals);
  const s = spotlight();
  // 一帧里来三下：只排一帧，只写最后那一下；事件里不同步写样式
  s.move(10, 20);
  s.move(30, 40);
  s.move(300, 200);
  assert.equal(s.pending(), 1, '一帧最多排一次');
  assert.equal(s.lens.props.size, 0);
  assert.equal(s.lit(), false);
  s.flush();
  assert.equal(s.lens.props.get('--mx'), '300px');
  assert.equal(s.lens.props.get('--my'), '200px');
  assert.equal(s.lit(), true, '亮起时挂 data-lit');
  assert.deepEqual([...s.lens.props.keys()].sort(), ['--mx', '--my'], '只写自己的两个变量');
  // 触屏与笔不跟
  s.move(1, 1, 'touch');
  s.move(1, 1, 'pen');
  assert.equal(s.pending(), 0);
  s.detach();
});

test('no spotlight without a fine hovering pointer or with reduced motion, re-judged on every change', (t) => {
  t.after(restoreGlobals);
  // 没有精确指针（触屏）：挂着也不亮
  let s = spotlight({ fine: false });
  s.move(50, 50);
  assert.equal(s.pending(), 0);
  // 中途接上鼠标：下一下移动就亮，不用重新挂载
  s.setMedia(FINE_POINTER, true);
  s.move(50, 50);
  s.flush();
  assert.equal(s.lit(), true);
  // 又拔掉：立刻熄
  s.setMedia(FINE_POINTER, false);
  assert.equal(s.lit(), false);
  s.move(60, 60);
  assert.equal(s.pending(), 0);
  s.detach();

  // 减动效：不亮；中途打开减动效立刻熄，关掉后下一下移动恢复
  s = spotlight({ reduced: true });
  s.move(50, 50);
  assert.equal(s.pending(), 0);
  s.setMedia(REDUCED_MOTION, false);
  s.move(50, 50);
  s.flush();
  assert.equal(s.lit(), true);
  s.move(70, 70); // 打开减动效时还排着一帧：要撤掉
  s.setMedia(REDUCED_MOTION, true);
  assert.equal(s.lit(), false);
  assert.equal(s.pending(), 0, '熄灯要撤掉排着的帧');
  s.detach();
});

test('leaving the window, losing focus or hiding the page dims the spotlight', (t) => {
  t.after(restoreGlobals);
  const s = spotlight();
  const relight = () => {
    s.move(80, 90);
    s.flush();
    assert.equal(s.lit(), true);
  };
  relight();
  // 窗口里换元素（relatedTarget 不为空）不熄；离开窗口（为空）才熄
  s.doc.emit('pointerout', { relatedTarget: {} });
  assert.equal(s.lit(), true);
  s.doc.emit('pointerout', { relatedTarget: null });
  assert.equal(s.lit(), false);

  relight();
  s.win.emit('blur');
  assert.equal(s.lit(), false);

  relight();
  s.doc.hidden = true;
  s.doc.emit('visibilitychange');
  assert.equal(s.lit(), false);
  s.move(10, 10);
  assert.equal(s.pending(), 0, '页面隐藏时不排帧');
  s.detach();
});

test('unmounting removes every listener, cancels the pending frame and turns the light off', (t) => {
  t.after(restoreGlobals);
  const s = spotlight();
  assert.ok(
    s.listeners().every((n, k) => n > s.before[k]),
    '指针移动 / 离窗 / 失焦 / 可见性 / 两条媒体查询都要有监听',
  );
  s.move(5, 5);
  s.flush();
  s.move(6, 6); // 卸载时还排着一帧
  s.detach();
  assert.deepEqual(s.listeners(), s.before, '加了几个监听就摘几个');
  assert.equal(s.pending(), 0);
  assert.equal(s.lit(), false);
  // 幂等：再摘一次、摘完再来事件，都不出错、不复活
  s.detach();
  s.move(7, 7);
  assert.equal(s.pending(), 0);
  assert.equal(s.lit(), false);
});

test('the lit grid takes the current zone colour, and the backdrop is wired to it', () => {
  // 区色随区变化：每个区写出来的就是 zones.ts 里它自己的那两道色，四个区互不相同
  for (const zone of ZONES) {
    assert.deepEqual(tintVars(zone.id), { '--tint': zone.tint, '--tint2': zone.tint2 });
  }
  assert.equal(new Set(ZONES.map((zone) => tintVars(zone.id)['--tint'])).size, ZONES.length);

  // 组件：最外层按当前区写 tintVars(zone)，透镜在它里面（线读的 --tint 就是这一份）；
  // 每层光晕各写各区的色。聚光在挂载时挂上、卸载时摘掉
  assert.match(ambientCode, /className=\{styles\.backdrop\} data-zone=\{zone\} style=\{tintVars\(zone\)\}/);
  assert.match(ambientCode, /style=\{tintVars\(z\.id\)\}/);
  const rootAt = ambientCode.indexOf('className={styles.backdrop}');
  assert.ok(rootAt > 0 && rootAt < ambientCode.indexOf('ref={lensRef}'));
  assert.match(ambientCode, /useEffect\(\(\) => \{\s*const lens = lensRef\.current;\s*if \(!lens\) return;\s*return attachSpotlight\(lens\);\s*\}, \[\]\);/);
  assert.doesNotMatch(ambientCode, /useState|useReducer|forceUpdate/, '跟手路径不许有 React state');
  // 聚光的线与光晕取当前区色（浅色 / 深色；护眼另有一套暖光）
  assert.match(ruleBody('.backdrop'), /--lit-minor: color-mix\(in srgb, var\(--tint\)/);
  assert.match(ruleBody('.backdrop'), /--lit-fill: color-mix\(in srgb, var\(--tint\)/);
  assert.match(ruleBody(":global([data-theme='dark']) .backdrop"), /--lit-major: color-mix\(in srgb, color-mix\(in srgb, var\(--tint\)/);
  assert.match(ruleBody('.lensGrid'), /--line-minor: var\(--lit-minor\)/);

  // 两条媒体查询只在 useCardTilt 定义一次，聚光直接引用，不另抄一份
  const spot = codeOnly(fs.readFileSync(SPOTLIGHT, 'utf8'));
  assert.match(spot, /import \{ FINE_POINTER, REDUCED_MOTION \} from '\.\.\/fx\/useCardTilt\.ts';/);
  for (const source of [spot, ambientCode]) {
    assert.doesNotMatch(source, /\(hover: hover\)|prefers-reduced-motion/);
  }

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

  // 护眼主题：光斑换暖色，网格用墨色，聚光是一团琥珀暖光（不是一块更深的墨）
  assert.match(css, /:global\(\[data-theme='sepia'\]\) \.spotA \{\s*--c: color-mix\(in srgb, var\(--tint\) \d+%, #[0-9a-f]{6}\)/);
  assert.match(sepia, /--grid-minor: rgb\(61 50 38/);
  assert.match(sepia, /--lit-minor: rgb\(176 112 40/);

  // 网格是「极淡」的底纹，聚光是「微亮」：三套主题的线都压在低位，
  // 聚光下的线只比底纹高两三倍，外加一团同 mask 修出来的软光垫底
  /** 取一条颜色变量的不透明度：rgb(… / N%) 或 color-mix(…, N%, transparent) 两种写法 */
  const alpha = (block, name) => {
    const value = block.match(new RegExp(`--${name}: ([^;]+);`))?.[1].trim();
    assert.ok(value, `缺 --${name}`);
    const hit = value.match(/\/ ([\d.]+)%\)$/) || value.match(/([\d.]+)%, transparent\)$/);
    assert.ok(hit, `--${name} 的写法认不出不透明度：${value}`);
    return Number(hit[1]);
  };
  for (const [label, block] of [
    ['浅色', light],
    ['深色', dark],
    ['护眼', sepia],
  ]) {
    assert.ok(alpha(block, 'grid-minor') <= 4, `${label}细线 ${alpha(block, 'grid-minor')}%`);
    assert.ok(alpha(block, 'grid-major') <= 7, `${label}主线 ${alpha(block, 'grid-major')}%`);
    assert.ok(alpha(block, 'lit-minor') <= 24, `${label}聚光细线 ${alpha(block, 'lit-minor')}%`);
    assert.ok(alpha(block, 'lit-major') <= 40, `${label}聚光主线 ${alpha(block, 'lit-major')}%`);
    assert.ok(alpha(block, 'lit-fill') <= 12, `${label}聚光光晕 ${alpha(block, 'lit-fill')}%`);
  }
  assert.match(ruleBody('.lens'), /background: var\(--lit-fill\)/);
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
