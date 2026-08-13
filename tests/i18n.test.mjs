import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

// 外层（选区 deck + 配置面板）是中英双语的，内层（考试运行时、成绩页、
// 工牌、宠物）刻意保持中文原文。这组测试盯两件事：
//   1. 字典两种语言的键完全对齐，且都不是空壳
//   2. 外层组件的交互文案确实走字典，没有把中文写死回去
// 内层有中文是设计，不在这里拦。

const DICT_PATH = 'src/lib/i18n.ts';
const CTX_PATH = 'src/lib/LangContext.tsx';
const TOGGLE_PATH = 'src/components/LangToggle.tsx';
const DECK_PATH = 'src/components/deck/CardDeck.tsx';
const ZONES_PATH = 'src/components/deck/zones.ts';
const EXAM_PATH = 'src/components/exam/ExamApp.tsx';

const dict = await import('../src/lib/i18n.ts');

/** 把嵌套字典拍平成 'a.b.c' → 'string' | 'function'，用来比对两种语言 */
function shape(node, prefix = '') {
  const out = {};
  for (const [key, value] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) Object.assign(out, shape(value, path));
    else out[path] = typeof value;
  }
  return out;
}

test('the zh and en dictionaries expose exactly the same keys and value kinds', () => {
  const zh = shape(dict.DICT.zh);
  const en = shape(dict.DICT.en);

  assert.deepEqual(
    Object.keys(zh).sort(),
    Object.keys(en).sort(),
    'every key must exist in both languages',
  );
  // 一边是字符串另一边是函数会在调用点炸掉，类型也要对齐
  for (const key of Object.keys(zh)) {
    assert.equal(en[key], zh[key], `${key} must have the same value kind in both languages`);
  }
  assert.ok(Object.keys(zh).length >= 80, 'the outer-layer dictionary looks suspiciously small');
});

test('no dictionary entry is blank, and the two languages actually differ', () => {
  const zh = dict.DICT.zh;
  const en = dict.DICT.en;

  const blanks = [];
  const identical = [];
  const walk = (a, b, prefix = '') => {
    for (const [key, value] of Object.entries(a)) {
      const path = prefix ? `${prefix}.${key}` : key;
      const other = b[key];
      if (typeof value === 'object' && value !== null) {
        walk(value, other, path);
        continue;
      }
      if (typeof value === 'string') {
        if (!value.trim()) blanks.push(path);
        if (value === other) identical.push(path);
      }
    }
  };
  walk(zh, en);

  assert.deepEqual(blanks, [], 'these entries are empty');
  // 少数条目两语言天然相同（考试名缩写、纯符号），列成白名单，其余必须真的翻过
  assert.deepEqual(
    identical.sort(),
    // diagnostic.title 和 9.0 Trivial 一样是功能专名，两边都叫 Diagnostic Test
    ['diagnostic.title', 'langToggle.title', 'zone.sub.classic', 'zone.title.trivial'],
    'these entries are identical in both languages — translate them or whitelist them here',
  );
});

test('parameterised entries interpolate their arguments in both languages', () => {
  for (const lang of ['zh', 'en']) {
    const t = dict.DICT[lang];
    assert.match(t.setup.fieldCount(42), /42/, `${lang} fieldCount must show the count`);
    assert.match(t.cardBadge.questions(7), /7/, `${lang} questions badge must show the count`);
    assert.match(t.deck.chargeLabel(3, 365), /3.*365/, `${lang} charge label must show both numbers`);
    // block.unlockNeed 已随「锁定 9.0 改进 Diagnostic 介绍页」删掉，
    // 换成诊断这边的参数化文案
    assert.match(t.diagnostic.rulePass(36, 40), /36.*40/, `${lang} rulePass must show both numbers`);
    assert.match(t.diagnostic.chance(1, 2), /1.*2/, `${lang} chance must show which attempt`);
    assert.match(t.diagnostic.grillBound(12), /12/, `${lang} grillBound must show the count`);
    assert.match(
      t.setup.quickSummary('TMUA', 'Practice', 10),
      /TMUA.*Practice.*10/,
      `${lang} quickSummary must show bank, mode and count`,
    );
    assert.match(t.errors.indexLoadHttp(503), /503/, `${lang} index error must show the status`);
  }
});

