import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// 05 密卷的门槛（lib/sealed.ts）：开放窗口、密码只存哈希、输错冷却、解锁印记。
// 时间一律由调用方传进来，这里直接拿带时区的 ISO 字符串喂边界。

import {
  NO_SEALED_TRIES,
  SEALED_COOLDOWN_MS,
  SEALED_MAX_FAILS,
  SEALED_PASSWORD_SHA256,
  SEALED_WINDOW,
  checkSealedPassword,
  clearSealedUnlock,
  isSealedOpen,
  loadSealedStamp,
  msUntilSealedChange,
  noteSealedFailure,
  saveSealedUnlock,
  sealedAccess,
  sealedCooldownLeft,
  sealedPhase,
  sealedStamp,
  sealedUntilDate,
} from '../src/lib/sealed.ts';
import { SEALED_UNLOCK_KEY } from '../src/lib/storage.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const at = (iso) => Date.parse(iso);

test('this round runs from 8 Oct 00:00 to the last second of 31 Oct, Beijing time', () => {
  // 用户定的这一期：北京时间 10 月 8 日零点起，10 月 31 日 23:59:59 止
  assert.deepEqual(SEALED_WINDOW, {
    from: '2026-10-08T00:00:00+08:00',
    until: '2026-10-31T23:59:59+08:00',
  });
  assert.deepEqual(sealedUntilDate(), { month: 10, day: 31 });
});

test('the window opens on the first millisecond and stays open through the whole last second', () => {
  // 起点（含）
  assert.equal(sealedPhase(at('2026-10-07T23:59:59.999+08:00')), 'before');
  assert.equal(sealedPhase(at('2026-10-08T00:00:00.000+08:00')), 'open');
  // 终点：until 写的是最后一秒，这一整秒都还开着；下一秒起结束
  assert.equal(sealedPhase(at('2026-10-31T23:59:59.000+08:00')), 'open');
  assert.equal(sealedPhase(at('2026-10-31T23:59:59.999+08:00')), 'open');
  assert.equal(sealedPhase(at('2026-11-01T00:00:00.000+08:00')), 'ended');
  assert.equal(sealedPhase(at('2027-01-01T00:00:00+08:00')), 'ended');

  for (const iso of ['2026-10-08T00:00:00+08:00', '2026-10-20T12:00:00+08:00', '2026-10-31T23:59:59+08:00']) {
    assert.equal(isSealedOpen(at(iso)), true, iso);
  }
  for (const iso of ['2026-10-01T00:00:00+08:00', '2026-11-01T00:00:00+08:00']) {
    assert.equal(isSealedOpen(at(iso)), false, iso);
  }
});

test('the window is pinned to Beijing time, not to whatever zone the browser is in', () => {
  // 同一个时刻换成 UTC 写：北京 10-08 00:00 = UTC 10-07 16:00
  assert.equal(sealedPhase(at('2026-10-07T15:59:59.999Z')), 'before');
  assert.equal(sealedPhase(at('2026-10-07T16:00:00.000Z')), 'open');
  assert.equal(sealedPhase(at('2026-10-31T15:59:59.999Z')), 'open');
  assert.equal(sealedPhase(at('2026-10-31T16:00:00.000Z')), 'ended');
  // 洛杉矶的 10-31 傍晚已经是北京的 11-01：那边的人看到的是「已结束」，不会因为本地日期还是 31 号就多开半天
  assert.equal(sealedPhase(at('2026-10-31T10:00:00-07:00')), 'ended');
  // 奥克兰的 10-08 凌晨还是北京的 10-07 晚上：还没开
  assert.equal(sealedPhase(at('2026-10-08T03:00:00+13:00')), 'before');

  // 进程本身换到别的时区跑一遍，结果一样（解析只认字符串里写的偏移）
  const script = `
    import { sealedPhase, sealedUntilDate } from './src/lib/sealed.ts';
    console.log(JSON.stringify([
      sealedPhase(Date.parse('2026-10-07T16:00:00.000Z')),
      sealedPhase(Date.parse('2026-10-31T16:00:00.000Z')),
      sealedUntilDate(),
    ]));`;
  for (const tz of ['America/Los_Angeles', 'Pacific/Kiritimati', 'UTC']) {
    const run = spawnSync(process.execPath, ['--experimental-strip-types', '--input-type=module', '-e', script], {
      cwd: root,
      encoding: 'utf8',
      env: { ...process.env, TZ: tz },
    });
    assert.equal(run.status, 0, run.stderr);
    assert.deepEqual(JSON.parse(run.stdout.trim().split('\n').pop()), ['open', 'ended', { month: 10, day: 31 }], tz);
  }
});

