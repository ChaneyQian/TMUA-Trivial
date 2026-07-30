import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const componentPath = 'src/components/companion/PixelCompanion.tsx';
const cssPath = 'src/components/companion/PixelCompanion.module.css';

test('a keyboard-accessible pixel companion lives in the bottom-right corner', () => {
  assert.equal(fs.existsSync(componentPath), true, 'missing PixelCompanion component');
  assert.equal(fs.existsSync(cssPath), true, 'missing PixelCompanion styles');

  const component = fs.readFileSync(componentPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');
  const page = fs.readFileSync('src/app/page.tsx', 'utf8');

  assert.match(page, /<PixelCompanion\s*\/>/);
  assert.match(component, /aria-label="和 Trivial 小助手互动"/);
  assert.match(component, /onClick=/);
  assert.match(component, /role="status"/);
  assert.match(component, /<svg/);
  assert.doesNotMatch(component, /<img/);
  assert.match(component, /data-part="eyes"/);
  assert.match(component, /onPointerDown=/);
  assert.match(component, /onPointerMove=/);
  assert.match(component, /onPointerUp=/);
  assert.match(css, /position:\s*fixed/);
  assert.match(css, /right:\s*max\(/);
  assert.match(css, /bottom:\s*max\(/);
  assert.match(css, /@keyframes\s+petIdle/);
  assert.match(css, /@keyframes\s+petBlink/);
  assert.match(css, /@keyframes\s+tapReact/);
  assert.match(css, /@keyframes\s+dragRun/);
  assert.match(css, /@keyframes\s+releaseBounce/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});
