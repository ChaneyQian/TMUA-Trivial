// GMAT 诊断集的数据层验收。
//
// CI 上没有 vault，转换器（scripts\convert-gmat.mjs）跑不了，所以这里全部对着
// 入库产物 data\GMAT 断言，基准答案序列硬编码在本文件里——源库交接说明记载
// algebra-ps 曾有 24 题 OA 手工誊写错位，答案序列必须有一份独立于转换器的副本。

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gmatDir = path.join(root, 'data', 'GMAT');

// 自己建一份产物：node --test 并行跑测试文件，跟 bank-refresh 抢 public\exam 会串味
const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-exam-gmat-'));
let built = false;
function build() {
  if (built) return;
  execFileSync(process.execPath, [path.join(root, 'scripts', 'build-data.mjs')], {
    cwd: root,
    stdio: 'pipe',
    env: { ...process.env, EXAM_OUT: outputDir },
  });
  built = true;
}
process.on('exit', () => fs.rmSync(outputDir, { recursive: true, force: true }));

// 两条 DS 基准来自题库交接说明（源页 spoiler / `OA:` / 解析 `Answer:` 三方核对过）；
// 两条 PS 基准来自源文件 `OA:` 与解析 `Answer:` 的交叉验证。
const SETS = [
  { slug: 'algebra-ps', prefix: 'ALG-PS', count: 40, p: 1, section: 'Problem Solving', oa: 'DAABDDBEDACDBAEBEDBBDECECADEDBDDABEBCEED' },
  { slug: 'algebra-ds', prefix: 'ALG-DS', count: 40, p: 2, section: 'Data Sufficiency', oa: 'BCABACDCECDDCCCBCDECBABCCCCAADDECBCCDADA' },
  { slug: 'word-problems-ps', prefix: 'WORD-PS', count: 18, p: 3, section: 'Problem Solving', oa: 'BBCCDDBBAAEDADCBDB' },
  { slug: 'word-problems-ds', prefix: 'WORD-DS', count: 15, p: 4, section: 'Data Sufficiency', oa: 'BDAAABDEAAEABBC' },
];
const TOTAL = SETS.reduce((n, s) => n + s.count, 0);

function walkMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name.toLowerCase() === 'image' ? [] : walkMarkdown(full);
    return entry.isFile() && entry.name.endsWith('.md') ? [full] : [];
  });
}

function field(raw, key) {
  return raw.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))?.[1]?.trim() ?? null;
}

test('GMAT diagnostic sets carry 113 questions split 40/40/18/15', () => {
  const files = walkMarkdown(gmatDir);
  assert.equal(files.length, TOTAL);
  assert.equal(files.filter((f) => /^qid:\s*\S/m.test(fs.readFileSync(f, 'utf8'))).length, TOTAL);

  for (const set of SETS) {
    const dir = path.join(gmatDir, set.slug);
    const names = fs.readdirSync(dir).filter((n) => n.endsWith('.md'));
    assert.equal(names.length, set.count, set.slug);
    const want = Array.from({ length: set.count }, (_, k) => `${set.prefix}-Q${k + 1}.md`).sort();
    assert.deepEqual([...names].sort(), want, `${set.slug} 的文件名应覆盖 Q1–Q${set.count}`);
  }
});

test('GMAT question files follow the shared frontmatter and section layout', () => {
  for (const set of SETS) {
    for (let n = 1; n <= set.count; n++) {
      const file = path.join(gmatDir, set.slug, `${set.prefix}-Q${n}.md`);
      const raw = fs.readFileSync(file, 'utf8');
      const where = path.relative(root, file);

      assert.equal(field(raw, 'database'), 'GMAT', where);
      assert.equal(field(raw, 'id'), `${set.prefix}-Q${n}`, where);
      assert.equal(field(raw, 'number'), `Q${n}`, where);
      assert.equal(field(raw, 'section'), set.section, where);
      assert.equal(field(raw, 'year'), '0', `${where}：无年份卷约定 year=0`);

      // qid = 9002(无年份保留段) 07(GMAT) P(套卷) QQ(题号) 00(无子题)
      const qid = field(raw, 'qid');
      assert.equal(qid, `900207${set.p}${String(n).padStart(2, '0')}00`, where);
      assert.equal(qid.length, 11, where);
      assert.notEqual(qid[0], '0', `${where}：qid 首位不得为 0`);

      for (const section of ['## 题目', '## 答案', '## 解析']) {
        assert.ok(raw.includes(`\n${section}\n`), `${where} 缺少 ${section}`);
      }
      // 五个选项一律 TMUA 的 $$\mathbf{X} \quad …$$ 块
      const labels = [...raw.matchAll(/^\\mathbf\{([A-E])\} \\quad /gm)].map((m) => m[1]);
      assert.deepEqual(labels, ['A', 'B', 'C', 'D', 'E'], `${where} 的选项块`);
    }
  }
});

