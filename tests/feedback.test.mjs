import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

// P7-B 反馈感第一批：完卷仪式感（B2）、错题重练的闭环回执（B3）、
// 复烤区操作回执（B5）。三条都是「只加元素、不改判分」的东西，所以这组测试
// 盯的是它们的接线与边界：
//   1. 三条回执各自的触发条件，尤其是「不该出现的时候不出现」
//   2. 一律不落盘、不进 SessionRecord / XLSX 线格式 —— 它们是当场的一句话
//   3. 动效只走 transform / opacity，prefers-reduced-motion 一律降级
//   4. 成绩页与考试运行时是敏感区：既有的判分与流程一个字没动
//
// papersJustCompleted 本身的行为（哪几套卷算跨线、锁定用户不剧透）
// 在 tests/papers.test.mjs 里，那边有现成的卷单与索引夹具。

const EXAM_PATH = 'src/components/exam/ExamApp.tsx';
const EXAM_CSS = 'src/components/exam/Exam.module.css';
const GRILL_PATH = 'src/components/grill/GrillPanel.tsx';
const GRILL_CSS = 'src/components/grill/Grill.module.css';

const dict = await import('../src/lib/i18n.ts');
const recordsLib = await import('../src/lib/records.ts');

/** 结构断言要看真正跑起来的代码，注释里提一嘴不算 */
function codeOnly(source) {
  return source
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

const exam = fs.readFileSync(EXAM_PATH, 'utf8');
const examCode = codeOnly(exam);
const examCss = fs.readFileSync(EXAM_CSS, 'utf8');
const grill = fs.readFileSync(GRILL_PATH, 'utf8');
const grillCode = codeOnly(grill);
const grillCss = fs.readFileSync(GRILL_CSS, 'utf8');

/** 把一条 CSS 规则整段切出来（含 @keyframes / 媒体查询之外的普通规则） */
function rule(css, selector) {
  const at = css.indexOf(`${selector} {`);
  assert.notEqual(at, -1, `找不到样式规则 ${selector}`);
  return css.slice(at, css.indexOf('}', at) + 1);
}

test('the completion banner is computed from the pre-exam snapshot, never from live records', () => {
  // 「之前」读开考那一刻的快照。records 要等用户在成绩页点了某个按钮才落盘，
  // 读它会让横幅在点击那一刻才冒出来 —— 与逐题历史同一个理由
  assert.match(
    examCode,
    /papersJustCompleted\(papers, reach, historyAtStartRef\.current, answeredQids\)/,
  );
  assert.doesNotMatch(examCode, /papersJustCompleted\([^)]*\brecords\b/);

  // 「之后」＝快照 + 本场作答过的题。跳过的题不算做过，与 addSession 的口径一致
  assert.match(examCode, /if \(answers\[i\] !== null\) answeredQids\.add\(question\.qid\)/);
  // 范围仍走 reachable：锁定用户不会在横幅上看见扩展卷的卷名
  assert.match(examCode, /const reach = new Set\(reachable\.map\(\(entry\) => entry\.qid\)\)/);

  // 懒取：只在走到成绩页时才发请求，deck 首屏与考试运行时都不替它买单
  assert.match(examCode, /if \(phase !== 'result' \|\| papers\) return;/);
  assert.match(examCode, /loadPapers\(\)/);
  // 取不到就一直是 null → finishedPapers 恒空 → 整块不渲染，绝不挡成绩主体
  assert.match(examCode, /\.catch\(\(\) => \{\}\)/);
  assert.match(examCode, /\{finishedPapers\.length > 0 && \(/);

  // 一次性：不落盘、不进 localStorage。刷新成绩页就没了，这是明确接受的
  assert.doesNotMatch(examCode, /finishedPapers[\s\S]{0,400}localStorage/);
  assert.doesNotMatch(examCode, /mcq-test:finish/);
});

test('the completion banner reuses the charge-bar texture and degrades to instant', () => {
  const banner = rule(examCss, '.finishBanner');
  const mark = rule(examCss, '.finishMark');

  // 满格充电条那条青色渐变的既有纹理，不另调一套颜色
  assert.match(mark, /#00a8ad/);
  assert.match(mark, /#54e5df/);
  assert.match(mark, /#d6ffff/);
  // 大标题走公告牌同款：background-clip: text 不可用时退回实色，
  // 绝不显示成一块渐变色砖
  assert.match(examCss, /@supports \(background-clip: text\) or \(-webkit-background-clip: text\)/);
  assert.match(rule(examCss, '.finishTitle'), /color: #007f85/);

  // 合成器纪律：入场只动 transform / opacity，流光只推 background-position。
  // 逐帧扫关键帧本体，别让布局属性混进来
  const frames = (name) => {
    const at = examCss.indexOf(`@keyframes ${name}`);
    assert.notEqual(at, -1, `找不到 @keyframes ${name}`);
    return examCss.slice(at, examCss.indexOf('\n}', at));
  };
  const rise = frames('finishRise');
  assert.match(rise, /opacity/);
  assert.match(rise, /transform/);
  for (const banned of ['width', 'height', 'top', 'left', 'margin', 'filter', 'box-shadow']) {
    assert.equal(rise.includes(banned), false, `完卷横幅的入场动画动了 ${banned}`);
  }
  const flow = frames('finishFlow');
  assert.match(flow, /background-position/);
  for (const banned of ['width', 'height', 'transform', 'filter']) {
    assert.equal(flow.includes(banned), false, `流光动了 ${banned}`);
  }
  assert.doesNotMatch(banner, /transition:/, '横幅是一次性入场，不需要过渡');

  // prefers-reduced-motion 一律瞬显：横幅照常出现，只是不再有入场与流光
  const reduced = examCss.slice(examCss.indexOf('.finishBanner,'));
  assert.match(reduced, /^\.finishBanner,\s*\n\s*\.finishMark,\s*\n\s*\.finishTitle\s*\{[^}]*animation: none/);
  assert.match(
    examCss,
    /@media \(prefers-reduced-motion: reduce\) \{\s*\n[^}]*\n\s*\.finishBanner,/,
    '降级块必须真的在 prefers-reduced-motion 媒体查询里',
  );
});

test('the retry receipt only speaks when the session came from "retry these"', () => {
  // 来源标记只在开考的唯一入口写一次，不摊到各个调用点
  assert.match(examCode, /sessionOriginRef\.current = override\?\.origin \?\? null;/);
  assert.match(examCode, /void start\(\{ db: 'ALL', qids, origin: 'retry' \}\)/);
  // 另外两条复烤路径带的是别的标记，所以那句话不会跟着它们跑出来
  assert.match(examCode, /void start\(\{ db: 'ALL', qids, origin: 'topic' \}\)/);
  assert.match(examCode, /origin: 'grill'/);

  // 成绩页那一句只认 'retry'
  assert.match(examCode, /sessionOriginRef\.current === 'retry' && \(/);
  // 对比式文案（审查 N4）：光复述大比分没有信息量，要把「上次错的」说出来
  assert.match(exam, /上次错的这 \{questions\.length\} 道，这次对了 \{right\} 道/);

  // 不进 SessionRecord、不动 XLSX 线格式：它是当场的一句话，不是持久数据。
  // 线格式一旦多一列，用户手里已经存在的 .xlsx 就成了旧版文件
  assert.deepEqual(
    [...recordsLib.SESSION_HEADERS],
    ['Date', 'Bank', 'Mode', 'Questions', 'Correct', 'Answered', 'Seconds'],
    '场次导出表多了一列 —— 来源标记渗进线格式了',
  );
  assert.deepEqual([...recordsLib.HEADERS], [
    'QID',
    'Last Attempt',
    'Last Result',
    'Wrong Count',
    'Attempt Count',
  ]);
  const recordsSource = fs.readFileSync('src/lib/records.ts', 'utf8');
  assert.doesNotMatch(recordsSource, /GrillOrigin|sessionOrigin/, '来源标记不该渗进记录层');
  assert.match(examCode, /addSession\(\s*\n\s*records,/, '落盘调用的形状没有被动过');
});

test('the grill receipt survives a trip back to the panel but not a new session', () => {
  // 挂 state 不落盘
  assert.match(examCode, /const \[grillReceipt, setGrillReceipt\] = useState</);
  assert.doesNotMatch(examCode, /grillReceipt[\s\S]{0,200}localStorage/);

  // 开新场就清 —— 与来源标记写在同一处，日后加开考路径不会漏掉一个
  const startAt = examCode.indexOf('sessionOriginRef.current = override?.origin ?? null;');
  assert.ok(startAt > 0);
  assert.match(examCode.slice(startAt, startAt + 200), /setGrillReceipt\(null\);/);

  // 离开成绩页时才结算，且两条离场路径都要结算（退出 / 去进度面板）
  assert.match(examCode, /const stashGrillReceipt = \(\) => \{/);
  assert.match(examCode, /const leaveResult = \(message: string\) => \{\s*\n\s*stashGrillReceipt\(\);/);
  assert.match(examCode, /saveCurrentResult\(\);\s*\n\s*stashGrillReceipt\(\);/);
  // 没有来源标记的普通场次不留回执
  assert.match(examCode, /const origin = sessionOriginRef\.current;\s*\n\s*if \(!origin\) return;/);

  // 计时器那个 effect 的依赖没被动过：把 questions / answers 塞进 finish 的依赖
  // 会让 setInterval 每次渲染重挂一次
  assert.match(examCode, /const finish = useCallback\(\(\) => \{[\s\S]*?\}, \[\]\);/);
  assert.match(examCode, /\}, \[phase, mode, finish\]\);/);

  // 面板拿到的是成句文案，渲染时才取字典 —— 存成句子的话切语言会留着上一句
  assert.match(examCode, /receipt=\{grillReceiptText\(\)\}/);
  assert.match(grillCode, /\{receipt && \(/);
  assert.match(grillCode, /role="status"/);
});

test('both dictionaries carry a distinct receipt line for each grill action', () => {
  for (const lang of ['zh', 'en']) {
    const t = dict.DICT[lang].grill;
    const lines = [t.receiptGrill(7, 5), t.receiptRetry(7, 5), t.receiptTopic(7, 5)];
    for (const line of lines) {
      assert.match(line, /7/, `${lang} 的回执要报本场题数`);
      assert.match(line, /5/, `${lang} 的回执要报做对几道`);
    }
    // 三块各说各的：都写成同一句的话，点了三个不同的按钮却收到同一句话，
    // 回执就退化成噪音
    assert.equal(new Set(lines).size, 3, `${lang} 的三条回执撞了词`);
  }
  // 外层面板必须双语；成绩页那两条是内层，中文即可（见 i18n.ts 的既有约定）
  assert.notEqual(dict.DICT.zh.grill.receiptRetry(1, 1), dict.DICT.en.grill.receiptRetry(1, 1));
});

test('the grill receipt is a quiet pill, not a second error banner', () => {
  const receipt = rule(grillCss, '.receipt');
  // 出错红字借的是 examStyles.errMsg；回执有自己的淡底样式，两者不该混用
  assert.match(grillCode, /styles\.receipt/);
  assert.doesNotMatch(grillCode, /examStyles\.errMsg\}>\{receipt\}/);
  // 出错要排在回执前面：办成了的事不该把没办成的事挤下去
  assert.ok(
    grillCode.indexOf('{error &&') < grillCode.indexOf('{receipt &&'),
    '错误信息必须排在回执之前',
  );

  // 动效只走 transform / opacity，且跟着 reduced-motion 降级
  assert.match(receipt, /animation: receiptIn/);
  assert.match(grillCss, /@keyframes receiptIn\s*\{[^}]*opacity[\s\S]*?transform/);
  assert.match(
    grillCss,
    /@media \(prefers-reduced-motion: reduce\) \{\s*\n\s*\.receipt \{[^}]*animation: none/,
  );
});

test('the result screen only gained elements — the marking path is untouched', () => {
  // 判分与落盘的三处形状原样保留：右题数、逐题历史快照、幂等落盘
  assert.match(
    examCode,
    /const right = questions\.filter\(\(qq, i\) => sameLabel\(answers\[i\], qq\.answer\)\)\.length;/,
  );
  assert.match(examCode, /historyAtStartRef\.current = records;/);
  assert.match(examCode, /if \(savedResultRef\.current\) return savedResultRef\.current;/);
  // 成绩页三个收尾按钮与「查看进度」都还在
  for (const label of ['跳过本场统计', '统计并导出后退出', '统计后再来一次']) {
    assert.ok(exam.includes(label), `成绩页少了「${label}」`);
  }
  // 哨兵：exam 相的全局键盘流一行没动
  assert.match(examCode, /if \(phase !== 'exam' \|\| !q\) return;/);
});

test('the finish banner owns up to the not-yet-recorded state', () => {
  // 横幅算在落盘之前（完卷时刻的仪式感不能等按钮），但「跳过本场统计」那条路
  // 不写记录、卷墙不点亮——横幅必须带一句小字把条件说破，否则就是断言
  // 既成事实的假话（审查 A1）
  const exam = fs.readFileSync('src/components/exam/ExamApp.tsx', 'utf8');
  assert.match(exam, /finishNote/);
  assert.match(exam, /计入统计后，卷面进度墙上这一格就会点亮/);
  // 跳过统计那条路确实不落盘——这正是小字存在的理由，一起钉住
  assert.match(exam, /onClick=\{\(\) => leaveResult\(t\.records\.sessionSkipped\)\}/);
});

test('the finish banner never asserts a fact that skipping the stats would undo', () => {
  // A1：横幅在落盘之前渲染（完卷时刻的仪式感不能等按钮），
  // 但用户可以点「跳过本场统计」——那样卷墙永远不会点亮。
  // 文案必须是条件式的真话，不许断言既成事实
  const exam = fs.readFileSync('src/components/exam/ExamApp.tsx', 'utf8');
  assert.match(exam, /计入统计后这一套就做满/);
  assert.match(exam, /计入统计后将做满/);
  assert.doesNotMatch(exam, /这一套做满了/, '旧文案对跳过统计的场次是假话');
});
