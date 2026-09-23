import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { practiceQids } from '../src/lib/progress.ts';
import {
  indexForLibraryMode,
  pickQidsForMode,
  reachableIndex,
  validCompletedCount,
  wrongRanking,
  HIDDEN_UNLOCK_COUNT,
} from '../src/lib/records.ts';
import { readExamIndex, readExamJson, readExamQuestion } from './helpers/exam-data.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** build-data 收尾那行「跳过：{…}」 */
function skippedCounts(stdout) {
  const m = stdout.match(/跳过：\s*(\{.*\})/);
  assert.ok(m, `构建日志里没有跳过统计：\n${stdout}`);
  return JSON.parse(m[1]);
}

function build(bank, out) {
  const built = spawnSync(process.execPath, [path.join(root, 'scripts', 'build-data.mjs')], {
    cwd: root,
    encoding: 'utf8',
    // 合成题库题量远低于可判分底线，这里关掉它（见 build-data 的 MIN_GRADEABLE）
    env: { ...process.env, EXAM_OUT: out, BANK_PATH: bank, MIN_GRADEABLE: '0' },
  });
  assert.equal(built.status, 0, built.stderr);
  return built;
}

const write = (bank, parts, name, lines) => {
  const dir = path.join(bank, ...parts);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), lines.join('\n'));
};

/** TMUA style（$$\mathbf{A} \quad …$$ 公式块），答案字段是大写字母 */
function tmuaStyle({ qid, id, verified, figure }) {
  return [
    '---', 'database: TMUA', `qid: ${qid}`, `id: ${id}`, 'paper: SMT Skills Ch3',
    'year:', 'number: Q3', 'section: Multiple Choice', 'difficulty: 0',
    'topics: []', 'subtopics: []', 'tags: []',
    'style: TMUA', 'solution_source: 书后解答',
    ...(verified === undefined ? [] : [`answer_verified: ${verified}`]),
    'status: 已入库', '---', '',
    '## 题目', `Which of the statements is true? ![[Image/${figure}]]`, '',
    '$$\\mathbf{A} \\quad \\text{1 only}$$', '',
    '$$\\mathbf{B} \\quad \\text{2 only}$$', '',
    '$$\\mathbf{C} \\quad \\text{3 only}$$', '',
    '$$\\mathbf{D} \\quad \\text{4 only}$$', '',
    '## 答案', 'B', '',
    '## 解析', '略', '',
  ];
}

/** MAT style（(a)…(e) 括号行），答案字段同样存大写字母 */
function matStyle({ qid, id, verified, figure }) {
  return [
    '---', 'database: MAT', `qid: ${qid}`, `id: ${id}`, 'paper: SMT Skills Ch7',
    'year:', 'number: Q12', 'section: Multiple Choice', 'difficulty: 0',
    'topics: []', 'subtopics: []', 'tags: []',
    'style: MAT', 'solution_source: 书后解答',
    ...(verified === undefined ? [] : [`answer_verified: ${verified}`]),
    'status: 已入库', '---', '',
    '## 题目', `Which of the graphs sketches $y = x^2$? ![[Image/${figure}]]`, '',
    '(a) graph (a)',
    '(b) graph (b)',
    '(c) graph (c)',
    '(d) graph (d)',
    '(e) graph (e)', '',
    '## 答案', 'D', '',
  ];
}

/**
 * 一份含 Addition 的合成题库：两道已复核（TMUA style / MAT style）、
 * 两道未复核（缺字段 / 写了 false），外加一道别的库的题——
 * 那道题也写了 answer_verified: false，用来钉住「复核闸只对 Addition 生效」
 */
