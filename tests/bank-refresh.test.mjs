import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { readExamIndex, readExamQuestion } from './helpers/exam-data.mjs';

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

  // 360 道真题 + 2024/2025 回忆题 75 道（回忆题落 hidden）
  assert.equal(counts.TMUA?.length, 441);
  // Mock 已从 TMUA/Mock 提升为源里的独立顶层库，并扩充了 BeyondHorizon / Zetta 几套
  assert.equal(counts.TMUA_MOCK?.length, 1281);
  assert.equal(counts.ECAA?.length, 123);
  // MAT 2024（24 题）/ 2025（20 题）回忆题入池后 309 → 353，两卷都归扩展池
  assert.equal(counts.MAT?.length, 357);
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
  assert.equal(hidden.length, 1505);
  assert.equal(hidden.filter((entry) => entry.db === 'TMUA_MOCK').length, 1281);
  // 1996–2006 的 99 道 + 2024/2025 回忆题的 44 道
  assert.equal(hidden.filter((entry) => entry.db === 'MAT').length, 143);
  // TMUA 自 24/25 回忆题起也有 hidden 卷了；仍无 hidden 的只剩 SMC / ECAA
  assert.equal(hidden.filter((entry) => entry.db === 'TMUA').length, 81);
  assert.equal(hidden.some((entry) => entry.db === 'SMC' || entry.db === 'ECAA'), false);
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
  // 句子里夹着一小段公式的干扰项（TMUA Mock Sed P2 Q17 的选项 G）：去掉 \text 后
  // 还剩个 f(x)，光看「剩余 ≤ 3 字符」会把它当成吞了题干
  const mixedOptions = [
    '$$\\mathbf{A} \\quad 1$$',
    '',
    '$$\\mathbf{B} \\quad 2$$',
    '',
    '$$\\mathbf{C} \\quad 3$$',
    '',
    '$$\\mathbf{D} \\quad \\text{no number of such pairs guarantees the deduction of} f(x) \\text{.}$$',
  ].join('\n');
  write('20-P1-Q3.md', 20200210300, '20-P1-Q3', mixedOptions, 'D');

  execFileSync(process.execPath, [path.join(root, 'scripts', 'build-data.mjs')], {
    cwd: root,
    stdio: 'pipe',
    // 合成题库只有两道题，可判分底线（默认 1000）要关掉——这里测的是解析行为
    env: { ...process.env, EXAM_OUT: out, BANK_PATH: bank, MIN_GRADEABLE: '0' },
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

  assert.equal(qids.has(20200210300), true, '句中夹公式的整句干扰项也是正常题目');
  assert.equal(
    corrupted.some((row) => row.id === '20-P1-Q3'),
    false,
    '句中夹公式的干扰项不该进损坏名单',
  );
});

test('nine-option questions are supported, and a roman label is not mistaken for the letter I', (t) => {
  // TMUA Mock 里有一道 9 选项的题（选项值 0–8，答案 I）。
  // 选项标号扰到 I 后，单个 "i" 就同时像字母 I 和 MAT 老卷的罗马标号——
  // 答案的体例必须以选项自己的标号为准，不能在解析答案时靠猜
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-nine-out-'));
  t.after(() => fs.rmSync(out, { recursive: true, force: true }));
  execFileSync(process.execPath, [path.join(root, 'scripts', 'build-data.mjs')], {
    cwd: root,
    stdio: 'pipe',
    env: { ...process.env, EXAM_OUT: out },
  });
  const index = JSON.parse(fs.readFileSync(path.join(out, 'index.json'), 'utf8'));

  const read = (qid) => JSON.parse(fs.readFileSync(path.join(out, 'q', `${qid}.json`), 'utf8'));

  // 正：9 选项的题进了题库，标号一个不少
  const nine = index
    .map((entry) => read(entry.qid))
    .find((q) => q.id === 'BeyondHorizonS4-Mock-P1-Q7');
  assert.ok(nine, '9 选项的题应当能判分入库');
  assert.equal(nine.choices.length, 9);
  assert.deepEqual(
    nine.choices.map((c) => c.label),
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
  );
  assert.equal(nine.answer, 'I');

  // 反：全库的答案都要严格等于某个选项标号（大小写也要一致），
  // MAT 老卷的罗马标号题不能因此被写成大写 I
  const mismatched = [];
  let romanOne = 0;
  for (const entry of index) {
    const q = read(entry.qid);
    const labels = q.choices.map((c) => c.label);
    if (!labels.includes(q.answer)) mismatched.push(q.id);
    if (q.answer === 'i') romanOne++;
  }
  assert.deepEqual(mismatched, [], '这些题的答案对不上自己的选项标号');
  assert.ok(romanOne > 0, 'MAT 老卷里确实有答案为罗马 i 的题，这条守卫才有负载');
});

