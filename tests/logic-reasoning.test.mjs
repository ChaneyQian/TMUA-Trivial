import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// 「逻辑推理」认的是题库自己的知识点打标（topics 含 Logic and Proof，
// 或 subtopics 正好是 Logic），不是 TMUA 的 Paper 2 整卷。
// 这组测试盯四件事：
//   1. 构建期的 logic / tagged 标记与 md 源文件里的标签严丝合缝
//   2. 取消勾选只排除「已标注」的题——没打标的一律留下
//   3. 覆盖率如实披露：打标只做了一部分，面板上得说得出这个开关管得到多少题
//   4. 开关只收窄抽题池——365 解锁计数、卡面徽章、Grill、Diagnostic 一律不受影响
//
// 显式带 .ts 扩展名：node --experimental-strip-types 直接跑源码，ESM 解析器不补
import { pickGrillQids } from '../src/lib/grill.ts';
import { DICT } from '../src/lib/i18n.ts';
import {
  HIDDEN_UNLOCK_COUNT,
  LOGIC_REASONING_KEY,
  availableCountForMode,
  createEmptyRecords,
  indexForLibraryMode,
  indexForLogicReasoning,
  isHiddenModeUnlocked,
  loadIncludeLogicReasoning,
  logicCoverage,
  pickQidsForMode,
  saveIncludeLogicReasoning,
  validCompletedCount,
} from '../src/lib/records.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const examPath = 'src/components/exam/ExamApp.tsx';
const cssPath = 'src/components/exam/Exam.module.css';

/**
 * 一份混了各种标记的小索引，用来看清每层滤网各自丢掉了谁。
 * 关键是 1 和 5：没打标的题，取消勾选时必须原样留下——
 * 「认不出来」不等于「不是逻辑题」，更不等于可以排掉
 */
const MIXED = [
  { qid: 1, db: 'TMUA' }, // 没打标
  { qid: 2, db: 'TMUA', logic: true, tagged: true },
  { qid: 3, db: 'TMUA_MOCK', logic: true, tagged: true, hidden: true },
  { qid: 4, db: 'TMUA_MOCK', tagged: true, hidden: true }, // 打标了，但不是逻辑题
  { qid: 5, db: 'MAT' }, // 没打标
  { qid: 6, db: 'GMAT', diag: true },
];

/** 前 count 道题的索引，偶数号标成逻辑题（打标覆盖率 100% 的理想库） */
function halfLogic(count, db = 'TMUA') {
  return Array.from({ length: count }, (_, i) => {
    const qid = i + 1;
    return qid % 2 === 0 ? { qid, db, logic: true, tagged: true } : { qid, db, tagged: true };
  });
}

function answeredAll(index) {
  const records = createEmptyRecords();
  for (const entry of index) records.q[String(entry.qid)] = { a: 1, w: 0, t: 1, c: 1 };
  return records;
}

// ---- 构建产物的对照实现 ----
//
// 下面这套判定是特意用「土办法」重写的：把 frontmatter 里某个键的取值段整段
// 截出来再找标签，不碰 build-data 的列表解析。它要是照抄生产实现，
// 就只能证明两份代码长得一样，证明不了标记对不对。

