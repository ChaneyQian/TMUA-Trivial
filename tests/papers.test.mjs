import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// 卷面进度墙（Paper progress）：进度面板里一套卷一个小方格，颜色深浅＝
// 这套卷已做题数的占比。这组测试盯五件事：
//   1. 构建产物只收进了 index 的题，一道诊断题都不进，卷内 qid 与 index 同序
//   2. 分卷粒度＝展示用卷号，和考试页题头的 sourceLabel 是同一条规则
//   3. 范围口径：墙上只出现用户够得着的卷，锁定用户看不见扩展卷的卷名（不剧透）
//   4. 五档颜色两头不含糊：做了 1 题不能显示成没做，差 1 题不能显示成完卷
//   5. 面板懒取、失败整块不渲染，且不认得解锁规则
//
// 显式带 .ts 扩展名：node --experimental-strip-types 直接跑源码，ESM 解析器不补
import { DICT } from '../src/lib/i18n.ts';
import {
  PAPER_LEVELS,
  cachedPapers,
  loadPapers,
  paperGroups,
  paperLevel,
  paperProgress,
  paperShort,
  resetPapersCache,
} from '../src/lib/papers.ts';
import { createEmptyRecords, reachableIndex } from '../src/lib/records.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const panelPath = 'src/components/progress/ProgressPanel.tsx';
const cssPath = 'src/components/progress/Progress.module.css';
const examPath = 'src/components/exam/ExamApp.tsx';
const buildPath = 'scripts/build-data.mjs';

/** 建到临时目录：node --test 并发跑各文件，原地重建 public\exam 会撞上别人的读窗口 */
function buildInto(t, env = {}) {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-papers-'));
  t.after(() => fs.rmSync(outputDir, { recursive: true, force: true }));
  const built = spawnSync(process.execPath, [path.join(root, 'scripts', 'build-data.mjs')], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, EXAM_OUT: outputDir, ...env },
  });
  assert.equal(built.status, 0, `build-data 挂了：\n${built.stderr}`);
  const read = (name) => JSON.parse(fs.readFileSync(path.join(outputDir, name), 'utf8'));
  return {
    outputDir,
    log: `${built.stdout}${built.stderr}`,
    index: read('index.json'),
    papers: read('papers.json'),
    question: (qid) => read(path.join('q', `${qid}.json`)),
  };
}

/**
 * 结构断言要看真正跑起来的代码。注释里提一嘴文件名是说明，不是「组件自己拼 URL」，
 * 不剥注释的话 doesNotMatch 会被自己的说明文字绊倒。
 */
