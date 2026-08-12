import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  chartGeometry,
  practiceOverview,
  practiceQids,
  trendPoints,
} from '../src/lib/progress.ts';

const panelPath = 'src/components/progress/ProgressPanel.tsx';
const cssPath = 'src/components/progress/Progress.module.css';
const libPath = 'src/lib/progress.ts';
const examPath = 'src/components/exam/ExamApp.tsx';
const recordsPath = 'src/lib/records.ts';
const deckPath = 'src/components/deck/CardDeck.tsx';

test('the progress panel ships as its own view with no unlock gate', () => {
  assert.equal(fs.existsSync(panelPath), true, 'missing ProgressPanel');
  assert.equal(fs.existsSync(cssPath), true, 'missing Progress styles');
  assert.equal(fs.existsSync(libPath), true, 'missing progress helpers');

  const exam = fs.readFileSync(examPath, 'utf8');
  const deck = fs.readFileSync(deckPath, 'utf8');

  // 第三个 stage 子视图，phase 仍是四相
  assert.match(exam, /type StageView = 'deck' \| 'zone' \| 'progress'/);
  assert.match(exam, /stageView === 'progress'/);
  assert.match(exam, /<ProgressPanel/);

  // 两处入口：deck 提示行上方的统计条 + 成绩页的次级链接
  assert.match(deck, /progress\.onOpen/);
  assert.match(deck, /styles\.progressBtn/);
  assert.match(exam, /leaveDeckFor\('progress'\)/);
  assert.match(exam, /onClick=\{openProgressFromResult\}/);

  // 硬约束：进度面板不许有任何解锁门槛
  assert.doesNotMatch(deck, /progress[\s\S]{0,200}hiddenUnlocked/);
  const panel = fs.readFileSync(panelPath, 'utf8');
  assert.doesNotMatch(panel, /hiddenUnlocked|HIDDEN_UNLOCK_COUNT|locked/);
});

