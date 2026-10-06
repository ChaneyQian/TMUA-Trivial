// 7.5+ Diagnostic 的组卷（构建期）：diag.json v2、卷一校验、卷二分层、reserved 标记。
//
// 纯逻辑直接 import scripts\diag75-papers.mjs 测；构建行为拿合成题库跑真的
// build-data（EXAM_OUT / BANK_PATH / MIN_GRADEABLE 三件套）。合成题库里放的就是
// 生产清单那 10 个 qid——不设 DIAG75_PAPER1，走的就是上线那条路。

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  DIAG75_EXAM,
  DIAG75_PAPER1,
  DIAG75_PAPER_SIZE,
  DIAG75_VERSION,
  diagnosticPapersJson,
  paper1FromEnv,
  paper1Problems,
  reservedQids,
  selectPaper2,
  smtChapter,
} from '../scripts/diag75-papers.mjs';
import { readExamIndex, readExamJson } from './helpers/exam-data.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** 用户 2026-09-28 拍板的卷一，按出题顺序 */
const USER_PAPER1 = [
  20132101203120, 20132101203117, 20132101203115, 20050300104, 20040300103,
  20050300102, 20180211900, 20132101203108, 99000200100, 20230300110,
];
/** 其中落在经典区的两道 */
const CLASSIC_EXAM_QIDS = [20180211900, 20230300110];

// ---------------- 纯逻辑 ----------------

test('paper 1 is the ten questions the user picked, in the order they picked them', () => {
  assert.equal(DIAG75_PAPER_SIZE, 10);
  assert.deepEqual([...DIAG75_PAPER1], USER_PAPER1);
  assert.equal(DIAG75_VERSION, 2, 'v1 是 GMAT 两卷制的形状，新卷必须换版本号');
  assert.equal(DIAG75_EXAM, '7.5+');
  assert.deepEqual(diagnosticPapersJson([1, 2], null), {
    v: 2,
    exam: '7.5+',
    papers: [
      { id: 'p1', qids: [1, 2] },
      { id: 'p2', qids: null },
    ],
  });
});

test('DIAG75_PAPER1 is test-only and fails loudly when it cannot be read', () => {
  assert.deepEqual(paper1FromEnv(undefined), USER_PAPER1, '不设就是生产清单');
  assert.equal(paper1FromEnv('off'), null);
  assert.equal(paper1FromEnv(' OFF '), null);
  assert.deepEqual(paper1FromEnv('3, 1,2'), [3, 1, 2], '顺序原样保留：卷一的顺序就是出题顺序');
  for (const junk of ['', 'x', '1,,-2', '1.5', '0']) {
    assert.throws(() => paper1FromEnv(junk), /DIAG75_PAPER1/, `${JSON.stringify(junk)} 不该被悄悄当成默认`);
  }
});

test('paper 1 problems name the exact question that is missing', () => {
  const all = new Set(USER_PAPER1);
  assert.deepEqual(paper1Problems(USER_PAPER1, all), []);

  const withoutWild = new Set(USER_PAPER1.filter((qid) => qid !== 99000200100));
  const problems = paper1Problems(USER_PAPER1, withoutWild);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /第 9 题 99000200100（野题 Wild-Q01）/);

  // 大小与重复也要报：一卷就是 10 道，不多不少不重
  assert.ok(paper1Problems(USER_PAPER1.slice(0, 9), all).some((p) => /应为 10 道，实为 9 道/.test(p)));
  const doubled = [...USER_PAPER1.slice(0, 9), USER_PAPER1[0]];
  assert.ok(paper1Problems(doubled, all).some((p) => /重复/.test(p)));
  // 清单外的 qid 只报 qid，不编造卷号
  assert.deepEqual(paper1Problems([5], new Set()).filter((p) => p.includes("5：不在")), ['卷一第 1 题 5：不在 index 里（缺题，或判不了分被跳过）']);
});

