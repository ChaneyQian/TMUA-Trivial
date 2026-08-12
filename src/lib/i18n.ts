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
  },

  cardBadge: {
    questions: (n: number) => `${n} 题`,
    comingSoon: '即将开放',
    expanded: (n: number) => `🔥 ${n} 题`,
    charging: '🔒 充能中',
  },

  block: {
    comingSoon: (title: string) => `${title}即将开放`,
    unlockNeed: (n: number, title: string) => `再做 ${n} 题即可解锁 ${title}`,
  },

  setup: {
    back: '‹ 选区',
    sub: 'TMUA 公益 · 练习进度解锁扩展题库 · 全量真题 Mock',
    mixed: '混合',
    fieldBank: '题库',
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
    keyboard: '键盘：A–H / 1–9 选项 · Enter 批改或下一题 · ←→ 切题 · F 旗标',
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
  },

  cardBadge: {
    questions: (n: number) => `${n} Qs`,
    comingSoon: 'Coming Soon',
    expanded: (n: number) => `🔥 ${n} Qs`,
    charging: '🔒 Charging',
  },

  block: {
    comingSoon: (title: string) => `${title} is coming soon`,
    unlockNeed: (n: number, title: string) => `Answer ${n} more questions to unlock ${title}`,
  },

  setup: {
    back: '‹ Zones',
    sub: 'Free for TMUA · Practise to unlock the extended library · Full past-paper mocks',
    mixed: 'Mixed',
    fieldBank: 'Question Bank',
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
    keyboard: 'Keyboard: A–H / 1–9 select · Enter mark or next · ←→ navigate · F flag',
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
