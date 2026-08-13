import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import {
  DIAGNOSTIC_BASE_SECONDS,
  DIAGNOSTIC_MAX_ATTEMPTS,
  DIAGNOSTIC_PAPER_SIZE,
  DIAGNOSTIC_TOTAL,
  allowedMisses,
  attemptsLeft,
  bankAfter,
  budgetFor,
  canAttempt,
  deadlineFrom,
  isPass,
  passMark,
  remainingSeconds,
  setIndexForAttempt,
} from '../src/lib/diagnostic.ts';
import {
  clearRecords,
  createEmptyRecords,
  grillCount,
  isHiddenModeUnlocked,
  normalizeRecords,
  recordDiagnostic,
  HIDDEN_UNLOCK_COUNT,
} from '../src/lib/records.ts';

/**
 * 结构断言要看的是真正渲染的东西，不是注释。
 * 「这里没有 Navigator」写在注释里本身就含 Navigator 四个字，
 * 不剥注释的话 doesNotMatch 会被自己的说明文字绊倒。
 */
function codeOnly(source) {
  return source
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

/**
 * bank-refresh.test.mjs 会在同一次 npm test 里重跑 build-data 重写产物，
 * 测试文件又是并发跑的——撞上那一瞬间会读到半个文件。重试一次，别让套件偶发飘红。
 */
function readJson(file, ok, attempts = 5) {
  for (let i = 0; i < attempts; i++) {
    try {
      const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (ok(parsed)) return parsed;
    } catch {}
    const until = Date.now() + 120;
    while (Date.now() < until) {
      /* wait */
    }
  }
  throw new Error(`could not read a complete ${file}`);
}

const introPath = 'src/components/diagnostic/DiagnosticIntro.tsx';
const runnerPath = 'src/components/diagnostic/DiagnosticRunner.tsx';
const resultPath = 'src/components/diagnostic/DiagnosticResult.tsx';
const cssPath = 'src/components/diagnostic/Diagnostic.module.css';
const examPath = 'src/components/exam/ExamApp.tsx';
const recordsPath = 'src/lib/records.ts';

/** 从题库源文件读出 qid → level，用来验固定卷的难度单调 */
function levelByQid(dir) {
  const map = new Map();
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.md')) continue;
    const raw = fs.readFileSync(path.join(dir, name), 'utf8');
    const qid = Number(raw.match(/^qid:\s*(\d+)/m)?.[1]);
    const level = Number(raw.match(/^level:\s*LEVEL\s*(\d+)/im)?.[1]);
    if (qid) map.set(qid, level);
  }
  return map;
}

