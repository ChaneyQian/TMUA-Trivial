import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

// 大厅的通用手感（Design §22 P8-A4）：键盘焦点环、按压态、开始按钮（扫光 / 下沉 / 抽题转圈防连点）、
// 题库按钮题数的上滑替换。答题页与 Diagnostic 不受影响。
import { cascade, declarations, parseRules, parseTransition, stripComments, subject, timeMs } from './helpers/css-rules.mjs';
import { attrValue, calls, code, fnBody, fnParams, jsxChildren, jsxOpening, namedFn } from './helpers/source.mjs';

const EXAM = 'src/components/exam/ExamApp.tsx';
const EXAM_CSS = 'src/components/exam/Exam.module.css';
const RUNNER = 'src/components/diagnostic/DiagnosticRunner.tsx';

const css = (file) => stripComments(fs.readFileSync(file, 'utf8'));

/** 选择器去掉所有 :where(…) 之后剩下的部分（只剩空白 / 组合符＝特异性为 0） */
function outsideWhere(selector) {
  let out = '';
  for (let i = 0; i < selector.length; ) {
    if (selector.startsWith(':where(', i)) {
      let depth = 0;
      let j = i + ':where'.length;
      for (; j < selector.length; j++) {
        if (selector[j] === '(') depth++;
        else if (selector[j] === ')' && --depth === 0) break;
      }
      i = j + 1;
      continue;
    }
    out += selector[i++];
  }
  return out.replace(/[\s>+~]+/g, '');
}

test('keyboard focus gets one accent ring across the lobby, at zero specificity, and never on the exam page', () => {
  const rules = parseRules(css(EXAM_CSS)).filter((rule) => /:focus-visible/.test(rule.selector) && /\.wrap\b/.test(rule.selector));
  assert.equal(rules.length, 1, '大厅的焦点环只该有一条');
  const [ring] = rules;
  assert.equal(ring.at, null, '不藏在媒体查询里');
  // 整条包在 :where() 里：特异性为 0，各处已有的自定义焦点样式都压得过它
  assert.equal(outsideWhere(ring.selector), '', `${ring.selector} 在 :where() 外面还有东西，特异性不为 0`);
  // 只认 :focus-visible，不认 :focus——鼠标点按钮不出现
  assert.doesNotMatch(ring.selector.replace(/:focus-visible/g, ''), /:focus\b/);
  const decl = Object.fromEntries(declarations(ring.body));
  assert.equal(decl.outline, '2px solid var(--accent)');
  assert.equal(decl['outline-offset'], '2px');
  assert.ok(!Object.values(decl).some((v) => /!important/.test(v)), '不许用 !important 硬顶');

  // 已有的自定义焦点样式照旧：它们都带类名（特异性 > 0），层叠上赢过这条兜底
  const own = [
    ['src/components/deck/Deck.module.css', '.viewport:focus-visible'],
    ['src/components/deck/Deck.module.css', '.hit:focus-visible'],
    ['src/components/deck/Deck.module.css', '.hit:focus'],
    ['src/components/badge/IdBadge.module.css', '.card:focus-visible'],
    ['src/components/badge/IdBadge.module.css', '.ribbon:focus-visible'],
    ['src/components/exam/Exam.module.css', '.panelLayer:focus'],
  ];
  for (const [file, selector] of own) {
    const hits = parseRules(css(file)).filter((rule) => rule.selector.split(',').some((one) => one.trim() === selector));
    assert.ok(hits.length > 0, `${file} 里的 ${selector} 不见了`);
    assert.ok(
      hits.some((hit) => declarations(hit.body).some(([prop]) => prop === 'outline')),
      `${selector} 不再自己管 outline`,
    );
    assert.notEqual(outsideWhere(selector), '', `${selector} 的特异性得大于 0`);
  }
  // 工牌的白环没被换色
  const badgeRing = parseRules(css('src/components/badge/IdBadge.module.css')).find((rule) => rule.selector === '.card:focus-visible');
  assert.match(badgeRing.body, /outline: 2px solid #ffffff/);

  // 答题页与 Diagnostic 运行时的根是 .exam，不在任何 .wrap 里面：焦点环管不到它们
  const exam = code(fs.readFileSync(EXAM, 'utf8'));
  const runner = code(fs.readFileSync(RUNNER, 'utf8'));
  assert.ok(exam.includes('<div className={styles.exam}>'), '答题页的根得是 .exam');
  assert.ok(runner.includes('<div className={examStyles.exam}>'), 'Diagnostic 运行时的根得是 .exam');
  let at = exam.indexOf('className={styles.wrap}');
  let wraps = 0;
  while (at >= 0) {
    const wrap = jsxOpening(exam, 'className={styles.wrap}', at);
    assert.doesNotMatch(jsxChildren(exam, wrap), /styles\.exam\}/, '.exam 不许嵌在 .wrap 里');
    wraps++;
    at = exam.indexOf('className={styles.wrap}', wrap.end);
  }
  assert.equal(wraps, 2, '.wrap 只是设置页与成绩页的根');
  assert.doesNotMatch(runner, /styles\.wrap\b/);
});