test('questions flagged TODO(...) stay off the site until proofread', (t) => {
  // 回忆卷里题干或选项存疑的题，正文里留着 TODO(待校对): 标记。
  // 用户裁定（2026-08-23）：这类题校对完前不上站——删掉标记即自动上架
  const bank = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-todo-bank-'));
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-todo-out-'));
  t.after(() => {
    fs.rmSync(bank, { recursive: true, force: true });
    fs.rmSync(out, { recursive: true, force: true });
  });

  const write = (name, qid, id, extra) => {
    const dir = path.join(bank, 'TMUA', '2020');
    fs.mkdirSync(dir, { recursive: true });
    const body = [
      '---', 'database: TMUA', `qid: ${qid}`, `id: ${id}`, 'paper: TMUA P1',
      'year: 2020', 'number: Q1', 'section: Applications', 'difficulty: 0', '---', '',
      '## 题目', 'Compute $1+1$.', '',
      '$$\\\\mathbf {A} \\\\quad 1$$', '',
      '$$\\\\mathbf {B} \\\\quad 2$$', '',
      '$$\\\\mathbf {C} \\\\quad 3$$', '',
      '## 答案', 'B', '',
      ...extra,
    ].join('\n');
    fs.writeFileSync(path.join(dir, name), body);
  };

  write('20-P1-Q1.md', 20200210100, '20-P1-Q1', ['## 解析', 'TODO(待校对): 选项存疑。']);
  write('20-P1-Q2.md', 20200210200, '20-P1-Q2', ['## 解析', '正常解析，提到 TODO 这个英文词但不带括号。']);

  const built = execFileSync(process.execPath, [path.join(root, 'scripts', 'build-data.mjs')], {
    cwd: root,
    encoding: 'utf8',
    // 合成题库题量远低于可判分底线，这里关掉它（见 build-data 的 MIN_GRADEABLE）
    env: { ...process.env, EXAM_OUT: out, BANK_PATH: bank, MIN_GRADEABLE: '0' },
  });

  const index = JSON.parse(fs.readFileSync(path.join(out, 'index.json'), 'utf8'));
  const qids = new Set(index.map((entry) => entry.qid));
  assert.equal(qids.has(20200210100), false, '带 TODO(…) 标记的题必须被拦下');
  assert.equal(qids.has(20200210200), true, '裸词 TODO 不带括号不该误伤');
})

test('no TODO-flagged question is in the shipped index', () => {
  // 真实题库的反向审计：在池的题里一道都不许带 TODO( 标记
  const index = readExamIndex();
  const flagged = [];
  for (const entry of index) {
    const q = readExamQuestion(entry.qid);
    if (`${q.statement}${q.solution}`.includes('TODO(')) flagged.push(q.id);
  }
  assert.deepEqual(flagged, [], '这些待校对的题漏进了站里');
})

test('an empty bank fails the build instead of quietly shipping an empty site', (t) => {
  // 题库目录配错、sync 没跑完、源盘没挂上——这几件事产出的都是「结构完好但空」
  // 的站点，构建成功、部署成功、没有任何信号。理智底线就是拦这一类灾难
  const bank = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-floor-bank-'));
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-floor-out-'));
  t.after(() => {
    fs.rmSync(bank, { recursive: true, force: true });
    fs.rmSync(out, { recursive: true, force: true });
  });
  // 目录在、题一道没有：BANK 不存在那条路早就硬失败了，这里测的是另一种空
  fs.mkdirSync(path.join(bank, 'TMUA', '2020'), { recursive: true });

  const empty = spawnSync(process.execPath, [path.join(root, 'scripts', 'build-data.mjs')], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, EXAM_OUT: out, BANK_PATH: bank },
  });
  assert.notEqual(empty.status, 0, '空题库必须让构建非零退出');
  assert.match(empty.stderr, /可判分题目只有 0 道/);

  // 空索引不认 MIN_GRADEABLE 的豁免：一道题都判不了的站点没有任何场景需要它
  const forced = spawnSync(process.execPath, [path.join(root, 'scripts', 'build-data.mjs')], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, EXAM_OUT: out, BANK_PATH: bank, MIN_GRADEABLE: '0' },
  });
  assert.notEqual(forced.status, 0, 'MIN_GRADEABLE=0 也不该放空索引过关');

  // 有题但远低于底线，同样拦下——默认底线是 1000，不是 1
  fs.writeFileSync(
    path.join(bank, 'TMUA', '2020', '20-P1-Q1.md'),
    [
      '---', 'database: TMUA', 'qid: 20200210100', 'id: 20-P1-Q1', 'paper: TMUA P1',
      'year: 2020', 'number: Q1', 'section: Applications', 'difficulty: 0', '---', '',
      '## 题目', 'Compute $1+1$.', '',
      '$$\\mathbf {A} \\quad 1$$', '',
      '$$\\mathbf {B} \\quad 2$$', '',
      '## 答案', 'B', '',
    ].join('\n'),
  );
  const thin = spawnSync(process.execPath, [path.join(root, 'scripts', 'build-data.mjs')], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, EXAM_OUT: out, BANK_PATH: bank },
  });
  assert.notEqual(thin.status, 0, '一道题的题库同样低于底线');
  assert.match(thin.stderr, /低于底线 1000/);

  // 同一个题库放开底线就该通过：这道闸只管「产物是不是空的」，
  // 不掺别的判据（尤其不因 corrupted > 0 失败——有缺陷的题就是要静默 hid 掉）
  const allowed = spawnSync(process.execPath, [path.join(root, 'scripts', 'build-data.mjs')], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, EXAM_OUT: out, BANK_PATH: bank, MIN_GRADEABLE: '0' },
  });
  assert.equal(allowed.status, 0, `放开底线后不该再失败：\n${allowed.stderr}`);
  // 读不出来的文件进计数、进日志，不再是一句裸 continue
  assert.match(allowed.stdout, /跳过：.*"unreadable":0/);
})
