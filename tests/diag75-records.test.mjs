// 7.5+ Diagnostic 在记录层的落地：新旧战绩分开记、三路解锁、reserved 移出每一条
// 练习抽题路径但照算 365、卷面墙口径一致、复烤区照常取题、XLSX 新旧文件往返。
//
// 全部是行为测试：拿小索引与小记录喂真函数，看它们吐出什么。

import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import readExcelFile from 'read-excel-file/browser';
import writeExcelFile from 'write-excel-file/browser';

import { attemptsLeft, canAttempt } from '../src/lib/diagnostic.ts';
import { grillEntries, pickGrillQids } from '../src/lib/grill.ts';
import { paperLevel, paperProgress, papersJustCompleted, PAPER_LEVELS } from '../src/lib/papers.ts';
import { practiceOverview, practiceQids } from '../src/lib/progress.ts';
import {
  DIAGNOSTIC75_HEADERS,
  DIAGNOSTIC_HEADERS,
  HIDDEN_UNLOCK_COUNT,
  availableCountForMode,
  clearRecords,
  createEmptyRecords,
  exportRecordsWorkbook,
  hiddenUnlockProgress,
  importRecordsWorkbook,
  indexForLibraryMode,
  indexForLogicReasoning,
  isHiddenModeUnlocked,
  mergeDiagnostic,
  normalizeRecords,
  pickQidsForMode,
  reachableIndex,
  recordDiagnostic,
  validCompletedCount,
  wrongRanking,
} from '../src/lib/records.ts';
import { topicEntries, topicReach } from '../src/lib/topics.ts';
import { readExamIndex } from './helpers/exam-data.mjs';

const examPath = 'src/components/exam/ExamApp.tsx';

/** 小索引：经典题、两道 reserved（其一还是逻辑题）、9.0 区、诊断题各有 */
const INDEX = [
  { qid: 1, db: 'TMUA', tagged: true },
  { qid: 2, db: 'TMUA', tagged: true, reserved: true },
  { qid: 3, db: 'MAT', logic: true, tagged: true, reserved: true },
  { qid: 4, db: 'MAT', logic: true, tagged: true },
  { qid: 5, db: 'TMUA_MOCK', hidden: true, tagged: true },
  { qid: 6, db: 'DIAG75', diag: true },
];
const RESERVED = [2, 3];
const qidsOf = (entries) => entries.map((entry) => entry.qid);
const leaked = (qids) => [...qids].filter((qid) => RESERVED.includes(qid));

/** 两道 reserved 都做错过好几次——是错题榜上最显眼的两行 */
function recordsWithReservedWrong() {
  const records = createEmptyRecords();
  records.q = {
    1: { a: 1, w: 0, t: 10, c: 1 },
    2: { a: 5, w: 5, t: 50, c: 0 },
    3: { a: 4, w: 4, t: 40, c: 0 },
    4: { a: 2, w: 1, t: 20, c: 0 },
    5: { a: 1, w: 1, t: 30, c: 0 },
  };
  return records;
}

// ---------------- 新旧战绩与解锁 ----------------