function makeBank() {
  const bank = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-diag75-bank-'));

  write(bank, ['TMUA Addition', 'SMT Skills'], 'SMT-Ch3-Q3.md',
    tmuaStyle({ qid: 90020210300, id: 'SMT-Ch3-Q3', verified: 'true', figure: 'smt-fig1.png' }));
  write(bank, ['TMUA Addition', 'SMT Skills'], 'SMT-Ch7-Q12.md',
    matStyle({ qid: 90020351200, id: 'SMT-Ch7-Q12', verified: 'true', figure: 'smt-fig2.png' }));
  // 未复核：一道缺字段，一道明写 false
  write(bank, ['TMUA Addition', 'SMT Skills'], 'SMT-Ch5-Q3.md',
    tmuaStyle({ qid: 90020230300, id: 'SMT-Ch5-Q3', verified: undefined, figure: 'unverified1.png' }));
  write(bank, ['TMUA Addition', '野题'], 'Wild-Q01.md',
    tmuaStyle({ qid: 99000200100, id: 'Wild-Q01', verified: 'false', figure: 'unverified2.png' }));
  // 没启用的子目录：整目录不该被扫到
  write(bank, ['TMUA Addition', 'Clarkson'], 'Clark-Q1.md',
    tmuaStyle({ qid: 90030100100, id: 'Clark-Q1', verified: 'true', figure: 'clarkson.png' }));

  const imageDir = path.join(bank, 'TMUA Addition', 'Image');
  fs.mkdirSync(imageDir, { recursive: true });
  for (const n of ['smt-fig1.png', 'smt-fig2.png', 'unverified1.png', 'unverified2.png', 'clarkson.png']) {
    fs.writeFileSync(path.join(imageDir, n), 'png');
  }

  // 别的库：写了 answer_verified: false 也照常上站
  write(bank, ['TMUA', '2020'], '20-P1-Q1.md', [
    '---', 'database: TMUA', 'qid: 20200210100', 'id: 20-P1-Q1', 'paper: TMUA P1',
    'year: 2020', 'number: Q1', 'section: Applications', 'difficulty: 0',
    'topics: [Algebra]', 'answer_verified: false', '---', '',
    '## 题目', 'Compute $1+1$.', '',
    '$$\\mathbf{A} \\quad 1$$', '',
    '$$\\mathbf{B} \\quad 2$$', '',
    '$$\\mathbf{C} \\quad 3$$', '',
    '## 答案', 'B', '',
  ]);

  return bank;
}

test('a verified Addition question lands in the index as a diagnostic-only entry', (t) => {
  const bank = makeBank();
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-diag75-out-'));
  t.after(() => {
    fs.rmSync(bank, { recursive: true, force: true });
    fs.rmSync(out, { recursive: true, force: true });
  });

  const built = build(bank, out);
  const index = JSON.parse(fs.readFileSync(path.join(out, 'index.json'), 'utf8'));
  const byQid = new Map(index.map((entry) => [entry.qid, entry]));

  // 两道已复核的题都进来了，db 是诊断专用库、带 diag 标记
  for (const qid of [90020210300, 90020351200]) {
    const entry = byQid.get(qid);
    assert.ok(entry, `${qid} 应当进索引`);
    assert.equal(entry.db, 'DIAG75');
    assert.equal(entry.diag, true);
    // 诊断题不属于扩展池：hidden 与 diag 是两套互不相干的标记
    assert.equal(entry.hidden, undefined);
  }

  // TMUA style：四个公式块解析成四个选项，答案大写字母原样对上
  const tmua = JSON.parse(fs.readFileSync(path.join(out, 'q', '90020210300.json'), 'utf8'));
  assert.equal(tmua.optionsInline, false);
  assert.deepEqual(tmua.choices.map((c) => c.label), ['A', 'B', 'C', 'D']);
  assert.equal(tmua.answer, 'B');
  assert.equal(tmua.database, 'DIAG75');
  assert.doesNotMatch(tmua.statement, /\\mathbf/, '选项必须从题面里剔干净');

  // MAT style：括号解析器认的是小写标号，大写答案字母照样匹配得上
  const mat = JSON.parse(fs.readFileSync(path.join(out, 'q', '90020351200.json'), 'utf8'));
  assert.equal(mat.optionsInline, false);
  assert.deepEqual(mat.choices.map((c) => c.label), ['a', 'b', 'c', 'd', 'e']);
  assert.equal(mat.answer, 'd');
  assert.ok(
    mat.choices.some((c) => c.label === mat.answer),
    '答案必须落在某个选项标号上，否则会被 answerMismatch 拦掉',
  );
  assert.doesNotMatch(mat.statement, /^\s*\(a\)/m, '括号选项必须从题面里剔干净');

  // 体例按每题自己的 database 字段选，不按所在顶层目录——按目录选的话
  // MAT style 那道会掉进 inlineFallback（optionsInline: true、选项全空）
  assert.equal(skippedCounts(built.stdout).noChoices, 0);
  assert.equal(skippedCounts(built.stdout).answerMismatch, 0);

  // 别的库不受复核闸影响
  assert.ok(byQid.has(20200210100), 'answer_verified: false 只对 Addition 生效');
  assert.equal(byQid.get(20200210100).db, 'TMUA');
  assert.equal(byQid.get(20200210100).diag, undefined);

  // 没启用的子目录一道题都不许漏进来
  assert.equal(byQid.has(90030100100), false, 'Clarkson 仍未启用');
});

