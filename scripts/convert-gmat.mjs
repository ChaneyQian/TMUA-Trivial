// GMAT 诊断集切题器：vault 的 4 个大文件 → data\GMAT\<set>\<id>.md（每题一个）
//
// 这是本地工具，不进 npm run build（CI 上没有 vault）。产物 data\GMAT 入库，
// 构建期由 scripts\build-data.mjs 扫盘生成 public\exam\。挂在 npm run sync 之后。
//
// 用法：npm run sync
//       node scripts/convert-gmat.mjs
//       GMAT_SRC=... node scripts/convert-gmat.mjs
//
// ─────────────────────────────────────────────────────────────────────────────
// ⚠️ OA 是这批数据唯一出过事的地方：源库交接说明记载，algebra-ps 最初写入时
// 40 题里有 24 题的 OA 手工誊写错位。所以这里的答案一律「抽取 → 回读 → 比对」：
//   1. 从源文件按题抽 `OA: X`；
//   2. 写盘后重新读回生成的 md，比对 `## 答案` 序列；
//   3. 与源文件解析里的 `Answer: X` 交叉验证（有解析的题）；
//   4. 两个 DS 集另有交接说明里记录的基准序列，逐字符比对。
// 任何一步不符即 process.exit(1)，不写半套数据。
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = process.env.GMAT_SRC || path.join('D:\\Obsidian\\repo\\题库', 'GMAT');
const DST = path.join(ROOT, 'data', 'GMAT');

// qid = YYYY DB P QQ SS（见题库端 Qid 方案）
//   YYYY = 9002  无年份卷保留段（9001 已被各库 Specimen 占用，9002–9099 留给其它无年份套卷）
//   DB   = 07    GMAT（01 STEP / 02 TMUA / 03 MAT / 04 H3 / 05 HKALE / 06 ECAA 已占，07 空闲）
//   P    = 1–4   四个诊断集，见下表
//   QQ   = 题号，SS = 00（无子题）
const QID_YEAR = '9002';
const QID_DB = '07';

const SETS = [
  {
    slug: 'algebra-ps',
    file: 'algebra-ps-diagnostic-test.md',
    p: 1,
    idPrefix: 'ALG-PS',
    paper: 'GMAT Algebra PS Diagnostic',
    section: 'Problem Solving',
    count: 40,
    baseline: null, // 源库交接说明未记录 PS 的基准序列，用解析里的 Answer 交叉验证
  },
  {
    slug: 'algebra-ds',
    file: 'algebra-ds-diagnostic-test.md',
    p: 2,
    idPrefix: 'ALG-DS',
    paper: 'GMAT Algebra DS Diagnostic',
    section: 'Data Sufficiency',
    count: 40,
    baseline: 'BCABACDCECDDCCCBCDECBABCCCCAADDECBCCDADA',
  },
  {
    slug: 'word-problems-ps',
    file: 'word-problems-ps-diagnostic-test.md',
    p: 3,
    idPrefix: 'WORD-PS',
    paper: 'GMAT Word Problems PS Diagnostic',
    section: 'Problem Solving',
    count: 18,
    baseline: null,
  },
  {
    slug: 'word-problems-ds',
    file: 'word-problems-ds-diagnostic-test.md',
    p: 4,
    idPrefix: 'WORD-DS',
    paper: 'GMAT Word Problems DS Diagnostic',
    section: 'Data Sufficiency',
    count: 15,
    baseline: 'BDAAABDEAAEABBC',
  },
];

const errors = [];
function fail(msg) {
  errors.push(msg);
}

// ---------------- 源文件切分 ----------------

