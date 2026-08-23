import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// 知识点弱项（Weak topics）：按题库自己的 topics 打标，统计用户**做过的题**
// 在各知识点上的正确率，弱的排前面。这组测试盯五件事：
//   1. 构建产物只收进了 index 的题，悬空 qid 一个不留，diag 一个不进
//   2. alias 归并把历史写法并到 12 词规范表，词表外的取值丢弃**且报出来**
//   3. n≥5 门槛真的拦得住小样本，排序真的是弱的在前
//   4. 覆盖率如实披露：做过的题里有多少真进了这份分析
//   5. 「练这类题」尊重 9.0 的范围，未解锁的人摸不到扩展池
//
// 显式带 .ts 扩展名：node --experimental-strip-types 直接跑源码，ESM 解析器不补
import { DICT } from '../src/lib/i18n.ts';
import { practiceQids } from '../src/lib/progress.ts';
import { createEmptyRecords, indexForLibraryMode, reachableIndex } from '../src/lib/records.ts';
import {
  TOPIC_PRACTICE_LIMIT,
  WEAK_TOPIC_MIN_QUESTIONS,
  cachedTopics,
  loadTopics,
  pickTopicQids,
  resetTopicsCache,
  thinTopicCount,
  topicEntries,
  topicReach,
  topicRows,
  weakTopics,
} from '../src/lib/topics.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// P6 把知识点复盘从进度面板搬进了复烤区（Design §P6 A）：
// 「我练到哪儿了」归进度面板，「我该回头做哪些题」归复烤区。
// 行为一条没改，所以下面这些断言原样跟着搬过来，只换了文件
const panelPath = 'src/components/grill/GrillPanel.tsx';
const cssPath = 'src/components/grill/Grill.module.css';
const examPath = 'src/components/exam/ExamApp.tsx';
const buildPath = 'scripts/build-data.mjs';

/** 12 词规范表；构建产物的 vocab 必须正好是这些 */
const VOCAB = [
  'Algebra',
  'Geometry',
  'Logic and Proof',
  'Number Theory',
  'Function',
  'Combinatorics',
  'Misc Pure',
  'Calculus',
  'Trigonometry',
  'Sequences and Series',
  'Polynomial',
  'Probability',
];

/** P0 留档 + P5 新增的归并表（`Statistical Theory` 是这次加的） */
const ALIASES = {
  'Algebra (Basic)': 'Algebra',
  'Algebra (Function)': 'Function',
  'Algebra (Polynomial)': 'Polynomial',
  'Mis Pure': 'Misc Pure',
  'Miscellaneous Pure': 'Misc Pure',
  'Statistical Theory': 'Probability',
};

/** 建到临时目录：node --test 并发跑各文件，原地重建 public\exam 会撞上别人的读窗口 */
function buildInto(t, env = {}) {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-weak-topics-'));
  t.after(() => fs.rmSync(outputDir, { recursive: true, force: true }));
  // 两个流都要：词表外的取值走 console.warn，只收 stdout 就永远看不见它
  const built = spawnSync(process.execPath, [path.join(root, 'scripts', 'build-data.mjs')], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, EXAM_OUT: outputDir, ...env },
  });
  assert.equal(built.status, 0, `build-data 挂了：\n${built.stderr}`);
  const read = (name) => JSON.parse(fs.readFileSync(path.join(outputDir, name), 'utf8'));
  return {
    outputDir,
    log: `${built.stdout}${built.stderr}`,
    index: read('index.json'),
    topics: read('topics.json'),
  };
}

/**
 * 结构断言要看真正跑起来的代码。注释里提一嘴文件名是说明，不是「组件自己拼 URL」，
 * 不剥注释的话 doesNotMatch 会被自己的说明文字绊倒。
 */
