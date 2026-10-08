import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { readExamIndex, readExamQuestion } from './helpers/exam-data.mjs';

// 05 密卷（用户 2026-10-08）的数据层：build-data 给 TMUA / MAT 里 year 为 2024、2025 的题
// 打 sealed: true。判据按年份、按 index 里的库名（indexDatabase 之后），与 isHiddenQuestion 同处。
// 这批题照旧是 hidden：9.0 Trivial 里照常有它们，sealed 只是另一道门的标记。

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function build(bank, out) {
  const built = spawnSync(process.execPath, [path.join(root, 'scripts', 'build-data.mjs')], {
    cwd: root,
    encoding: 'utf8',
    // 合成题库：关掉可判分底线，也不出 7.5+ 的卷（见 duplicate-questions.test 同款写法）
    env: { ...process.env, EXAM_OUT: out, BANK_PATH: bank, MIN_GRADEABLE: '0', DIAG75_PAPER1: 'off' },
  });
  assert.equal(built.status, 0, built.stderr);
  return built;
}

const TMUA_CHOICES = ['$$\\mathbf {A} \\quad 1$$', '', '$$\\mathbf {B} \\quad 2$$', '', '$$\\mathbf {C} \\quad 3$$', ''];
const MAT_CHOICES = ['(a) $1$', '(b) $2$', '(c) $3$', '(d) $4$', '(e) $5$', ''];

/** 一道最小可判分题。dir 是题库下的相对目录，front 是额外的 frontmatter 行 */
function writeQuestion(bank, dir, name, { database, qid, id, paper, year, choices, front = [] }) {
  const full = path.join(bank, ...dir.split('/'));
  fs.mkdirSync(full, { recursive: true });
  const body = [
    '---',
    `database: ${database}`,
    `qid: ${qid}`,
    `id: ${id}`,
    `paper: ${paper}`,
    `year: ${year}`,
    'number: Q1',
    'section: MCQ',
    'difficulty: 0',
    ...front,
    '---',
    '',
    '## 题目',
    'Compute $1+1$.',
    '',
    ...choices,
    '## 答案',
    'B',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(full, name), body);
}

test('build-data seals exactly the TMUA and MAT questions from 2024 and 2025, and they stay hidden', (t) => {
  const bank = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-sealed-bank-'));
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-sealed-out-'));
  t.after(() => {
    fs.rmSync(bank, { recursive: true, force: true });
    fs.rmSync(out, { recursive: true, force: true });
  });

  const tmua = (qid, year, extra = {}) => ({
    database: 'TMUA', qid, id: `${String(year).slice(2)}-Q${qid % 100}`, paper: `TMUA ${year} Recall`, year,
    choices: TMUA_CHOICES, ...extra,
  });
  const mat = (qid, year) => ({
    database: 'MAT', qid, id: `${String(year).slice(2)}-Q1A`, paper: `MAT ${year}`, year, choices: MAT_CHOICES,
  });

  // 年份的两侧边界都放一道：2023 / 2026 不进，2024 / 2025 进
  writeQuestion(bank, 'TMUA/2023', 'a.md', tmua(101, 2023));
  writeQuestion(bank, 'TMUA/2024', 'a.md', tmua(102, 2024));
  writeQuestion(bank, 'TMUA/2025', 'a.md', tmua(103, 2025));
  writeQuestion(bank, 'TMUA/2026', 'a.md', tmua(104, 2026));
  writeQuestion(bank, 'MAT/2023', 'a.md', mat(201, 2023));
  writeQuestion(bank, 'MAT/2024', 'a.md', mat(202, 2024));
  writeQuestion(bank, 'MAT/2025', 'a.md', mat(203, 2025));
  writeQuestion(bank, 'MAT/2006', 'a.md', mat(204, 2006));
  // 库名认的是 index 里的那个：Mock 卷写着 2024 也不是 TMUA 真卷；
  // 诊断题源的 frontmatter 写着 database: TMUA，但它在站内是 DIAG75（diag），不进密卷
  writeQuestion(bank, 'TMUA Mock/Set', 'a.md', tmua(301, 2024, { paper: 'TMUA Mock' }));
  writeQuestion(bank, 'Addition Resources/SMT Skills', 'a.md', {
    ...tmua(401, 2024, { id: 'SMT-Ch1-Q1', paper: 'SMT Skills' }),
    front: ['answer_verified: true'],
  });
  // 别的库同年份也不进
  writeQuestion(bank, 'ECAA/2024', 'a.md', {
    database: 'ECAA', qid: 501, id: '24-Q1', paper: 'ECAA 2024', year: 2024, choices: TMUA_CHOICES,
  });

  const built = build(bank, out);
  const index = JSON.parse(fs.readFileSync(path.join(out, 'index.json'), 'utf8'));
  const byQid = new Map(index.map((entry) => [entry.qid, entry]));
  assert.equal(index.length, 11, '合成题库的每一道都该能判分，否则下面的反面断言是空转');

  const sealed = index.filter((entry) => entry.sealed).map((entry) => entry.qid).sort((a, b) => a - b);
  assert.deepEqual(sealed, [102, 103, 202, 203]);
  // 只在为真时写，和 hidden / diag 同体例：没封的题上压根没有这个键
  for (const entry of index) {
    if (!sealed.includes(entry.qid)) assert.equal('sealed' in entry, false, `${entry.qid} 带了 sealed 键`);
  }
  // 密卷照旧是 hidden：9.0 Trivial 那一池不动
  for (const qid of sealed) assert.equal(byQid.get(qid).hidden, true, `${qid} 封了却不在 9.0 池里`);
  assert.equal(byQid.get(301).db, 'TMUA_MOCK');
  assert.equal(byQid.get(401).db, 'DIAG75');
  assert.equal(byQid.get(401).diag, true);

  // 构建日志逐库报密卷题数，刷新题库时当场核得上
  assert.match(built.stdout, /密卷（sealed）：\s*\{"TMUA":2,"MAT":2\} 合计 4/);
});

test('the shipped index seals every 2024–2025 TMUA and MAT question and nothing else', () => {
  const index = readExamIndex();
  const sealed = index.filter((entry) => entry.sealed);
  assert.ok(sealed.length > 0, '一道密卷都没有，密卷区就是空的');

  // 反向审计：拿单题 JSON 的 year 现算一遍应封的集合，与 index 上的标记逐一对上
  const expected = index.filter((entry) => {
    if (entry.diag || (entry.db !== 'TMUA' && entry.db !== 'MAT')) return false;
    const year = readExamQuestion(entry.qid).year;
    return year === 2024 || year === 2025;
  });
  assert.deepEqual(
    sealed.map((entry) => entry.qid).sort((a, b) => a - b),
    expected.map((entry) => entry.qid).sort((a, b) => a - b),
  );
  for (const entry of sealed) {
    assert.equal(entry.hidden, true, `${entry.qid} 封了却不是 hidden`);
    assert.notEqual(entry.diag, true, `${entry.qid} 是诊断题，不该进密卷`);
  }
});