/** 一个类的按压规则：顶格（不在媒体查询里）、主体是这个类、带 :active 的规则，声明合在一起 */
function pressOf(cssText, cls) {
  const out = {};
  for (const rule of parseRules(cssText)) {
    if (rule.at !== null) continue;
    for (const selector of rule.selector.split(',')) {
      if (subject(selector) === cls && /:active\b/.test(selector)) Object.assign(out, Object.fromEntries(declarations(rule.body)));
    }
  }
  return out;
}

test('buttons in the setup, grill and progress panels press in to 0.97 and dim, over 80–120ms', () => {
  const pressed = [
    [EXAM_CSS, ['segBtn', 'startBtn', 'zoneBack', 'zoneTab']],
    ['src/components/grill/Grill.module.css', ['ghost', 'retry']],
    ['src/components/progress/Progress.module.css', ['back', 'ghost']],
  ];
  for (const [file, classes] of pressed) {
    const sheet = css(file);
    for (const cls of classes) {
      const press = pressOf(sheet, cls);
      assert.match(press.transform ?? '', /\bscale\(0\.97\)/, `${file} .${cls} 按下去要微缩到 0.97`);
      const dim = Number(/brightness\(([\d.]+)\)/.exec(press.filter ?? '')?.[1]);
      assert.ok(dim >= 0.88 && dim < 1, `${file} .${cls} 按下去要略压暗（brightness ${press.filter}）`);
      // 只补间 transform，80–120ms；压暗是一瞬间的状态切换（filter 不进过渡）
      const tween = parseTransition(cascade(sheet, `.${cls}`).transition ?? '');
      const move = tween.find((t) => t.property === 'transform');
      assert.ok(move, `${file} .${cls} 的按压要有 transform 过渡`);
      const ms = timeMs(move.duration);
      assert.ok(ms >= 80 && ms <= 120, `${file} .${cls} 的按压过渡 ${move.duration}，要在 80–120ms`);
      assert.ok(!tween.some((t) => /filter/.test(t.property)), `${file} .${cls} 的 filter 不进过渡`);
    }
  }
  // 开始按钮是「下沉」：除了微缩还往下落
  assert.match(pressOf(css(EXAM_CSS), 'startBtn').transform, /translateY\((?:1|2)px\)/);

  // 不作用于卡组的牌、命中层与工牌：那几层一条 :active 规则都没有（进度条那颗小钮原样保留它的 1px 下移）
  const deck = css('src/components/deck/Deck.module.css');
  for (const cls of ['card', 'tilt', 'face', 'hit', 'quickBtn', 'viewport']) {
    assert.deepEqual(pressOf(deck, cls), {}, `卡组的 .${cls} 不该有按压态`);
  }
  const badge = parseRules(css('src/components/badge/IdBadge.module.css'));
  assert.ok(!badge.some((rule) => /:active\b/.test(rule.selector)), '工牌不该有按压态');
});

// ---------------------------------------------------------------------------
// 开始按钮：抽题中转圈 + aria-busy + 置灰；start() 自己也有重入守卫（P8-A4 第 7 条）

const { runExclusive } = await import('../src/lib/exclusive.ts');

test('runExclusive lets one call through at a time and still runs its synchronous prefix right away', async () => {
  const flag = { current: false };
  let runs = 0;
  let release;
  const task = () => {
    runs++;
    return new Promise((resolve) => {
      release = resolve;
    });
  };
  const first = runExclusive(flag, task);
  // task 是同步调进去的：开考那段 requestFullscreen 仍在用户手势的调用链里
  assert.equal(runs, 1, 'task 得在调用当下就开始跑');
  assert.equal(flag.current, true);
  // 前一次还在路上：再来的一律不认，task 一行都不跑
  assert.equal(await runExclusive(flag, task), undefined);
  assert.equal(await runExclusive(flag, task), undefined);
  assert.equal(runs, 1, '连点只开一场');
  release('exam');
  assert.equal(await first, 'exam');
  assert.equal(flag.current, false, '结束之后放下旗子');
  // 失败（抽题出错）也放下旗子，错误原样抛给调用方；之后照常能再开
  await assert.rejects(runExclusive(flag, async () => {
    throw new Error('empty pool');
  }), /empty pool/);
  assert.equal(flag.current, false);
  await assert.rejects(runExclusive(flag, () => {
    throw new Error('sync throw');
  }), /sync throw/);
  assert.equal(flag.current, false, '同步抛错也放下');
  assert.equal(await runExclusive(flag, async () => 7), 7);
});