function frontmatterOf(raw) {
  const m = raw.match(/^﻿?---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : '';
}

/** 某个键的取值段：行内 `[a, b]` 和块状的若干 `- a` 都落在这一段里 */
function fieldBlock(frontmatter, key) {
  const lines = frontmatter.split(/\r?\n/);
  const start = lines.findIndex((line) => new RegExp(`^${key}\\s*:`).test(line));
  if (start === -1) return '';
  const collected = [lines[start].replace(/^[^:]*:/, '')];
  for (const line of lines.slice(start + 1)) {
    if (/^[A-Za-z_]/.test(line)) break; // 下一个顶层键，取值段到此为止
    collected.push(line);
  }
  return collected.join('\n');
}

/**
 * 某个条目正好等于给定标签——前后必须是列表的边界（`[` `,` `]` 换行或块状的 `- `）。
 * 刻意不去拆条目：题库里既有带逗号的引号标签，也有 `Vieta's` 这种裸的撇号，
 * 逐条切分反而容易切错。直接在整段上卡边界，`Logical Puzzles` / `Logic and Proof`
 * 都不会被误当成 `Logic`
 */
function hasExactItem(block, label) {
  return new RegExp(`(^|[,[\\n]|-\\s)\\s*["']?${label}["']?\\s*($|[,\\]\\n])`, 'i').test(block);
}

/** 这一段里到底有没有东西：`[]` 和空块都算没标 */
function hasAnyItem(block) {
  return block.replace(/[[\]\s-]/g, '').length > 0;
}

function scanBank() {
  const bank = path.join(root, 'data');
  const files = [];
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      if (fs.statSync(full).isDirectory()) {
        if (name.startsWith('.') || ['image', 'images'].includes(name.toLowerCase())) continue;
        walk(full);
      } else if (name.endsWith('.md') && !name.endsWith('.bak')) files.push(full);
    }
  };
  walk(bank);

  const byQid = new Map();
  for (const file of files) {
    const frontmatter = frontmatterOf(fs.readFileSync(file, 'utf-8'));
    const qid = Number((frontmatter.match(/^qid\s*:\s*(\d+)/m) || [])[1]);
    if (!qid) continue;
    const topics = fieldBlock(frontmatter, 'topics');
    const subtopics = fieldBlock(frontmatter, 'subtopics');
    byQid.set(qid, {
      file,
      logic: /logic and proof/i.test(topics) || hasExactItem(subtopics, 'Logic'),
      tagged: hasAnyItem(topics) || hasAnyItem(subtopics),
    });
  }
  return byQid;
}

test('build-data marks exactly the questions the bank itself tagged as logic', (t) => {
  // 建到临时目录：npm test 并发跑各文件，原地重建 public\exam 会撞上别人的读窗口
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-logic-reasoning-'));
  t.after(() => fs.rmSync(outputDir, { recursive: true, force: true }));

  execFileSync(process.execPath, [path.join(root, 'scripts', 'build-data.mjs')], {
    cwd: root,
    stdio: 'pipe',
    env: { ...process.env, EXAM_OUT: outputDir },
  });

  const index = JSON.parse(fs.readFileSync(path.join(outputDir, 'index.json'), 'utf8'));
  const source = scanBank();

  // 逐条对回 md 源文件。期望值全部从数据现算，不写死题数——
  // 打标是会持续补的，写死只会让这条测试变成维护负担
  const wrongLogic = [];
  const wrongTagged = [];
  for (const entry of index) {
    const truth = source.get(entry.qid);
    assert.ok(truth, `index 里的 ${entry.qid} 在 data\\ 下找不到源文件`);
    if (truth.logic !== !!entry.logic) wrongLogic.push(entry.qid);
    if (truth.tagged !== !!entry.tagged) wrongTagged.push(entry.qid);
  }
  assert.deepEqual(wrongLogic, [], '这些题的 logic 标记和它自己的标签对不上');
  assert.deepEqual(wrongTagged, [], '这些题的 tagged 标记和它自己的标签对不上');

  const marked = index.filter((entry) => entry.logic);
  assert.ok(marked.length > 0, '一道逻辑题都没标出来，判定多半没生效');
  assert.deepEqual([...new Set(marked.map((entry) => entry.logic))], [true], '只在为真时写');
  assert.equal(
    marked.every((entry) => entry.tagged),
    true,
    '逻辑题必然是打过标的题，覆盖率提示的分母得包住分子',
  );
  assert.equal(
    index.some((entry) => entry.logic && entry.diag),
    false,
    'GMAT 诊断集没有知识点打标，不该混进这个开关',
  );

  // 判定跨库生效：卷别口径只够得着 TMUA，标签口径每个库都可能有
  const banks = [...new Set(marked.map((entry) => entry.db))];
  assert.ok(banks.length >= 3, `逻辑题只出现在 ${banks.join('/')}，标签口径不该只覆盖一个体系`);

  // Paper 2 整卷这个旧口径彻底退场，index 里不该再有它的痕迹
  assert.equal(
    index.some((entry) => 'p2' in entry),
    false,
    'p2 标记应当已经整个删掉',
  );

  // 这条是本次口径纠正的立论：卷别和知识点根本不是一回事。
  // 只要下面两个数还都大于 0，拿 Paper 2 当代理就必然既错杀又漏判
  const paperOf = (qid) =>
    JSON.parse(fs.readFileSync(path.join(outputDir, 'q', `${qid}.json`), 'utf8'));
  let p1Logic = 0;
  let p2NotLogic = 0;
  for (const entry of index.filter((e) => e.db === 'TMUA')) {
    const question = paperOf(entry.qid);
    const isPaperTwo = /-P2-/i.test(question.id) || /\bP2\b/.test(question.paper);
    if (!isPaperTwo && entry.logic) p1Logic++;
    if (isPaperTwo && !entry.logic) p2NotLogic++;
  }
  assert.ok(p1Logic > 0, 'Paper 1 里也有逻辑题，卷别口径会漏掉它们');
  assert.ok(p2NotLogic > 0, 'Paper 2 里大量题目不是逻辑题，卷别口径会错杀它们');
});