test('paper 2 rotates through chapters, qid order within each, and never changes with input order', () => {
  assert.equal(smtChapter('SMT-Ch10-Q3'), 10);
  assert.equal(smtChapter('SMT-Ch3-Q13'), 3);
  assert.equal(smtChapter('Wild-Q01'), null);

  const smt = (chapter, n, style = 2) => ({
    qid: Number(`9002${String(style).padStart(2, '0')}${chapter - 2}${String(n).padStart(2, '0')}00`),
    id: `SMT-Ch${chapter}-Q${n}`,
  });
  // 章节故意按字符串会排错的写法给：Ch10 必须排在 Ch3 / Ch5 / Ch6 后面
  const pool = [
    smt(10, 1), smt(10, 2), smt(10, 3, 3),
    smt(3, 1), smt(3, 2), smt(3, 5, 3), smt(3, 7, 3),
    smt(5, 3), smt(5, 16, 3), smt(5, 4),
    smt(6, 9, 3), smt(6, 2),
    { qid: 99000200100, id: 'Wild-Q01' }, // 野题不进卷二
  ];
  const q = (chapter, n, style = 2) => smt(chapter, n, style).qid;
  const expected = [
    // 第一轮：每章最小的 qid
    q(3, 1), q(5, 3), q(6, 2), q(10, 1),
    // 第二轮
    q(3, 2), q(5, 4), q(6, 9, 3), q(10, 2),
    // 第三轮：Ch6 已经用完
    q(3, 5, 3), q(5, 16, 3),
  ];
  assert.deepEqual(selectPaper2(pool), expected);

  // 零随机：候选以什么顺序进来都一样
  const reversed = [...pool].reverse();
  const shuffled = [pool[5], pool[0], pool[11], pool[2], pool[8], pool[12], pool[1], pool[10], pool[3], pool[7], pool[4], pool[9], pool[6]];
  assert.deepEqual(selectPaper2(reversed), expected);
  assert.deepEqual(selectPaper2(shuffled), expected);

  // 与卷一重的题先剔掉，空位由下一轮补上
  const excluded = selectPaper2(pool, new Set([q(3, 1)]));
  assert.equal(excluded.includes(q(3, 1)), false);
  assert.equal(excluded.length, 10);
  assert.equal(excluded[0], q(3, 2), 'Ch3 的第一道被卷一占了，就从它的下一道起');

  // 凑不满 10 道就不出卷——不拿残卷去消耗一次机会
  assert.equal(selectPaper2(pool.slice(0, 9)), null);
  assert.equal(selectPaper2([]), null);
  // 刚好 10 道：全收，一道不落
  const ten = pool.filter((item) => item.id.startsWith('SMT-')).slice(0, 10);
  assert.deepEqual([...selectPaper2(ten)].sort((a, b) => a - b), ten.map((item) => item.qid).sort((a, b) => a - b));

  // 认不出章号的 SMT 题归进排在最后的一层，不被静默丢掉：
  // 这里有 Ch3 / Ch5 / Ch10 三层，它是每一轮的第四个
  const odd = [...ten.slice(0, 9), { qid: 1, id: 'SMT-Appendix-Q1' }];
  assert.equal(selectPaper2(odd).includes(1), true);
  assert.equal(selectPaper2(odd)[3], 1);
});

test('only exam questions from the classic zone are reserved', () => {
  const indexByQid = new Map([
    [1, { qid: 1, db: 'TMUA' }],
    [2, { qid: 2, db: 'TMUA_MOCK', hidden: true }],
    [3, { qid: 3, db: 'DIAG75', diag: true }],
    [4, { qid: 4, db: 'MAT' }],
    [5, { qid: 5, db: 'SMC' }], // 不在卷里：经典区也不动
  ]);
  assert.deepEqual(reservedQids([[4, 2, 1], [3]], indexByQid), [1, 4]);
  assert.deepEqual(reservedQids([[2, 3], null], indexByQid), []);
});