test('the missed list is ranked by wrongRanking and can start a retry run', () => {
  const panel = fs.readFileSync(panelPath, 'utf8');
  const exam = fs.readFileSync(examPath, 'utf8');

  // 错题榜确实走既有的 wrongRanking，不是另写一套排序
  assert.match(panel, /wrongRanking/);
  assert.match(panel, /import \{[\s\S]*?wrongRanking[\s\S]*?\} from '@\/lib\/records'/);
  // 先整体排序、再过滤、最后才截断：反过来的话前 10 全是诊断题就会得到空榜
  assert.match(panel, /wrongRanking\(records, Number\.POSITIVE_INFINITY\)/);
  assert.doesNotMatch(panel, /wrongRanking\(records, MISSED_LIMIT\)/);

  // 重练的是榜上渲染出来的那几行本身，不再由 pickQidsForMode 掺新题
  assert.match(panel, /onClick=\{\(\) => onRetry\(missed\.map\(\(row\) => row\.qid\)\)\}/);
  assert.match(exam, /const retryMissed = \(qids: number\[\]\) => \{/);
  assert.match(exam, /start\(\{ db: 'ALL', qids \}\)/);
  // start 支持显式 qid 列表，并在这一层再滤一次 diag（调用方已滤过，这是第二道闸）
  assert.match(exam, /override\?\.qids \?\? pickQidsForMode/);
  assert.match(exam, /index\.filter\(\(entry\) => !entry\.diag && selected\.has\(entry\.qid\)\)/);
  // 按钮只在榜上有行时渲染：出现即字面为真，不需要再靠置灰兜底
  assert.match(panel, /\{missed\.length > 0 && \(\s*<button/);
  // 同步调用链（requestFullscreen 只认手势）
  assert.doesNotMatch(exam, /setTimeout\([^)]*start\(\{/);
});

test('a failed pick has a visible exit in every stage view', () => {
  const exam = fs.readFileSync(examPath, 'utf8');
  const panel = fs.readFileSync(panelPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  // errMsg 只挂在配置面板、deckHint 只挂在 CardDeck，
  // 进度视图必须有自己的出口，否则「重练这些」失败会完全静默
  assert.match(exam, /error=\{error\}/);
  assert.match(panel, /error: string;/);
  assert.match(panel, /\{error && <p className=\{styles\.error\}>\{error\}<\/p>\}/);
  assert.match(css, /\.error\s*\{/);
  // 换视图时清掉上一个视图留下的错误，免得串台
  assert.match(exam, /setError\(''\); \/\/ 上一个视图留下的抽题错误不带过去/);
});

test('the trend chart is reachable without sight or a mouse', () => {
  const panel = fs.readFileSync(panelPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  // svg 的 role="img" 会把子树变成呈现性内容；等价文本清单补回这份数据
  assert.match(panel, /role="img"/);
  assert.match(panel, /<ul className=\{styles\.srOnly\} aria-label=\{t\.progress\.sessionsAria\}>/);
  assert.match(panel, /\{detailText\(p\)\}/);
  assert.match(css, /\.srOnly\s*\{[\s\S]*?clip: rect\(0, 0, 0, 0\)/);
  // 轴标是给眼睛看的，读屏走清单，别念两遍
  assert.match(panel, /className=\{styles\.axis\} aria-hidden="true"/);
  // list-style: none 在 Safari/VoiceOver 会丢列表语义，显式补 role
  assert.match(panel, /className=\{styles\.missedList\} role="list"/);
});

test('progress helpers behave, not just exist', () => {
  // records.s 是新场次在前；折线要按时间正序，且只取最近 TREND_LIMIT 场
  const session = (ts, n, right, sec) => ({ ts, db: 'TMUA', mode: 'practice', n, right, answered: n, sec });
  const records = {
    v: 1,
    q: {},
    s: [session(300, 10, 9, 100), session(200, 10, 5, 200), session(100, 10, 1, 300)],
  };
  const points = trendPoints(records, 30);
  assert.deepEqual(
    points.map((p) => p.session.ts),
    [100, 200, 300],
    'trendPoints must flip newest-first storage into chronological order',
  );
  assert.equal(points[2].accuracy, 0.9);
  assert.equal(points[0].pace, 30);
  assert.equal(trendPoints(records, 2).length, 2, 'the limit must cap the series');

  // n = 0 的脏场次不能产出 NaN，否则整条折线的 path 会变成 "NaN,NaN"
  const zero = trendPoints({ v: 1, q: {}, s: [session(1, 0, 0, 0)] }, 30)[0];
  assert.equal(zero.accuracy, 0);
  assert.equal(zero.pace, 0);
  assert.equal(Number.isNaN(zero.accuracy), false);

  // 只有一场时不能除以 (count - 1)
  const one = chartGeometry(1);
  assert.equal(Number.isFinite(one.x(0)), true);
  assert.equal(one.x(0), one.width / 2, 'a single point sits in the middle of the plot area');
  assert.equal(Number.isFinite(one.band), true);
  assert.ok(one.band > 0, 'the single hit target must still have width');
  const many = chartGeometry(30);
  assert.ok(many.x(29) > many.x(0));
  assert.equal(many.lineY(1) < many.lineY(0), true, 'higher accuracy must sit higher up');

  // diag 排除 + 练习池口径
  const index = [
    { qid: 1, db: 'TMUA' },
    { qid: 2, db: 'TMUA' },
    { qid: 9, db: 'GMAT', diag: true },
  ];
  const pool = practiceQids(index);
  assert.equal(pool.has(1), true);
  assert.equal(pool.has(9), false, 'diag questions must never enter the practice pool');

  const stats = practiceOverview(
    {
      v: 1,
      q: {
        1: { a: 4, w: 1, t: 0, c: 1 },
        2: { a: 2, w: 2, t: 0, c: 0 },
        9: { a: 5, w: 5, t: 0, c: 0 },
      },
      s: [],
    },
    pool,
  );
  assert.equal(stats.seen, 2, 'the diag record must not be counted');
  assert.equal(stats.attempts, 6);
  assert.equal(stats.wrongNow, 1);
  assert.equal(stats.accuracy, 0.5);
  assert.equal(practiceOverview({ v: 1, q: {}, s: [] }, pool).accuracy, 0);
});

test('the record tools live in one place and reset their file input', () => {
  const exam = fs.readFileSync(examPath, 'utf8');
  const panel = fs.readFileSync(panelPath, 'utf8');

  // 记录管理整块只有一份：配置面板里不许再留一套
  assert.doesNotMatch(exam, /styles\.recordSummary/);
  assert.doesNotMatch(exam, /styles\.recordActions/);
  assert.doesNotMatch(exam, /importInputRef/);
  assert.match(panel, /styles\.recordActions/);

  // 同一个文件连选两次也要能触发 change
  assert.match(panel, /event\.target\.value = '';/);
  assert.match(panel, /ref=\{fileRef\}/);

  // 导出/清空按整档记录算：只有诊断记录的用户不该被错误禁用
  assert.match(panel, /tools\.busy \|\| tools\.recordCount === 0/);
  assert.match(exam, /recordCount: recordOverview\.seen/);
});

test('Escape means something different in each stage view', () => {
  const exam = fs.readFileSync(examPath, 'utf8');
  const deck = fs.readFileSync(deckPath, 'utf8');

  // deck：不处理 Escape（工牌自己那套除外），守卫直接放行
  assert.match(exam, /if \(e\.key !== 'Escape' \|\| stageView === 'deck'\) return;/);
  assert.doesNotMatch(deck, /'Escape'/);
  // zone / progress：退回 deck
  assert.match(exam, /backToDeck\(\);\s*\n\s*\}\}/);
  // 焦点在表单控件里时 Escape 归控件（撤销输入、收起下拉）
  assert.match(exam, /\['INPUT', 'SELECT', 'TEXTAREA'\]\.includes\(target\.tagName\)/);
  // 工牌浮层开着时它先吃这一下
  assert.match(exam, /document\.querySelector\('\[aria-modal="true"\]'\)/);
});

test('diagnostic questions are filtered out of both the missed list and the retry pool', () => {
  const panel = fs.readFileSync(panelPath, 'utf8');
  const records = fs.readFileSync(recordsPath, 'utf8');
  const index = JSON.parse(fs.readFileSync('public/exam/index.json', 'utf8'));

  // 正：题库里确实存在 diag 条目，所以这层过滤是有负载的，不是空跑
  const diag = index.filter((entry) => entry.diag);
  assert.ok(diag.length > 0, 'the index must actually carry diag entries for this guard to matter');

  // 正：错题榜的池子由 practiceQids 划定，而它排除 diag
  assert.match(panel, /practiceQids/);
  assert.match(panel, /practice\.has\(row\.qid\)/);
  const lib = fs.readFileSync(libPath, 'utf8');
  assert.match(lib, /if \(!entry\.diag\) out\.add\(entry\.qid\)/);

  // 正：重练的池子是 activeIndex，而 indexForLibraryMode 同样排除 diag
  assert.match(records, /indexForLibraryMode[\s\S]*?!entry\.diag/);

  // 正：统计块与 deck 统计条也走同一个池子，否则会出现
  // 「N 道当前错题」而榜上列不出那么多条
  assert.match(panel, /practiceOverview\(records, practice\)/);
  const exam = fs.readFileSync(examPath, 'utf8');
  assert.match(exam, /practiceOverview\(records, practiceQids\(index\)\)/);
  assert.match(exam, /practiceStats\.wrongNow/);

  // 反：面板不许把原始 index 直接当池子用，也不许用不分池的 overview() 出统计
  assert.doesNotMatch(panel, /index\.map\(\(entry\) => entry\.qid\)/);
  assert.doesNotMatch(panel, /overview\(records\)/);
});

test('progress motion stays on the compositor and degrades to instant', () => {
  const css = fs.readFileSync(cssPath, 'utf8');

  const declarations = css.match(/transition:[^;]*/g) || [];
  assert.ok(declarations.length >= 1, 'expected the progress panel to declare transitions');
  for (const declaration of declarations) {
    for (const banned of ['width', 'height', 'top', 'left', 'margin', 'filter', 'box-shadow']) {
      assert.equal(
        declaration.includes(banned),
        false,
        `non-composited property "${banned}" in ${declaration.trim()}`,
      );
    }
  }

  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /-webkit-backdrop-filter/);
  assert.doesNotMatch(css, /backdrop-filter/);
});

test('the trend chart is hand-rolled SVG that follows the theme tokens', () => {
  const panel = fs.readFileSync(panelPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  assert.match(panel, /viewBox=/);
  // 线宽不随视口缩放，且不用 preserveAspectRatio="none"（会把图形拉扁）
  assert.match(panel, /vectorEffect="non-scaling-stroke"/);
  assert.doesNotMatch(panel, /preserveAspectRatio="none"/);
  // 颜色只准走 token，一个字面色都不许有
  assert.doesNotMatch(panel, /#[0-9a-fA-F]{3,8}\b/);
  assert.match(css, /stroke: var\(--accent\)/);
  assert.match(css, /fill: color-mix\(in srgb, var\(--accent\)/);
  // 375px 下线上不画可见点，靠透明矩形当命中区
  assert.match(css, /\.hit\s*\{[\s\S]*?fill: transparent/);
  assert.match(panel, /className=\{styles\.hit\}/);

  // 面板不挂全局监听，也不做布局测量
  assert.doesNotMatch(panel, /addEventListener/);
  assert.doesNotMatch(panel, /getBoundingClientRect/);
});

test('per-question history reads the pre-session snapshot, and the exam runtime is untouched', () => {
  const exam = fs.readFileSync(examPath, 'utf8');

  // 快照在开考那一刻拍；渲染时读 records 会在导出的 await 窗口里跳数
  assert.match(exam, /historyAtStartRef/);
  assert.match(exam, /historyAtStartRef\.current = records;/);
  assert.match(exam, /historyFor\(historyAtStartRef\.current, qq\.qid\)/);
  assert.match(exam, /做过 \$\{past\.a\} 次 · 错过 \$\{past\.w\} 次/);

  // 幂等哨兵与 exam 运行时哨兵原样
  assert.match(exam, /if \(savedResultRef\.current\) return savedResultRef\.current;/);
  assert.match(exam, /if \(phase !== 'exam' \|\| !q\) return;/);
});

test('the workbook gains a read-only session sheet without touching the import contract', () => {
  const records = fs.readFileSync(recordsPath, 'utf8');

  // 表名与表头是导出的常量，测试引用常量本身而不是各写一份字面量
  assert.match(records, /export const SESSIONS_SHEET_NAME = 'Sessions'/);
  assert.match(records, /export const SESSION_HEADERS = \[/);
  for (const column of [
    'Date',
    'Bank',
    'Mode',
    'Questions',
    'Correct',
    'Answered',
    'Seconds',
  ]) {
    assert.ok(records.includes(`'${column}'`), `the session sheet must carry a ${column} column`);
  }

  // 导入端一个字没动：仍只认主表、仍返回 s: []
  assert.match(records, /item\.sheet === SHEET_NAME \|\| item\.sheet === LEGACY_SHEET_NAME/);
  assert.match(records, /return \{ v: 1, q, s: \[\] \};/);
  assert.doesNotMatch(records, /SESSIONS_SHEET_NAME[\s\S]{0,400}importRecordsWorkbook/);

  // 导入会清空场次历史，确认框必须先说清楚
  const exam = fs.readFileSync(examPath, 'utf8');
  assert.match(exam, /t\.records\.importConfirmSessions/);
});