const Q_START = /^(\d+)\.\s+(.*)$/;
const OA_LINE = /^OA:\s*([A-E])\s*\.?\s*$/;
// 源文件两种标号体例混用：多数是 `A. …`，另有 5 道题写成 `(A) …`
const OPTION_LINE = /^\(?([A-E])[.)]\s+(\S.*)$/;
const BAND_LINE = /^-{3,}\s*(.+?)\s*-{3,}$/;
const LEVEL_LINE = /^\*\*(LEVEL\s*\d+)\s*:\*\*$/i;
const SOLUTION_TAG = /^\*\*(In)?[Oo]fficial Solution:\*\*$/;

/**
 * 按「行首的连续编号」切题。
 *
 * 不能简单用 /^\d+\./ ——解析正文里也有 `2*1 + ...`、`1. ` 之类的行；
 * 只在编号恰好等于「上一题 + 1」时才认定为新题起点，编号乱跳一律忽略。
 */
function splitQuestions(lines) {
  const starts = [];
  let expect = 1;
  for (let i = 0; i < lines.length; i++) {
    const m = Q_START.exec(lines[i]);
    if (m && Number(m[1]) === expect) {
      starts.push({ number: expect, line: i });
      expect++;
    }
  }
  return starts.map((s, k) => ({
    number: s.number,
    from: s.line,
    to: k + 1 < starts.length ? starts[k + 1].line : lines.length,
  }));
}

/** 记录每一行所处的难度段/等级（源文件里的 `--- EASY ---` 与 `**LEVEL 3:**`） */
function bandMap(lines) {
  const out = [];
  let band = '';
  let level = '';
  for (const line of lines) {
    const b = BAND_LINE.exec(line.trim());
    if (b) band = b[1];
    const l = LEVEL_LINE.exec(line.trim());
    if (l) level = l[1].replace(/\s+/g, ' ').toUpperCase();
    out.push({ band, level });
  }
  return out;
}

/** 从题块尾部（OA 之前）倒着捡 E→A 五个选项行 */
function takeChoices(head, where) {
  const picked = [];
  let i = head.length - 1;
  for (const want of ['E', 'D', 'C', 'B', 'A']) {
    while (i >= 0 && !head[i].trim()) i--;
    const m = i >= 0 ? OPTION_LINE.exec(head[i]) : null;
    if (!m || m[1] !== want) {
      fail(`${where}：找不到选项 ${want}（第 ${i + 1} 行附近：${JSON.stringify(head[i] ?? '')}）`);
      return null;
    }
    picked.unshift({ label: want, raw: m[2].trim(), line: i });
    i--;
  }
  return { choices: picked, stemEnd: picked[0].line };
}

/** 掐掉解析尾部的难度段分隔线与空行 */
function trimSolution(lines) {
  const out = [...lines];
  while (out.length) {
    const t = out[out.length - 1].trim();
    if (!t || BAND_LINE.test(t) || LEVEL_LINE.test(t)) out.pop();
    else break;
  }
  while (out.length && !out[0].trim()) out.shift();
  return out.join('\n').trim();
}

// ---------------- 选项：源格式 → TMUA 的 $$\mathbf{X} \quad …$$ 块 ----------------
//
// 选择这个写法的原因见交付说明：build-data 的 parseParenChoices（MAT 的 `(a)` 格式）
// 会被 DS 选项正文里的 "(1)" / "(2)" 误切，parseSmcChoices 要求单行 $\qquad$ 分隔，
// 只有 parseTmuaChoices 能原样吃下整句英文 + 行内公式的混排。

/** `$…$` 与纯文本混排 → 单一数学模式片段 */
function toMathBody(raw, where) {
  const segs = [];
  let mode = 'text';
  let buf = '';
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (c === '\\' && i + 1 < raw.length) {
      buf += c + raw[i + 1]; // 转义序列整体搬走，`\$` 不当定界符
      i++;
      continue;
    }
    if (c === '$') {
      segs.push({ mode, buf });
      buf = '';
      mode = mode === 'text' ? 'math' : 'text';
      continue;
    }
    buf += c;
  }
  segs.push({ mode, buf });
  if (mode !== 'text') {
    fail(`${where}：选项里的 $ 不成对：${raw}`);
    return null;
  }

  let body = '';
  for (const s of segs) {
    if (!s.buf) continue;
    if (s.mode === 'math') body += s.buf;
    else body += `\\text{${s.buf.replace(/(?<!\\)([%#&_{}])/g, '\\$1')}}`;
  }
  body = body.trim();
  if (!body) {
    fail(`${where}：选项内容为空：${raw}`);
    return null;
  }
  if (body.includes('$$')) {
    fail(`${where}：选项内容含 $$，会截断公式块：${raw}`);
    return null;
  }
  return body;
}