test('an unverified Addition question leaves no trace at all', (t) => {
  // 用户裁定「先选复核正确的题入库」：没复核过的题整题不收，
  // 索引、单题 JSON、图片，一样都不许留下
  const bank = makeBank();
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-diag75-skip-out-'));
  t.after(() => {
    fs.rmSync(bank, { recursive: true, force: true });
    fs.rmSync(out, { recursive: true, force: true });
  });

  const built = build(bank, out);
  const index = JSON.parse(fs.readFileSync(path.join(out, 'index.json'), 'utf8'));
  const qids = index.map((entry) => entry.qid);

  assert.equal(qids.includes(90020230300), false, '缺 answer_verified 的题不该进索引');
  assert.equal(qids.includes(99000200100), false, 'answer_verified: false 的题不该进索引');
  assert.deepEqual(
    fs.readdirSync(path.join(out, 'q')).sort(),
    ['20200210100.json', '90020210300.json', '90020351200.json'],
  );
  assert.deepEqual(
    fs.readdirSync(path.join(out, 'img')).sort(),
    ['smt-fig1.png', 'smt-fig2.png'],
    '未复核题引用的图不该被复制进来',
  );

  // 缺字段 1 道 + 明写 false 1 道；Clarkson 整目录没被扫，不计入
  assert.equal(skippedCounts(built.stdout).unverified, 2);
  // 逐目录跳过报告要指名道姓，刷新题库时才看得见该去复核哪一批
  assert.match(built.stdout, /\[build-data\] {3}TMUA Addition\/SMT Skills\s+unverified 1/);
  assert.match(built.stdout, /\[build-data\] {3}TMUA Addition\/野题\s+unverified 1/);

  // 卷面墙与知识点倒排跟 GMAT 同规：这批题一条都不收
  const papers = JSON.parse(fs.readFileSync(path.join(out, 'papers.json'), 'utf8'));
  assert.deepEqual(papers.papers.map((p) => p.db), ['TMUA']);
  const topics = JSON.parse(fs.readFileSync(path.join(out, 'topics.json'), 'utf8'));
  assert.deepEqual(Object.keys(topics.coverage), ['TMUA']);
  assert.deepEqual(topics.coverage.TMUA, { tagged: 1, total: 1 });
});