test('a window that cannot be parsed stays shut instead of opening by accident', () => {
  assert.equal(sealedPhase(at('2026-10-20T00:00:00+08:00'), { from: 'soon', until: '2026-10-31T23:59:59+08:00' }), 'ended');
  assert.equal(sealedPhase(at('2026-10-20T00:00:00+08:00'), { from: '2026-10-08T00:00:00+08:00', until: '' }), 'ended');
  assert.equal(sealedPhase(Number.NaN), 'ended');
  assert.equal(msUntilSealedChange(Number.NaN), null);
});

test('the page knows how long until the card has to flip by itself', () => {
  const from = at(SEALED_WINDOW.from);
  const end = at(SEALED_WINDOW.until) + 1000;
  assert.equal(msUntilSealedChange(from - 5000), 5000, '开门前：数到开门那一刻');
  assert.equal(msUntilSealedChange(from), end - from, '开着：数到关门那一刻');
  assert.equal(msUntilSealedChange(end - 1), 1);
  assert.equal(msUntilSealedChange(end), null, '结束了就没有下一次');
});

const sha = (text) => crypto.createHash('sha256').update(text).digest('hex');

/** 仓库里会发布出去的文本：源码、脚本、测试、文档 */
function repoTextFiles() {
  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return /\.(tsx?|mjs|js|css|md|json)$/.test(entry.name) ? [full] : [];
    });
  const rootDocs = fs.readdirSync(root).filter((name) => name.endsWith('.md')).map((name) => path.join(root, name));
  return [...['src', 'scripts', 'tests', 'docs'].flatMap((dir) => walk(path.join(root, dir))), ...rootDocs];
}

test('only the SHA-256 of the password is in the repo: no word anywhere hashes to it', () => {
  assert.match(SEALED_PASSWORD_SHA256, /^[0-9a-f]{64}$/);
  // 明文不能出现在任何一个会进仓库的文件里——这条测试自己也不写明文：把每个文件按词切开，
  // 逐个算哈希，撞上配置的那个就是明文漏进来了（字母数字与下划线之外的字符都当分隔）
  const seen = new Set();
  for (const file of repoTextFiles()) {
    for (const word of fs.readFileSync(file, 'utf8').split(/[^A-Za-z0-9_]+/)) {
      if (word.length < 4 || seen.has(word)) continue;
      seen.add(word);
      assert.notEqual(sha(word), SEALED_PASSWORD_SHA256, `${path.relative(root, file)} 里出现了密码明文`);
    }
  }
  assert.ok(seen.size > 1000, '扫到的词太少，这条测试在空转');
});

test('the check compares hashes exactly, up to outer spaces', async () => {
  // 用一个测试专用的密码与它的哈希核比对规则；配置的那个哈希对应真密码，由浏览器实测核
  const hash = sha('Sesame-42');
  assert.equal(await checkSealedPassword('Sesame-42', hash), 'ok');
  assert.equal(await checkSealedPassword('  Sesame-42 ', hash), 'ok', '首尾空白不算');
  assert.equal(await checkSealedPassword('sesame-42', hash), 'wrong', '大小写要算');
  assert.equal(await checkSealedPassword('Sesame 42', hash), 'wrong');
  assert.equal(await checkSealedPassword('', hash), 'wrong');
  assert.equal(await checkSealedPassword('Sesame-42', hash.toUpperCase()), 'ok', '大写十六进制写进配置也认');
  // 换了密码（哈希）之后旧密码就不对了；不传哈希时比的是配置的那个
  assert.equal(await checkSealedPassword('Sesame-42', sha('another')), 'wrong');
  assert.equal(await checkSealedPassword('Sesame-42'), 'wrong');
});

test('without crypto.subtle (an insecure page) the check says unsupported instead of throwing', async (t) => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
  t.after(() => Object.defineProperty(globalThis, 'crypto', descriptor));
  // http 的局域网地址：crypto 还在，subtle 不在
  Object.defineProperty(globalThis, 'crypto', { value: {}, configurable: true, writable: true });
  assert.equal(await checkSealedPassword('Sesame-42', sha('Sesame-42')), 'unsupported');
  // 连 crypto 都没有
  Object.defineProperty(globalThis, 'crypto', { value: undefined, configurable: true, writable: true });
  assert.equal(await checkSealedPassword('Sesame-42', sha('Sesame-42')), 'unsupported');
  // 摘要本身抛错也不往外抛
  Object.defineProperty(globalThis, 'crypto', {
    value: { subtle: { digest: () => Promise.reject(new Error('boom')) } },
    configurable: true,
    writable: true,
  });
  assert.equal(await checkSealedPassword('Sesame-42', sha('Sesame-42')), 'unsupported');
});