// ---------------- 构建行为（合成题库） ----------------

const writeFile = (bank, parts, name, lines) => {
  const dir = path.join(bank, ...parts);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), lines.join('\n'));
};

const LETTERS = 'ABCDEFGHIJKL';

/** TMUA 体例：$$\mathbf{A} \quad …$$ 一块一选项 */
function tmua({ database = 'TMUA', qid, id, paper, year = '', number = 'Q1', answer = 'B', options = 4, front = [] }) {
  return [
    '---', `database: ${database}`, `qid: ${qid}`, `id: ${id}`, `paper: ${paper}`,
    `year: ${year}`, `number: ${number}`, 'topics: [Algebra]', ...front, '---', '',
    '## 题目', `Question ${id}: find $x$.`, '',
    ...Array.from({ length: options }, (_, k) => [`$$\\mathbf{${LETTERS[k]}} \\quad ${k + 1}$$`, '']).flat(),
    '## 答案', answer, '',
    '## 解析', `Worked solution for ${id}.`, '',
  ];
}

/** MAT 体例：(a)…(d) 括号行，答案字段存大写字母 */
function mat({ qid, id, paper = 'MAT', year, number, answer = 'C', front = [] }) {
  return [
    '---', 'database: MAT', `qid: ${qid}`, `id: ${id}`, `paper: ${paper}`,
    `year: ${year}`, `number: ${number}`, ...front, '---', '',
    '## 题目', `Question ${id}: which is right?`, '',
    '(a) one', '(b) two', '(c) three', '(d) four', '',
    '## 答案', answer, '',
    '## 解析', `Worked solution for ${id}.`, '',
  ];
}

const VERIFIED = ['answer_verified: true'];

/** SMT 题：TMUA style 或 MAT style，qid 照站内体例编 */
function smtFile(bank, chapter, n, style) {
  const id = `SMT-Ch${chapter}-Q${n}`;
  const qid = Number(`9002${style === 'MAT' ? '03' : '02'}${chapter - 2}${String(n).padStart(2, '0')}00`);
  const lines =
    style === 'MAT'
      ? mat({ qid, id, paper: `SMT Skills Ch${chapter}`, year: '', number: `Q${n}`, front: VERIFIED })
      : tmua({ qid, id, paper: `SMT Skills Ch${chapter}`, number: `Q${n}`, front: VERIFIED });
  writeFile(bank, ['Addition Resources', 'SMT Skills'], `${id}.md`, lines);
  return qid;
}

/**
 * 一份含生产卷一全部 10 道题的合成题库，外加 12 道已复核 SMT（四章）、
 * 2 道未复核 SMT、一套 GMAT（含一个 id 伪装成 SMT 的诱饵）、一道普通经典题。
 * 返回卷二应当取出的 10 道（按取题顺序）
 */
