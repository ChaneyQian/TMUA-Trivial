import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('the skip tally is broken down by paper directory', (t) => {
  // 「跳过：{badAnswer: 224}」说明不了任何事：这 224 题摊在哪几套卷上，
  // 刷新题库时得当场看见，否则没法挑出该去补答案的那一卷
  const bank = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-skipdir-bank-'));
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-skipdir-out-'));
  t.after(() => {
    fs.rmSync(bank, { recursive: true, force: true });
    fs.rmSync(out, { recursive: true, force: true });
  });

  const write = (parts, qid, id, tail) => {
    const dir = path.join(bank, ...parts);
    fs.mkdirSync(dir, { recursive: true });
    const body = [
      '---', 'database: TMUA', `qid: ${qid}`, `id: ${id}`, 'paper: TMUA P1',
      'year: 2020', 'number: Q1', 'section: Applications', 'difficulty: 0', '---', '',
      '## 题目', 'Compute $1+1$.', '',
      '$$\\mathbf {A} \\quad 1$$', '',
      '$$\\mathbf {B} \\quad 2$$', '',
      ...tail,
    ].join('\n');
    fs.writeFileSync(path.join(dir, `${id}.md`), body);
  };

  // 三个目录各有缺答案的题，外加一道好题——索引为空的话构建会先在底线那儿失败。
  // ThrivingScholars 故意多一道，用来压排序
  write(['TMUA', '2024'], 20240210100, '24-P1-Q1', []);
  write(['TMUA Mock', 'ThrivingScholars'], 20132101299101, 'TS-Mock-P1-Q1', []);
  write(['TMUA Mock', 'ThrivingScholars'], 20132101299201, 'TS-Mock-P1-Q2', []);
  write(['ECAA', '2019'], 20190610100, '19-Q1', []);
  write(['TMUA', '2020'], 20200210100, '20-P1-Q1', ['## 答案', 'B', '']);

  const built = execFileSync(process.execPath, [path.join(root, 'scripts', 'build-data.mjs')], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, EXAM_OUT: out, BANK_PATH: bank, MIN_GRADEABLE: '0' },
  });

  assert.match(built, /\[build-data\] {3}TMUA\/2024\s+badAnswer 1/);
  assert.match(built, /\[build-data\] {3}TMUA Mock\/ThrivingScholars\s+badAnswer 2/);
  assert.match(built, /\[build-data\] {3}ECAA\/2019\s+badAnswer 1/);
  // 一道题都没跳过的目录不占行
  assert.doesNotMatch(built, /\[build-data\] {3}TMUA\/2020\s/);

  // 跳得最多的排最前：这份表就是拿来挑「先去补哪一卷」的，顺序本身是它的用处。
  // 同数的两个目录按目录名排，免得输出随遍历顺序飘
  const rows = built
    .split('\n')
    .filter((line) => /^\[build-data\] {3}\S/.test(line))
    .map((line) => line.replace(/^\[build-data\] {3}/, '').replace(/\s\s+/, '|'));
  assert.deepEqual(rows, [
    'TMUA Mock/ThrivingScholars|badAnswer 2',
    'ECAA/2019|badAnswer 1',
    'TMUA/2024|badAnswer 1',
  ]);
});
