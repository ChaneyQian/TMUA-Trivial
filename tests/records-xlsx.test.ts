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

test('xlsx export contains one simple QID summary sheet', async () => {
  const records = addSession(createEmptyRecords(), RESULTS, SESSION, {
    now: 1_700_000_000_000,
  });

  const file = await exportRecordsWorkbook(records);
  const sheets = await readExcelFile(await file.arrayBuffer());

  assert.equal(sheets.length, 1);
  assert.equal(sheets[0].sheet, '做题记录');
  assert.deepEqual(sheets[0].data[0], ['QID', '最后作答时间', '最近结果', '错误次数', '作答次数']);
  assert.equal(sheets[0].data.length, 3);
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

  await assert.rejects(
    () => importRecordsWorkbook(file, new Set()),
    /MCQ Test|记录文件|格式/,
  );
});

test('xlsx import rejects a QID that is absent from the current static index', async () => {
  const file = await writeExcelFile(
    [
      ['QID', '最后作答时间', '最近结果', '错误次数', '作答次数'],
      [999_999_999, '2026-01-01T00:00:00Z', '正确', 0, 1],
    ],
    { sheet: '做题记录' },
  ).toBlob();

  await assert.rejects(
    () => importRecordsWorkbook(file, new Set([101, 102, 103])),
    /QID 999999999.*当前题库|无效 QID/,
  );
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

  const index = Array.from({ length: 366 }, (_, i) => ({ qid: i + 1, db: 'TMUA' }));
  const records = createEmptyRecords();
  for (let qid = 1; qid <= 364; qid++) {
    records.q[String(qid)] = { a: 1, w: 0, t: qid, c: 1 };
  }
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
  ];

  assert.deepEqual(recordsModule.indexForLibraryMode(index, 'classic').map((entry) => entry.qid), [1, 4]);
  assert.deepEqual(recordsModule.indexForLibraryMode(index, 'hidden').map((entry) => entry.qid), [1, 2, 3, 4, 5]);
});