function makeBank({ smt = true } = {}) {
  const bank = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-diag75-papers-bank-'));

  // 卷一：Yotta 四道（9.0 区，6/7/8 选项）、MAT 2004/2005 三道（9.0 区）、
  // TMUA 2018 与 MAT 2023 各一道（经典区）、野题一道（DIAG75）
  for (const [qid, n, options, answer] of [
    [20132101203120, 20, 6, 'F'],
    [20132101203117, 17, 7, 'C'],
    [20132101203115, 15, 8, 'C'],
    [20132101203108, 8, 8, 'F'],
  ]) {
    writeFile(bank, ['TMUA Mock', 'Yotta'], `Yotta-Mock-P1-Q${n}.md`,
      tmua({ qid, id: `Yotta-Mock-P1-Q${n}`, paper: 'TMUA Mock', number: `Q${n}`, options, answer }));
  }
  writeFile(bank, ['MAT', '2005'], '05-Q1D.md', mat({ qid: 20050300104, id: '05-Q1D', year: 2005, number: 'Q1D', answer: 'A' }));
  writeFile(bank, ['MAT', '2005'], '05-Q1B.md', mat({ qid: 20050300102, id: '05-Q1B', year: 2005, number: 'Q1B', answer: 'B' }));
  writeFile(bank, ['MAT', '2004'], '04-Q1C.md', mat({ qid: 20040300103, id: '04-Q1C', year: 2004, number: 'Q1C', answer: 'D' }));
  writeFile(bank, ['MAT', '2023'], '23-Q1J.md', mat({ qid: 20230300110, id: '23-Q1J', year: 2023, number: 'Q1J', answer: 'C' }));
  writeFile(bank, ['TMUA', '2018'], '18-P1-Q19.md',
    tmua({ qid: 20180211900, id: '18-P1-Q19', paper: 'TMUA P1', year: 2018, number: 'Q19', options: 6, answer: 'D' }));
  writeFile(bank, ['Addition Resources', '野题'], 'Wild-Q01.md',
    tmua({ qid: 99000200100, id: 'Wild-Q01', paper: 'TMUA Wild', number: 'Q1', options: 6, front: VERIFIED }));
  // 同卷的一道普通经典题：它不在考卷里，不该被 reserved 连带
  writeFile(bank, ['TMUA', '2018'], '18-P1-Q1.md',
    tmua({ qid: 20180210100, id: '18-P1-Q1', paper: 'TMUA P1', year: 2018, number: 'Q1' }));

  // 卷二的候选：Ch3 ×4、Ch5 ×3、Ch6 ×2、Ch10 ×3，TMUA / MAT 两种体例混排
  const q = {};
  if (smt) {
    for (const [chapter, n, style] of [
      [3, 1, 'TMUA'], [3, 2, 'TMUA'], [3, 5, 'MAT'], [3, 7, 'MAT'],
      [5, 3, 'TMUA'], [5, 4, 'TMUA'], [5, 16, 'MAT'],
      [6, 2, 'TMUA'], [6, 9, 'MAT'],
      [10, 1, 'TMUA'], [10, 2, 'TMUA'], [10, 3, 'MAT'],
    ]) {
      q[`${chapter}-${n}`] = smtFile(bank, chapter, n, style);
    }
  }
  // 未复核的 SMT：进不了 index，也就进不了卷二
  writeFile(bank, ['Addition Resources', 'SMT Skills'], 'SMT-Ch3-Q9.md',
    tmua({ qid: 90020210900, id: 'SMT-Ch3-Q9', paper: 'SMT Skills Ch3', number: 'Q9' }));
  writeFile(bank, ['Addition Resources', 'SMT Skills'], 'SMT-Ch4-Q1.md',
    tmua({ qid: 90020220100, id: 'SMT-Ch4-Q1', paper: 'SMT Skills Ch4', number: 'Q1', front: ['answer_verified: false'] }));

  // GMAT：下线了的旧诊断。单题照常进 index，但一道都不许进卷；
  // 其中一道的 id 伪装成 SMT 章节题，钉住「卷二只认 DIAG75」
  for (const [dir, base] of [['algebra-ps', 10], ['algebra-ds', 20]]) {
    for (let i = 0; i < 3; i++) {
      const qid = 90020700000 + (base + i) * 100;
      writeFile(bank, ['GMAT', dir], `g${base + i}.md`,
        tmua({ database: 'GMAT', qid, id: i === 0 && dir === 'algebra-ps' ? 'SMT-Ch1-Q1' : `ALG-${base + i}`, paper: 'GMAT', year: 0, number: `Q${i + 1}`, options: 5, front: ['level: LEVEL 1'] }));
    }
  }

  const expectedP2 = smt
    ? [q['3-1'], q['5-3'], q['6-2'], q['10-1'], q['3-2'], q['5-4'], q['6-9'], q['10-2'], q['3-5'], q['5-16']]
    : null;
  return { bank, expectedP2 };
}

