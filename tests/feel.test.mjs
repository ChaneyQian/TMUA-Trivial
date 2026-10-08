import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

// 大厅的通用手感（Design §22 P8-A4）：键盘焦点环、按压态、开始按钮（扫光 / 下沉 / 抽题转圈防连点）、
// 题库按钮题数的上滑替换。答题页与 Diagnostic 不受影响。
import { cascade, declarations, parseRules, parseTransition, stripComments, subject, timeMs } from './helpers/css-rules.mjs';
import { segmentedGroups } from './helpers/segmented-groups.mjs';
import { attrValue, calls, code, effects, fnBody, fnParams, jsxChildren, jsxOpening, namedFn } from './helpers/source.mjs';

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
  // （后面可以再并上别的条件——05 密卷在开放窗口外时也置灰——但开头这三条一条不少）
  assert.equal(attrValue(jsxOpening(exam, '<SetupPanel').attrs.get('busy')), "phase === 'loading'");
  assert.equal(attrValue(jsxOpening(exam, '<GrillPanel').attrs.get('starting')), "phase === 'loading'");
  assert.match(exam, /disabled: phase === 'loading' \|\| !index \|\| totalPool === 0(?: \|\| [^,]+)?, busy: phase === 'loading',/);

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

test('the start buttons sweep a slanted light across once on hover, as pure decoration', () => {
  const sheet = css(EXAM_CSS);
  const rules = parseRules(sheet);
  // 亮带的舞台：按钮自己是定位参照、裁掉斜出去的部分、把亮带圈在底色之上文字之下
  const button = cascade(sheet, '.startBtn');
  assert.equal(button.position, 'relative');
  assert.equal(button['overflow-x'], 'hidden');
  assert.equal(button.isolation, 'isolate');
  const band = cascade(sheet, '.startBtn::before');
  assert.equal(band.position, 'absolute');
  assert.equal(band['z-index'], '-1', '亮带垫在文字底下');
  assert.equal(band['pointer-events'], 'none');
  assert.equal(band.opacity, '0', '平时看不见');
  const parked = Number(/translateX\((-?[\d.]+)%\)/.exec(band.transform)?.[1]);
  assert.ok(parked <= -105, `平时停在按钮左外侧（${band.transform}）`);
  const width = Number.parseFloat(band.width) / 100;

  // 只在有悬停的设备上、只在可按的时候扫；走一次，不循环
  const hover = rules.filter((rule) => rule.at === '@media (hover: hover)' && /\.startBtn:hover:not\(:disabled\)::before/.test(rule.selector));
  assert.equal(hover.length, 1);
  const animation = Object.fromEntries(declarations(hover[0].body)).animation;
  assert.doesNotMatch(animation, /\binfinite\b/);
  const name = animation.split(/\s+/)[0];
  const ms = timeMs(animation.split(/\s+/)[1]);
  assert.ok(ms >= 400 && ms <= 1000, `一道扫光 ${ms}ms`);
  // 关键帧只动 transform / opacity，终点整条掠出按钮右缘
  const frames = rules.filter((rule) => rule.at === `@keyframes ${name}`);
  assert.ok(frames.length >= 2, `找不到 @keyframes ${name}`);
  for (const frame of frames) {
    for (const [prop] of declarations(frame.body)) assert.ok(['transform', 'opacity'].includes(prop), `扫光的关键帧动了 ${prop}`);
  }
  const end = frames.find((frame) => /^(to|100%)$/.test(frame.selector.trim()));
  const travel = Number(/translateX\((-?[\d.]+)%\)/.exec(end.body)?.[1]) / 100;
  assert.ok(travel * width >= 1.05, `终点没掠出右缘（${travel * 100}% × 带宽 ${width * 100}%）`);

  // 装饰性：光效关时整个不画；减动效下不播（按压、转圈这些操作反馈另算，见上面几条）
  assert.equal(cascade(sheet, ":global(:root[data-fx='off']) .startBtn::before").display, 'none');
  const reduced = { media: '(prefers-reduced-motion: reduce)' };
  assert.equal(cascade(sheet, '.startBtn::before', reduced).animation, 'none');
  assert.equal(cascade(sheet, '.startBtn:hover:not(:disabled)::before', reduced).animation, 'none');

  // 扫的就是这两颗开始按钮：配置面板的「开始 Test」与复烤区的「开始复烤」都用 .startBtn；答题页与 Diagnostic 不用
  assert.ok(code(fs.readFileSync('src/components/setup/SetupPanel.tsx', 'utf8')).includes('className={styles.startBtn}'));
  assert.ok(code(fs.readFileSync('src/components/grill/GrillPanel.tsx', 'utf8')).includes('className={examStyles.startBtn}'));
  assert.doesNotMatch(code(fs.readFileSync(EXAM, 'utf8')), /styles\.startBtn\b/);
  assert.doesNotMatch(code(fs.readFileSync(RUNNER, 'utf8')), /Styles\.startBtn\b|styles\.startBtn\b/);
});

// ---------------------------------------------------------------------------
// 题库按钮题数的上滑替换（P8-A4 第 8 条）

const { ROLL_MS, rollTo, settleRoll, startRoll } = await import('../src/lib/rolling.ts');

