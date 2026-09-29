import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { TURN_MS } from '../src/components/deck/turnGuard.ts';
import { ZONE_IDS, ringOffset, stepZone } from '../src/components/deck/zones.ts';
import { indexForLibraryMode } from '../src/lib/records.ts';
import {
  cascade,
  declarations,
  evalLength,
  FX_OFF_ROOT,
  overrides,
  parseRules,
  parseTransition,
  px,
  splitValue,
  stripComments,
  subject,
  timeMs,
} from './helpers/css-rules.mjs';
import { readExamIndex } from './helpers/exam-data.mjs';
import {
  attrValue,
  balanced,
  calls,
  code,
  effects,
  fnBody,
  fnParams,
  jsxByClass,
  jsxChildren,
  jsxOpening,
  namedFn,
  namedImports,
  squash,
} from './helpers/source.mjs';

const zonesPath = 'src/components/deck/zones.ts';
const deckPath = 'src/components/deck/CardDeck.tsx';
const deckCssPath = 'src/components/deck/Deck.module.css';
const examPath = 'src/components/exam/ExamApp.tsx';
const examCssPath = 'src/components/exam/Exam.module.css';

test('the deck ships four zones as one data table plus their cover art', () => {
  assert.equal(fs.existsSync(zonesPath), true, 'missing zones table');
  assert.equal(fs.existsSync(deckPath), true, 'missing CardDeck component');
  assert.equal(fs.existsSync(deckCssPath), true, 'missing deck styles');

  assert.equal(fs.existsSync('public/cards/classic.jpg'), true, 'missing Classic cover');
  assert.equal(fs.existsSync('public/cards/grill.jpg'), true, 'missing Grill cover');
  assert.equal(fs.existsSync('public/cards/trivial.jpg'), true, 'missing 9.0 Trivial cover');
  // board.jpg 刻意不断言存在：P1 定下的机制就是「缺图走渐变兜底，
  // 放进文件即生效、零代码改动」。骨架卡不等图，图到了也不用改这条

  const zones = fs.readFileSync(zonesPath, 'utf8');

  // 四区、四个编号，卡面文案与解锁路径都从这张表来，组件里不写单卡分支
  for (const id of ["'classic'", "'grill'", "'trivial'", "'board'"]) {
    assert.match(zones, new RegExp(id));
  }
  for (const no of ["'01'", "'02'", "'03'", "'04'"]) assert.match(zones, new RegExp(no));
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
  // P7-C1 的第四张卡，双语齐备
  assert.match(i18n, /board: '标化题库'/);
  assert.match(i18n, /board: 'Standard Bank'/);
  assert.match(i18n, /board: '分类看板 · 即将开放'/);
  assert.match(i18n, /board: 'Browse-only board · Coming soon'/);

  // P2/P3 的留位：展开给哪套面板、解锁走哪条路
  assert.match(zones, /panel: 'full'/);
  assert.match(zones, /panel: 'countOnly'/);
  assert.match(zones, /unlockPath: 'progress'/);
  assert.match(zones, /'diagnostic'/, 'the diagnostic unlock path must stay reserved for P2');
  // P3 起前三个区全部开放；这张表只保留结构，开放与否仍由 comingSoon 表达
  assert.match(zones, /comingSoon: boolean;/, 'the structural flag must stay on the table');
  assert.equal(
    (zones.match(/comingSoon: false/g) || []).length,
    3,
    'the first three zones stay open',
  );
  // 标化题库是骨架卡：只有它是 comingSoon，且刻意不设解锁门槛
  // （unlockPath 仍是 free）——它不是锁着，是内容还没进来
  const boardBlock = zones.slice(zones.indexOf("id: 'board'"));
  assert.match(boardBlock, /comingSoon: true/);
  assert.match(boardBlock, /unlockPath: 'free'/);
  assert.match(boardBlock, /panel: 'none'/, 'a browse-only board opens no pick-and-time panel');
  assert.match(boardBlock, /quickStart: false/, 'a card that hands out no paper has no quick start');
  assert.equal(
    (zones.match(/comingSoon: true/g) || []).length,
    1,
    'only the board is a skeleton card',
  );

  // 图没就位时的兜底：每区一条 CSS 渐变，垫在封面 <img> 底下
  assert.match(zones, /grad: string;/);
  assert.equal(
    (zones.match(/'radial-gradient\(/g) || []).length,
    4,
    'every zone needs a gradient placeholder',
  );
  // 第四张的占位色与前三张分得开（鼠尾草绿 vs 蓝 / 橙 / 深青）：
  // 缺图期间四张卡全靠渐变认人，撞色就等于四张一样的卡
  assert.match(boardBlock, /#5a8a6a/, 'the board placeholder is the sage-green one');

  // 封面走 basePath，和工牌 / 宠物同一套静态资源规矩
  const deck = fs.readFileSync(deckPath, 'utf8');
  assert.match(deck, /NEXT_PUBLIC_BASE_PATH/);
  assert.match(deck, /\/cards\/\$\{zone\.cover\}/);
  // 封面是装饰位：alt="" 时 404 的 img 什么也不画，渐变直接透出，
  // 既不需要 onError，也不会冒出破图图标
  assert.match(deck, /alt=""/);
});

test('the ring keeps cycling both ways once a fourth card joins it', () => {
  assert.equal(ZONE_IDS.length, 4, '第四张卡进表之后，环上就是四张');

  // 按同一方向走满一圈：必须回到出发的那张，且路上每张各出现一次。
  // 这是 ←→ 循环的全部承诺，比钉死「按右键从 classic 到 grill」耐改得多
  for (const start of ZONE_IDS) {
    const seen = [];
    let at = start;
    for (let i = 0; i < ZONE_IDS.length; i++) {
      seen.push(at);
      at = stepZone(at, 1);
    }
    assert.equal(at, start, `右旋一圈没有回到 ${start}`);
    assert.equal(new Set(seen).size, ZONE_IDS.length, '一圈里有卡重复或缺席');
  }

  // ←→ 互为逆操作：按错方向再按回来，回到原处
  for (const id of ZONE_IDS) {
    assert.equal(stepZone(stepZone(id, 1), -1), id);
    assert.equal(stepZone(stepZone(id, -1), 1), id);
  }

  // 位次取遍 0..n-1，前位恒为 0：CardDeck 按位次分槽，漏一个位次就等于
  // 有一张卡没有槽位、四张牌叠成三张
  for (const front of ZONE_IDS) {
    assert.equal(ringOffset(front, front), 0);
    assert.deepEqual(
      ZONE_IDS.map((id) => ringOffset(id, front)).sort(),
      [0, 1, 2, 3],
    );
  }
});

test('the fourth card gets a slot of its own instead of piling onto the left one', () => {
  const deck = fs.readFileSync(deckPath, 'utf8');
  const css = fs.readFileSync(deckCssPath, 'utf8');

  // 槽位映射写成「末位即左后牌」，中间的落到第三层。
  // 钉死数字的话，下一张卡进表就会悄悄叠到左后牌上
  assert.match(deck, /offset === ZONES\.length - 1/);
  assert.match(deck, /styles\.slotBack/);
  assert.match(css, /\.slotBack\s*\{/);

  // 第三层比两张侧牌更靠后：z-index 更小、遮罩更暗
  assert.match(css, /\.slotBack\s*\{[\s\S]*?z-index: 0/);
  assert.match(css, /\.slotBack::after\s*\{[\s\S]*?opacity: 0\.5/);

  // 位移用百分比：transform 的百分比按卡片自身尺寸解析，
  // 340px 与 375px 下才露出同一比例的那道边（与 --slot-x 同一套理由）
  assert.match(css, /--slot-back-y:\s*-?\d+(\.\d+)?%/);
  // 跟手位移也要作用到第三层，否则横滑时它会呆在原地
  assert.match(css, /\.slotBack\s*\{[\s\S]*?var\(--drag, 0px\)/);
  // 第三层往上退出去的那截要有 padding 接着，不然它挤进 .head 的外边距里
  // 窄屏 30px；中宽屏第三层退得更多，接它的内边距按卡宽取（见下一条几何测试）
  assert.equal(cascade(css, '.viewport')['padding-top'], 'var(--viewport-pad)');
  assert.equal(px(cascade(css, '.deck')['--viewport-pad']), 30);
});

test('the board card is a coming-soon skeleton: it turns to the front but never opens', () => {
  const exam = fs.readFileSync(examPath, 'utf8');

  // 徽章走 comingSoon 体例，不报「0 题」—— 那会被读成「这个库空了」
  assert.match(exam, /board: t\.cardBadge\.comingSoon/);
  // 不锁定：它没有门槛，只是内容还没进来。锁定态在卡面是另一套读法
  assert.match(
    exam,
    /locked=\{\{ classic: false, grill: false, trivial: !hiddenUnlocked, board: false \}\}/,
  );
  // 展不开走的仍是 P1 那套 block.comingSoon，没有为第四张卡新写分支
  assert.match(exam, /if \(zone\.comingSoon\) return t\.block\.comingSoon\(t\.zone\.title\[id\]\);/);
  // 选区落盘的白名单里没有 board：存进去只会在下次回读时被判非法，
  // localStorage 里不该留一个永远走不通的值
  assert.doesNotMatch(exam, /saved === 'board'/);
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
  // 转牌时长从守卫常量来（--turn-ms），层级在过渡的正中翻面
  assert.match(css, /z-index 0s calc\(var\(--turn-ms\) \/ 2\)/, 'z-index must flip at the midpoint, not fade');
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);

  // lightningcss 会因为手写的 -webkit- 前缀删掉标准属性，这里一次也不许出现
  assert.doesNotMatch(css, /-webkit-backdrop-filter/);
  assert.doesNotMatch(css, /backdrop-filter/);
  // 后牌降亮用遮罩的 opacity，不用 filter：filter 强制离屏合成
  assert.doesNotMatch(css, /filter:\s*blur/);
});

test('the deck geometry is derived from the viewport, never from scale', () => {
  const css = fs.readFileSync(deckCssPath, 'utf8');

  // 卡宽由视口倒推（容器 = 跨度 × 卡宽，跨度按屏宽分档），scale 只做视觉修饰。
  // transform 不改布局盒子，靠 scale 定尺寸必然在窄屏溢出加偏心。
  assert.match(css, /--card-w:\s*min\(var\(--card-max\), calc\(\(100vw - 2rem\) \/ var\(--deck-span\)\)\)/);
  assert.match(css, /--deck-w:\s*calc\(var\(--card-w\) \* var\(--deck-span\)\)/);
  assert.match(css, /\.stack\s*\{[\s\S]*?width:\s*var\(--card-w\)/);
  assert.match(css, /--slot-x:/, 'the side-card offset must stay tunable as a variable');
  // 跨度只在 --deck-span 一处定义：用到牌堆总宽的地方一律读 --deck-w，不再各写一个 1.32
  const code = css.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.equal((code.match(/1\.32/g) || []).length, 1, '1.32 只该出现在 --deck-span 的定义里');
  for (const block of ['.head', '.progressRow', '.hintRow']) {
    assert.match(code, new RegExp(`\\n\\${block} \\{[^}]*width: min\\(var\\(--deck-w\\), 100%\\)`), block);
  }
  // .viewport 就是牌堆总宽；宽于舞台时两侧等量外扩（负外边距），不偏向右边。
  // 按层叠后的值代入几组「舞台宽 / 牌堆宽」求出来比，不认写法（简写、长写、先后都行）
  const viewport = cascade(code, '.viewport');
  for (const [stage, deckW] of [
    [343, 343],
    [900, 1100],
    [1400, 1180],
  ]) {
    const env = { '%': stage, '--deck-w': deckW };
    assert.equal(evalLength(viewport.width, env), deckW, `.viewport 宽不是牌堆总宽（舞台 ${stage}）`);
    for (const side of ['margin-left', 'margin-right']) {
      assert.ok(
        Math.abs(evalLength(viewport[side], env) - (stage - deckW) / 2) < 1e-9,
        `舞台 ${stage}、牌堆 ${deckW} 时 ${side} = ${viewport[side]}，两侧不等量`,
      );
    }
  }
  // 不许它的内容宽度把舞台的网格列撑开
  assert.equal(px(cascade(code, '.deck')['min-width']), 0);

  // 兜底裁剪：clip 不建立滚动容器，配 overflow-y: visible 才不切掉侧牌下移的 8px。
  // 取层叠后的值——后面再补一句 overflow: visible 就把裁剪整个撤了，字面上 clip 却还在
  assert.equal(viewport['overflow-x'], 'clip');
  assert.equal(viewport['overflow-y'], 'visible');
  for (const rule of parseRules(code)) {
    if (!rule.selector.split(',').some((one) => one.trim() === '.viewport')) continue;
    for (const [prop, value] of declarations(rule.body)) {
      if (prop === 'overflow' || prop === 'overflow-x') {
        assert.equal(splitValue(value)[0], 'clip', `${rule.at ?? ''} .viewport 的 ${prop}: ${value} 撤掉了横向裁剪`);
      }
    }
  }
  assert.match(viewport['touch-action'], /^pan-y\b/);
});

test('the deck spreads out in three width tiers, and each container holds exactly its fan', () => {
  const css = fs.readFileSync(deckCssPath, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

  /** .deck 块里的变量；media 为 null 时取顶格那条，否则取对应媒体查询里的 .deck */
  const deckVars = (media) => {
    let scope = css;
    if (media) {
      const at = css.indexOf(`@media ${media} {`);
      assert.ok(at >= 0, `缺媒体查询 ${media}`);
      scope = css.slice(at, css.indexOf('\n}', at));
    }
    const block = scope.match(media ? /\.deck \{([^}]*)\}/ : /\n\.deck \{([^}]*)\}/)?.[1] ?? '';
    return Object.fromEntries([...block.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
  };
  const narrow = deckVars(null);
  const medium = { ...narrow, ...deckVars('(min-width: 640px)') };
  const wide = { ...medium, ...deckVars('(min-width: 1024px)') };

  // 侧牌 scale(s) + rotate(θ) 后包围盒半宽 = s·(0.5·cosθ + (10/7)/2·sinθ)，
  // 露出前牌之外 = slot-x + 半宽 − 0.5；容器跨度 = 1 + 2 × 露边（容器正好装下整把扇子）
  const geometry = (vars) => {
    const s = Number(vars['--slot-scale']);
    const theta = (Number.parseFloat(vars['--slot-rot']) * Math.PI) / 180;
    const x = Number.parseFloat(vars['--slot-x']) / 100;
    const half = s * (0.5 * Math.cos(theta) + (10 / 7 / 2) * Math.sin(theta));
    const peek = x + half - 0.5;
    return { peek, span: Number(vars['--deck-span']), rotDeg: Number.parseFloat(vars['--slot-rot']), s };
  };
  const tiers = { narrow: geometry(narrow), medium: geometry(medium), wide: geometry(wide) };
  for (const [name, g] of Object.entries(tiers)) {
    assert.ok(Math.abs(g.span - (1 + 2 * g.peek)) < 0.01, `${name}：跨度 ${g.span} 与露边 ${g.peek.toFixed(3)} 对不上`);
  }
  // 窄屏保持现状；中屏露约 0.35W、4° 左右、0.9；宽屏露约 0.6W（大半张）、3–4°、0.88
  assert.ok(Math.abs(tiers.narrow.peek - 0.16) < 0.01);
  assert.equal(narrow['--slot-rot'], '6deg');
  assert.equal(narrow['--slot-scale'], '0.92');
  assert.equal(narrow['--card-max'], '340px');
  assert.ok(Math.abs(tiers.medium.peek - 0.35) < 0.01);
  assert.ok(tiers.medium.rotDeg >= 3.5 && tiers.medium.rotDeg <= 4.5);
  assert.ok(Math.abs(tiers.medium.s - 0.9) < 0.011);
  assert.ok(Math.abs(tiers.wide.peek - 0.6) < 0.01);
  assert.ok(tiers.wide.rotDeg >= 3 && tiers.wide.rotDeg <= 4);
  assert.ok(Math.abs(tiers.wide.s - 0.88) < 0.011);
  // 越宽越舒展
  assert.ok(tiers.narrow.span < tiers.medium.span && tiers.medium.span < tiers.wide.span);

  // 宽屏的侧牌往下沉成一道弧
  assert.match(wide['--slot-y'], /^\d+(\.\d+)?%$/);
  assert.ok(Number.parseFloat(wide['--slot-y']) > 0);

  // 卡宽按视口分档：把每条 .deck 规则的媒体条件拿各个视口尺寸去比，按源码先后层叠出 --card-max。
  // 不认媒体查询怎么写，只认「这个视口最后用多宽的卡」
  const matches = (at, w, h) => {
    if (at === null) return true;
    if (!at.startsWith('@media ')) return false;
    return at
      .slice('@media '.length)
      .split(/\s+and\s+/)
      .every((cond) => {
        const m = cond.match(/^\((min|max)-(width|height):\s*(\d+)px\)$/);
        assert.ok(m, `认不出的媒体条件：${cond}`);
        const v = m[2] === 'width' ? w : h;
        return m[1] === 'min' ? v >= Number(m[3]) : v <= Number(m[3]);
      });
  };
  const deckRules = parseRules(css).filter((rule) => rule.selector.trim() === '.deck');
  const varsAt = (w, h) => Object.assign({}, ...deckRules.filter((rule) => matches(rule.at, w, h)).map((rule) => Object.fromEntries(declarations(rule.body))));
  // 大屏且够高才放到 360；再大一档（宽 ≥ 1600，高 ≥ 900：窗口模式的 1080p 浏览器视口高约 937–969，
  // 也要用上）放到 400。高度门槛的下限是 400px 卡时选区页不出纵向滚动的最低视口高：页面自然高
  // ≈ 216 + 1.549·W + 0.03·H，W = 400 时要 H ≥ 861（见样式表注释；实测 860 滚、861 起不滚）；
  // 上限是原先的 1000——再高就又把窗口化的 1080p 挡在外面了
  for (const [w, h, card] of [
    [375, 812, '340px'],
    [1280, 800, '340px'],
    [1366, 768, '340px'],
    [1440, 900, '360px'],
    [1536, 864, '360px'],
    [1600, 900, '400px'],
    [1920, 937, '400px'],
    [1920, 969, '400px'],
    [1920, 1080, '400px'],
    [2560, 1440, '400px'],
  ]) {
    assert.equal(varsAt(w, h)['--card-max'], card, `${w}×${h} 该用 ${card} 的卡`);
  }
  const large = deckRules.find((rule) => declarations(rule.body).some(([p, v]) => p === '--card-max' && v === '400px'));
  const gate = Number(large.at.match(/min-height:\s*(\d+)px/)?.[1]);
  assert.ok(gate >= 861 && gate <= 1000, `400 那档的高度门槛 ${gate}px：低于 861 会出纵向滚动，高于 1000 又挡住窗口化的 1080p`);
  // 那一档只换卡宽：露边比例、转角、下沉、跨度都沿用宽屏档
  assert.deepEqual(Object.fromEntries(declarations(large.body)), { '--card-max': '400px' });

  // 第三层：中宽屏往上退得更多（净露 = 位移 − (1 − 缩放)/2），接它的上内边距按卡宽取、装得下那截
  const strip = (vars) => -Number.parseFloat(vars['--slot-back-y']) / 100 - (1 - Number(vars['--slot-back-scale'])) / 2;
  assert.ok(Math.abs(strip(narrow) - 0.06) < 0.001, '窄屏净露 6% 卡高');
  assert.ok(strip(wide) > strip(narrow), '宽屏第三层要退得更明显');
  const pad = wide['--viewport-pad'].match(/^calc\(var\(--card-w\) \* ([\d.]+)\)$/);
  assert.ok(pad, '中宽屏的上内边距按卡宽取');
  assert.ok(Number(pad[1]) >= strip(wide) * (10 / 7), '上内边距接不住第三层退出去的那截');
});

test('a card off the front shows no clipped text: only a title that fits its exposed strip, swapped by a cross-fade', () => {
  const deck = code(fs.readFileSync(deckPath, 'utf8'));
  const css = stripComments(fs.readFileSync(deckCssPath, 'utf8'));
  const rules = parseRules(css);

  // 结构：每张牌左右各一份侧位标题（读屏跳过），字就是卡名。按标签结构取，属性写在哪个位置都行
  const sideTitles = jsxByClass(deck, 'sideTitle');
  for (const side of ['L', 'R']) {
    const tag = sideTitles.find((t) => new RegExp(`styles\\.sideTitle${side}\\b`).test(t.attrs.get('className')));
    assert.ok(tag, `缺 .sideTitle${side}`);
    assert.ok(['"true"', "'true'", '{true}'].includes(tag.attrs.get('aria-hidden')), `.sideTitle${side} 要对读屏隐藏`);
    assert.equal(squash(jsxChildren(deck, tag)), '{t.zone.title[zone.id]}');
  }
  assert.equal(sideTitles.length, 2, '每张牌只有左右两份侧位标题');

  // 非前位：正文整块淡出；窄屏连编号、徽章也淡出（露边太窄，它们会被前牌切成半个）
  for (const slot of ['slotLeft', 'slotRight', 'slotBack']) {
    assert.equal(cascade(css, `.${slot} .body`).opacity, '0', `${slot} 的正文没淡出`);
    for (const chip of ['no', 'badge']) {
      assert.equal(cascade(css, `.${slot} .${chip}`, { media: '(max-width: 639px)' }).opacity, '0', `窄屏 ${slot} 的 .${chip}`);
    }
  }
  // 侧位标题平时不显示；只在中宽屏、只在对应的那一侧显示（左侧牌显示贴左的那份，右侧牌贴右的）
  assert.equal(cascade(css, '.sideTitle').opacity, '0');
  assert.equal(cascade(css, '.slotLeft .sideTitleL', { media: '(min-width: 640px)' }).opacity, '1');
  assert.equal(cascade(css, '.slotRight .sideTitleR', { media: '(min-width: 640px)' }).opacity, '1');
  for (const rule of rules) {
    for (const selector of rule.selector.split(',')) {
      const subj = subject(selector);
      if (!/^sideTitle[LR]?$/.test(subj)) continue;
      for (const [prop, value] of declarations(rule.body)) {
        if (prop !== 'opacity' || value === '0') continue;
        const side = subj.slice(-1);
        assert.match(selector, side === 'L' ? /\.slotLeft\b/ : /\.slotRight\b/, `${selector.trim()} 让侧位标题出现在了别的槽位`);
        assert.equal(rule.at, '@media (min-width: 640px)', '窄屏的露边放不下一行字，不给侧位标题');
      }
    }
  }

  // 贴外侧、对齐写死：位置与对齐只由 .sideTitleL / .sideTitleR 自己定，与槽位、屏宽无关——
  // 转牌时槽位类名一换，字不会跳到另一边；随槽位变的只许是 opacity 与 transition（正文同理）
  assert.equal(cascade(css, '.sideTitleL')['text-align'], 'left');
  assert.ok(cascade(css, '.sideTitleL').left, '左侧那份贴左');
  assert.equal(cascade(css, '.sideTitleR')['text-align'], 'right');
  assert.ok(cascade(css, '.sideTitleR').right, '右侧那份贴右');
  assert.equal(cascade(css, '.sideTitle').position, 'absolute');
  assert.equal(cascade(css, '.sideTitle')['pointer-events'], 'none');
  assert.match(cascade(css, '.sideTitle')['overflow-wrap'] ?? '', /^(break-word|anywhere)$/, '长单词要折进露出的宽度里');
  for (const rule of rules) {
    for (const selector of rule.selector.split(',')) {
      const subj = subject(selector);
      if (!/^(sideTitle[LR]?|body)$/.test(subj)) continue;
      if (selector.trim() === `.${subj}` && rule.at === null) continue;
      for (const [prop] of declarations(rule.body)) {
        assert.ok(['opacity', 'transition', 'animation'].includes(prop), `${rule.at ?? ''} ${selector.trim()} 随槽位 / 屏宽改了 ${prop}`);
      }
    }
  }

  // 交叉淡变：只动 opacity；淡入的一方等淡出的一方走完才来，同一张卡上不会同时浮着两行标题。
  // 按 transition 简写解析、时间求成毫秒：120ms 与 0.12s、先写缓动还是先写延迟都一样
  const timing = (value) => {
    const items = parseTransition(value);
    assert.ok(items.length === 1 && items[0].property === 'opacity', `只许 opacity 的过渡：${value}`);
    return { duration: timeMs(items[0].duration), delay: timeMs(items[0].delay) };
  };
  const pairs = [
    ['.body', '.slotFront .body', null],
    ['.sideTitle', '.slotLeft .sideTitleL', '(min-width: 640px)'],
    ['.sideTitle', '.slotRight .sideTitleR', '(min-width: 640px)'],
    ['.no', '.slotFront .no', null],
    ['.badge', '.slotFront .badge', null],
  ];
  for (const [outSel, inSel, media] of pairs) {
    const out = timing(cascade(css, outSel).transition);
    const into = timing(cascade(css, inSel, { media }).transition);
    assert.equal(out.delay, 0, `${outSel} 淡出不等`);
    assert.ok(into.delay >= out.duration, `${inSel} 淡入（延迟 ${into.delay}ms）没等 ${outSel} 淡出（${out.duration}ms）走完`);
    assert.ok(into.delay + into.duration <= TURN_MS, `${inSel} 的淡入要在转牌（${TURN_MS}ms）内走完`);
  }

  // 光效关：这些交叉淡变直接切换——每条过渡都有一条光效关的 transition: none 选中它的全部元素、
  // 并在层叠上压住它（`.slotFront .body` 那条只管前牌，盖不住侧牌正文的淡出）。
  // 减动效那一侧由 reduced-motion.test 的通用守卫逐条查
  const OFF = /\[data-fx='off'\]/;
  const offRules = rules.filter((rule) => OFF.test(rule.selector));
  for (const rule of rules) {
    if (rule.inReduced || OFF.test(rule.selector)) continue;
    const moving = declarations(rule.body).some(([prop, value]) => prop === 'transition' && value !== 'none');
    if (!moving) continue;
    for (const selector of rule.selector.split(',')) {
      if (!/^(sideTitle[LR]?|body|no|badge)$/.test(subject(selector))) continue;
      const won = offRules.some(
        (off) =>
          declarations(off.body).some(([p, v]) => p === 'transition' && v === 'none') &&
          off.selector.split(',').some((offSel) => overrides(off, offSel, rule, selector, { allow: FX_OFF_ROOT })),
      );
      assert.ok(won, `光效关时 ${selector.trim()} 的淡变没被压成直接切换`);
    }
  }
});

test('the side title never runs under the front card, in any tier and at any card size', () => {
  const css = stripComments(fs.readFileSync(deckCssPath, 'utf8'));
  const deckVars = (media) => cascade(css, '.deck', { media });
  const narrow = deckVars(null);
  const medium = { ...narrow, ...deckVars('(min-width: 640px)') };
  const wide = { ...medium, ...deckVars('(min-width: 1024px)') };

  const H = 10 / 7;
  const coverFrac = Number(cascade(css, '.card')['--cover-frac']);
  const title = cascade(css, '.sideTitle');
  const body = cascade(css, '.body');

  // 宽度上限真的就是 --side-read：下面按各档几何核的是这个变量，样式上没接上的话核了也白核
  assert.equal(evalLength(title['max-width'], { '--side-read': 123.4 }), 123.4, '.sideTitle 的 max-width 要读 --side-read');

  // 与正文标题同一行、同一道侧边距：top = 封面底边 + .body 的上内边距（按卡高求值，两张卡宽各核一遍）；
  // 贴左那份的 left、贴右那份的 right = .body 的左 / 右内边距。改了正文的内边距却没跟着改，这里就红
  const topAt = (cardW) => evalLength(title.top, { '%': cardW * H, '--cover-frac': coverFrac });
  for (const cardW of [340, 400]) {
    const expected = coverFrac * cardW * H + evalLength(body['padding-top']);
    assert.ok(Math.abs(topAt(cardW) - expected) < 1e-6, `侧位标题的 top（${topAt(cardW)}px）没落在正文标题那一行（${expected}px）`);
  }
  const pad = evalLength(cascade(css, '.sideTitleL').left);
  assert.equal(pad, evalLength(body['padding-left']), '贴左那份与正文的左内边距不一致');
  assert.equal(evalLength(cascade(css, '.sideTitleR').right), evalLength(body['padding-right']), '贴右那份与正文的右内边距不一致');

  // 侧位标题的纵向范围（离卡心的距离，单位卡宽 W）：顶 = 上面那个 top；底 = 两行字
  const fontPx = evalLength(title['font-size']);
  const blockPx = evalLength(title['padding-top'], { em: fontPx }) + 2 * Number(title['line-height']) * fontPx;
  assert.ok(Number.isFinite(blockPx) && blockPx > 0, '侧位标题的行高 / 上内边距求不出来');

  const check = (name, vars, cardW) => {
    const s = Number(vars['--slot-scale']);
    const theta = (Number.parseFloat(vars['--slot-rot']) * Math.PI) / 180;
    const x = Number.parseFloat(vars['--slot-x']) / 100;
    // 侧牌自身坐标里、离卡心纵向 v 处露在前牌之外的宽度（单位 W）；左右两张镜像对称
    const exposed = (v) => 0.5 - (0.5 - x) / (s * Math.cos(theta)) - v * Math.tan(theta);
    const vTop = topAt(cardW) / cardW - H / 2;
    const vBottom = vTop + blockPx / cardW;
    const strip = Math.min(exposed(vTop), exposed(vBottom)) * cardW;
    const read = evalLength(title['max-width'], { '--side-read': evalLength(vars['--side-read'], { '--card-w': cardW }) });
    assert.ok(read + pad + 4 <= strip, `${name} ${cardW}px：侧位标题最宽 ${read.toFixed(1)}px + 外侧 ${pad}px，露出的只有 ${strip.toFixed(1)}px`);
    assert.ok(read >= 4 * fontPx, `${name} ${cardW}px：侧位标题连四个汉字都放不下（${read.toFixed(1)}px）`);
  };
  check('中屏', medium, 340);
  for (const cardW of [340, 360, 400]) check('宽屏', wide, cardW);
});

test('a card that just turned ignores clicks for as long as it is still sliding', async () => {
  const { acceptsActivation, activationSource } = await import('../src/components/deck/turnGuard.ts');
  const deckSrc = fs.readFileSync(deckPath, 'utf8');
  // 剥掉注释再看接线：被注释掉的守卫不算数
  const deck = code(deckSrc);
  const css = stripComments(fs.readFileSync(deckCssPath, 'utf8'));

  // 纯函数：上次转牌的时刻 + 当前时刻 → 接不接受这次激活
  assert.equal(TURN_MS, 350);
  assert.equal(acceptsActivation(Number.NEGATIVE_INFINITY, 0), true, '还没转过牌');
  assert.equal(acceptsActivation(1000, 1000), false, '转牌的同一刻');
  assert.equal(acceptsActivation(1000, 1100), false, '双击的第二下（100ms）');
  assert.equal(acceptsActivation(1000, 1000 + TURN_MS - 1), false, '过渡还差 1ms');
  assert.equal(acceptsActivation(1000, 1000 + TURN_MS), true, '过渡走完');
  assert.equal(acceptsActivation(1000, 5000), true);
  assert.equal(acceptsActivation(1000, 900), true, '时钟回拨不能把卡锁死');
  assert.equal(acceptsActivation(1000, Number.NaN), true);
  assert.equal(acceptsActivation(1000, 1200, { windowMs: 150 }), true, '窗口可配');

  // 来源 × 距上次转牌多久 → 接不接受：指针（不说来源也按指针算）在窗口内一律不认；键盘任何时候都认——
  // 鼠标点侧牌后焦点停在它的命中层上，紧接着按 Enter / 空格展开是有意的，不能被吞掉
  for (const [elapsed, pointerOk] of [
    [0, false],
    [100, false],
    [TURN_MS - 1, false],
    [TURN_MS, true],
    [5000, true],
    [-100, true],
  ]) {
    assert.equal(acceptsActivation(1000, 1000 + elapsed), pointerOk, `不说来源（按指针算），距转牌 ${elapsed}ms`);
    assert.equal(acceptsActivation(1000, 1000 + elapsed, { source: 'pointer' }), pointerOk, `指针，距转牌 ${elapsed}ms`);
    assert.equal(acceptsActivation(1000, 1000 + elapsed, { source: 'keyboard' }), true, `键盘，距转牌 ${elapsed}ms`);
  }
  // 来源从 click 的 detail 认：0 是键盘在按钮上按 Enter / 空格合成的（或程序调 click()），≥ 1 是指针连击数
  assert.equal(activationSource({ detail: 0 }), 'keyboard');
  assert.equal(activationSource({ detail: 1 }), 'pointer');
  assert.equal(activationSource({ detail: 2 }), 'pointer');

  // 守卫窗口与槽位位移的过渡只有一个出处：组件把 TURN_MS 写成 --turn-ms，样式表的转牌过渡读它
  const fromGuard = namedImports(deckSrc, './turnGuard');
  assert.ok(fromGuard.has('TURN_MS') && fromGuard.has('acceptsActivation'), '组件要从 ./turnGuard 拿常量与判定');
  const root = jsxOpening(deck, 'styles.deck}');
  assert.match(attrValue(root.attrs.get('style')) ?? '', /['"]--turn-ms['"]: `\$\{TURN_MS\}ms`/, '--turn-ms 要由 TURN_MS 写出');
  const slide = parseTransition(cascade(css, '.card').transition);
  const env = { '--turn-ms': TURN_MS };
  for (const prop of ['transform', 'opacity']) {
    const item = slide.find((t) => t.property === prop);
    assert.ok(item && item.duration.includes('var(--turn-ms)'), `槽位的 ${prop} 过渡要读 --turn-ms`);
    assert.equal(timeMs(item.duration, env), TURN_MS);
  }
  assert.equal(timeMs(slide.find((t) => t.property === 'z-index')?.delay, env), TURN_MS / 2, '层级在转牌的正中翻面');
  // 别处不再各写一个与 TURN_MS 等长的时长（写成 350ms 还是 0.35s 都算）
  for (const rule of parseRules(css)) {
    for (const [prop, value] of declarations(rule.body)) {
      if (!/^(transition|animation)(-duration|-delay)?$/.test(prop)) continue;
      for (const token of splitValue(value.replace(/,/g, ' '))) {
        if (/^(?:\d*\.)?\d+m?s$/.test(token)) {
          assert.notEqual(timeMs(token), TURN_MS, `${rule.selector} 的 ${prop} 又各写了一个 ${token}，该读 var(--turn-ms)`);
        }
      }
    }
  }

  // 接线（在剥过注释、归一过空白的代码上按结构查，改名、换序、换行都不影响）：
  // 守卫函数就是「拿转牌时刻与此刻去问 acceptsActivation」的那个，名字不论
  const guardDecl = deck.match(/const (\w+) = \(([^()]*)\) => acceptsActivation\((\w+)\.current, performance\.now\(\)/);
  assert.ok(guardDecl, '找不到守卫函数（拿转牌时刻与此刻去问 acceptsActivation）');
  const [, guard, guardParams, turnedRef] = guardDecl;
  const guardReturn = new RegExp(`if \\(!${guard}\\(([^()]*(?:\\([^()]*\\))?[^()]*)\\)\\) return;`);
  const onClickOf = (anchor) => attrValue(jsxOpening(deck, anchor).attrs.get('onClick'));
  // 守卫把「这一下从哪来」原样交给 acceptsActivation
  const sourceParam = guardParams.match(/^\s*(\w+)/)?.[1];
  assert.ok(sourceParam, '守卫函数要能接收激活的来源');
  const [guardCall] = calls(namedFn(deck, guard), 'acceptsActivation');
  assert.match(guardCall.args, new RegExp(`\\b${sourceParam}\\b`), '守卫要把来源交给 acceptsActivation');

  // 快速开始：开考之前先过守卫；不说来源（按指针算）——键盘按的也要等牌停稳，转牌中途不会误开考
  const quick = fnBody(onClickOf('className={styles.quickBtn}'));
  const quickGuard = guardReturn.exec(quick);
  assert.ok(quickGuard, '快速开始要过守卫');
  assert.ok(quickGuard.index < quick.indexOf('quickStart.onStart()'), '守卫要在开考之前');
  assert.match(quickGuard[1], /^(?:['"]pointer['"])?$/, '快速开始不给键盘开口子');

  // 命中层：展开前牌之前先过守卫（守卫写在分支外还是写进前牌那一支都行），来源取自这次 click：
  // 键盘按的照常展开，指针点的在窗口内不认
  const hitFn = onClickOf('className={styles.hit}');
  const hit = fnBody(hitFn);
  const hitGuard = guardReturn.exec(hit);
  assert.ok(hitGuard && hitGuard.index < hit.indexOf('onOpen(zone.id)'), '命中层展开前牌之前要过守卫');
  const [clickEvent] = fnParams(hitFn);
  assert.ok(clickEvent, '命中层的 onClick 要接住 click 事件（来源从它的 detail 认）');
  assert.match(hitGuard[1], new RegExp(`^activationSource\\(${clickEvent}\\)$|\\b${clickEvent}\\.detail\\b`), '命中层要把这次 click 的来源交给守卫');
  const frontIf = hit.indexOf('if (isFront) {');
  assert.ok(frontIf >= 0, '命中层按前牌 / 侧牌分两支');
  const sideBranch = hit.replace(balanced(hit, hit.indexOf('{', frontIf)), '');
  assert.match(sideBranch, new RegExp(`${turnedRef}\\.current = performance\\.now\\(\\);`), '点侧牌当下就记转牌时刻');
  assert.match(sideBranch, /onFront\(zone\.id\);/);

  // 前牌不论因何而变，变了之后都记一笔
  const frontEffect = effects(deck).find((e) => e.deps?.length === 1 && e.deps[0] === 'front');
  assert.ok(frontEffect, '找不到依赖 [front] 的 effect');
  assert.match(frontEffect.body, new RegExp(`${turnedRef}\\.current = performance\\.now\\(\\);`), '前牌一变就记转牌时刻');

  // 键盘：Enter 展开不经过守卫；焦点在牌里的按钮上时，Enter / 空格让给按钮自己（在展开之前先让）
  const keys = fnBody(namedFn(deck, 'onKeyDown'));
  assert.doesNotMatch(keys, new RegExp(`\\b${guard}\\(`), '键盘展开不经过守卫');
  const enter = keys.slice(keys.search(/e\.key === ['"]Enter['"]/));
  const yieldAt = enter.search(/if \([^;]*(?:\.tagName === ['"]BUTTON['"]|instanceof HTMLButtonElement)[^;]*\) return;/);
  assert.ok(yieldAt >= 0 && yieldAt < enter.indexOf('onOpen(front)'), '焦点在按钮上时 Enter / 空格要让给按钮');
});

test('a side or back card keeps its quick start in the layout but it can be neither clicked nor focused', () => {
  const deck = code(fs.readFileSync(deckPath, 'utf8'));
  const css = stripComments(fs.readFileSync(deckCssPath, 'utf8'));

  // 样式一层：层叠后必须是 visibility: hidden（或 display: none）——两样都把按钮移出 Tab 序、
  // 也不再接点击。opacity: 0 只是看不见：照样能点、能 Tab 到，点下去就在侧牌上开考
  const idle = cascade(css, '.quickIdle');
  assert.ok(
    idle.visibility === 'hidden' || idle.display === 'none',
    `.quickIdle 层叠后是 ${JSON.stringify(idle)}，按钮还能点、能聚焦`,
  );
  // visibility 能被子孙拨回来：任何一条快速开始相关的规则都不许写 visibility: visible / 别的值
  for (const rule of parseRules(css)) {
    if (!/\.quick/.test(rule.selector)) continue;
    for (const [prop, value] of declarations(rule.body)) {
      if (prop === 'visibility') assert.equal(value, 'hidden', `${rule.selector} 把 visibility 拨成了 ${value}`);
    }
  }

  // 结构一层：挂 .quickIdle 的那个容器自己带 inert 与 aria-hidden（不单靠样式兜着），按钮在它里面。
  // 按标签结构取：属性写在哪个位置都行
  const [open] = jsxByClass(deck, 'quickIdle');
  assert.ok(open, '找不到挂 .quickIdle 的容器');
  const idleWhen = /^(?:!isFront|isFront \? undefined : true)$/;
  assert.match(attrValue(open.attrs.get('inert')) ?? '', idleWhen, '后牌的快速开始要 inert：不可点、不可聚焦、读屏跳过');
  assert.match(attrValue(open.attrs.get('aria-hidden')) ?? '', idleWhen);
  assert.match(jsxChildren(deck, open), /className=\{styles\.quickBtn\}/, '快速开始按钮得在这个 inert 容器里');
  assert.equal(subject('.quickIdle .quickBtn'), 'quickBtn');
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

test('the two zones are exclusive, so the 9.0 badge and its bank buttons report that pool alone', () => {
  const exam = fs.readFileSync(examPath, 'utf8');
  const index = readExamIndex();

  // 徽章：expandedCount 报的是扩展池本身，不再是「经典 + 扩展」的全集。
  // 期望值从数据现算——池子会随题库增长，写死只会变成维护负担
  const classic = indexForLibraryMode(index, 'classic');
  const expanded = indexForLibraryMode(index, 'hidden');
  assert.ok(expanded.length > 0 && classic.length > 0, '两个池子都得真有题，这条才有负载');
  // reserved（7.5+ 卷一征用的两道经典区题）两个池子都不进：它们只在诊断与复烤区露面
  assert.equal(
    expanded.length + classic.length,
    index.filter((entry) => !entry.diag && !entry.reserved).length,
    '两池不相交、合起来是全部非诊断、非 reserved 的题',
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
  assert.match(exam, /ZONE_KEY \} from '@\/lib\/storage'/);
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

test('the front card tilts on an inner layer and never touches the slot transform', () => {
  const deck = fs.readFileSync(deckPath, 'utf8');
  const css = fs.readFileSync(deckCssPath, 'utf8');
  const escapeRe = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  /** 顶格书写的那条规则的声明体（选择器列表、媒体查询里的同名规则都不算） */
  const rule = (selector) => css.match(new RegExp(`\\n${escapeRe(selector)} \\{[^}]*\\}`))?.[0] ?? '';
  const card = rule('.card');
  const tilt = rule('.tilt');
  const face = rule('.face');
  assert.ok(card && tilt && face, '三层规则都得在');

  // 共用 components/fx 里那一个钩子，deck 目录下不留自己的一份
  assert.equal(fs.existsSync('src/components/deck/useCardTilt.ts'), false);
  assert.match(deck, /import \{ useCardTilt \} from '@\/components\/fx\/useCardTilt';/);
  // 退场（展开动画）期间停用；ref 只挂前牌——后牌永远不倾斜
  assert.match(deck, /const tiltRef = useCardTilt<HTMLDivElement>\(\{ enabled: !leaving \}\);/);
  assert.match(deck, /ref=\{isFront \? tiltRef : undefined\}/);
  // 跟手不走 React 的逐次事件回调
  assert.doesNotMatch(deck, /onPointerMove|onPointerLeave/);

  // 三层：.card（槽位） > .tilt（只有它转，投影挂在它身上） > .face（卡面）
  assert.match(deck, /<div className=\{styles\.tilt\}>\s*<div className=\{styles\.face\}>/);
  assert.match(card, /perspective: 900px/, '景深挂在槽位层，.tilt 只转角度');
  assert.doesNotMatch(card, /overflow: hidden/, '抬起的一侧会探出原盒子，外两层不能裁');
  assert.doesNotMatch(tilt, /overflow: hidden/);
  assert.match(face, /overflow: hidden/);
  // 倾斜只在跟手时挂上，且只认前牌；静止时不挂 3D transform（前牌不常驻合成层）
  assert.doesNotMatch(tilt, /\n\s*transform:/);
  assert.match(
    css,
    /\n\.slotFront\[data-tilting\] > \.tilt \{[^}]*transform: rotateX\(var\(--tilt-rx, 0deg\)\) rotateY\(var\(--tilt-ry, 0deg\)\)/,
  );
  // 收手带回弹地回正
  assert.match(tilt, /transition: transform 560ms cubic-bezier\(0\.34, 1\.56, 0\.64, 1\)/);
  // 投影随牌一起歪：挂在 .tilt 上，槽位层自己不投影（否则抬起的一侧与投影之间漏缝）
  assert.match(tilt, /box-shadow:/);
  assert.doesNotMatch(card, /box-shadow:/);

  // 前牌的区色投影：颜色取 zones.ts 的区色，换前牌只过渡 opacity，不补间 box-shadow
  assert.match(deck, /'--tint': zone\.tint/);
  const tintShadow = rule('.tilt::before');
  assert.match(tintShadow, /color-mix\(in srgb, var\(--tint\)/);
  assert.match(tintShadow, /transition: opacity var\(--turn-ms\)/);
  const shadowTransition = tintShadow.match(/transition:([^;]*);/)?.[1] ?? '';
  assert.doesNotMatch(shadowTransition, /box-shadow|all/, '投影只交叉淡变，box-shadow 本身补间就是逐帧重绘');
  assert.match(css, /\n\.slotFront > \.tilt::before \{\s*opacity: 1;/);

  // 伪元素的补间要单列进降级块：.card / .tilt 的 transition: none 管不到它们
  const reduced = css.slice(css.lastIndexOf('@media (prefers-reduced-motion: reduce)'));
  for (const selector of [
    '.tilt',
    '.tilt::before',
    '.card::after',
    '.glare',
    '.slotFront[data-tilting] .glare',
  ]) {
    assert.match(
      reduced,
      new RegExp(`\\n\\s*${escapeRe(selector)}(,|\\s*\\{)`),
      `${selector} 没进减动效降级块`,
    );
  }
});

test('the glare lights the cover only, never the text or the buttons', () => {
  const deck = fs.readFileSync(deckPath, 'utf8');
  const css = fs.readFileSync(deckCssPath, 'utf8');
  const escapeRe = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rule = (selector) => css.match(new RegExp(`\\n${escapeRe(selector)} \\{[^}]*\\}`))?.[0] ?? '';
  const zIndex = (selector) => {
    const hit = rule(selector).match(/\n\s*z-index: (-?\d+);/);
    return hit ? Number(hit[1]) : null;
  };

  // 一层高光，在 .coverBox 里、树序在封面图之后；.coverBox 里只有图和光，一个字都没有——
  // 编号与徽章挂在 .face 上（位置照样落在封面上）
  const coverAt = deck.indexOf('<div className={styles.coverBox}');
  const coverEnd = deck.indexOf('</div>', coverAt);
  const bodyAt = deck.indexOf('<div className={styles.body}>');
  assert.ok(coverAt > 0 && coverEnd > coverAt && bodyAt > coverEnd);
  const coverJsx = deck.slice(coverAt, coverEnd);
  assert.ok(coverJsx.indexOf('className={styles.cover}') < coverJsx.indexOf('className={styles.glare}'));
  assert.doesNotMatch(coverJsx, /styles\.no\b|styles\.badge|zone\.no|badges\[|t\.zone/, '封面组里不许有字');
  const chips = deck.slice(coverEnd, bodyAt);
  assert.match(chips, /className=\{styles\.no\}/);
  assert.match(chips, /styles\.badge/);
  assert.equal((deck.match(/styles\.glare\b/g) || []).length, 1, '只有一层高光');
  assert.doesNotMatch(css, /\.face::after|glareBody|glareCover/, '不再有盖在卡面或正文上的那层');

  // 混合模式的隔离组只圈到 .coverBox：组若是整张卡面，字会随组先栅格、再随倾斜重采样而发虚
  assert.match(rule('.coverBox'), /isolation: isolate/);
  assert.equal((css.match(/isolation: isolate/g) || []).length, 1);
  assert.doesNotMatch(rule('.face'), /isolation|mix-blend-mode|z-index/);
  for (const [, selector] of css.matchAll(/\n([^\n{}]+) \{[^}]*mix-blend-mode:/g)) {
    assert.match(selector, /\.glare$/, `${selector} 也在做混合`);
  }

  // 层级：高光不设 z-index（按树序压在图上，出不了 .coverBox）；
  // 编号徽章 1 < 命中层 3 < 快速开始 4 —— 按钮与命中层的层级、可点性不变
  assert.equal(zIndex('.glare'), null);
  assert.equal(zIndex('.no'), 1);
  assert.equal(zIndex('.badge'), 1);
  assert.equal(zIndex('.hit'), 3);
  assert.equal(zIndex('.quickBtn'), 4);
  assert.match(rule('.glare'), /pointer-events: none/);

  // 几何：层与卡面同尺寸（包含块只有封面高，层高按封面占比放大回卡面高），
  // 光斑是边长 2 倍卡宽的正方形，不再是 2W × 2H 的大块；封面占比只有一个出处
  assert.match(rule('.glare'), /width: 100%;\s*height: calc\(100% \/ var\(--cover-frac\)\);/);
  assert.match(rule('.coverBox'), /flex: 0 0 calc\(var\(--cover-frac\) \* 100%\)/);
  assert.equal((css.match(/--cover-frac: /g) || []).length, 1);
  const spot = rule('.glare::after');
  assert.match(spot, /width: 200%;/);
  assert.match(spot, /aspect-ratio: 1;/);
  assert.match(spot, /margin-top: -100%;/);
  assert.match(spot, /radial-gradient\(\s*circle closest-side/);
  assert.doesNotMatch(css, /inset: -50%/);

  // 2D translate、哪儿都不挂 will-change：四张牌的高光平时不各自常驻合成层；跟手时靠补间
  // 临时提层，指针停下就撤——常驻一层会把压在上面的编号徽章连带提层、随倾斜重采样发虚
  assert.match(
    rule('.glare'),
    /transform: translate\(calc\(var\(--glare-x, 50%\) - 50%\), calc\(var\(--glare-y, 50%\) - 50%\)\)/,
  );
  assert.doesNotMatch(rule('.glare'), /translate3d/);
  assert.doesNotMatch(css.replace(/\/\*[\s\S]*?\*\//g, ''), /will-change\s*:/);
  const live = rule('.slotFront[data-tilting] .glare');
  assert.match(live, /opacity: 1/);
  assert.match(live, /transform 160ms/);

  // 混合模式按主题分：浅色 / 护眼 soft-light、深色 screen
  assert.match(rule('.glare'), /mix-blend-mode: soft-light/);
  assert.match(rule(":global([data-theme='dark']) .glare"), /mix-blend-mode: screen/);
  assert.match(rule(":global([data-theme='sepia']) .glare"), /--glare-core: /);
});

test('the tilt maps the pointer to at most ±6° and lifts the side under it', async () => {
  const deck = fs.readFileSync(deckPath, 'utf8');
  const { tiltPose, TILT_MAX_DEG } = await import('../src/lib/tilt.ts');

  // 前牌用共享的默认最大角，不自己另传一个
  assert.doesNotMatch(deck, /maxDeg/);
  assert.equal(TILT_MAX_DEG, 6);

  const rect = { left: 0, top: 0, width: 340, height: 486 };
  // 正中不倾斜
  assert.deepEqual(tiltPose(170, 243, rect), { rx: 0, ry: 0, gx: 50, gy: 50 });
  // 指针在右缘：右缘朝观者抬起（rotateY 为负）；左缘反之
  assert.equal(tiltPose(340, 243, rect).ry, -6);
  assert.equal(tiltPose(0, 243, rect).ry, 6);
  // 指针在下缘：下缘抬起（rotateX 为正）；上缘反之
  assert.equal(tiltPose(170, 486, rect).rx, 6);
  assert.equal(tiltPose(170, 0, rect).rx, -6);

  // 越界（指针在卡外一点点、或补间中的包围盒）一律夹紧，永远不超过 ±6°
  for (const [x, y] of [
    [-900, 2000],
    [3000, -50],
    [60, 900],
    [343, -2],
  ]) {
    const { rx, ry } = tiltPose(x, y, rect);
    assert.ok(Math.abs(rx) <= 6 && Math.abs(ry) <= 6, `${x},${y} 越过了 ±6°`);
  }
});
