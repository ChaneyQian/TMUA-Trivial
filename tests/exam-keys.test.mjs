import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

import { runnerKeyAction } from '../src/lib/diagnostic.ts';
import { DICT } from '../src/lib/i18n.ts';
import { attrValue, code, jsxByClass, namedFn, stripJsComments } from './helpers/source.mjs';

// 答题页键盘路由（P8-A5 顺带修）：旗标从 F 挪到 Shift+F。
// 原先练习 / Mock 里 F 键一律翻旗标，标号恰好是 F 的选项按字母选不到，和提示「A–L / 1–9 选项」对不上。
// 现在 A–L 一律归选项；只有按住 Shift 的 F 才是旗标——看 shiftKey，不看 e.key 的大小写
// （CapsLock 开着、不按 Shift 时 e.key 也是 'F'，那是在选 F 项）。
//
// 按行为判：把 ExamApp 里的 onKey 原样取出（TypeScript 去类型），组件状态与回调换成替身，
// 真按一遍键，看它调了哪个回调

const EXAM = 'src/components/exam/ExamApp.tsx';
const RUNNER = 'src/components/diagnostic/DiagnosticRunner.tsx';
const examSrc = stripJsComments(fs.readFileSync(EXAM, 'utf8'));

/** 一段 TS 表达式：去类型之后求值，scope 里的名字当外部变量传进去 */
function evaluate(expr, scope = {}) {
  const js = ts.transpileModule(`__out = (${expr});`, {
    fileName: 'snippet.tsx',
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const names = Object.keys(scope);
  return new Function(...names, `let __out;\n${js}\nreturn __out;`)(...names.map((n) => scope[n]));
}

const onKeySrc = namedFn(examSrc, 'onKey');
assert.ok(onKeySrc, '找不到 ExamApp 的 onKey');
const sameLabel = evaluate(`function sameLabel${namedFn(examSrc, 'sameLabel')}`);

const UPPER = (n) => 'ABCDEFGHIJKL'.slice(0, n).split('');
const LOWER = (n) => UPPER(n).map((label) => label.toLowerCase());

/**
 * 真跑 ExamApp 的 onKey：一道 labels 这些选项的题，停在第 1 题。
 * 返回 press(key, 修饰键) → { did: 调了哪些回调, prevented: 有没有拦默认动作 }
 */
function examRouter({ labels, mode = 'practice', graded = false, answer = null, navOpen = false, confirmEnd = false }) {
  const log = [];
  const onKey = evaluate(onKeySrc, {
    phase: 'exam',
    q: { answer: labels[0], choices: labels.map((label) => ({ label, text: '' })) },
    idx: 0,
    mode,
    graded: [graded],
    answers: [answer],
    navOpen,
    confirmEnd,
    sameLabel,
    setNavOpen: (value) => log.push(`setNavOpen(${value})`),
    setConfirmEnd: (value) => log.push(`setConfirmEnd(${value})`),
    pressEnter: () => log.push('enter'),
    goto: (i) => log.push(`goto ${i}`),
    selectChoice: (label) => log.push(`select ${label}`),
    toggleFlag: () => log.push('flag'),
  });
  return (key, mods = {}) => {
    log.length = 0;
    let prevented = false;
    onKey({
      key,
      shiftKey: false,
      ctrlKey: false,
      metaKey: false,
      altKey: false,
      repeat: false,
      target: { tagName: 'BODY' },
      preventDefault: () => {
        prevented = true;
      },
      ...mods,
    });
    return { did: log.join(', ') || 'none', prevented };
  };
}

test('in the exam, an unshifted F picks option F like any other letter; only Shift+F flags', () => {
  for (const n of [5, 8]) {
    for (const labels of [UPPER(n), LOWER(n)]) {
      const press = examRouter({ labels });
      // 第 6 个选项就是 F；不到 6 个选项时按 F 什么都不做（与其它越界字母一致）
      const pickF = labels[5] ? `select ${labels[5]}` : 'none';
      const table = {
        f: press('f').did,
        'F（CapsLock 开着，没按 Shift）': press('F').did,
        'Shift+F': press('F', { shiftKey: true }).did,
        'Shift+F（CapsLock 开着，e.key 是 f）': press('f', { shiftKey: true }).did,
        'Shift+F 按住不放的自动重复': press('F', { shiftKey: true, repeat: true }).did,
        'Ctrl+F': press('f', { ctrlKey: true }).did,
        'Cmd+F': press('f', { metaKey: true }).did,
        'Alt+F': press('f', { altKey: true }).did,
        'Ctrl+Shift+F': press('F', { ctrlKey: true, shiftKey: true }).did,
      };
      assert.deepEqual(
        table,
        {
          f: pickF,
          'F（CapsLock 开着，没按 Shift）': pickF,
          'Shift+F': 'flag',
          'Shift+F（CapsLock 开着，e.key 是 f）': 'flag',
          'Shift+F 按住不放的自动重复': 'none',
          'Ctrl+F': 'none',
          'Cmd+F': 'none',
          'Alt+F': 'none',
          'Ctrl+Shift+F': 'none',
        },
        `${n} 个选项（${labels.join('')}）`,
      );
    }
  }
  // Mock 同一套路由
  const mock = examRouter({ labels: UPPER(8), mode: 'mock' });
  assert.equal(mock('f').did, 'select F');
  assert.equal(mock('F', { shiftKey: true }).did, 'flag');
});

test('the rest of the exam keyboard flow is unchanged', () => {
  const press = examRouter({ labels: UPPER(8) });
  // 其它字母（带不带 Shift）、数字：选选项；越界的什么都不做
  assert.deepEqual(press('a'), { did: 'select A', prevented: false });
  assert.deepEqual(press('A', { shiftKey: true }), { did: 'select A', prevented: false });
  assert.deepEqual(press('h'), { did: 'select H', prevented: false });
  assert.deepEqual(press('i'), { did: 'none', prevented: false });
  assert.deepEqual(press('1'), { did: 'select A', prevented: false });
  assert.deepEqual(press('8'), { did: 'select H', prevented: false });
  assert.deepEqual(press('9'), { did: 'none', prevented: false });
  // Ctrl+C / Cmd+A 不再顺手选选项（与 Diagnostic 一致）
  assert.equal(press('c', { ctrlKey: true }).did, 'none');
  assert.equal(press('a', { metaKey: true }).did, 'none');
  assert.equal(press('1', { altKey: true }).did, 'none');
  // Enter：批改 / 下一题，拦下焦点按钮的默认激活；←→ 切题
  assert.deepEqual(press('Enter'), { did: 'enter', prevented: true });
  assert.deepEqual(press('ArrowRight'), { did: 'goto 1', prevented: false });
  assert.deepEqual(press('ArrowLeft'), { did: 'goto -1', prevented: false });
  // ↑↓：没选时从头 / 尾起，选了就挪一格，拦下页面滚动
  assert.deepEqual(press('ArrowDown'), { did: 'select A', prevented: true });
  assert.deepEqual(press('ArrowUp'), { did: 'select H', prevented: true });
  assert.equal(examRouter({ labels: UPPER(8), answer: 'B' })('ArrowDown').did, 'select C');
  // 练习模式批改之后：↑↓ 不再改答案，照样拦滚动
  assert.deepEqual(examRouter({ labels: UPPER(8), answer: 'B', graded: true })('ArrowDown'), { did: 'none', prevented: true });
  // Navigator / 交卷确认开着：只认 Esc（两个一起关），Shift+F 与选项键都不穿透
  for (const overlay of [{ navOpen: true }, { confirmEnd: true }]) {
    const behind = examRouter({ labels: UPPER(8), ...overlay });
    assert.equal(behind('F', { shiftKey: true }).did, 'none');
    assert.equal(behind('f').did, 'none');
    assert.equal(behind('Escape').did, 'setNavOpen(false), setConfirmEnd(false)');
  }
  // 焦点在下拉框（配色）/ 输入框里：按键归控件
  for (const tagName of ['SELECT', 'INPUT', 'TEXTAREA']) {
    assert.equal(press('F', { shiftKey: true, target: { tagName } }).did, 'none');
    assert.equal(press('f', { target: { tagName } }).did, 'none');
  }
});

test('the diagnostic has no flag: F is just a letter there, Shift or not', () => {
  for (const n of [5, 8]) {
    for (const labels of [UPPER(n), LOWER(n)]) {
      const pickF = labels[5] ? { kind: 'select', label: labels[5] } : { kind: 'none' };
      for (const key of ['f', 'F']) {
        assert.deepEqual(runnerKeyAction({ key, labels }), pickF, `${labels.join('')} 按 ${key}`);
        // DiagnosticRunner 不把 shiftKey 交进来；就算交了，也不改路由
        assert.deepEqual(runnerKeyAction({ key, shiftKey: true, labels }), pickF, `${labels.join('')} 按 Shift+${key}`);
      }
      assert.deepEqual(runnerKeyAction({ key: 'f', ctrlKey: true, labels }), { kind: 'none' });
    }
  }
  // 诊断页的按键只经 runnerKeyAction 这一条路，没有另拦 F 的旗标分支
  const runner = code(fs.readFileSync(RUNNER, 'utf8'));
  assert.match(runner, /runnerKeyAction\(\{ key: e\.key,/);
  assert.doesNotMatch(runner, /toggleFlag|flagged|flagOn/);
});

test('the shortcut hints say Shift+F in both languages, and the flag button announces it', () => {
  for (const lang of ['zh', 'en']) {
    const hint = DICT[lang].setup.keyboard;
    assert.match(hint, /A–L \/ 1–9/, `${lang} 的提示得写明 A–L 都是选项`);
    assert.match(hint, /Shift\+F/, `${lang} 的提示没写 Shift+F`);
    assert.doesNotMatch(hint.replace(/Shift\+F/g, ''), /\bF\b/, `${lang} 的提示里还留着单独的 F`);
  }
  // Flag for Review 是答题页上唯一看得见快捷键的地方：悬停提示与读屏都报 Shift+F
  const exam = fs.readFileSync(EXAM, 'utf8');
  const buttons = jsxByClass(exam, 'subbarBtn');
  assert.equal(buttons.length, 1, '顶栏按钮只该有旗标一颗');
  const flag = buttons[0];
  assert.equal(attrValue(flag.attrs.get('onClick')), 'toggleFlag');
  assert.equal(attrValue(flag.attrs.get('aria-keyshortcuts')), 'Shift+F');
  assert.equal(attrValue(flag.attrs.get('title')), 'Shift+F');
});
