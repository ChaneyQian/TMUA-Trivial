import assert from 'node:assert/strict';
import test from 'node:test';

import readExcelFile from 'read-excel-file/browser';
import writeExcelFile from 'write-excel-file/browser';
import {
  addSession,
  createEmptyRecords,
  exportRecordsWorkbook,
  importRecordsWorkbook,
  overview,
  pickQidsForMode,
} from '../src/lib/records.ts';
import * as recordsModule from '../src/lib/records.ts';
import { setActiveLang } from '../src/lib/i18n.ts';
import type { IndexEntry } from '../src/lib/exam.ts';

const SESSION = {
  db: 'TMUA',
  mode: 'practice' as const,
  n: 3,
  right: 1,
  answered: 2,
  sec: 95,
};

const RESULTS = [
  { qid: 101, selected: 'A', answer: 'A', correct: true, answered: true },
  { qid: 102, selected: 'B', answer: 'C', correct: false, answered: true },
  { qid: 103, selected: null, answer: 'D', correct: false, answered: false },
];

test('addSession updates answered questions and ignores unanswered questions', () => {
  const records = addSession(createEmptyRecords(), RESULTS, SESSION, {
    now: 1_700_000_000_000,
  });

  assert.deepEqual(records.q['101'], { a: 1, w: 0, t: 1_700_000_000_000, c: 1 });
  assert.deepEqual(records.q['102'], { a: 1, w: 1, t: 1_700_000_000_000, c: 0 });
  assert.equal(records.q['103'], undefined);
  assert.deepEqual(overview(records), {
    seen: 2,
    attempts: 2,
    wrong: 1,
    wrongNow: 1,
    sessions: 1,
  });
});

test('xlsx export contains the QID summary sheet plus two read-only logs', async () => {
  const records = addSession(createEmptyRecords(), RESULTS, SESSION, {
    now: 1_700_000_000_000,
  });

  const file = await exportRecordsWorkbook(records);
  const sheets = await readExcelFile(await file.arrayBuffer());

  // 主表在前，形状与表头一个字都没动（线格式，改一个字就读不了旧记录）
  assert.equal(sheets.length, 3);
  assert.equal(sheets[0].sheet, 'Records');
  assert.deepEqual(sheets[0].data[0], [
    'QID',
    'Last Attempt',
    'Last Result',
    'Wrong Count',
    'Attempt Count',
  ]);
  assert.equal(sheets[0].data.length, 3);
  // 结果列也是英文了
  assert.equal(sheets[0].data[1][2], 'Correct');
  assert.equal(sheets[0].data[2][2], 'Wrong');

  // 场次表：表名与表头都引用 records.ts 导出的常量，避免两处各写一份字面量漂移
  assert.equal(sheets[2].sheet, recordsModule.SESSIONS_SHEET_NAME);
  assert.equal(recordsModule.SESSIONS_SHEET_NAME, 'Sessions');
  assert.deepEqual(sheets[2].data[0], [...recordsModule.SESSION_HEADERS]);
  assert.equal(sheets[2].data.length, 2); // 表头 + 本场
  assert.equal(sheets[2].data[1][1], 'TMUA');
  assert.equal(sheets[2].data[1][2], 'Practice');
  assert.equal(sheets[2].data[1][3], 3);
  assert.equal(sheets[2].data[1][4], 1);
  assert.equal(sheets[2].data[1][5], 2);
  assert.equal(sheets[2].data[1][6], 95);
});

test('xlsx import restores QID stats and intentionally omits local session history', async () => {
  const original = addSession(createEmptyRecords(), RESULTS, SESSION, {
    now: 1_700_000_000_000,
  });

  const file = await exportRecordsWorkbook(original);
  const restored = await importRecordsWorkbook(await file.arrayBuffer(), new Set([101, 102, 103]));

  assert.deepEqual(restored.q, original.q);
  assert.deepEqual(restored.s, []);
});

test('xlsx import rejects a workbook that is not an MCQ Test record file', async () => {
  const file = await writeExcelFile([['unrelated workbook']], { sheet: 'Sheet1' }).toBlob();

  await assert.rejects(() => importRecordsWorkbook(file, new Set()), /MCQ Test/);
});

test('xlsx import rejects a QID that is absent from the current static index', async () => {
  const file = await writeExcelFile(
    [
      ['QID', 'Last Attempt', 'Last Result', 'Wrong Count', 'Attempt Count'],
      [999_999_999, '2026-01-01T00:00:00Z', 'Correct', 0, 1],
    ],
    { sheet: 'Records' },
  ).toBlob();

  // 校验信息跟随界面语言：默认中文，切到英文就该是英文（线格式不受影响）
  try {
    await assert.rejects(
      () => importRecordsWorkbook(file, new Set([101, 102, 103])),
      /QID 999999999.*不在当前题库/,
    );
    setActiveLang('en');
    await assert.rejects(
      () => importRecordsWorkbook(file, new Set([101, 102, 103])),
      /QID 999999999.*not in the current question bank/,
    );
  } finally {
    setActiveLang('zh');
  }
});

