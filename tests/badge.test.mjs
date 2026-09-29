import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import test from 'node:test';

import { cascade, declarations, evalLength, parseRules, splitValue, stripComments, subject } from './helpers/css-rules.mjs';
import { attrValue, balanced, calls, code, effects, fnBody, jsxByClass, jsxChildren } from './helpers/source.mjs';
import ts from 'typescript';

import { badgeStops, nextFocus, onBadgeKey } from '../src/components/badge/focusTrap.ts';

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

// 结构断言一律在剥掉注释、归一空白之后的代码上做（tests/helpers/source.mjs）：
// 注释掉的代码不算数，换行、属性先后、等价改写不该让断言红

/** 剥注释后的源码里一个数值常量：`const NAME = 8;` → 8 */
function constNumber(src, name) {
  return Number(new RegExp(`const ${name} = (-?[\\d.]+);`).exec(src)?.[1]);
}

/** 对象字面量 `{ a: x, b: y && z }` → Map（只切顶层逗号；值原样保留） */
function objectLiteral(text) {
  const out = new Map();
  let depth = 0;
  let current = '';
  for (const ch of `${text.trim().replace(/^\{|\}$/g, '')},`) {
    if ('([{'.includes(ch)) depth++;
    else if (')]}'.includes(ch)) depth--;
    if (ch === ',' && depth === 0) {
      const at = current.indexOf(':');
      if (at > 0) out.set(current.slice(0, at).trim(), current.slice(at + 1).trim());
      current = '';
    } else current += ch;
  }
  return out;
}

/** 开始标签 className 里用到的 styles.* 类名 */
const stylesOf = (tag) => [...String(tag.attrs.get('className') ?? '').matchAll(/styles\.(\w+)/g)].map((m) => m[1]);

/** 开始标签 tag 的全部带 styles.* 类名的祖先标签（由外到内），按 JSX 的嵌套结构算 */
function jsxAncestors(src, tag) {
  const names = new Set([...src.matchAll(/styles\.(\w+)/g)].map((m) => m[1]));
  const out = [];
  for (const name of names) {
    for (const t of jsxByClass(src, name)) {
      if (t.selfClosing || t.start >= tag.start || out.some((o) => o.start === t.start)) continue;
      if (tag.start < t.end + jsxChildren(src, t).length) out.push(t);
    }
  }
  return out.sort((a, b) => a.start - b.start);
}

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
  assert.match(component, /prefers-reduced-motion:\s*reduce/);
});

// ---------------------------------------------------------------------------
// 键盘：Esc 收起；Tab / Shift+Tab 只在卡片与「收起工牌」之间循环（轻量焦点陷阱）

/** 一个会记录焦点的假停靠点；focused() 读当前焦点 */
function focusRing() {
  let active = null;
  const make = (name) => {
    const el = { name, focus: () => (active = el) };
    return el;
  };
  return { make, focused: () => active, set: (el) => (active = el) };
}

/** 假按键事件：记下有没有被 preventDefault */
function key(k, mods = {}) {
  const e = { key: k, shiftKey: false, ...mods, prevented: false };
  e.preventDefault = () => (e.prevented = true);
  return e;
}

