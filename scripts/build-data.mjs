// 构建期预生成：扫 data\ 下的题库 → public\exam\ 下的静态 JSON + 图片
//
// 这是选项解析逻辑的唯一所在地。静态化之后应用端不再读盘，
// 「哪些题能自动判分」在这里一次性判完，index.json 里只留下能判分的题，
// 所以设置页显示的题数是精确值，不再是「约 N 题」。
//
//   public\exam\index.json   [{ qid, db }]，用于统计题数和随机抽题
//   public\exam\q\<qid>.json 单题全文（题面/选项/答案/解析）
//   public\exam\img\<name>   题面引用的图片

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BANK = process.env.BANK_PATH ? path.resolve(process.env.BANK_PATH) : path.join(ROOT, 'data');
const OUT = path.join(ROOT, 'public', 'exam');

const DATABASES = ['TMUA', 'MAT', 'SMC', 'ECAA'];
const ROMANS = ['i', 'ii', 'iii', 'iv', 'v', 'vi'];
const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const IMAGE_DIR_NAMES = new Set(['image', 'images']);

// ---------------- frontmatter / 分节 ----------------

/** 只取需要的几个标量字段，避免为此引入 YAML 依赖 */
function parseFrontmatter(raw) {
  const m = raw.match(/^﻿?---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim().replace(/^["']|["']$/g, '');
    data[kv[1]] = v;
  }
  return { data, body: raw.slice(m[0].length) };
}

function parseSections(raw) {
  raw = raw.replace(/\r\n/g, '\n');
  const result = {};
  for (const block of raw.split(/\n(?=## )/)) {
    const m = block.match(/^## (.+?)\n([\s\S]*)$/);
    if (!m) continue;
    const title = m[1].trim();
    let body = m[2].trim();
    if (title === '备注') {
      let noteBody = '';
      for (const sub of body.split(/\n(?=### )/)) {
        const sm = sub.match(/^### (.+?)\n([\s\S]*)$/);
        if (sm) result[sm[1].trim()] = sm[2].trim();
        else noteBody += sub;
      }
      if (noteBody.trim()) result['备注'] = noteBody.trim();
    } else {
      if (title === 'TeX') body = body.replace(/^```(?:tex)?\n?/, '').replace(/\n?```$/, '').trim();
      result[title] = body;
    }
  }
  return result;
}

// ---------------- 答案与选项解析（原 lib\exam.ts 逻辑） ----------------

/** `## 答案` 原文 → 归一化 label；非选择题答案返回 null */
function normalizeAnswer(raw) {
  if (!raw) return null;
  const m = raw.trim().match(/^[($（【[]*\s*([A-Za-z]+)\s*[)$）】\].]*$/);
  if (!m) return null;
  const token = m[1];
  if (/^[A-Ha-h]$/.test(token)) return token.toUpperCase();
  if (ROMANS.includes(token.toLowerCase())) return token.toLowerCase();
  return null;
}

/** 只含一张图片引用（图形选项题的选项内容） */
const IMAGE_ONLY = /^(?:!\[\[[^\]]+\]\]|!\[[^\]]*\]\([^)]+\))$/;

/**
 * TMUA：$$\mathbf{A} \quad …$$ 独立公式块，一块一选项。
 *
 * 图形选项题（如 Spec-P2-Q10）的写法是空选项块后紧跟图片：
 *     $$\mathbf{A} \quad$$
 *     ![[Image/xxx-fig1.jpg]]
 * 这时图片才是选项内容。早期版本只取块内文本，导致 6 个选项全是空的、
 * 图片全留在题面里，谁也分不清哪张图对应哪个选项。
 */
function parseTmuaChoices(statement) {
  const re = /\$\$\s*\\mathbf\s*\{?\s*([A-H])\s*\}?\s*(?:\\quad|\\;|\\ )?\s*([\s\S]*?)\$\$\s*/g;
  const blocks = [];
  let m;
  while ((m = re.exec(statement)) !== null) {
    blocks.push({ label: m[1], body: m[2].trim(), start: m.index, end: re.lastIndex });
  }
  if (blocks.length < 3) return null;

  const choices = [];
  const cut = []; // 要从题面里移除的区间
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    cut.push([b.start, b.end]);
    const gapEnd = i + 1 < blocks.length ? blocks[i + 1].start : statement.length;
    const gapRaw = statement.slice(b.end, gapEnd);
    if (!b.body && IMAGE_ONLY.test(gapRaw.trim())) {
      choices.push({ label: b.label, text: gapRaw.trim() });
      cut.push([b.end, gapEnd]);
    } else {
      choices.push({ label: b.label, text: `$${b.body}$` });
    }
  }

  cut.sort((a, b) => a[0] - b[0]);
  let cleaned = '';
  let pos = 0;
  for (const [s, e] of cut) {
    if (s > pos) cleaned += statement.slice(pos, s);
    pos = Math.max(pos, e);
  }
  cleaned += statement.slice(pos);
  cleaned = cleaned.trim();
  if (!cleaned) return null;
  return { cleaned, choices };
}

/**
 * MAT：(a)…(e) 或老卷 (i)…(iv)，行内/换行混排都有。
 *
 * 最后一个选项在遇到空行时就结束，不能一路吃到题面末尾——MAT 常在选项之后
 * 另起一段补充说明（`[Note that ...]` / `[Hint: ...]`），那属于题目。
 * 早期版本把它并进了最后一个选项，于是 (e) 会显示成
 * “$4.$ [Note that $|x|$ is equal to ...]”。
 */
function parseParenChoices(statement, labels) {
  // 首个标号必须另起一行：MAT 题面里常有 `I (a) = \int ...` 这种公式，
  // 直接 indexOf('(a)') 会命中公式内部，把题面从公式中间截断。
  // 后续标号不作此要求——老卷的选项常常一行内排开 `(a) …, (b) …, (c) …`。
  const firstRe = new RegExp(`^[ \\t]*\\(${labels[0]}\\)`, 'm');
  const firstMatch = firstRe.exec(statement);
  if (!firstMatch) return null;

  const positions = [{ lab: labels[0], idx: firstMatch.index + firstMatch[0].indexOf('(') }];
  let from = positions[0].idx + labels[0].length + 2;
  for (const lab of labels.slice(1)) {
    const idx = statement.indexOf(`(${lab})`, from);
    if (idx === -1) break;
    positions.push({ lab, idx });
    from = idx + lab.length + 2;
  }
  if (positions.length < 3) return null;

  const head = statement.slice(0, positions[0].idx).trim();
  if (!head) return null;

  // 最后一个选项到「下一个空行」为止，之后的内容退回题面
  const lastStart = positions[positions.length - 1].idx;
  const tailBreak = statement.slice(lastStart).search(/\r?\n[ \t]*\r?\n/);
  const lastEnd = tailBreak === -1 ? statement.length : lastStart + tailBreak;
  const trailer = statement.slice(lastEnd).trim();

  const choices = positions.map((p, k) => {
    const start = p.idx + p.lab.length + 2;
    const end = k + 1 < positions.length ? positions[k + 1].idx : lastEnd;
    return { label: p.lab, text: statement.slice(start, end).trim().replace(/[;,]\s*$/, '') };
  });
  if (choices.some((c) => !c.text)) return null;

  const cleaned = trailer ? `${head}\n\n${trailer}` : head;
  return { cleaned, choices };
}

/** SMC：单行 `A … $\qquad$ B … $\qquad$ …` */
function parseSmcChoices(statement) {
  const lines = statement.split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (!/^A\s/.test(line)) continue;
    const parts = line.split(/\s*\$\\qquad\$\s*/);
    if (parts.length < 3) continue;
    const choices = [];
    let ok = true;
    for (let k = 0; k < parts.length; k++) {
      const pm = parts[k].trim().match(/^([A-H])\s+([\s\S]+)$/);
      if (!pm || pm[1] !== String.fromCharCode(65 + k)) { ok = false; break; }
      choices.push({ label: pm[1], text: pm[2].trim() });
    }
    if (!ok) continue;
    const cleaned = [...lines.slice(0, i), ...lines.slice(i + 1)].join('\n').trim();
    if (!cleaned) return null;
    return { cleaned, choices };
  }
  return null;
}

/** 兜底：选项留在题面（表格式等），按钮只显字母 */
function inlineFallback(statement, answer, maxLabels) {
  if (!/^[A-H]$/.test(answer)) return null;
  const need = Math.max(maxLabels, answer.charCodeAt(0) - 64);
  return {
    cleaned: statement,
    choices: Array.from({ length: need }, (_, k) => ({ label: String.fromCharCode(65 + k), text: '' })),
  };
}

// ---------------- 源数据缺陷的修复与拦截 ----------------
//
// 题库 md 是从 PDF 转换来的，MAT/TMUA 有一批转换损坏（SMC 未见）。分三种处理：
//   能修的修（尾注错位、图形选项）、修不了的拦掉（题干被吞、选项残缺）。

/** 归一化后的内容长度，用于比较选项长短 */
function contentLen(text) {
  return text.replace(/^\$+|\$+$/g, '').replace(/\s+/g, '').length;
}

/** 期望的首个标号：A / a / i */
function expectedLabels(labels, n) {
  return labels.slice(0, n);
}

/**
 * 拦截：判断这道题是否已被源数据损坏到不能用。
 * 返回原因字符串；null 表示通过。
 */
function detectCorruption(parsed, database) {
  const { choices, cleaned } = parsed;

  // 1. 标号不连续：某个选项块在转换时丢了（如 TMUA 23-P2-Q14 缺 E，标号成了 A B C D F）
  const labs = choices.map((c) => c.label);
  const family = /^[A-H]$/.test(labs[0])
    ? LETTERS.map((l) => l.toUpperCase())
    : ROMANS.includes(labs[0])
      ? ROMANS
      : LETTERS;
  const want = expectedLabels(family, labs.length);
  if (labs.join(',').toLowerCase() !== want.join(',').toLowerCase()) {
    return `选项标号不连续：${labs.join(' ')}`;
  }

  // 2. 选项里出现 $$ 独立公式块 —— 选项是行内片段，出现块级公式必然是别处的内容混了进来
  const bad = choices.find((c) => /\$\$/.test(c.text));
  if (bad) return `选项 ${bad.label} 内含 $$ 公式块，疑似混入其它内容`;

  // 3. 题面 $$ 数量为奇数：公式块未闭合，说明题面从公式中间被截断
  if (((cleaned.match(/\$\$/g) || []).length) % 2 === 1) {
    return '题面存在未闭合的 $$ 公式块';
  }

  // 4. 空选项（图形选项已在解析阶段接上图片，到这里还空就是真的没内容）
  const empty = choices.find((c) => !contentLen(c.text));
  if (empty) return `选项 ${empty.label} 无内容`;

  // 5. 题干被吞进某一个选项：该选项相对「第二长的选项」仍然畸长。
  //    比第二长而不是比中位数：TMUA 常有整句陈述型选项，五个都长是正常的，
  //    只有当某一个把其余全甩开时才说明它吞了题干。
  const lens = choices.map((c) => contentLen(c.text));
  const sorted = [...lens].sort((a, b) => b - a);
  const [max, second] = sorted;
  // ECAA 经常把最后一个干扰项写成整句文字，不能用旧 OCR 题库的长度比规则判断。
  if (database !== 'ECAA' && max >= 40 && second > 0 && max / second >= 5) {
    const who = choices[lens.indexOf(max)].label;
    return `选项 ${who} 畸长（${max} 字符，第二长仅 ${second}），疑似吞掉了题干`;
  }

  // 6. 转换时把「题干问句 + 选项标号 + 该选项的值」整串塞进了第一个选项，例如
  //      A = "\text{... What is the value of p+8q? A 6}"   （20-P1-Q5）
  //      A = "\text{real number. Find the ...} x^2-px+6 \text{A -3}" （21-P1-Q12）
  //    特征是选项正文里又出现了一次「自己的标号 + 数值」。
  //    注意不能用「题面没有句末标点」来判：TMUA 题面经常以列表项或条件式收尾，那是正常的。
  const self = choices[0];
  const selfLabel = self.label.toUpperCase();
  if (new RegExp(`\\\\text\\{[^}]*\\b${selfLabel}\\s+-?[\\d.]`).test(self.text)) {
    return `选项 ${self.label} 正文里重复出现了自己的标号与取值，疑似整段题干被并入`;
  }

  return null;
}

function parseChoicesFor(database, statement, answer) {
  let parsed = null;
  if (database === 'TMUA' || database === 'ECAA') parsed = parseTmuaChoices(statement);
  else if (database === 'MAT') parsed = parseParenChoices(statement, LETTERS) ?? parseParenChoices(statement, ROMANS);
  else if (database === 'SMC') parsed = parseSmcChoices(statement) ?? parseParenChoices(statement, LETTERS);
  if (parsed) return { ...parsed, optionsInline: false };
  const fallback = inlineFallback(statement, answer, database === 'TMUA' || database === 'ECAA' ? 8 : 5);
  return fallback ? { ...fallback, optionsInline: true } : null;
}

// ---------------- 扫盘 ----------------

function listQuestionFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    let stat;
    try { stat = fs.statSync(full); } catch { continue; }
    if (stat.isDirectory()) {
      if (name.startsWith('.') || IMAGE_DIR_NAMES.has(name.toLowerCase())) continue;
      listQuestionFiles(full, out);
    } else if (name.endsWith('.md') && !name.endsWith('.bak')) {
      out.push(full);
    }
  }
  return out;
}

/** 题面里引用到的图片文件名 */
function referencedImages(text) {
  const names = new Set();
  const re1 = /!\[\[(?:Image|images)\/([^\]|]+?)(?:\|\d+)?\]\]/g;
  const re2 = /!\[[^\]]*\]\((?:Image|images)\/([^)]+)\)/g;
  let m;
  while ((m = re1.exec(text)) !== null) names.add(path.basename(m[1].trim()));
  while ((m = re2.exec(text)) !== null) names.add(path.basename(m[1].trim()));
  return names;
}