function codeOnly(source) {
  return source
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

// ---- 源题库的对照读法 ----
//
// 刻意不碰 build-data 的列表解析：照抄生产实现只能证明两份代码长得一样。
// 这里在 topics 的取值段上直接卡条目边界，与 logic-reasoning 那套同源。

function frontmatterOf(raw) {
  const m = raw.match(/^﻿?---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : '';
}

/** topics 的取值段：行内 `[a, b]` 和块状的若干 `- a` 都落在这一段里 */
function topicsBlock(frontmatter) {
  const lines = frontmatter.split(/\r?\n/);
  const start = lines.findIndex((line) => /^topics\s*:/.test(line));
  if (start === -1) return '';
  const collected = [lines[start].replace(/^[^:]*:/, '')];
  for (const line of lines.slice(start + 1)) {
    if (/^[A-Za-z_]/.test(line)) break; // 下一个顶层键，取值段到此为止
    collected.push(line);
  }
  return collected.join('\n');
}

/** 这一段里有没有正好等于 label 的条目（前后必须是列表边界） */
function hasExactItem(block, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[,[\\n]|-\\s)\\s*["']?${escaped}["']?\\s*($|[,\\]\\n])`, 'i').test(block);
}

function scanBank() {
  const byQid = new Map();
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      if (fs.statSync(full).isDirectory()) {
        if (name.startsWith('.') || ['image', 'images'].includes(name.toLowerCase())) continue;
        walk(full);
      } else if (name.endsWith('.md') && !name.endsWith('.bak')) {
        const frontmatter = frontmatterOf(fs.readFileSync(full, 'utf8'));
        const qid = Number((frontmatter.match(/^qid\s*:\s*(\d+)/m) || [])[1]);
        if (qid) byQid.set(qid, topicsBlock(frontmatter));
      }
    }
  };
  walk(path.join(root, 'data'));
  return byQid;
}

// ---- 合成数据 ----

/** 一份小索引：hidden / diag / 普通题各有，用来看清每层滤网丢掉了谁 */
const SCOPE = [
  { qid: 1, db: 'TMUA' },
  { qid: 2, db: 'TMUA' },
  { qid: 3, db: 'MAT' },
  { qid: 4, db: 'TMUA_MOCK', hidden: true },
  { qid: 5, db: 'GMAT', diag: true },
];

/** 一份小倒排表 */
function topicsFixture(byTopic) {
  return { v: 1, vocab: VOCAB, byTopic, coverage: {} };
}

/** 把 [qid, attempts, wrong] 三元组摊成 records */
function recordsOf(rows) {
  const records = createEmptyRecords();
  for (const [qid, a, w] of rows) {
    records.q[String(qid)] = { a, w, t: 1, c: w > 0 ? 0 : 1 };
  }
  return records;
}

/** n 道连号题，全归同一个知识点 */
function run(from, count) {
  return Array.from({ length: count }, (_, i) => from + i);
}

test('the topic inversion carries only questions that made it into the index', (t) => {
  const { index, topics } = buildInto(t);

  assert.equal(topics.v, 1);
  assert.deepEqual(topics.vocab, VOCAB, 'vocab 必须正好是 12 词规范表，顺序也别动');
  assert.deepEqual(
    Object.keys(topics).sort(),
    ['byTopic', 'coverage', 'v', 'vocab'],
    'topics.json 的形状是约定的四个键',
  );

  const indexed = new Map(index.map((entry) => [entry.qid, entry]));
  for (const [name, qids] of Object.entries(topics.byTopic)) {
    assert.ok(VOCAB.includes(name), `byTopic 里冒出了词表外的键 ${name}`);
    assert.ok(qids.length > 0, `${name} 是个空数组，本就不该写进来`);
    assert.equal(new Set(qids).size, qids.length, `${name} 里有重复 qid`);
    for (const qid of qids) {
      // 悬空 qid 一个不留：点「练这类题」抽到取不回来的题，整场当场炸掉
      assert.ok(indexed.has(qid), `${name} 里的 ${qid} 不在 index 里`);
    }
    assert.deepEqual([...qids].sort((a, b) => b - a), qids, `${name} 应与 index 同序（降序）`);
  }

  // coverage 的分母就是「这个库进了 index 的非诊断题数」——diag 结构性排除，
  // 弱项图的任何口径（分子、分母、点名名单）都不该沾诊断集
  const tagged = new Set(Object.values(topics.byTopic).flat());
  const expected = {};
  for (const entry of index) {
    if (entry.diag) continue;
    const row = (expected[entry.db] ||= { tagged: 0, total: 0 });
    row.total++;
    if (tagged.has(entry.qid)) row.tagged++;
  }
  assert.deepEqual(
    Object.keys(topics.coverage).sort(),
    Object.keys(expected).sort(),
    'coverage 要逐库给全，一个库都不能漏',
  );
  for (const db of Object.keys(expected)) {
    assert.deepEqual(topics.coverage[db], expected[db], `${db} 的覆盖数对不上`);
    assert.ok(
      topics.coverage[db].tagged <= topics.coverage[db].total,
      `${db} 的分子超过了分母`,
    );
  }

  // 正：这份数据不是空跑——真有题、也真有没整理完的库
  assert.ok(tagged.size > 0, '一道打过标的题都没有，整条管线多半没生效');
  assert.ok(
    Object.values(topics.coverage).some((row) => row.tagged < row.total),
    '每个库都 100% 的话，覆盖率披露那行就成了摆设，说明数据读错了',
  );
});

test('index.json keeps its frozen shape — topics data lives in its own file', (t) => {
  const { index, outputDir } = buildInto(t);

  // 白名单和 diagnostic.test.mjs 那条同源：index 每次冷启动都要下载，
  // 知识点数据只有打开进度面板才用得到，不该挤进来
  for (const entry of index) {
    for (const key of Object.keys(entry)) {
      assert.ok(
        ['qid', 'db', 'hidden', 'diag', 'logic', 'tagged'].includes(key),
        `index 里冒出了新键 ${key}`,
      );
    }
  }
  assert.ok(fs.existsSync(path.join(outputDir, 'topics.json')), 'topics.json 应当单独落盘');

  // 单题 JSON 同样一个字节没加
  const sample = JSON.parse(
    fs.readFileSync(path.join(outputDir, 'q', `${index[0].qid}.json`), 'utf8'),
  );
  assert.deepEqual(
    Object.keys(sample).sort(),
    [
      'answer',
      'choices',
      'database',
      'id',
      'number',
      'optionsInline',
      'paper',
      'qid',
      'solution',
      'statement',
      'year',
    ],
    '单题 JSON 的形状也是冻结的',
  );
});

test('diagnostic questions are structurally absent from the topic analysis', (t) => {
  const { index, topics } = buildInto(t);

  // 结构上的事实：GMAT 没有知识点打标，所以它一道题也进不了倒排表。
  // 这条不能只是「碰巧成立」——诊断题全程不显示对错，一旦经弱项图露头，
  // 泄的就是诊断答案
  const diag = new Set(index.filter((entry) => entry.diag).map((entry) => entry.qid));
  assert.ok(diag.size > 0, 'index 里得真有 diag 条目，这条守卫才有负载');
  for (const [name, qids] of Object.entries(topics.byTopic)) {
    for (const qid of qids) {
      assert.equal(diag.has(qid), false, `${name} 里混进了诊断题 ${qid}`);
    }
  }
  // 诊断集整库连 coverage 都不进：它不参与弱项图的任何口径，
  // 留一行 0/113 只会让审查者问「它为什么在这里」
  for (const db of Object.keys(topics.coverage)) {
    assert.equal(
      index.some((entry) => entry.db === db && entry.diag),
      false,
      `${db} 含诊断题，不该出现在 coverage 里`,
    );
  }

  // 行为上的第二道闸：就算哪天诊断题被打上了标签，统计池也把它挡在外面
  const pool = practiceQids(SCOPE);
  const rows = topicRows(
    topicsFixture({ Algebra: [1, 5] }),
    recordsOf([[1, 2, 1], [5, 9, 9]]),
    pool,
  );
  assert.deepEqual(rows, [{ topic: 'Algebra', questions: 1, attempts: 2, wrong: 1, accuracy: 0.5 }]);

  // 「练这类题」的池子同样不给诊断题留门
  const scope = reachableIndex(SCOPE, true);
  const entries = topicEntries(topicsFixture({ Algebra: [1, 5] }), 'Algebra', scope);
  assert.deepEqual(entries.map((entry) => entry.qid), [1]);
});

test('the alias table folds every historic spelling into the 12-word vocabulary', (t) => {
  const { index, topics, log } = buildInto(t);
  const source = scanBank();
  const indexed = new Set(index.map((entry) => entry.qid));

  let hits = 0;
  for (const [raw, canonical] of Object.entries(ALIASES)) {
    assert.equal(topics.byTopic[raw], undefined, `${raw} 是别名，不该自己成一个键`);
    const target = new Set(topics.byTopic[canonical] || []);
    for (const [qid, block] of source) {
      if (!indexed.has(qid) || !hasExactItem(block, raw)) continue;
      hits++;
      assert.ok(target.has(qid), `${qid} 标的是 ${raw}，应当并进 ${canonical}`);
    }
  }
  assert.ok(hits > 0, '一条别名都没命中，这条测试就是空跑——归并表和题库对不上了');

  // 词表外的取值一个都不该有。真出现了是打标侧的信号，构建日志会报（下一条测试证明它会报）
  assert.doesNotMatch(log, /词表外/, `构建日志报出了词表外的取值：\n${log}`);

  // 反面：规范名本身当然照常收录，别名归并不是把原名也一起吃掉
  const algebra = new Set(topics.byTopic.Algebra || []);
  const plain = [...source].filter(
    ([qid, block]) => indexed.has(qid) && hasExactItem(block, 'Algebra'),
  );
  assert.ok(plain.length > 0);
  for (const [qid] of plain) assert.ok(algebra.has(qid), `${qid} 直接标了 Algebra 却没收录`);
});

test('an out-of-vocabulary topic is dropped and reported, never swallowed', (t) => {
  const bank = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-weak-bank-'));
  t.after(() => fs.rmSync(bank, { recursive: true, force: true }));

  const base = (qid, id) =>
    `database: TMUA\nqid: ${qid}\nid: ${id}\npaper: TMUA P1\nyear: 2020\nnumber: Q1\nsection: Applications\ndifficulty: 0`;
  const write = (name, frontmatter) => {
    fs.mkdirSync(path.join(bank, 'TMUA', '2020'), { recursive: true });
    fs.writeFileSync(
      path.join(bank, 'TMUA', '2020', name),
      `---\n${frontmatter}\n---\n\n## 题目\nWhat is $1+1$?\n\n$$\n\\mathbf {A} \\quad 1\n$$\n\n$$\n\\mathbf {B} \\quad 2\n$$\n\n## 答案\nB\n`,
    );
  };

  // 块状列表夹空行、夹注释——P4 修好的解析器认得，这里顺带钉住它没有退化
  write('20-P1-Q1.md', `${base(20200210100, '20-P1-Q1')}\ntopics:\n\n  - Algebra (Basic)\n  # 这一行是注释\n  - Statistical Theory\nstatus: 已入库`);
  // 行内写法（站内那 200 条全在 TMUA Mock）
  write('20-P1-Q2.md', `${base(20200210200, '20-P1-Q2')}\ntopics: [Mis Pure, "Sequences and Series"]\nstatus: 已入库`);
  // 归并后撞同一个规范名，去重
  write('20-P1-Q3.md', `${base(20200210300, '20-P1-Q3')}\ntopics: [Algebra, Algebra (Basic)]\nstatus: 已入库`);
  // 词表外：丢弃 + 报出来；同一题里认得的那个照收
  write('20-P1-Q4.md', `${base(20200210400, '20-P1-Q4')}\ntopics: [Astrophysics, Geometry]\nstatus: 已入库`);
  // 空列表 = 没整理过，进分母不进分子
  write('20-P1-Q5.md', `${base(20200210500, '20-P1-Q5')}\ntopics: []\nstatus: 已入库`);

  const { topics, log } = buildInto(t, { BANK_PATH: bank });

  assert.deepEqual(topics.byTopic.Algebra, [20200210300, 20200210100]);
  assert.deepEqual(topics.byTopic.Probability, [20200210100], '`Statistical Theory` 归到 Probability');
  assert.deepEqual(topics.byTopic['Misc Pure'], [20200210200]);
  assert.deepEqual(topics.byTopic['Sequences and Series'], [20200210200], '带引号的行内条目也要认');
  assert.deepEqual(topics.byTopic.Geometry, [20200210400], '同题里认得的标签不该被那个生词连累');
  assert.equal(topics.byTopic.Astrophysics, undefined, '词表外的取值不许自己成一个键');
  assert.equal(
    Object.values(topics.byTopic).flat().filter((qid) => qid === 20200210300).length,
    1,
    '一题多标归并后撞同名，必须去重',
  );

  // 丢是丢了，但绝不静默：站内现在零漏网，真冒出新词得有人看见
  assert.match(log, /词表外/);
  assert.match(log, /Astrophysics/);

  assert.deepEqual(topics.coverage.TMUA, { tagged: 4, total: 5 }, '空列表算没整理过，仍进分母');
  assert.deepEqual(topics.vocab, VOCAB, 'vocab 是规范表，不随某次题库内容变');
});

test('a topic needs five attempted questions before it gets a verdict', () => {
  const data = topicsFixture({ Algebra: run(100, 9), Geometry: run(200, 9) });
  const pool = new Set([...run(100, 9), ...run(200, 9)]);

  // Algebra 做过 4 道、Geometry 做过 5 道，都错得一塌糊涂
  const records = recordsOf([
    ...run(100, 4).map((qid) => [qid, 1, 1]),
    ...run(200, 5).map((qid) => [qid, 1, 1]),
  ]);
  const rows = topicRows(data, records, pool);
  assert.deepEqual(rows.map((row) => [row.topic, row.questions]), [
    ['Algebra', 4],
    ['Geometry', 5],
  ]);

  const weak = weakTopics(rows);
  assert.deepEqual(weak.map((row) => row.topic), ['Geometry'], '不足 5 道的那行不该出现');
  assert.equal(thinTopicCount(rows), 1, '差一道的那个知识点要能数出来，好向用户交代');
  assert.equal(WEAK_TOPIC_MIN_QUESTIONS, 5);

  // 补第 5 道（100–103 已经在上面做过了），门槛当场放行
  records.q[String(104)] = { a: 1, w: 1, t: 1, c: 0 };
  const after = weakTopics(topicRows(data, records, pool));
  assert.deepEqual(after.map((row) => row.topic).sort(), ['Algebra', 'Geometry']);

  // 一道都没做过的知识点连行都不产出，不占「样本不足」的名额
  assert.equal(topicRows(data, createEmptyRecords(), pool).length, 0);
  assert.deepEqual(weakTopics([]), []);
});

test('accuracy is measured on attempts, and the weakest topic sorts first', () => {
  const data = topicsFixture({
    Algebra: run(100, 5),
    Geometry: run(200, 5),
    Calculus: run(300, 5),
  });
  const pool = new Set([...run(100, 5), ...run(200, 5), ...run(300, 5)]);

  const records = recordsOf([
    // Algebra：5 道题共 10 次作答、错 8 次 → 20%
    ...run(100, 5).map((qid) => [qid, 2, qid === 104 ? 0 : 2]),
    // Geometry：5 道题各 1 次、错 3 次 → 40%
    ...run(200, 5).map((qid) => [qid, 1, qid < 203 ? 1 : 0]),
    // Calculus：5 道题各 1 次、全对 → 100%
    ...run(300, 5).map((qid) => [qid, 1, 0]),
  ]);

  const rows = topicRows(data, records, pool);
  const algebra = rows.find((row) => row.topic === 'Algebra');
  assert.deepEqual(algebra, {
    topic: 'Algebra',
    questions: 5,
    attempts: 10,
    wrong: 8,
    accuracy: 0.2,
  });
  // 口径是「做过的题的累计正确率」：同一道题做两遍就是两次，不是按题数平均
  assert.notEqual(algebra.accuracy, 0.8, '别把「做对过的题占比」当成正确率');

  assert.deepEqual(
    weakTopics(rows).map((row) => row.topic),
    ['Algebra', 'Geometry', 'Calculus'],
    '弱的排前面',
  );

  // 同正确率时样本大的在前，再同就按名字，顺序不随索引顺序漂
  const tie = [
    { topic: 'Zeta', questions: 6, attempts: 6, wrong: 3, accuracy: 0.5 },
    { topic: 'Alpha', questions: 9, attempts: 9, wrong: 4.5, accuracy: 0.5 },
    { topic: 'Beta', questions: 6, attempts: 6, wrong: 3, accuracy: 0.5 },
  ];
  assert.deepEqual(weakTopics(tie).map((row) => row.topic), ['Alpha', 'Beta', 'Zeta']);

  // 脏数据不该渲染出 NaN：a 为 0 的记录整条跳过
  const zero = topicRows(data, recordsOf(run(100, 5).map((qid) => [qid, 0, 0])), pool);
  assert.deepEqual(zero, []);
});

test('the reach note owns up to how much of your practice this analysis covers', () => {
  const index = [
    { qid: 1, db: 'TMUA' },
    { qid: 2, db: 'TMUA' },
    { qid: 3, db: 'MAT' },
    { qid: 4, db: 'MAT' },
    { qid: 5, db: 'MAT' },
    { qid: 6, db: 'ECAA' },
    { qid: 9, db: 'GMAT', diag: true },
  ];
  const data = topicsFixture({ Algebra: [1, 2, 3] });
  // 点名要看整库覆盖率：MAT / ECAA 整库都没整理过半，才配上「还没整理完」的名单
  data.coverage = {
    TMUA: { tagged: 2, total: 2 },
    MAT: { tagged: 1, total: 3 },
    ECAA: { tagged: 0, total: 1 },
  };
  // 做过 1–6 与诊断题 9；只有 1/2/3 整理过知识点
  const records = recordsOf([1, 2, 3, 4, 5, 6, 9].map((qid) => [qid, 1, 0]));

  const reach = topicReach(data, records, index);
  assert.equal(reach.attempted, 6, '诊断题不算在内');
  assert.equal(reach.analysed, 3);
  assert.deepEqual(reach.banks, ['MAT', 'ECAA'], '按落下的题数降序，好指出主要缺口');

  // 整库覆盖过半的库不许被点名：TMUA 已整理 90%，用户恰好做过它剩下的两道
  // 未打标题，就把 TMUA 说成「还没整理完的库」，是拿个例冤枉全体。
  // analysed < attempted 仍然成立（披露行照出），但名单为空、文案走无名单分支
  const wellCovered = topicsFixture({ Algebra: [1] });
  wellCovered.coverage = { TMUA: { tagged: 9, total: 10 }, MAT: { tagged: 1, total: 3 } };
  const unfair = topicReach(
    wellCovered,
    recordsOf([[1, 1, 0], [2, 1, 0]]),
    [{ qid: 1, db: 'TMUA' }, { qid: 2, db: 'TMUA' }],
  );
  assert.equal(unfair.analysed, 1);
  assert.equal(unfair.attempted, 2);
  assert.deepEqual(unfair.banks, [], '覆盖过半的库不进名单');

  // 全都整理过时不留话柄：面板据此判断这行要不要出现
  const full = topicReach(topicsFixture({ Algebra: [1, 2, 3, 4, 5, 6] }), records, index);
  assert.equal(full.analysed, full.attempted);
  assert.deepEqual(full.banks, []);

  // 没做过题、或索引还没到位时不炸
  assert.deepEqual(topicReach(data, createEmptyRecords(), index), {
    attempted: 0,
    analysed: 0,
    banks: [],
  });
  assert.deepEqual(topicReach(data, records, null), { attempted: 0, analysed: 0, banks: [] });
});

test('"practise these" stays inside the range the user has actually unlocked', () => {
  const data = topicsFixture({ Algebra: [1, 2, 3, 4, 5] });

  // 范围读的是 reachableIndex（「够得着的题」），不是抽题池那层互斥的
  // indexForLibraryMode——复盘是跨区的，站在 9.0 卡前面打开它，
  // 做过的经典卷题不该凭空消失
  // 未解锁：扩展池那道（4，hidden）摸不到，诊断题（5）也摸不到
  const classic = topicEntries(data, 'Algebra', reachableIndex(SCOPE, false));
  assert.deepEqual(classic.map((entry) => entry.qid), [1, 2, 3]);
  // 解锁之后 hidden 才进来，而经典卷仍然在
  const expanded = topicEntries(data, 'Algebra', reachableIndex(SCOPE, true));
  assert.deepEqual(expanded.map((entry) => entry.qid), [1, 2, 3, 4]);

  // 反面：若误用了互斥那层，解锁用户的「练这类题」会只剩扩展池那一道
  assert.deepEqual(
    topicEntries(data, 'Algebra', indexForLibraryMode(SCOPE, 'hidden')).map((entry) => entry.qid),
    [4],
    '互斥池不该被当成复盘口径——这条钉住两者确实不同',
  );

  // 这个知识点的题全在还没解开的范围里 → 空池，按钮该置灰
  const onlyHidden = topicEntries(
    topicsFixture({ Geometry: [4] }),
    'Geometry',
    reachableIndex(SCOPE, false),
  );
  assert.deepEqual(onlyHidden, []);
  assert.deepEqual(pickTopicQids(onlyHidden, createEmptyRecords()), []);

  // 词表里没有的知识点、以及一道题都没有的知识点，同样是空池
  assert.deepEqual(topicEntries(data, 'Calculus', reachableIndex(SCOPE, true)), []);
});

test('"practise these" caps at ten and reaches for wrong answers first', () => {
  const qids = run(1, 40);
  const data = topicsFixture({ Algebra: qids });
  const scope = qids.map((qid) => ({ qid, db: 'TMUA' }));
  const entries = topicEntries(data, 'Algebra', scope);

  const records = recordsOf([
    ...run(1, 6).map((qid) => [qid, 2, 2]), // 当前错题
    ...run(20, 5).map((qid) => [qid, 1, 0]), // 做对过的
  ]);

  assert.equal(TOPIC_PRACTICE_LIMIT, 10);
  for (let i = 0; i < 20; i++) {
    const picked = pickTopicQids(entries, records);
    assert.equal(picked.length, TOPIC_PRACTICE_LIMIT, '够题时就该抽满上限');
    assert.equal(new Set(picked).size, picked.length, '一场里不该出现重复题');
    for (const qid of picked) assert.ok(qids.includes(qid), `${qid} 不属于这个知识点`);
    // 错题优先占前三分之一（pickQids 的既有配比），所以每场都必须捞到错题
    assert.ok(
      picked.filter((qid) => qid <= 6).length >= 4,
      `错题没有被优先捞起来：${picked.join(',')}`,
    );
    // 做过的题不该被排除——复盘弱项要的正是回头做那几道
    assert.ok(picked.some((qid) => qid > 6));
  }

  // 池子比上限小就有几道抽几道
  const few = topicEntries(topicsFixture({ Algebra: run(1, 3) }), 'Algebra', scope);
  assert.equal(pickTopicQids(few, records).length, 3);
});

test('topics.json is fetched once, lazily, and a failure is not cached', async (t) => {
  const original = globalThis.fetch;
  let calls = 0;
  t.after(() => {
    globalThis.fetch = original;
    resetTopicsCache();
  });

  resetTopicsCache();
  assert.equal(cachedTopics(), null, '没取过就该是空的——面板据此决定整块渲不渲染');

  // 先让它失败一次：取不到不能被缓存成「永远没有」
  globalThis.fetch = async () => {
    calls++;
    return { ok: false, status: 503, json: async () => ({}) };
  };
  await assert.rejects(loadTopics());
  assert.equal(cachedTopics(), null);

  const payload = topicsFixture({ Algebra: [1] });
  globalThis.fetch = async (url) => {
    calls++;
    assert.match(String(url), /\/exam\/topics\.json$/, '取的必须是独立的那个文件');
    return { ok: true, status: 200, json: async () => payload };
  };

  const first = await loadTopics();
  const second = await loadTopics();
  assert.deepEqual(first, payload);
  assert.equal(second, first, '第二次该直接给缓存，不再发请求');
  assert.equal(cachedTopics(), first);
  assert.equal(calls, 2, `失败 1 次 + 成功 1 次，之后一次都不该再发（实际 ${calls} 次）`);

  // 并发两次也只发一个请求
  resetTopicsCache();
  calls = 0;
  const [a, b] = await Promise.all([loadTopics(), loadTopics()]);
  assert.equal(a, b);
  assert.equal(calls, 1, '同时打开两次不该并发拉两份');

  // 200 但形状不对（代理/CDN 的 JSON 错误体、旧缓存撞上新结构）必须被形状闸
  // 挡在缓存之外——这批数据一旦入缓存，面板一开就在 vocab 迭代处炸掉整个应用，
  // 「取不到就整块不渲染」的承诺必须包含「取到了但不是那份数据」
  resetTopicsCache();
  for (const junk of [{ ok: true }, { v: 2, vocab: [], byTopic: {}, coverage: {} }, { v: 1, vocab: 'x', byTopic: {}, coverage: {} }, null]) {
    globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => junk });
    await assert.rejects(loadTopics(), /shape/, `畸形负载 ${JSON.stringify(junk)} 不该被放进来`);
    assert.equal(cachedTopics(), null, '畸形负载绝不能入缓存');
  }
});