function build(t, bank, env = {}) {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-diag75-papers-out-'));
  t.after(() => fs.rmSync(out, { recursive: true, force: true }));
  const built = spawnSync(process.execPath, [path.join(root, 'scripts', 'build-data.mjs')], {
    cwd: root,
    encoding: 'utf8',
    // 合成题库题量远低于可判分底线，这里关掉它（见 build-data 的 MIN_GRADEABLE）
    env: { ...process.env, EXAM_OUT: out, BANK_PATH: bank, MIN_GRADEABLE: '0', ...env },
  });
  const read = (name) => JSON.parse(fs.readFileSync(path.join(out, name), 'utf8'));
  return { built, out, read, has: (name) => fs.existsSync(path.join(out, name)) };
}

function cleanup(t, dir) {
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
}

test('a complete bank ships diag.json v2: paper 1 in order, paper 2 by chapter, GMAT nowhere', (t) => {
  const { bank, expectedP2 } = makeBank();
  cleanup(t, bank);
  // 不设 DIAG75_PAPER1：走的是生产清单
  const { built, read } = build(t, bank);
  assert.equal(built.status, 0, built.stderr);

  const diag = read('diag.json');
  assert.deepEqual(diag, {
    v: 2,
    exam: '7.5+',
    papers: [
      { id: 'p1', qids: USER_PAPER1 },
      { id: 'p2', qids: expectedP2 },
    ],
  });
  // 两卷互不重题
  const p1 = new Set(diag.papers[0].qids);
  assert.equal(diag.papers[1].qids.some((qid) => p1.has(qid)), false);

  // 卷二只认 DIAG75 的 SMT：GMAT（连那个伪装成 SMT 的诱饵）一道都不进卷
  const index = read('index.json');
  const byQid = new Map(index.map((entry) => [entry.qid, entry]));
  const all = diag.papers.flatMap((paper) => paper.qids);
  for (const qid of diag.papers[1].qids) {
    assert.equal(byQid.get(qid).db, 'DIAG75', `${qid} 不是 DIAG75 的题`);
  }
  const gmat = index.filter((entry) => entry.db === 'GMAT');
  assert.equal(gmat.length, 6, 'GMAT 单题照常进 index（复烤区还要看）');
  assert.equal(gmat.some((entry) => all.includes(entry.qid)), false, 'GMAT 下线，一道都不许进卷');
  // 未复核的 SMT 进不了 index，自然也进不了卷
  assert.equal(byQid.has(90020210900), false);
  assert.equal(byQid.has(90020220100), false);

  // 同一份题库再建一次，diag.json 逐字节相同（零随机）
  const again = build(t, bank);
  assert.equal(again.built.status, 0, again.built.stderr);
  assert.equal(
    fs.readFileSync(path.join(again.out, 'diag.json'), 'utf8'),
    JSON.stringify(diag),
  );
  assert.match(built.stdout, /7\.5\+ Diagnostic：卷一 10 道；卷二 10 道/);
  // 没设 DIAG75_PAPER1 的构建（生产就是这样）不该出现「被覆盖」那一行
  assert.doesNotMatch(built.stdout, /卷一被 DIAG75_PAPER1 覆盖/);
});

