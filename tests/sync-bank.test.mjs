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

test('TMUA Addition syncs two subdirectories and only the images they use', (t) => {
  // Addition 底下摆着好几批来源各异的题，用户裁定只启用 SMT Skills 与 野题；
  // Clarkson、Euclid Modification 等一律不碰。Image 里装的是**所有**子目录的图，
  // 整目录拷过去等于把没启用的那几批题的图也发出去
  const src = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-add-src-'));
  const dst = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-add-dst-'));
  t.after(() => {
    fs.rmSync(src, { recursive: true, force: true });
    fs.rmSync(dst, { recursive: true, force: true });
  });

  const write = (parts, name, lines) => {
    const dir = path.join(src, ...parts);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, name), lines.join('\n'));
  };

  write(['TMUA Addition', 'SMT Skills'], 'a.md', [
    '---', 'database: TMUA', 'qid: 90020210300', 'id: SMT-Ch3-Q3', '---', '',
    '## 题目', 'See ![[Image/x.png|400]].', '',
  ]);
  write(['TMUA Addition', '野题'], 'b.md', [
    '---', 'database: TMUA', 'qid: 99000200100', 'id: Wild-Q01', '---', '',
    '## 题目', '略', '',
  ]);
  write(['TMUA Addition', 'Clarkson'], 'c.md', [
    '---', 'database: TMUA', 'qid: 90030100100', 'id: Clark-Q1', '---', '',
    '## 题目', '略', '',
  ]);
  const imageDir = path.join(src, 'TMUA Addition', 'Image');
  fs.mkdirSync(imageDir, { recursive: true });
  fs.writeFileSync(path.join(imageDir, 'x.png'), 'png');
  fs.writeFileSync(path.join(imageDir, 'unused.png'), 'png');

  // BANKS 里的库一个都不在源里，只剩 Addition 这条新路要走
  execFileSync(process.execPath, [path.join(root, 'scripts', 'sync-bank.mjs')], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, BANK_SRC: src, DATA_OUT: dst },
  });

  const addition = path.join(dst, 'TMUA Addition');
  assert.deepEqual(fs.readdirSync(addition).sort(), ['Image', 'SMT Skills', '野题'].sort());
  assert.deepEqual(fs.readdirSync(path.join(addition, 'SMT Skills')), ['a.md']);
  assert.deepEqual(fs.readdirSync(path.join(addition, '野题')), ['b.md']);
  // 没启用的子目录：一个文件都不该镜像过来
  assert.equal(fs.existsSync(path.join(addition, 'Clarkson')), false);
  // 被引用的图进来，没被引用的留在源里
  assert.deepEqual(fs.readdirSync(path.join(addition, 'Image')), ['x.png']);
});

test('an image that stops being referenced is swept out of data', (t) => {
  // 白名单缩小时目标侧得跟着缩：上一轮被引用、这一轮不再被引用的图
  // 按既有镜像删除逻辑清掉，否则 data\ 只增不减
  const src = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-add2-src-'));
  const dst = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-add2-dst-'));
  t.after(() => {
    fs.rmSync(src, { recursive: true, force: true });
    fs.rmSync(dst, { recursive: true, force: true });
  });

  const questionDir = path.join(src, 'TMUA Addition', 'SMT Skills');
  fs.mkdirSync(questionDir, { recursive: true });
  fs.writeFileSync(
    path.join(questionDir, 'a.md'),
    ['---', 'database: TMUA', 'qid: 90020210300', 'id: SMT-Ch3-Q3', '---', '', '## 题目', 'See ![[Image/x.png]].', ''].join('\n'),
  );
  const imageDir = path.join(src, 'TMUA Addition', 'Image');
  fs.mkdirSync(imageDir, { recursive: true });
  for (const n of ['x.png', 'stale.png']) fs.writeFileSync(path.join(imageDir, n), 'png');

  // 上一轮留下的：源里图还在，但已经没有题引用它了
  const dstImage = path.join(dst, 'TMUA Addition', 'Image');
  fs.mkdirSync(dstImage, { recursive: true });
  fs.writeFileSync(path.join(dstImage, 'stale.png'), 'png');

  execFileSync(process.execPath, [path.join(root, 'scripts', 'sync-bank.mjs')], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, BANK_SRC: src, DATA_OUT: dst },
  });

  assert.deepEqual(fs.readdirSync(dstImage), ['x.png']);
});