function codeOnly(source) {
  return source
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

/** 考试页题头那条规则的对照实现，刻意不从 build-data 里 import */
function expectedLabel(question) {
  const { paper, year } = question;
  if (!year || paper.includes(String(year))) return paper;
  return `${paper} ${year}`;
}

/** 一份小卷单 + 对应的小索引：classic / hidden 各有，另有一道诊断题 */
const FIXTURE = {
  v: 1,
  papers: [
    { key: 'TMUA|TMUA P1 2020', db: 'TMUA', label: 'TMUA P1 2020', qids: [104, 103, 102, 101] },
    { key: 'TMUA|TMUA P2 2020', db: 'TMUA', label: 'TMUA P2 2020', qids: [202, 201] },
    {
      key: 'TMUA_MOCK|TMUA Mock Zetta P1',
      db: 'TMUA_MOCK',
      label: 'TMUA Mock Zetta P1',
      hidden: true,
      qids: [302, 301],
    },
  ],
};

const SCOPE = [
  { qid: 104, db: 'TMUA' },
  { qid: 103, db: 'TMUA' },
  { qid: 102, db: 'TMUA' },
  { qid: 101, db: 'TMUA' },
  { qid: 202, db: 'TMUA' },
  { qid: 201, db: 'TMUA' },
  { qid: 302, db: 'TMUA_MOCK', hidden: true },
  { qid: 301, db: 'TMUA_MOCK', hidden: true },
  { qid: 901, db: 'GMAT', diag: true },
];

function recordsOf(qids) {
  const records = createEmptyRecords();
  for (const qid of qids) records.q[String(qid)] = { a: 1, w: 0, t: 1, c: 1 };
  return records;
}

const setOf = (entries) => new Set(entries.map((entry) => entry.qid));

test('the paper list carries only questions that made it into the index', (t) => {
  const { index, papers } = buildInto(t);

  assert.equal(papers.v, 1);
  assert.deepEqual(Object.keys(papers).sort(), ['papers', 'v'], 'papers.json 的形状是约定的两个键');
  assert.ok(papers.papers.length > 0, '一套卷都没有，整条管线多半没生效');

  const indexed = new Map(index.map((entry) => [entry.qid, entry]));
  const seen = new Set();
  for (const paper of papers.papers) {
    // hidden 不落盘：运行时没有任何代码读它（防剧透靠 reachable 求交），
    // 留在公开 JSON 里就是一份零收益的「哪些卷锁着」名单
    assert.deepEqual(
      Object.keys(paper).sort(),
      ['db', 'key', 'label', 'qids'],
      `${paper.key} 冒出了约定之外的键`,
    );
    assert.ok(paper.qids.length > 0, `${paper.key} 是个空卷，本就不该写进来`);
    assert.equal(paper.key, `${paper.db}|${paper.label}`, 'key 就是「库|卷号」');

    for (const qid of paper.qids) {
      // 悬空 qid 一个不留：墙上的分母若含取不回来的题，永远差那么几道
      const entry = indexed.get(qid);
      assert.ok(entry, `${paper.key} 里的 ${qid} 不在 index 里`);
      assert.equal(entry.db, paper.db, `${qid} 的库和它所在的卷对不上`);
      assert.equal(entry.diag, undefined, `${paper.key} 里混进了诊断题 ${qid}`);
      assert.equal(seen.has(qid), false, `${qid} 出现在不止一套卷里`);
      seen.add(qid);
    }
    assert.deepEqual(
      [...paper.qids].sort((a, b) => b - a),
      paper.qids,
      `${paper.key} 的 qid 应与 index 同序（降序）`,
    );
    // 「不存在半 hidden 的卷」这个不变量仍要钉住：它是卷墙「整卷可及/不可及」
    // 语义的前提。真出现混卷，锁定用户会看到被悄悄缩小的分母
    const hiddenCount = paper.qids.filter((qid) => indexed.get(qid).hidden).length;
    assert.ok(
      hiddenCount === 0 || hiddenCount === paper.qids.length,
      `${paper.key} 是半 hidden 的混卷（${hiddenCount}/${paper.qids.length}）`,
    );
  }

  // 反面：每一道非诊断的题都必须落进某一套卷，一道都不能掉在墙外
  const orphans = index.filter((entry) => !entry.diag && !seen.has(entry.qid));
  assert.deepEqual(orphans.map((entry) => entry.qid), [], '这些题没有归属的卷');
  // 正面：这份数据不是空跑——真有锁着的卷，也真有开放的卷
  // hidden 不再落盘，「真有锁着的卷」这个正向前提改从 index 现算
  const hiddenPapers = papers.papers.filter((paper) =>
    paper.qids.every((qid) => indexed.get(qid)?.hidden),
  );
  assert.ok(hiddenPapers.length > 0, '一套 hidden 卷都没有，范围口径就成了摆设');
  assert.ok(papers.papers.some((paper) => paper.qids.some((qid) => !indexed.get(qid)?.hidden)));
});

test('a paper is one displayed paper number, spelled exactly like the exam header', (t) => {
  const { papers, question } = buildInto(t);

  for (const paper of papers.papers) {
    // 分卷粒度＝题头上那一行。paper 里已经写了年份就不重复拼
    // （「ECAA 2021 Section 1 Part B」不该变成「… Part B 2021」）
    for (const qid of paper.qids) {
      assert.equal(expectedLabel(question(qid)), paper.label, `${qid} 的题头和它所在的卷号对不上`);
    }
  }

  const labels = papers.papers.map((paper) => paper.label);
  // 三种体例都要真的出现，这条比对才有负载
  assert.ok(labels.includes('MAT 2024'), '年份型卷号');
  assert.ok(labels.some((label) => /^TMUA Mock \S+ P\d$/.test(label)), 'Mock 的套名 + 卷号');
  assert.ok(labels.some((label) => /^ECAA \d{4} Section/.test(label)), 'ECAA 的长卷号');
  // 同一个库里卷号不许重名，否则两套卷会被并成一格
  assert.equal(new Set(papers.papers.map((paper) => paper.key)).size, papers.papers.length);
});

test('papers are grouped by bank in the site order, newest paper first', (t) => {
  const { papers } = buildInto(t);
  const order = ['TMUA', 'TMUA_MOCK', 'MAT', 'SMC', 'ECAA', 'AMC'];

  // 分组靠「同库的行连续」，排序在构建期做完，前端只收段——所以这里
  // 必须钉住同一个库不会被切成两段
  const dbs = papers.papers.map((paper) => paper.db);
  const runs = dbs.filter((db, i) => db !== dbs[i - 1]);
  assert.deepEqual(runs, [...new Set(dbs)], '同一个库的卷必须连续排在一起');
  assert.deepEqual(
    [...new Set(dbs)],
    order.filter((db) => dbs.includes(db)),
    '库的顺序要和站内固定顺序一致',
  );

  // 库内新卷在前：qid 前几位就是年份，按卷内最大 qid 降序即可
  for (let i = 1; i < papers.papers.length; i++) {
    const previous = papers.papers[i - 1];
    const current = papers.papers[i];
    if (previous.db !== current.db) continue;
    assert.ok(previous.qids[0] > current.qids[0], `${current.key} 排到了 ${previous.key} 前面`);
  }

  // 前端只负责收段，不重排——排序逻辑只该有一处
  const grouped = paperGroups(paperProgress(papers, new Set(papers.papers.flatMap((p) => p.qids)), createEmptyRecords()));
  assert.deepEqual(grouped.map((group) => group.db), [...new Set(dbs)]);
  assert.equal(
    grouped.reduce((sum, group) => sum + group.papers.length, 0),
    papers.papers.length,
  );
});

test('index.json keeps its frozen shape — paper data lives in its own file', (t) => {
  const { index, outputDir } = buildInto(t);

  // 白名单和 weak-topics / diagnostic 那两条同源：index 每次冷启动都要下载，
  // 卷面数据只有打开进度面板才用得到，不该挤进来
  for (const entry of index) {
    for (const key of Object.keys(entry)) {
      assert.ok(
        ['qid', 'db', 'hidden', 'diag', 'logic', 'tagged'].includes(key),
        `index 里冒出了新键 ${key}`,
      );
    }
  }
  assert.ok(fs.existsSync(path.join(outputDir, 'papers.json')), 'papers.json 应当单独落盘');

  // 这份文件是每次打开进度面板都要下的，别让它悄悄长成兆级
  const bytes = fs.statSync(path.join(outputDir, 'papers.json')).size;
  assert.ok(bytes < 80 * 1024, `papers.json 长到了 ${bytes} 字节，该想想编码了`);
});

test('the wall only shows papers the user can actually reach', () => {
  const records = recordsOf([101, 102, 301]);

  // 未解锁：扩展卷整卷够不着 → 连卷名都不出现在墙上（不剧透）。
  // 「不剧透」这件事全靠这个集合落实，面板本身不认得解锁规则
  const locked = paperProgress(FIXTURE, setOf(reachableIndex(SCOPE, false)), records);
  assert.deepEqual(locked.map((row) => row.label), ['TMUA P1 2020', 'TMUA P2 2020']);
  assert.equal(
    locked.some((row) => row.label.includes('Mock')),
    false,
    '锁定用户的墙上不该出现扩展卷的卷名',
  );

  // 解锁之后扩展卷进来，经典卷一套没少——复盘口径是跨区的
  const unlocked = paperProgress(FIXTURE, setOf(reachableIndex(SCOPE, true)), records);
  assert.deepEqual(unlocked.map((row) => row.label), [
    'TMUA P1 2020',
    'TMUA P2 2020',
    'TMUA Mock Zetta P1',
  ]);

  // 分子分母的口径：做过（作答过至少一次）的题 / 卷内够得着的题
  assert.deepEqual(
    unlocked.map((row) => [row.done, row.total]),
    [
      [2, 4],
      [0, 2],
      [1, 2],
    ],
  );
  assert.equal(unlocked[0].ratio, 0.5);
  // 做过但 a=0 的脏记录不算「做过」
  const zeroAttempts = createEmptyRecords();
  zeroAttempts.q['101'] = { a: 0, w: 0, t: 1, c: 1 };
  assert.equal(paperProgress(FIXTURE, setOf(reachableIndex(SCOPE, true)), zeroAttempts)[0].done, 0);

  // 卷单里有、但索引里已经没有的 qid 不进分母；整卷都没了就整行不产出
  const stale = paperProgress(FIXTURE, new Set([101]), records);
  assert.deepEqual(stale.map((row) => [row.label, row.total]), [['TMUA P1 2020', 1]]);
  assert.deepEqual(paperProgress(FIXTURE, new Set(), records), []);
  assert.deepEqual(paperGroups([]), []);
});

test('the five colour levels never round away "barely started" or "one to go"', () => {
  assert.equal(PAPER_LEVELS, 5);

  // 两头各自独占一档：做了 1/25 显示成底灰，人会以为自己没碰过；
  // 24/25 显示成满档，等于替用户宣布完卷
  assert.equal(paperLevel(0, 25), 0);
  assert.equal(paperLevel(1, 25), 1, '做了一题就不能再是底灰');
  assert.equal(paperLevel(24, 25), 3, '差一题不能显示成完卷');
  assert.equal(paperLevel(25, 25), 4);

  // 中间三档按比例分
  assert.equal(paperLevel(8, 25), 1);
  assert.equal(paperLevel(9, 25), 2);
  assert.equal(paperLevel(17, 25), 3);

  // 单调不减，且始终落在 0..4
  let previous = 0;
  for (let done = 0; done <= 25; done++) {
    const level = paperLevel(done, 25);
    assert.ok(level >= previous, `${done}/25 的档位比前一档还低`);
    assert.ok(level >= 0 && level < PAPER_LEVELS);
    previous = level;
  }

  // 脏数据不炸：分母为 0、分子超出分母
  assert.equal(paperLevel(0, 0), 0);
  assert.equal(paperLevel(3, 0), 0);
  assert.equal(paperLevel(30, 25), 4);
});

test('the cell name drops what the group heading already said', () => {
  // 分组小标题已经写了库名，格子上重复一遍纯属浪费那点宽度
  assert.equal(paperShort('TMUA P1 2020', 'TMUA'), 'P1 2020');
  assert.equal(paperShort('MAT 2023 Additional', 'MAT'), '2023 Additional');
  assert.equal(paperShort('SMC 1998', 'SMC'), '1998');
  assert.equal(paperShort('TMUA Mock JZMaths_SetE P2', 'TMUA_MOCK'), 'JZMaths_SetE P2');
  // ECAA 每套卷都带同一串后缀，那串字对区分是哪套卷毫无帮助
  assert.equal(paperShort('ECAA 2021 Section 1 Part B', 'ECAA'), '2021');
  assert.equal(paperShort('ECAA Spec Section 1 Part B 2015', 'ECAA'), 'Spec 2015');

  // 剪不动就原样留着，绝不剪成认不出来的样子；也绝不剪成空串
  assert.equal(paperShort('TMUA', 'TMUA'), 'TMUA', '整个卷名就是库名时不该被剪空');
  assert.equal(paperShort('Something Else', 'MAT'), 'Something Else');
  assert.equal(paperShort('MAT 2024', 'UNKNOWN_DB'), 'MAT 2024');
  for (const [label, db] of [['TMUA P1', 'TMUA'], ['ECAA 2016 Section 1 Part B', 'ECAA']]) {
    assert.ok(paperShort(label, db).trim().length > 0, `${label} 被剪成了空串`);
  }
});

test('papers.json is fetched once, lazily, and a failure is not cached', async (t) => {
  const original = globalThis.fetch;
  let calls = 0;
  t.after(() => {
    globalThis.fetch = original;
    resetPapersCache();
  });

  resetPapersCache();
  assert.equal(cachedPapers(), null, '没取过就该是空的——面板据此决定整块渲不渲染');

  // 先让它失败一次：取不到不能被缓存成「永远没有」
  globalThis.fetch = async () => {
    calls++;
    return { ok: false, status: 503, json: async () => ({}) };
  };
  await assert.rejects(loadPapers());
  assert.equal(cachedPapers(), null);

  globalThis.fetch = async (url) => {
    calls++;
    assert.match(String(url), /\/exam\/papers\.json$/, '取的必须是独立的那个文件');
    return { ok: true, status: 200, json: async () => FIXTURE };
  };

  const first = await loadPapers();
  const second = await loadPapers();
  assert.deepEqual(first, FIXTURE);
  assert.equal(second, first, '第二次该直接给缓存，不再发请求');
  assert.equal(calls, 2, `失败 1 次 + 成功 1 次，之后一次都不该再发（实际 ${calls} 次）`);

  // 并发两次也只发一个请求
  resetPapersCache();
  calls = 0;
  const [a, b] = await Promise.all([loadPapers(), loadPapers()]);
  assert.equal(a, b);
  assert.equal(calls, 1, '同时打开两次不该并发拉两份');

  // 200 但形状不对（代理/CDN 的 JSON 错误体、旧缓存撞上新结构）必须被形状闸
  // 挡在缓存之外——这批数据一旦入缓存，面板一开就在 papers 迭代处炸掉整个应用
  resetPapersCache();
  for (const junk of [{ ok: true }, { v: 2, papers: [] }, { v: 1, papers: 'x' }, null]) {
    globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => junk });
    await assert.rejects(loadPapers(), /shape/, `畸形负载 ${JSON.stringify(junk)} 不该被放进来`);
    assert.equal(cachedPapers(), null, '畸形负载绝不能入缓存');
  }
});

