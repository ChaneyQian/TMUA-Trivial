import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

// 7.5+ Diagnostic（2026-09-28 起取代 GMAT 两卷制）的引擎与界面约束。
// 旧 GMAT 时代的每一条都还在，按新规则改写成对应的不变量：
// 两卷 40 题 → 单卷 10 题；120s → 240s；36/40 → 8/10；中场休息 → 没有休息。

import {
  DIAGNOSTIC_BASE_SECONDS,
  DIAGNOSTIC_EXAM,
  DIAGNOSTIC_MAX_ATTEMPTS,
  DIAGNOSTIC_PAPER_SIZE,
  DIAGNOSTIC_PASS_RIGHT,
  allowedMisses,
  attemptsLeft,
  bankAfter,
  budgetFor,
  canAttempt,
  choiceForKey,
  deadlineFrom,
  diagnosticStatus,
  fetchDiagnosticPapers,
  isPass,
  paperIndexForAttempt,
  parseDiagnosticPapers,
  passMark,
  remainingSeconds,
} from '../src/lib/diagnostic.ts';
import { DICT } from '../src/lib/i18n.ts';
import {
  clearRecords,
  createEmptyRecords,
  grillCount,
  isHiddenModeUnlocked,
  normalizeRecords,
  recordDiagnostic,
  HIDDEN_UNLOCK_COUNT,
} from '../src/lib/records.ts';
import { readExamIndex, readExamJson, readExamQuestion } from './helpers/exam-data.mjs';

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

const introPath = 'src/components/diagnostic/DiagnosticIntro.tsx';
const runnerPath = 'src/components/diagnostic/DiagnosticRunner.tsx';
const resultPath = 'src/components/diagnostic/DiagnosticResult.tsx';
const cssPath = 'src/components/diagnostic/Diagnostic.module.css';
const examPath = 'src/components/exam/ExamApp.tsx';
const recordsPath = 'src/lib/records.ts';

/** 两卷都在 / 卷二准备中，两份合法的 diag.json */
const PAPERS = {
  v: 2,
  exam: '7.5+',
  papers: [
    { id: 'p1', qids: [11, 12, 13] },
    { id: 'p2', qids: [21, 22, 23] },
  ],
};
const P2_PENDING = {
  v: 2,
  exam: '7.5+',
  papers: [
    { id: 'p1', qids: [11, 12, 13] },
    { id: 'p2', qids: null },
  ],
};

test('the diagnostic ships fixed 7.5+ papers, not a random draw', () => {
  // v2 起是 7.5+ 的卷结构（scripts\diag75-papers.mjs 组卷）：两次机会各一卷，
  // 卷一固定 10 道，卷二凑不满 10 道已复核 SMT 时是 null（准备中）
  const diag = readExamJson('diag.json', (d) => d?.v === 2 && Array.isArray(d.papers));
  // 真实产物必须过得了前端的形状闸
  assert.deepEqual(parseDiagnosticPapers(diag), diag);
  assert.equal(diag.exam, DIAGNOSTIC_EXAM);
  assert.equal(diag.papers.length, DIAGNOSTIC_MAX_ATTEMPTS, 'one fixed paper per attempt');
  const [p1, p2] = diag.papers.map((paper) => paper.qids);
  assert.equal(p1.length, DIAGNOSTIC_PAPER_SIZE, 'paper 1 is the ten fixed questions');
  assert.ok(p2 === null || p2.length === DIAGNOSTIC_PAPER_SIZE, 'paper 2 is either ready in full or not at all');
  // 两卷互不重题
  if (p2) {
    assert.equal(p2.filter((qid) => p1.includes(qid)).length, 0, 'the two papers must not share a question');
  }

  // GMAT 两卷制下线：它的题一道都不在卷里（从前两套 80 题全是它）
  const index = readExamIndex();
  const gmat = new Set(index.filter((entry) => entry.db === 'GMAT').map((entry) => entry.qid));
  assert.ok(gmat.size > 0, 'GMAT 单题仍在 index 里（复烤区还要看），这条守卫才有负载');
  assert.equal([...p1, ...(p2 || [])].some((qid) => gmat.has(qid)), false, 'GMAT is retired from the papers');

  // 前端按固定顺序原样取回，不能走会洗牌的 buildExam
  const exam = codeOnly(fs.readFileSync(examPath, 'utf8'));
  assert.match(exam, /const questions = await fetchQuestions\(status\.qids\);/);
  assert.doesNotMatch(exam, /buildExam\([^)]*status/);
  const examLib = fs.readFileSync('src/lib/exam.ts', 'utf8');
  assert.match(examLib, /export async function fetchQuestions/);
  // 卷定义单独一个文件，index 形状仍然冻结。
  // logic / tagged（逻辑推理开关及其覆盖率提示）与 reserved（7.5+ 卷里经典区那两道，
  // 移出练习池）是后来加的可选标记，和 hidden / diag 同体例：这张白名单要拦的是
  // 「把整份固定卷塞进 index」那类膨胀，不是拦所有新字段
  for (const entry of index) {
    for (const key of Object.keys(entry)) {
      assert.ok(
        ['qid', 'db', 'hidden', 'diag', 'logic', 'tagged', 'reserved'].includes(key),
        `unexpected index key ${key}`,
      );
    }
  }
});