test('unticking removes only tagged logic questions and keeps everything untagged', () => {
  assert.deepEqual(
    indexForLogicReasoning(MIXED, true).map((entry) => entry.qid),
    [1, 2, 3, 4, 5, 6],
    '勾选时原样放行，一条不动',
  );
  assert.deepEqual(
    indexForLogicReasoning(MIXED, false).map((entry) => entry.qid),
    [1, 4, 5, 6],
    '只丢已标注的逻辑题；没打标的 1 / 5 必须留下，打标了但非逻辑的 4 也留下',
  );

  // 反面：若把「没打标」也当成可疑一并排掉，MAT 这种库会当场清空
  const untaggedOnly = [
    { qid: 7, db: 'MAT' },
    { qid: 8, db: 'MAT' },
  ];
  assert.deepEqual(
    indexForLogicReasoning(untaggedOnly, false).map((entry) => entry.qid),
    [7, 8],
    '一道都没打标的库，关掉开关也不该少一题',
  );

  // 两层复合：题库范围先滤，标签后滤，各自的口径都不受对方影响。
  // 两个区互斥（P6 用户裁定）：classic 只有非 hidden，9.0 只有 hidden
  const classic = indexForLibraryMode(MIXED, 'classic');
  assert.deepEqual(classic.map((entry) => entry.qid), [1, 2, 5]);
  assert.deepEqual(indexForLogicReasoning(classic, false).map((entry) => entry.qid), [1, 5]);

  const expanded = indexForLibraryMode(MIXED, 'hidden');
  assert.deepEqual(expanded.map((entry) => entry.qid), [3, 4]);
  assert.deepEqual(indexForLogicReasoning(expanded, false).map((entry) => entry.qid), [4]);
});

test('coverage reports what the switch can actually reach in the chosen bank', () => {
  // MIXED 里 TMUA 有 2 题：1 没打标、2 是逻辑题
  assert.deepEqual(logicCoverage(MIXED, 'TMUA'), { logic: 1, tagged: 1, total: 2 });
  assert.deepEqual(logicCoverage(MIXED, 'TMUA_MOCK'), { logic: 1, tagged: 2, total: 2 });
  // MAT 一题没打标：开关在这里一道题也管不到，分子为 0
  assert.deepEqual(logicCoverage(MIXED, 'MAT'), { logic: 0, tagged: 0, total: 1 });
  assert.deepEqual(logicCoverage(MIXED, 'ALL'), { logic: 2, tagged: 3, total: 6 });

  // 分母是「当前范围内的总题数」，所以它必须读收窄之前的池子。
  // 若拿过滤后的池子去算，勾掉开关会让提示自己缩水成 0，用户永远看不明白
  const narrowed = indexForLogicReasoning(MIXED, false);
  assert.equal(logicCoverage(narrowed, 'ALL').logic, 0);
  assert.notDeepEqual(logicCoverage(narrowed, 'ALL'), logicCoverage(MIXED, 'ALL'));

  // 分子永远包在分母里，占比不会算出 >100%
  for (const db of ['TMUA', 'TMUA_MOCK', 'MAT', 'ALL']) {
    const cov = logicCoverage(MIXED, db);
    assert.ok(cov.logic <= cov.tagged && cov.tagged <= cov.total, `${db} 的三个数没套住`);
  }
});