test('the diagnostic ships two fixed papers, not a random draw', () => {
  const diag = readJson('public/exam/diag.json', (d) => Array.isArray(d?.sets) && d.sets.length > 0);

  assert.equal(diag.sets.length, DIAGNOSTIC_MAX_ATTEMPTS, 'one fixed set per attempt');
  for (const [i, set] of diag.sets.entries()) {
    assert.equal(set.p1.length, DIAGNOSTIC_PAPER_SIZE, `set ${i + 1} paper 1 size`);
    assert.equal(set.p2.length, DIAGNOSTIC_PAPER_SIZE, `set ${i + 1} paper 2 size`);
  }
  assert.equal(DIAGNOSTIC_TOTAL, DIAGNOSTIC_PAPER_SIZE * 2);

  // 两套互不重题，并起来正好是两个 40 题文件
  const a = [...diag.sets[0].p1, ...diag.sets[0].p2];
  const b = [...diag.sets[1].p1, ...diag.sets[1].p2];
  const setA = new Set(a);
  assert.equal(b.filter((qid) => setA.has(qid)).length, 0, 'the two sets must not share a question');
  assert.equal(new Set([...a, ...b]).size, 80, 'the union is both 40-question files');

  // 卷内顺序 = 难度升序，零洗牌
  const ps = levelByQid('data/GMAT/algebra-ps');
  const ds = levelByQid('data/GMAT/algebra-ds');
  for (const [i, set] of diag.sets.entries()) {
    for (const [paper, qids, levels] of [
      ['p1', set.p1, ps],
      ['p2', set.p2, ds],
    ]) {
      const seq = qids.map((qid) => levels.get(qid));
      assert.equal(
        seq.every((level) => Number.isFinite(level)),
        true,
        `set ${i + 1} ${paper} must draw from the right source file`,
      );
      for (let k = 1; k < seq.length; k++) {
        assert.ok(
          seq[k] >= seq[k - 1],
          `set ${i + 1} ${paper} must run easiest-first (${seq[k - 1]} then ${seq[k]})`,
        );
      }
    }
  }

  // 前端按固定顺序原样取回，不能走会洗牌的 buildExam
  const exam = fs.readFileSync(examPath, 'utf8');
  assert.match(exam, /fetchQuestions\(chosen\.p1\)/);
  assert.match(exam, /fetchQuestions\(chosen\.p2\)/);
  assert.doesNotMatch(exam, /buildExam\([^)]*chosen/);
  const examLib = fs.readFileSync('src/lib/exam.ts', 'utf8');
  assert.match(examLib, /export async function fetchQuestions/);
  // 固定卷定义单独一个文件，index 形状仍然冻结
  const index = readJson('public/exam/index.json', (d) => Array.isArray(d) && d.length > 0);
  for (const entry of index) {
    for (const key of Object.keys(entry)) {
      assert.ok(['qid', 'db', 'hidden', 'diag'].includes(key), `unexpected index key ${key}`);
    }
  }
});