test('the panel loads the inversion lazily and hides the whole block when it is missing', () => {
  const panel = fs.readFileSync(panelPath, 'utf8');

  // 懒取：和错题榜懒取单题 JSON 同一条路子，模块级缓存管跨次打开
  assert.match(panel, /useState<TopicsData \| null>\(\(\) => cachedTopics\(\)\)/);
  assert.match(panel, /loadTopics\(\)/);
  assert.doesNotMatch(codeOnly(panel), /topics\.json/, '路径归 lib 管，组件不该自己拼 URL');
  // 取不到就整块不渲染，面板其余部分照常
  assert.match(panel, /\{topics && \(/);
  assert.match(panel, /\.catch\(\(\) => \{\}\)/);

  // 统计走练习池（已排除 diag），和统计块、错题榜同源
  assert.match(panel, /topicRows\(topics, records, practice\)/);
  assert.match(panel, /weakTopics\(allTopicRows\)/);
  // 门槛与上限都读常量，不在组件里另写一个数
  assert.match(panel, /WEAK_TOPIC_MIN_QUESTIONS/);
  assert.doesNotMatch(panel, /questions >= 5|>= 5\b/);

  // 每行：知识点名、做过 N 题、正确率、横条、按钮
  assert.match(panel, /\{row\.topic\}/);
  assert.match(panel, /t\.grill\.weakRow\(row\.questions, fmtPercent\(row\.accuracy\)\)/);
  assert.match(panel, /styles\.topicBar/);
  assert.match(panel, /styles\.topicFill/);
  assert.match(panel, /t\.grill\.weakPractice\}/);
  // 空池置灰
  assert.match(panel, /disabled=\{busy \|\| !index \|\| pool\.length === 0\}/);
  // 抽题在点击那一刻发生：渲染期算的话每次重渲染都换一批，还白洗牌
  assert.match(panel, /onClick=\{\(\) => onPractice\(pickTopicQids\(pool, records\)\)\}/);
  assert.doesNotMatch(panel, /setTimeout\([^)]*onPractice/);

  // 两条披露：门槛之外的知识点、覆盖不到的题
  assert.match(panel, /t\.grill\.weakThin\(thin, WEAK_TOPIC_MIN_QUESTIONS\)/);
  assert.match(panel, /reach\.analysed < reach\.attempted/);
  assert.match(panel, /t\.grill\.weakCoverage\(/);
  // 全部知识点都不够格时换引导文案
  assert.match(panel, /weak\.length === 0 \? \(\s*<p className=\{styles\.empty\}>/);

  // 面板依旧不认得解锁规则：范围是外层划好递进来的
  assert.doesNotMatch(panel, /hiddenUnlocked|HIDDEN_UNLOCK_COUNT|locked/);
  assert.match(panel, /topicScope: IndexEntry\[\];/);
  assert.match(panel, /topicEntries\(topics, row\.topic, topicScope\)/);
});

test('the app hands the panel a scope that honours the 9.0 gate and ignores the logic switch', () => {
  const exam = fs.readFileSync(examPath, 'utf8');

  // 范围按解锁状态划，不按当前前位卡——复烤区是跨区的复盘视图。
  // 读的是 reachableIndex（经典 ∪ 解锁后的扩展）而不是互斥那层：
  // 站在 9.0 卡前面打开复盘，做过的经典卷题不该凭空消失。
  // useMemo 是刻意的：12 个知识点 × 全量索引的求交、107 套卷的 qid 求交
  // 都挂在这个引用上，每次重渲染换新数组等于 memo 白写
  assert.match(
    exam,
    /const reachable = useMemo\(\s*\(\) => \(index \? reachableIndex\(index, hiddenUnlocked\) : \[\]\),\s*\[index, hiddenUnlocked\],\s*\);/,
  );
  assert.match(exam, /topicScope=\{reachable\}/);
  assert.match(exam, /reachable=\{reachable\}/, '卷面进度墙的分母读的是同一个集合');
  // 逻辑推理开关（P4）不该碰这条路：它管的是随机抽题的口味
  assert.equal(
    exam.includes('indexForLogicReasoning(reachable'),
    false,
    '弱项图不经过逻辑推理那层滤网',
  );
  assert.equal(exam.includes('topicScope={activeIndex}'), false);
  // 互斥那层是抽题池，不是复盘口径；拿它当 scope 会让解锁用户在复烤区
  // 只练得到扩展卷
  assert.equal(exam.includes('topicScope={scopedIndex}'), false);

  // 走 P0 建好的 start({ qids }) 通道，practice 模式，同步直调
  assert.match(exam, /const practiceTopic = \(qids: number\[\]\) => \{/);
  assert.match(exam, /setMode\('practice'\);\s*\n\s*void start\(\{ db: 'ALL', qids \}\);/);
  assert.match(exam, /onPractice=\{practiceTopic\}/);
  assert.doesNotMatch(exam, /setTimeout\([^)]*practiceTopic/);
  // 诊断题不该从这条路混进普通考试：start 没收到 allowDiag
  assert.doesNotMatch(exam, /practiceTopic[\s\S]{0,300}allowDiag/);
});

test('the weak-topic rows reuse the panel styling instead of inventing a new one', () => {
  const panel = fs.readFileSync(panelPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  // 按钮直接借面板现成的 ghost 样式，不另起一套
  assert.match(panel, /\$\{styles\.ghost\} \$\{styles\.topicPractice\}/);
  // 行卡片与错题榜同一个配方（边框 + surface-alt），横条与进度面板的
  // 用时细柱同一个配方
  assert.match(css, /\.topicRow \{[^}]*var\(--surface-alt\)/s);
  assert.match(css, /\.topicRow \{[^}]*border: 1px solid var\(--border\)/s);
  assert.match(css, /\.topicBar \{[^}]*color-mix\(in srgb, var\(--accent\)/s);
  assert.match(css, /\.topicFill \{[^}]*background: var\(--accent\)/s);
  // 紧凑版必须排在 .ghost 之后：两个类同权重，靠源码顺序决胜负
  assert.ok(css.indexOf('.ghost {') < css.indexOf('.topicPractice {'), '.topicPractice 会被 .ghost 整块盖掉');
  // 主题变量之外一个字面色都没有
  assert.doesNotMatch(panel, /#[0-9a-fA-F]{3,8}\b/);

  // 横条是装饰，数字在文本里，读屏别念两遍
  assert.match(panel, /className=\{styles\.topicBar\} aria-hidden="true"/);
  // 行名和读屏标签都要走显示名映射：中文界面下知识点给译名，读屏念的得是同一个词
  assert.match(panel, /\{t\.grill\.topicName\(row\.topic\)\}/);
  assert.match(panel, /aria-label=\{t\.grill\.weakPracticeAria\(t\.grill\.topicName\(row\.topic\)\)\}/);
  assert.match(panel, /className=\{styles\.topicList\} role="list"/);
});

test('both dictionaries carry the weak-topic copy and own up to the gaps', () => {
  for (const [lang, dict] of Object.entries(DICT)) {
    // 文案随板块一起搬到了 grill 名下：字典是按「哪张卡在说话」分段的
    const p = dict.grill;
    for (const key of ['weakTitle', 'weakNote', 'weakPractice']) {
      assert.ok(p[key]?.trim().length > 0, `${lang} 的 ${key} 是空的`);
    }
    // 口径写死，两种语言都要说的是同一件事
    assert.match(p.weakRow(7, '43%'), /7.*43%/, `${lang} 的行文案要给出题数和正确率`);
    assert.match(p.weakEmpty(5), /5/, `${lang} 的引导文案要说清门槛`);
    assert.match(p.weakThin(3, 5), /3.*5|5.*3/, `${lang} 的样本不足说明要给出两个数`);
    // 覆盖披露：两个数 + 库名，一个都不能少
    const note = p.weakCoverage(12, 40, 'MAT · ECAA');
    for (const piece of ['12', '40', 'MAT', 'ECAA']) {
      assert.ok(note.includes(piece), `${lang} 的覆盖文案漏了 ${piece}`);
    }
    assert.match(p.weakPracticeAria('Algebra'), /Algebra/);
  }

  // 口径的英文措辞是裁定过的原话；「弱的排前面」这个排序事实也要说出来
  assert.equal(
    DICT.en.grill.weakNote,
    'Lifetime accuracy on attempted questions · weakest first',
  );
  // 标题不许叫「弱项」：榜上列的是全部够格的知识点，全对的人也会看到 100% 的行
  assert.doesNotMatch(DICT.zh.grill.weakTitle, /弱项/);
  assert.doesNotMatch(DICT.en.grill.weakTitle, /weak/i);
  // 这些不是考试专名，两种语言必须真的翻过（i18n.test 的白名单不该被撑大）
  for (const key of ['weakTitle', 'weakNote', 'weakPractice']) {
    assert.notEqual(DICT.zh.grill[key], DICT.en.grill[key], `${key} 没翻`);
  }

  // 知识点名两种界面都用题库里的英文规范名，不翻（用户裁定）：
  // 学生对着的是英文原卷，硬翻反而和题面对不上
  for (const [lang, dict] of Object.entries(DICT)) {
    for (const name of ['Algebra', 'Sequences and Series', 'Future Topic']) {
      assert.equal(dict.grill.topicName(name), name, `${lang} 的知识点名不该被翻译或改写`);
    }
  }

  // 覆盖披露的无名单分支：用户漏的题全落在整理过大半的库里时，不点名任何库
  for (const [lang, dict] of Object.entries(DICT)) {
    const bankless = dict.grill.weakCoverage(3, 5, '');
    assert.ok(bankless.includes('3') && bankless.includes('5'), `${lang} 的无名单分支要给出两个数`);
    assert.doesNotMatch(bankless, /（）|\(\)/, `${lang} 的无名单分支不该留一对空括号`);
  }
});

test('the build script keeps the vocabulary and the alias table in one place', () => {
  const build = fs.readFileSync(buildPath, 'utf8');

  // 解析复用 P4 修好的那套，不另写一个 topics 读法
  assert.match(build, /listField\(data, 'topics'\)/);
  assert.equal(
    (build.match(/const TOPIC_VOCAB = \[/g) || []).length,
    1,
    '规范表只该有一份',
  );
  for (const name of VOCAB) assert.ok(build.includes(`'${name}'`), `规范表少了 ${name}`);
  for (const [raw, canonical] of Object.entries(ALIASES)) {
    assert.ok(
      build.includes(`'${raw.toLowerCase()}': '${canonical}'`),
      `别名表少了 ${raw} → ${canonical}`,
    );
  }
  // 产物落独立文件，index 那行一个字没动
  assert.match(build, /path\.join\(OUT, 'topics\.json'\)/);
  assert.match(build, /JSON\.stringify\(\{ v: 1, vocab: TOPIC_VOCAB, byTopic, coverage: topicCoverage \}\)/);
});
