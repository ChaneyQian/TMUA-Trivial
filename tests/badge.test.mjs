import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { cascade, parseRules, stripComments } from './helpers/css-rules.mjs';

const componentPath = 'src/components/badge/IdBadge.tsx';
const cssPath = 'src/components/badge/IdBadge.module.css';

/** 'calc(var(--u) * 252)' → 252（卡上尺寸一律写成 u 的倍数） */
const units = (value) => Number(/^calc\(var\(--u\) \* ([\d.]+)\)$/.exec(value)?.[1]);

test('the ID badge ships its avatar and both QR plates as static assets', () => {
  assert.equal(fs.existsSync(componentPath), true, 'missing IdBadge component');
  assert.equal(fs.existsSync(cssPath), true, 'missing IdBadge styles');
  assert.equal(fs.existsSync('public/badge/avatar.jpg'), true, 'missing badge avatar');
  assert.equal(fs.existsSync('public/badge/contact-qr.png'), true, 'missing contact QR');
  assert.equal(fs.existsSync('public/badge/tip-qr.png'), true, 'missing tip QR');

  const component = fs.readFileSync(componentPath, 'utf8');

  // 静态导出部署在 /<repo>/ 下时要带路径前缀，和 PixelCompanion 同一套规矩
  assert.match(component, /NEXT_PUBLIC_BASE_PATH/);
  assert.match(component, /badge\/avatar\.jpg/);
  assert.match(component, /badge\/contact-qr\.png/);
  assert.match(component, /badge\/tip-qr\.png/);
});

test('the badge drops on first visit only, then lives behind the ribbon', () => {
  const component = fs.readFileSync(componentPath, 'utf8');

  // 键名本身登记在 lib/storage.ts（见 storage.test.mjs），组件只负责用对那一个
  assert.match(component, /BADGE_SEEN_KEY as SEEN_KEY \} from '@\/lib\/storage'/);
  assert.match(component, /localStorage\.getItem\(SEEN_KEY\)/);
  assert.match(component, /localStorage\.setItem\(SEEN_KEY, '1'\)/);
  // 收起是顺着挂绳往上收回，纯 CSS，不再量位置做 FLIP：
  // 早先斜飞到角落等于把挂绳剪断，物理上说不通
  assert.doesNotMatch(component, /getBoundingClientRect/);
  assert.doesNotMatch(component, /--fly-/);
  const css = fs.readFileSync(cssPath, 'utf8');
  assert.match(css, /@keyframes badgeRetract/);
  assert.match(css, /translateY\(-125vh\)/);
  assert.match(component, /'Escape'/);
  assert.match(component, /prefers-reduced-motion:\s*reduce/);
});

