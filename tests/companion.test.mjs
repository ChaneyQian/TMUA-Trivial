import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

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
  assert.match(component, /onClick=/);
  assert.match(component, /role="status"/);
  assert.match(component, /running-right/);
  assert.match(component, /running-left/);
  assert.match(component, /waving/);
  assert.match(component, /jumping/);
  assert.match(component, /IDLE_DURATIONS/);
  assert.match(component, /onPointerDown=/);
  assert.match(component, /onPointerMove=/);
  assert.match(component, /onPointerUp=/);
  assert.match(component, /onLostPointerCapture=/);
  assert.match(component, /window\.addEventListener\('pointerup'/);
  assert.match(css, /position:\s*fixed/);
  assert.match(css, /right:\s*max\(/);
  assert.match(css, /bottom:\s*max\(/);
  assert.match(css, /clawd-laptop\/spritesheet\.webp/);
  assert.match(css, /guga\/spritesheet\.webp/);
  assert.match(css, /frieren\/spritesheet\.webp/);
  assert.match(css, /image-rendering:\s*pixelated/);
  assert.match(css, /background-position/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});