test('a malformed diag.json is rejected instead of crashing the intro card', async (t) => {
  // 与 topics.ts / papers.ts 同款形状闸：只校 res.ok 挡不住代理/CDN 返回 200 的
  // 错误体，也挡不住改了结构撞上旧缓存。畸形数据进了 state，介绍页里
  // diagnosticStatus 读 papers.papers[i].qids 就是一条 TypeError 白屏路径
  const realFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = realFetch;
  });

  for (const good of [PAPERS, P2_PENDING]) {
    globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => good });
    assert.deepEqual(await fetchDiagnosticPapers(), good);
  }

  const junks = [
    // 下线了的 GMAT 两卷制（v1）：一份旧缓存不能让它死灰复燃
    { v: 1, sets: [{ p1: [1], p2: [2] }] },
    { v: 2, exam: 'GMAT', papers: PAPERS.papers },
    { v: 2, papers: PAPERS.papers },
    // 卷一必须是满的；只有卷二可以是 null
    { v: 2, exam: '7.5+', papers: [{ id: 'p1', qids: null }, { id: 'p2', qids: [21] }] },
    { v: 2, exam: '7.5+', papers: [{ id: 'p1', qids: [] }, { id: 'p2', qids: null }] },
    { v: 2, exam: '7.5+', papers: [{ id: 'p2', qids: [21] }, { id: 'p1', qids: [11] }] },
    { v: 2, exam: '7.5+', papers: [PAPERS.papers[0]] },
    { v: 2, exam: '7.5+', papers: [{ id: 'p1', qids: [11, 'x'] }, { id: 'p2', qids: null }] },
    { v: 2, exam: '7.5+', papers: [{ id: 'p1', qids: [11, -3] }, { id: 'p2', qids: null }] },
    { v: 2, exam: '7.5+', papers: 'x' },
    { v: 2, exam: '7.5+' },
    null,
  ];
  for (const junk of junks) {
    assert.throws(() => parseDiagnosticPapers(junk), /shape/, `畸形负载 ${JSON.stringify(junk)} 不该被放进来`);
    globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => junk });
    await assert.rejects(fetchDiagnosticPapers(), /shape/);
  }

  // 非 200 仍然是非 200
  globalThis.fetch = async () => ({ ok: false, status: 404, json: async () => PAPERS });
  await assert.rejects(fetchDiagnosticPapers(), /404/);

  // 前端：取不到就一直是 null，介绍页按「尚未就绪」处理，不白屏
  assert.equal(diagnosticStatus(null, undefined).kind, 'unavailable');
  const exam = codeOnly(fs.readFileSync(examPath, 'utf8'));
  assert.match(exam, /fetchDiagnosticPapers\(\)[\s\S]{0,200}\.catch\(\(\) => \{\}\)/);
  assert.match(exam, /papers=\{diagPapers\}/);
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

  // 纯函数层：每题基准 240 秒；Date.now() 参与计算，且不会给出负数
  assert.equal(DIAGNOSTIC_BASE_SECONDS, 240);
  const now = 1_000_000;
  assert.equal(remainingSeconds(now + 30_000, now), 30);
  assert.equal(remainingSeconds(now - 5_000, now), 0);
  assert.equal(remainingSeconds(now, now), 0);
  assert.equal(deadlineFrom(0, now), now + 240 * 1000);
  assert.equal(deadlineFrom(45, now), now + (240 + 45) * 1000);
  // 切后台 20 秒回来，剩余就该少 20 秒——时间是墙钟走的，不是 tick 走的
  const deadline = deadlineFrom(0, now);
  assert.equal(remainingSeconds(deadline, now + 20_000), 240 - 20);
});

