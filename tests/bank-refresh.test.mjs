import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data');
// 构建到临时目录（build-data 的 EXAM_OUT 通道），绝不碰共享的 public\exam：
// node --test 并发执行各测试文件，progress/diagnostic/gmat 都在读
// public\exam\index.json，这里若原地 rm -rf + 重建，撞上读窗口就偶发飘红。
const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-bank-refresh-'));

function walkMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name.toLowerCase() === 'image' ? [] : walkMarkdown(full);
    return entry.isFile() && entry.name.endsWith('.md') ? [full] : [];
  });
}

test('static bank separates refreshed TMUA Mock and keeps expanded pools behind 9.0 Trivial', (t) => {
  t.after(() => fs.rmSync(outputDir, { recursive: true, force: true }));

  execFileSync(process.execPath, [path.join(root, 'scripts', 'build-data.mjs')], {
    cwd: root,
    stdio: 'pipe',
    env: { ...process.env, EXAM_OUT: outputDir },
  });

  const index = JSON.parse(fs.readFileSync(path.join(outputDir, 'index.json'), 'utf8'));
  const counts = Object.groupBy(index, (entry) => entry.db);

  assert.equal(counts.TMUA?.length, 360);
  // Mock 已从 TMUA/Mock 提升为源里的独立顶层库，并扩充了 BeyondHorizon / Zetta 几套
  assert.equal(counts.TMUA_MOCK?.length, 439);
  assert.equal(counts.ECAA?.length, 123);
  assert.equal(counts.MAT?.length, 309);
  assert.equal(counts.SMC?.length, 674);
  assert.equal(counts.AMC?.length || 0, 0, 'AMC files without answers must not enter the gradeable index');

  const qids = new Set(index.map((entry) => entry.qid));
  assert.equal(qids.has(20132101202101), true, 'Zetta Mock P1 Q1 should be gradeable');
  assert.equal(qids.has(20132101205101), true, 'JZMaths Set A Mock P1 Q1 should be gradeable');
  assert.equal(qids.has(90010210100), true, 'current Specimen P1 Q1 qid should exist');
  assert.equal(qids.has(20132101100101), false, 'obsolete Specimen P1 Q1 qid should be gone');
  assert.equal(qids.has(20160602300), true, 'current ECAA 2016 Q23 qid should be gradeable');
  assert.equal(qids.has(62016023), false, 'obsolete ECAA 2016 Q23 qid should be gone');

  // 源里的层级变了，但「哪些题算 mock」认的是题目自己写的 paper，
  // 不是目录怎么摆——新增的两套也得落进扩展池
  assert.equal(qids.has(20132101211101), true, 'BeyondHorizon S1 Mock P1 Q1 should be gradeable');
  assert.equal(index.find((entry) => entry.qid === 20132101211101)?.db, 'TMUA_MOCK');

  const hidden = index.filter((entry) => entry.hidden);
  assert.equal(hidden.length, 538);
  assert.equal(hidden.filter((entry) => entry.db === 'TMUA_MOCK').length, 439);
  assert.equal(hidden.filter((entry) => entry.db === 'MAT').length, 99);
  assert.equal(hidden.some((entry) => entry.db === 'TMUA' || entry.db === 'SMC' || entry.db === 'ECAA'), false);
  assert.equal(index.find((entry) => entry.qid === 20132101202101)?.hidden, true);
  assert.equal(index.find((entry) => entry.qid === 20132101202101)?.db, 'TMUA_MOCK');
  assert.equal(index.find((entry) => entry.qid === 90010210100)?.hidden, undefined);
  assert.equal(index.find((entry) => entry.qid === 20060300101)?.hidden, true);
  assert.equal(index.find((entry) => entry.qid === 20070300101)?.hidden, undefined);
});

test('AMC source is synchronized even while its unanswered questions remain ungradeable', () => {
  const files = walkMarkdown(path.join(dataDir, 'AMC')).filter((file) => path.basename(file) !== 'Readme.md');
  assert.equal(files.length, 18);
  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    assert.match(raw, /^database: AMC$/m, path.relative(root, file));
    assert.match(raw, /^section: Multiple Choice$/m, path.relative(root, file));
    assert.match(raw, /^## 答案\s*$/m, path.relative(root, file));
  }
});

