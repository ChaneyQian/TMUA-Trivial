// 外层（选区 deck + 配置面板）的中英双语字典。
//
// 只覆盖 setup 相：卡面、面板字段、按钮、提示与错误信息。
// 考试运行时 / 成绩页 / 工牌 / 宠物一律保持中文原文，不进这张表——
// CBT chrome 本来就是英文，中文辅助提示按原样留着。
//
// 结构上 zh 是「模板」：en 声明成 Strings 类型，键少一个或多一个都编译不过，
// 所以两边永远对齐，不需要靠测试兜底（测试仍留一条，防运行期数据被改坏）。

export type Lang = 'zh' | 'en';

export const LANG_KEY = 'mcq-test:lang:v1';
export const DEFAULT_LANG: Lang = 'zh';

const zh = {
  // 切换按钮显示的是「切过去之后的语言」，不是当前语言
  langToggle: { label: 'EN', aria: '切换到英文', title: '中 / EN' },

  zone: {
    title: { classic: '经典题库', grill: '复烤区', trivial: '9.0 Trivial' },
    sub: { classic: 'TMUA · MAT · SMC · ECAA', grill: '即将开放', trivial: '扩展题库' },
  },

  deck: {
    headSub: 'TMUA 公益 · 三个功能区，选一张卡开始',
    groupAria: '功能区选择',
    keys: '← → 切换功能区 · Enter 展开 · 也可左右滑动',
    chargeLabel: (value: number, max: number) => `充能 ${value} / ${max}`,
    chargeAria: '9.0 Trivial 解锁进度',
    quickAria: (summary: string) => `用当前配置快速开始：${summary}`,
    openAria: (no: string, title: string) => `${no} ${title}，展开配置`,
    frontAria: (no: string, title: string) => `${no} ${title}，转到前位`,
    diagnosticAria: (no: string, title: string) => `${no} ${title}，开始 Diagnostic Test`,
  },

  cardBadge: {
    questions: (n: number) => `${n} 题`,
    expanded: (n: number) => `🔥 ${n} 题`,
    charging: '🔒 充能中',
  },

  block: {
    comingSoon: (title: string) => `${title}即将开放`,
  },

  setup: {
    back: '‹ 选区',
    sub: 'TMUA 公益 · 练习进度解锁扩展题库 · 全量真题 Mock',
    mixed: '混合',
    fieldBank: '题库',
    // 按题库自己的知识点标签认逻辑题。勾掉之后抽题池里就没有它们了，题数档位跟着缩
    logicReasoning: '含逻辑推理题',
    // 覆盖率必须如实说：打标只做了一部分，MAT 这种库里勾掉开关几乎没有效果，
    // 用户得能当场看明白是为什么，而不是以为开关坏了。
    // 用具体题数而不只是百分比——「309 题里有 16 题」比「5%」更容易照着数
    // 「所选范围」而不是「本题库」：选混合时横跨好几个库，说本题库就错了。
    // 勾选态用将来时、已勾掉用完成时——否则勾掉后看着题数掉了、说明还写着
    // 「取消勾选后就不再抽到」，读起来像没生效
    logicCoverage: (logic: number, tagged: number, total: number, include: boolean) => {
      const head = include
        ? `已认出 ${logic} 道逻辑推理题，取消勾选后就不再抽到。`
        : `已排除 ${logic} 道逻辑推理题。`;
      if (tagged >= total) return `${head}所选范围 ${total} 题都整理过知识点。`;
      const pct = total ? Math.round((tagged / total) * 100) : 0;
      return `${head}所选范围共 ${total} 题，其中 ${tagged} 题整理过知识点（${pct}%）。剩下 ${total - tagged} 题还没整理，里面若有逻辑题仍会出现。`;
    },
    fieldMode: '模式',
    fieldPick: '抽题范围',
    fieldCount: (n: number) => `题目数量(题库可用 ${n} 题)`,
    fieldMinutes: '限时(分钟)',
    questions: (n: number) => `${n} 题`,
    answersPending: '待补答案',
    practice: '练习',
    practiceLabel: '练习(默认)',
    practiceHint: '选完 Enter 即时批改',
    mockShort: 'Mock 限时',
    mockLabel: 'Mock(限时)',
    mockHint: '倒计时,交卷统一批改',
    pickRandom: '纯随机',
    pickRandomHint: '全部题目',
    pickWrongNew: '新题 + 错题',
    pickWrongNewHint: '排除最近做对',
    pickNewOnly: '仅新题',
    pickNewOnlyHint: '排除全部已做',
    picking: '抽题中…',
    bankLoading: '题库加载中…',
    start: '开始 Test',
    quickStart: '⚡ 快速开始',
    quickSummary: (db: string, mode: string, count: number) => `${db} · ${mode} · ${count} 题`,
    emptyBank: '该题库没有可用题目。',
    emptyBankLogicHint: (n: number) => `勾回「含逻辑推理题」可再抽到 ${n} 道。`,
    keyboard: '键盘：A–I / 1–9 选项 · Enter 批改或下一题 · ←→ 切题 · F 旗标',
  },

  records: {
    field: '做题记录（可选）',
    seen: '已做',
    wrongNow: '当前错题',
    attempts: '次作答',
    importBtn: '导入 XLSX',
    exportBtn: '导出 XLSX',
    clearBtn: '清空',
    exported: (n: number) => `已导出 ${n} 道题的记录`,
    imported: (n: number) => `已导入 ${n} 道题的记录`,
    exportFailed: '导出失败',
    importFailed: '导入失败',
    importConfirm: '导入会替换当前做题记录，是否继续？',
    clearConfirm: '确定清空全部做题和错题记录？',
    clearKeepsUnlock: '9.0 解锁与 Grill 绑定不受影响。',
    cleared: '记录已清空',
    indexNotReady: '题库索引尚未加载完成',
    sessionSaved: '本场已计入统计',
    sessionSavedExported: '本场已计入统计并导出',
    sessionSkipped: '本场未计入统计',
    // 导入会把 s（场次历史）清空，而进度面板正是靠它画趋势的——必须先说清楚
    importConfirmSessions: '注意：场次历史不随记录文件迁移，导入后趋势图会清空。',
  },

  progress: {
    title: '练习进度',
    open: '查看进度',
    back: '‹ 返回',
    strip: (seen: number, wrongNow: number) =>
      `已做 ${seen} 题 · ${wrongNow} 道当前错题 · 查看进度 ›`,
    stripEmpty: '还没有做题记录 · 查看进度 ›',

    tileSeen: '已做题目',
    tileAccuracy: '总体正确率',
    tileWrong: '当前错题',
    tileSessions: '场次记录',
    // 口径写死：只统计做过的题，没做过的不算分母
    accuracyNote: '正确率口径：已作答题目的累计正确率',

    sessionsTitle: '最近场次',
    sessionsSub: (shown: number, total: number) => `最近 ${shown} 场 / 共 ${total} 场`,
    sessionsEmpty: '还没有场次记录 —— 完成一次 Test，这里就会出现趋势。',
    sessionsAria: '最近场次的正确率趋势',
    legendAccuracy: '正确率',
    legendPace: '每题用时',
    sessionDetail: (date: string, db: string, mode: string, right: number, n: number, clock: string) =>
      `${date} · ${db} · ${mode} · ${right}/${n} · ${clock}`,
    sessionPick: '点击图中任意一场查看详情',

    missedTitle: '最常做错',
    missedRetry: '重练这些',
    missedEmpty: '还没有错题记录 —— 这里会列出最该回头看的题。',
    missedRow: (wrong: number, attempts: number) => `错 ${wrong} 次 · 共 ${attempts} 次作答`,
    missedFallback: (qid: number) => `题目 ${qid}`,
    missedLoading: '正在读取题目信息…',

    // 「复盘」不是「弱项」：榜上列的是全部够格的知识点，全对的人也会看到
    // 自己 100% 的行——那不是弱项，叫弱项就是标题在撒谎。弱的排前面这个
    // 排序本身写进口径行
    weakTitle: '知识点复盘',
    // 和上面的统计块同一个口径、同一种措辞，两处不一致会被当成两种算法
    weakNote: '已作答题目的累计正确率 · 弱的排前面',
    weakRow: (questions: number, accuracy: string) => `做过 ${questions} 题 · 正确率 ${accuracy}`,
    weakPractice: '练这类题',
    weakPracticeAria: (topic: string) => `练 ${topic} 这类题`,
    // 知识点名一律用题库里的英文规范名，中文界面也不翻（用户裁定，2026-08-15）：
    // 学生对着的是英文原卷，Number Theory / Sequences and Series 这些词本身就是
    // 考试语境的一部分，硬翻成中文反而和题面对不上。保留这一层映射是为了
    // 两本字典同形，将来要改口径只动这一处
    topicName: (name: string) => name,
    // 样本太小时不给结论。空态兼管两种情况：一道没做过，和做了但每类都不够
    weakEmpty: (min: number) =>
      `还看不出弱项 —— 一个知识点做满 ${min} 题，这里才会下结论。多练一些再回来看。`,
    weakThin: (n: number, min: number) => `另有 ${n} 个知识点做的题不到 ${min} 道，暂时不下结论。`,
    // 打标覆盖极不均（MAT 5% / ECAA 9%），不说清楚就等于拿一小撮题冒充全貌。
    // banks 只点名整库覆盖确实不过半的库；名单可能为空——用户漏的题全落在
    // 已经整理过大半的库里时，还硬点名就是冤枉人
    weakCoverage: (analysed: number, attempted: number, banks: string) =>
      banks
        ? `这里只算整理过知识点的题：你做过的 ${attempted} 道里有 ${analysed} 道。其余的落在知识点还没整理完的库（${banks}），暂时进不来。`
        : `这里只算整理过知识点的题：你做过的 ${attempted} 道里有 ${analysed} 道，其余的还没整理进知识点。`,
  },

  grill: {
    title: '复烤区',
    lead: '这里是你在 Diagnostic 里考过的题。可以正常做题、批改、看解析——诊断时不给的答案，在这儿一次烤明白。',
    emptySub: '完成一次 Diagnostic 后出现',
    emptyTitle: '还没有绑定的题',
    emptyHint: '完成一次 Diagnostic 后，这里会出现你的题。',
    goDiagnostic: '去看 Diagnostic',
    bound: (n: number) => `已绑定 ${n} 道题`,
    dangling: (n: number) => `其中 ${n} 道已随题库更新移除，不计入可用`,
    fieldCount: (n: number) => `题目数量（可用 ${n} 题）`,
    countAll: '全部',
    start: '开始复烤',
    empty: '当前策略下没有可练的题，换个策略试试。',
  },

  diagnostic: {
    title: 'Diagnostic Test',
    lead: '一场限时测试。通过就解锁 9.0 Trivial —— 和做满 365 题并列的另一条路。',
    rulesTitle: '怎么考',
    rulePapers: '两卷，各 20 题，中间可以休息。',
    ruleTime: '每题 2 分钟。提前答完，剩下的时间自动加给下一题。',
    ruleTimeout: '时间用完自动跳下一题，不能回头改。',
    ruleNoFeedback: '全程不告诉你对错。',
    rulePass: (mark: number, total: number) => `答对 ${mark} 题（共 ${total} 题）算通过，考完只显示通过或未通过。`,
    ruleChances: (n: number) => `一共 ${n} 次机会，每次用的是不同的题。`,
    start: '开始 Diagnostic',
    starting: '准备中…',
    chance: (nth: number, total: number) => `第 ${nth} / ${total} 次机会`,
    exhausted: '两次机会都用完了',
    exhaustedHint: '不过 9.0 Trivial 还有另一条路：继续练习，做满 365 题同样解锁。',
    unavailable: '诊断题库尚未就绪',
    orPractice: '也可以继续练习，做满 365 题同样解锁',
    grillBound: (n: number) => `${n} 道题已绑定`,
    paper: (n: number) => `Paper ${n}`,
    paperOf: (n: number, idx: number, total: number) => `Paper ${n} · 第 ${idx} / ${total} 题`,
    breakTitle: 'Paper 1 完成 · 休息一下',
    breakLine: '接下来是 Paper 2，同样 20 题。',
    breakNote: '休息不限时。点开始后计时重新从每题 2 分钟算起，上一卷剩下的时间不带过来。',
    breakStart: '开始 Paper 2',
    abandon: '放弃',
    abandonConfirm: '放弃本次诊断？本次不计入尝试次数。',
    abandonNote: '倒计时不会暂停。',
    abandonNo: '继续作答',
  },

  errors: {
    indexLoad: '题库索引加载失败',
    indexLoadHttp: (status: number) => `题库索引加载失败（HTTP ${status}）`,
    questionLoadHttp: (qid: number, status: number) => `第 ${qid} 题加载失败（HTTP ${status}）`,
    emptyBank: '该题库没有可用题目',
    emptySelection: '当前抽题范围内没有可用题目',
    pickFailed: '抽题失败',
    // 记录文件（XLSX）导入校验。线格式固定英文，这里只是给用户看的说明文字
    fileTooLarge: '记录文件过大，最大支持 5 MB',
    unreadable: '无法读取 Excel，请选择本站导出的 .xlsx 记录文件',
    missingSheet: (sheet: string) => `这不是有效的 MCQ Test 记录文件：缺少“${sheet}”工作表`,
    headerMismatch: 'MCQ Test 记录文件格式错误：表头不匹配',
    notInteger: (field: string) => `记录文件格式错误：${field} 不是有效整数`,
    badTime: '记录文件格式错误：最后作答时间无效',
    badQid: (line: number) => `记录文件格式错误：第 ${line} 行 QID 无效`,
    unknownQid: (qid: number) => `记录文件包含无效 QID ${qid}：该题不在当前题库`,
    duplicateQid: (qid: number) => `记录文件格式错误：QID ${qid} 重复`,
    badResult: (line: number, correct: string, wrong: string) =>
      `记录文件格式错误：第 ${line} 行最近结果只能是 ${correct} 或 ${wrong}`,
    wrongExceedsAttempts: (line: number) =>
      `记录文件格式错误：第 ${line} 行错误次数不能超过作答次数`,
    fieldQid: (line: number) => `第 ${line} 行 QID`,
    fieldWrong: (line: number) => `第 ${line} 行错误次数`,
    fieldAttempts: (line: number) => `第 ${line} 行作答次数`,
  },
};

