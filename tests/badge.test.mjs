import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import test from 'node:test';

import { cascade, parseRules, stripComments } from './helpers/css-rules.mjs';

const componentPath = 'src/components/badge/IdBadge.tsx';
const cssPath = 'src/components/badge/IdBadge.module.css';

/** PNG 的真实像素尺寸：IHDR 紧跟在 8 字节签名与 8 字节块头之后 */
function pngSize(file) {
  const bytes = fs.readFileSync(file);
  assert.equal(bytes.subarray(1, 4).toString('latin1'), 'PNG', `${file} 不是 PNG`);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

/** 'calc(var(--u) * 252)' → 252（卡上尺寸一律写成 u 的倍数） */
const units = (value) => Number(/^calc\(var\(--u\) \* ([\d.]+)\)$/.exec(value)?.[1]);

test('the ID badge ships its avatar and both cropped codes as static assets', () => {
  assert.equal(fs.existsSync(componentPath), true, 'missing IdBadge component');
  assert.equal(fs.existsSync(cssPath), true, 'missing IdBadge styles');
  assert.equal(fs.existsSync('public/badge/avatar.jpg'), true, 'missing badge avatar');
  assert.equal(fs.existsSync('public/badge/contact-code.png'), true, 'missing contact code');
  assert.equal(fs.existsSync('public/badge/tip-code.png'), true, 'missing tip code');
  // 背面改原生排版后，两张整页截图不再入库（git 历史里有）
  assert.equal(fs.existsSync('public/badge/contact-qr.png'), false, '旧的微信名片截图该删了');
  assert.equal(fs.existsSync('public/badge/tip-qr.png'), false, '旧的赞赏码截图该删了');

  const component = fs.readFileSync(componentPath, 'utf8');

  // 静态导出部署在 /<repo>/ 下时要带路径前缀，和 PixelCompanion 同一套规矩
  assert.match(component, /NEXT_PUBLIC_BASE_PATH/);
  assert.match(component, /badge\/avatar\.jpg/);
  assert.match(component, /badge\/contact-code\.png/);
  assert.match(component, /badge\/tip-code\.png/);
  assert.doesNotMatch(component, /contact-qr\.png|tip-qr\.png/);
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

test('the badge is a two-page fold: contact code left, tip code right', () => {
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

  // 合着时背面两页不给读屏念（看不见的就不念）；右页整个藏起来——正面绕冲孔倾斜时
  // 下缘会往回收，压在底下的这页会从卡边露出一截。藏要等合上的翻页走完，翻开时立刻显出
  assert.equal(component.split('aria-hidden={opened ? undefined : true}').length - 1, 2);
  assert.equal(cascade(css, '.rightPage').visibility, 'hidden');
  assert.match(cascade(css, '.rightPage').transition, /^visibility 0s linear 640ms$/);
  assert.equal(cascade(css, '.spreadOpen > .rightPage').visibility, 'visible');
});

test('each code is shown from its own pixels on pure white, bigger than before, never recoloured', () => {
  const component = fs.readFileSync(componentPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  // <img> 的尺寸属性就是文件的真实像素：两张码都是原截图的精确子区域，换图时这里会先红
  const contact = pngSize('public/badge/contact-code.png');
  const tip = pngSize('public/badge/tip-code.png');
  assert.match(
    component,
    new RegExp(String.raw`src=\{ASSETS\.contact\}\s*width=\{${contact.width}\}\s*height=\{${contact.height}\}`),
  );
  assert.match(component, new RegExp(String.raw`src=\{ASSETS\.tip\}\s*width=\{${tip.width}\}\s*height=\{${tip.height}\}`));

  // 白底和留白是扫得出来的前提：背面纯白（与码图自带的白边无缝），码本身与它的容器
  // 不加滤镜、不调透明度、不混合
  assert.equal(cascade(css, '.back').background, '#fff');
  for (const rule of parseRules(stripComments(css))) {
    if (!/\.(back|backBody|code|codeContact|codeTip)\b/.test(rule.selector)) continue;
    assert.doesNotMatch(rule.body, /\b(filter|opacity|mix-blend-mode)\s*:/, `${rule.selector} 会改掉码的颜色`);
  }

  // 显示尺寸不小于改版前（页宽 300 时：联系码的码区约 168px，赞赏码约 106px）。
  // 码区在图里的占比取自裁切脚本：联系码墨迹 631 / 801，赞赏码墨迹 468 / 648
  const contactShown = units(cascade(css, '.codeContact').width) * (631 / contact.width);
  const tipShown = units(cascade(css, '.codeTip').width) * (468 / tip.width);
  assert.ok(contactShown >= 168, `联系码只剩 ${contactShown.toFixed(1)}u`);
  assert.ok(tipShown >= 106, `赞赏码只剩 ${tipShown.toFixed(1)}u`);
  // 只缩不放：页宽封顶 300px（1u = 1px），DPR 3 的屏上显示也不超过文件像素
  assert.ok(units(cascade(css, '.codeContact').width) * 3 <= contact.width, '联系码会被放大显示');
  assert.ok(units(cascade(css, '.codeTip').width) * 3 <= tip.width, '赞赏码会被放大显示');
});

// 两张码的文件内容钉死。它们是从最初入库的原始截图里裁出的精确子区域：
//   git show 1095b41:public/badge/contact-qr.png（960×1418 RGBA）→ 裁 (79,359) 起 801×801
//     码 37 模块、每模块 17.05px；四周 85px 纯白 ≈ 5 模块静区
//   git show 1095b41:public/badge/tip-qr.png（1213×1213 RGBA）→ 裁 (281,118) 起 648×648
//     小程序码连同外圈极淡的光晕；光晕外四周 72px 纯白，不含 y = 804 起的感谢语
// 只做裁切 + 去 alpha（裁区 alpha 全为 255）+ 无损 PNG 编码，RGB 与原图逐字节一致。
// 钉 SHA-256 是因为这两张图被「瘦身」过一次：ae1528d 把原始截图 Lanczos 缩到 400 宽、转调色板，
// 码边从此带插值振铃，每模块只剩约 7px——看着差不多，扫码余量却少了一大截。
// 以后任何重编码、压缩、缩放都会让这里先红。真要换图：从上面的原图按同一坐标重裁、逐像素核对，
// 再更新这两个哈希（P8-B 第二轮的裁切脚本思路：sharp extract → removeAlpha → png，颜色 > 256 用真彩色）
const CODE_SHA256 = {
  'public/badge/contact-code.png': '4fbc9ad7be9dfc0b9642daba63125ae43d72e7458fd53ff02f1b95de97857800',
  'public/badge/tip-code.png': '40a1273aaf817e7660c5b1f68bae84455bcfff75562ae6c07c6cc7eece47f30f',
};

test('the two code images are byte-for-byte the pixel-exact crops, pinned by SHA-256', () => {
  for (const [file, sha] of Object.entries(CODE_SHA256)) {
    const actual = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    assert.equal(actual, sha, `${file} 被改过（重编码 / 压缩 / 缩放？）——见上方注释的重裁方法`);
  }
  assert.deepEqual(pngSize('public/badge/contact-code.png'), { width: 801, height: 801 });
  assert.deepEqual(pngSize('public/badge/tip-code.png'), { width: 648, height: 648 });
});

test('the back pages are typeset natively, word for word from the two original screenshots', () => {
  const component = fs.readFileSync(componentPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  // 原文逐字转写，不改写、不增删（直引号、「~」与折行都照原图）
  assert.match(component, /nickname: '桔栉',/);
  assert.match(component, /region: 'Zhejiang Hangzhou',/);
  assert.match(component, /hint: 'Scan QR code to add me as a friend',/);
  assert.match(component, /quote: \['"赞助将全额用于维持cc max5x订阅~', '感谢大家"'\],/);
  assert.match(component, /caption: "桔栉's Tip Code",/);
  // 两页的标签沿用改版前的页签文字
  assert.match(component, />联系 · WECHAT</);
  assert.match(component, />赞助 · TIP</);

  // 两页头带与正面同一套品牌蓝
  assert.match(cascade(css, '.band').background, /var\(--band-fill\)/);
  assert.match(cascade(css, '.backBand').background, /var\(--band-fill\)/);
  assert.match(cascade(css, '.stage')['--band-fill'], /#4a6cf7/);
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
  assert.equal(cascade(css, '.back')['box-shadow'], 'var(--card-shadow)', '正反面同一张卡的边');
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
  // 挂扣压在卡上但不收指针：跟手与点卡翻面都穿透它。织带照旧收点击（点挂绳不算点背景）
  assert.equal(cascade(css, '.lanyard')['pointer-events'], 'none');
  assert.equal(cascade(css, '.strap')['pointer-events'], 'auto');

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