test('the time bank rolls unused seconds forward through the whole paper', () => {
  assert.equal(budgetFor(0), 240);

  // 第一题用了 45 秒：剩下的 195 秒滚进第二题
  const bank = bankAfter(240 - 45);
  assert.equal(bank, 195);
  assert.equal(budgetFor(bank), 240 + 195);

  // 第二题又只用了 20 秒：银行接着滚，不设上限、不在中途清零
  const bank2 = bankAfter(budgetFor(bank) - 20);
  assert.equal(budgetFor(bank2), 240 * 3 - 65);

  // 归零跳题：银行清空，拖满时间的人攒不到时间
  assert.equal(bankAfter(0), 0);
  assert.equal(bankAfter(-30), 0);
  assert.equal(bankAfter(12.7), 12);
  assert.equal(budgetFor(-5), 240);

  // 单卷：只在开考那一刻起算一次，确认一题就把银行滚进下一题，直到交卷
  const runner = codeOnly(fs.readFileSync(runnerPath, 'utf8'));
  assert.match(runner, /const nextBank = bankAfter\(remainingSeconds\(deadlineRef\.current\)\);/);
  assert.match(runner, /setBank\(nextBank\);\s*\n\s*setIdx\(\(i\) => i \+ 1\);\s*\n\s*deadlineRef\.current = deadlineFrom\(nextBank\);/);
  // 没有「换卷清零」那一步了
  assert.doesNotMatch(runner, /setBank\(0\)|deadlineFrom\(0\)/);
});

test('pass is 8 of 10 and nothing else', () => {
  assert.equal(DIAGNOSTIC_PAPER_SIZE, 10);
  assert.equal(DIAGNOSTIC_PASS_RIGHT, 8);
  assert.equal(passMark(), 8);
  assert.equal(passMark(DIAGNOSTIC_PAPER_SIZE), 8);
  assert.equal(allowedMisses(DIAGNOSTIC_PAPER_SIZE), 2);
  assert.equal(isPass(8, 10), true);
  assert.equal(isPass(10, 10), true);
  assert.equal(isPass(7, 10), false);
  assert.equal(isPass(0, 10), false);
  // 空场次不算通过，别让 0/0 变成 NaN 或 true
  assert.equal(isPass(0, 0), false);
  // 交卷用的正是这个判据
  const exam = fs.readFileSync(examPath, 'utf8');
  assert.match(exam, /const passed = isPass\(right, qids\.length\);/);
});

