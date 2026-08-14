import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import readExcelFile from 'read-excel-file/browser';
import writeExcelFile from 'write-excel-file/browser';

import {
  boundCount,
  danglingCount,
  grillAvailable,
  grillCountOptions,
  grillEntries,
  pickGrillQids,
} from '../src/lib/grill.ts';
import {
  addSession,
  createEmptyRecords,
  exportRecordsWorkbook,
  importRecordsWorkbook,
  mergeDiagnostic,
  recordDiagnostic,
} from '../src/lib/records.ts';
import * as recordsModule from '../src/lib/records.ts';

const panelPath = 'src/components/grill/GrillPanel.tsx';
const cssPath = 'src/components/grill/Grill.module.css';
const examPath = 'src/components/exam/ExamApp.tsx';
const zonesPath = 'src/components/deck/zones.ts';
const resultPath = 'src/components/diagnostic/DiagnosticResult.tsx';

/** 一个小索引：1..n 是普通题，diag 的另标 */
function fakeIndex(qids, opts = {}) {
  return qids.map((qid) => ({ qid, db: opts.db || 'GMAT', ...(opts.diag ? { diag: true } : {}) }));
}

function recordsWith(grill, q = {}) {
  return { v: 1, q, s: [], grill };
}

test('the bound set is intersected with the index so dangling qids cannot reach the exam', () => {
  // 题库换代后绑定集里可能留着已经不存在的 qid，直接拿去取题会 404 掉整场
  const index = fakeIndex([101, 102, 103], { diag: true });
  const records = recordsWith([101, 999, 103, 12345]);

  assert.equal(boundCount(records), 4, 'the raw bound set still reports what was bound');
  assert.deepEqual(
    grillEntries(index, records).map((entry) => entry.qid),
    [101, 103],
    'only qids that still exist in the index survive',
  );
  assert.equal(danglingCount(index, records), 2, 'the dropped ones are reported honestly');

  // 抽出来的题一定在索引里
  const picked = pickGrillQids(index, records, 10, 'random');
  assert.equal(picked.length, 2);
  assert.equal(picked.every((qid) => [101, 103].includes(qid)), true);
  assert.equal(picked.includes(999), false, 'a dangling qid must never be picked');

  // 空绑定集不炸
  const empty = createEmptyRecords();
  assert.deepEqual(grillEntries(index, empty), []);
  assert.equal(grillAvailable(index, empty, 'random'), 0);
  assert.deepEqual(pickGrillQids(index, empty, 5, 'random'), []);
  assert.deepEqual(pickGrillQids(null, records, 5, 'random'), []);
  assert.equal(danglingCount(null, records), 0, 'no index yet means nothing is known to be dangling');
});

test('all three pick modes work on the grill pool', () => {
  const index = fakeIndex([1, 2, 3, 4, 5, 6], { diag: true });
  // 1,2 做对过；3,4 当前做错；5,6 没练过
  const q = {
    1: { a: 2, w: 0, t: 10, c: 1 },
    2: { a: 1, w: 0, t: 11, c: 1 },
    3: { a: 3, w: 2, t: 12, c: 0 },
    4: { a: 1, w: 1, t: 13, c: 0 },
  };
  const records = recordsWith([1, 2, 3, 4, 5, 6], q);

  // 纯随机：整池都能抽
  assert.equal(grillAvailable(index, records, 'random'), 6);
  assert.equal(pickGrillQids(index, records, 6, 'random').length, 6);

  // 仅新题：只剩没练过的 5、6
  assert.equal(grillAvailable(index, records, 'new-only'), 2);
  const newOnly = pickGrillQids(index, records, 6, 'new-only');
  assert.deepEqual([...newOnly].sort(), [5, 6]);

  // 新题 + 错题：没练过的 2 道 + 当前错的 2 道
  assert.equal(grillAvailable(index, records, 'wrong-and-new'), 4);
  const mixed = pickGrillQids(index, records, 4, 'wrong-and-new');
  assert.equal(mixed.length, 4);
  assert.equal(
    mixed.every((qid) => [3, 4, 5, 6].includes(qid)),
    true,
    'wrong-and-new must not resurface questions already answered correctly',
  );
  // 错题优先：小批量里也要至少捞到一道错题
  const small = pickGrillQids(index, records, 3, 'wrong-and-new');
  assert.equal(small.some((qid) => [3, 4].includes(qid)), true);

  // 题数档位：超过可用量的档去掉，末尾补「全部」
  assert.deepEqual(grillCountOptions(6), [5, 6]);
  assert.deepEqual(grillCountOptions(3), [3]);
  assert.deepEqual(grillCountOptions(25), [5, 10, 20, 25]);
  assert.deepEqual(grillCountOptions(0), []);
});

