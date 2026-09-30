import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

import { declarations, parseRules, parseTransition, splitValue, stripComments, subject, timeMs } from './helpers/css-rules.mjs';
import { calls, code, namedFn, stripJsComments } from './helpers/source.mjs';

// P8-A5 答题页克制反馈（Design §22）：选项悬停细色条、选中圆点填充、答对绿光一次、答错轻抖一次。
// 这组测试盯三件事：
//   1. 动效只动 transform / opacity、一次性、不挤动布局；减动效下由 reduced-motion.test 逐条核降级
//   2. 类名链路：悬停色条只给「此刻点得动」的选项；对错反馈只在练习模式按下 Enter 批改之后出现，
//      Mock 交卷前与 Diagnostic 全程一个对错类都不挂
//   3. 判分、键盘流程一行不动（哨兵断言在 feedback.test / diagnostic.test 里）
//
// 类名链路按语义判：把源码里渲染选项的那段 map 回调原样拿出来（TypeScript 去类型、JSX 转成
// createElement）真跑一遍，看每个选项最终拿到的 className——cls 是 push 出来的还是拼出来的都不影响

const EXAM = 'src/components/exam/ExamApp.tsx';
const EXAM_CSS = 'src/components/exam/Exam.module.css';
const RUNNER = 'src/components/diagnostic/DiagnosticRunner.tsx';

const examSrc = stripJsComments(fs.readFileSync(EXAM, 'utf8'));
const runnerSrc = stripJsComments(fs.readFileSync(RUNNER, 'utf8'));
const css = fs.readFileSync(EXAM_CSS, 'utf8');
const rules = parseRules(stripComments(css));

// ---------------------------------------------------------------------------
// 把一段源码真跑起来

/** createElement 的替身：只留下 type / props / children，够读 className */
const REACT = { createElement: (type, props, ...children) => ({ type, props: props ?? {}, children }) };
/** CSS Modules 的替身：styles.xxx 就是 'xxx' */
const STYLES = new Proxy({}, { get: (_, key) => (typeof key === 'string' ? key : undefined) });

/** 一段 TS / TSX 表达式：去类型、转 JSX 之后求值，scope 里的名字当外部变量传进去 */
function evaluate(expr, scope = {}) {
  const js = ts.transpileModule(`__out = (${expr});`, {
    fileName: 'snippet.tsx',
    compilerOptions: { target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.React },
  }).outputText;
  const names = Object.keys(scope);
  return new Function('React', ...names, `let __out;\n${js}\nreturn __out;`)(REACT, ...names.map((n) => scope[n]));
}

/** 源码里的 `function sameLabel(…) { … }`，原样求出来用 */
function sourceFn(src, name) {
  const fn = namedFn(src, name);
  assert.ok(fn, `找不到 ${name}`);
  return evaluate(`function ${name}${fn}`);
}

const classesOf = (element) => String(element.props.className ?? '').split(/\s+/).filter(Boolean);

/** 一道五选一的题：标号小写（MAT 体例）、最后一项是内联题的空选项文字 */
const Q = {
  qid: 1,
  answer: 'b',
  choices: [
    { label: 'a', text: '$1$' },
    { label: 'b', text: '$2$' },
    { label: 'c', text: '$3$' },
    { label: 'd', text: '$4$' },
    { label: 'e', text: '' },
  ],
};

// ---- ExamApp 的 CBT 答题界面：exam 相的返回体从 `if (!q) return null;` 起 ----
const cbtAt = examSrc.indexOf('if (!q) return null;');
assert.ok(cbtAt > 0, '找不到 CBT 答题界面的起点');
const cbt = examSrc.slice(cbtAt);
/** 渲染前算的派生值（isGraded / isRight / …）：`const x = …;` 按原顺序逐条求 */
const derived = [...cbt.slice(0, cbt.indexOf('return (')).matchAll(/const (\w+) = ([^;]+);/g)].map((m) => [m[1], m[2]]);
const examChoices = calls(cbt, 'q.choices.map');
assert.equal(examChoices.length, 1, 'CBT 界面里渲染选项的 map 只该有一处');
const examSameLabel = sourceFn(examSrc, 'sameLabel');

/**
 * 「刚批改」的那个标记：gradeCurrent 拿当前题号去调的那个 setter，以及它对应的 state 名。
 * 按行为找——把 gradeCurrent 真跑一遍（setter 全换成记录器），看哪个收到了题号
 */
