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

// ---- 题池（lib/records.ts）----

const { indexForLibraryMode, reachableIndex, validCompletedCount, createEmptyRecords } = await import(
  '../src/lib/records.ts'
);
const { readExamIndex } = await import('./helpers/exam-data.mjs');

/** 一份小索引：经典、9.0 扩展、密卷（也是 hidden）、诊断、reserved 各一两道 */
const SCOPE = [
  { qid: 1, db: 'TMUA' },
  { qid: 2, db: 'MAT' },
  { qid: 3, db: 'TMUA_MOCK', hidden: true },
  { qid: 4, db: 'MAT', hidden: true },
  { qid: 5, db: 'TMUA', hidden: true, sealed: true },
  { qid: 6, db: 'MAT', hidden: true, sealed: true },
  { qid: 7, db: 'DIAG75', diag: true },
  { qid: 8, db: 'TMUA', reserved: true },
];
const qidsOf = (entries) => entries.map((entry) => entry.qid);

test('the sealed pool is the sealed slice of 9.0: it overlaps 9.0, never the classic pool', () => {
  assert.deepEqual(qidsOf(indexForLibraryMode(SCOPE, 'sealed')), [5, 6]);
  assert.deepEqual(qidsOf(indexForLibraryMode(SCOPE, 'hidden')), [3, 4, 5, 6], '9.0 池照旧含密卷');
  assert.deepEqual(qidsOf(indexForLibraryMode(SCOPE, 'classic')), [1, 2]);
  // diag / reserved 哪怕被误打了 sealed 也不进
  const tainted = [...SCOPE, { qid: 9, db: 'TMUA', diag: true, sealed: true }, { qid: 10, db: 'MAT', reserved: true, sealed: true }];
  assert.deepEqual(qidsOf(indexForLibraryMode(tainted, 'sealed')), [5, 6]);
});

test('review scope takes in the sealed slice only while it is unlocked and open', () => {
  // 没解锁 9.0、密卷也没开：只有经典卷
  assert.deepEqual(qidsOf(reachableIndex(SCOPE, false)), [1, 2]);
  assert.deepEqual(qidsOf(reachableIndex(SCOPE, false, false)), [1, 2]);
  // 密卷开着且已解锁：多出密卷那一片，其余扩展卷照样摸不到
  assert.deepEqual(qidsOf(reachableIndex(SCOPE, false, true)), [1, 2, 5, 6]);
  // 9.0 已解锁：密卷本来就在里面，开不开都一样
  assert.deepEqual(qidsOf(reachableIndex(SCOPE, true, false)), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(qidsOf(reachableIndex(SCOPE, true, true)), [1, 2, 3, 4, 5, 6]);

  // 365 计数照旧数全量非诊断题：密卷开不开、做过的密卷题都算
  const records = createEmptyRecords();
  for (const qid of [1, 5, 6, 7, 8]) records.q[String(qid)] = { a: 1, w: 0, t: 1, c: 1 };
  assert.equal(validCompletedCount(SCOPE, records), 4, '诊断题不算，其余（含密卷、reserved）都算');
});

test('the shipped sealed pool holds 124 questions: TMUA 80 and MAT 44', () => {
  const pool = indexForLibraryMode(readExamIndex(), 'sealed');
  assert.equal(pool.length, 124);
  assert.equal(pool.filter((entry) => entry.db === 'TMUA').length, 80);
  assert.equal(pool.filter((entry) => entry.db === 'MAT').length, 44);
  assert.deepEqual([...new Set(pool.map((entry) => entry.db))].sort(), ['MAT', 'TMUA'], '题库按钮只有 TMUA / MAT / 混合');
});

// ---- 界面接线（源码级：剥注释、归一空白之后按结构查）----

const { code, jsxOpening, attrValue, fnBody, namedFn } = await import('./helpers/source.mjs');
const { DICT } = await import('../src/lib/i18n.ts');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('the password panel is a plain form: a masked field, one button, and only "wrong password" when it fails', () => {
  const gate = code(read('src/components/sealed/SealedGate.tsx'));
  const input = jsxOpening(gate, 'className={styles.input}');
  assert.ok(input && input.name === 'input', '找不到密码框');
  assert.equal(input.attrs.get('type'), '"password"');
  assert.equal(input.attrs.get('autoComplete'), '"off"');
  // 输入框与提示行连上：读屏聚焦就念到出错原因
  assert.ok(input.attrs.has('aria-describedby'));
  const submit = jsxOpening(gate, 'className={styles.submit}');
  assert.equal(submit.attrs.get('type'), '"submit"');
  // 冷却中、验证中、环境不支持、没输东西都按不动
  assert.match(attrValue(submit.attrs.get('disabled')) ?? '', /cooling > 0/);
  assert.match(attrValue(submit.attrs.get('disabled')) ?? '', /\bunsupported\b/);

  // 提交走 lib/sealed 的比对与冷却，不自己另写一套；冷却中直接不验
  const body = fnBody(namedFn(gate, 'submit'));
  assert.match(body, /sealedCooldownLeft\(tries, Date\.now\(\)\) > 0\) return;/);
  assert.match(body, /await checkSealedPassword\(password\)/);
  assert.match(body, /noteSealedFailure\(tries, Date\.now\(\)\)/);
  assert.ok(body.indexOf('onUnlock()') > body.indexOf("result === 'ok'"), '只有比对通过才解锁');
  // 错误提示只有这几句：密码不对 / 冷却读秒 / 环境不支持
  assert.match(gate, /t\.sealed\.wrong/);
  assert.match(gate, /t\.sealed\.cooldown\(Math\.ceil\(cooling \/ 1000\)\)/);
  assert.match(gate, /t\.sealed\.unsupported/);
});