function renderChoices(choices, where) {
  const blocks = [];
  for (const c of choices) {
    const body = toMathBody(c.raw, `${where} 选项 ${c.label}`);
    if (body === null) return null;
    blocks.push(`$$\n\\mathbf{${c.label}} \\quad ${body}\n$$`);
  }
  return blocks.join('\n\n');
}

// ---------------- 题面 ----------------

/**
 * 题面里的钱号：`\$$c$` 这种写法（word-ps Q9）会产生一处字面 `$$`，
 * build-data 的损坏检测按「题面 $$ 计数为奇数 = 公式块未闭合」拦题，会把整道题毙掉。
 * 按源库交接说明的规矩（「数学模式里的美元用 `$\$125c$`」）挪进数学模式，语义不变。
 */
function normalizeStem(stem, where) {
  const fixed = stem.replace(/\\\$\$([^$\n]+)\$/g, (_m, inner) => `$\\$${inner}$`);
  const dollars = (fixed.match(/(?<!\\)\$/g) || []).length; // `\$` 是钱号，不是定界符
  if (dollars % 2 === 1) fail(`${where}：题面里的 $ 不成对（共 ${dollars} 个）`);
  // build-data 的损坏检测按字面量数 `$$`，奇数即判「公式块未闭合」，这里同口径预检
  if (((fixed.match(/\$\$/g) || []).length) % 2 === 1) {
    fail(`${where}：题面里的字面 $$ 为奇数个，会被 build-data 判为损坏`);
  }
  return fixed;
}

// ---------------- 生成 ----------------

function frontmatter(fields) {
  return ['---', ...Object.entries(fields).map(([k, v]) => `${k}: ${v}`), '---'].join('\n');
}

function buildQuestion(set, q, lines, bands) {
  const where = `${set.slug} Q${q.number}`;
  const block = lines.slice(q.from, q.to);

  const oaIdx = block.findIndex((l) => OA_LINE.test(l.trim()));
  if (oaIdx === -1) {
    fail(`${where}：没有 OA 行`);
    return null;
  }
  const answer = OA_LINE.exec(block[oaIdx].trim())[1];

  const head = block.slice(0, oaIdx);
  const taken = takeChoices(head, where);
  if (!taken) return null;

  const stemLines = head.slice(0, taken.stemEnd);
  stemLines[0] = stemLines[0].replace(Q_START, '$2');
  const stem = normalizeStem(stemLines.join('\n').trim(), where);
  if (!stem) {
    fail(`${where}：题面为空`);
    return null;
  }

  const rendered = renderChoices(taken.choices, where);
  if (rendered === null) return null;

  const solution = trimSolution(block.slice(oaIdx + 1));
  const tag = SOLUTION_TAG.exec(solution.split('\n')[0]?.trim() ?? '');
  const solutionSource = !solution ? '无' : tag ? (tag[1] ? '非官方' : '官方') : '未标注';

  // 解析里的 Answer: X，用作 OA 的第三方交叉验证
  const answerTags = [...solution.matchAll(/^Answer:\s*([A-E])\s*\.?\s*$/gm)].map((m) => m[1]);

  const num = String(q.number).padStart(2, '0');
  const qid = `${QID_YEAR}${QID_DB}${set.p}${num}00`;
  if (qid.length !== 11) fail(`${where}：qid 长度不是 11 位（${qid}）`);
  const id = `${set.idPrefix}-Q${q.number}`;
  const { band, level } = bands[q.from];

  const body = [
    frontmatter({
      database: 'GMAT',
      qid,
      id,
      paper: set.paper,
      year: 0,
      number: `Q${q.number}`,
      section: set.section,
      band: band || '',
      level: level || '',
      solution_source: solutionSource,
      difficulty: 0,
      topics: '[]',
      subtopics: '[]',
      tags: '[]',
      status: '已入库',
    }),
    '',
    '## 题目',
    stem,
    '',
    rendered,
    '',
    '## 备注',
    '',
    '### 我的备注',
    '',
    '### AI备注',
    '',
    '## 答案',
    answer,
    '',
    '## 解析',
    solution,
    '',
  ].join('\n');

  return { qid, id, number: q.number, answer, answerTags, solution, body, set };
}