test('the classic-zone exam questions are reserved, and nothing else is', (t) => {
  const { bank } = makeBank();
  cleanup(t, bank);
  const { built, read } = build(t, bank);
  assert.equal(built.status, 0, built.stderr);

  const index = read('index.json');
  const reserved = index.filter((entry) => entry.reserved).map((entry) => entry.qid).sort((a, b) => a - b);
  assert.deepEqual(reserved, CLASSIC_EXAM_QIDS);
  for (const entry of index) {
    if (!entry.reserved) continue;
    // reserved 不是 diag：作答记录照常计入 365，这一条全靠它
    assert.equal(entry.diag, undefined, `${entry.qid} 被当成了诊断题`);
    assert.equal(entry.hidden, undefined);
  }
  // 9.0 区的考题不动，同卷的普通题也不连带
  const byQid = new Map(index.map((entry) => [entry.qid, entry]));
  for (const qid of [20132101203120, 20050300104, 20040300103, 20180210100]) {
    assert.equal(byQid.get(qid).reserved, undefined, `${qid} 不该被移出练习池`);
  }
  assert.match(built.stdout, /reserved）：20180211900, 20230300110/);

  // 卷面清单照收 reserved：它们是真题卷的一部分，分母由前端按「够得着」求交时扣
  const papers = read('papers.json');
  const tmua18 = papers.papers.find((paper) => paper.label === 'TMUA P1 2018');
  assert.deepEqual(tmua18.qids, [20180211900, 20180210100]);
  const topics = read('topics.json');
  assert.ok(topics.byTopic.Algebra.includes(20180211900), '知识点倒排照收，「练这类题」由前端的池子挡');
});

test('fewer than ten verified SMT questions leave paper 2 as null, paper 1 intact', (t) => {
  const { bank } = makeBank({ smt: false });
  cleanup(t, bank);
  const { built, read } = build(t, bank);
  assert.equal(built.status, 0, built.stderr);

  const diag = read('diag.json');
  assert.deepEqual(diag.papers[0], { id: 'p1', qids: USER_PAPER1 });
  assert.deepEqual(diag.papers[1], { id: 'p2', qids: null });
  assert.match(built.stdout, /卷二暂不出卷（已复核 SMT 只有 0 道，不足 10 道）/);
  // 卷二缺席不影响 reserved：卷一的经典区考题照样移出练习池
  const reserved = read('index.json').filter((entry) => entry.reserved).map((entry) => entry.qid);
  assert.deepEqual(reserved.sort((a, b) => a - b), CLASSIC_EXAM_QIDS);
});

test('a paper-1 question that is missing or ungradeable fails the build and is named', (t) => {
  // 缺题：野题那道整个没有
  const missing = makeBank();
  cleanup(t, missing.bank);
  fs.rmSync(path.join(missing.bank, 'Addition Resources', '野题', 'Wild-Q01.md'));
  const gone = build(t, missing.bank);
  assert.notEqual(gone.built.status, 0, '卷一缺题必须让构建非零退出');
  assert.match(gone.built.stderr, /卷一不完整/);
  assert.match(gone.built.stderr, /卷一第 9 题 99000200100（野题 Wild-Q01）：不在 index 里/);
  assert.equal(gone.has('diag.json'), false, '残卷不落盘');

  // 在题库里但判不了分（答案缺失被 badAnswer 闸跳过）：同样算缺
  const ungradeable = makeBank();
  cleanup(t, ungradeable.bank);
  const file = path.join(ungradeable.bank, 'TMUA', '2018', '18-P1-Q19.md');
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('## 答案\nD', '## 答案\n待补'));
  const broken = build(t, ungradeable.bank);
  assert.notEqual(broken.built.status, 0);
  assert.match(broken.built.stderr, /卷一第 7 题 20180211900（TMUA 2018 P1 Q19）：不在 index 里/);
  // 只报那一道，别的九道都在
  assert.equal((broken.built.stderr.match(/不在 index 里/g) || []).length, 1);

  // 复核闸没过的野题（answer_verified 被撤掉）：进不了 index，照样拦
  const unverified = makeBank();
  cleanup(t, unverified.bank);
  const wild = path.join(unverified.bank, 'Addition Resources', '野题', 'Wild-Q01.md');
  fs.writeFileSync(wild, fs.readFileSync(wild, 'utf8').replace('answer_verified: true', 'answer_verified: false'));
  assert.notEqual(build(t, unverified.bank).built.status, 0);
});