test('nothing on screen tells the user the gate is not encryption — that note lives in code comments only', () => {
  // 用户不想在界面上看到写给维护者的话（Design §16 的先例）：字典里密卷相关的文案一句都不许谈这道门的性质
  const flat = (value) => (typeof value === 'function' ? String(value(10, 31)) : typeof value === 'object' ? Object.values(value).map(flat).join('\n') : String(value));
  for (const lang of ['zh', 'en']) {
    const text = flat(DICT[lang].sealed) + flat(DICT[lang].zone) + flat(DICT[lang].cardBadge);
    assert.doesNotMatch(text, /加密|门槛|安全|公开|静态站|encrypt|security|secure|public|static/i, `${lang} 的密卷文案在谈这道门的性质`);
  }
  // 那句话确实写在了代码注释里
  assert.match(read('src/lib/sealed.ts'), /这是一道门槛，不是加密/);
});

test('both languages carry the sealed copy and interpolate the date and the cooldown', () => {
  for (const lang of ['zh', 'en']) {
    const t = DICT[lang];
    assert.match(t.sealed.lead(10, 31), /31/, `${lang} lead 要写出截止那天`);
    assert.match(t.sealed.cooldown(30), /30/, `${lang} cooldown 要写出秒数`);
    assert.match(t.deck.passwordAria('05', t.zone.title.sealed), /05/);
  }
  assert.equal(DICT.zh.sealed.wrong, '密码不对');
  assert.equal(DICT.zh.sealed.subEnded, '本期开放已结束');
  assert.match(DICT.zh.sealed.subNotYet, /即将开放/);
  assert.match(DICT.en.sealed.lead(10, 31), /31 October/);
});

test('the app gates the sealed pool on the window and the stamp, at render time and again at start', () => {
  const exam = code(read('src/components/exam/ExamApp.tsx'));

  // 进得去 = 本期印记 + 窗口内；题库范围只有这时才落到密卷
  assert.match(exam, /const sealedUnlocked = sealedNow !== null && sealedAccess\(sealedStampSaved, sealedNow\);/);
  assert.match(exam, /frontZone === 'sealed' && sealedUnlocked \? 'sealed'/);
  assert.match(exam, /const scopedIndex = indexForLibraryMode\(index \|\| \[\], libraryMode\);/);
  // 窗口外：展不开（提示行说原因），快速开始置灰
  assert.match(exam, /if \(id === 'sealed' && sealedPhaseNow === 'before'\) return t\.sealed\.blockNotYet;/);
  assert.match(exam, /if \(id === 'sealed' && sealedPhaseNow === 'ended'\) return t\.sealed\.blockEnded;/);
  const deck = jsxOpening(exam, '<CardDeck');
  assert.match(attrValue(deck.attrs.get('closed')) ?? '', /sealedClosedReason \? \{ sealed: sealedClosedReason \}/);
  assert.match(attrValue(deck.attrs.get('quickStart')) ?? '', /\(frontZone === 'sealed' && !!sealedClosedReason\)/);

  // 锁着时展开的是密码面板，输对了落盘本期印记
  assert.match(exam, /frontZone === 'sealed' && !sealedUnlocked \? \(<SealedGate/);
  const unlock = fnBody(namedFn(exam, 'unlockSealed'));
  assert.match(unlock, /saveSealedUnlock\(stamp\)/);
  assert.match(unlock, /const stamp = sealedStamp\(\);/);

  // 第二道闸：开考那一刻按此刻的时钟与存着的印记再核一遍（指定 qid 的复烤区路径不走密卷池，不拦）
  const start = fnBody(namedFn(exam, 'startExam'));
  const gate = start.indexOf("if (!override?.qids && libraryMode === 'sealed') {");
  assert.ok(gate >= 0 && gate < start.indexOf("setPhase('loading')"), '开考之前要先过密卷的闸');
  assert.match(start, /if \(!sealedAccess\(stored, now\)\) \{/);
  assert.match(start, /const stored = loadSealedStamp\(\);/);

  // 解锁记录与做题记录分开：清空做题记录碰不到它
  assert.doesNotMatch(read('src/lib/records.ts'), /SEALED_UNLOCK_KEY|sealed-unlock/);
  assert.doesNotMatch(fnBody(namedFn(exam, 'removeRecords')), /Sealed/);
});
