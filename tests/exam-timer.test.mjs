import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { remainingSeconds } from '../src/lib/diagnostic.ts';

const examPath = 'src/components/exam/ExamApp.tsx';

/**
 * 结构断言要看真正跑起来的代码。注释里写「不许数 tick」本身就含 tick 四个字，
 * 不剥注释的话 doesNotMatch 会被自己的说明文字绊倒。
 */
function codeOnly(source) {
  return source
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

test('the mock countdown is driven by a deadline, never by counting ticks', () => {
  const exam = codeOnly(fs.readFileSync(examPath, 'utf8'));

  // 开考记死截止时刻，此后剩余秒数一律现算
  assert.match(exam, /deadlineRef\.current = Date\.now\(\) \+ minutes \* 60 \* 1000/);
  assert.match(exam, /setSecondsLeft\(remainingSeconds\(deadlineRef\.current\)\)/);
  // 累减那一版必须绝迹：后台标签页被限流时 setInterval 会被拉长甚至冻住，
  // 数 tick 等于把 Alt-Tab 变成一个免费暂停键
  assert.doesNotMatch(exam, /setSecondsLeft\(\(s\)/);
  assert.doesNotMatch(exam, /s - 1|return s - 1/);
  // remainingSeconds 是从 diagnostic.ts 借的同一份算法，不许再抄一份
  assert.match(exam, /import \{[\s\S]*?remainingSeconds,[\s\S]*?\} from '@\/lib\/diagnostic'/);

  // 回前台立刻重算：限流期间 tick 可能一次都没跑
  assert.match(exam, /addEventListener\('visibilitychange'/);
  assert.match(exam, /removeEventListener\('visibilitychange'/);
  assert.match(exam, /document\.hidden/);

  // finish() 带副作用（退全屏、切 phase），不许待在 setState 的 updater 里——
  // StrictMode 会把 updater 调用两次，那等于同一场交两次卷
  assert.doesNotMatch(exam, /setSecondsLeft\([\s\S]{0,120}finish\(\)/);
  assert.match(exam, /secondsLeft > 0\) return;\s*\n\s*finish\(\);/);
});

test('twenty seconds in the background cost twenty seconds, not one tick', () => {
  // 假时钟：ExamApp 开考时算的就是这个截止时间戳
  const now = 1_700_000_000_000;
  const minutes = 75;
  const deadline = now + minutes * 60 * 1000;

  assert.equal(remainingSeconds(deadline, now), minutes * 60);

  // 切后台 20 秒（这期间 setInterval 一次都没跑），回前台重算——
  // 少的是墙钟走掉的 20 秒，不是「漏了的那一个 tick」
  assert.equal(remainingSeconds(deadline, now + 20_000), minutes * 60 - 20);
  // 冻得更久也一样，没有任何时间被找回来
  assert.equal(remainingSeconds(deadline, now + 10 * 60_000), (minutes - 10) * 60);

  // 整场时限走完就是 0，不会走成负数把 fmtClock 显示成 -1:-1
  assert.equal(remainingSeconds(deadline, deadline), 0);
  assert.equal(remainingSeconds(deadline, deadline + 60_000), 0);
});

test('practice mode keeps its stopwatch and never gets a countdown', () => {
  const exam = codeOnly(fs.readFileSync(examPath, 'utf8'));

  // elapsed 照旧按 tick 累加：它只是「用了多久」，被限流少记几秒
  // 不构成可以被 Alt-Tab 占的便宜
  assert.match(exam, /setElapsed\(\(e\) => e \+ 1\)/);
  // 倒计时的三处都挂着 mock 判据，练习模式一条都碰不到
  assert.match(exam, /if \(mode === 'mock'\) setSecondsLeft\(/);
  assert.match(exam, /if \(phase !== 'exam' \|\| mode !== 'mock'\) return;/);
  assert.match(exam, /mode !== 'mock' \|\| secondsLeft > 0\) return;/);
});
