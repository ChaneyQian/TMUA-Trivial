// 从题库源（Obsidian vault）全量同步到 data\。
//
// 题库那边除了题目本身，还放着给自己看的工作笔记（Readme、讲义、对接说明…），
// 里面常有本机绝对路径和 Obsidian 双链。本项目是公开仓库，那些不该跟着发出去，
// 所以这里按「有没有 qid frontmatter」过滤：没有 qid 的 md 一律不同步。
// 图片与其它资源照常同步。
//
// 用法：npm run sync            （默认源 D:\Obsidian\repo\题库）
//       BANK_SRC=... npm run sync

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = process.env.BANK_SRC || 'D:\\Obsidian\\repo\\题库';
const DST = path.join(ROOT, 'data');
// 'TMUA Mock' 是源里的独立顶层库（原先嵌在 TMUA/Mock 下，2026-08 提升出来）。
// 这里照源的层级 1:1 镜像，不再替它改嫁到 TMUA/ 底下——data\ 与源长得一样，
// 才不会有人对着两边的目录树犯迷糊
const BANKS = ['TMUA', 'TMUA Mock', 'MAT', 'SMC', 'ECAA', 'AMC'];

/** 题目文件的判据：frontmatter 里有 qid。没有的就是笔记，不同步。 */
function isQuestion(file) {
  try {
    return /^\s*qid:/m.test(fs.readFileSync(file, 'utf-8').slice(0, 800));
  } catch {
    return false;
  }
}

function walk(dir, base = dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    let stat;
    try { stat = fs.statSync(full); } catch { continue; }
    if (stat.isDirectory()) {
      if (name.startsWith('.')) continue;
      walk(full, base, out);
    } else {
      out.push(path.relative(base, full));
    }
  }
  return out;
}

/** 自底向上清掉空目录；根目录本身留着 */
function pruneEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    let stat;
    try { stat = fs.statSync(full); } catch { continue; }
    if (!stat.isDirectory()) continue;
    pruneEmptyDirs(full);
    try { if (fs.readdirSync(full).length === 0) fs.rmdirSync(full); } catch {}
  }
}

function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`[sync-bank] 找不到题库源：${SRC}`);
    process.exit(1);
  }

  let copied = 0;
  let skipped = 0;
  let removed = 0;
  const skippedNames = [];

  for (const bank of BANKS) {
    const srcDir = path.join(SRC, bank);
    const dstDir = path.join(DST, bank);
    if (!fs.existsSync(srcDir)) {
      console.warn(`[sync-bank] 源里没有 ${bank}，跳过`);
      continue;
    }

    const wanted = new Set();
    for (const rel of walk(srcDir)) {
      const from = path.join(srcDir, rel);
      if (rel.toLowerCase().endsWith('.md') && !isQuestion(from)) {
        skipped++;
        skippedNames.push(`${bank}/${rel}`);
        continue;
      }
      wanted.add(rel);
      const to = path.join(dstDir, rel);
      fs.mkdirSync(path.dirname(to), { recursive: true });
      // 内容一致就不写，省得把整库的 mtime 全刷一遍
      let same = false;
      try { same = fs.readFileSync(from).equals(fs.readFileSync(to)); } catch {}
      if (!same) {
        fs.copyFileSync(from, to);
        copied++;
      }
    }

    // 镜像语义：源里已经没有的，这边也删掉（含此前误同步进来的笔记）
    for (const rel of walk(dstDir)) {
      if (wanted.has(rel)) continue;
      fs.rmSync(path.join(dstDir, rel), { force: true });
      removed++;
    }
    // 删文件不删目录，整棵子树搬走后会留下一串空壳（TMUA/Mock 提升出去就是这样）。
    // 空目录不影响构建，但留着会让人以为题还在那儿
    pruneEmptyDirs(dstDir);
  }

  console.log(`[sync-bank] 源：${SRC}`);
  console.log(`[sync-bank] 更新 ${copied} 个文件，删除 ${removed} 个，过滤掉 ${skipped} 个非题目文件`);
  for (const n of skippedNames) console.log(`    跳过（无 qid）：${n}`);
}

main();