test('five wrong tries in a row buy a 30-second cooldown, after which the count starts over', () => {
  assert.equal(SEALED_MAX_FAILS, 5);
  assert.equal(SEALED_COOLDOWN_MS, 30_000);

  let tries = NO_SEALED_TRIES;
  const t0 = 1_000_000;
  for (let i = 1; i < SEALED_MAX_FAILS; i++) {
    tries = noteSealedFailure(tries, t0 + i);
    assert.equal(tries.fails, i);
    assert.equal(sealedCooldownLeft(tries, t0 + i), 0, `第 ${i} 次还不该冷却`);
  }
  // 第五次：进冷却，计数归零
  tries = noteSealedFailure(tries, t0 + 10);
  assert.equal(sealedCooldownLeft(tries, t0 + 10), SEALED_COOLDOWN_MS);
  assert.equal(tries.fails, 0);
  // 冷却中再报错不延长、不计数（面板本来就挡着提交）
  assert.deepEqual(noteSealedFailure(tries, t0 + 20_000), tries);
  assert.equal(sealedCooldownLeft(tries, t0 + 10 + SEALED_COOLDOWN_MS - 1), 1);
  assert.equal(sealedCooldownLeft(tries, t0 + 10 + SEALED_COOLDOWN_MS), 0);
  // 冷却过了：重新给满次数
  const after = noteSealedFailure(tries, t0 + 10 + SEALED_COOLDOWN_MS);
  assert.deepEqual(after, { fails: 1, lockedUntil: 0 });
});

test('an unlock is a stamp of this round: a new window or a new password voids it, and so does the clock', () => {
  const stamp = sealedStamp();
  assert.ok(stamp.includes(SEALED_WINDOW.until), '印记里要有本期的 until');
  assert.ok(stamp.includes(SEALED_PASSWORD_SHA256.slice(0, 12)), '印记里要有密码哈希的前缀');
  assert.equal(stamp.includes(SEALED_PASSWORD_SHA256), false, '整串哈希不必进存储');

  const inside = at('2026-10-20T12:00:00+08:00');
  assert.equal(sealedAccess(stamp, inside), true);
  assert.equal(sealedAccess(null, inside), false);
  assert.equal(sealedAccess('1', inside), false, '旧式的布尔值不算');
  // 窗口外：印记还在也不生效
  assert.equal(sealedAccess(stamp, at('2026-11-01T00:00:00+08:00')), false);
  assert.equal(sealedAccess(stamp, at('2026-10-07T12:00:00+08:00')), false);
  // 改期：旧印记对不上新窗口
  const moved = { from: '2026-10-08T00:00:00+08:00', until: '2026-11-15T23:59:59+08:00' };
  assert.equal(sealedAccess(stamp, inside, moved), false);
  assert.equal(sealedAccess(sealedStamp(moved), inside, moved), true);
  // 换密码：同一期、旧印记也失效
  const rehashed = crypto.createHash('sha256').update('another').digest('hex');
  assert.equal(sealedAccess(stamp, inside, SEALED_WINDOW, rehashed), false);
});

test('the stamp is stored under its registered key, and a broken storage never throws', (t) => {
  const store = new Map();
  t.after(() => delete globalThis.localStorage);
  globalThis.localStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  };
  assert.equal(loadSealedStamp(), null);
  saveSealedUnlock();
  assert.deepEqual([...store.keys()], [SEALED_UNLOCK_KEY]);
  assert.equal(loadSealedStamp(), sealedStamp());
  clearSealedUnlock();
  assert.equal(loadSealedStamp(), null);

  globalThis.localStorage = {
    getItem() {
      throw new Error('blocked');
    },
    setItem() {
      throw new Error('blocked');
    },
    removeItem() {
      throw new Error('blocked');
    },
  };
  assert.equal(loadSealedStamp(), null);
  assert.doesNotThrow(() => saveSealedUnlock());
  assert.doesNotThrow(() => clearSealedUnlock());
});
