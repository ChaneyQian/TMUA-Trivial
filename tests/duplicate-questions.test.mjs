import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { readExamIndex, readExamQuestion } from './helpers/exam-data.mjs';

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

test('a question tagged 重复题 never enters the pool', (t) => {
  // MAT Specimen 两卷 32 题里 26 道是 1996–2006 历年真题重排而成，题库侧给它们
  // 打了 tags: [重复题]。这类题和被重排的原题同时在池里，抽题就会把同一道题
  // 发两遍——整题不入池
  const bank = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-dup-bank-'));
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-dup-out-'));
  t.after(() => {
    fs.rmSync(bank, { recursive: true, force: true });
    fs.rmSync(out, { recursive: true, force: true });
  });

  const write = (name, qid, id, tagLines, figure) => {
    const dir = path.join(bank, 'TMUA', '2020');
    fs.mkdirSync(dir, { recursive: true });
    const body = [
      '---', 'database: TMUA', `qid: ${qid}`, `id: ${id}`, 'paper: TMUA P1',
      'year: 2020', 'number: Q1', 'section: Applications', 'difficulty: 0',
      'topics: [Algebra]',
      ...tagLines, '---', '',
      '## 题目', `Compute $1+1$. ![[Image/${figure}]]`, '',
      '$$\\mathbf {A} \\quad 1$$', '',
      '$$\\mathbf {B} \\quad 2$$', '',
      '$$\\mathbf {C} \\quad 3$$', '',
      '## 答案', 'B', '',
    ].join('\n');
    fs.writeFileSync(path.join(dir, name), body);
  };

  // 图片是真存在的：跳过的题不带图进产物，得是因为它整题没被读进来，
  // 不是因为源里根本没这张图
  const imageDir = path.join(bank, 'TMUA', 'Image');
  fs.mkdirSync(imageDir, { recursive: true });
  for (const n of ['dup.png', 'keep.png']) fs.writeFileSync(path.join(imageDir, n), 'png');

  // 行内列表与块状列表在题库里是并存的，两种写法都得认
  write('20-P1-Q1.md', 20200210100, '20-P1-Q1', ['tags: [重复题]'], 'dup.png');
  write('20-P1-Q2.md', 20200210200, '20-P1-Q2', ['tags:', '  - 重复题'], 'dup.png');
  write('20-P1-Q3.md', 20200210300, '20-P1-Q3', ['tags: [Discriminant]'], 'keep.png');

  const built = build(bank, out);

  const index = JSON.parse(fs.readFileSync(path.join(out, 'index.json'), 'utf8'));
  assert.deepEqual(index.map((entry) => entry.qid), [20200210300]);
  assert.equal(skippedCounts(built.stdout).duplicate, 2);

  // 「不入池」是整题不入：单题 JSON、知识点分母、图片，一样都不许留下
  assert.deepEqual(fs.readdirSync(path.join(out, 'q')), ['20200210300.json']);
  const topics = JSON.parse(fs.readFileSync(path.join(out, 'topics.json'), 'utf8'));
  assert.deepEqual(topics.coverage.TMUA, { tagged: 1, total: 1 });
  assert.deepEqual(topics.byTopic.Algebra, [20200210300]);
  assert.deepEqual(fs.readdirSync(path.join(out, 'img')), ['keep.png']);
});

test('an unrelated tag that merely starts with 重复题 is left alone', (t) => {
  // 精确匹配整个标签：「重复题目」「疑似重复题」都不是这道闸要拦的东西
  const bank = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-dup-near-bank-'));
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-dup-near-out-'));
  t.after(() => {
    fs.rmSync(bank, { recursive: true, force: true });
    fs.rmSync(out, { recursive: true, force: true });
  });

  const dir = path.join(bank, 'TMUA', '2020');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, '20-P1-Q1.md'),
    [
      '---', 'database: TMUA', 'qid: 20200210100', 'id: 20-P1-Q1', 'paper: TMUA P1',
      'year: 2020', 'number: Q1', 'section: Applications', 'difficulty: 0',
      'tags: [重复题目, 疑似重复题]', '---', '',
      '## 题目', 'Compute $1+1$.', '',
      '$$\\mathbf {A} \\quad 1$$', '',
      '$$\\mathbf {B} \\quad 2$$', '',
      '## 答案', 'B', '',
    ].join('\n'),
  );

  const built = build(bank, out);

  const index = JSON.parse(fs.readFileSync(path.join(out, 'index.json'), 'utf8'));
  assert.deepEqual(index.map((entry) => entry.qid), [20200210100]);
  assert.equal(skippedCounts(built.stdout).duplicate, 0);
});

test('at most the six original MAT Specimen questions are shipped', (t) => {
  // 真实产物的反向审计。Specimen 两卷共 32 题，其中 26 题打了 重复题，
  // 只有 6 题是这两套卷自己的——同步进来后站里就该只剩这 6 题
  const index = readExamIndex();
  const specimen = [];
  for (const entry of index) {
    if (entry.db !== 'MAT') continue;
    const q = readExamQuestion(entry.qid);
    if (/^Spec[12]-/.test(q.id)) specimen.push(q.id);
  }
  // 让位而不是静默通过：两卷还没同步进 data\ 时这条要在报告里看得见
  if (specimen.length === 0) {
    t.skip('MAT Specimen 尚未同步进 data，本条审计让位');
    return;
  }
  assert.ok(
    specimen.length <= 6,
    `MAT Specimen 只该留下 6 道原创题，现在有 ${specimen.length} 道：${specimen.join(', ')}`,
  );
});
