// 从题库源（Obsidian vault）全量同步到 data\。
//
// 题库那边除了题目本身，还放着给自己看的工作笔记（Readme、讲义、对接说明…），
// 里面常有本机绝对路径和 Obsidian 双链。本项目是公开仓库，那些不该跟着发出去，
// 所以这里按「有没有 qid frontmatter」过滤：没有 qid 的 md 一律不同步。
// 图片与其它资源照常同步，只有同步软件的残留文件（见 isJunk）除外。
//
// 用法：npm run sync            （默认源 D:\Obsidian\repo\题库）
//       BANK_SRC=... npm run sync

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = process.env.BANK_SRC || 'D:\\Obsidian\\repo\\题库';
// DATA_OUT 只给测试用：合成源目录不该往真的 data\ 里镜像
const DST = process.env.DATA_OUT ? path.resolve(process.env.DATA_OUT) : path.join(ROOT, 'data');
// 'TMUA Mock' 是源里的独立顶层库（原先嵌在 TMUA/Mock 下，2026-08 提升出来）。
// 这里照源的层级 1:1 镜像，不再替它改嫁到 TMUA/ 底下——data\ 与源长得一样，
// 才不会有人对着两边的目录树犯迷糊
const BANKS = ['TMUA', 'TMUA Mock', 'MAT', 'SMC', 'ECAA', 'AMC'];

/**
 * 只开了一部分子目录的库。
 *
 * 'TMUA Addition' 底下摆着好几批来源各异的题，用户裁定只启用 dirs 里这两个
 * （7.5+ Diagnostic 的备用题源）；Clarkson、Euclid Modification 等一律不碰——
 * 既不镜像过去，也不会因为「源侧不存在」被镜像删除逻辑扫掉。
 *
 * imageDir 同样不整目录镜像：那个 Image 里装着**所有**子目录的图，
 * 整目录拷过去等于把没启用的那几批题的图也一并发出去。只拷 dirs 里的题
 * 真正引用到的那几张，目标侧多余的照常按镜像语义删掉。
 */
const PARTIAL_BANKS = [{ bank: 'TMUA Addition', dirs: ['SMT Skills', '野题'], imageDir: 'Image' }];

/** 题目文件的判据：frontmatter 里有 qid。没有的就是笔记，不同步。 */
function isQuestion(file) {
  try {
    return /^\s*qid:/m.test(fs.readFileSync(file, 'utf-8').slice(0, 800));
  } catch {
    return false;
  }
}

/**
 * 同步软件和编辑器留下的残留文件，一律不镜像。
 *
 * 源库在坚果云上，断点续传会留下
 * `19-Q27.md.nutstore-sync-1788077928880-r808r9fd0eh.download` 这种半成品；
 * 它不以 .md 结尾，「有没有 qid」那道闸拦不住，会被当成资源原样拷进 data\。
 */
function isJunk(name) {
  return (
    name.startsWith('.') ||
    name.includes('nutstore-sync') ||
    /\.(download|tmp|part)$/i.test(name) ||
    name.endsWith('~')
  );
}

/**
 * md 里引用到的图片文件名。三种写法都要认：`![[Image/x.png]]`、
 * `![[Image/x.png|400]]`（Obsidian 的显示宽度后缀），以及 markdown 的
 * `![](Image/x.png)`——build-data 的 referencedImages 三种都认，这边少认一种
 * 就会同步出一个「题在、图不在」的库，构建时只剩一行「缺失图片」。
 */
function referencedImages(text, names = new Set()) {
  const wiki = /!\[\[(?:Image|images)\/([^\]|]+?)(?:\|[^\]]*)?\]\]/g;
  const inline = /!\[[^\]]*\]\((?:Image|images)\/([^)]+)\)/g;
  let m;
  while ((m = wiki.exec(text)) !== null) names.add(path.basename(m[1].trim()));
  while ((m = inline.exec(text)) !== null) names.add(path.basename(m[1].trim()));
  return names;
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