test('every way into an exam goes through the guarded start, and the fullscreen request stays in the gesture', () => {
  const exam = code(fs.readFileSync(EXAM, 'utf8'));
  const start = namedFn(exam, 'start');
  assert.ok(start, '找不到 start');
  const [param] = fnParams(start);
  const wrapped = new RegExp(String.raw`^runExclusive\((\w+), \(\) => startExam\(${param}\)\)$`).exec(fnBody(start));
  assert.ok(wrapped, 'start 得是「runExclusive(旗子, () => startExam(参数))」');
  assert.match(exam, new RegExp(String.raw`const ${wrapped[1]} = useRef\(false\);`), '旗子是跨渲染不丢的 ref');
  // 真正开考的函数只有这一个调用点：各入口都得过守卫
  assert.equal(calls(exam, 'startExam').length, 1, 'startExam 只许由 start 调');
  // requestFullscreen 在第一个 await 之前（同步调用链里才批准）
  const body = fnBody(namedFn(exam, 'startExam'));
  const fullscreen = body.indexOf('requestFullscreen');
  assert.ok(fullscreen > 0 && fullscreen < body.indexOf('await '), 'requestFullscreen 得在第一个 await 之前');
});

test('while an exam is being picked, both start buttons and the quick start spin, say busy and stay disabled', () => {
  const panel = code(fs.readFileSync('src/components/setup/SetupPanel.tsx', 'utf8'));
  const grill = code(fs.readFileSync('src/components/grill/GrillPanel.tsx', 'utf8'));
  const deck = code(fs.readFileSync('src/components/deck/CardDeck.tsx', 'utf8'));
  const exam = code(fs.readFileSync(EXAM, 'utf8'));

  /** 按钮：aria-busy 跟着「正在开考」的那个量走，置灰条件里也有它，文字前挂转圈 */
  const check = (src, anchor, flag, where) => {
    const button = jsxOpening(src, anchor);
    assert.ok(button && button.name === 'button', `${where} 找不到按钮`);
    assert.equal(attrValue(button.attrs.get('aria-busy')), `${flag} || undefined`, `${where} 的 aria-busy`);
    const escaped = flag.replace(/[.*+?^${}()|[\]\\]/g, (ch) => `\\${ch}`);
    assert.match(jsxChildren(src, button).trim(), new RegExp(String.raw`^\{${escaped} && <BusySpinner />\}`), `${where} 文字前挂转圈`);
    return button;
  };
  const setupStart = check(panel, 'className={styles.startBtn}', 'busy', '配置面板的开始按钮');
  assert.match(attrValue(setupStart.attrs.get('disabled')), /^busy \|\| /, '抽题中置灰');
  const grillStart = check(grill, 'className={examStyles.startBtn}', 'starting', '复烤区的开始按钮');
  assert.match(attrValue(grillStart.attrs.get('disabled')), /\bbusy\b/);
  const quick = check(deck, 'className={styles.quickBtn}', 'quickStart.busy', '快速开始');
  assert.equal(attrValue(quick.attrs.get('disabled')), 'quickStart.disabled');

  // 在忙不是不可用：抽题中不跟着置灰淡到一半，光标换成「进行中」
  for (const [file, cls] of [
    [EXAM_CSS, 'startBtn'],
    ['src/components/deck/Deck.module.css', 'quickBtn'],
  ]) {
    const busyLook = cascade(css(file), `.${cls}[aria-busy='true']:disabled`);
    assert.ok(Number(busyLook.opacity) >= 0.75, `${file} .${cls} 抽题中的不透明度 ${busyLook.opacity}`);
    assert.equal(busyLook.cursor, 'progress');
  }

  // 外层递进来的「正在开考」就是 phase 'loading'；快速开始的置灰条件里本来就有它
  assert.equal(attrValue(jsxOpening(exam, '<SetupPanel').attrs.get('busy')), "phase === 'loading'");
  assert.equal(attrValue(jsxOpening(exam, '<GrillPanel').attrs.get('starting')), "phase === 'loading'");
  assert.match(exam, /disabled: phase === 'loading' \|\| !index \|\| totalPool === 0, busy: phase === 'loading',/);

  // 转圈本身：只转 transform 的无限动画；减动效下停住；遮罩开着时暂停；光效关时照转（它是操作反馈）
  const spinner = css('src/components/setup/BusySpinner.module.css');
  const rules = parseRules(spinner);
  const spin = cascade(spinner, '.spinner');
  assert.match(spin.animation, /\binfinite\b/);
  const name = spin.animation.split(/\s+/).find((token) => /^[a-z][\w-]*$/i.test(token) && !['linear', 'infinite'].includes(token));
  const frames = parseRules(fs.readFileSync('src/components/setup/BusySpinner.module.css', 'utf8'));
  assert.ok(/@keyframes/.test(spinner) && spinner.includes(`@keyframes ${name}`), '转圈的关键帧得在同一份样式表里');
  assert.ok(frames.some((rule) => rule.at === `@keyframes ${name}` && /transform: rotate\(360deg\)/.test(rule.body)), '只转 transform');
  assert.equal(cascade(spinner, '.spinner', { media: '(prefers-reduced-motion: reduce)' }).animation, 'none');
  assert.ok(rules.some((rule) => /\[data-overlay\]/.test(rule.selector) && /animation-play-state: paused/.test(rule.body)));
  assert.ok(!rules.some((rule) => /\[data-fx='off'\]/.test(rule.selector)), '光效关时转圈照转——不许有光效关的规则压它');
});
