import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const pagePath = 'src/app/admin/page.tsx';

test('the admin page exists, gates by password, and is honest about being decorative', () => {
  const page = fs.readFileSync(pagePath, 'utf8');

  assert.match(page, /^'use client';/, '静态导出下要在浏览器端跑，必须是 client 组件');
  assert.match(page, /const ADMIN_PASSWORD = 'admin123';/);
  assert.match(page, /sessionStorage/, '登录态放 sessionStorage，关标签页即失效');
  // 纯静态站没有后端，这道门只能防误入。页面必须自己把这句实话说出来，
  // 免得有人真把它当访问控制用
  assert.match(page, /不是安全边界/);
  assert.match(page, /只防误入|只挡误入/);

  // 彻底清空走 createEmptyRecords：连解锁与绑定一起归零，
  // 和用户端「清空保留解锁」是刻意相反的语义，注释里要说明
  assert.match(page, /createEmptyRecords\(\)/);
  assert.match(page, /回到出厂/);
});

test('the two diagnostic switches act on the 7.5+ record and leave the GMAT one alone', async () => {
  const {
    createEmptyRecords,
    isHiddenModeUnlocked,
    markDiagnosticPassed,
    resetDiagnosticRecord,
  } = await import('../src/lib/records.ts');
  const legacy = { passed: false, attempts: 2, lastTs: 3 };
  const base = { ...createEmptyRecords(), diag: legacy, grill: [7, 8] };

  // 设为诊断通过：写 diag75、解锁 9.0；旧 GMAT 战绩原样
  const passed = markDiagnosticPassed(base, 1000);
  assert.deepEqual(passed.diag75, { passed: true, attempts: 1, lastTs: 1000 });
  assert.deepEqual(passed.diag, legacy);
  assert.equal(isHiddenModeUnlocked([{ qid: 1, db: 'TMUA' }], passed), true);
  // 已经考过的次数保留，不被改写成 1
  const tried = markDiagnosticPassed({ ...base, diag75: { passed: false, attempts: 2, lastTs: 5 } }, 9);
  assert.deepEqual(tried.diag75, { passed: true, attempts: 2, lastTs: 9 });

  // 重置诊断/Grill：7.5+ 战绩与绑定集清掉，回到「从没考过 7.5+」；旧 GMAT 战绩原样
  const reset = resetDiagnosticRecord(passed);
  assert.equal(reset.diag75, undefined);
  assert.equal(reset.grill, undefined);
  assert.deepEqual(reset.diag, legacy);
  // 旧 GMAT 已通过的人重置 7.5+ 之后仍然解锁：那条迁移规则不能被调试按钮弄脏
  const oldPass = resetDiagnosticRecord({ ...createEmptyRecords(), diag: { passed: true, attempts: 1, lastTs: 1 } });
  assert.equal(isHiddenModeUnlocked([{ qid: 1, db: 'TMUA' }], oldPass), true);

  // 页面上的两个按钮走的就是这两个函数，且不再直接改写 diag
  const page = fs.readFileSync(pagePath, 'utf8');
  assert.match(page, /apply\(markDiagnosticPassed\(records\), /);
  assert.match(page, /apply\(resetDiagnosticRecord\(records\), /);
  assert.doesNotMatch(page, /delete next\.diag\b/);
  assert.doesNotMatch(page, /\bdiag: \{ passed/);
  // 两份战绩都摆出来，旧的标明只读
  assert.match(page, /describeDiag\(records\.diag75\)/);
  assert.match(page, /describeDiag\(records\.diag\)/);
});

test('the admin page can clear the sealed-papers unlock on this machine, and only that', () => {
  const page = fs.readFileSync(pagePath, 'utf8');
  // 与其它调试按钮同款（styles.btn），点下去走 lib/sealed 的 clearSealedUnlock——只删解锁印记那一个键
  const at = page.indexOf('密卷：清除解锁');
  assert.ok(at >= 0, '缺「密卷：清除解锁」按钮');
  const button = page.slice(page.lastIndexOf('<button', at), at);
  assert.match(button, /className=\{styles\.btn\}/);
  assert.match(button, /clearSealedUnlock\(\);/);
  // 不碰做题记录：这个按钮的点击里没有 apply / saveRecords
  assert.doesNotMatch(button, /apply\(|saveRecords\(/);
  assert.match(page, /import \{[^}]*\bclearSealedUnlock\b[^}]*\} from '@\/lib\/sealed';/);
  // 窗口与本机状态摆出来，方便调试改期
  assert.match(page, /SEALED_WINDOW\.from/);
  assert.match(page, /SEALED_WINDOW\.until/);
});

test('the main site never links to the admin page', () => {
  // 入口只靠手输 URL。主站任何可见组件都不该出现 admin 字样
  for (const file of [
    'src/components/exam/ExamApp.tsx',
    'src/components/deck/CardDeck.tsx',
    'src/components/progress/ProgressPanel.tsx',
    'src/app/page.tsx',
  ]) {
    const src = fs.readFileSync(file, 'utf8');
    assert.equal(/admin/i.test(src), false, `${file} 不该引用 admin`);
  }
});
