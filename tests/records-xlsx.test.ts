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
  const restored = await importRecordsWorkbook(await file.arrayBuffer());

  assert.deepEqual(restored.q, original.q);
  assert.deepEqual(restored.s, []);
});

test('xlsx import rejects a workbook that is not an MCQ Test record file', async () => {
  const file = await writeExcelFile([['unrelated workbook']], { sheet: 'Sheet1' }).toBlob();

  await assert.rejects(
    () => importRecordsWorkbook(file),
    /MCQ Test|记录文件|格式/,
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