test('the retired GMAT result and the 7.5+ result are kept apart: migration by separation', () => {
  // 迁移矩阵：旧 GMAT 已通过 / 旧未通过且用完机会 / 旧未通过只考过一次 / 从没考过
  const cases = [
    { name: 'old pass', diag: { passed: true, attempts: 1, lastTs: 5 }, unlocked: true },
    { name: 'old fail, exhausted', diag: { passed: false, attempts: 2, lastTs: 5 }, unlocked: false },
    { name: 'old fail, one attempt', diag: { passed: false, attempts: 1, lastTs: 5 }, unlocked: false },
    { name: 'no record', diag: undefined, unlocked: false },
  ];
  for (const row of cases) {
    // 走一遍真正的读档路径：localStorage 里存的是 JSON，读出来过 normalizeRecords
    const stored = JSON.parse(
      JSON.stringify({ v: 1, q: {}, s: [], ...(row.diag ? { diag: row.diag, grill: [9002071010] } : {}) }),
    );
    const records = normalizeRecords(stored);

    assert.equal(isHiddenModeUnlocked(INDEX, records), row.unlocked, `${row.name}: unlock`);
    // 旧战绩原样留着，一个字都不改写
    assert.deepEqual(records.diag, row.diag, `${row.name}: the old record is untouched`);
    // 新考试从 0 次起步：谁都有完整的两次机会（旧的考试次数不算数）
    assert.equal(records.diag75, undefined, `${row.name}: no 7.5+ record yet`);
    assert.equal(attemptsLeft(records.diag75), 2, `${row.name}: two fresh attempts`);
    assert.equal(canAttempt(records.diag75), true, `${row.name}: may sit the 7.5+`);

    // 考一次没过：只动 diag75，旧战绩与旧绑定原样
    const failed = recordDiagnostic(records, [101, 102], false, { now: 100 });
    assert.equal(failed.diag75.attempts, 1);
    assert.equal(attemptsLeft(failed.diag75), 1);
    assert.deepEqual(failed.diag, row.diag);
    assert.equal(isHiddenModeUnlocked(INDEX, failed), row.unlocked, `${row.name}: a failed 7.5+ changes nothing`);

    // 再考一次通过：解锁（已经解锁的人本来也进不了介绍页，这里只看判定本身）
    const passed = recordDiagnostic(failed, [103], true, { now: 200 });
    assert.equal(isHiddenModeUnlocked(INDEX, passed), true, `${row.name}: passing the 7.5+ unlocks`);
    assert.equal(canAttempt(passed.diag75), false, 'no more attempts once passed');
  }

  // 两次都没过：机会用完，只剩 365 那条路
  const twice = recordDiagnostic(recordDiagnostic(createEmptyRecords(), [1], false), [2], false);
  assert.equal(attemptsLeft(twice.diag75), 0);
  assert.equal(canAttempt(twice.diag75), false);
  assert.equal(isHiddenModeUnlocked(INDEX, twice), false);

  // 365 那条路与诊断互不依赖
  const index = Array.from({ length: 400 }, (_, i) => ({ qid: i + 1, db: 'TMUA' }));
  const practised = createEmptyRecords();
  for (let qid = 1; qid <= HIDDEN_UNLOCK_COUNT; qid++) practised.q[String(qid)] = { a: 1, w: 0, t: 1, c: 1 };
  practised.diag75 = { passed: false, attempts: 2, lastTs: 1 };
  assert.equal(isHiddenModeUnlocked(index, practised), true);

  // 清空练习记录两份战绩都保留（不是重新领机会的后门）
  const cleared = clearRecords({ ...twice, diag: { passed: false, attempts: 2, lastTs: 3 } });
  assert.deepEqual(cleared.diag75, twice.diag75);
  assert.deepEqual(cleared.diag, { passed: false, attempts: 2, lastTs: 3 });
});

// ---------------- reserved：出池但计数 ----------------

