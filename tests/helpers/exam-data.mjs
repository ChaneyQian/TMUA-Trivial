// 测试读「构建产物」的唯一入口。
//
// public\exam\ 是 .gitignore 掉的（由 build-data 从 data\ 现产），所以几处
// 拿真实产物做反向审计的测试原先隐含一条顺序依赖：必须先 npm run build 才能
// npm test。干净 checkout 上直接跑测试会红一片，CI 里也只好把 test 钉在 build 后面。
//
// 这里把依赖解掉：有现成的产物就读它（本地开发与 CI 的常态，零额外开销），
// 没有就现建一份到本进程专属的临时目录。node --test 按文件开进程，所以
// 「每进程至多建一次」就是这个模块级缓存的全部含义。
//
// EXAM_OUT 仍是最高优先级：外部若指定了产物目录，一切以它为准。

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

let resolved = null;

/** 构建产物所在目录的绝对路径（必要时现建一份） */
export function examDataDir() {
  if (resolved) return resolved;
  if (process.env.EXAM_OUT) {
    resolved = path.resolve(process.env.EXAM_OUT);
    return resolved;
  }
  const shipped = path.join(root, 'public', 'exam');
  if (fs.existsSync(path.join(shipped, 'index.json'))) {
    resolved = shipped;
    return resolved;
  }
  // 现建：绝不写回 public\exam——别的测试文件可能正并发读它
  const fresh = fs.mkdtempSync(path.join(os.tmpdir(), 'mcq-exam-data-'));
  execFileSync(process.execPath, [path.join(root, 'scripts', 'build-data.mjs')], {
    cwd: root,
    stdio: 'pipe',
    env: { ...process.env, EXAM_OUT: fresh },
  });
  resolved = fresh;
  return resolved;
}

/**
 * 读产物里的一个 JSON。
 *
 * 重试是为了防「开发者正在另一个终端里 npm run data」这种外部并发——撞上
 * 那一瞬间会读到半个文件。测试自己的 build-data 调用一律走 EXAM_OUT 临时目录，
 * 不会重写这份产物。
 */
export function readExamJson(relative, ok = () => true, attempts = 5) {
  const file = path.join(examDataDir(), ...relative.split('/'));
  for (let i = 0; i < attempts; i++) {
    try {
      const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (ok(parsed)) return parsed;
    } catch {}
    const until = Date.now() + 120;
    while (Date.now() < until) {
      /* wait */
    }
  }
  throw new Error(`could not read a complete ${file}`);
}

/** index.json，非空数组 */
export function readExamIndex() {
  return readExamJson('index.json', (d) => Array.isArray(d) && d.length > 0);
}

/** 单题全文 q\<qid>.json */
export function readExamQuestion(qid) {
  return readExamJson(`q/${qid}.json`);
}
