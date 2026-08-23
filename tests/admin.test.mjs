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