/** 字典形状由中文这份定义；en 少写或多写一个键都会编译失败 */
export type Strings = typeof zh;

const en: Strings = {
  langToggle: { label: '中', aria: 'Switch to Chinese', title: '中 / EN' },

  zone: {
    title: { classic: 'Classic Library', grill: 'Grill', trivial: '9.0 Trivial' },
    sub: { classic: 'TMUA · MAT · SMC · ECAA', grill: 'Coming Soon', trivial: 'Extended Library' },
  },

  deck: {
    headSub: 'Free for TMUA · Three zones — pick a card to begin',
    groupAria: 'Zone selection',
    keys: '← → switch zone · Enter to open · or swipe sideways',
    chargeLabel: (value: number, max: number) => `Charging ${value} / ${max}`,
    chargeAria: '9.0 Trivial unlock progress',
    quickAria: (summary: string) => `Quick start with the current setup: ${summary}`,
    openAria: (no: string, title: string) => `${no} ${title}, open settings`,
    frontAria: (no: string, title: string) => `${no} ${title}, bring to front`,
    diagnosticAria: (no: string, title: string) => `${no} ${title}, start the Diagnostic Test`,
  },

  cardBadge: {
    questions: (n: number) => `${n} Qs`,
    expanded: (n: number) => `🔥 ${n} Qs`,
    charging: '🔒 Charging',
  },

  block: {
    comingSoon: (title: string) => `${title} is coming soon`,
  },

  setup: {
    back: '‹ Zones',
    sub: 'Free for TMUA · Practise to unlock the extended library · Full past-paper mocks',
    mixed: 'Mixed',
    fieldBank: 'Question Bank',
    logicReasoning: 'Include logic reasoning questions',
    logicCoverage: (logic: number, tagged: number, total: number, include: boolean) => {
      const head = include
        ? `${logic} questions here are marked as logic reasoning; unticking leaves them out. `
        : `${logic} logic reasoning questions are being left out. `;
      if (tagged >= total) return `${head}All ${total} questions in this selection have been sorted by topic.`;
      const pct = total ? Math.round((tagged / total) * 100) : 0;
      return `${head}Of the ${total} questions in this selection, ${tagged} have been sorted by topic (${pct}%). The other ${total - tagged} have not, so any logic questions among them will still come up.`;
    },
    fieldMode: 'Mode',
    fieldPick: 'Question Selection',
    fieldCount: (n: number) => `Number of Questions (${n} available)`,
    fieldMinutes: 'Time Limit (minutes)',
    questions: (n: number) => `${n} Qs`,
    answersPending: 'Answers pending',
    practice: 'Practice',
    practiceLabel: 'Practice (default)',
    practiceHint: 'Select, then Enter to mark',
    mockShort: 'Mock (timed)',
    mockLabel: 'Mock (timed)',
    mockHint: 'Countdown, marked on submission',
    pickRandom: 'Random',
    pickRandomHint: 'All questions',
    pickWrongNew: 'New + Wrong',
    pickWrongNewHint: 'Excludes recent correct',
    pickNewOnly: 'New Only',
    pickNewOnlyHint: 'Excludes all attempted',
    picking: 'Selecting…',
    bankLoading: 'Loading question bank…',
    start: 'Start Test',
    quickStart: '⚡ Quick Start',
    quickSummary: (db: string, mode: string, count: number) => `${db} · ${mode} · ${count} Qs`,
    emptyBank: 'No questions available in this bank.',
    emptyBankLogicHint: (n: number) => `Ticking "Include logic reasoning questions" back on adds ${n}.`,
    keyboard: 'Keyboard: A–I / 1–9 select · Enter mark or next · ←→ navigate · F flag',
  },

  records: {
    field: 'Practice Records (optional)',
    seen: 'attempted',
    wrongNow: 'wrong now',
    attempts: 'attempts',
    importBtn: 'Import XLSX',
    exportBtn: 'Export XLSX',
    clearBtn: 'Clear',
    exported: (n: number) => `Exported records for ${n} questions`,
    imported: (n: number) => `Imported records for ${n} questions`,
    exportFailed: 'Export failed',
    importFailed: 'Import failed',
    importConfirm: 'Importing will replace your current practice records. Continue?',
    clearConfirm: 'Clear all practice and wrong-answer records?',
    clearKeepsUnlock: 'Your 9.0 unlock and Grill bindings are kept.',
    cleared: 'Records cleared',
    indexNotReady: 'The question index has not finished loading',
    sessionSaved: 'This session has been recorded',
    sessionSavedExported: 'This session has been recorded and exported',
    sessionSkipped: 'This session was not recorded',
    importConfirmSessions:
      'Note: session history is not carried in the record file — importing clears the trend chart.',
  },

  progress: {
    title: 'Progress',
    open: 'View progress',
    back: '‹ Back',
    strip: (seen: number, wrongNow: number) =>
      `${seen} attempted · ${wrongNow} wrong now · View progress ›`,
    stripEmpty: 'No practice records yet · View progress ›',

    tileSeen: 'Questions seen',
    tileAccuracy: 'Lifetime accuracy',
    tileWrong: 'Currently wrong',
    tileSessions: 'Sessions logged',
    accuracyNote: 'Lifetime accuracy is measured on attempted questions only',

    sessionsTitle: 'Recent sessions',
    sessionsSub: (shown: number, total: number) => `Last ${shown} of ${total} sessions`,
    sessionsEmpty: 'No sessions yet — finish a test and your trend will appear here.',
    sessionsAria: 'Accuracy trend across recent sessions',
    legendAccuracy: 'Accuracy',
    legendPace: 'Time per question',
    sessionDetail: (date: string, db: string, mode: string, right: number, n: number, clock: string) =>
      `${date} · ${db} · ${mode} · ${right}/${n} · ${clock}`,
    sessionPick: 'Tap any session in the chart for details',

    missedTitle: 'Most missed',
    missedRetry: 'Retry these',
    missedEmpty: 'No wrong answers recorded yet — the questions worth revisiting will show up here.',
    missedRow: (wrong: number, attempts: number) =>
      `Missed ${wrong}× · ${attempts} attempt${attempts === 1 ? '' : 's'}`,
    missedFallback: (qid: number) => `Question ${qid}`,
    missedLoading: 'Loading question details…',

    weakTitle: 'Topic review',
    weakNote: 'Lifetime accuracy on attempted questions · weakest first',
    weakRow: (questions: number, accuracy: string) => `${questions} attempted · ${accuracy} correct`,
    weakPractice: 'Practise these',
    weakPracticeAria: (topic: string) => `Practise ${topic} questions`,
    // 英文界面直接用数据里的规范名，恒等映射只为和中文字典同形
    topicName: (name: string) => name,
    weakEmpty: (min: number) =>
      `Nothing to call weak yet — a topic needs ${min} attempted questions before this says anything. Come back after a bit more practice.`,
    weakThin: (n: number, min: number) =>
      `${n} other topic${n === 1 ? '' : 's'} ${n === 1 ? 'has' : 'have'} fewer than ${min} attempted questions, so ${n === 1 ? 'it is' : 'they are'} left out for now.`,
    // 括号里列库名而不是写成主语，一个库和好几个库用同一句话，不必凑单复数
    weakCoverage: (analysed: number, attempted: number, banks: string) =>
      banks
        ? `Only questions sorted by topic are counted here: ${analysed} of the ${attempted} you have attempted. The rest sit in banks that have not been sorted yet (${banks}), so they are left out.`
        : `Only questions sorted by topic are counted here: ${analysed} of the ${attempted} you have attempted. The rest have not been sorted yet.`,
  },

  grill: {
    title: 'Grill',
    lead: 'These are the questions you met in the Diagnostic. Practise them normally — marking and solutions included. The answers withheld during the test are all here.',
    emptySub: 'Unlocked by a Diagnostic',
    emptyTitle: 'Nothing bound yet',
    emptyHint: 'Finish a Diagnostic and your questions will show up here.',
    goDiagnostic: 'See the Diagnostic',
    bound: (n: number) => `${n} questions bound`,
    dangling: (n: number) => `${n} of them were dropped by a bank update and are not available`,
    fieldCount: (n: number) => `Number of Questions (${n} available)`,
    countAll: 'All',
    start: 'Start Grill',
    empty: 'Nothing to practise with this selection — try another one.',
  },

  diagnostic: {
    title: 'Diagnostic Test',
    lead: 'A timed test. Pass it to unlock 9.0 Trivial — the other route alongside answering 365 questions.',
    rulesTitle: 'How it works',
    rulePapers: 'Two papers, 20 questions each, with a break in between.',
    ruleTime: '2 minutes per question. Finish early and the spare time is added to your next question.',
    ruleTimeout: 'When time runs out you move on automatically, and you cannot go back.',
    ruleNoFeedback: 'You are never told whether an answer was right.',
    rulePass: (mark: number, total: number) =>
      `Get ${mark} of ${total} right to pass. At the end you only see pass or fail.`,
    ruleChances: (n: number) => `You get ${n} attempts, and each one uses different questions.`,
    start: 'Start Diagnostic',
    starting: 'Preparing…',
    chance: (nth: number, total: number) => `Attempt ${nth} of ${total}`,
    exhausted: 'You have used both attempts',
    exhaustedHint:
      'There is still the other route to 9.0 Trivial: keep practising and 365 questions unlocks it.',
    unavailable: 'The diagnostic bank is not ready yet',
    orPractice: 'You can also keep practising — 365 questions unlocks it too',
    grillBound: (n: number) => `${n} questions bound`,
    paper: (n: number) => `Paper ${n}`,
    paperOf: (n: number, idx: number, total: number) => `Paper ${n} · ${idx} of ${total}`,
    breakTitle: 'Paper 1 done — take a break',
    breakLine: 'Paper 2 is next, another 20 questions.',
    breakNote:
      'The break is untimed. When you start, the clock resets to 2 minutes per question — spare time from Paper 1 does not carry over.',
    breakStart: 'Start Paper 2',
    abandon: 'Abandon',
    abandonConfirm: 'Abandon this diagnostic? It will not count as an attempt.',
    abandonNote: 'The clock keeps running.',
    abandonNo: 'Keep going',
  },

  errors: {
    indexLoad: 'Could not load the question index',
    indexLoadHttp: (status: number) => `Could not load the question index (HTTP ${status})`,
    questionLoadHttp: (qid: number, status: number) =>
      `Could not load question ${qid} (HTTP ${status})`,
    emptyBank: 'No questions available in this bank',
    emptySelection: 'No questions available with the current selection',
    pickFailed: 'Could not select questions',
    fileTooLarge: 'The record file is too large (5 MB maximum)',
    unreadable: 'Could not read the workbook. Choose an .xlsx record file exported from this site.',
    missingSheet: (sheet: string) => `Not a valid MCQ Test record file: the ${sheet} sheet is missing`,
    headerMismatch: 'Invalid MCQ Test record file: the header row does not match',
    notInteger: (field: string) => `Invalid record file: ${field} is not a whole number`,
    badTime: 'Invalid record file: the last attempt time is not a valid date',
    badQid: (line: number) => `Invalid record file: the QID on row ${line} is not valid`,
    unknownQid: (qid: number) =>
      `The record file contains QID ${qid}, which is not in the current question bank`,
    duplicateQid: (qid: number) => `Invalid record file: QID ${qid} appears more than once`,
    badResult: (line: number, correct: string, wrong: string) =>
      `Invalid record file: the last result on row ${line} must be ${correct} or ${wrong}`,
    wrongExceedsAttempts: (line: number) =>
      `Invalid record file: the wrong count on row ${line} cannot exceed the attempt count`,
    fieldQid: (line: number) => `the QID on row ${line}`,
    fieldWrong: (line: number) => `the wrong count on row ${line}`,
    fieldAttempts: (line: number) => `the attempt count on row ${line}`,
  },
};

export const DICT: Record<Lang, Strings> = { zh, en };

export function isLang(value: unknown): value is Lang {
  return value === 'zh' || value === 'en';
}

/**
 * 非 React 代码（lib/exam.ts、lib/records.ts 抛错时）拿当前语言的出口。
 * Provider 每次语言变化都会把它同步过来；React 组件请用 useLang()，
 * 免得读到这个模块级变量却不会跟着重渲染。
 */
let activeLang: Lang = DEFAULT_LANG;

export function setActiveLang(lang: Lang): void {
  activeLang = lang;
}

export function getActiveLang(): Lang {
  return activeLang;
}

/** 当前语言的字典，给不在 React 树里的模块用 */
export function s(): Strings {
  return DICT[activeLang];
}