test('GMAT answer sequences match the recorded baselines', () => {
  for (const set of SETS) {
    const got = Array.from({ length: set.count }, (_, k) => {
      const raw = fs.readFileSync(path.join(gmatDir, set.slug, `${set.prefix}-Q${k + 1}.md`), 'utf8');
      return raw.match(/^## 答案\s*\n([A-E])\s*$/m)?.[1] ?? '?';
    }).join('');
    assert.equal(got, set.oa, `${set.slug} 的答案序列与基准不符`);
  }

  // 交接说明记载 Q30 的源 OA 有争议，明确要求保留 D
  const q30 = fs.readFileSync(path.join(gmatDir, 'algebra-ds', 'ALG-DS-Q30.md'), 'utf8');
  assert.match(q30, /^## 答案\s*\nD\s*$/m, 'algebra-ds Q30 必须保留源 OA D');
});

test('GMAT qids collide with nothing else in the bank', () => {
  const seen = new Map();
  for (const file of walkMarkdown(path.join(root, 'data'))) {
    const qid = field(fs.readFileSync(file, 'utf8'), 'qid');
    if (!qid) continue;
    assert.equal(seen.has(qid), false, `qid 重复 ${qid}：${seen.get(qid)} / ${path.relative(root, file)}`);
    seen.set(qid, path.relative(root, file));
  }
  assert.equal([...seen.keys()].filter((q) => q.startsWith('900207')).length, TOTAL);
});

test('every GMAT question reaches the gradeable index flagged as diag', () => {
  build();

  const index = JSON.parse(fs.readFileSync(path.join(outputDir, 'index.json'), 'utf8'));
  const gmat = index.filter((entry) => entry.db === 'GMAT');

  assert.equal(gmat.length, TOTAL, 'GMAT 113 题必须全部可判分');
  assert.equal(gmat.every((entry) => entry.diag === true), true, 'GMAT 条目必须带 diag');
  assert.equal(index.filter((entry) => entry.diag && entry.db !== 'GMAT').length, 0, '只有 GMAT 是诊断集');
  assert.equal(gmat.some((entry) => entry.hidden), false, 'diag 与 hidden 是两回事，GMAT 不加 hidden');

  // 损坏拦截清单里不许出现 GMAT
  const corruptedPath = path.join(outputDir, 'corrupted.json');
  if (fs.existsSync(corruptedPath)) {
    const corrupted = JSON.parse(fs.readFileSync(corruptedPath, 'utf8'));
    assert.equal(corrupted.filter((c) => c.db === 'GMAT').length, 0, JSON.stringify(corrupted.filter((c) => c.db === 'GMAT')));
  }

  for (const set of SETS) {
    for (let n = 1; n <= set.count; n++) {
      const qid = Number(`900207${set.p}${String(n).padStart(2, '0')}00`);
      const q = JSON.parse(fs.readFileSync(path.join(outputDir, 'q', `${qid}.json`), 'utf8'));
      assert.equal(q.database, 'GMAT');
      assert.equal(q.optionsInline, false, `${q.id} 的选项应被解析出来，不该退化成内联`);
      assert.deepEqual(q.choices.map((c) => c.label), ['A', 'B', 'C', 'D', 'E'], q.id);
      assert.equal(q.choices.every((c) => c.text.trim().length > 2), true, `${q.id} 有空选项`);
      assert.equal(q.answer, set.oa[n - 1], q.id);
      assert.ok(q.choices.some((c) => c.label === q.answer), `${q.id} 的答案对不上任何选项`);
      assert.ok(q.statement.trim().length > 0, `${q.id} 题面为空`);
      assert.equal((q.statement.match(/\$\$/g) || []).length % 2, 0, `${q.id} 题面有未闭合的 $$`);
    }
  }
});

test('GMAT solution images are in the bank and reach the build output', () => {
  build();
  const referenced = new Set();
  for (const file of walkMarkdown(gmatDir)) {
    const raw = fs.readFileSync(file, 'utf8');
    for (const m of raw.matchAll(/!\[[^\]]*\]\(Image\/([^)]+)\)/g)) referenced.add(m[1].trim());
  }
  assert.equal(referenced.size, 7, '交接说明记载 word-problems-ds 的解析依赖 7 张图');
  for (const name of referenced) {
    assert.ok(fs.existsSync(path.join(gmatDir, 'Image', name)), `data\\GMAT\\Image 缺 ${name}`);
    assert.ok(fs.existsSync(path.join(outputDir, 'img', name)), `public\\exam\\img 缺 ${name}`);
  }
});