test('a changed count rolls the old number out and the new one in, never on the first frame', () => {
  // 刚挂上：只有一份、gen 0（不播）
  const first = startRoll('359 题', 359);
  assert.deepEqual(first, { key: 359, text: '359 题', prev: null, gen: 0 });
  // 什么都没变：原样返回同一个对象（渲染期调用不会来回重渲染）
  assert.equal(rollTo(first, '359 题', 359), first);
  // 数没变、只是换了语言：就地换字，不播（gen 不动、没有退场的那份）
  const english = rollTo(first, '359 Qs', 359);
  assert.deepEqual(english, { key: 359, text: '359 Qs', prev: null, gen: 0 });
  // 数变了：新的进场、旧的退场，gen + 1（动画元素的 key 跟着换新，从头播）
  const second = rollTo(english, '41 Qs', 41);
  assert.deepEqual(second, { key: 41, text: '41 Qs', prev: '359 Qs', gen: 1 });
  // 一轮还没播完又变：退场的是眼前那份，gen 再 + 1
  const third = rollTo(second, '0 Qs', 0);
  assert.deepEqual(third, { key: 0, text: '0 Qs', prev: '41 Qs', gen: 2 });
  // 上一轮的收尾迟到了（gen 对不上）：别动，让新的那轮自己收尾
  assert.equal(settleRoll(third, 1), third);
  // 这一轮播完：摘掉退场的那份，显示的文字与 gen 不变
  assert.deepEqual(settleRoll(third, 2), { key: 0, text: '0 Qs', prev: null, gen: 2 });
  const settled = settleRoll(third, 2);
  assert.equal(settleRoll(settled, 2), settled, '已经收过尾的原样返回');
  // 不给 key 时就按文字认
  assert.equal(rollTo(startRoll('a'), 'b').gen, 1);

  // 组件：渲染期按 rollTo（按数）换档；到点（ROLL_MS 之后）按 gen 收尾；退场那份不念；首帧不挂动画；key 随 gen 换新
  const roll = code(fs.readFileSync('src/components/setup/RollingText.tsx', 'utf8'));
  assert.match(roll, /useState\(\(\) => startRoll\(text, value\)\)/);
  assert.match(roll, /const next = rollTo\(roll, text, value\); if \(next !== roll\) setRoll\(next\);/);
  const [settle] = effects(roll);
  assert.deepEqual([...settle.deps].sort(), ['gen', 'prev']);
  assert.match(settle.body, /setTimeout\(\(\) => setRoll\(\((\w+)\) => settleRoll\(\1, gen\)\), ROLL_MS(?: \+ \d+)?\)/);
  assert.match(settle.body, /return \(\) => window\.clearTimeout\(timer\);/, '卸载 / 又换一轮时撤掉计时器');
  const out = jsxOpening(roll, 'className={styles.out}');
  assert.equal(attrValue(out.attrs.get('aria-hidden')), 'true', '退场那份读屏不念');
  assert.equal(attrValue(out.attrs.get('key')), '`out-${gen}`');
  const incoming = jsxOpening(roll, 'className={gen > 0 ? styles.in : undefined}');
  assert.ok(incoming, '首帧（gen 0）不挂进场动画');
  assert.equal(attrValue(incoming.attrs.get('key')), '`in-${gen}`');

  // 挂在题库按钮的「N 题」上：值就是那个题数，文字是同一个数套字典
  const panel = code(fs.readFileSync('src/components/setup/SetupPanel.tsx', 'utf8'));
  const bank = segmentedGroups(panel).find((group) => group.value === 'db');
  const hint = jsxOpening(bank.options, '<RollingText');
  assert.ok(hint, '题库按钮的 hint 得是 RollingText');
  const count = attrValue(hint.attrs.get('value'));
  assert.equal(attrValue(hint.attrs.get('text')), `t.setup.questions(${count})`, '文字与值是同一个数');

  // 样式：220ms 上下、只动 transform / opacity；旧的往上走、新的从下来；格子裁掉滑出去的部分；
  // 减动效下瞬时（旧的直接不画）；光效开关不管它（操作反馈）
  const sheet = css('src/components/setup/RollingText.module.css');
  const rules = parseRules(fs.readFileSync('src/components/setup/RollingText.module.css', 'utf8'));
  assert.equal(cascade(sheet, '.roll')['overflow-x'], 'hidden');
  for (const [cls, dir] of [
    ['in', 1],
    ['out', -1],
  ]) {
    const animation = cascade(sheet, `.${cls}`).animation;
    const [name, duration] = animation.split(/\s+/);
    assert.ok(Math.abs(timeMs(duration) - ROLL_MS) <= 40, `.${cls} ${duration} 与 ROLL_MS 对不上`);
    assert.doesNotMatch(animation, /\binfinite\b/);
    const frames = rules.filter((rule) => rule.at === `@keyframes ${name}`);
    for (const frame of frames) {
      for (const [prop] of declarations(frame.body)) assert.ok(['transform', 'opacity'].includes(prop), `${name} 动了 ${prop}`);
    }
    const moving = frames.map((frame) => Number(/translateY\((-?[\d.]+)%\)/.exec(frame.body)?.[1])).find((v) => Number.isFinite(v));
    assert.equal(Math.sign(moving), dir, `.${cls} 的方向不对（旧的往上、新的从下）`);
  }
  const reduced = { media: '(prefers-reduced-motion: reduce)' };
  assert.equal(cascade(sheet, '.in', reduced).animation, 'none');
  assert.equal(cascade(sheet, '.out', reduced).animation, 'none');
  assert.equal(cascade(sheet, '.out', reduced).display, 'none');
  assert.ok(!rules.some((rule) => /data-fx/.test(rule.selector)), '题数滚动是操作反馈，光效关时照播');
});