function gradeMarker() {
  const grade = namedFn(examSrc, 'gradeCurrent');
  assert.ok(grade, '找不到 gradeCurrent');
  const seen = [];
  const scope = { answers: [null, null, null, 'a'], idx: 3, q: Q, sameLabel: examSameLabel, commandPet: () => {} };
  for (const name of new Set(grade.match(/\bset[A-Z]\w*/g))) scope[name] = (value) => seen.push([name, value]);
  evaluate(grade, scope)();
  const hit = seen.filter(([, value]) => value === 3);
  assert.equal(hit.length, 1, `gradeCurrent 得把当前题号记下来（刚批改的是哪一题）：${JSON.stringify(seen)}`);
  const setter = hit[0][0];
  const state = code(examSrc).match(new RegExp(`const \\[(\\w+), ${setter}\\] = useState`))?.[1];
  assert.ok(state, `找不到 ${setter} 对应的 state`);
  return { setter, state };
}

let markerCache = null;
/** 同一份源码只找一次 */
const marker = () => (markerCache ??= gradeMarker());

/**
 * 按给定的组件状态渲染一遍 CBT 的选项，返回每个选项的类名数组。
 * state 里放派生值要用到的其余状态；「刚批改」标记不给就当没有（null）
 */
function examOptions({ mode, answer = null, graded = false, state = {} }) {
  const scope = { mode, idx: 0, q: Q, answers: [answer], graded: [graded], sameLabel: examSameLabel, [marker().state]: null, ...state };
  for (const [name, expr] of derived) scope[name] = evaluate(expr, scope);
  const render = evaluate(examChoices[0].args, { ...scope, styles: STYLES, MathText: 'MathText', selectChoice: () => {} });
  return Q.choices.map((c) => classesOf(render(c)));
}

// ---- 成绩页的逐题卡（不在本任务范围：只核它没被捎带上答题页的反馈）----
const resultChoices = calls(examSrc, 'qq.choices.map');
assert.equal(resultChoices.length, 1, '成绩页渲染选项的 map 只该有一处');

function resultOptions(answer) {
  const render = evaluate(resultChoices[0].args, {
    qq: Q,
    i: 0,
    answers: [answer],
    sameLabel: examSameLabel,
    styles: STYLES,
    MathText: 'MathText',
  });
  return Q.choices.map((c) => classesOf(render(c)));
}

// ---- Diagnostic 的答题页 ----
const runnerChoices = calls(runnerSrc, 'q.choices.map');
assert.equal(runnerChoices.length, 1, 'Diagnostic 渲染选项的 map 只该有一处');
const runnerSameLabel = sourceFn(runnerSrc, 'sameLabel');

function diagnosticOptions(answer) {
  const render = evaluate(runnerChoices[0].args, {
    idx: 0,
    answers: [answer],
    sameLabel: runnerSameLabel,
    examStyles: STYLES,
    styles: STYLES,
    MathText: 'MathText',
    select: () => {},
  });
  return Q.choices.map((c) => classesOf(render(c)));
}

/** 每种答题场景：[名字, 各选项的类名数组] */
function answeringScenarios() {
  const out = [];
  for (const answer of [null, 'a', 'b', 'e']) {
    out.push([`Mock 作答 ${answer}`, examOptions({ mode: 'mock', answer })]);
    out.push([`练习未批改 ${answer}`, examOptions({ mode: 'practice', answer })]);
    out.push([`Diagnostic 作答 ${answer}`, diagnosticOptions(answer)]);
  }
  return out;
}

// ---------------------------------------------------------------------------
// CSS 小工具

/** 选择器列表里任何一项的主体（含伪元素）等于 subj 的规则 */
const rulesFor = (subj) => rules.filter((rule) => rule.selector.split(',').some((one) => subject(one) === subj));
const decl = (rule) => Object.fromEntries(declarations(rule.body));