test('the checkbox shows for any bank that has tagged logic questions, and hides otherwise', () => {
  // 显示条件就是 logic > 0：标签口径下每个库都可能有逻辑题，
  // 不再像卷别口径那样能预先写死是 TMUA 那几个库
  for (const db of ['TMUA', 'TMUA_MOCK', 'ALL']) {
    assert.ok(logicCoverage(MIXED, db).logic > 0, `${db} 有已标注的逻辑题，开关要出现`);
  }
  assert.equal(logicCoverage(MIXED, 'MAT').logic, 0, 'MAT 一道标注过的逻辑题都没有，开关不该出现');

  const noLogic = [{ qid: 1, db: 'SMC', tagged: true }];
  assert.equal(logicCoverage(noLogic, 'SMC').logic, 0, '全标完但没有逻辑题时同样不出现');
});

test('every pick mode stops surfacing logic questions once the switch is off, and the pool shrinks with it', () => {
  const index = halfLogic(40);
  const records = createEmptyRecords();
  const on = indexForLogicReasoning(indexForLibraryMode(index, 'classic'), true);
  const off = indexForLogicReasoning(indexForLibraryMode(index, 'classic'), false);

  for (const db of ['TMUA', 'ALL']) {
    // 题数档位读的就是这个数（P0 已有机制），池子缩了它自然跟着缩
    assert.equal(availableCountForMode(on, db, 'random', records), index.length);
    assert.equal(availableCountForMode(off, db, 'random', records), off.length);
    assert.ok(off.length < on.length, '关掉开关必须真的收窄池子');

    for (const mode of ['random', 'wrong-and-new', 'new-only']) {
      const picked = pickQidsForMode(off, db, off.length, mode, records);
      assert.equal(picked.length, off.length, `${db} / ${mode} 应当凑得满收窄后的池子`);
      assert.equal(
        picked.every((qid) => qid % 2 === 1),
        true,
        `${db} / ${mode} 抽到了逻辑题`,
      );
    }
  }

  // 关掉之后错题优先那条支路也不该把逻辑题捞回来
  const withWrong = createEmptyRecords();
  for (const qid of [2, 4, 6, 8]) withWrong.q[String(qid)] = { a: 1, w: 1, t: 1, c: 0 };
  const picked = pickQidsForMode(off, 'TMUA', 10, 'wrong-and-new', withWrong);
  assert.equal(picked.some((qid) => qid % 2 === 0), false, '错题里的逻辑题也不该回来');
});

test('the 365 unlock counts questions already answered, switch or no switch', () => {
  const index = halfLogic(HIDDEN_UNLOCK_COUNT);
  const records = answeredAll(index);

  assert.equal(validCompletedCount(index, records), HIDDEN_UNLOCK_COUNT);
  assert.equal(isHiddenModeUnlocked(index, records), true);

  // 反面：口径若跟着开关走，这个已经解锁的用户会当场被打回去。
  // 所以 ExamApp 必须把整份索引喂给解锁计数，而不是收窄后的抽题池
  const narrowed = indexForLogicReasoning(index, false);
  assert.equal(validCompletedCount(narrowed, records), narrowed.length);
  assert.ok(narrowed.length < HIDDEN_UNLOCK_COUNT);
  assert.equal(isHiddenModeUnlocked(narrowed, records), false);
});