test('DIAG75 entries are excluded from every practice pool', (t) => {
  // 隔离靠的是 diag 标记而不是库名。先拿构建产物验：build-data 真正写出来的
  // 条目过一遍各池函数，一条都不许剩下
  const bank = makeBank();
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-diag75-pool-out-'));
  t.after(() => {
    fs.rmSync(bank, { recursive: true, force: true });
    fs.rmSync(out, { recursive: true, force: true });
  });
  build(bank, out);
  const built = JSON.parse(fs.readFileSync(path.join(out, 'index.json'), 'utf8'));
  const diag75 = built.filter((entry) => entry.db === 'DIAG75').map((entry) => entry.qid);
  assert.equal(diag75.length, 2, '产物里得真有 DIAG75 条目，这条守卫才有负载');
  const leaked = (qids) => qids.filter((qid) => diag75.includes(qid));
  const qidsOf = (entries) => entries.map((entry) => entry.qid);

  for (const mode of ['classic', 'hidden']) {
    assert.deepEqual(leaked(qidsOf(indexForLibraryMode(built, mode))), [], `${mode} 池混进了诊断题`);
  }
  for (const unlocked of [false, true]) {
    assert.deepEqual(leaked(qidsOf(reachableIndex(built, unlocked))), [], '复盘可达范围混进了诊断题');
  }
  assert.deepEqual(leaked([...practiceQids(built)]), [], '练习池混进了诊断题');

  // 把这批诊断题全做错一遍：365 不涨、错题榜不上、混合卷也抽不到
  const touched = {
    v: 1,
    q: Object.fromEntries(diag75.map((qid) => [qid, { a: 2, w: 2, t: 9, c: 0 }])),
    s: [],
  };
  assert.equal(validCompletedCount(built, touched), 0);
  const pool = practiceQids(built);
  assert.deepEqual(
    wrongRanking(touched, Number.POSITIVE_INFINITY).filter((row) => pool.has(row.qid)),
    [],
  );
  // 'ALL' 是唯一不按库名过滤的档，吃的是整个区的池子
  const classic = indexForLibraryMode(built, 'classic');
  assert.deepEqual(leaked(pickQidsForMode(classic, 'ALL', 50, 'wrong-and-new', touched)), []);

  // 进了 ExamDb 但不进选区按钮清单：进去就是面板上一个永远 0 题的灰按钮
  const examLib = fs.readFileSync(path.join(root, 'src', 'lib', 'exam.ts'), 'utf8');
  assert.doesNotMatch(examLib.match(/export const EXAM_DATABASES = \[([^\]]*)\]/)[1], /DIAG75/);
  assert.match(examLib, /export type ExamDb = [^;]*typeof DIAG75_DB/);

  // 再拿一份混了 hidden 与 GMAT 的小索引：9.0 区非空时也照样挡得住
  const index = [
    { qid: 1, db: 'TMUA' },
    { qid: 2, db: 'MAT', hidden: true },
    { qid: 3, db: 'DIAG75', diag: true },
    { qid: 4, db: 'GMAT', diag: true },
  ];

  // 经典池 / 9.0 Trivial 池：两个区都不含它
  assert.deepEqual(indexForLibraryMode(index, 'classic').map((e) => e.qid), [1]);
  assert.deepEqual(indexForLibraryMode(index, 'hidden').map((e) => e.qid), [2]);
  // 复盘视图（卷面墙、知识点复盘）够得着的范围
  assert.deepEqual(reachableIndex(index, false).map((e) => e.qid), [1]);
  assert.deepEqual(reachableIndex(index, true).map((e) => e.qid), [1, 2]);
  // 错题排行的池子
  assert.deepEqual([...practiceQids(index)], [1, 2]);

  // 365 解锁进度：做过诊断题也不给计数
  const records = {
    v: 1,
    q: {
      1: { a: 1, w: 0, t: 0, c: 1 },
      3: { a: 1, w: 3, t: 9, c: 0 },
    },
    s: [],
  };
  assert.equal(validCompletedCount(index, records), 1);
  assert.ok(HIDDEN_UNLOCK_COUNT > 1);

  // 错题榜先整体排序再按练习池过滤：诊断题错得再多也不上榜
  const practice = practiceQids(index);
  assert.deepEqual(
    wrongRanking(records, Number.POSITIVE_INFINITY)
      .filter((row) => practice.has(row.qid))
      .map((row) => row.qid),
    [],
  );
});

