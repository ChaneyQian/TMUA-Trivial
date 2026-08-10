import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const componentPath = 'src/components/badge/IdBadge.tsx';
const cssPath = 'src/components/badge/IdBadge.module.css';

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

  assert.match(component, /mcq-test:badge-seen:v1/);
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