test('reserved questions are out of every practice pick path', () => {
  const records = recordsWithReservedWrong();

  // 经典池 / 9.0 池（卡面题数、题库按钮上的题数都读这一层）
  const classic = indexForLibraryMode(INDEX, 'classic');
  assert.deepEqual(qidsOf(classic), [1, 4]);
  assert.deepEqual(qidsOf(indexForLibraryMode(INDEX, 'hidden')), [5]);
  // 逻辑推理三档建在这层之上：「仅逻辑题」也摸不到那道 reserved 逻辑题
  assert.deepEqual(qidsOf(indexForLogicReasoning(classic, 'only')), [4]);
  assert.deepEqual(qidsOf(indexForLogicReasoning(classic, 'exclude')), [1]);

  // 抽题范围三档：错得再多，新题 + 错题那档也抽不到
  const shown = { random: 2, 'wrong-and-new': 1, 'new-only': 0 };
  for (const mode of ['random', 'wrong-and-new', 'new-only']) {
    for (let round = 0; round < 20; round++) {
      assert.deepEqual(leaked(pickQidsForMode(classic, 'ALL', 50, mode, records)), [], `${mode} drew a reserved question`);
    }
    // 面板上报的可抽题数同样不数 reserved
    assert.equal(availableCountForMode(classic, 'ALL', mode, records), shown[mode], `${mode} count includes reserved`);
  }

  // 重练错题：榜按练习池过滤，两道最常错的 reserved 不上榜，「重练这些」自然练不到
  const practice = practiceQids(INDEX);
  assert.deepEqual([...practice].sort(), [1, 4, 5]);
  const missed = wrongRanking(records, Number.POSITIVE_INFINITY).filter((row) => practice.has(row.qid));
  assert.deepEqual(missed.map((row) => row.qid), [5, 4]);
  // 统计条与榜同源：「N 道当前错题」不数 reserved，不会出现数字对不上榜的情况
  assert.equal(practiceOverview(records, practice).wrongNow, missed.length);

  // 「练这类题」（复烤区知识点复盘）：范围读 reachableIndex，本身已挡；topicEntries 再挡一道
  const topics = { v: 1, vocab: ['Algebra'], byTopic: { Algebra: [1, 2, 3, 4, 5] }, coverage: {} };
  assert.deepEqual(qidsOf(reachableIndex(INDEX, false)), [1, 4]);
  assert.deepEqual(qidsOf(reachableIndex(INDEX, true)), [1, 4, 5]);
  assert.deepEqual(qidsOf(topicEntries(topics, 'Algebra', reachableIndex(INDEX, true))), [1, 4, 5]);
  assert.deepEqual(qidsOf(topicEntries(topics, 'Algebra', INDEX)), [1, 4, 5], 'the second gate holds on its own');
  // 复盘覆盖率的分子分母与统计池同口径
  const reach = topicReach(topics, records, INDEX);
  assert.equal(reach.attempted, 3);
  assert.equal(reach.analysed, 3);

  // 显式 qid 通道（重练 / 练这类题都走它）在 start() 里还有第二道闸，只有复烤区开门
  const exam = fs.readFileSync(examPath, 'utf8');
  assert.match(exam, /\(override\.allowDiag \|\| \(!entry\.diag && !entry\.reserved\)\) && selected\.has\(entry\.qid\)/);
});

test('reserved questions still count toward 365, so nobody drops out of an unlock', () => {
  // 400 道经典题，其中两道被 7.5+ 卷一征用；恰好做满 365 道，含那两道
  const index = Array.from({ length: 400 }, (_, i) => ({
    qid: i + 1,
    db: 'TMUA',
    ...(i + 1 === 7 || i + 1 === 300 ? { reserved: true } : {}),
  }));
  const records = createEmptyRecords();
  for (let qid = 1; qid <= HIDDEN_UNLOCK_COUNT; qid++) records.q[String(qid)] = { a: 1, w: 0, t: 1, c: 1 };

  assert.equal(validCompletedCount(index, records), HIDDEN_UNLOCK_COUNT);
  assert.equal(hiddenUnlockProgress(index, records), 1);
  assert.equal(isHiddenModeUnlocked(index, records), true, 'the two reserved answers keep counting');
  // 对照：若 reserved 也被当成诊断题剔掉，这个人就会掉回 363
  const asIfDiag = index.map((entry) => (entry.reserved ? { ...entry, diag: true } : entry));
  assert.equal(validCompletedCount(asIfDiag, records), HIDDEN_UNLOCK_COUNT - 2);

  // 真实产物：两道 reserved 在 index 里，且照样进 365 计数
  const real = readExamIndex();
  const reserved = real.filter((entry) => entry.reserved);
  assert.deepEqual(qidsOf(reserved).sort((a, b) => a - b), [20180211900, 20230300110]);
  const touched = createEmptyRecords();
  for (const entry of reserved) touched.q[String(entry.qid)] = { a: 1, w: 1, t: 1, c: 0 };
  assert.equal(validCompletedCount(real, touched), 2);
});

