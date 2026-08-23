import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const examPath = 'src/components/exam/ExamApp.tsx';
const cssPath = 'src/components/exam/Exam.module.css';

test('the unsolved answer panel renders a placeholder, never blurred real content', () => {
  const exam = fs.readFileSync(examPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  // 高斯模糊挡不住轮廓（「答案:C」的大字短行、图形题的图都透得出来），
  // 而且 blur 只是视觉滤镜——DOM 里仍是明文，划选 / Ctrl+F / 读屏都拿得到。
  // 唯一站得住的遮罩是「压根不渲染」：真实答案与解析必须在揭示条件之内
  assert.match(
    exam,
    /\{solShown\.has\(idx\) && isGraded \? \(/,
    '答案与解析要在「已批改且点开」的条件分支里才渲染',
  );
  assert.match(exam, /styles\.solPlaceholder/, '未揭示时渲染骨架占位');
  assert.match(exam, /aria-hidden="true"[\s\S]{0,200}solBar/, '占位条是装饰，读屏不该念它');

  // 旧方案不许回潮：模糊真实内容的类整个删掉
  assert.equal(exam.includes('solBlur'), false, 'solBlur 是旧的模糊遮罩，不该再被引用');
  assert.equal(css.includes('solBlur'), false, 'CSS 里也不该留 solBlur 死代码');
  assert.doesNotMatch(css, /\.solPlaceholder \{[^}]*filter:/s, '占位层不需要也不该再上滤镜');

  // 骨架条本身要有内容感的形状，但别把真实文本塞进去
  assert.match(css, /\.solBar \{[^}]*border-radius/s);
});