test('the badge is a two-page fold: contact QR left, tip QR right', () => {
  const component = fs.readFileSync(componentPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  assert.match(component, /aria-modal="true"/);
  assert.match(component, /alt="微信联系方式二维码"/);
  assert.match(component, /alt="微信赞助码"/);
  assert.match(component, /alt="作者卡通形象"/);

  // 左翼绕书脊翻转，正反两面各自朝外一次
  assert.match(css, /transform-style:\s*preserve-3d/);
  assert.match(css, /backface-visibility:\s*hidden/);
  assert.match(css, /rotateY\(180deg\)/);
  assert.match(css, /transform-origin:\s*100%\s*50%/);

  // 二维码必须留白底，扫码要靠对比度和静默区
  assert.match(css, /\.qrPlate[\s\S]*?background:\s*#fff/);
  assert.match(css, /object-fit:\s*contain/);
  // 右页整个藏起来——正面绕冲孔倾斜时下缘会往回收，压在底下的这页会从卡边露出一截。
  // 藏要等合上的翻页走完，翻开时立刻显出
  assert.equal(cascade(css, '.rightPage').visibility, 'hidden');
  assert.match(cascade(css, '.rightPage').transition, /^visibility 0s linear 640ms$/);
  assert.equal(cascade(css, '.spreadOpen > .rightPage').visibility, 'visible');
});

test('the front is a CR80 card with a cut edge, a bevel highlight and a two-layer shadow, whatever the theme', () => {
  const css = fs.readFileSync(cssPath, 'utf8');
  const stage = cascade(css, '.stage');

  // ISO/IEC 7810 ID-1：54 × 85.6mm，圆角 3.18mm；页宽仍按视口收（375px 下两页并排放得下）
  assert.equal(stage['--page-h'], 'calc(var(--page-w) * 85.6 / 54)');
  assert.equal(stage['--card-r'], 'calc(var(--page-w) * 3.18 / 54)');
  assert.match(stage['--page-w'], /^min\(300px, calc\(\(100vw - 2rem\) \/ 2\),/);
  assert.equal(stage['--u'], 'calc(var(--page-w) / 300)');

  const card = cascade(css, '.card');
  assert.equal(card['border-radius'], 'var(--card-r)');
  assert.equal(card['box-shadow'], 'var(--card-shadow)');
  // 切边：1px 深色半透明；接触阴影 + 环境阴影
  const shadow = stage['--card-shadow'];
  assert.match(shadow, /^0 0 0 1px rgb\(8 12 30 \/ \d+%\)/);
  assert.ok(shadow.split(/,(?![^(]*\))/).length >= 3, '切边之外至少还有接触与环境两层');
  // 倒角高光：内侧 1px 白线，单起一层压在头带之上（inset 阴影画在子元素底下）
  assert.match(cascade(css, '.card::after')['box-shadow'], /^inset 0 0 0 1px rgb\(255 255 255/);

  // 蓝色发光描边去掉了：焦点环只给键盘，白色且离开卡边
  const focus = cascade(css, '.card:focus-visible');
  assert.doesNotMatch(focus.outline, /#6fc3ff/);
  assert.match(focus['outline-offset'], /var\(--u\)/);

  // 实体卡不随主题重刷漆：不引页面的主题 token，也没有按主题改写的规则
  assert.doesNotMatch(stripComments(css), /var\(--(text|text-muted|border|surface|surface-alt|bg|accent|accent-light)\)/);
  assert.doesNotMatch(css, /data-theme/);
});

test('the front reads like an ID: CMU Serif name, labelled fields, microprint, barcode and the date', () => {
  const component = fs.readFileSync(componentPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  assert.match(cascade(css, '.name').font, /var\(--font-content\)/);
  assert.doesNotMatch(css, /Times New Roman/);

  // 字段值沿用原有卡面文字，不另编
  assert.match(component, /team: 'COMPETITION COACH',/);
  assert.match(component, /location: 'Zhejiang',/);
  assert.match(component, /\{ label: 'ROLE', value: IDENTITY\.team \}/);
  assert.match(component, /\{ label: 'REGION', value: IDENTITY\.location \}/);

  // 微缩印字与织带印字；条码与 Last Update 保留
  assert.match(component, /'TMUA · MAT · STEP · '\.repeat\(/);
  assert.match(component, /'MCQ TEST · TMUA · '\.repeat\(/);
  assert.match(component, /<span className=\{styles\.serial\}>\{IDENTITY\.serial\}<\/span>/);
  assert.match(component, /styles\.barcode/);
  const micro = Number(/calc\(var\(--u\) \* ([\d.]+)\)/.exec(cascade(css, '.microprint').font)?.[1]);
  assert.ok(micro > 0 && micro <= 5, `微缩印字要足够小（现在 ${micro}u）`);

  // 冲孔（带内阴影）+ 纯 CSS 画的挂扣
  assert.match(cascade(css, '.punch')['box-shadow'], /^inset /);
  for (const part of ['strap', 'ring', 'crimp', 'clip']) {
    assert.match(component, new RegExp(String.raw`styles\.${part}\b`), `挂绳少了 ${part}`);
  }
  assert.match(cascade(css, '.strap').background, /repeating-linear-gradient\(\s*58deg/, '织带要有斜纹');
});

test('the front tilts ±8° on an inner layer, pivots on the punch hole and levels off when the pointer rests', () => {
  const component = fs.readFileSync(componentPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  assert.match(component, /const TILT_DEG = 8;/);
  assert.match(component, /const SETTLE_MS = 900;/);
  assert.match(
    component,
    /useCardTilt<HTMLDivElement>\(\{\s*maxDeg: TILT_DEG,\s*settleMs: SETTLE_MS,\s*enabled: stage === 'resting' && !opened,\s*\}\)/,
  );
  // ref 挂在不转的外层；外层给景深、自己不转
  assert.match(component, /<div ref=\{tiltRef\} className=\{styles\.tiltHost\}>/);
  const host = cascade(css, '.tiltHost');
  assert.ok(host.perspective, '景深给在外层');
  assert.equal(host.transform, undefined);
  // 里层按变量转，且只在跟手期间挂 transform（静止时字按原样栅格化，不发软）
  assert.equal(
    cascade(css, '.tiltHost[data-tilting] > .card').transform,
    'rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))',
  );
  assert.equal(cascade(css, '.card').transform, undefined);
  // 卡、落下的摆动、挂扣都以冲孔为准：吊着的卡绕挂点摆，扣舌一直咬在孔里
  assert.equal(cascade(css, '.card')['transform-origin'], '50% var(--hole-y)');
  assert.equal(cascade(css, '.flyer')['transform-origin'], '50% var(--hole-y)');
  assert.match(cascade(css, '.lanyard').bottom, /var\(--hole-y\)/);
  assert.match(cascade(css, '.punch').top, /var\(--hole-y\)/);
  // 挂扣压在卡上但不收指针：跟手与点卡翻面都穿透它
  assert.equal(cascade(css, '.lanyard')['pointer-events'], 'none');

  // 首登自动落下那次静默聚焦（不亮焦点环）；点丝带取出交给浏览器判断
  assert.match(component, /focus\(autoDropRef\.current \? QUIET_FOCUS : undefined\)/);
  assert.match(component, /focusVisible: false/);
});

test('material feedback lives in one small holo patch that follows the glare, plus a sheen only while tilting', () => {
  const css = fs.readFileSync(cssPath, 'utf8');
  const OFF = ":global(:root[data-fx='off'])";

  const holo = cascade(css, '.holo::before');
  assert.match(holo.background, /conic-gradient/);
  assert.match(holo.transform, /var\(--glare-x, 50%\)/);
  assert.match(holo.transform, /var\(--glare-y, 50%\)/);

  // 扫光平时透明，只在跟手期间显出，位置跟着高光坐标
  assert.equal(cascade(css, '.sheen').opacity, '0');
  assert.equal(cascade(css, '.tiltHost[data-tilting] .sheen').opacity, '1');
  assert.match(cascade(css, '.sheen::before').transform, /var\(--glare-x, 50%\)/);

  // 正面不用混合模式：混合要一个隔离组，组里的字会整片栅格化、随倾斜发虚
  const front = stripComments(css.slice(css.indexOf('.tiltHost {'), css.indexOf('/* ============ 背面')));
  assert.ok(front.length > 1000, '找不到正面那一段');
  assert.doesNotMatch(front, /mix-blend-mode/);
  // 卡上没有任何无限循环的动画
  assert.doesNotMatch(front, /infinite/);

  // 光效关、减动效：扫光层整个摘掉（倾斜本身由钩子管：一个监听都不挂）
  assert.equal(cascade(css, `${OFF} .sheen`).display, 'none');
  assert.equal(cascade(css, '.sheen', { media: '(prefers-reduced-motion: reduce)' }).display, 'none');
});

test('the stowed badge is a 3D ribbon anchored to the setup stage corner', () => {
  const css = fs.readFileSync(cssPath, 'utf8');
  const examCss = fs.readFileSync('src/components/exam/Exam.module.css', 'utf8');
  const exam = fs.readFileSync('src/components/exam/ExamApp.tsx', 'utf8');

  assert.match(exam, /<IdBadge\s*\/>/);
  // 丝带绝对定位吊在左上角，需要一个 position: relative 的参照。
  // 堆叠卡片改版后真正的锚点是 .stage（选区一级页没有 .setupCard，
  // 两态得共用一个锚），几何与改版前一致；见 tests/deck.test.mjs。
  // 下面这条留着是兼容性约定：.setupCard 仍是定位上下文，
  // 丝带要挂回卡片本身时不必再改 CSS。
  assert.match(examCss, /\.setupCard\s*\{[\s\S]*?position:\s*relative/);
  assert.match(css, /\.ribbon\s*\{[\s\S]*?position:\s*absolute/);
  assert.match(css, /\.ribbon\s*\{[\s\S]*?perspective:/);
  assert.match(css, /\.ribbonFold[\s\S]*?rotateX\(/);
  assert.match(css, /clip-path:\s*polygon/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});