test('the real classic pool loses exactly the two reserved questions, one from TMUA and one from MAT', () => {
  const index = readExamIndex();
  const classic = indexForLibraryMode(index, 'classic');
  const countBy = (entries, db) => entries.filter((entry) => entry.db === db).length;
  const beforeReserve = index.filter((entry) => !entry.diag && !entry.hidden);
  // 卡面 / 题库按钮上的数字就是这一层：TMUA、MAT 各少一道，其余库不动
  for (const [db, lost] of [['TMUA', 1], ['MAT', 1], ['SMC', 0], ['ECAA', 0]]) {
    assert.equal(countBy(classic, db), countBy(beforeReserve, db) - lost, `${db} classic count`);
  }
  // 9.0 区一道不少：那 7 道在 9.0 区的考题不动
  const expanded = indexForLibraryMode(index, 'hidden');
  assert.equal(expanded.length, index.filter((entry) => !entry.diag && entry.hidden).length);
  for (const qid of [20132101203120, 20132101203117, 20132101203115, 20050300104, 20040300103, 20050300102, 20132101203108]) {
    assert.ok(expanded.some((entry) => entry.qid === qid), `${qid} should stay in 9.0 Trivial`);
  }
});

test('the paper wall and the finish banner leave reserved out alike, so those papers still fill up', () => {
  const papers = {
    v: 1,
    papers: [{ key: 'TMUA|TMUA P1 2018', db: 'TMUA', label: 'TMUA P1 2018', qids: [104, 103, 102, 101] }],
  };
  const index = [
    { qid: 104, db: 'TMUA', reserved: true },
    { qid: 103, db: 'TMUA' },
    { qid: 102, db: 'TMUA' },
    { qid: 101, db: 'TMUA' },
  ];
  const reach = new Set(qidsOf(reachableIndex(index, false)));

  // 没碰过 reserved 的人：做满剩下三道就是满档
  const done = createEmptyRecords();
  for (const qid of [101, 102, 103]) done.q[String(qid)] = { a: 1, w: 0, t: 1, c: 1 };
  const [row] = paperProgress(papers, reach, done);
  assert.deepEqual([row.done, row.total, row.ratio], [3, 3, 1]);
  assert.equal(paperLevel(row.done, row.total), PAPER_LEVELS - 1);

  // 早就做过 reserved 那道的人：分子分母同样不算它，不会出现 4/3 这种数
  const veteran = createEmptyRecords();
  for (const qid of [104, 101]) veteran.q[String(qid)] = { a: 1, w: 0, t: 1, c: 1 };
  const [old] = paperProgress(papers, reach, veteran);
  assert.deepEqual([old.done, old.total], [1, 3]);

  // 完卷横幅与墙同一条判据：答完最后一道非 reserved 的题就报这一卷做满
  const before = createEmptyRecords();
  for (const qid of [101, 102]) before.q[String(qid)] = { a: 1, w: 0, t: 1, c: 1 };
  const banner = papersJustCompleted(papers, reach, before, new Set([103]));
  assert.deepEqual(banner.map((paper) => paper.label), ['TMUA P1 2018']);
});

test('the grill still serves reserved and diagnostic questions once they are bound', () => {
  // 考完 7.5+，那 10 道题并进复烤区：含 reserved（经典区征用的）与 diag（野题）。
  // 复烤区的分工就是把它们烤明白，所以这里不挡
  const records = recordDiagnostic(createEmptyRecords(), [2, 6, 1], false, { now: 1 });
  assert.deepEqual(qidsOf(grillEntries(INDEX, records)).sort(), [1, 2, 6]);
  const picked = pickGrillQids(INDEX, records, 10, 'random');
  assert.deepEqual([...picked].sort(), [1, 2, 6]);
  // 复烤区开场走的是 allowDiag 那扇门（start() 的第二道闸只对它放行）
  const exam = fs.readFileSync(examPath, 'utf8');
  assert.match(exam, /start\(\{ db: 'ALL', qids, allowDiag: true, origin: 'grill' \}\)/);
});

// ---------------- XLSX ----------------