test('an empty bank still reports the floor first, and DIAG75_PAPER1=off ships no papers', (t) => {
  // 理智底线排在卷一闸之前：题库整个空掉时，先看见的该是那一条
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-diag75-empty-'));
  cleanup(t, empty);
  fs.mkdirSync(path.join(empty, 'TMUA'), { recursive: true });
  const floor = build(t, empty, { MIN_GRADEABLE: '' });
  assert.notEqual(floor.built.status, 0);
  assert.match(floor.built.stderr, /可判分题目只有 0 道/);

  // off：合成题库测的不是诊断时用它。不出卷、不打 reserved，构建照常通过
  const { bank } = makeBank();
  cleanup(t, bank);
  const off = build(t, bank, { DIAG75_PAPER1: 'off' });
  assert.equal(off.built.status, 0, off.built.stderr);
  // 被覆盖就在日志里当场说出来：生产构建的日志里冒出这一行，就是配错了
  assert.match(off.built.stdout, /⚠ 卷一被 DIAG75_PAPER1 覆盖（仅测试用）：off/);
  // 换成一份自定义清单同样要报，并报出清单本身（不在题库里也照样先报，再被卷一闸拦下）
  const custom = build(t, bank, { DIAG75_PAPER1: '20180211900,20230300110' });
  assert.match(custom.built.stdout, /⚠ 卷一被 DIAG75_PAPER1 覆盖（仅测试用）：20180211900,20230300110/);
  assert.notEqual(custom.built.status, 0, 'a two-question paper 1 is still refused by the size check');
  assert.match(custom.built.stderr, /卷一应为 10 道，实为 2 道/);
  assert.equal(off.has('diag.json'), false);
  assert.equal(off.read('index.json').some((entry) => entry.reserved), false);

  // 认不出来的值当场炸，不悄悄退回默认
  const junk = build(t, bank, { DIAG75_PAPER1: 'nope' });
  assert.notEqual(junk.built.status, 0);
  assert.match(junk.built.stderr, /DIAG75_PAPER1 认不出来/);
});

// ---------------- 真实产物 ----------------

test('the shipped diag.json is the 7.5+ shape with the fixed paper 1', () => {
  const diag = readExamJson('diag.json', (d) => d?.v === 2 && Array.isArray(d.papers));
  const index = readExamIndex();
  const byQid = new Map(index.map((entry) => [entry.qid, entry]));

  assert.equal(diag.exam, '7.5+');
  assert.deepEqual(diag.papers.map((paper) => paper.id), ['p1', 'p2']);
  assert.deepEqual(diag.papers[0].qids, USER_PAPER1);
  for (const qid of diag.papers[0].qids) assert.ok(byQid.has(qid), `卷一的 ${qid} 不在 index 里`);

  // 卷二：要么准备中（null），要么是 10 道不与卷一重复的 DIAG75 SMT 题
  const p2 = diag.papers[1].qids;
  if (p2 !== null) {
    assert.equal(p2.length, DIAG75_PAPER_SIZE);
    for (const qid of p2) {
      assert.equal(byQid.get(qid)?.db, 'DIAG75', `卷二的 ${qid} 不是 DIAG75`);
      assert.equal(USER_PAPER1.includes(qid), false);
    }
  }

  // GMAT 下线：一道都不在卷里
  const inPapers = new Set(diag.papers.flatMap((paper) => paper.qids || []));
  assert.equal(index.some((entry) => entry.db === 'GMAT' && inPapers.has(entry.qid)), false);

  // reserved 正好是经典区那两道；9.0 区那 7 道不动
  assert.deepEqual(
    index.filter((entry) => entry.reserved).map((entry) => entry.qid).sort((a, b) => a - b),
    CLASSIC_EXAM_QIDS,
  );
  for (const qid of USER_PAPER1) {
    const entry = byQid.get(qid);
    if (CLASSIC_EXAM_QIDS.includes(qid)) {
      assert.equal(entry.hidden, undefined, `${qid} 本该在经典区`);
    } else {
      assert.ok(entry.hidden || entry.diag, `${qid} 本该在 9.0 区或诊断集`);
      assert.equal(entry.reserved, undefined);
    }
  }
});
