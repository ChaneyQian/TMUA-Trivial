import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data');
const outputDir = path.join(root, 'public', 'exam');

function walkMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name.toLowerCase() === 'image' ? [] : walkMarkdown(full);
    return entry.isFile() && entry.name.endsWith('.md') ? [full] : [];
  });
}

test('static bank separates refreshed TMUA Mock and keeps expanded pools behind 9.0 Trivial', () => {
  execFileSync(process.execPath, [path.join(root, 'scripts', 'build-data.mjs')], {
    cwd: root,
    stdio: 'pipe',
  });

  const index = JSON.parse(fs.readFileSync(path.join(outputDir, 'index.json'), 'utf8'));
  const counts = Object.groupBy(index, (entry) => entry.db);

  assert.equal(counts.TMUA?.length, 360);
  assert.equal(counts.TMUA_MOCK?.length, 240);
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

  const hidden = index.filter((entry) => entry.hidden);
  assert.equal(hidden.length, 339);
  assert.equal(hidden.filter((entry) => entry.db === 'TMUA_MOCK').length, 240);
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

test('ECAA questions use the Multiple Choice section', () => {
  const files = walkMarkdown(path.join(dataDir, 'ECAA'));
  assert.equal(files.length, 123);
  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    assert.match(raw, /^section: Multiple Choice$/m, path.relative(root, file));
  }
});