test('there are exactly two attempts, each on its own paper, and a missing paper 2 neither starts nor costs one', () => {
  assert.equal(DIAGNOSTIC_MAX_ATTEMPTS, 2);

  // 第一次机会：卷一
  assert.equal(attemptsLeft(undefined), 2);
  assert.equal(canAttempt(undefined), true);
  assert.equal(paperIndexForAttempt(undefined), 0);
  assert.deepEqual(diagnosticStatus(PAPERS, undefined), { kind: 'ready', nth: 1, paper: 'p1', qids: [11, 12, 13] });
  // 卷二有没有出齐，都不影响第一次考卷一
  assert.equal(diagnosticStatus(P2_PENDING, undefined).kind, 'ready');

  // 第二次机会：卷二
  const once = { passed: false, attempts: 1, lastTs: 0 };
  assert.equal(attemptsLeft(once), 1);
  assert.equal(paperIndexForAttempt(once), 1, 'the second attempt uses the second paper');
  assert.deepEqual(diagnosticStatus(PAPERS, once), { kind: 'ready', nth: 2, paper: 'p2', qids: [21, 22, 23] });

  // 卷二没出齐：不能开始（pending），而且判定本身不动记录——机会只在交卷时消耗
  const snapshot = structuredClone(once);
  assert.deepEqual(diagnosticStatus(P2_PENDING, once), { kind: 'pending', nth: 2, paper: 'p2' });
  assert.deepEqual(once, snapshot, 'looking at a pending paper must not spend the attempt');
  assert.equal(attemptsLeft(once), 1);
  // 卷二一出齐，同一份记录就能开考
  assert.equal(diagnosticStatus(PAPERS, once).kind, 'ready');

  // 第三次进不去；越界时 paperIndexForAttempt 硬失败（-1），
  // 不许静默降级重发卷二——那会把「仅两次机会」架空
  const twice = { passed: false, attempts: 2, lastTs: 0 };
  assert.equal(attemptsLeft(twice), 0);
  assert.equal(canAttempt(twice), false);
  assert.equal(paperIndexForAttempt(twice), -1);
  assert.equal(diagnosticStatus(PAPERS, twice).kind, 'exhausted');
  assert.equal(diagnosticStatus(null, twice).kind, 'exhausted', 'exhausted wins even without the papers');

  // 通过之后也不必再考
  const passed = { passed: true, attempts: 1, lastTs: 0 };
  assert.equal(canAttempt(passed), false);
  assert.equal(paperIndexForAttempt(passed), -1);
  assert.equal(diagnosticStatus(PAPERS, passed).kind, 'passed');

  // 取回的 qids 是副本，改它不会改坏卷定义
  const ready = diagnosticStatus(PAPERS, undefined);
  ready.qids.push(99);
  assert.deepEqual(PAPERS.papers[0].qids, [11, 12, 13]);

  // 开考闸必须有两道：介绍页不给按钮只是展示层，
  // startDiagnostic 里同一个 diagnosticStatus 才是真拦截，而且拦在任何状态改动之前
  const examApp = codeOnly(fs.readFileSync(examPath, 'utf8'));
  assert.match(
    examApp,
    /const status = diagnosticStatus\(diagPapers, records\.diag75\);\s*\n\s*if \(!index \|\| status\.kind !== 'ready'\) return;/,
  );
  // 机会只在交卷时消耗：记录诊断的调用只有一处，在 finishDiagnostic 里
  assert.equal((examApp.match(/recordDiagnostic\(/g) || []).length, 1);
  assert.match(examApp, /const finishDiagnostic = [\s\S]{0,200}recordDiagnostic\(records, qids, passed\)/);

  // 介绍页：判据吃整个 diag（只挑 attempts 会把 passed 丢在半路），
  // 用完换成「机会已用完」态并把 365 那条路指清楚；卷二没出齐单独一态、说清原因
  const intro = codeOnly(fs.readFileSync(introPath, 'utf8'));
  assert.match(intro, /const status = diagnosticStatus\(papers, diag\);/);
  assert.match(intro, /t\.diagnostic\.exhausted\b/);
  assert.match(intro, /t\.diagnostic\.exhaustedHint/);
  assert.match(intro, /t\.diagnostic\.pendingTitle/);
  assert.match(intro, /t\.diagnostic\.pendingHint/);
  assert.match(intro, /t\.diagnostic\.chance\(/);
  // 开始按钮只活在 ready / unavailable 那一支里，且只有 ready 才可按
  assert.match(intro, /status\.kind === 'ready' \|\| status\.kind === 'unavailable' \? \(/);
  assert.match(intro, /disabled=\{busy \|\| status\.kind !== 'ready'\}/);
  assert.equal((intro.match(/onClick=\{onStart\}/g) || []).length, 1);
});

test('submitting a diagnostic writes grill and diag75 only — never q or s', () => {
  // GMAT 下线后考试只有 7.5+ 这一场，战绩记在 diag75；旧的 diag 一个字都不碰
  const legacy = { passed: false, attempts: 2, lastTs: 7 };
  const base = { ...createEmptyRecords(), diag: legacy };
  const first = recordDiagnostic(base, [5, 7, 7, 9], false, { now: 1000 });

  assert.deepEqual(first.grill, [5, 7, 9]);
  assert.equal(grillCount(first), 3);
  assert.equal(first.diag75.attempts, 1);
  assert.equal(first.diag75.passed, false);
  assert.equal(first.diag75.lastTs, 1000);
  assert.deepEqual(first.diag, legacy, 'the retired GMAT record is left exactly as it was');

  // 对错一个字都不许落进 q / s：落了就会经错题榜和 Sessions 导出表泄出去
  assert.deepEqual(first.q, {}, 'diagnostic answers must not enter the question stats');
  assert.deepEqual(first.s, [], 'diagnostic sessions must not enter the session log');

  const second = recordDiagnostic(first, [9, 11], true, { now: 2000 });
  assert.deepEqual(second.grill, [5, 7, 9, 11]);
  assert.equal(second.diag75.attempts, 2);
  assert.equal(second.diag75.passed, true);
  assert.deepEqual(second.q, {});
  assert.deepEqual(second.s, []);

  // 通过之后再考砸也不收回解锁
  const third = recordDiagnostic(second, [13], false, { now: 3000 });
  assert.equal(third.diag75.passed, true);
  assert.equal(third.diag75.attempts, 3);
});

test('clearing practice records never revokes the 9.0 unlock', () => {
  const withUnlock = {
    v: 1,
    q: { 1: { a: 3, w: 1, t: 10, c: 0 } },
    s: [{ ts: 1, db: 'TMUA', mode: 'practice', n: 5, right: 3, answered: 5, sec: 60 }],
    grill: [101, 102],
    diag: { passed: true, attempts: 2, lastTs: 99 },
    diag75: { passed: false, attempts: 1, lastTs: 120 },
  };

  const cleared = clearRecords(withUnlock);
  // 练习记录清干净
  assert.deepEqual(cleared.q, {});
  assert.deepEqual(cleared.s, []);
  // 但 Pass 是结构性承诺，不该被清空按钮绕过；Grill 绑定同理
  assert.deepEqual(cleared.diag, { passed: true, attempts: 2, lastTs: 99 });
  assert.deepEqual(cleared.grill, [101, 102]);
  assert.equal(isHiddenModeUnlocked([{ qid: 1, db: 'TMUA' }], cleared), true);
  // 7.5+ 的战绩同样留着：清空练习记录不是重新领两次机会的后门
  assert.deepEqual(cleared.diag75, { passed: false, attempts: 1, lastTs: 120 });
  const passed75 = clearRecords({ v: 1, q: {}, s: [], diag75: { passed: true, attempts: 1, lastTs: 5 } });
  assert.equal(isHiddenModeUnlocked([{ qid: 1, db: 'TMUA' }], passed75), true);

  // 没有诊断战绩时行为不变：清成一份干净档案
  const plain = clearRecords({ v: 1, q: { 1: { a: 1, w: 0, t: 0, c: 1 } }, s: [] });
  assert.deepEqual(plain, createEmptyRecords());

  // 确认框要说清楚保留了什么
  const exam = fs.readFileSync(examPath, 'utf8');
  assert.match(exam, /t\.records\.clearKeepsUnlock/);
  assert.match(exam, /clearRecords\(records\)/);
});

test('9.0 unlocks by any of three routes, and old archives still load', () => {
  const index = Array.from({ length: 400 }, (_, i) => ({ qid: i + 1, db: 'TMUA' }));

  const q = {};
  for (let i = 1; i <= HIDDEN_UNLOCK_COUNT; i++) q[String(i)] = { a: 1, w: 0, t: 0, c: 1 };
  assert.equal(isHiddenModeUnlocked(index, { v: 1, q, s: [] }), true);

  // 诊断通过，一道练习题都没做也算解锁：旧 GMAT 通过的下线不收回，7.5+ 通过的同样算
  assert.equal(
    isHiddenModeUnlocked(index, { v: 1, q: {}, s: [], diag: { passed: true, attempts: 1, lastTs: 0 } }),
    true,
  );
  assert.equal(
    isHiddenModeUnlocked(index, { v: 1, q: {}, s: [], diag75: { passed: true, attempts: 1, lastTs: 0 } }),
    true,
  );
  assert.equal(
    isHiddenModeUnlocked(index, { v: 1, q: {}, s: [], diag: { passed: false, attempts: 2, lastTs: 0 } }),
    false,
  );
  assert.equal(
    isHiddenModeUnlocked(index, {
      v: 1,
      q: {},
      s: [],
      diag: { passed: false, attempts: 2, lastTs: 0 },
      diag75: { passed: false, attempts: 2, lastTs: 0 },
    }),
    false,
  );

  // v:1 不变、不做迁移：老档案没有这几个字段，读进来补默认即可
  const old = normalizeRecords({ v: 1, q: { 1: { a: 1, w: 0, t: 0, c: 1 } }, s: [] });
  assert.equal(old.v, 1);
  assert.equal(old.grill, undefined);
  assert.equal(old.diag, undefined);
  assert.equal(old.diag75, undefined);

  // 脏字段不该炸
  const dirty = normalizeRecords({
    v: 1,
    q: {},
    s: [],
    grill: [3, 3, 'x', -1, 4],
    diag: { passed: 'yes', attempts: -2 },
    diag75: { passed: 1, attempts: 1.5, lastTs: 'x' },
  });
  assert.deepEqual(dirty.grill, [3, 4]);
  assert.deepEqual(dirty.diag, { passed: false, attempts: 0, lastTs: 0 });
  assert.deepEqual(dirty.diag75, { passed: false, attempts: 0, lastTs: 0 });
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

  // 键盘只留选项与确认；←→ 和 F 在诊断里没有意义。
  // 选项键的映射抽成了纯函数 choiceForKey（1–9 / A–L，见下面那条行为测试）
  assert.doesNotMatch(runner, /ArrowLeft|ArrowRight|ArrowUp|ArrowDown/);
  assert.match(source, /e\.key === 'Enter'/);
  assert.match(runner, /choiceForKey\(/);

  // 归零自动确认，确认后单向推进
  assert.match(source, /if \(left > 0\) return;/);
  assert.match(source, /confirmRef\.current\(\);/);
  assert.match(source, /setIdx\(\(i\) => i \+ 1\)/);
  assert.match(source, /doneRef/);
});

test('there is no break page: one paper, one clock, one bank', () => {
  // GMAT 两卷制有中场休息（计时与银行清零）；7.5+ 单卷，这一整页连同它的文案一起退场
  const runner = codeOnly(fs.readFileSync(runnerPath, 'utf8'));
  assert.doesNotMatch(runner, /stage|break|startNextPaper|paperIdx/i);
  // 计时器不再被「是否在休息」挡着：开场即走，一直走到交卷
  assert.match(runner, /useEffect\(\(\) => \{\s*\n\s*const timer = window\.setInterval\(syncLeft, DIAGNOSTIC_TICK_MS\);/);
  // 只收一卷题
  assert.match(runner, /questions: ExamQuestion\[\];/);
  assert.doesNotMatch(runner, /papers: ExamQuestion\[\]\[\]/);
  const exam = codeOnly(fs.readFileSync(examPath, 'utf8'));
  assert.match(exam, /<DiagnosticRunner\s+questions=\{diagQuestions\}/);

  // 休息页的文案也不留残：两种语言的字典里都没有 break* 了
  for (const lang of ['zh', 'en']) {
    const keys = Object.keys(DICT[lang].diagnostic);
    assert.deepEqual(keys.filter((key) => /^break/.test(key)), [], `${lang} still carries break copy`);
  }
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
  // 没过、还有机会、但卷二没出齐：文案先说「现在还考不了」，别让人回去对着灰按钮发愣
  assert.match(result, /nextPaperPending/);
  const exam = codeOnly(fs.readFileSync(examPath, 'utf8'));
  assert.match(exam, /nextPaperPending=\{diagnosticStatus\(diagPapers, records\.diag75\)\.kind === 'pending'\}/);
  assert.match(exam, /attemptsLeft=\{attemptsLeft\(records\.diag75\)\}/);
});

test('the locked 9.0 card opens the diagnostic intro, charge bar and all', () => {
  const exam = fs.readFileSync(examPath, 'utf8');
  const intro = fs.readFileSync(introPath, 'utf8');
  const deck = fs.readFileSync('src/components/deck/CardDeck.tsx', 'utf8');

  assert.match(exam, /frontZone === 'trivial' && !hiddenUnlocked \? \(/);
  assert.match(exam, /<DiagnosticIntro/);
  // 介绍页读的是 7.5+ 的战绩；旧 GMAT 的次数只用来决定要不要说「以前的不算」
  assert.match(exam, /diag=\{records\.diag75\}/);
  assert.match(exam, /legacyAttempts=\{records\.diag\?\.attempts \?\? 0\}/);

  // 规则是大白话短句，七条：数字全从常量来，改规则不用改文案
  for (const call of [
    't.diagnostic.rulePaper(DIAGNOSTIC_PAPER_SIZE)',
    't.diagnostic.ruleTime(DIAGNOSTIC_BASE_SECONDS / 60)',
    't.diagnostic.ruleOneWay',
    't.diagnostic.ruleNoFeedback',
    't.diagnostic.rulePass(passMark(), DIAGNOSTIC_PAPER_SIZE)',
    't.diagnostic.ruleChances(DIAGNOSTIC_MAX_ATTEMPTS)',
    't.diagnostic.ruleUnlock',
  ]) {
    assert.ok(intro.includes(call), `intro must show ${call}`);
  }
  assert.match(intro, /examStyles\.libraryChargeFill/);
  assert.match(intro, /t\.diagnostic\.orPractice/);
  assert.match(intro, /t\.diagnostic\.legacyNote/);
  assert.match(intro, /useLang\(\)/);

  // 读屏念出来的要是它真正会做的事
  assert.match(deck, /t\.deck\.diagnosticAria/);

  // 全屏只认同步手势链
  assert.match(exam, /onStart=\{\(\) => void startDiagnostic\(\)\}/);
  assert.match(exam, /document\.documentElement\.requestFullscreen\?\.\(\)/);
});

test('the intro says every rule in plain words, in both languages', () => {
  for (const lang of ['zh', 'en']) {
    const d = DICT[lang].diagnostic;
    assert.equal(d.title, '7.5+ Diagnostic');
    // 一卷 10 题
    assert.match(d.rulePaper(DIAGNOSTIC_PAPER_SIZE), /10/);
    // 每题 4 分钟，提前答完余时顺延
    assert.match(d.ruleTime(DIAGNOSTIC_BASE_SECONDS / 60), lang === 'zh' ? /4 分钟[\s\S]*顺延/ : /4 minutes[\s\S]*carries over/);
    // 不能回头、全程不告诉对错
    assert.match(d.ruleOneWay, lang === 'zh' ? /不能回头/ : /cannot go back/);
    assert.match(d.ruleNoFeedback, lang === 'zh' ? /不告诉你对错/ : /never told/);
    // 对 8 题通过
    assert.match(d.rulePass(passMark(), DIAGNOSTIC_PAPER_SIZE), /8[\s\S]*10/);
    // 两次机会，每次不同的题
    assert.match(d.ruleChances(DIAGNOSTIC_MAX_ATTEMPTS), lang === 'zh' ? /2 次机会[\s\S]*不一样/ : /2 attempts[\s\S]*different/);
    // 通过即解锁 9.0，与做满 365 并列
    assert.match(d.ruleUnlock, /9\.0/);
    assert.match(d.ruleUnlock, /365/);
    // 卷二没出齐时要说清楚原因，且说明机会不扣
    assert.match(d.pendingTitle, lang === 'zh' ? /卷二/ : /Paper 2/);
    assert.match(d.pendingHint, lang === 'zh' ? /不会被扣掉/ : /will not be used up/);
    // 大白话短句：每条规则一句话说完，不写成一段
    for (const rule of [d.ruleOneWay, d.ruleNoFeedback, d.ruleUnlock, d.rulePaper(10), d.ruleChances(2)]) {
      assert.ok(rule.length <= 120, `rule too long for a short plain sentence: ${rule}`);
    }
  }
  // 两种语言真的翻过
  assert.notEqual(DICT.zh.diagnostic.pendingHint, DICT.en.diagnostic.pendingHint);
  assert.notEqual(DICT.zh.diagnostic.ruleUnlock, DICT.en.diagnostic.ruleUnlock);
});

test('the runner takes 4–12 options, lowercase MAT labels and inline options', () => {
  // 纯函数：1–9 按序号，字母按选项自己的标号（大小写不敏感）
  const twelve = 'ABCDEFGHIJKL'.split('');
  assert.equal(choiceForKey(twelve, '1'), 'A');
  assert.equal(choiceForKey(twelve, '9'), 'I');
  assert.equal(choiceForKey(twelve, 'l'), 'L', 'the twelfth option is reachable by letter');
  assert.equal(choiceForKey(twelve, 'L'), 'L');
  assert.equal(choiceForKey(twelve, 'm'), null);
  assert.equal(choiceForKey(twelve, '0'), null);
  assert.equal(choiceForKey(twelve, 'Enter'), null);
  assert.equal(choiceForKey(twelve, 'F1'), null);

  const mat = ['a', 'b', 'c', 'd'];
  assert.equal(choiceForKey(mat, 'A'), 'a', 'MAT labels are lower case; the key matches either way');
  assert.equal(choiceForKey(mat, 'd'), 'd');
  assert.equal(choiceForKey(mat, 'e'), null);
  assert.equal(choiceForKey(mat, '4'), 'd');
  assert.equal(choiceForKey(mat, '5'), null);

  const roman = ['i', 'ii', 'iii', 'iv'];
  assert.equal(choiceForKey(roman, 'i'), 'i');
  assert.equal(choiceForKey(roman, '4'), 'iv');
  assert.equal(choiceForKey(roman, 'v'), null);

  // 真实卷一：6/7/8 选项的 Yotta、(a)–(d) 的 MAT、6 选项的 TMUA 与野题——
  // 每一道的每一个选项都按得到，答案也都落在某个标号上
  const diag = readExamJson('diag.json', (d) => d?.v === 2 && Array.isArray(d.papers));
  const sizes = new Set();
  let lowercase = 0;
  for (const qid of diag.papers[0].qids) {
    const q = readExamQuestion(qid);
    const labels = q.choices.map((c) => c.label);
    assert.ok(labels.length >= 4 && labels.length <= 12, `${q.id} has ${labels.length} options`);
    sizes.add(labels.length);
    if (labels[0] === labels[0].toLowerCase()) lowercase++;
    labels.forEach((label, i) => {
      if (i < 9) assert.equal(choiceForKey(labels, String(i + 1)), label, `${q.id} digit ${i + 1}`);
      if (label.length === 1) {
        assert.equal(choiceForKey(labels, label.toUpperCase()), label, `${q.id} key ${label}`);
        assert.equal(choiceForKey(labels, label.toLowerCase()), label, `${q.id} key ${label}`);
      }
    });
    assert.ok(labels.some((label) => label.toLowerCase() === q.answer.toLowerCase()), `${q.id} answer`);
  }
  assert.ok(sizes.size >= 3, 'paper 1 really mixes option counts');
  assert.ok(lowercase >= 3, 'paper 1 really carries lowercase MAT labels');

  // 运行时：选项按题目自己的数据渲染——标号统一大写显示、比对不分大小写、
  // 内联题（text 为空）按钮只显标号、题面与选项都走 MathText（题图在那里渲染）
  const runner = codeOnly(fs.readFileSync(runnerPath, 'utf8'));
  assert.match(runner, /current\.choices\.map\(\(choice\) => choice\.label\)/);
  assert.match(runner, /\{c\.label\.toUpperCase\(\)\}/);
  assert.match(runner, /\{c\.text && \(/);
  assert.match(runner, /<MathText text=\{q\.statement\} \/>/);
  assert.match(runner, /aria-pressed=\{selected\}/);
  // 组合键不是在选选项（Ctrl+C 不该选中 C）
  assert.match(runner, /if \(e\.ctrlKey \|\| e\.metaKey \|\| e\.altKey\) return;/);
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
    records.indexOf('const statusCells = '),
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
  // 休息页的样式随休息页一起退场
  assert.doesNotMatch(css, /\.break/);
});
