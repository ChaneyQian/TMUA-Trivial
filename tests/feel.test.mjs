import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

// 大厅的通用手感（Design §22 P8-A4）：键盘焦点环、按压态、开始按钮（扫光 / 下沉 / 抽题转圈防连点）、
// 题库按钮题数的上滑替换。答题页与 Diagnostic 不受影响。
import { declarations, parseRules, stripComments } from './helpers/css-rules.mjs';
import { code, jsxChildren, jsxOpening } from './helpers/source.mjs';

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
