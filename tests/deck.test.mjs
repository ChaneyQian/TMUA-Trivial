import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { indexForLibraryMode } from '../src/lib/records.ts';

const zonesPath = 'src/components/deck/zones.ts';
const deckPath = 'src/components/deck/CardDeck.tsx';
const deckCssPath = 'src/components/deck/Deck.module.css';
const examPath = 'src/components/exam/ExamApp.tsx';
const examCssPath = 'src/components/exam/Exam.module.css';

test('the deck ships three zones as one data table plus their cover art', () => {
  assert.equal(fs.existsSync(zonesPath), true, 'missing zones table');
  assert.equal(fs.existsSync(deckPath), true, 'missing CardDeck component');
  assert.equal(fs.existsSync(deckCssPath), true, 'missing deck styles');

  assert.equal(fs.existsSync('public/cards/classic.jpg'), true, 'missing Classic cover');
  assert.equal(fs.existsSync('public/cards/grill.jpg'), true, 'missing Grill cover');
  assert.equal(fs.existsSync('public/cards/trivial.jpg'), true, 'missing 9.0 Trivial cover');

  const zones = fs.readFileSync(zonesPath, 'utf8');

  // 三区、三个编号，卡面文案与解锁路径都从这张表来，组件里不写单卡分支
  for (const id of ["'classic'", "'grill'", "'trivial'"]) assert.match(zones, new RegExp(id));
  for (const no of ["'01'", "'02'", "'03'"]) assert.match(zones, new RegExp(no));
  // 卡面文案已搬进 lib/i18n.ts（外层双语），zones.ts 只留与语言无关的结构。
  // 三区的标题/副文改由字典保证，两种语言各一份，见 tests/i18n.test.mjs。
  assert.doesNotMatch(zones, /title:\s*'/);
  assert.doesNotMatch(zones, /sub:\s*'/);
  const i18n = fs.readFileSync('src/lib/i18n.ts', 'utf8');
  assert.match(i18n, /classic: '经典题库'/);
  assert.match(i18n, /grill: '复烤区'/);
  assert.match(i18n, /classic: 'Classic Library'/);
  assert.match(i18n, /grill: 'Grill'/);
  assert.match(i18n, /trivial: '9\.0 Trivial'/);
  assert.match(i18n, /classic: 'TMUA · MAT · SMC · ECAA'/);
  // P6 起 Grill 是「错题与弱项的复盘区」，兜底副文不能再写「即将开放」——
  // 那张卡从 P3 就开着了，实际副文还由 ExamApp 按绑定题/错题数覆盖
  assert.match(i18n, /grill: '错题与弱项复盘'/);
  assert.match(i18n, /grill: 'Wrong answers & weak spots'/);
  assert.doesNotMatch(i18n, /grill: '即将开放'/);
  assert.doesNotMatch(i18n, /grill: 'Coming Soon'/);
  assert.match(i18n, /trivial: '扩展题库'/);
  assert.match(i18n, /trivial: 'Extended Library'/);

  // P2/P3 的留位：展开给哪套面板、解锁走哪条路
  assert.match(zones, /panel: 'full'/);
  assert.match(zones, /panel: 'countOnly'/);
  assert.match(zones, /unlockPath: 'progress'/);
  assert.match(zones, /'diagnostic'/, 'the diagnostic unlock path must stay reserved for P2');
  // P3 起三个区全部开放；这张表只保留结构，开放与否仍由 comingSoon 表达
  assert.match(zones, /comingSoon: boolean;/, 'the structural flag must stay on the table');
  assert.equal(
    (zones.match(/comingSoon: false/g) || []).length,
    3,
    'all three zones are open from P3 on',
  );

  // 图没就位时的兜底：每区一条 CSS 渐变，垫在封面 <img> 底下
  assert.match(zones, /grad: string;/);
  assert.equal(
    (zones.match(/'radial-gradient\(/g) || []).length,
    3,
    'every zone needs a gradient placeholder',
  );

  // 封面走 basePath，和工牌 / 宠物同一套静态资源规矩
  const deck = fs.readFileSync(deckPath, 'utf8');
  assert.match(deck, /NEXT_PUBLIC_BASE_PATH/);
  assert.match(deck, /\/cards\/\$\{zone\.cover\}/);
  // 封面是装饰位：alt="" 时 404 的 img 什么也不画，渐变直接透出，
  // 既不需要 onError，也不会冒出破图图标
  assert.match(deck, /alt=""/);
});

test('the 280ms swap window is stated the same in the component and both stylesheets', () => {
  // 和工牌 DROP_MS / CSS keyframes 一样，这是一处「改一边就得改另一边」的耦合
  const exam = fs.readFileSync(examPath, 'utf8');
  const deckCss = fs.readFileSync(deckCssPath, 'utf8');
  const examCss = fs.readFileSync(examCssPath, 'utf8');

  assert.match(exam, /const ZONE_SWAP_MS = 280;/);
  assert.match(deckCss, /animation: deckIn 280ms/);
  assert.match(deckCss, /transform 280ms/);
  assert.match(examCss, /animation: panelIn 280ms/);

  // 退场的 deck 不能再吃点击，否则过渡窗口里两层都可点
  assert.match(deckCss, /\.deckLeaving\s*\{[\s\S]*?pointer-events: none/);
  // 面板的入场动画也要跟着 reduced-motion 退化
  assert.match(
    examCss,
    /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.panelLayer\s*\{[^}]*animation: none/,
  );
});

test('deck motion stays on the compositor and degrades to instant', () => {
  const css = fs.readFileSync(deckCssPath, 'utf8');

  // 逐条扫每一句 transition：只准动 transform / opacity（z-index 是 0s 的中点跳变）。
  // 布局属性和 filter / box-shadow 一旦进过渡，就会掉出合成器层。
  const declarations = css.match(/transition:[^;]*/g) || [];
  assert.ok(declarations.length >= 3, 'expected the deck to declare transitions');
  for (const declaration of declarations) {
    for (const banned of ['width', 'height', 'top', 'left', 'margin', 'filter', 'box-shadow']) {
      assert.equal(
        declaration.includes(banned),
        false,
        `non-composited property "${banned}" in ${declaration.trim()}`,
      );
    }
  }

  assert.match(css, /cubic-bezier\(0\.2, 0\.7, 0\.2, 1\)/);
  assert.match(css, /z-index 0s 175ms/, 'z-index must flip at the midpoint, not fade');
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);

  // lightningcss 会因为手写的 -webkit- 前缀删掉标准属性，这里一次也不许出现
  assert.doesNotMatch(css, /-webkit-backdrop-filter/);
  assert.doesNotMatch(css, /backdrop-filter/);
  // 后牌降亮用遮罩的 opacity，不用 filter：filter 强制离屏合成
  assert.doesNotMatch(css, /filter:\s*blur/);
});

test('the deck geometry is derived from the viewport, never from scale', () => {
  const css = fs.readFileSync(deckCssPath, 'utf8');

  // 卡宽由视口倒推（露边 0.16 卡宽 → 容器 1.32 卡宽），scale 只做视觉修饰。
  // transform 不改布局盒子，靠 scale 定尺寸必然在窄屏溢出加偏心。
  assert.match(css, /--card-w:\s*min\(340px, calc\(\(100vw - 2rem\) \/ 1\.32\)\)/);
  assert.match(css, /width:\s*min\(calc\(var\(--card-w\) \* 1\.32\), 100%\)/);
  assert.match(css, /\.stack\s*\{[\s\S]*?width:\s*var\(--card-w\)/);
  assert.match(css, /--slot-x:/, 'the side-card offset must stay tunable as a variable');

  // 兜底裁剪：clip 不建立滚动容器，配 overflow-y: visible 才不切掉侧牌下移的 8px
  assert.match(css, /overflow-x:\s*clip/);
  assert.match(css, /overflow-y:\s*visible/);
  assert.match(css, /touch-action:\s*pan-y/);
});

test('the deck owns its keyboard and touch handling without global listeners', () => {
  const deck = fs.readFileSync(deckPath, 'utf8');

  // 键盘绑在容器上。exam 相那套 A–H / 1–9 / Enter / ←→ / F 是 window 监听，
  // deck 只在 setup 相渲染，加一个全局监听就会两边打架。
  assert.doesNotMatch(deck, /addEventListener/);
  assert.match(deck, /onKeyDown/);
  assert.match(deck, /role="group"/);
  assert.match(deck, /aria-roledescription="carousel"/);
  assert.match(deck, /tabIndex=\{0\}/);
  assert.match(deck, /'ArrowLeft'/);
  assert.match(deck, /'ArrowRight'/);
  // exam 相独占的键位一个都不许在 deck 里出现
  assert.doesNotMatch(deck, /'ArrowDown'/);
  assert.doesNotMatch(deck, /'ArrowUp'/);

  // 原生 touch，不引库；React 的 touchmove 是 passive 挂载的，preventDefault 无效，
  // 纵向滚动交给 touch-action: pan-y，本来也不需要拦
  assert.match(deck, /onTouchStart/);
  assert.match(deck, /onTouchMove/);
  assert.match(deck, /onTouchEnd/);
  assert.match(deck, /onTouchCancel/);
  assert.match(deck, /touchmove 是 passive/);

  // 跟手位移直接写节点，不进 React 渲染路径：touchmove 是逐帧的，
  // 每帧 setState 就是每帧重渲染 3 张卡 + 3 张封面
  assert.match(deck, /setProperty\('--drag'/);
  assert.match(deck, /removeProperty\('--drag'\)/);

  // 转牌要有播报：dots 是 aria-hidden、命中层 tabIndex=-1，
  // 不往 role="status" 里塞一份卡名，键盘和读屏用户按 ←→ 什么都听不到
  assert.match(deck, /role="status"/);
  assert.match(deck, /styles\.srOnly/);

  // 伪 FLIP：不量位置，所以没有中断后清不干净的 transform
  assert.doesNotMatch(deck, /getBoundingClientRect/);
});

test('the 9.0 charge bar moves into its card as a display-only progress bar', () => {
  const deck = fs.readFileSync(deckPath, 'utf8');
  const exam = fs.readFileSync(examPath, 'utf8');
  const examCss = fs.readFileSync(examCssPath, 'utf8');

  // 视觉整套复用，不复制一份样式
  assert.match(deck, /from '\.\.\/exam\/Exam\.module\.css'/);
  assert.match(deck, /libraryChargeReady/);
  assert.match(deck, /libraryChargeFill/);
  assert.match(deck, /role="progressbar"/);
  // 切库职责交给 deck 之后它不再是按钮
  assert.doesNotMatch(deck, /aria-pressed/);
  // 流光那一族样式一条都没动
  assert.match(examCss, /\.libraryChargeReady \.libraryChargeFill\s*\{[\s\S]*?animation: chargeFlow/);
  assert.match(examCss, /@keyframes chargeFlow/);
  // 设置页里的旧充电条已经搬走
  assert.doesNotMatch(exam, /libraryChargeRow/);
});

test('the primary action sits above the optional record tools, and the deck can skip the panel', () => {
  const exam = fs.readFileSync(examPath, 'utf8');
  const deck = fs.readFileSync(deckPath, 'utf8');

  // 开始是主操作，做题记录是可选的次级功能，不该压在主操作前面
  const startAt = exam.indexOf('styles.startBtn');
  const recordsAt = exam.indexOf('styles.recordSection');
  assert.ok(startAt > 0 && recordsAt > 0, 'both blocks must still exist');
  assert.ok(startAt < recordsAt, 'the start button must be rendered before the record section');

  // 前牌快速开始：走同一条 start 路径，且不能顺带触发「展开面板」
  assert.match(deck, /quickStart/);
  assert.match(deck, /styles\.quickBtn/);
  assert.match(deck, /e\.stopPropagation\(\)/);
  assert.match(deck, /quickStart\.onStart\(\)/);
  assert.match(deck, /disabled=\{quickStart\.disabled\}/);
  // 即将开放 / 锁定的区不给这个入口
  assert.match(deck, /const openable = !zone\.comingSoon && !locked\[zone\.id\]/);
  // requestFullscreen 只认同步手势链，onStart 不许被包进异步
  assert.doesNotMatch(deck, /setTimeout\([^)]*onStart/);
  // start() 现在接可选的抽题覆盖参数（错题重练要用），所以不能再把它裸传给
  // onClick / onStart —— 事件对象会被当成 override。包一层，但仍是同步调用链
  assert.match(exam, /onStart: \(\) => void start\(\)/);
  assert.doesNotMatch(exam, /onClick=\{start\}/);
});

/**
 * 注：全套测试里所有 build-data 调用都带 EXAM_OUT 临时目录，没有谁会重写
 * public/exam——重试只防「开发者正在另一个终端里 npm run data」这种外部并发，
 * 测试文件又是并发跑的——撞上那一瞬间会读到半个文件。重试一次，别让套件偶发飘红。
 */
function readIndex(attempts = 5) {
  for (let i = 0; i < attempts; i++) {
    try {
      const parsed = JSON.parse(fs.readFileSync('public/exam/index.json', 'utf8'));
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
    const until = Date.now() + 120;
    while (Date.now() < until) {
      /* wait */
    }
  }
  throw new Error('could not read a complete public/exam/index.json');
}

test('the two zones are exclusive, so the 9.0 badge and its bank buttons report that pool alone', () => {
  const exam = fs.readFileSync(examPath, 'utf8');
  const index = readIndex();

  // 徽章：expandedCount 报的是扩展池本身，不再是「经典 + 扩展」的全集。
  // 期望值从数据现算——池子会随题库增长，写死只会变成维护负担
  const classic = indexForLibraryMode(index, 'classic');
  const expanded = indexForLibraryMode(index, 'hidden');
  assert.ok(expanded.length > 0 && classic.length > 0, '两个池子都得真有题，这条才有负载');
  assert.equal(
    expanded.length + classic.length,
    index.filter((entry) => !entry.diag).length,
    '两池不相交、合起来是全部非诊断题',
  );
  assert.equal(
    expanded.some((entry) => !entry.hidden),
    false,
    '9.0 池里混进了经典卷——徽章上那个数就不是它自己的题量了',
  );
  assert.match(exam, /const expandedCount = index \? indexForLibraryMode\(index, 'hidden'\)\.length : 0;/);
  assert.match(exam, /t\.cardBadge\.expanded\(expandedCount\)/);

  // 题库按钮按「这个区里有没有这个库」列，不再写死两串字面量。
  // 互斥之后 9.0 只剩 Mock 与 MAT，摆一排「TMUA 0 题」的灰按钮既难看又误导
  const banksOf = (pool) => [...new Set(pool.map((entry) => entry.db))].sort();
  // 库名单也从数据现算，不写死：回忆题会持续补入，钉具体库名只会变成维护负担
  const hiddenBanks = [...new Set(index.filter((e) => e.hidden && !e.diag).map((e) => e.db))].sort();
  const classicBanks = [...new Set(index.filter((e) => !e.hidden && !e.diag).map((e) => e.db))].sort();
  assert.deepEqual(banksOf(expanded), hiddenBanks);
  assert.deepEqual(banksOf(classic), classicBanks);
  assert.ok(hiddenBanks.length > 0 && classicBanks.length > 0, '两个区都得真有库');
  assert.match(exam, /const bankChoices: Db\[\] = \[\.\.\.EXAM_DATABASES\.filter\(\(d\) => zoneCounts\[d\] > 0\), 'ALL'\];/);
  assert.match(exam, /\{bankChoices\.map\(\(d\) => \(/);
  assert.doesNotMatch(exam, /\['TMUA', 'TMUA_MOCK', 'MAT', 'SMC', 'ECAA', 'AMC', 'ALL'\]/);

  // 显示的题数仍走 activeIndex（含逻辑开关），但「列不列这个库」只看题库范围：
  // 开关清空一个库时该置灰、不该让按钮整个消失，否则用户找不到勾回来这条路
  assert.match(exam, /for \(const e of scopedIndex\) \{\s*\n\s*if \(zoneCounts\[e\.db\] !== undefined\) zoneCounts\[e\.db\]\+\+;/);
  assert.match(exam, /disabled=\{d !== 'ALL' && poolCounts\[d\] === 0\}/);

  // 记忆的题库若在当前区没题就兜底。互斥之前只有一个方向会落空，现在两个方向都会
  assert.match(exam, /if \(!index \|\| db === 'ALL' \|\| zoneCounts\[db\] > 0\) return;/);
  assert.match(exam, /const fallback = EXAM_DATABASES\.find\(\(d\) => zoneCounts\[d\] > 0\);/);
  assert.doesNotMatch(exam, /libraryMode === 'classic' && \(db === 'TMUA_MOCK'/);

  // 365 解锁计数与充电条口径不变：读的仍是整份索引
  for (const call of [
    'validCompletedCount(index, records)',
    'hiddenUnlockProgress(index, records)',
    'isHiddenModeUnlocked(index, records)',
  ]) {
    assert.ok(exam.includes(call), `${call} 必须读整份索引，互斥不该动它`);
  }
});

test('the deck is a setup-phase sub-state that leaves the exam runtime alone', () => {
  const exam = fs.readFileSync(examPath, 'utf8');
  const examCss = fs.readFileSync(examCssPath, 'utf8');

  assert.match(exam, /<CardDeck/);
  assert.match(exam, /frontZone/);
  // deck / zone / progress 三个子视图共用 .stage 的同一格，phase 仍是四相
  assert.match(exam, /type StageView = 'deck' \| 'zone' \| 'progress'/);
  assert.match(exam, /stageView/);
  // 选区落盘，未解锁 / 未开放的区回落经典
  assert.match(exam, /mcq-test:zone:v1/);
  assert.match(exam, /localStorage\.setItem\(ZONE_KEY, id\)/);
  assert.match(exam, /saved === 'trivial' \|\| saved === 'classic'/);

  // 哨兵：exam 相的全局键盘流一行没动
  assert.match(exam, /if \(phase !== 'exam' \|\| !q\) return;/);
  // 题库范围降为派生值，不再是独立 state
  assert.doesNotMatch(exam, /setLibraryMode/);

  // 工牌：字面量留在 ExamApp，丝带锚点从 .setupCard 上提到 .stage，
  // .setupCard 的 position: relative 原样保留
  assert.match(exam, /<IdBadge\s*\/>/);
  assert.match(examCss, /\.setupCard\s*\{[\s\S]*?position:\s*relative/);
  assert.match(examCss, /\.stage\s*\{[\s\S]*?position:\s*relative/);
  // 丝带故意越过上边缘，锚点一旦裁溢出就没了
  assert.doesNotMatch(examCss, /\.stage\s*\{[^}]*overflow:\s*hidden/);
  // deck 与面板同格叠放，只在过渡窗口内共存
  assert.match(examCss, /\.stage > \*\s*\{[\s\S]*?grid-area: 1 \/ 1/);
});