/**
 * 把 srcDir 整棵子树镜像到 dstDir：源侧有的拷过去，源侧没有的从这边删掉。
 *
 * keep(rel) 是再加的一道白名单，只给「整目录不该全拷」的场合用
 * （Addition 的 Image）；不传就是整棵镜像，行为与从前一字不差。
 */
function syncTree(srcDir, dstDir, label, stats, keep) {
  const wanted = new Set();
  for (const rel of walk(srcDir)) {
    // 不进 wanted：data\ 里若已有同名残留，下面的镜像删除会照「源侧不存在」清掉
    if (isJunk(path.basename(rel))) {
      stats.junk++;
      continue;
    }
    if (keep && !keep(rel)) {
      stats.unreferenced++;
      continue;
    }
    const from = path.join(srcDir, rel);
    if (rel.toLowerCase().endsWith('.md') && !isQuestion(from)) {
      stats.skipped++;
      stats.skippedNames.push(`${label}/${rel}`);
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
      stats.copied++;
    }
  }

  // 镜像语义：源里已经没有的，这边也删掉（含此前误同步进来的笔记、
  // 以及上一轮被引用、这轮不再被引用的图）
  for (const rel of walk(dstDir)) {
    if (wanted.has(rel)) continue;
    fs.rmSync(path.join(dstDir, rel), { force: true });
    stats.removed++;
  }
  // 删文件不删目录，整棵子树搬走后会留下一串空壳（TMUA/Mock 提升出去就是这样）。
  // 空目录不影响构建，但留着会让人以为题还在那儿
  pruneEmptyDirs(dstDir);
}

function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`[sync-bank] 找不到题库源：${SRC}`);
    process.exit(1);
  }

  const stats = { copied: 0, skipped: 0, junk: 0, removed: 0, unreferenced: 0, skippedNames: [] };

  for (const bank of BANKS) {
    const srcDir = path.join(SRC, bank);
    if (!fs.existsSync(srcDir)) {
      console.warn(`[sync-bank] 源里没有 ${bank}，跳过`);
      continue;
    }
    syncTree(srcDir, path.join(DST, bank), bank, stats);
  }

  for (const { bank, dirs, imageDir } of PARTIAL_BANKS) {
    const images = new Set();
    for (const dir of dirs) {
      const srcDir = path.join(SRC, bank, dir);
      if (!fs.existsSync(srcDir)) {
        console.warn(`[sync-bank] 源里没有 ${bank}/${dir}，跳过`);
        continue;
      }
      // 先把图收齐再镜像：白名单要的是「这两个子目录的题引用了什么」，
      // 而不是「Image 里有什么」。只认真正同步过去的题目文件——
      // 笔记（无 qid）本身不上站，它引的图自然也不必跟着走
      for (const rel of walk(srcDir)) {
        const full = path.join(srcDir, rel);
        if (!rel.toLowerCase().endsWith('.md') || !isQuestion(full)) continue;
        try { referencedImages(fs.readFileSync(full, 'utf-8'), images); } catch {}
      }
      syncTree(srcDir, path.join(DST, bank, dir), `${bank}/${dir}`, stats);
    }
    const srcImg = path.join(SRC, bank, imageDir);
    if (fs.existsSync(srcImg)) {
      syncTree(srcImg, path.join(DST, bank, imageDir), `${bank}/${imageDir}`, stats, (rel) =>
        images.has(path.basename(rel)),
      );
    }
  }

  console.log(`[sync-bank] 源：${SRC}`);
  console.log(
    `[sync-bank] 更新 ${stats.copied} 个文件，删除 ${stats.removed} 个，过滤掉 ${stats.skipped} 个非题目文件、${stats.junk} 个残留文件`,
  );
  if (stats.unreferenced) {
    console.log(`[sync-bank] 没被启用子目录引用、不同步的图片：${stats.unreferenced} 张`);
  }
  for (const n of stats.skippedNames) console.log(`    跳过（无 qid）：${n}`);
}

main();