test('a grill session is a normal practice session: it writes q and s', () => {
  // Grill 里答案本来就公开，防泄题规则只管诊断本身
  const bound = recordDiagnostic(createEmptyRecords(), [101, 102], false, { now: 1 });
  assert.deepEqual(bound.q, {}, 'the diagnostic itself still writes nothing');
  assert.deepEqual(bound.s, []);

  const after = addSession(
    bound,
    [
      { qid: 101, selected: 'A', answer: 'A', correct: true, answered: true },
      { qid: 102, selected: 'B', answer: 'C', correct: false, answered: true },
    ],
    { db: 'ALL', mode: 'practice', n: 2, right: 1, answered: 2, sec: 90 },
    { now: 2 },
  );

  assert.equal(Object.keys(after.q).length, 2, 'grill answers land in the question stats');
  assert.equal(after.q['102'].c, 0);
  assert.equal(after.s.length, 1, 'grill sessions land in the session log');
  assert.equal(after.s[0].db, 'ALL');
  assert.equal(after.s[0].mode, 'practice');

  // 但一场普通练习绝不能顺手把绑定集和解锁抹掉：
  // addSession 重新构造对象时漏掉这两个可选字段，就等于每练一场撤销一次 9.0 解锁
  assert.deepEqual(after.grill, [101, 102], 'a session must not drop the grill bindings');
  assert.equal(after.diag.attempts, 1, 'a session must not drop the diagnostic record');
  const passedThenPractised = addSession(
    recordDiagnostic(createEmptyRecords(), [7], true, { now: 1 }),
    [{ qid: 7, selected: 'A', answer: 'A', correct: true, answered: true }],
    { db: 'TMUA', mode: 'practice', n: 1, right: 1, answered: 1, sec: 10 },
    { now: 2 },
  );
  assert.equal(passedThenPractised.diag.passed, true, 'practising must never revoke the unlock');

  // 组卷走既有的 start({ qids }) 通道 + practice 模式，考试引擎零改动
  const exam = fs.readFileSync(examPath, 'utf8');
  assert.match(exam, /const startGrill = \(\) => \{/);
  assert.match(exam, /pickGrillQids\(index, records, grillCountChoice, grillPickMode\)/);
  assert.match(exam, /setMode\('practice'\)/);
  assert.match(exam, /start\(\{ db: 'ALL', qids \}\)/);
  assert.match(exam, /if \(phase !== 'exam' \|\| !q\) return;/);
});

test('the grill zone is open, with an empty state that points at the diagnostic', () => {
  const zones = fs.readFileSync(zonesPath, 'utf8');
  const panel = fs.readFileSync(panelPath, 'utf8');
  const exam = fs.readFileSync(examPath, 'utf8');
  const result = fs.readFileSync(resultPath, 'utf8');

  // grill 卡不再是 coming-soon 骨架
  const grillBlock = zones.slice(zones.indexOf("id: 'grill'"), zones.indexOf("id: 'trivial'"));
  assert.match(grillBlock, /comingSoon: false/);

  // 空态文案与指路
  assert.match(panel, /if \(bound === 0\)/);
  assert.match(panel, /t\.grill\.emptyTitle/);
  assert.match(panel, /t\.grill\.emptyHint/);
  assert.match(panel, /t\.grill\.goDiagnostic/);
  assert.match(panel, /useLang\(\)/);
  // 卡面副文：绑了报数，没绑说清楚要先考一次
  assert.match(exam, /t\.grill\.emptySub/);
  assert.match(exam, /t\.diagnostic\.grillBound\(grillCount\(records\)\)/);

  // 面板挂在 grill 前位上，且悬空数如实显示
  assert.match(exam, /frontZone === 'grill' \? \(/);
  assert.match(exam, /<GrillPanel/);
  assert.match(panel, /t\.grill\.dangling\(dangling\)/);

  // 诊断成绩页给一条直达路径，别让用户自己找
  assert.match(result, /onGoGrill/);
  assert.match(result, /去 Grill 看看/);
  assert.match(exam, /const goToGrillFromResult = \(\) => \{/);
  assert.match(exam, /chooseZone\('grill'\)/);
});

test('the workbook carries the grill bindings, and old files still import', async () => {
  const records = recordDiagnostic(createEmptyRecords(), [901, 902, 903], true, { now: 1_700_000_000_000 });
  const file = await exportRecordsWorkbook(records);
  const sheets = await readExcelFile(await file.arrayBuffer());

  // 第三张表：表名与表头都引用导出的常量
  const diagSheet = sheets.find((s) => s.sheet === recordsModule.DIAGNOSTIC_SHEET_NAME);
  assert.ok(diagSheet, 'the workbook must carry a Diagnostic sheet');
  assert.equal(recordsModule.DIAGNOSTIC_SHEET_NAME, 'Diagnostic');
  assert.deepEqual(diagSheet.data[0], [...recordsModule.DIAGNOSTIC_HEADERS]);
  assert.equal(diagSheet.data.length, 4, 'header plus one row per bound qid');
  assert.deepEqual(
    diagSheet.data.slice(1).map((row) => row[0]),
    [901, 902, 903],
  );
  assert.equal(diagSheet.data[1][1], 'Yes');
  assert.equal(diagSheet.data[1][2], 1);

  // 往返：导入还原绑定集与战绩
  const back = await importRecordsWorkbook(await file.arrayBuffer(), new Set([901, 902, 903]));
  assert.deepEqual(back.grill, [901, 902, 903]);
  assert.equal(back.diag.passed, true);
  assert.equal(back.diag.attempts, 1);
  assert.equal(back.s.length, 0, 'session history still does not travel in the file');

  // 老文件（只有主表，没有 Diagnostic 表）照常导入，不因为缺表报错
  const legacyFile = await writeExcelFile(
    [
      ['QID', 'Last Attempt', 'Last Result', 'Wrong Count', 'Attempt Count'],
      [901, new Date(1_700_000_000_000), 'Correct', 0, 1],
    ],
    { sheet: 'Records', dateFormat: 'yyyy-mm-dd hh:mm:ss' },
  ).toBlob();
  const fromLegacy = await importRecordsWorkbook(await legacyFile.arrayBuffer(), new Set([901]));
  assert.equal(fromLegacy.grill, undefined, 'an old file simply carries no bindings');
  assert.equal(fromLegacy.diag, undefined);
  assert.equal(Object.keys(fromLegacy.q).length, 1);
});

test('a Diagnostic sheet with a wrong header is skipped whole, not misread by column position', async () => {
  // 导入端按列序硬读诊断表。列序对不上（比如被 Excel 挪过列）时，
  // 宁可当这张表不存在，也不能把 Passed 列当 QID 吞进 grill
  const shuffled = await writeExcelFile(
    [
      {
        data: [['QID', 'Last Attempt', 'Last Result', 'Wrong Count', 'Attempt Count'], [901, new Date(1_700_000_000_000), 'Correct', 0, 1]],
        sheet: 'Records',
        dateFormat: 'yyyy-mm-dd hh:mm:ss',
      },
      {
        data: [['Passed', 'QID', 'Last Attempt', 'Attempts'], ['Yes', 901, new Date(1_700_000_000_000), 1]],
        sheet: 'Diagnostic',
        dateFormat: 'yyyy-mm-dd hh:mm:ss',
      },
    ],
  ).toBlob();

  const imported = await importRecordsWorkbook(await shuffled.arrayBuffer(), new Set([901]));
  assert.equal(imported.grill, undefined, 'a misaligned sheet must contribute nothing');
  assert.equal(imported.diag, undefined);
  assert.equal(Object.keys(imported.q).length, 1, 'the main sheet still imports as usual');

  // 反向钉住：前四列匹配即可，之后追加的列不碍事——给未来的格式演进留缝
  const extended = await writeExcelFile(
    [
      {
        data: [['QID', 'Last Attempt', 'Last Result', 'Wrong Count', 'Attempt Count'], [901, new Date(1_700_000_000_000), 'Correct', 0, 1]],
        sheet: 'Records',
        dateFormat: 'yyyy-mm-dd hh:mm:ss',
      },
      {
        data: [['QID', 'Passed', 'Attempts', 'Last Attempt', 'Future Column'], [901, 'Yes', 1, new Date(1_700_000_000_000), 'whatever']],
        sheet: 'Diagnostic',
        dateFormat: 'yyyy-mm-dd hh:mm:ss',
      },
    ],
  ).toBlob();

  const fromExtended = await importRecordsWorkbook(await extended.arrayBuffer(), new Set([901]));
  assert.deepEqual(fromExtended.grill, [901]);
  assert.equal(fromExtended.diag.passed, true);
});

test('the count choice follows the pool when a narrower strategy shrinks it', () => {
  // pickGrillQids 对超额 count 会悄悄截断（显示 20、实抽 3 的错位），
  // 面板必须把超限的选择压回「全部」档，让显示与行为对齐
  const panel = fs.readFileSync(panelPath, 'utf8');
  assert.match(panel, /if \(available > 0 && count > available\) onCount\(available\);/);
  assert.match(panel, /useEffect/);

  // 档位本身随可用量塌缩：可用 3 时只剩「全部 (3)」一档
  assert.deepEqual(grillCountOptions(3), [3]);
  assert.deepEqual(grillCountOptions(20), [5, 10, 20]);
});

test('importing merges diagnostic progress instead of overwriting it', () => {
  const local = {
    v: 1,
    q: {},
    s: [],
    grill: [1, 2],
    diag: { passed: false, attempts: 2, lastTs: 100 },
  };
  const imported = {
    v: 1,
    q: { 5: { a: 1, w: 0, t: 5, c: 1 } },
    s: [],
    grill: [2, 3],
    diag: { passed: true, attempts: 1, lastTs: 50 },
  };

  const merged = mergeDiagnostic(local, imported);
  // 绑定集取并集，passed 取 OR，attempts 取 max，lastTs 取新
  assert.deepEqual([...merged.grill].sort((a, b) => a - b), [1, 2, 3]);
  assert.equal(merged.diag.passed, true, 'a pass from either side counts');
  assert.equal(merged.diag.attempts, 2);
  assert.equal(merged.diag.lastTs, 100);
  // 练习记录本身仍然以文件为准
  assert.deepEqual(merged.q, imported.q);

  // 老文件（没有诊断表）不该把本机的战绩冲掉
  const fromOldFile = mergeDiagnostic(local, { v: 1, q: {}, s: [] });
  assert.deepEqual([...fromOldFile.grill].sort((a, b) => a - b), [1, 2]);
  assert.deepEqual(fromOldFile.diag, { passed: false, attempts: 2, lastTs: 100 });

  // 两边都没有就不要凭空造出字段
  const nothing = mergeDiagnostic({ v: 1, q: {}, s: [] }, { v: 1, q: {}, s: [] });
  assert.equal(nothing.grill, undefined);
  assert.equal(nothing.diag, undefined);

  const exam = fs.readFileSync(examPath, 'utf8');
  assert.match(exam, /mergeDiagnostic\(records, imported\)/);
});

test('grill motion stays on the compositor', () => {
  const css = fs.readFileSync(cssPath, 'utf8');
  const declarations = css.match(/transition:[^;]*/g) || [];
  assert.ok(declarations.length >= 1);
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
  assert.doesNotMatch(css, /backdrop-filter/);
});
