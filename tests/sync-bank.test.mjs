import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('sync leaves the sync client’s leftovers in the vault', (t) => {
  // 源库在坚果云上，断点续传会留下
  // `19-Q27.md.nutstore-sync-1788077928880-r808r9fd0eh.download` 这种半成品。
  // 它不以 .md 结尾，「有没有 qid」那道闸拦不住，会被当成资源原样镜像进 data\
  const src = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-sync-src-'));
  const dst = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-sync-dst-'));
  t.after(() => {
    fs.rmSync(src, { recursive: true, force: true });
    fs.rmSync(dst, { recursive: true, force: true });
  });

  const srcDir = path.join(src, 'TMUA', '2020');
  fs.mkdirSync(srcDir, { recursive: true });
  fs.writeFileSync(
    path.join(srcDir, '20-P1-Q1.md'),
    ['---', 'database: TMUA', 'qid: 20200210100', 'id: 20-P1-Q1', '---', '', '## 题目', '略', ''].join('\n'),
  );
  fs.writeFileSync(path.join(srcDir, '20-P1-Q2.md.nutstore-sync-1788077928880-r808r9fd0eh.download'), 'half a file');
  fs.writeFileSync(path.join(srcDir, '.DS_Store'), 'junk');

  // 反面：名字里带 ~ / .tmp 但不在结尾的图，是题面真要引用的资源，一张都不能误杀
  const imageDir = path.join(src, 'TMUA', 'Image');
  fs.mkdirSync(imageDir, { recursive: true });
  fs.writeFileSync(path.join(imageDir, 'fig~1.png'), 'png');
  fs.writeFileSync(path.join(imageDir, 'fig.tmp.png'), 'png');

  // 上一轮已经镜像进来的残留：源侧不存在这个文件，按镜像语义该删掉
  const dstDir = path.join(dst, 'TMUA', '2020');
  fs.mkdirSync(dstDir, { recursive: true });
  fs.writeFileSync(path.join(dstDir, '19-Q27.md.nutstore-sync-1788077928880-r808r9fd0eh.download'), 'stale');

  const log = execFileSync(process.execPath, [path.join(root, 'scripts', 'sync-bank.mjs')], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, BANK_SRC: src, DATA_OUT: dst },
  });

  assert.deepEqual(fs.readdirSync(dstDir), ['20-P1-Q1.md']);
  assert.deepEqual(fs.readdirSync(path.join(dst, 'TMUA', 'Image')).sort(), ['fig.tmp.png', 'fig~1.png']);
  assert.match(log, /2 个残留文件/);
});