test('Grill picks from the bound set without passing through the switch', () => {
  const index = [
    { qid: 11, db: 'GMAT', diag: true },
    { qid: 12, db: 'GMAT', diag: true },
    { qid: 13, db: 'TMUA', logic: true, tagged: true },
    { qid: 14, db: 'TMUA', tagged: true },
  ];
  const records = { v: 1, q: {}, s: [], grill: [11, 12, 13] };

  // 绑定集是 Diagnostic 留下的，滤网在这条路上根本不存在
  assert.deepEqual(pickGrillQids(index, records, 10, 'random').sort((a, b) => a - b), [11, 12, 13]);
});

test('without a window the preference reads as on and saving is a no-op', () => {
  assert.equal(typeof globalThis.window, 'undefined', '这条必须跑在没有 window 的环境里');
  assert.equal(loadIncludeLogicReasoning(), true);
  assert.doesNotThrow(() => saveIncludeLogicReasoning(false));
});

test('the preference persists under a versioned key and defaults to checked', (t) => {
  const store = new Map();
  globalThis.window = {};
  globalThis.localStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  };
  t.after(() => {
    delete globalThis.localStorage;
    delete globalThis.window;
  });

  assert.equal(LOGIC_REASONING_KEY, 'mcq-test:logic-reasoning:v1');
  assert.equal(loadIncludeLogicReasoning(), true, '没存过就是勾选');

  saveIncludeLogicReasoning(false);
  assert.equal(store.get(LOGIC_REASONING_KEY), '0');
  assert.equal(loadIncludeLogicReasoning(), false);

  saveIncludeLogicReasoning(true);
  assert.equal(loadIncludeLogicReasoning(), true);

  store.set(LOGIC_REASONING_KEY, 'maybe');
  assert.equal(loadIncludeLogicReasoning(), true, '认不出来的值一律当勾选，不猜');
});

test('both dictionaries name the switch and own up to the tagging gap', () => {
  for (const lang of ['zh', 'en']) {
    const { logicReasoning, logicCoverage: note } = DICT[lang].setup;
    assert.ok(logicReasoning.trim().length > 0, `${lang} 的开关文案是空的`);
    // 旧口径的措辞不该留在界面上：这个开关和 Paper 2 已经没有关系了
    assert.doesNotMatch(logicReasoning, /Paper\s*2/i, `${lang} 的开关文案还写着 Paper 2`);

    // 打标只做了一部分时，三个数都要出现，用户才对得上账
    const partial = note(13, 16, 309, true);
    for (const n of ['13', '16', '309', '293']) {
      assert.ok(partial.includes(n), `${lang} 的覆盖率文案漏了 ${n}`);
    }
    assert.ok(partial.includes('5%'), `${lang} 的覆盖率文案该给出占比`);

    // 全部打标完的库不该再讲「还有没整理的题」——那是没有的事
    const full = note(26, 674, 674, true);
    assert.ok(full.includes('26') && full.includes('674'));
    assert.equal(full.includes('0%'), false, `${lang} 全覆盖时不该出现 0% 这种残数`);
    assert.notEqual(full, partial, '两种覆盖情况得说不同的话');
  }
  assert.notEqual(
    DICT.zh.setup.logicReasoning,
    DICT.en.setup.logicReasoning,
    '这条不是考试专名，两种语言必须真的翻过',
  );
  assert.notEqual(DICT.zh.setup.logicCoverage(1, 2, 3, true), DICT.en.setup.logicCoverage(1, 2, 3, true));
});