test('Tab and Shift+Tab cycle between the card and the stow button; Esc stows; other keys pass through', () => {
  const ring = focusRing();
  const card = ring.make('card');
  const stowBtn = ring.make('stow');
  let stowed = 0;
  const stow = () => stowed++;
  const press = (e) => onBadgeKey(e, [card, stowBtn], ring.focused(), stow);

  // 焦点在卡上：Tab → 收起按钮 → 回到卡（首尾相接），每一下都拦下默认的焦点移动
  ring.set(card);
  let e = key('Tab');
  assert.equal(press(e), true);
  assert.equal(ring.focused(), stowBtn);
  assert.equal(e.prevented, true, 'Tab 要拦下默认行为，否则焦点跑到身后的设置页');
  press(key('Tab'));
  assert.equal(ring.focused(), card);
  // Shift+Tab 反向
  press(key('Tab', { shiftKey: true }));
  assert.equal(ring.focused(), stowBtn);
  press(key('Tab', { shiftKey: true }));
  assert.equal(ring.focused(), card);

  // 焦点不在停靠点上（在 body 上）：Tab 去第一个，Shift+Tab 去最后一个
  ring.set({ name: 'body' });
  press(key('Tab'));
  assert.equal(ring.focused(), card);
  ring.set(null);
  press(key('Tab', { shiftKey: true }));
  assert.equal(ring.focused(), stowBtn);

  // Esc：收起、不动焦点。设置页那边的 Esc「退回选区」不靠这里拦冒泡（window 是冒泡的最后一站），
  // 靠的是 ExamApp 自己「有 aria-modal 对话框就不动」的判断，见 progress.test
  ring.set(card);
  e = key('Escape');
  assert.equal(press(e), true);
  assert.equal(stowed, 1);
  assert.equal(e.prevented, false);
  assert.equal(ring.focused(), card);

  // 其它键、以及带 Alt / Ctrl / Meta 的 Tab（浏览器与系统的组合键）一概不拦
  for (const other of [key('Enter'), key(' '), key('a'), key('Tab', { ctrlKey: true }), key('Tab', { altKey: true }), key('Tab', { metaKey: true })]) {
    assert.equal(press(other), false, `${other.key} 不该被拦`);
    assert.equal(other.prevented, false);
    assert.equal(ring.focused(), card);
  }
  assert.equal(stowed, 1);

  // 还没挂载的停靠点跳过；一个都没有就不拦
  assert.equal(nextFocus(key('Tab'), [null, stowBtn], card), stowBtn);
  assert.equal(nextFocus(key('Tab', { shiftKey: true }), [card, undefined], card), card);
  assert.equal(nextFocus(key('Tab'), [null, null], card), null);
});

test('while the badge is still dropping in, the invisible stow button is not a Tab stop', () => {
  // 「收起工牌」在提示行里，提示行 1.25s 后才淡入；落下途中它是 opacity 0 的
  const ring = focusRing();
  const card = ring.make('card');
  const stowBtn = ring.make('stow');
  assert.deepEqual(badgeStops('dropping', card, stowBtn), [card]);
  assert.deepEqual(badgeStops('resting', card, stowBtn), [card, stowBtn]);
  assert.deepEqual(badgeStops('flying', card, stowBtn), [card, stowBtn]);

  // 落下途中：Tab / Shift+Tab 都只落在卡片上（从 body 出发也一样），照样拦下默认的焦点移动
  for (const from of [null, card, { name: 'body' }]) {
    for (const shiftKey of [false, true]) {
      ring.set(from);
      const e = key('Tab', { shiftKey });
      assert.equal(onBadgeKey(e, badgeStops('dropping', card, stowBtn), ring.focused(), () => {}), true);
      assert.equal(ring.focused(), card, `落下途中 ${shiftKey ? 'Shift+' : ''}Tab 落到了看不见的按钮上`);
      assert.equal(e.prevented, true);
    }
  }
  // 落稳之后照常在两者之间转
  ring.set(card);
  onBadgeKey(key('Tab'), badgeStops('resting', card, stowBtn), ring.focused(), () => {});
  assert.equal(ring.focused(), stowBtn);
});