test('the panel loads the paper list lazily and hides the whole block when it is missing', () => {
  const panel = fs.readFileSync(panelPath, 'utf8');
  const exam = fs.readFileSync(examPath, 'utf8');

  // 懒取：和知识点倒排同一条路子，模块级缓存管跨次打开
  assert.match(panel, /useState<PapersData \| null>\(\(\) => cachedPapers\(\)\)/);
  assert.match(panel, /loadPapers\(\)/);
  assert.match(panel, /\.catch\(\(\) => \{\}\)/);
  // 取不到就整块不渲染，面板其余部分照常
  assert.match(panel, /\{wall\.length > 0 && \(/);
  // 路径归 lib 管，组件不该自己拼 URL
  assert.doesNotMatch(codeOnly(panel), /papers\.json/);
  assert.doesNotMatch(codeOnly(panel), /EXAM_DATA/);

  // 分档、缩写、分组都读 lib，不在组件里另写一套
  assert.match(panel, /paperLevel\(paper\.done, paper\.total\)/);
  assert.match(panel, /paperShort\(paper\.label, paper\.db\)/);
  assert.match(panel, /paperGroups\(paperProgress\(papers, reachSet, records\)\)/);
  assert.doesNotMatch(panel, /ratio [<>]|\/ paper\.total/);

  // 悬停提示补上缩写省掉的卷名与精确题数
  assert.match(panel, /title=\{t\.progress\.paperCell\(paper\.label, paper\.done, paper\.total\)\}/);
  // 口径行：分子分母各是什么，一句说清
  assert.match(panel, /t\.progress\.papersNote/);
  // 主题变量之外一个字面色都没有
  assert.doesNotMatch(panel, /#[0-9a-fA-F]{3,8}\b/);

  // 范围由外层划好递进来，面板不认得解锁规则，也不能成为绕过它的后门
  assert.match(panel, /reachable: IndexEntry\[\];/);
  assert.match(panel, /new Set\(reachable\.map\(\(entry\) => entry\.qid\)\)/);
  assert.doesNotMatch(panel, /hiddenUnlocked|HIDDEN_UNLOCK_COUNT|locked/);
  assert.match(exam, /reachable=\{reachable\}/);
});

test('the wall is a wrapping grid of tinted cells that cannot overflow a phone', () => {
  const css = fs.readFileSync(cssPath, 'utf8');

  // 375px 下不许横向溢出：格子随内容伸缩、整行 flex-wrap
  assert.match(css, /\.paperWall \{[^}]*display: flex/s);
  assert.match(css, /\.paperWall \{[^}]*flex-wrap: wrap/s);
  assert.match(css, /\.paperCell \{[^}]*max-width: 100%/s);
  assert.match(css, /\.paperCell \{[^}]*overflow: hidden/s);
  assert.match(css, /\.paperName \{[^}]*text-overflow: ellipsis/s);

  // 五档：0 走底色（不单独出类），1–3 把 accent 兑进底色，4 是满档
  for (const level of ['lv1', 'lv2', 'lv3']) {
    assert.match(css, new RegExp(`\\.${level} \\{[^}]*color-mix\\(in srgb, var\\(--accent\\)`, 's'));
  }
  assert.match(css, /\.lv4 \{[^}]*background: var\(--accent\)/s);
  assert.doesNotMatch(css, /\.lv0\s*\{/, '底灰就是格子本来的样子，不必另起一个类');
  // 深浅是单调加深的，不能中间某一档反而更淡
  const mix = (level) =>
    Number(
      (css.match(new RegExp(`\\.${level} \\{[^}]*background: color-mix\\(in srgb, var\\(--accent\\) (\\d+)%`, 's')) || [])[1],
    );
  assert.ok(mix('lv1') < mix('lv2') && mix('lv2') < mix('lv3'), '三档的深浅必须递增');
  // 满档给一个一眼认得出的态：整块 accent + 对钩，而对钩纯装饰（n/N 已经说清了）
  assert.match(css, /\.lv4 \.paperCount::before \{[^}]*content: '✓ '/s);
});

test('both dictionaries name the paper wall and state the ratio they are showing', () => {
  for (const [lang, dict] of Object.entries(DICT)) {
    const p = dict.progress;
    for (const key of ['papersTitle', 'papersNote']) {
      assert.ok(p[key]?.trim().length > 0, `${lang} 的 ${key} 是空的`);
    }
    // 口径行必须把分子分母说清楚，别让人对着颜色猜
    const cell = p.paperCell('TMUA P1 2020', 7, 20);
    for (const piece of ['TMUA P1 2020', '7', '20']) {
      assert.ok(cell.includes(piece), `${lang} 的悬停提示漏了 ${piece}`);
    }
    // 缩写会把卷名剪短，提示里必须留着完整的那一份
    assert.ok(cell.includes('TMUA P1 2020'), `${lang} 的提示要给出完整卷名`);
  }
  // 这些不是考试专名，两种语言必须真的翻过
  for (const key of ['papersTitle', 'papersNote']) {
    assert.notEqual(DICT.zh.progress[key], DICT.en.progress[key], `${key} 没翻`);
  }
});

test('the build script derives the paper label from one place', () => {
  const build = fs.readFileSync(buildPath, 'utf8');

  // 卷号规则只该有一份，且和写进单题 JSON 的 paper / year 同源
  assert.equal((build.match(/function fullPaperLabel\(/g) || []).length, 1);
  assert.match(build, /const label = fullPaperLabel\(paper, year\);/);
  // 产物落独立文件，index 那行一个字没动
  assert.match(build, /path\.join\(OUT, 'papers\.json'\)/);
  assert.match(build, /JSON\.stringify\(\{ v: 1, papers: paperList \}\)/);
  // 诊断集结构性排除：卷面清单跟着「非 diag」那个分支走
  assert.match(build, /if \(!indexEntry\.diag\) \{[\s\S]*?papers\.set\(key, entry\)/);
});