test('the setup panel wires the switch into the pick pool and nowhere else', () => {
  const exam = fs.readFileSync(examPath, 'utf8');

  // 抽题池 = 题库范围滤过之后再过这层
  assert.match(exam, /const scopedIndex = indexForLibraryMode\(/);
  assert.match(exam, /indexForLogicReasoning\(scopedIndex, includeLogic\)/);
  // 覆盖率读的是收窄之前那一层，否则勾掉开关后提示自己就变了
  assert.match(exam, /logicCoverage\(scopedIndex, db\)/);

  // 解锁计数 / 卡面徽章 / Grill 拿的都是整份索引
  for (const call of [
    'validCompletedCount(index, records)',
    'hiddenUnlockProgress(index, records)',
    'isHiddenModeUnlocked(index, records)',
    "indexForLibraryMode(index, 'classic')",
    "indexForLibraryMode(index, 'hidden')",
    'pickGrillQids(index, records',
  ]) {
    assert.ok(exam.includes(call), `${call} 必须读整份索引，不能读收窄后的池子`);
  }
  for (const forbidden of [
    'validCompletedCount(activeIndex',
    'hiddenUnlockProgress(activeIndex',
    'isHiddenModeUnlocked(activeIndex',
    'pickGrillQids(activeIndex',
  ]) {
    assert.equal(exam.includes(forbidden), false, `${forbidden} 会让开关漏进不该管的地方`);
  }

  // 默认勾选，回读在 effect 里（首帧必须和静态导出的 HTML 一致），落盘写在 setter 里
  assert.match(exam, /const \[includeLogic, setIncludeLogic\] = useState\(true\)/);
  assert.match(exam, /useEffect\(\(\) => \{\s*setIncludeLogic\(loadIncludeLogicReasoning\(\)\);/);
  assert.match(exam, /saveIncludeLogicReasoning\(next\)/);

  // 面板上是一行勾选加一行覆盖率说明，挂在「题库」那一组下面，
  // 且只在当前范围内真有已标注的逻辑题时才渲染
  assert.match(exam, /\{logicCov\.logic > 0 && \(/);
  assert.match(exam, /type="checkbox"/);
  assert.match(exam, /checked=\{includeLogic\}/);
  assert.match(exam, /\{t\.setup\.logicReasoning\}/, '文案必须走字典');
  // 末位是勾选状态：文案要按已勾/已取消换时态，见下面那条时态测试
  assert.match(
    exam,
    /t\.setup\.logicCoverage\(logicCov\.logic, logicCov\.tagged, logicCov\.total, includeLogic\)/,
  );
  const switchAt = exam.indexOf('logicCov.logic > 0');
  assert.ok(
    exam.indexOf('t.setup.fieldBank') < switchAt && switchAt < exam.indexOf('t.setup.fieldMode'),
    '这行勾选属于「题库」那一组，排在模式之前',
  );

  // 旧的整卷口径不该在应用层留下任何残迹
  for (const gone of ['logicReasoningApplies', 'entry.p2', '.p2 ']) {
    assert.equal(exam.includes(gone), false, `${gone} 是 Paper 2 口径的遗留，应当删干净`);
  }
});

test('the checkbox borrows the existing panel styling instead of inventing its own', () => {
  const exam = fs.readFileSync(examPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  assert.match(exam, /styles\.segRow/);
  assert.match(exam, /styles\.checkLabel.*styles\.segActive/s, '选中态复用 segActive');
  // 边框/圆角/字号照抄 segBtn，用的还是同一套主题变量
  assert.match(css, /\.checkLabel \{[^}]*border-radius: 8px;/s);
  assert.match(css, /\.checkLabel \{[^}]*var\(--surface-alt\)/s);
  assert.match(css, /\.checkBox \{[^}]*accent-color: var\(--accent\)/s);
  // 说明文字独占一行，不跟勾选框挤在一排
  assert.match(css, /\.checkNote \{[^}]*flex-basis: 100%;/s);
  assert.match(css, /\.checkNote \{[^}]*var\(--text-muted\)/s);
});

test('the frontmatter parser keeps a block list alive across blank lines and comments', () => {
  // 题库是在 Obsidian 里手编的，`topics:` 和第一个 `- x` 之间夹一个空行或
  // 一行注释都很自然。断在那里等于整条标签静默丢失，而且丢得毫无痕迹
  const bank = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-parser-bank-'));
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-parser-out-'));

  const write = (name, frontmatter) => {
    fs.mkdirSync(path.join(bank, 'TMUA', '2020'), { recursive: true });
    fs.writeFileSync(
      path.join(bank, 'TMUA', '2020', name),
      `---\n${frontmatter}\n---\n\n## 题目\nWhat is $1+1$?\n\n$$\n\mathbf {A} \quad 1\n$$\n\n$$\n\mathbf {B} \quad 2\n$$\n\n## 答案\nB\n`,
    );
  };

  const base = (qid, id) =>
    `database: TMUA\nqid: ${qid}\nid: ${id}\npaper: TMUA P1\nyear: 2020\nnumber: Q1\nsection: Applications\ndifficulty: 0`;

  write('20-P1-Q1.md', `${base(20200210100, '20-P1-Q1')}\ntopics:\n\n  - Logic and Proof\nstatus: 已入库`);
  write('20-P1-Q2.md', `${base(20200210200, '20-P1-Q2')}\nsubtopics:\n  # 这一行是注释\n  - Logic\nstatus: 已入库`);
  write('20-P1-Q3.md', `${base(20200210300, '20-P1-Q3')}\ntopics: []\nsubtopics: []\nstatus: 已入库`);

  try {
    execFileSync(process.execPath, [path.join(root, 'scripts', 'build-data.mjs')], {
      cwd: root,
      stdio: 'pipe',
      env: { ...process.env, EXAM_OUT: outputDir, BANK_PATH: bank },
    });
    const index = JSON.parse(fs.readFileSync(path.join(outputDir, 'index.json'), 'utf8'));
    const byQid = new Map(index.map((entry) => [entry.qid, entry]));

    assert.equal(byQid.get(20200210100)?.logic, true, '空行不该打断块状列表');
    assert.equal(byQid.get(20200210200)?.logic, true, '注释行不该打断块状列表');
    assert.equal(byQid.get(20200210300)?.logic, undefined, '空列表仍然算未打标');
    assert.equal(byQid.get(20200210300)?.tagged, undefined);
  } finally {
    fs.rmSync(bank, { recursive: true, force: true });
    fs.rmSync(outputDir, { recursive: true, force: true });
  }
});

test('the coverage note speaks in the right tense and never says "this bank" for a mixed pool', () => {
  for (const [lang, dict] of Object.entries(DICT)) {
    const on = dict.setup.logicCoverage(118, 324, 360, true);
    const off = dict.setup.logicCoverage(118, 324, 360, false);

    // 勾掉之后还写「取消勾选后就不再抽到」，读起来像没生效
    assert.notEqual(on, off, `${lang}: 两种勾选状态的文案必须不同`);
    if (lang === 'zh') {
      assert.match(on, /取消勾选后就不再抽到/);
      assert.match(off, /已排除/);
      assert.doesNotMatch(off, /取消勾选后就不再抽到/);
      // 选混合时横跨好几个库，说「本题库」就错了
      assert.doesNotMatch(on, /本题库/);
      assert.match(on, /所选范围/);
    } else {
      assert.match(on, /unticking leaves them out/);
      assert.match(off, /being left out/);
      assert.doesNotMatch(off, /unticking leaves them out/);
      assert.doesNotMatch(on, /this bank/);
      assert.match(on, /this selection/);
    }

    // 全覆盖的库没有免责声明可讲
    const full = dict.setup.logicCoverage(26, 674, 674, true);
    assert.doesNotMatch(full, /\d+%/, `${lang}: 100% 打标时不必再报百分比`);

    // 切区瞬间可能出现空范围，百分比不能算成 NaN
    const empty = dict.setup.logicCoverage(0, 0, 0, true);
    assert.doesNotMatch(empty, /NaN/, `${lang}: 空范围不该渲染出 NaN`);
  }
});

test('an empty pool points back at the switch that emptied it', () => {
  const exam = fs.readFileSync(examPath, 'utf8');

  // 「该题库没有可用题目」本身不指向开关，而开关就在同屏上方
  assert.match(exam, /!includeLogic && logicCov\.logic > 0 &&/);
  assert.match(exam, /t\.setup\.emptyBankLogicHint\(logicCov\.logic\)/);
  for (const dict of Object.values(DICT)) {
    const hint = dict.setup.emptyBankLogicHint(10);
    assert.match(hint, /10/, '提示里要给出勾回来能多出多少题');
  }

  // 覆盖率那行是开关的实话，读屏用户也得听得到
  assert.match(exam, /aria-describedby="logic-coverage-note"/);
  assert.match(exam, /id="logic-coverage-note"/);
});