// ---------------- 主流程 ----------------

function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`[convert-gmat] 找不到 GMAT 源目录：${SRC}`);
    process.exit(1);
  }

  const all = [];
  const perSet = [];

  for (const set of SETS) {
    const srcFile = path.join(SRC, set.file);
    if (!fs.existsSync(srcFile)) {
      console.error(`[convert-gmat] 缺少源文件：${srcFile}`);
      process.exit(1);
    }
    const lines = fs.readFileSync(srcFile, 'utf-8').replace(/\r\n/g, '\n').split('\n');
    const bands = bandMap(lines);
    const questions = splitQuestions(lines);
    if (questions.length !== set.count) {
      fail(`${set.slug}：切出 ${questions.length} 题，期望 ${set.count} 题`);
    }

    const built = [];
    for (const q of questions) {
      const item = buildQuestion(set, q, lines, bands);
      if (item) built.push(item);
    }

    // ① 源文件里的 OA 序列（不经过任何中间结构，直接 grep 原文）
    const rawOa = lines
      .map((l) => OA_LINE.exec(l.trim()))
      .filter(Boolean)
      .map((m) => m[1])
      .join('');
    const builtOa = built.map((b) => b.answer).join('');
    if (rawOa !== builtOa) fail(`${set.slug}：切题后的 OA 序列与源文件不符\n  源 ${rawOa}\n  出 ${builtOa}`);

    // ② 交接说明里记录的基准序列
    if (set.baseline && set.baseline !== rawOa) {
      fail(`${set.slug}：源文件 OA 序列与基准不符\n  基准 ${set.baseline}\n  源   ${rawOa}`);
    }

    // ③ 解析里的 Answer: X
    let crossed = 0;
    for (const b of built) {
      if (!b.answerTags.length) continue;
      const uniq = [...new Set(b.answerTags)];
      if (uniq.length !== 1 || uniq[0] !== b.answer) {
        fail(`${set.slug} Q${b.number}：解析里的 Answer ${b.answerTags.join('/')} 与 OA ${b.answer} 不符`);
      } else crossed++;
    }

    perSet.push({ set, built, rawOa, crossed });
    all.push(...built);
  }

  // qid 唯一性：GMAT 内部 + 与现有 data\ 下所有库
  const qids = new Map();
  for (const b of all) {
    if (qids.has(b.qid)) fail(`qid 重复：${b.qid}（${qids.get(b.qid)} / ${b.id}）`);
    qids.set(b.qid, b.id);
  }
  for (const other of collectExistingQids()) {
    if (qids.has(other.qid)) fail(`qid 与现有题库冲突：${other.qid}（${other.file}）`);
  }

  if (errors.length) {
    console.error(`[convert-gmat] 校验未通过，未写入任何文件（${errors.length} 项）：`);
    for (const e of errors) console.error(`    ${e}`);
    process.exit(1);
  }

  // 幂等：整目录重建（题目 md 全部重写，图片按引用复制）
  for (const set of SETS) fs.rmSync(path.join(DST, set.slug), { recursive: true, force: true });
  for (const { set, built } of perSet) {
    const dir = path.join(DST, set.slug);
    fs.mkdirSync(dir, { recursive: true });
    for (const b of built) fs.writeFileSync(path.join(dir, `${b.id}.md`), b.body, 'utf-8');
  }

  // 图片：只复制被题面/解析引用到的
  const wanted = new Set();
  for (const b of all) {
    for (const m of b.body.matchAll(/!\[[^\]]*\]\((?:Image|images)\/([^)]+)\)/g)) wanted.add(path.basename(m[1].trim()));
    for (const m of b.body.matchAll(/!\[\[(?:Image|images)\/([^\]|]+?)(?:\|\d+)?\]\]/g)) wanted.add(path.basename(m[1].trim()));
  }
  const imgDst = path.join(DST, 'Image');
  fs.rmSync(imgDst, { recursive: true, force: true });
  let copied = 0;
  const missingImages = [];
  if (wanted.size) {
    fs.mkdirSync(imgDst, { recursive: true });
    for (const name of wanted) {
      const from = path.join(SRC, 'Image', name);
      if (!fs.existsSync(from)) { missingImages.push(name); continue; }
      fs.copyFileSync(from, path.join(imgDst, name));
      copied++;
    }
  }

  // 回读产物，再比一次答案序列（誊写事故就是败在「写完没回读」）
  for (const { set, rawOa } of perSet) {
    const dir = path.join(DST, set.slug);
    const files = fs.readdirSync(dir).filter((n) => n.endsWith('.md'));
    const back = files
      .map((n) => {
        const raw = fs.readFileSync(path.join(dir, n), 'utf-8');
        const num = Number(/^number:\s*Q(\d+)$/m.exec(raw)?.[1] ?? 0);
        const ans = /^## 答案\s*\n([A-E])\s*$/m.exec(raw)?.[1] ?? '?';
        return { num, ans };
      })
      .sort((a, b) => a.num - b.num)
      .map((x) => x.ans)
      .join('');
    if (back !== rawOa) {
      console.error(`[convert-gmat] 回读校验失败：${set.slug}\n  源 ${rawOa}\n  盘 ${back}`);
      process.exit(1);
    }
  }

  console.log(`[convert-gmat] 源：${SRC}`);
  for (const { set, built, rawOa, crossed } of perSet) {
    const withSolution = built.filter((b) => b.solution).length;
    console.log(
      `[convert-gmat] ${set.slug.padEnd(17)} ${String(built.length).padStart(3)} 题 · 解析 ${String(withSolution).padStart(3)} 条 · Answer 交叉验证 ${String(crossed).padStart(3)} 条 · OA ${rawOa}`
    );
  }
  console.log(`[convert-gmat] 合计 ${all.length} 题，写入 ${path.relative(ROOT, DST)}`);
  console.log(`[convert-gmat] 图片：引用 ${wanted.size} 张，复制 ${copied} 张`);
  if (missingImages.length) {
    console.error(`[convert-gmat] 缺失图片 ${missingImages.length} 张：${missingImages.join(', ')}`);
    process.exit(1);
  }
}

/** 扫 data\ 下除 GMAT 外的全部 md，取 qid，用于冲突检查 */
function collectExistingQids(dir = path.join(ROOT, 'data'), out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    if (name === 'GMAT' && dir === path.join(ROOT, 'data')) continue;
    const full = path.join(dir, name);
    let stat;
    try { stat = fs.statSync(full); } catch { continue; }
    if (stat.isDirectory()) collectExistingQids(full, out);
    else if (name.endsWith('.md')) {
      const m = /^qid:\s*(\S+)/m.exec(fs.readFileSync(full, 'utf-8').slice(0, 800));
      if (m) out.push({ qid: m[1], file: path.relative(ROOT, full) });
    }
  }
  return out;
}

main();