test('xlsx import still accepts the legacy Chinese sheet name, headers and result labels', async () => {
  // 存量用户手里是旧版导出的文件：表名/表头/正误列全是中文，必须照样读得进来
  const file = await writeExcelFile(
    [
      ['QID', '最后作答时间', '最近结果', '错误次数', '作答次数'],
      [101, '2026-01-01T00:00:00Z', '正确', 0, 2],
      [102, '2026-01-02T00:00:00Z', '错误', 3, 4],
    ],
    { sheet: '做题记录' },
  ).toBlob();

  const restored = await importRecordsWorkbook(file, new Set([101, 102, 103]));

  assert.equal(restored.q['101'].c, 1);
  assert.equal(restored.q['101'].a, 2);
  assert.equal(restored.q['102'].c, 0);
  assert.equal(restored.q['102'].w, 3);
  // 导入刻意不带回会话历史，这一条语义没变
  assert.deepEqual(restored.s, []);
});

test('a legacy workbook and a freshly exported one import to the same records', async () => {
  const exported = await exportRecordsWorkbook(
    addSession(createEmptyRecords(), RESULTS, SESSION, { now: 1_700_000_000_000 }),
  );
  const fromNew = await importRecordsWorkbook(await exported.arrayBuffer(), new Set([101, 102]));

  const legacy = await writeExcelFile(
    [
      ['QID', '最后作答时间', '最近结果', '错误次数', '作答次数'],
      [101, new Date(1_700_000_000_000), '正确', 0, 1],
      [102, new Date(1_700_000_000_000), '错误', 1, 1],
    ],
    { sheet: '做题记录', dateFormat: 'yyyy-mm-dd hh:mm:ss' },
  ).toBlob();
  const fromLegacy = await importRecordsWorkbook(await legacy.arrayBuffer(), new Set([101, 102]));

  assert.deepEqual(fromLegacy.q, fromNew.q);
});

test('three pick modes use the imported QID status without relaxing exclusions', () => {
  const records = createEmptyRecords();
  records.q = {
    '1': { a: 2, w: 0, t: 100, c: 1 },
    '2': { a: 3, w: 2, t: 200, c: 0 },
  };
  const index = [
    { qid: 1, db: 'TMUA' },
    { qid: 2, db: 'TMUA' },
    { qid: 3, db: 'TMUA' },
  ];

  assert.deepEqual(new Set(pickQidsForMode(index, 'TMUA', 10, 'random', records)), new Set([1, 2, 3]));
  assert.deepEqual(new Set(pickQidsForMode(index, 'TMUA', 10, 'wrong-and-new', records)), new Set([2, 3]));
  assert.deepEqual(pickQidsForMode(index, 'TMUA', 10, 'new-only', records), [3]);
});

test('hidden mode unlocks only after 365 valid unique QIDs have been answered', () => {
  assert.equal(typeof recordsModule.validCompletedCount, 'function');
  assert.equal(typeof recordsModule.isHiddenModeUnlocked, 'function');
  assert.equal(typeof recordsModule.hiddenUnlockProgress, 'function');

  const index: IndexEntry[] = [
    ...Array.from({ length: 366 }, (_, i) => ({ qid: i + 1, db: 'TMUA' })),
    // 诊断题答过也不计入 365 解锁进度（诊断另有 Pass 解锁路径）
    { qid: 5001, db: 'GMAT', diag: true },
  ];
  const records = createEmptyRecords();
  for (let qid = 1; qid <= 364; qid++) {
    records.q[String(qid)] = { a: 1, w: 0, t: qid, c: 1 };
  }
  records.q['5001'] = { a: 3, w: 1, t: 5001, c: 0 };
  records.q['999999999'] = { a: 20, w: 0, t: 999, c: 1 };
  records.q['365'] = { a: 0, w: 0, t: 365, c: 1 };

  assert.equal(recordsModule.validCompletedCount(index, records), 364);
  assert.equal(recordsModule.hiddenUnlockProgress(index, records), 364 / 365);
  assert.equal(recordsModule.isHiddenModeUnlocked(index, records), false);

  records.q['365'].a = 1;
  assert.equal(recordsModule.validCompletedCount(index, records), 365);
  assert.equal(recordsModule.hiddenUnlockProgress(index, records), 1);
  assert.equal(recordsModule.isHiddenModeUnlocked(index, records), true);
});

test('classic mode excludes hidden index entries until the expanded pool is selected', () => {
  assert.equal(typeof recordsModule.indexForLibraryMode, 'function');
  // 标注类型：数组字面量里 hidden: true 会被推断成 boolean，与 IndexEntry 的 hidden?: true 不符
  const index: IndexEntry[] = [
    { qid: 1, db: 'TMUA' },
    { qid: 2, db: 'TMUA_MOCK', hidden: true },
    { qid: 3, db: 'MAT', hidden: true },
    { qid: 4, db: 'ECAA' },
    { qid: 5, db: 'AMC', hidden: true },
    { qid: 6, db: 'GMAT', diag: true },
  ];

  assert.deepEqual(recordsModule.indexForLibraryMode(index, 'classic').map((entry) => entry.qid), [1, 4]);
  // diag（GMAT 诊断集）连 9.0 扩展池也不进——它只属于 Diagnostic Test
  assert.deepEqual(recordsModule.indexForLibraryMode(index, 'hidden').map((entry) => entry.qid), [1, 2, 3, 4, 5]);
});