test('the existing GMAT diagnostic papers are byte-identical with Addition present', (t) => {
  // 7.5+ 的组卷规则还没定，现行 Diagnostic 的两套固定卷一个字节都不许动
  const withAddition = makeBank();
  const without = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-diag75-base-'));
  const outA = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-diag75-a-'));
  const outB = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-diag75-b-'));
  t.after(() => {
    for (const dir of [withAddition, without, outA, outB]) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  // 两个 4 题的 GMAT 目录，难度乱序摆着——奇偶交错拆套是按 level 排完才做的
  const gmat = (qid, level, answer) => [
    '---', 'database: GMAT', `qid: ${qid}`, `id: gmat-${qid}`, 'paper: GMAT',
    'year: 0', `number: Q${qid % 10}`, `level: LEVEL ${level}`, '---', '',
    '## 题目', 'Compute $1+1$.', '',
    '$$\\mathbf{A} \\quad 1$$', '',
    '$$\\mathbf{B} \\quad 2$$', '',
    '$$\\mathbf{C} \\quad 3$$', '',
    `## 答案`, answer, '',
  ];
  for (const bank of [withAddition, without]) {
    for (const [dir, base] of [['algebra-ps', 10], ['algebra-ds', 20]]) {
      for (const [i, level] of [5, 3, 7, 3].entries()) {
        write(bank, ['GMAT', dir], `q${base + i}.md`, gmat(base + i, level, 'B'));
      }
    }
    // 索引不为空即可（MIN_GRADEABLE 已关，但空索引不认豁免）
    write(bank, ['TMUA', '2019'], '19-P1-Q1.md', [
      '---', 'database: TMUA', 'qid: 20190210100', 'id: 19-P1-Q1', 'paper: TMUA P1',
      'year: 2019', 'number: Q1', '---', '',
      '## 题目', 'Compute $2+2$.', '',
      '$$\\mathbf{A} \\quad 3$$', '',
      '$$\\mathbf{B} \\quad 4$$', '',
      '$$\\mathbf{C} \\quad 5$$', '',
      '## 答案', 'B', '',
    ]);
  }

  // 诱饵：Addition 底下恰好也有个叫 algebra-ps 的子目录，题还标成最容易的 LEVEL 1。
  // 固定卷按所在目录名认卷别，没有 db === 'GMAT' 那道显式闸的话，
  // 这道题会被当成 P1 的候选排到最前面——「目录名恰好对不上」不是保证
  const decoy = tmuaStyle({ qid: 90020990100, id: 'SMT-Ch9-Q1', verified: 'true', figure: 'smt-fig1.png' });
  decoy.splice(decoy.indexOf('---', 1), 0, 'level: LEVEL 1');
  write(withAddition, ['TMUA Addition', 'SMT Skills', 'algebra-ps'], 'SMT-Ch9-Q1.md', decoy);

  build(withAddition, outA);
  build(without, outB);

  const a = fs.readFileSync(path.join(outA, 'diag.json'));
  const b = fs.readFileSync(path.join(outB, 'diag.json'));
  assert.deepEqual(
    JSON.parse(a).sets.flatMap((s) => [...s.p1, ...s.p2]).sort((x, y) => x - y),
    [10, 11, 12, 13, 20, 21, 22, 23],
  );
  assert.ok(a.equals(b), 'diag.json 必须与没有 Addition 时逐字节相同');

  // 反面确认：Addition 那三道已复核的题（含诱饵）确实进了索引，只是没进固定卷
  const index = JSON.parse(fs.readFileSync(path.join(outA, 'index.json'), 'utf8'));
  assert.deepEqual(
    index.filter((entry) => entry.db === 'DIAG75').map((entry) => entry.qid).sort((x, y) => x - y),
    [90020210300, 90020351200, 90020990100],
  );
});

test('the shipped build carries DIAG75 only as diagnostic-only questions', (t) => {
  // 真实产物的反向审计。TMUA Addition 要等 sync 之后才进 data\，
  // 在那之前这条让位——与 MAT Specimen 那条审计同一个体例，让位要在报告里看得见
  const index = readExamIndex();
  const diag75 = index.filter((entry) => entry.db === 'DIAG75');
  if (diag75.length === 0) {
    t.skip('TMUA Addition 尚未同步进 data，本条审计让位');
    return;
  }
  const qids = new Set(diag75.map((entry) => entry.qid));

  for (const entry of diag75) {
    assert.equal(entry.diag, true, `${entry.qid} 缺 diag 标记`);
    assert.equal(entry.hidden, undefined, `${entry.qid}：diag 与 hidden 是两回事`);
    const q = readExamQuestion(entry.qid);
    assert.equal(q.database, 'DIAG75', q.id);
    assert.ok(q.choices.some((c) => c.label === q.answer), `${q.id} 的答案对不上任何选项`);
  }

  // 现行 Diagnostic 的固定卷一道都不许混进来
  const diag = readExamJson('diag.json', (d) => d?.v === 1 && Array.isArray(d.sets));
  for (const set of diag.sets) {
    for (const qid of [...set.p1, ...set.p2]) assert.equal(qids.has(qid), false, `固定卷里混进了 ${qid}`);
  }
  // 卷面墙与知识点倒排：与 GMAT 同规，一条都不收
  const papers = readExamJson('papers.json', (d) => d?.v === 1 && Array.isArray(d.papers));
  assert.equal(papers.papers.some((p) => p.db === 'DIAG75' || p.qids.some((qid) => qids.has(qid))), false);
  const topics = readExamJson('topics.json', (d) => d?.v === 1 && d.byTopic);
  assert.equal('DIAG75' in topics.coverage, false);
  for (const [name, list] of Object.entries(topics.byTopic)) {
    assert.equal(list.some((qid) => qids.has(qid)), false, `${name} 里混进了诊断题`);
  }
});