/** 把剥过注释的一段 TSX 代码包成函数真跑：先用 TypeScript 去掉类型标注，names 是它用到的外部名字 */
function runnable(body, names) {
  const js = ts.transpileModule(`function __run(${names.join(', ')}) {\n${body}\n}`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText;
  return new Function(`${js}\nreturn __run;`)();
}

test('the key handler is wired to the card and the stow button while the overlay is up', () => {
  const src = code(fs.readFileSync(componentPath, 'utf8'));
  // 浮层开着时挂在 window 上：Esc 与焦点陷阱都走 ./focusTrap。按语义判——把这段 effect 真跑一遍，
  // 看它挂了什么监听、监听收到按键时把什么交给 onBadgeKey、清理时摘没摘干净
  const keydown = effects(src).filter(({ body }) => body.includes("'keydown'"));
  assert.equal(keydown.length, 1, '只该有一个 keydown effect');
  const { body, deps } = keydown[0];
  for (const dep of ['visible', 'stow', 'stage']) assert.ok(deps.includes(dep), `effect 依赖里少了 ${dep}`);

  const names = ['visible', 'stage', 'stow', 'badgeRef', 'stowRef', 'onBadgeKey', 'badgeStops', 'window', 'document'];
  const run = runnable(body, names);
  const card = { name: 'card' };
  const stowBtn = { name: 'stow' };
  const active = { name: 'active' };
  const stow = () => {};
  const fakeWindow = () => {
    const listeners = new Map();
    return {
      listeners,
      addEventListener: (type, fn) => listeners.set(type, fn),
      removeEventListener: (type, fn) => listeners.get(type) === fn && listeners.delete(type),
    };
  };

  // 不在屏上：什么都不挂
  let win = fakeWindow();
  assert.equal(run(false, 'stowed', stow, { current: card }, { current: stowBtn }, () => {}, badgeStops, win, {}), undefined);
  assert.equal(win.listeners.size, 0);

  for (const stage of ['dropping', 'resting', 'flying']) {
    win = fakeWindow();
    const received = [];
    const cleanup = run(true, stage, stow, { current: card }, { current: stowBtn }, (...args) => received.push(args), badgeStops, win, { activeElement: active });
    assert.equal(typeof win.listeners.get('keydown'), 'function', `${stage}：没挂 keydown`);
    const event = { key: 'Tab', shiftKey: false };
    win.listeners.get('keydown')(event);
    assert.equal(received.length, 1);
    const [e, stops, focused, stowFn] = received[0];
    assert.equal(e, event);
    assert.deepEqual(stops, badgeStops(stage, card, stowBtn), `${stage}：停靠点不对`);
    assert.equal(focused, active, '当前焦点要现读 document.activeElement');
    assert.equal(stowFn, stow);
    cleanup();
    assert.equal(win.listeners.size, 0, `${stage}：清理时没摘掉监听`);
  }

  // 两个停靠点的 ref 挂在对的元素上
  assert.equal(jsxByClass(src, 'stowBtn')[0]?.attrs.get('ref'), '{stowRef}');
  assert.equal(jsxByClass(src, 'card')[0]?.attrs.get('ref'), '{badgeRef}');
});

test('once opened, a keyboard focus on the flipped-away card still shows, as a ring around the whole spread', () => {
  const css = fs.readFileSync(cssPath, 'utf8');
  // 翻开后卡片按钮转到了背面，它自己的焦点环跟着看不见；焦点在它身上时整个跨页外画一圈
  const ring = cascade(css, '.spreadOpen:has(.card:focus-visible)');
  assert.equal(ring.outline, '2px solid #ffffff');
  assert.equal(ring['outline-offset'], cascade(css, '.card:focus-visible')['outline-offset'], '与合上时同一圈');
  assert.equal(ring['border-radius'], 'var(--card-r)');
});

/** 'translateY(calc(var(--u) * 3)) rotate(4.2deg)' 里某个变换函数的参数（括号可以嵌套） */
function transformArg(value, fn) {
  const at = String(value ?? '').indexOf(`${fn}(`);
  if (at < 0) return undefined;
  let depth = 0;
  for (let i = at + fn.length; i < value.length; i++) {
    if (value[i] === '(') depth++;
    else if (value[i] === ')' && --depth === 0) return value.slice(at + fn.length + 1, i);
  }
  return undefined;
}

/** @keyframes 名 → Map(关键帧位置 → { opacity, translateY, rotate })，from / to 记作 0% / 100% */
function keyframes(css, name) {
  const out = new Map();
  for (const rule of parseRules(stripComments(css))) {
    if (rule.at !== `@keyframes ${name}`) continue;
    const decl = Object.fromEntries(declarations(rule.body));
    for (const raw of rule.selector.split(',')) {
      const offset = { from: '0%', to: '100%' }[raw.trim()] ?? raw.trim();
      out.set(offset, {
        opacity: decl.opacity,
        translateY: transformArg(decl.transform, 'translateY'),
        rotate: transformArg(decl.transform, 'rotate'),
      });
    }
  }
  return out;
}

test('the lanyard travels with the card on the way down and back up, so the clip never leaves the punch hole', () => {
  const css = fs.readFileSync(cssPath, 'utf8');

  for (const [card, lanyard, cardSel, lanyardSel] of [
    ['badgeDrop', 'lanyardDrop', '.flyer', '.lanyard'],
    ['badgeRetract', 'lanyardRetract', '.overlayLeaving .flyer', '.overlayLeaving .lanyard'],
  ]) {
    // 两边挂的是这两套关键帧，时长、缓动、填充方式逐字相同（只差名字）
    const [cardName, ...cardTiming] = cascade(css, cardSel).animation.split(' ');
    const [lanyardName, ...lanyardTiming] = cascade(css, lanyardSel).animation.split(' ');
    assert.equal(cardName, card);
    assert.equal(lanyardName, lanyard);
    assert.equal(lanyardTiming.join(' '), cardTiming.join(' '), `${lanyardSel} 与 ${cardSel} 的时长 / 缓动不同步`);

    // 关键帧位置一样、每一帧的上下位移与透明度一样；挂绳不转（转了下端就甩开了）
    const a = keyframes(css, card);
    const b = keyframes(css, lanyard);
    assert.ok(a.size >= 3, `找不到 @keyframes ${card}`);
    assert.deepEqual([...b.keys()], [...a.keys()], `${lanyard} 的关键帧位置与 ${card} 不同`);
    for (const [offset, frame] of a) {
      assert.equal(b.get(offset).translateY, frame.translateY, `${offset} 处挂绳与卡的位移不同`);
      assert.equal(b.get(offset).opacity, frame.opacity, `${offset} 处挂绳与卡的透明度不同`);
      assert.equal(b.get(offset).rotate, undefined, `${lanyard} 不该转`);
      // 位移只用 vh 与 u：百分比按各自的盒子算，卡和挂绳高度不同就对不上
      if (frame.translateY) assert.doesNotMatch(frame.translateY, /%/, `${card} ${offset} 用了百分比`);
    }

    // 回弹只有几个 u：挂绳跟着同样的位移走，幅度压小是为了读起来像卡在晃、不像整根绳在弹
    for (const [offset, frame] of a) {
      const u = /^calc\(var\(--u\) \* (-?[\d.]+)\)$/.exec(frame.translateY ?? '')?.[1];
      if (u !== undefined) assert.ok(Math.abs(Number(u)) <= 3, `${card} ${offset} 回弹 ${u}u`);
    }
  }
  // 旧的 scaleY 伸缩那一套不在了
  assert.doesNotMatch(stripComments(css), /scaleY\(/);
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

  // 合着时背面两页不给读屏念（看不见的就不念）、翻开后能读到。按 opened 真假把表达式求一遍：
  // `opened ? undefined : true`、`!opened || undefined` 之类的等价写法都算
  const src = code(component);
  for (const cls of ['rightPage', 'faceInner']) {
    const [tag] = jsxByClass(src, cls);
    const expr = attrValue(tag?.attrs.get('aria-hidden'));
    assert.equal(typeof expr, 'string', `.${cls} 没有 aria-hidden`);
    const hidden = new Function('opened', `return (${expr});`);
    assert.ok([true, 'true'].includes(hidden(false)), `.${cls} 合着时要对读屏隐藏`);
    assert.ok([undefined, null, false, 'false'].includes(hidden(true)), `.${cls} 翻开后要能读到`);
  }
  // 右页整个藏起来——正面绕冲孔倾斜时下缘会往回收，压在底下的这页会从卡边露出一截。
  // 藏要等合上的翻页走完，翻开时立刻显出
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

  // 白底和留白是扫得出来的前提：背面纯白（与码图自带的白边无缝）。不改色见下一条
  assert.equal(cascade(css, '.back').background, '#fff');

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

/** 会改掉码颜色的属性，与它们「什么都不改」的那个值 */
const NEUTRAL = { opacity: '1', filter: 'none', '-webkit-filter': 'none', 'mix-blend-mode': 'normal' };

test('nothing between the page and a code recolours it: not the image, not any ancestor, in any state', () => {
  const src = code(fs.readFileSync(componentPath, 'utf8'));
  const rules = parseRules(stripComments(fs.readFileSync(cssPath, 'utf8'))).filter((rule) => !/^@keyframes/.test(rule.at ?? ''));

  for (const [cls, page] of [['codeContact', 'faceInner'], ['codeTip', 'rightPage']]) {
    const [img] = jsxByClass(src, cls);
    assert.equal(img?.name, 'img', `找不到 .${cls} 那张图`);
    const own = new Set(stylesOf(img));
    // 祖先链从 JSX 的嵌套结构里取，不手抄：整页浮层、翻页组、所在那一页、背面白板都在上面
    const ancestors = new Set(jsxAncestors(src, img).flatMap(stylesOf));
    for (const layer of ['overlay', 'stage', 'flyer', 'spread', 'page', page, 'back', 'backBody']) {
      assert.ok(ancestors.has(layer), `.${cls} 的祖先链里没有 .${layer}`);
    }

    // 每一条可能选中它们的规则都算（带状态限定的 .spreadOpen > .rightPage、媒体查询里的都算）：
    // 不是只看此刻层叠的赢家——哪个状态下赢了都会改色
    for (const rule of rules) {
      for (const selector of rule.selector.split(',')) {
        const [classes, pseudo] = subject(selector).split('::');
        const hits = classes.split('|').filter((c) => own.has(c) || ancestors.has(c));
        if (hits.length === 0) continue;
        const where = `${rule.at ? `${rule.at} ` : ''}${selector.trim()}`;
        for (const [prop, value] of declarations(rule.body)) {
          if (pseudo) {
            // 祖先的伪元素是叠在上面的一层：它自己的透明度无所谓，混合与背后模糊会改掉身后码的颜色
            if (prop === 'mix-blend-mode' || prop === 'backdrop-filter') {
              assert.ok(/^(normal|none)$/.test(value), `${where} { ${prop}: ${value} } 会改掉码的颜色`);
            }
            continue;
          }
          if (prop in NEUTRAL) assert.equal(value, NEUTRAL[prop], `${where} { ${prop}: ${value} } 会改掉码的颜色`);
          // 图本身连插值方式也不许换：pixelated 缩小会整行整列地丢像素
          if (prop === 'image-rendering' && hits.some((c) => own.has(c))) {
            assert.equal(value, 'auto', `${where} { ${prop}: ${value} }`);
          }
        }
      }
    }
  }

  // 浮层再往外：ExamApp 的 .wrap > .stage，然后是 <body> / <html>，外加全局的 * 与 img 规则
  const exam = parseRules(stripComments(fs.readFileSync('src/components/exam/Exam.module.css', 'utf8')));
  for (const rule of exam) {
    for (const selector of rule.selector.split(',')) {
      const subj = subject(selector);
      if (subj.includes('::') || !subj.split('|').some((c) => c === 'wrap' || c === 'stage')) continue;
      for (const [prop, value] of declarations(rule.body)) {
        if (prop in NEUTRAL) assert.equal(value, NEUTRAL[prop], `Exam.module.css ${selector.trim()} { ${prop}: ${value} }`);
      }
    }
  }
  const globals = parseRules(stripComments(fs.readFileSync('src/app/globals.css', 'utf8')));
  for (const rule of globals) {
    for (const selector of rule.selector.split(',')) {
      const last = selector.trim().split(/\s+|>|\+|~/).filter(Boolean).pop() ?? '';
      if (!/^(\*|html|body|img|:root)(?![\w-])/.test(last)) continue;
      for (const [prop, value] of declarations(rule.body)) {
        if (prop in NEUTRAL) assert.equal(value, NEUTRAL[prop], `globals.css ${selector.trim()} { ${prop}: ${value} }`);
      }
    }
  }
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

  // 选项按语义判：先后顺序、写字面量还是常量都行
  const src = code(component);
  const tiltCalls = calls(src, 'useCardTilt<HTMLDivElement>');
  assert.equal(tiltCalls.length, 1, '工牌只挂一个倾斜钩子');
  const options = objectLiteral(tiltCalls[0].args);
  const number = (value) => (/^-?[\d.]+$/.test(value) ? Number(value) : constNumber(src, value));
  assert.equal(number(options.get('maxDeg')), 8, '±8°');
  assert.equal(number(options.get('settleMs')), 900, '指针停住 900ms 回平');
  // 只在静止挂着、且合着时跟手：四个阶段 × 开合逐一求值
  const enabled = new Function('stage', 'opened', `return (${options.get('enabled')});`);
  for (const stage of ['stowed', 'dropping', 'resting', 'flying']) {
    for (const opened of [false, true]) {
      assert.equal(Boolean(enabled(stage, opened)), stage === 'resting' && !opened, `enabled 在 ${stage}${opened ? '（翻开）' : ''} 时不对`);
    }
  }
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
  // 挂绳容器不收指针（它是一整块 260u 宽的盒子，大半是空的）。卡顶之上画出来的零件——织带、
  // 开口圈、压扣、鸭嘴扣高出卡顶的那一截（.clipGrip）——各自收点击：点到它们不算点背景、不会收起；
  // 压在卡面上的扣片下半与扣舌不收指针，指针落到卡上，扫过卡顶正中倾斜不断
  assert.equal(cascade(css, '.lanyard')['pointer-events'], 'none');
  assert.equal(cascade(css, '.clip')['pointer-events'], 'none', '扣件压在卡面上的部分收了指针，倾斜会断');
  // 几何（单位 u，以挂绳容器底为 0、往上为正）：卡顶在 hole-y + 1u
  const env = { '--u': 1, '%': 1000 };
  env['--hole-y'] = evalLength(cascade(css, '.stage')['--hole-y'], env);
  const lanyardBottom = evalLength(cascade(css, '.lanyard').bottom, env);
  const cardTop = env['%'] - lanyardBottom; // 舞台顶 = 卡顶；容器底离舞台顶 hole-y + 1u
  assert.equal(cardTop, env['--hole-y'] + 1);
  const box = (sel) => {
    const rule = cascade(css, sel);
    const bottom = evalLength(rule.bottom, env);
    return { bottom, top: bottom + evalLength(rule.height, env) };
  };
  for (const part of ['.strap', '.ring', '.crimp', '.clipGrip']) {
    assert.equal(cascade(css, part)['pointer-events'], 'auto', `${part} 点了会穿到背景上、把工牌收起`);
    assert.ok(box(part).bottom >= cardTop, `${part} 伸进了卡面，会挡住指针`);
  }
  // 抓手正好是扣片高出卡顶的那一截：底边落在卡顶、顶边与扣片顶齐
  const clip = box('.clip');
  const grip = box('.clipGrip');
  assert.ok(clip.bottom < cardTop, '扣片本来就压在卡面上（所以它自己不收指针）');
  assert.equal(grip.bottom, cardTop);
  assert.equal(grip.top, clip.top);
  assert.equal(cascade(css, '.clipGrip').width, cascade(css, '.clip').width);

  // 首登自动落下那次静默聚焦（不亮焦点环）；点丝带取出交给浏览器判断。
  // 按结构判：卡片只在一处被程序聚焦、那一处没被注释掉，参数按「是不是自动落下」求值
  const focusCalls = [...src.matchAll(/badgeRef\.current\?\.focus\(/g)].map((m) =>
    balanced(src, m.index + m[0].length - 1).slice(1, -1).trim(),
  );
  assert.equal(focusCalls.length, 1, '卡片只在一处被程序聚焦');
  const QUIET = { focusVisible: false };
  const focusArg = new Function('autoDropRef', 'QUIET_FOCUS', `return (${focusCalls[0]});`);
  assert.equal(focusArg({ current: true }, QUIET), QUIET, '首登自动落下：静默聚焦');
  assert.notEqual(focusArg({ current: false }, QUIET), QUIET, '点丝带取出：交给浏览器自己判断');
  assert.match(src, /const QUIET_FOCUS(?::[^=]+)? = \{ focusVisible: false \};/);
  // 聚焦发生在落到「挂着」的那一刻；autoDropRef 在首登落下前置 true、点丝带取出时置 false
  const focusEffect = effects(src).find(({ body }) => body.includes('badgeRef.current?.focus('));
  assert.deepEqual(focusEffect?.deps, ['stage']);
  // 把这段 effect 按四个阶段 × 是否自动落下真跑一遍：只在落到「挂着」时聚焦一次，自动落下时静默
  const runFocus = runnable(focusEffect.body, ['stage', 'badgeRef', 'autoDropRef', 'QUIET_FOCUS']);
  for (const stage of ['stowed', 'dropping', 'resting', 'flying']) {
    for (const auto of [true, false]) {
      const got = [];
      runFocus(stage, { current: { focus: (...args) => got.push(args) } }, { current: auto }, QUIET);
      assert.equal(got.length, stage === 'resting' ? 1 : 0, `${stage} 时聚焦了 ${got.length} 次`);
      if (got.length) assert.equal(got[0][0] === QUIET, auto, auto ? '自动落下要静默聚焦' : '点丝带取出不该静默');
    }
  }
  const firstVisit = effects(src).find(({ body }) => body.includes('localStorage.getItem(SEEN_KEY)'));
  const armed = firstVisit?.body.indexOf('autoDropRef.current = true;') ?? -1;
  assert.ok(armed >= 0 && armed < firstVisit.body.indexOf("setStage('dropping')"), '首登落下之前要记下「这是自动落下」');
  const showAt = src.indexOf('const show = useCallback(');
  assert.ok(showAt >= 0);
  assert.match(fnBody(balanced(src, src.indexOf('(', showAt)).slice(1, -1)), /autoDropRef\.current = false;/);

  // 挂绳与卡面上的装饰读屏一律跳过（按结构取标签，不按字面搜）
  for (const deco of ['lanyard', 'microprint', 'backMicro', 'punch', 'chip', 'barcode', 'holo', 'sheen']) {
    const tags = jsxByClass(src, deco);
    assert.ok(tags.length > 0, `找不到 .${deco}`);
    for (const tag of tags) assert.equal(tag.attrs.get('aria-hidden'), '"true"', `.${deco} 是装饰，读屏不念`);
  }
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

test('every styles.* the component uses exists in the stylesheet (no "undefined" in a class list)', () => {
  // 早先 .fit 上挂过一个样式表里没有的 styles.fitOpen：CSS Modules 取不到就是 undefined，
  // class 里真出现一个 "undefined"（审查实测）
  const src = code(fs.readFileSync(componentPath, 'utf8'));
  const defined = new Set(
    parseRules(stripComments(fs.readFileSync(cssPath, 'utf8'))).flatMap((rule) =>
      [...rule.selector.matchAll(/\.([\w-]+)/g)].map((m) => m[1]),
    ),
  );
  const used = [...new Set([...src.matchAll(/styles\.(\w+)/g)].map((m) => m[1]))];
  assert.ok(used.length > 40);
  assert.deepEqual(used.filter((name) => !defined.has(name)), [], '这些类名样式表里没有');
});

/**
 * CSS 长度表达式求值（单位 px）：认 px、rem（16）、vw / vh（给定视口）、var(--u)、calc、min、max、clamp
 * 与 + − × ÷。写成 max(6px, …) 还是 clamp(6px, …, …)、min 套 max，都按真值算，不按写法认
 */
function cssPx(value, { u = 1, vw = 0, vh = 0 } = {}) {
  const expr = String(value ?? '')
    .trim()
    .replace(/var\(--u\)/g, `(${u})`)
    .replace(/(\d*\.?\d+)vw\b/g, (_, n) => `(${n} * ${vw} / 100)`)
    .replace(/(\d*\.?\d+)vh\b/g, (_, n) => `(${n} * ${vh} / 100)`)
    .replace(/(\d*\.?\d+)rem\b/g, (_, n) => `(${n} * 16)`)
    .replace(/(\d*\.?\d+)px\b/g, '$1')
    .replace(/\bclamp\(/g, '__clamp(')
    .replace(/\bmin\(/g, '__min(')
    .replace(/\bmax\(/g, '__max(')
    .replace(/\bcalc\(/g, '(');
  if (!/^[\d.\s+\-*/(),_a-z]+$/.test(expr)) return Number.NaN;
  try {
    return Number(
      Function('__clamp', '__min', '__max', `"use strict"; return (${expr});`)(
        (lo, v, hi) => Math.max(lo, Math.min(v, hi)),
        Math.min,
        Math.max,
      ),
    );
  } catch {
    return Number.NaN;
  }
}

/** font 简写里的字号（斜杠前那一段）；font-size 直接用 */
function fontSizeOf(rule) {
  if (rule['font-size']) return rule['font-size'];
  const tokens = splitValue(rule.font ?? '');
  const slash = tokens.indexOf('/');
  return slash > 0 ? tokens[slash - 1] : tokens.at(-2);
}

test('the smallest print on the card still has a readable floor on a 375px screen', () => {
  const css = fs.readFileSync(cssPath, 'utf8');
  // 求值器自检：等价写法得出同一个下限（max、clamp、min 套 max 都认）
  assert.equal(cssPx('max(6px, calc(var(--u) * 7.8))', { u: 0.5 }), 6);
  assert.equal(cssPx('clamp(6px, calc(var(--u) * 7.8), 40px)', { u: 0.5 }), 6);
  assert.equal(cssPx('min(40px, max(6px, calc(var(--u) * 7.8)))', { u: 0.5 }), 6);
  assert.equal(cssPx('calc(var(--u) * 7.8)', { u: 1 }), 7.8);

  // 页宽按样式表里的定义现算：min(300px, (100vw − 2rem) / 2, (100vh − 7.5rem) × 54 / 85.6)；1u = 页宽 / 300
  const pageW = cssPx(cascade(css, '.stage')['--page-w'], { vw: 375, vh: 812 });
  assert.equal(pageW, 171.5);
  const u = pageW / 300;
  // 卡上尺寸等比缩，小字缩到 6px 以下就只剩一团灰：这几样给最小字号
  for (const [selector, floor] of [
    ['.fieldLabel', 6],
    ['.serial', 6],
    ['.title', 6],
    ['.backCaption', 7],
  ]) {
    const size = cssPx(fontSizeOf(cascade(css, selector)), { u });
    assert.ok(size >= floor, `${selector} 在 375 宽时只有 ${size.toFixed(2)}px`);
  }
  // 微缩印字本来就是要小（防伪线），不在此列：它就该跟着缩
  assert.ok(cssPx(fontSizeOf(cascade(css, '.microprint')), { u }) < 3);
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
