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

test('static bank includes refreshed TMUA and ECAA pools', () => {
  execFileSync(process.execPath, [path.join(root, 'scripts', 'build-data.mjs')], {
    cwd: root,
    stdio: 'pipe',
  });

  const index = JSON.parse(fs.readFileSync(path.join(outputDir, 'index.json'), 'utf8'));
  const counts = Object.groupBy(index, (entry) => entry.db);

  assert.equal(counts.TMUA?.length, 400);
  assert.equal(counts.ECAA?.length, 123);

  const qids = new Set(index.map((entry) => entry.qid));
  assert.equal(qids.has(20132101202101), true, 'Zetta Mock P1 Q1 should be gradeable');
  assert.equal(qids.has(20132101100101), true, 'refreshed Specimen P1 Q1 qid should exist');
  assert.equal(qids.has(20150210100), false, 'obsolete Specimen P1 Q1 qid should be gone');
  assert.equal(qids.has(62016023), true, 'ECAA 2016 Q23 should be gradeable');
});

test('ECAA questions use the Multiple Choice section', () => {
  const files = walkMarkdown(path.join(dataDir, 'ECAA'));
  assert.equal(files.length, 123);
  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    assert.match(raw, /^section: Multiple Choice$/m, path.relative(root, file));
  }
});