function isHiddenQuestion(database, data) {
  const year = Number(data.year) || 0;
  const id = String(data.id || '');

  if (database === 'TMUA') {
    const isSpecimen = id.startsWith('Spec-');
    return !isSpecimen && !(year >= 2016 && year <= 2023);
  }

  if (database === 'MAT') return !(year >= 2007 && year <= 2023);
  return false;
}

// ---------------- 主流程 ----------------

function main() {
  if (!fs.existsSync(BANK)) {
    console.error(`[build-data] 找不到题库目录：${BANK}`);
    process.exit(1);
  }

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(path.join(OUT, 'q'), { recursive: true });
  fs.mkdirSync(path.join(OUT, 'img'), { recursive: true });

  const index = [];
  const seen = new Map();
  const wantedImages = new Set();
  const corrupted = [];
  let inlineCount = 0;
  const skipped = { noQid: 0, noStatement: 0, badAnswer: 0, noChoices: 0, answerMismatch: 0, corrupted: 0 };

  for (const db of DATABASES) {
    for (const filePath of listQuestionFiles(path.join(BANK, db))) {
      let raw;
      try { raw = fs.readFileSync(filePath, 'utf-8'); } catch { continue; }
      const { data, body } = parseFrontmatter(raw);
      if (!data.qid) { skipped.noQid++; continue; }

      const sections = parseSections(body);
      const statement = sections['题目'];
      if (!statement) { skipped.noStatement++; continue; }

      const answer = normalizeAnswer(sections['答案']);
      if (!answer) { skipped.badAnswer++; continue; }

      let parsed = parseChoicesFor(db, statement, answer);
      if (!parsed) { skipped.noChoices++; continue; }
      if (!parsed.choices.some((c) => c.label.toLowerCase() === answer.toLowerCase())) {
        skipped.answerMismatch++;
        continue;
      }

      // 拦截源数据损坏的题（只拦不改；修是人工去改 data\ 下的 md 源文件）
      if (!parsed.optionsInline) {
        const corruption = detectCorruption(parsed, db);
        if (corruption) {
          corrupted.push({ db, id: String(data.id || ''), file: path.relative(ROOT, filePath), reason: corruption });
          skipped.corrupted++;
          continue;
        }
      } else {
        inlineCount++;
      }

      const qid = Number(data.qid);
      if (seen.has(qid)) {
        console.warn(`[build-data] qid 重复，跳过：${qid}\n  已用 ${seen.get(qid)}\n  忽略 ${filePath}`);
        continue;
      }
      seen.set(qid, filePath);

      const solution = sections['解析'] || '';
      for (const n of referencedImages(statement)) wantedImages.add(n);
      for (const n of referencedImages(solution)) wantedImages.add(n);

      fs.writeFileSync(
        path.join(OUT, 'q', `${qid}.json`),
        JSON.stringify({
          qid,
          id: String(data.id || ''),
          paper: String(data.paper || ''),
          year: Number(data.year) || 0,
          number: String(data.number || ''),
          database: db,
          statement: parsed.cleaned,
          choices: parsed.choices,
          optionsInline: parsed.optionsInline,
          answer,
          solution,
        })
      );
      const indexEntry = { qid, db };
      if (isHiddenQuestion(db, data)) indexEntry.hidden = true;
      index.push(indexEntry);
    }
  }

  // 只复制真正被引用到的图片
  let copied = 0;
  const missing = [];
  const pool = new Map();
  for (const db of DATABASES) {
    for (const sub of ['Image', 'image', 'images']) {
      const dir = path.join(BANK, db, sub);
      if (!fs.existsSync(dir)) continue;
      for (const n of fs.readdirSync(dir)) {
        if (!pool.has(n)) pool.set(n, path.join(dir, n));
      }
    }
  }
  for (const name of wantedImages) {
    const src = pool.get(name);
    if (!src) { missing.push(name); continue; }
    fs.copyFileSync(src, path.join(OUT, 'img', name));
    copied++;
  }

  index.sort((a, b) => b.qid - a.qid);
  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index));

  const counts = {};
  for (const e of index) counts[e.db] = (counts[e.db] || 0) + 1;

  console.log('[build-data] 可判分题目：', JSON.stringify(counts), '合计', index.length);
  console.log('[build-data] 跳过：', JSON.stringify(skipped));
  // 选项解析不出来、退化成「按钮只显字母」的题（选项仍在题面里可读，不影响作答）
  if (inlineCount) console.log(`[build-data] 选项内联（按钮只显字母）：${inlineCount} 题`);
  if (corrupted.length) {
    // 落盘一份清单，方便回头去修题库源文件
    fs.writeFileSync(path.join(OUT, 'corrupted.json'), JSON.stringify(corrupted, null, 2));
    console.log(`[build-data] 源数据损坏被拦下 ${corrupted.length} 题（清单见 public\\exam\\corrupted.json）：`);
    for (const c of corrupted) console.log(`    ${c.db.padEnd(5)} ${c.id.padEnd(14)} ${c.reason}`);
  }
  console.log(`[build-data] 图片：引用 ${wantedImages.size} 张，复制 ${copied} 张`);
  if (missing.length) {
    console.warn(`[build-data] 缺失图片 ${missing.length} 张：${missing.slice(0, 5).join(', ')}${missing.length > 5 ? ' …' : ''}`);
  }
}

main();
