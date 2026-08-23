import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { DICT } from '../src/lib/i18n.ts';

// 组件是 .tsx：--experimental-strip-types 不吃 JSX，按房规用源码断言，
// NOTICE_ID 从源码里提取而不是 import

const boardPath = 'src/components/notice/NoticeBoard.tsx';
const cssPath = 'src/components/notice/Notice.module.css';
const examPath = 'src/components/exam/ExamApp.tsx';

test('the notice board pops for unseen ids, collapses to a pill, and never nags twice', () => {
  const board = fs.readFileSync(boardPath, 'utf8');
  const NOTICE_ID = board.match(/export const NOTICE_ID = '([^']+)';/)?.[1] ?? '';

  // 版本化已读：发新公告改 NOTICE_ID 即对全员重新弹出；同一则收起过就保持收起
  assert.match(board, /export const NOTICE_ID = '[^']+';/);
  assert.match(board, /mcq-test:notice:v1/);
  assert.ok(/^\d{4}-\d{2}/.test(NOTICE_ID), 'id 以年月开头，翻公告历史时对得上时间');

  // 首帧一律收起 + effect 回读（水合纪律），落盘在收起的 handler 里
  assert.match(board, /useState\(false\)/);
  assert.match(board, /useEffect\(\(\) => \{[\s\S]{0,200}localStorage\.getItem\(NOTICE_KEY\)/);
  assert.match(board, /const dismiss = \(\) => \{[\s\S]{0,200}localStorage\.setItem\(NOTICE_KEY, NOTICE_ID\)/);

  // 药丸态可再展开，且对读屏交代自己是折叠控件
  assert.match(board, /aria-expanded="false"/);
  assert.match(board, /role="region" aria-label=\{t\.notice\.regionAria\}/);
});

test('the notice mounts only in the setup phase, far away from the exam runtime', () => {
  const exam = fs.readFileSync(examPath, 'utf8');
  const mounts = exam.match(/<NoticeBoard \/>/g) || [];
  assert.equal(mounts.length, 1, '只挂一处');
  // 挂载点在 setup 相的返回体里（IdBadge/LangToggle 同层），考试运行时不受打扰
  const setupStart = exam.indexOf("if (phase === 'setup' || phase === 'loading') {");
  const mountAt = exam.indexOf('<NoticeBoard />');
  assert.ok(setupStart > 0 && mountAt > setupStart, '公告属于 setup 相');
  // 诊断与考试的渲染分支在 setup 返回体之外，不该再出现第二次
  assert.equal(exam.indexOf('<NoticeBoard />', mountAt + 1), -1);
});

test('notice motion stays on the compositor and respects reduced motion', () => {
  const css = fs.readFileSync(cssPath, 'utf8');
  const transitions = css.match(/transition:[^;]*/g) || [];
  for (const declaration of transitions) {
    for (const banned of ['width', 'height', 'top', 'left', 'margin', 'filter', 'box-shadow']) {
      assert.equal(
        declaration.includes(banned),
        false,
        `非合成器属性 "${banned}" 出现在 ${declaration.trim()}`,
      );
    }
  }
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /backdrop-filter/);
  // 流光标题必须有实色兜底：background-clip: text 不可用时不能显示成一块渐变色砖
  assert.match(css, /@supports \(background-clip: text\)/);
  const headlineBlocks = [...css.matchAll(/\.headline \{[^}]*\}/gs)].map((m) => m[0]);
  assert.ok(
    headlineBlocks.some((block) => /color: var\(--accent\)/.test(block)),
    '兜底实色要写在无条件的 .headline 块里（@supports 之外）',
  );
});

test('both dictionaries carry the notice copy', () => {
  for (const [lang, dict] of Object.entries(DICT)) {
    const n = dict.notice;
    for (const key of ['pill', 'pillAria', 'regionAria', 'collapse', 'headline', 'itemMat', 'itemTmuaCn', 'note']) {
      assert.ok(n[key]?.trim().length > 0, `${lang} 的 ${key} 是空的`);
    }
    assert.match(n.headline, /9\.0 Trivial/);
    assert.match(n.itemMat, /MAT 2024[–-]2025/);
    assert.match(n.itemTmuaCn, /TMUA CN 2024[–-]2025/);
    assert.match(n.note, /7\.5[–-]9\.0/);
  }
  // 主观提示两种语言都要如实标明是个人观点，不冒充官方定级
  assert.match(DICT.zh.notice.note, /主观|个人/);
  assert.match(DICT.en.notice.note, /personal|subjective/i);
});
