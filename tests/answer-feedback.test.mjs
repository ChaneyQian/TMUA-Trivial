import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

import { declarations, parseRules, parseTransition, stripComments, subject, timeMs } from './helpers/css-rules.mjs';
import { calls, namedFn, stripJsComments } from './helpers/source.mjs';

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
 * 按给定的组件状态渲染一遍 CBT 的选项，返回每个选项的类名数组。
 * state 里放派生值要用到的其余状态（比如批改动效的那个标记）
 */
function examOptions({ mode, answer = null, graded = false, state = {} }) {
  const scope = { mode, idx: 0, q: Q, answers: [answer], graded: [graded], sameLabel: examSameLabel, ...state };
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