test('the countdown is driven by a deadline, never by counting ticks', () => {
  const source = fs.readFileSync(runnerPath, 'utf8');
  const runner = codeOnly(source);

  // 剩余秒数现算：后台标签页被限流时 setInterval 会被拉长甚至冻住，
  // 数 tick 等于把 Alt-Tab 变成免费暂停键，冻住的 left 还会被滚进时间银行
  assert.match(runner, /deadlineRef/);
  assert.match(runner, /remainingSeconds\(deadlineRef\.current\)/);
  assert.match(runner, /deadlineRef\.current = deadlineFrom\(/);
  assert.doesNotMatch(runner, /prev - 1|left - 1|\(prev\) => prev > 0/);
  // 回前台立刻重算一次
  assert.match(runner, /addEventListener\('visibilitychange'/);
  assert.match(runner, /removeEventListener\('visibilitychange'/);
  assert.match(runner, /document\.hidden/);
  // 银行也按截止时间现算，不读可能落后一个 tick 的 state
  assert.match(runner, /bankAfter\(remainingSeconds\(deadlineRef\.current\)\)/);

  // 纯函数层：Date.now() 参与计算，且不会给出负数
  const now = 1_000_000;
  assert.equal(remainingSeconds(now + 30_000, now), 30);
  assert.equal(remainingSeconds(now - 5_000, now), 0);
  assert.equal(remainingSeconds(now, now), 0);
  assert.equal(deadlineFrom(0, now), now + DIAGNOSTIC_BASE_SECONDS * 1000);
  assert.equal(deadlineFrom(45, now), now + (DIAGNOSTIC_BASE_SECONDS + 45) * 1000);
  // 切后台 20 秒回来，剩余就该少 20 秒——时间是墙钟走的，不是 tick 走的
  const deadline = deadlineFrom(0, now);
  assert.equal(remainingSeconds(deadline, now + 20_000), DIAGNOSTIC_BASE_SECONDS - 20);
});

test('the time bank rolls unused seconds into the next question, within a paper', () => {
  assert.equal(budgetFor(0), DIAGNOSTIC_BASE_SECONDS);

  const leftAfterFirst = DIAGNOSTIC_BASE_SECONDS - 45;
  const bank = bankAfter(leftAfterFirst);
  assert.equal(bank, 75);
  assert.equal(budgetFor(bank), DIAGNOSTIC_BASE_SECONDS + 75);

  const bank2 = bankAfter(budgetFor(bank) - 20);
  assert.equal(budgetFor(bank2), DIAGNOSTIC_BASE_SECONDS * 2 + 55);

  // 归零跳题：银行清空，拖满时间的人攒不到时间
  assert.equal(bankAfter(0), 0);
  assert.equal(bankAfter(-30), 0);
  assert.equal(bankAfter(12.7), 12);
  assert.equal(budgetFor(-5), DIAGNOSTIC_BASE_SECONDS);

  // Paper 2 开场，计时和银行一起清零，上一卷剩的时间不带过来
  const runner = codeOnly(fs.readFileSync(runnerPath, 'utf8'));
  assert.match(runner, /const startNextPaper = useCallback\(\(\) => \{[\s\S]*?setBank\(0\)/);
  assert.match(runner, /startNextPaper = useCallback\(\(\) => \{[\s\S]*?deadlineRef\.current = deadlineFrom\(0\)/);
  assert.match(runner, /startNextPaper = useCallback\(\(\) => \{[\s\S]*?setLeft\(budgetFor\(0\)\)/);
  // 休息期间不跑计时器
  assert.match(runner, /if \(stage !== 'run'\) return;\s*\n\s*const timer = window\.setInterval/);
});

test('pass is 36 of 40 and nothing else', () => {
  assert.equal(passMark(DIAGNOSTIC_TOTAL), 36);
  assert.equal(allowedMisses(DIAGNOSTIC_TOTAL), 4);
  assert.equal(isPass(36, 40), true);
  assert.equal(isPass(40, 40), true);
  assert.equal(isPass(35, 40), false);
  assert.equal(isPass(0, 40), false);
  // 空场次不算通过，别让 0/0 变成 NaN 或 true
  assert.equal(isPass(0, 0), false);
});

test('there are exactly two attempts, and each uses its own set', () => {
  assert.equal(DIAGNOSTIC_MAX_ATTEMPTS, 2);

  assert.equal(attemptsLeft(undefined), 2);
  assert.equal(canAttempt(undefined), true);
  assert.equal(setIndexForAttempt(undefined), 0);

  const once = { passed: false, attempts: 1, lastTs: 0 };
  assert.equal(attemptsLeft(once), 1);
  assert.equal(canAttempt(once), true);
  assert.equal(setIndexForAttempt(once), 1, 'the second attempt uses the second set');

  // 第三次进不去；越界时 setIndexForAttempt 硬失败（-1），
  // 不许静默降级重发套二——那会把「仅两次机会」架空
  const twice = { passed: false, attempts: 2, lastTs: 0 };
  assert.equal(attemptsLeft(twice), 0);
  assert.equal(canAttempt(twice), false);
  assert.equal(setIndexForAttempt(twice), -1);

  // 通过之后也不必再考
  assert.equal(canAttempt({ passed: true, attempts: 1, lastTs: 0 }), false);
  assert.equal(setIndexForAttempt({ passed: true, attempts: 1, lastTs: 0 }), -1);

  // 机会闸必须有两道：介绍页不渲染按钮只是展示层，
  // startDiagnostic 里的 canAttempt 才是真拦截
  const examApp = fs.readFileSync(examPath, 'utf8');
  assert.match(examApp, /startDiagnostic[\s\S]{0,200}canAttempt\(records\.diag\)/);

  // 介绍页据此换成「机会已用完」态，并把 365 那条路指清楚；
  // 判据必须吃整个 diag（只挑 attempts 会把 passed 丢在半路）
  const intro = fs.readFileSync(introPath, 'utf8');
  assert.match(intro, /canAttempt\(diag\)/);
  assert.doesNotMatch(intro, /canAttempt\(\{ attempts \}\)/);
  assert.match(intro, /t\.diagnostic\.exhausted\b/);
  assert.match(intro, /t\.diagnostic\.exhaustedHint/);
  assert.match(intro, /t\.diagnostic\.chance\(/);
  // 用完机会就不该再渲染开始按钮
  assert.match(intro, /allowed \? \(/);
});

test('submitting a diagnostic writes grill and diag only — never q or s', () => {
  const base = createEmptyRecords();
  const first = recordDiagnostic(base, [5, 7, 7, 9], false, { now: 1000 });

  assert.deepEqual(first.grill, [5, 7, 9]);
  assert.equal(grillCount(first), 3);
  assert.equal(first.diag.attempts, 1);
  assert.equal(first.diag.passed, false);
  assert.equal(first.diag.lastTs, 1000);

  // 对错一个字都不许落进 q / s：落了就会经错题榜和 Sessions 导出表泄出去
  assert.deepEqual(first.q, {}, 'diagnostic answers must not enter the question stats');
  assert.deepEqual(first.s, [], 'diagnostic sessions must not enter the session log');

  const second = recordDiagnostic(first, [9, 11], true, { now: 2000 });
  assert.deepEqual(second.grill, [5, 7, 9, 11]);
  assert.equal(second.diag.attempts, 2);
  assert.equal(second.diag.passed, true);
  assert.deepEqual(second.q, {});
  assert.deepEqual(second.s, []);

  // 通过之后再考砸也不收回解锁
  const third = recordDiagnostic(second, [13], false, { now: 3000 });
  assert.equal(third.diag.passed, true);
  assert.equal(third.diag.attempts, 3);
});

test('clearing practice records never revokes the 9.0 unlock', () => {
  const withUnlock = {
    v: 1,
    q: { 1: { a: 3, w: 1, t: 10, c: 0 } },
    s: [{ ts: 1, db: 'TMUA', mode: 'practice', n: 5, right: 3, answered: 5, sec: 60 }],
    grill: [101, 102],
    diag: { passed: true, attempts: 2, lastTs: 99 },
  };

  const cleared = clearRecords(withUnlock);
  // 练习记录清干净
  assert.deepEqual(cleared.q, {});
  assert.deepEqual(cleared.s, []);
  // 但 Pass 是结构性承诺，不该被清空按钮绕过；Grill 绑定同理
  assert.deepEqual(cleared.diag, { passed: true, attempts: 2, lastTs: 99 });
  assert.deepEqual(cleared.grill, [101, 102]);
  assert.equal(isHiddenModeUnlocked([{ qid: 1, db: 'TMUA' }], cleared), true);

  // 没有诊断战绩时行为不变：清成一份干净档案
  const plain = clearRecords({ v: 1, q: { 1: { a: 1, w: 0, t: 0, c: 1 } }, s: [] });
  assert.deepEqual(plain, createEmptyRecords());

  // 确认框要说清楚保留了什么
  const exam = fs.readFileSync(examPath, 'utf8');
  assert.match(exam, /t\.records\.clearKeepsUnlock/);
  assert.match(exam, /clearRecords\(records\)/);
});

test('9.0 unlocks by either route, and old archives still load', () => {
  const index = Array.from({ length: 400 }, (_, i) => ({ qid: i + 1, db: 'TMUA' }));

  const q = {};
  for (let i = 1; i <= HIDDEN_UNLOCK_COUNT; i++) q[String(i)] = { a: 1, w: 0, t: 0, c: 1 };
  assert.equal(isHiddenModeUnlocked(index, { v: 1, q, s: [] }), true);

  // 诊断通过，一道练习题都没做也算解锁
  assert.equal(
    isHiddenModeUnlocked(index, { v: 1, q: {}, s: [], diag: { passed: true, attempts: 1, lastTs: 0 } }),
    true,
  );
  assert.equal(
    isHiddenModeUnlocked(index, { v: 1, q: {}, s: [], diag: { passed: false, attempts: 2, lastTs: 0 } }),
    false,
  );

  // v:1 不变、不做迁移：老档案没有这两个字段，读进来补默认即可
  const old = normalizeRecords({ v: 1, q: { 1: { a: 1, w: 0, t: 0, c: 1 } }, s: [] });
  assert.equal(old.v, 1);
  assert.equal(old.grill, undefined);
  assert.equal(old.diag, undefined);

  // 脏字段不该炸
  const dirty = normalizeRecords({
    v: 1,
    q: {},
    s: [],
    grill: [3, 3, 'x', -1, 4],
    diag: { passed: 'yes', attempts: -2 },
  });
  assert.deepEqual(dirty.grill, [3, 4]);
  assert.deepEqual(dirty.diag, { passed: false, attempts: 0, lastTs: 0 });
});

test('the runner is one-way: no navigator, no back, no marking', () => {
  const source = fs.readFileSync(runnerPath, 'utf8');
  const runner = codeOnly(source);

  assert.doesNotMatch(runner, /Navigator/);
  assert.doesNotMatch(runner, /navPanel|navGrid|navCell|navOpen/);
  assert.doesNotMatch(runner, /Back/);
  assert.doesNotMatch(runner, /Flag|flagOn|flagged/);
  assert.doesNotMatch(runner, /optCorrect|optWrong/);
  assert.doesNotMatch(runner, /solPanel|solBlur|solution|solShown/);
  assert.doesNotMatch(runner, /feedback|fbOk|fbBad/);
  assert.doesNotMatch(runner, /graded|gradeCurrent/);

  // 键盘只留选项与确认；←→ 和 F 在诊断里没有意义
  assert.doesNotMatch(runner, /ArrowLeft|ArrowRight|ArrowUp|ArrowDown/);
  assert.match(source, /e\.key === 'Enter'/);
  assert.match(source, /\/\^\[1-9\]\$\//);

  // 归零自动确认，确认后单向推进
  assert.match(source, /if \(left > 0 \|\| stage !== 'run'\) return;/);
  assert.match(source, /confirmRef\.current\(\);/);
  assert.match(source, /setIdx\(\(i\) => i \+ 1\)/);
  assert.match(source, /doneRef/);
});

test('the break page carries no score information at all', () => {
  const source = fs.readFileSync(runnerPath, 'utf8');
  const breakBlock = source.slice(
    source.indexOf("if (stage === 'break')"),
    source.indexOf("if (!q) return null;"),
  );
  assert.ok(breakBlock.length > 0, 'the break stage must render its own page');

  // 休息页只说下一卷的事，一个成绩字样都不给
  assert.match(breakBlock, /t\.diagnostic\.breakTitle/);
  assert.match(breakBlock, /t\.diagnostic\.breakStart/);
  assert.doesNotMatch(breakBlock, /right|score|correct|accuracy|answers\[/i);
  assert.doesNotMatch(breakBlock, /passMark|isPass/);
  // 休息不限时
  assert.doesNotMatch(breakBlock, /fmtCountdown|Time Remaining/);
});

test('abandoning is a real exit that persists nothing', () => {
  const source = fs.readFileSync(runnerPath, 'utf8');
  const runner = codeOnly(source);
  const exam = fs.readFileSync(examPath, 'utf8');

  assert.match(runner, /t\.diagnostic\.abandon\b/);
  assert.match(runner, /setConfirmAbandon\(true\)/);
  assert.match(runner, /t\.diagnostic\.abandonConfirm/);
  assert.match(runner, /t\.diagnostic\.abandonNo/);
  assert.match(runner, /role="dialog"/);

  // 自绘弹窗，不能用 window.confirm：它阻塞事件循环，倒计时会跟着停
  assert.doesNotMatch(runner, /window\.confirm|[^.]\bconfirm\(/);
  assert.match(source, /const timer = window\.setInterval\(syncLeft, DIAGNOSTIC_TICK_MS\)/);
  assert.doesNotMatch(runner, /clearInterval\(timer\)[\s\S]{0,80}confirmAbandon/);
  // 末题归零同帧竞态：已落盘就别再弹放弃框
  assert.match(runner, /if \(doneRef\.current\) return;\s*\n\s*setConfirmAbandon\(true\)/);

  const abandonBody = exam.slice(
    exam.indexOf('const abandonDiagnostic'),
    exam.indexOf('const abandonDiagnostic') + 320,
  );
  assert.ok(abandonBody.length > 0, 'abandonDiagnostic must exist');
  assert.doesNotMatch(abandonBody, /recordDiagnostic|saveRecords|setRecords/);
  assert.match(exam, /onAbandon=\{abandonDiagnostic\}/);
  assert.match(runner, /doneRef\.current = true;[\s\S]{0,120}onAbandon\(\)/);
});

test('the verdict page gives two states and nothing else', () => {
  const result = codeOnly(fs.readFileSync(resultPath, 'utf8'));

  assert.match(result, /PASS/);
  assert.match(result, /FAIL/);
  assert.doesNotMatch(result, /solution|answer|choices|MathText/);
  assert.doesNotMatch(result, /reviewCard|choiceRow/);
  assert.doesNotMatch(result, /right|accuracy|%|\/ questions\.length/);
  assert.match(result, /已加入 Grill/);
});

test('the locked 9.0 card opens the diagnostic intro, charge bar and all', () => {
  const exam = fs.readFileSync(examPath, 'utf8');
  const intro = fs.readFileSync(introPath, 'utf8');
  const deck = fs.readFileSync('src/components/deck/CardDeck.tsx', 'utf8');

  assert.match(exam, /frontZone === 'trivial' && !hiddenUnlocked \? \(/);
  assert.match(exam, /<DiagnosticIntro/);

  // 规则是大白话短句，六条
  for (const key of [
    'rulePapers',
    'ruleTime',
    'ruleTimeout',
    'ruleNoFeedback',
    'rulePass',
    'ruleChances',
  ]) {
    assert.ok(intro.includes(`t.diagnostic.${key}`), `intro must show ${key}`);
  }
  assert.match(intro, /examStyles\.libraryChargeFill/);
  assert.match(intro, /t\.diagnostic\.orPractice/);
  assert.match(intro, /useLang\(\)/);

  // 读屏念出来的要是它真正会做的事
  assert.match(deck, /t\.deck\.diagnosticAria/);

  // 全屏只认同步手势链
  assert.match(exam, /onStart=\{\(\) => void startDiagnostic\(\)\}/);
  assert.match(exam, /document\.documentElement\.requestFullscreen\?\.\(\)/);
});

test('diagnostic is its own phase, so practice and mock are untouched', () => {
  const exam = fs.readFileSync(examPath, 'utf8');

  assert.match(exam, /type Phase = 'setup' \| 'loading' \| 'exam' \| 'result' \| 'diagnostic' \| 'diagResult'/);
  assert.match(exam, /if \(phase === 'diagnostic'\)/);
  assert.match(exam, /if \(phase === 'diagResult'\)/);
  assert.match(exam, /if \(phase !== 'exam' \|\| !q\) return;/);
  assert.match(exam, /recordDiagnostic\(records, qids, passed\)/);
  assert.doesNotMatch(exam, /addSession\([^)]*diag/);

  // 导入不该把诊断战绩冲掉。P3 起记录文件带得动它们了，
  // 于是改成与本机合并（并集 / OR / max），而不是一律用本机的盖掉
  assert.match(exam, /mergeDiagnostic\(records, imported\)/);
  const records = fs.readFileSync(recordsPath, 'utf8');
  // 场次表本身仍只写场次；绑定集与战绩走 P3 新加的独立 Diagnostic 表
  const sessionRowsBlock = records.slice(
    records.indexOf('const sessionRows = ['),
    records.indexOf('const diag = records.diag;'),
  );
  assert.ok(sessionRowsBlock.length > 0, 'the session rows block must exist');
  assert.doesNotMatch(sessionRowsBlock, /grill|diag/);
});

test('diagnostic motion stays on the compositor', () => {
  const css = fs.readFileSync(cssPath, 'utf8');
  const declarations = css.match(/transition:[^;]*/g) || [];
  assert.ok(declarations.length >= 1);
  for (const declaration of declarations) {
    for (const banned of ['width', 'height', 'top', 'left', 'margin', 'filter', 'box-shadow']) {
      assert.equal(
        declaration.includes(banned),
        false,
        `non-composited property "${banned}" in ${declaration.trim()}`,
      );
    }
  }
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /backdrop-filter/);
});
