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
// EXAM_OUT 只给测试用：node --test 并行跑多个测试文件，若它们都往 public\exam
// 里 rm -rf + 重建，就会互相把对方读到一半的产物删掉。
const OUT = process.env.EXAM_OUT ? path.resolve(process.env.EXAM_OUT) : path.join(ROOT, 'public', 'exam');

// 'TMUA Mock' 是题库源里的独立顶层库（原先嵌在 TMUA/Mock 下，2026-08 提升出来）。
// 目录名带空格无妨：这里只拿它拼路径，题目落进 index 时统一叫 TMUA_MOCK
const DATABASES = ['TMUA', 'TMUA Mock', 'MAT', 'SMC', 'ECAA', 'AMC', 'GMAT'];
const ROMANS = ['i', 'ii', 'iii', 'iv', 'v', 'vi'];
const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const IMAGE_DIR_NAMES = new Set(['image', 'images']);

// ---------------- frontmatter / 分节 ----------------

const unquote = (text) => text.trim().replace(/^["']|["']$/g, '');

/**
 * 行内列表 `[a, "b, c"]` 拆条目。逗号在引号里时不算分隔符——
 * 题库里确实有 `"Floor, Ceiling and Fractional Part Functions"` 这种带逗号的标签，
 * 直接 split(',') 会把它劈成两个残条目
 */
function splitInlineList(body) {
  const items = [];
  let current = '';
  let quote = null;
  for (const ch of body) {
    if (quote) {
      if (ch === quote) quote = null;
      else current += ch;
    } else if ((ch === '"' || ch === "'") && current.trim() === '') {
      // 引号只有出现在条目开头时才是引号：`Vieta's Formulas` 里那个撇号是名字的一部分
      quote = ch;
    } else if (ch === ',') {
      items.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  items.push(current);
  return items.map((item) => item.trim()).filter(Boolean);
}

/** 数组字段的读法：没标过的题这个键要么缺席、要么是空标量，一律当空列表 */
function listField(data, key) {
  const value = data[key];
  return Array.isArray(value) ? value : [];
}

/**
 * 只取需要的几个字段，避免为此引入 YAML 依赖。
 *
 * 标量一律留成字符串；topics / subtopics 这类列表两种写法都要认——题库里
 * 行内 `topics: [A, B]` 与块状 `topics:` 换行 `  - A` 是并存的（各占一半），
 * 只认行内那种会把块状的题当成没打标。
 */
function parseFrontmatter(raw) {
  const m = raw.match(/^﻿?---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  let listKey = null; // 上一个「冒号后面空着」的键，块状列表的项挂到它名下
  for (const line of m[1].split(/\r?\n/)) {
    const item = line.match(/^\s*-\s+(.+)$/);
    if (item && listKey) {
      const value = unquote(item[1]);
      if (value) (data[listKey] ||= []).push(value);
      continue;
    }
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) {
      // 空行和注释行在 YAML 里不打断列表，这里也不能打断：题库是在 Obsidian 里
      // 手编的，`topics:` 和第一个 `- x` 之间夹一个空行很常见，断了就等于
      // 整条标签静默丢失（丢失方向是「变成未打标」，题会照常出现，不会被错杀）
      if (line.trim() !== '' && !/^\s*#/.test(line)) listKey = null;
      continue;
    }
    const rest = kv[2].trim();
    const inline = rest.match(/^\[(.*)\]$/);
    if (inline) {
      data[kv[1]] = splitInlineList(inline[1]);
      listKey = null;
      continue;
    }
    // 冒号后面空着的键既可能是块状列表的开头，也可能只是个空标量。
    // 先按空标量记下，真有 `- x` 跟上来时再就地改写成数组——这样所有
    // 标量字段的读法都跟以前一字不差
    data[kv[1]] = unquote(rest);
    listKey = rest === '' ? kv[1] : null;
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
/**
 * 整句陈述型干扰项（如 "x cannot be determined from the given information"）。
 *
 * 它天生就比旁边那些数值选项长很多，那是题目本来的样子，不是吞了题干。
 * 真被吞进来的题干会留下痕迹：问号，或者规则 6 那种「自己的标号 + 取值」。
 * 两样都没有、且正文几乎全包在 \text{} 里的，就只是个长选项。
 */
function isProseDistractor(choice) {
  const label = choice.label.toUpperCase();
  const textSpan = /\\text\s*\{[^}]*\}/g;
  const stemTrace =
    /[?？]/.test(choice.text) ||
    new RegExp('\\\\text\\{[^}]*\\b' + label + '\\s+-?[\\d.]').test(choice.text);
  if (stemTrace) return false;
  // 去掉 \text{…} 后基本不剩什么，说明整项就是一句话，而不是题干掺着公式
  return contentLen(choice.text.replace(textSpan, '')) <= 3;
}

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
    const longest = choices[lens.indexOf(max)];
    if (!isProseDistractor(longest)) {
      return `选项 ${longest.label} 畸长（${max} 字符，第二长仅 ${second}），疑似吞掉了题干`;
    }
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

/**
 * 选项格式家族：决定用哪个解析器、哪套损坏判据。
 *
 * 和「题目属于哪个池子」是两件事。TMUA Mock 已经是源里的独立顶层库，
 * 但题目仍是照 TMUA 体例写的（$$\mathbf{A} \quad …$$ 公式块），
 * 格式上就该当 TMUA 认。不映射的话哪个分支都不匹配，整库会掉进
 * inlineFallback——选项按钮只剩字母，题面里还留着一整串原文
 */
function choiceFormat(sourceDatabase) {
  return sourceDatabase === 'TMUA Mock' ? 'TMUA' : sourceDatabase;
}

function parseChoicesFor(database, statement, answer) {
  let parsed = null;
  // GMAT 由 scripts\convert-gmat.mjs 生成，选项统一写成 TMUA 的 $$\mathbf{X} \quad …$$ 块
  if (database === 'TMUA' || database === 'ECAA' || database === 'GMAT') parsed = parseTmuaChoices(statement);
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

  if (database === 'TMUA_MOCK' || database === 'AMC') return true;

  if (database === 'TMUA') {
    const isSpecimen = id.startsWith('Spec-');
    return !isSpecimen && !(year >= 2016 && year <= 2023);
  }

  if (database === 'MAT') return !(year >= 2007 && year <= 2023);
  return false;
}

// ---------------- Diagnostic 固定卷 ----------------
// Diagnostic Test 是两卷制、零随机：Paper 1 取 algebra-ps，Paper 2 取 algebra-ds。
// 每个 40 题的文件按难度（level 为主键）升序排好后奇偶交错拆成两套 20 题——
// 套一取第 1,3,5… 名，套二取第 2,4,6… 名。两套各自天然升序，难度分布对等，
// 两次机会各用一套，互不重题。word-problems 两套仍在 diag 池里，但本引擎不碰。
const DIAG_PAPER_DIRS = { p1: 'algebra-ps', p2: 'algebra-ds' };
const DIAG_SET_COUNT = 2;

function levelRank(data) {
  // 'LEVEL 7' → 7；缺失或不认识的一律排到最后，但不至于让排序崩掉
  const match = String(data.level || '').match(/(\d+)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

/** 把一个 40 题目录拆成 DIAG_SET_COUNT 套等长、各自升序的卷 */
function splitDiagnosticPaper(entries) {
  const sorted = [...entries].sort((a, b) => a.rank - b.rank || a.qid - b.qid);
  const sets = Array.from({ length: DIAG_SET_COUNT }, () => []);
  sorted.forEach((entry, i) => sets[i % DIAG_SET_COUNT].push(entry.qid));
  return sets;
}

/** 诊断集（GMAT）：入 index 但另作一池，体例同 hidden */
function isDiagnosticQuestion(database) {
  return database === 'GMAT';
}

function indexDatabase(sourceDatabase, filePath, data) {
  // 独立顶层库，整库都是 mock
  if (sourceDatabase === 'TMUA Mock') return 'TMUA_MOCK';
  if (sourceDatabase !== 'TMUA') return sourceDatabase;

  // TMUA/ 下的兜底：mock 曾经嵌在 TMUA/Mock 里，题库源已改成顶层库，
  // 但认 paper 这一条留着——判据是题目自己写的，不受目录怎么摆布
  const relativeParts = path.relative(path.join(BANK, 'TMUA'), filePath).split(path.sep);
  const isMock = relativeParts[0] === 'Mock' || String(data.paper || '') === 'TMUA Mock';
  return isMock ? 'TMUA_MOCK' : 'TMUA';
}

// ---------------- 逻辑推理题的判定 ----------------
//
// 认的是题库自己的知识点打标，不是卷别。曾经拿 TMUA Paper 2 整卷当代理，
// 实测下来精确率只有 57%：P2 的 180 题里只有 103 题真的标了逻辑，
// 而 P1 里另有 15 道逻辑题会被漏掉——整卷和知识点根本不是一回事。

const LOGIC_TOPIC = 'logic and proof';
const LOGIC_SUBTOPIC = 'logic';

/**
 * 逻辑推理题 = topics 里有 `Logic and Proof`，**或** subtopics 里正好是 `Logic`。
 *
 * 两套词汇是打标历史留下的，覆盖的题并不重合（交集只占并集的一半），
 * 所以取并集，两边都得认。topics 用包含匹配，好接住往后可能出现的
 * `Logic and Proof (…)`；subtopics 用精确匹配，免得把 `Logical Puzzles`
 * 这类尚未出现的标签一并吞掉——这个开关只该排除确定是逻辑题的题。
 */
function isLogicQuestion(data) {
  if (listField(data, 'topics').some((topic) => topic.toLowerCase().includes(LOGIC_TOPIC))) {
    return true;
  }
  return listField(data, 'subtopics').some((sub) => sub.toLowerCase() === LOGIC_SUBTOPIC);
}

/**
 * 这道题整理过知识点没有。打标覆盖率在各库之间差得极远（SMC 全标完，
 * 而 MAT 只有个位数百分比），面板上要如实交代这个开关能管到多少题，
 * 所以「有没有标过」本身也得进索引——没标过的题只能算「不知道」，
 * 不能当成「已确认不是逻辑题」。
 */
function hasTopicTags(data) {
  return listField(data, 'topics').length > 0 || listField(data, 'subtopics').length > 0;
}

// ---------------- 知识点倒排（topics.json） ----------------
//
// 进度面板的「知识点弱项」要按知识点聚合用户的对错，得有一张
// 知识点 → qid 的倒排表。它单独落一个文件，不进 index.json：
// index 每次冷启动都要下载，而这份数据只有打开进度面板才用得到。

/** 12 词规范表。顺序即站内展示顺序的默认序（弱项图另按正确率排） */
const TOPIC_VOCAB = [
  'Algebra',
  'Geometry',
  'Logic and Proof',
  'Number Theory',
  'Function',
  'Combinatorics',
  'Misc Pure',
  'Calculus',
  'Trigonometry',
  'Sequences and Series',
  'Polynomial',
  'Probability',
];

/**
 * 同一个知识点在题库里有好几种写法，全是历史打标口径不一留下的。
 * 键一律小写，比对前先把取值也压成小写——大小写差异不该算成新词。
 */
const TOPIC_ALIASES = {
  'algebra (basic)': 'Algebra',
  'algebra (function)': 'Function',
  'algebra (polynomial)': 'Polynomial',
  'mis pure': 'Misc Pure',
  'miscellaneous pure': 'Misc Pure',
  'statistical theory': 'Probability',
};

const TOPIC_CANONICAL = new Map(TOPIC_VOCAB.map((name) => [name.toLowerCase(), name]));

/** 规范名或 null（词表外） */
function canonicalTopic(raw) {
  const key = String(raw).trim().toLowerCase();
  return TOPIC_CANONICAL.get(key) || TOPIC_ALIASES[key] || null;
}

/**
 * 一道题归并后的知识点。topics 字段本身走 parseFrontmatter，行内与块状
 * 两种写法都已经认得（行内那 200 条全在 TMUA Mock）。
 *
 * 词表外的取值**丢弃并记账**：站内现在应当一个都没有，真冒出来就是打标侧
 * 引入了新词的信号，构建日志得当场报出来，不能静默吞掉。
 */
function canonicalTopics(data, unknown, where) {
  const out = [];
  for (const raw of listField(data, 'topics')) {
    const name = canonicalTopic(raw);
    if (!name) {
      const key = String(raw).trim();
      const seen = unknown.get(key) || { count: 0, sample: where };
      seen.count++;
      unknown.set(key, seen);
      continue;
    }
    // 归并之后可能撞同一个规范名（一题既标了 Algebra 又标了 Algebra (Basic)），去重
    if (!out.includes(name)) out.push(name);
  }
  return out;
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
  const diagCandidates = { p1: [], p2: [] };
  // 知识点倒排与按库覆盖。只收进了 index 的题——判不了分的题在前端根本不存在，
  // 收进来只会让分母对不上，「练这类题」还会抽到取不回来的 qid
  const topicQids = new Map();
  const topicCoverage = {};
  const unknownTopics = new Map();
  let inlineCount = 0;
  const skipped = { noQid: 0, noStatement: 0, badAnswer: 0, noChoices: 0, answerMismatch: 0, corrupted: 0 };

  for (const sourceDb of DATABASES) {
    for (const filePath of listQuestionFiles(path.join(BANK, sourceDb))) {
      let raw;
      try { raw = fs.readFileSync(filePath, 'utf-8'); } catch { continue; }
      const { data, body } = parseFrontmatter(raw);
      if (!data.qid) { skipped.noQid++; continue; }
      const db = indexDatabase(sourceDb, filePath, data);

      const sections = parseSections(body);
      const statement = sections['题目'];
      if (!statement) { skipped.noStatement++; continue; }

      const answer = normalizeAnswer(sections['答案']);
      if (!answer) { skipped.badAnswer++; continue; }

      const format = choiceFormat(sourceDb);
      let parsed = parseChoicesFor(format, statement, answer);
      if (!parsed) { skipped.noChoices++; continue; }
      if (!parsed.choices.some((c) => c.label.toLowerCase() === answer.toLowerCase())) {
        skipped.answerMismatch++;
        continue;
      }

      // 拦截源数据损坏的题（只拦不改；修是人工去改 data\ 下的 md 源文件）
      if (!parsed.optionsInline) {
        const corruption = detectCorruption(parsed, format);
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
      // 两个标记都只在为真时写，和 hidden / diag 同体例：index.json 是每次冷启动
      // 都要下载的，给一千多条全都补一个 false 只是白白撑大它
      if (isLogicQuestion(data)) indexEntry.logic = true;
      if (hasTopicTags(data)) indexEntry.tagged = true;
      // 诊断集：只给「Diagnostic Test 压力测试」用，不参与 classic / 9.0 随机抽题池
      if (isDiagnosticQuestion(db)) {
        indexEntry.diag = true;
        // 固定卷只取 algebra 两套；用所在目录名认卷别
        const folder = path.basename(path.dirname(filePath));
        for (const [paper, dir] of Object.entries(DIAG_PAPER_DIRS)) {
          if (folder === dir) diagCandidates[paper].push({ qid, rank: levelRank(data) });
        }
      }
      index.push(indexEntry);

      // 知识点倒排跟着 index.push 走，两者一步不差：coverage 的分母就是
      // 「这个库进了 index 的题数」，前端披露的也正是这个口径。
      // diag（诊断集）结构性排除：今天 GMAT 恰好没打标所以进不来，但「恰好」
      // 不是保证——将来谁给诊断题补了标签，它也绝不能经弱项图这条路露头
      if (!indexEntry.diag) {
        const coverage = (topicCoverage[db] ||= { tagged: 0, total: 0 });
        coverage.total++;
        const topics = canonicalTopics(data, unknownTopics, path.relative(ROOT, filePath));
        if (topics.length > 0) {
          coverage.tagged++;
          for (const name of topics) {
            if (!topicQids.has(name)) topicQids.set(name, []);
            topicQids.get(name).push(qid);
          }
        }
      }
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

  // 固定卷定义单独落一个小文件，index 形状保持冻结；前端只在进 Diagnostic 时才取
  const p1Sets = splitDiagnosticPaper(diagCandidates.p1);
  const p2Sets = splitDiagnosticPaper(diagCandidates.p2);
  const diagSets = p1Sets.map((p1, i) => ({ p1, p2: p2Sets[i] || [] }));
  fs.writeFileSync(path.join(OUT, 'diag.json'), JSON.stringify({ sets: diagSets }));
  console.log(
    '[build-data] Diagnostic 固定卷：',
    diagSets.map((s, i) => `套${i + 1} P1=${s.p1.length} P2=${s.p2.length}`).join('  '),
  );

  // 知识点倒排。vocab 给全 12 词（哪怕某个词一道题都没有，它仍是规范表的一部分），
  // byTopic 只列真有题的词。qid 按索引同序（降序），产物与目录遍历顺序无关
  const byTopic = {};
  for (const name of TOPIC_VOCAB) {
    const qids = topicQids.get(name);
    if (qids && qids.length > 0) byTopic[name] = [...qids].sort((a, b) => b - a);
  }
  fs.writeFileSync(
    path.join(OUT, 'topics.json'),
    JSON.stringify({ v: 1, vocab: TOPIC_VOCAB, byTopic, coverage: topicCoverage }),
  );

  const counts = {};
  for (const e of index) counts[e.db] = (counts[e.db] || 0) + 1;

  console.log('[build-data] 可判分题目：', JSON.stringify(counts), '合计', index.length);

  // 知识点覆盖同样逐库报：弱项图那行「哪些库还没整理完」读的就是这两个数
  const topicTotals = Object.values(byTopic).reduce((sum, qids) => sum + qids.length, 0);
  const topicTagged = Object.values(topicCoverage).reduce((sum, c) => sum + c.tagged, 0);
  console.log(
    `[build-data] 知识点：${Object.keys(byTopic).length}/${TOPIC_VOCAB.length} 个词有题，` +
      `已打标 ${topicTagged}/${index.length} 题，标签 ${topicTotals} 条`,
  );
  for (const name of TOPIC_VOCAB) {
    const n = byTopic[name]?.length || 0;
    console.log(`    ${name.padEnd(22)} ${String(n).padStart(4)}`);
  }
  for (const db of Object.keys(topicCoverage).sort()) {
    const { tagged, total } = topicCoverage[db];
    const percent = total ? Math.round((tagged / total) * 100) : 0;
    console.log(
      `    ${db.padEnd(10)} 知识点已整理 ${String(tagged).padStart(4)}/${String(total).padEnd(4)} (${percent}%)`,
    );
  }
  // 词表外的取值是打标侧引入新词的信号，只能丢弃、但绝不静默：
  // 站内现在应当零漏网，这几行一旦出现就该有人去处理
  if (unknownTopics.size > 0) {
    console.warn(`[build-data] ⚠ topics 出现 ${unknownTopics.size} 个词表外的取值，已丢弃：`);
    for (const [name, info] of unknownTopics) {
      console.warn(`    "${name}" ×${info.count}（如 ${info.sample}）`);
    }
  }

  // 逐库报打标覆盖：面板上的覆盖率提示读的就是这两个数，构建时先亮出来，
  // 哪个库的打标补上了 / 退化了当场就能看见
  const logicCounts = {};
  const taggedCounts = {};
  for (const e of index) {
    if (e.logic) logicCounts[e.db] = (logicCounts[e.db] || 0) + 1;
    if (e.tagged) taggedCounts[e.db] = (taggedCounts[e.db] || 0) + 1;
  }
  console.log(
    `[build-data] 逻辑推理题（按知识点标签）：合计 ${index.filter((e) => e.logic).length} 题`,
  );
  for (const db of Object.keys(counts).sort()) {
    const tagged = taggedCounts[db] || 0;
    const percent = counts[db] ? Math.round((tagged / counts[db]) * 100) : 0;
    console.log(
      `    ${db.padEnd(10)} 逻辑 ${String(logicCounts[db] || 0).padStart(4)}` +
        `   已打标 ${String(tagged).padStart(4)}/${String(counts[db]).padEnd(4)} (${percent}%)`,
    );
  }
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