test('the language choice defaults to Chinese and persists under a versioned key', () => {
  assert.equal(dict.DEFAULT_LANG, 'zh', 'the site stays Chinese by default');
  assert.equal(dict.LANG_KEY, 'mcq-test:lang:v1');
  assert.equal(dict.isLang('zh'), true);
  assert.equal(dict.isLang('en'), true);
  assert.equal(dict.isLang('fr'), false, 'unknown values must fall back, not be trusted');
  assert.equal(dict.isLang(null), false);

  const ctx = fs.readFileSync(CTX_PATH, 'utf8');
  // 回读必须在 effect 里：静态导出的首帧是默认语言，同步读 localStorage 会水合不匹配
  assert.match(ctx, /useEffect\(\(\) => \{[\s\S]*?localStorage\.getItem\(LANG_KEY\)/);
  assert.match(ctx, /localStorage\.setItem\(LANG_KEY, next\)/);
  assert.match(ctx, /useState<Lang>\(DEFAULT_LANG\)/);
});

test('modules outside the React tree read the language through the module mirror', () => {
  // lib/exam.ts / lib/records.ts 抛错时要按当前语言取文案，但它们拿不到 context
  const examLib = fs.readFileSync('src/lib/exam.ts', 'utf8');
  const recordsLib = fs.readFileSync('src/lib/records.ts', 'utf8');

  assert.match(examLib, /from '\.\/i18n(\.ts)?'/);
  assert.match(examLib, /strings\(\)\.errors\.indexLoadHttp/);
  assert.match(recordsLib, /strings\(\)\.errors\./);

  dict.setActiveLang('en');
  assert.equal(dict.getActiveLang(), 'en');
  assert.equal(dict.s().errors.indexLoad, dict.DICT.en.errors.indexLoad);
  dict.setActiveLang('zh');
  assert.equal(dict.s().errors.indexLoad, dict.DICT.zh.errors.indexLoad);
});

test('the outer layer renders its copy from the dictionary, not from literals', () => {
  const deck = fs.readFileSync(DECK_PATH, 'utf8');
  const zones = fs.readFileSync(ZONES_PATH, 'utf8');
  const exam = fs.readFileSync(EXAM_PATH, 'utf8');

  // 卡面文案搬进字典后，zones.ts 只剩与语言无关的结构
  assert.doesNotMatch(zones, /title:\s*'/, 'zone titles must live in the dictionary');
  assert.doesNotMatch(zones, /sub:\s*'/, 'zone subtitles must live in the dictionary');
  assert.match(zones, /comingSoon: boolean;/, 'the structural table itself must stay');

  assert.match(deck, /useLang\(\)/);
  assert.match(deck, /t\.zone\.title\[zone\.id\]/);
  assert.match(deck, /t\.zone\.sub\[zone\.id\]/);
  assert.match(deck, /t\.deck\.headSub/);
  assert.match(deck, /aria-label=\{t\.deck\.groupAria\}/);
  assert.match(deck, /t\.deck\.keys/);

  // 配置面板的字段标签与主按钮
  assert.match(exam, /useLang\(\)/);
  for (const key of [
    't.setup.fieldBank',
    't.setup.fieldMode',
    't.setup.fieldPick',
    't.setup.fieldCount(totalPool)',
    't.setup.start',
    't.setup.keyboard',
    // cardBadge.comingSoon 随 P3「三区全开」一起删了；zone.sub 现在由 ExamApp 按状态覆盖
    't.grill.emptySub',
  ]) {
    assert.ok(exam.includes(key), `the setup panel must render ${key} from the dictionary`);
  }

  // 做题记录整块已经搬进进度面板，字典键跟着一起走
  const progress = fs.readFileSync('src/components/progress/ProgressPanel.tsx', 'utf8');
  assert.match(progress, /useLang\(\)/);
  for (const key of [
    't.records.field',
    't.records.importBtn',
    't.records.exportBtn',
    't.records.clearBtn',
    't.progress.title',
    't.progress.missedRetry',
  ]) {
    assert.ok(progress.includes(key), `the progress panel must render ${key} from the dictionary`);
  }
});

test('the language toggle ships as a round button in the setup stage only', () => {
  const toggle = fs.readFileSync(TOGGLE_PATH, 'utf8');
  const css = fs.readFileSync('src/components/LangToggle.module.css', 'utf8');
  const exam = fs.readFileSync(EXAM_PATH, 'utf8');

  assert.match(toggle, /useLang\(\)/);
  assert.match(toggle, /onClick=\{toggle\}/);
  assert.match(toggle, /aria-label=\{t\.langToggle\.aria\}/);
  assert.match(css, /border-radius:\s*50%/, 'the toggle is the round ⚪ button the user asked for');
  assert.match(css, /position:\s*absolute/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);

  // 只挂在 setup 相的舞台里：考试运行时和成绩页不出现
  const stageAt = exam.indexOf('<LangToggle />');
  const resultAt = exam.indexOf('// ================= 成绩页 =================');
  assert.ok(stageAt > 0, 'the toggle must be mounted');
  assert.ok(stageAt < resultAt, 'the toggle belongs to the setup stage, above the result screen');
  assert.equal(exam.split('<LangToggle />').length - 1, 1, 'mount the toggle exactly once');
});

test('the inner layers keep their original Chinese copy', () => {
  // 这条是反向哨兵：范围收窄后，考试运行时/成绩页/工牌/宠物不该被翻掉
  const exam = fs.readFileSync(EXAM_PATH, 'utf8');
  const badge = fs.readFileSync('src/components/badge/IdBadge.tsx', 'utf8');
  const pet = fs.readFileSync('src/components/companion/PixelCompanion.tsx', 'utf8');
  const layout = fs.readFileSync('src/app/layout.tsx', 'utf8');

  assert.match(exam, /'批改'/, 'the grade button stays Chinese');
  assert.match(exam, /'下一题' : '交卷'/, 'the exam runtime stays Chinese');
  assert.match(exam, /回答正确/, 'practice feedback stays Chinese');
  assert.match(exam, /确认交卷/, 'the submit dialog stays Chinese');
  assert.match(exam, /空白=未作答/, 'the navigator legend stays Chinese');
  assert.match(exam, /统计后再来一次/, 'the result screen stays Chinese');
  assert.match(exam, /你已窥见更多的可能性/, 'the unlock overlay stays Chinese');
  assert.match(badge, /title: '数学爱好者'/, 'the badge identity stays Chinese');
  assert.match(pet, /idle: '正在待机'/, 'the companion stays Chinese');
  // 页面主体仍是中文，html lang 不跟着切换
  assert.match(layout, /<html lang="zh-CN">/);
});