// 题库侧把 ECAA 的 section 统一改成了 Advanced Mathematics。
// 这个字段只是题库自己的分类，build-data 不拿它过滤（它读的是正文的
// ## 题目 / ## 答案），所以改名不影响产物，这里跟着新约定断言即可。
test('ECAA questions use the Advanced Mathematics section', () => {
  const files = walkMarkdown(path.join(dataDir, 'ECAA'));
  assert.equal(files.length, 123);
  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    assert.match(raw, /^section: Advanced Mathematics$/m, path.relative(root, file));
  }
});

test('a long prose distractor is not mistaken for a swallowed stem', (t) => {
  // 「cannot be determined from the given information」这类整句干扰项天生比旁边的
  // 数值选项长得多，那是题目本来的样子。质量闸曾把它当成「吞了题干」拦下来，
  // 两道好题因此进不了题库——光看长度比不足以定罪，得看有没有题干的痕迹
  const bank = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-prose-bank-'));
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-prose-out-'));
  t.after(() => {
    fs.rmSync(bank, { recursive: true, force: true });
    fs.rmSync(out, { recursive: true, force: true });
  });

  const proseOptions = [
    '$$\\mathbf{A} \\quad x=4$$',
    '',
    '$$\\mathbf{B} \\quad x=6$$',
    '',
    '$$\\mathbf{C} \\quad x=8$$',
    '',
    '$$\\mathbf{D} \\quad x \\text{ cannot be determined from the given information.}$$',
  ].join('\n');
  const swallowedOptions = [
    '$$\\mathbf{A} \\quad \\text{ and y = 2x + 1. What is the value of p+8q? A 6}$$',
    '',
    '$$\\mathbf{B} \\quad 7$$',
    '',
    '$$\\mathbf{C} \\quad 8$$',
    '',
    '$$\\mathbf{D} \\quad 9$$',
  ].join('\n');

  const write = (name, qid, id, options, answer) => {
    const dir = path.join(bank, 'TMUA', '2020');
    fs.mkdirSync(dir, { recursive: true });
    const body = [
      '---',
      'database: TMUA',
      `qid: ${qid}`,
      `id: ${id}`,
      'paper: TMUA P1',
      'year: 2020',
      'number: Q1',
      'section: Applications',
      'difficulty: 0',
      '---',
      '',
      '## 题目',
      'Given the constraints below, determine x.',
      '',
      options,
      '',
      '## 答案',
      answer,
      '',
    ].join('\n');
    fs.writeFileSync(path.join(dir, name), body);
  };

  write('20-P1-Q1.md', 20200210100, '20-P1-Q1', proseOptions, 'D');
  write('20-P1-Q2.md', 20200210200, '20-P1-Q2', swallowedOptions, 'A');

  execFileSync(process.execPath, [path.join(root, 'scripts', 'build-data.mjs')], {
    cwd: root,
    stdio: 'pipe',
    env: { ...process.env, EXAM_OUT: out, BANK_PATH: bank },
  });

  const index = JSON.parse(fs.readFileSync(path.join(out, 'index.json'), 'utf8'));
  const corrupted = JSON.parse(fs.readFileSync(path.join(out, 'corrupted.json'), 'utf8'));
  const qids = new Set(index.map((entry) => entry.qid));

  assert.equal(qids.has(20200210100), true, '整句干扰项是正常题目，不该被拦下');
  assert.equal(
    corrupted.some((row) => row.id === '20-P1-Q1'),
    false,
    '整句干扰项不该进损坏名单',
  );

  // 反面：真把题干吞进选项的（问号 + 自己的标号和取值）仍要拦住，
  // 否则这次放宽就等于把质量闸拆了
  assert.equal(qids.has(20200210200), false, '吞了题干的题必须仍被拦下');
  assert.equal(
    corrupted.some((row) => row.id === '20-P1-Q2'),
    true,
    '吞了题干的题要记进损坏名单',
  );
});