/** transform 里的缩放 [x, y]：scale(k) / scale(x, y) / scaleX(k) / scaleY(k) / none；认不出是 NaN */
function scaleOf(value) {
  const v = String(value ?? '').trim();
  if (v === 'none') return [1, 1];
  const s = v.match(/^scale\(\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (s) return [Number(s[1]), Number(s[2] ?? s[1])];
  const x = v.match(/^scaleX\(\s*([\d.]+)\s*\)$/);
  if (x) return [Number(x[1]), 1];
  const y = v.match(/^scaleY\(\s*([\d.]+)\s*\)$/);
  if (y) return [1, Number(y[1])];
  return [Number.NaN, Number.NaN];
}

/** transform 里的纵向缩放 */
const scaleYOf = (value) => scaleOf(value)[1];

// ---------------------------------------------------------------------------
// 1. 悬停色条

test('hovering a live option grows a 3px accent bar from its middle, animating transform only', () => {
  const bar = rulesFor('choiceLive::before');
  const base = bar.filter((rule) => !rule.inReduced && !rule.selector.includes(':hover'));
  assert.equal(base.length, 1, '竖条的本体规则只该有一条');
  const d = decl(base[0]);
  assert.equal(base[0].at, null, '竖条本体写在顶格，不挂在某个媒体条件里');

  // 绝对定位的伪元素：出来收回都不挤动内容；不吃点击（点在竖条上也是点这个选项）
  assert.equal(d.position, 'absolute');
  assert.equal(d.width, '3px');
  assert.equal(d.background, 'var(--accent)');
  assert.equal(d['pointer-events'], 'none');
  assert.ok('content' in d, '伪元素要有 content 才画得出来');
  assert.ok(d.top && d.bottom && d.left, '竖条贴着选项左侧、上下各留一点边');

  // 平时缩成 0，悬停时伸到 1；原点在中间或顶部
  assert.equal(scaleYOf(d.transform), 0, `竖条平时应该收着：transform ${d.transform}`);
  assert.match(d['transform-origin'] ?? 'center', /^(center|top|50% 50%|50% 0%?)/);

  // 过渡只动 transform，约 140ms
  const items = parseTransition(d.transition);
  assert.ok(items.length > 0, '竖条要有伸出的过渡');
  for (const item of items) {
    assert.equal(item.property, 'transform', `竖条过渡了 ${item.property}`);
    const ms = timeMs(item.duration);
    assert.ok(ms >= 100 && ms <= 200, `竖条伸出用了 ${ms}ms`);
  }

  // 悬停只把它伸出来，别的什么都不改
  const hover = bar.filter((rule) => !rule.inReduced && rule.selector.includes(':hover'));
  assert.equal(hover.length, 1, '竖条的悬停规则只该有一条');
  assert.deepEqual(Object.keys(decl(hover[0])), ['transform'], '悬停时竖条只动 transform');
  assert.equal(scaleYOf(decl(hover[0]).transform), 1);

  // 选项行是竖条的定位参照，relative 不带偏移
  const row = rules.filter((rule) => rule.selector.trim() === '.choiceRow' && !rule.at).map(decl);
  assert.ok(row.some((one) => one.position === 'relative'), '.choiceRow 得是定位参照');
  for (const one of row) {
    for (const offset of ['top', 'right', 'bottom', 'left', 'inset', 'transform']) {
      assert.ok(!(offset in one), `.choiceRow 带了 ${offset}，会挪动布局`);
    }
  }
});

test('hover feedback only answers a real pointer on a live, enabled option', () => {
  // 所有写了 :hover 的选项规则：只许挂在 .choiceLive 上、排除禁用态、包在 (hover: hover) 里。
  // 触屏点一下 :hover 会粘在那一格：竖条赖着不走，悬停底色还会盖掉「选中」的淡底
  const hovering = rules.filter(
    (rule) =>
      !rule.inReduced &&
      rule.selector.split(',').some((one) => {
        const subj = subject(one).split('::')[0].split('|');
        return one.includes(':hover') && (subj.includes('choiceRow') || subj.includes('choiceLive'));
      }),
  );
  assert.ok(hovering.length >= 2, '悬停底色与竖条两条都该在');
  for (const rule of hovering) {
    for (const one of rule.selector.split(',')) {
      assert.match(one, /\.choiceLive:hover/, `${one.trim()}：悬停反馈只给点得动的选项`);
      assert.match(one, /:not\(:disabled\)/, `${one.trim()}：禁用态不出`);
    }
    assert.match(rule.at ?? '', /\(hover: hover\)/, `${rule.selector.trim()} 没包在 (hover: hover) 里，触屏也会出`);
  }

  // 底色微微提亮：用各主题自己的行悬停色，不另调一套
  const tint = hovering.find((rule) => !rule.selector.includes('::'));
  assert.deepEqual(decl(tint), { background: 'var(--row-hover)' });
});

test('only options that can still be picked get the hover bar — never once graded, never on the result page', () => {
  // 此刻点得动的：Mock 作答中、练习未批改、Diagnostic 作答中，每个选项都带 choiceLive
  for (const [name, options] of answeringScenarios()) {
    for (const cls of options) {
      assert.ok(cls.includes('choiceRow'), `${name}：选项行的基础类丢了`);
      assert.ok(cls.includes('choiceLive'), `${name}：点得动的选项没有悬停色条`);
    }
  }
  // 选中态照旧
  assert.ok(examOptions({ mode: 'mock', answer: 'c' })[2].includes('optSelected'));
  assert.ok(examOptions({ mode: 'practice', answer: 'c' })[2].includes('optSelected'));
  assert.ok(diagnosticOptions('c')[2].includes('optSelected'));

  // 练习模式批改之后选项只读：一个都不带
  for (const answer of ['a', 'b']) {
    for (const cls of examOptions({ mode: 'practice', answer, graded: true })) {
      assert.ok(!cls.includes('choiceLive'), `批改后（选 ${answer}）的选项还在招手：${cls.join(' ')}`);
    }
  }
  // 成绩页的逐题卡不是按钮
  for (const answer of [null, 'a', 'b']) {
    for (const cls of resultOptions(answer)) assert.ok(!cls.includes('choiceLive'), `成绩页：${cls.join(' ')}`);
  }
});

// ---------------------------------------------------------------------------
// 2. 选中圆点

test('picking an option fills the radio dot with one scale(0→1); un-picking clears it at once', () => {
  const dot = rulesFor('radio::after').filter((rule) => !rule.inReduced);
  const base = dot.filter((rule) => rule.selector.split(',').some((one) => one.trim() === '.radio::after'));
  assert.equal(base.length, 1, '内点的本体规则只该有一条');
  const d = decl(base[0]);
  // 一颗绝对定位的真圆：出没都不影响 .radio 的尺寸与基线
  assert.equal(d.position, 'absolute');
  assert.equal(d['border-radius'], '50%');
  assert.ok('content' in d);
  assert.deepEqual(scaleOf(d.transform), [0, 0], `内点平时应该缩成 0：transform ${d.transform}`);
  // 过渡不写在本体上：取消选中（改选别的、批改后退场）就瞬时收掉，不跟新选中的那颗抢眼
  assert.ok(!('transition' in d), '内点本体带了过渡，取消选中也会慢慢缩');
  // 缩进得是整像素：半像素（试过 1.5px 画实心点）实测在 DPR 1 / 1.25 / 1.5 / 2 下都被像素对齐
  // 偏出半像素，点歪在圈里
  const inset = Number(String(d.inset).replace(/px$/, ''));
  assert.ok(Number.isInteger(inset) && inset >= 0, `内点缩进 ${d.inset} 不是整像素，会画歪`);
  // 点画在伪元素自己身上，颜色跟主题色走
  assert.match(d.background ?? '', /var\(--accent\)/);
  const radio = rules.filter((rule) => rule.selector.trim() === '.radio' && !rule.at).map(decl);
  assert.ok(radio.some((one) => one.position === 'relative'), '.radio 得是内点的定位参照');

  // 选中：放大到 1，只补间 transform，约 160ms
  const picked = dot.filter((rule) => rule.selector.includes('.optSelected'));
  assert.equal(picked.length, 1, '选中态的内点规则只该有一条');
  const p = decl(picked[0]);
  assert.deepEqual(scaleOf(p.transform), [1, 1]);
  const items = parseTransition(p.transition);
  assert.ok(items.length > 0, '选中要有一次填充');
  for (const item of items) {
    assert.equal(item.property, 'transform', `内点过渡了 ${item.property}`);
    const ms = timeMs(item.duration);
    assert.ok(ms >= 120 && ms <= 220, `内点填充用了 ${ms}ms`);
  }

  // 满着的只有两种：选中、选错（批改后 / 成绩页的红点，颜色换了、不再放一遍）；正确项照旧只描外圈
  const filled = dot.filter((rule) => scaleOf(decl(rule).transform).every((k) => k === 1));
  const states = filled.flatMap((rule) => rule.selector.split(',').map((one) => one.trim()));
  assert.deepEqual(states.sort(), ['.optSelected .radio::after', '.optWrong .radio::after']);
  const wrong = decl(filled.find((rule) => rule.selector.includes('.optWrong')));
  assert.match(wrong.background ?? '', /#c62828/);
  assert.ok(!('transition' in wrong), '批改时红点只换颜色，不再放一遍');

  // 内点只有一颗：.radio 自己不再画背景（原先的径向渐变会盖在缩放的那颗上，看不出填充）
  for (const rule of rules.filter((one) => one.selector.split(',').some((s) => subject(s) === 'radio'))) {
    for (const [prop, value] of declarations(rule.body)) {
      assert.ok(!/^background(-image)?$/.test(prop), `${rule.selector.trim()} { ${prop}: ${value} } 又在 .radio 上画了一颗点`);
    }
  }
});

// ---------------------------------------------------------------------------
// 3. 批改反馈：答对绿光一次、答错轻抖一次

/** 对错类：Mock 交卷前、未批改、Diagnostic 都一个不许有；成绩页不许有后两个（动效） */
const VERDICT = ['optCorrect', 'optWrong', 'optPulse', 'optShake'];
const EFFECTS = ['optPulse', 'optShake'];

/** animation 简写拆开：{ name, duration, iterations }，时间保持原文 */
function parseAnimation(value) {
  const TIME = /^-?(?:\d*\.)?\d+m?s$/;
  const KEYWORD =
    /^(normal|reverse|alternate|alternate-reverse|none|forwards|backwards|both|running|paused|ease|ease-in|ease-out|ease-in-out|linear|step-start|step-end|infinite)$/;
  const tokens = splitValue(value);
  const times = tokens.filter((t) => TIME.test(t));
  const iterations = tokens.find((t) => t === 'infinite' || /^\d*\.?\d+$/.test(t)) ?? '1';
  const name = tokens.find(
    (t) => !TIME.test(t) && !KEYWORD.test(t) && !/^\d*\.?\d+$/.test(t) && !/^(cubic-bezier|steps|linear)\(/.test(t),
  );
  return { name, duration: times[0] ?? '0s', iterations };
}

/** @keyframes name 的各帧，按位置排好：[{ at: 0–100, decl }] */
function keyframes(name) {
  const frames = [];
  for (const rule of rules.filter((one) => one.at === `@keyframes ${name}`)) {
    for (const stop of rule.selector.split(',')) {
      const s = stop.trim();
      frames.push({ at: s === 'from' ? 0 : s === 'to' ? 100 : Number.parseFloat(s), decl: decl(rule) });
    }
  }
  return frames.sort((a, b) => a.at - b.at);
}

/** translateX(N) / translate(N) / translate(N, 0) / none 里的水平位移（px）；认不出是 NaN */
function translateXOf(value) {
  const v = String(value ?? '').trim();
  if (v === 'none') return 0;
  const m =
    v.match(/^translateX\(\s*(-?[\d.]+)(?:px)?\s*\)$/) || v.match(/^translate\(\s*(-?[\d.]+)(?:px)?\s*(?:,\s*0(?:px)?\s*)?\)$/);
  return m ? Number(m[1]) : Number.NaN;
}

test('grading feedback plays once, right after Enter, and only on a practice-mode verdict', () => {
  const { state } = marker();
  const at = (value) => ({ [state]: value });
  const has = (options, cls) => options.map((one) => one.includes(cls));
  const nth = (label) => Q.choices.findIndex((c) => c.label === label);
  const none = Q.choices.map(() => false);

  // 答对（选 b）：只有被判对的那一项绿光一次，没有谁在抖
  const right = examOptions({ mode: 'practice', answer: 'b', graded: true, state: at(0) });
  assert.deepEqual(has(right, 'optPulse'), Q.choices.map((c) => c.label === 'b'));
  assert.deepEqual(has(right, 'optShake'), none);
  assert.ok(right[nth('b')].includes('optCorrect'));

  // 答错（选 a）：选的那一项轻抖一次；正确项照常标绿、不闪——一次批改只放一个动作
  const wrong = examOptions({ mode: 'practice', answer: 'a', graded: true, state: at(0) });
  assert.deepEqual(has(wrong, 'optShake'), Q.choices.map((c) => c.label === 'a'));
  assert.deepEqual(has(wrong, 'optPulse'), none);
  assert.ok(wrong[nth('a')].includes('optWrong'));
  assert.ok(wrong[nth('b')].includes('optCorrect'));

  // 切走再切回来（标记已清）、标记指着别的题：批改色一模一样，动效不重播
  const withoutEffects = (options) => options.map((cls) => cls.filter((c) => !EFFECTS.includes(c)));
  for (const value of [null, 1, 7]) {
    for (const answer of ['a', 'b', 'e']) {
      const again = examOptions({ mode: 'practice', answer, graded: true, state: at(value) });
      const fresh = examOptions({ mode: 'practice', answer, graded: true, state: at(0) });
      for (const effect of EFFECTS) assert.deepEqual(has(again, effect), none, `标记为 ${value}、选 ${answer}：${effect} 重播了`);
      assert.deepEqual(again, withoutEffects(fresh), '回看时批改色得和刚批改时一样');
    }
  }

  // 还没批改：一个对错类都没有（标记残留也不算数）
  for (const answer of [null, 'a', 'b']) {
    for (const cls of examOptions({ mode: 'practice', answer, graded: false, state: at(0) })) {
      for (const verdict of VERDICT) assert.ok(!cls.includes(verdict), `未批改就出了 ${verdict}`);
    }
  }

  // Mock：交卷前没有批改——就算 graded 被置位、标记也指着这一题，一个对错类都不挂
  for (const answer of [null, 'a', 'b']) {
    for (const cls of examOptions({ mode: 'mock', answer, graded: true, state: at(0) })) {
      for (const verdict of VERDICT) assert.ok(!cls.includes(verdict), `Mock 交卷前出了 ${verdict}`);
    }
  }

  // Diagnostic 全程不给对错；成绩页逐题卡不在本任务范围，只核它没被捎带上动效
  for (const answer of [null, 'a', 'b', 'e']) {
    for (const cls of diagnosticOptions(answer)) {
      for (const verdict of VERDICT) assert.ok(!cls.includes(verdict), `Diagnostic 出了 ${verdict}`);
    }
    for (const cls of resultOptions(answer)) {
      for (const effect of EFFECTS) assert.ok(!cls.includes(effect), `成绩页挂上了 ${effect}`);
    }
  }
});

test('the "just graded" marker is set by the grading itself and cleared by every move and every new session', () => {
  const { setter } = marker();

  // 切题：goto 真跑一遍——换了题就在同一次事件里清掉（等下一帧的 effect 再清，
  // 动效类会随新题先挂上一帧，动画就从头放了）
  const go = namedFn(examSrc, 'goto');
  assert.ok(go, '找不到 goto');
  const seen = [];
  const scope = { questions: [Q, Q, Q, Q], commandPet: () => {} };
  for (const name of new Set(go.match(/\bset[A-Z]\w*/g))) scope[name] = (value) => seen.push([name, value]);
  const goto = evaluate(go, scope);
  for (const target of [0, 1, 3]) {
    seen.length = 0;
    goto(target);
    assert.ok(seen.some(([name, value]) => name === setter && value === null), `goto(${target}) 没清掉「刚批改」标记`);
  }
  // 越界什么都不做（原样）
  seen.length = 0;
  goto(9);
  assert.deepEqual(seen, []);

  // 开新场：start() 重置每题状态时一起清。开考正文可能叫 startExam（外面另包一层防连点的 start），
  // 两种命名都认，重置语句在正文里
  const start = namedFn(examSrc, 'startExam') ?? namedFn(examSrc, 'start');
  assert.ok(start, '找不到开考正文（startExam / start）');
  assert.ok(calls(start, setter).some(({ args }) => args === 'null'), 'start() 开新场没清「刚批改」标记');
});

test('the right-answer pulse is one fading glow on a pseudo-element: opacity only, the shadow never animated', () => {
  const all = rulesFor('optPulse::after').filter((rule) => !rule.inReduced);
  const own = all.filter((rule) => rule.selector.split(',').some((one) => one.trim() === '.optPulse::after'));
  assert.equal(own.length, 1, '绿光的本体规则只该有一条');
  const d = decl(own[0]);
  // 光晕挂在绝对定位的伪元素上，贴着选项的边框盒：不挤动布局、不吃点击
  assert.equal(d.position, 'absolute');
  assert.equal(d['pointer-events'], 'none');
  assert.ok('content' in d);
  assert.ok(Number.parseFloat(d.inset) <= 0, `光晕层 inset ${d.inset} 没盖住选项的边框`);
  // 光是静态的 box-shadow；平时透明——动画不放（减动效）就什么都不剩
  assert.match(d['box-shadow'] ?? '', /\d/);
  assert.equal(Number(d.opacity), 0, '光晕层平时应该是透明的');

  // 一次性，约 600ms
  const anim = parseAnimation(d.animation);
  assert.equal(anim.iterations, '1', `绿光放了 ${anim.iterations} 次`);
  const ms = timeMs(anim.duration);
  assert.ok(ms >= 400 && ms <= 800, `绿光用了 ${ms}ms`);

  // 关键帧只动 opacity / transform，由强到无、中途不再亮起来
  const frames = keyframes(anim.name);
  assert.ok(frames.length >= 2, `找不到 @keyframes ${anim.name}`);
  for (const frame of frames) {
    for (const prop of Object.keys(frame.decl)) assert.ok(['opacity', 'transform'].includes(prop), `@keyframes ${anim.name} 动了 ${prop}`);
  }
  const opacity = (frame) => Number(frame.decl.opacity ?? d.opacity);
  assert.ok(opacity(frames[0]) >= 0.8, '绿光开头就该是亮的（由强到无）');
  assert.equal(opacity(frames[frames.length - 1]), 0, '绿光最后要散尽');
  for (let i = 1; i < frames.length; i++) assert.ok(opacity(frames[i]) <= opacity(frames[i - 1]), '绿光不该中途再亮起来');

  // 别的写法（主题换色等）只许改静态的光，不许另起动画或补间
  for (const rule of all.filter((one) => one !== own[0])) {
    for (const prop of Object.keys(decl(rule))) {
      assert.ok(!/^(animation|transition)/.test(prop), `${rule.selector.trim()} 又带了 ${prop}`);
    }
  }
});

test('the wrong-answer shake is one ±3px sway, three times back and forth, transform only', () => {
  const own = rules.filter((rule) => !rule.inReduced && rule.selector.split(',').some((one) => subject(one) === 'optShake'));
  assert.equal(own.length, 1, '抖动只该有一条规则');
  // 选项行本身只挂动画，不改任何会挤动布局的东西
  assert.deepEqual(Object.keys(decl(own[0])), ['animation']);
  const anim = parseAnimation(decl(own[0]).animation);
  assert.equal(anim.iterations, '1', `抖动放了 ${anim.iterations} 次`);
  const ms = timeMs(anim.duration);
  assert.ok(ms >= 200 && ms <= 400, `抖动用了 ${ms}ms`);

  const frames = keyframes(anim.name);
  assert.ok(frames.length >= 7, `@keyframes ${anim.name} 帧数不够三个来回`);
  for (const frame of frames) {
    assert.deepEqual(Object.keys(frame.decl), ['transform'], `@keyframes ${anim.name} 在 ${frame.at}% 动了 transform 以外的东西`);
  }
  const xs = frames.map((frame) => translateXOf(frame.decl.transform));
  assert.ok(xs.every((x) => Number.isFinite(x)), `抖动只许水平平移：${frames.map((f) => f.decl.transform).join(' / ')}`);
  assert.equal(xs[0], 0, '从原位起');
  assert.equal(xs[xs.length - 1], 0, '回到原位');
  assert.equal(Math.max(...xs.map(Math.abs)), 3, '幅度 ±3px');
  // 三个来回：摆到头 ≥ 6 下，且一左一右交替
  const peaks = xs.filter((x) => x !== 0);
  assert.ok(peaks.length >= 6, `只摆了 ${peaks.length} 下`);
  for (let i = 1; i < peaks.length; i++) assert.ok(Math.sign(peaks[i]) !== Math.sign(peaks[i - 1]), '左右没有交替');
});

test('answering feedback uses no filter, never loops, and the effects-off switch leaves it alone', () => {
  const SUBJECTS = ['choiceLive::before', 'radio::after', 'optPulse::after', 'optShake'];
  const own = rules.filter((rule) => !rule.inReduced && rule.selector.split(',').some((one) => SUBJECTS.includes(subject(one))));
  const names = new Set();
  for (const rule of own) {
    for (const [prop, value] of declarations(rule.body)) {
      assert.ok(!/^(-webkit-)?(backdrop-)?filter$/.test(prop), `${rule.selector.trim()} 用了 ${prop}`);
      if (prop === 'animation' || prop === 'animation-iteration-count') {
        assert.doesNotMatch(value, /\binfinite\b/, `${rule.selector.trim()} 是无限循环`);
        if (prop === 'animation') names.add(parseAnimation(value).name);
      }
    }
  }
  assert.deepEqual([...names].sort(), ['optPulse', 'optShake']);
  for (const name of names) {
    for (const frame of keyframes(name)) {
      for (const prop of Object.keys(frame.decl)) assert.ok(!/filter|shadow/.test(prop), `@keyframes ${name} 动了 ${prop}`);
    }
  }
  // 光效关（data-fx="off"）只关大厅的装饰；这些是操作反馈、一次性，照放
  const off = own.filter((rule) => /\[data-fx='off'\]/.test(rule.selector));
  assert.deepEqual(off.map((rule) => rule.selector.trim()), [], '光效关不该关掉答题反馈');
});

test('reduced motion: no shake, no pulse; the bar and the dot just appear', () => {
  // 降级规则在层叠上赢没赢，由 reduced-motion.test 的守卫逐条核；这里钉住这四样都真在降级块里关掉
  const reduced = rules.filter((rule) => rule.inReduced);
  const off = (subj, family) =>
    reduced.some(
      (rule) =>
        declarations(rule.body).some(([p, v]) => p === family && v === 'none') &&
        rule.selector.split(',').some((one) => subject(one) === subj),
    );
  assert.ok(off('optPulse::after', 'animation'), '减动效下绿光还在放');
  assert.ok(off('optShake', 'animation'), '减动效下还在抖');
  assert.ok(off('choiceLive::before', 'transition'), '减动效下竖条还在伸');
  assert.ok(off('radio::after', 'transition'), '减动效下圆点还在放大');
  // 降级块只关动效，不藏东西：竖条、圆点、红绿批改色都照常
  const FEEDBACK = /^(choiceLive|radio|optPulse|optShake|optSelected|optCorrect|optWrong)/;
  for (const rule of reduced.filter((one) => one.selector.split(',').some((s) => FEEDBACK.test(subject(s))))) {
    for (const [prop] of declarations(rule.body)) {
      assert.ok(['animation', 'transition'].includes(prop), `${rule.selector.trim()} 在减动效下改了 ${prop}`);
    }
  }
});

/**
 * 一份样式表里，哪些「带关键帧动画」的选择器可能落到只挂着 classes 这些类的元素上：
 * 选择器里（:global 之外）的类全在 classes 里（或者一个模块类都没有），就算落得上
 */
function reachableAnimations(sheet, classes) {
  const out = [];
  for (const rule of parseRules(stripComments(sheet))) {
    if (rule.inReduced || /^@keyframes/.test(rule.at ?? '')) continue;
    const moves = declarations(rule.body).some(
      ([prop, value]) => (prop === 'animation' || prop === 'animation-name') && !/^none\b/.test(value),
    );
    if (!moves) continue;
    for (const one of rule.selector.split(',')) {
      const local = [...one.replace(/:global\([^()]*\)/g, ' ').matchAll(/\.([\w-]+)/g)].map((m) => m[1]);
      if (local.length === 0 || local.every((cls) => classes.has(cls))) out.push(one.trim());
    }
  }
  return out;
}

test('the diagnostic runner cannot reach any keyframe animation — the grading glow and shake included', () => {
  // Diagnostic 模拟正式机考、全程不给对错：它渲染出来的元素上一个关键帧动画都不许有
  // （悬停色条与选中圆点是过渡、不涉对错，照给）
  const runnerCode = code(fs.readFileSync(RUNNER, 'utf8'));
  const examClasses = new Set([...runnerCode.matchAll(/\bexamStyles\.(\w+)/g)].map((m) => m[1]));
  const ownClasses = new Set([...runnerCode.matchAll(/(?<![\w.])styles\.(\w+)/g)].map((m) => m[1]));
  assert.ok(examClasses.has('choiceRow') && examClasses.has('optSelected'), '没读到 Diagnostic 挂的类');
  const reachable = [
    ...reachableAnimations(css, examClasses).map((sel) => `Exam.module.css  ${sel}`),
    ...reachableAnimations(fs.readFileSync('src/components/diagnostic/Diagnostic.module.css', 'utf8'), ownClasses).map(
      (sel) => `Diagnostic.module.css  ${sel}`,
    ),
  ];
  assert.deepEqual(reachable, [], `这些动画可能落到 Diagnostic 的答题页上：\n  ${reachable.join('\n  ')}`);

  // 守卫本身有牙：批改动画要是挂在诊断也用的类上（选中态、选项行），必须报出来；挂在专用类上则不报
  assert.equal(reachableAnimations('.optSelected { animation: optShake 300ms; }', examClasses).length, 1);
  assert.equal(reachableAnimations('.choiceList .choiceRow::after { animation: optPulse 600ms; }', examClasses).length, 1);
  assert.equal(reachableAnimations(':global(:root) { animation: spin 1s; }', examClasses).length, 1);
  assert.equal(reachableAnimations('.optShake { animation: optShake 300ms; }', examClasses).length, 0);
  assert.equal(reachableAnimations('.optSelected { animation: none; }', examClasses).length, 0);
});