test('a new workbook carries both diagnostic records and round-trips them', async () => {
  const records = recordDiagnostic(
    { ...createEmptyRecords(), diag: { passed: false, attempts: 2, lastTs: 1_600_000_000_000 }, grill: [11, 12] },
    [21, 22],
    false,
    { now: 1_700_000_000_000 },
  );
  const file = await exportRecordsWorkbook(records);
  const sheets = await readExcelFile(await file.arrayBuffer());
  const diagSheet = sheets.find((sheet) => sheet.sheet === 'Diagnostic');

  // 前四列与老格式逐格相同——旧站读这份文件只看前四列，绑定集与旧战绩一样不少
  assert.deepEqual(diagSheet.data[0].slice(0, 4), [...DIAGNOSTIC_HEADERS]);
  assert.deepEqual(diagSheet.data[0].slice(4), [...DIAGNOSTIC75_HEADERS]);
  assert.deepEqual(diagSheet.data.slice(1).map((row) => row[0]), [11, 12, 21, 22]);
  for (const row of diagSheet.data.slice(1)) {
    assert.deepEqual(row.slice(1, 3), ['No', 2]);
    assert.deepEqual(row.slice(4, 6), ['No', 1]);
  }

  const back = await importRecordsWorkbook(await file.arrayBuffer(), new Set([11, 12, 21, 22]));
  assert.deepEqual(back.grill, [11, 12, 21, 22]);
  assert.deepEqual(back.diag, { passed: false, attempts: 2, lastTs: 1_600_000_000_000 });
  assert.deepEqual(back.diag75, { passed: false, attempts: 1, lastTs: 1_700_000_000_000 });

  // 只有战绩、没有绑定题（防守分支）：一行状态照样带上两份战绩
  const bare = await exportRecordsWorkbook({
    ...createEmptyRecords(),
    diag75: { passed: true, attempts: 1, lastTs: 1_700_000_000_000 },
  });
  const bareBack = await importRecordsWorkbook(await bare.arrayBuffer(), new Set());
  assert.equal(bareBack.grill, undefined);
  assert.equal(bareBack.diag, undefined, 'an absent GMAT record stays absent');
  assert.deepEqual(bareBack.diag75, { passed: true, attempts: 1, lastTs: 1_700_000_000_000 });
});

test('an old workbook still imports, and a mangled 7.5+ block only drops itself', async () => {
  const main = {
    data: [['QID', 'Last Attempt', 'Last Result', 'Wrong Count', 'Attempt Count'], [11, new Date(1_700_000_000_000), 'Correct', 0, 1]],
    sheet: 'Records',
    dateFormat: 'yyyy-mm-dd hh:mm:ss',
  };
  // 旧文件：诊断表只有四列（P3 格式），战绩是 GMAT 的
  const oldFile = await writeExcelFile([
    main,
    {
      data: [['QID', 'Passed', 'Attempts', 'Last Attempt'], [11, 'Yes', 1, new Date(1_690_000_000_000)]],
      sheet: 'Diagnostic',
      dateFormat: 'yyyy-mm-dd hh:mm:ss',
    },
  ]).toBlob();
  const fromOld = await importRecordsWorkbook(await oldFile.arrayBuffer(), new Set([11]));
  assert.deepEqual(fromOld.grill, [11]);
  assert.equal(fromOld.diag.passed, true, 'an old GMAT pass still unlocks after import');
  assert.equal(fromOld.diag75, undefined, 'no 7.5+ columns means a fresh 7.5+ record');
  assert.equal(isHiddenModeUnlocked([{ qid: 11, db: 'TMUA' }], mergeDiagnostic(createEmptyRecords(), fromOld)), true);

  // 追加列的表头被挪过：7.5+ 三列整段不读，前四列照读——不把错位的格子吞成战绩
  const shuffled = await writeExcelFile([
    main,
    {
      data: [
        ['QID', 'Passed', 'Attempts', 'Last Attempt', '7.5+ Attempts', '7.5+ Passed', '7.5+ Last Attempt'],
        [11, 'No', 0, null, 1, 'Yes', new Date(1_700_000_000_000)],
      ],
      sheet: 'Diagnostic',
      dateFormat: 'yyyy-mm-dd hh:mm:ss',
    },
  ]).toBlob();
  const fromShuffled = await importRecordsWorkbook(await shuffled.arrayBuffer(), new Set([11]));
  assert.deepEqual(fromShuffled.grill, [11]);
  assert.equal(fromShuffled.diag75, undefined);
  assert.equal(fromShuffled.diag, undefined);

  // 合并进本机时，本机已经用掉的 7.5+ 机会不会被一份旧文件「退回」
  const local = { ...createEmptyRecords(), diag75: { passed: false, attempts: 2, lastTs: 9 } };
  assert.deepEqual(mergeDiagnostic(local, fromOld).diag75, { passed: false, attempts: 2, lastTs: 9 });
});
