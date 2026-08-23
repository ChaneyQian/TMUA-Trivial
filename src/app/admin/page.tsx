'use client';

// 管理员调试页（/admin）。内部工具，不进双语字典，中文即可。
//
// 这是纯静态站：没有后端，「密码」就写在这份打包进浏览器的代码里，
// 谁看源码都能看到。所以这道门只挡误入，不是安全边界——页面上也这么
// 告诉使用者，不装。真正的秘密（无）与答案（公开 JSON）都不靠它保护。

import { useEffect, useState } from 'react';
import MathText from '@/components/MathText';
import { EXAM_DATA } from '@/lib/config';
import type { IndexEntry } from '@/lib/exam';
import {
  createEmptyRecords,
  grillCount,
  loadRecords,
  overview,
  saveRecords,
  type Records,
} from '@/lib/records';
import styles from './admin.module.css';

const ADMIN_KEY = 'mcq-test:admin:v1';
const ADMIN_PASSWORD = 'admin123';

interface QuestionJson {
  qid: number;
  id: string;
  paper: string;
  database: string;
  statement: string;
  choices: { label: string; text: string }[];
  answer: string;
  solution: string;
}

interface CorruptedRow {
  db: string;
  id: string;
  file: string;
  reason: string;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');

  // 回读放 effect：静态导出首帧按未登录渲染，同步读 sessionStorage 会水合不匹配
  useEffect(() => {
    try {
      if (sessionStorage.getItem(ADMIN_KEY) === '1') setAuthed(true);
    } catch {
      /* 无痕模式下拿不到 sessionStorage，就每次输密码 */
    }
  }, []);

  const login = () => {
    if (pw !== ADMIN_PASSWORD) {
      setPwError('密码不对');
      return;
    }
    try {
      sessionStorage.setItem(ADMIN_KEY, '1');
    } catch {}
    setAuthed(true);
  };

  if (!authed) {
    return (
      <main className={styles.wrap}>
        <h1 className={styles.title}>MCQ Test · 管理调试</h1>
        <p className={styles.note}>
          这是纯静态站，此门槛只防误入，不是安全边界——密码就在前端代码里，
          题目答案本来也是公开 JSON。
        </p>
        <div className={styles.row}>
          <input
            className={styles.input}
            type="password"
            placeholder="密码"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setPwError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && login()}
          />
          <button type="button" className={styles.btn} onClick={login}>
            进入
          </button>
        </div>
        {pwError && <p className={styles.error}>{pwError}</p>}
      </main>
    );
  }

  return <AdminPanel />;
}

function AdminPanel() {
  const [records, setRecords] = useState<Records>(() => createEmptyRecords());
  const [message, setMessage] = useState('');

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  const apply = (next: Records, note: string) => {
    saveRecords(next);
    setRecords(next);
    setMessage(note);
  };

  const stats = overview(records);

  // ---- qid 检查器 ----
  const [qidInput, setQidInput] = useState('');
  const [question, setQuestion] = useState<QuestionJson | null>(null);
  const [qError, setQError] = useState('');

  const inspect = async () => {
    const qid = Number(qidInput.trim());
    setQuestion(null);
    setQError('');
    if (!Number.isSafeInteger(qid) || qid <= 0) {
      setQError('qid 要是个正整数');
      return;
    }
    try {
      const res = await fetch(`${EXAM_DATA}/q/${qid}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setQuestion((await res.json()) as QuestionJson);
    } catch (e) {
      setQError(e instanceof Error ? e.message : '取不到这道题');
    }
  };

  // ---- 构建统计 ----
  const [bankStats, setBankStats] = useState<string[]>([]);
  const [corrupted, setCorrupted] = useState<CorruptedRow[] | null>(null);

  useEffect(() => {
    fetch(`${EXAM_DATA}/index.json`)
      .then((r) => r.json())
      .then((index: IndexEntry[]) => {
        const per = new Map<string, { total: number; hidden: number; diag: number; logic: number }>();
        for (const entry of index) {
          const row = per.get(entry.db) ?? { total: 0, hidden: 0, diag: 0, logic: 0 };
          row.total++;
          if (entry.hidden) row.hidden++;
          if (entry.diag) row.diag++;
          if (entry.logic) row.logic++;
          per.set(entry.db, row);
        }
        const lines = [...per.entries()]
          .sort((a, b) => b[1].total - a[1].total)
          .map(
            ([db, r]) =>
              `${db}: ${r.total} 题${r.hidden ? ` · hidden ${r.hidden}` : ''}${r.diag ? ` · diag ${r.diag}` : ''}${r.logic ? ` · logic ${r.logic}` : ''}`,
          );
        lines.push(`合计 ${index.length} 题`);
        setBankStats(lines);
      })
      .catch(() => setBankStats(['index.json 取不到']));
    fetch(`${EXAM_DATA}/corrupted.json`)
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: CorruptedRow[]) => setCorrupted(rows))
      .catch(() => setCorrupted([]));
  }, []);

  return (
    <main className={styles.wrap}>
      <h1 className={styles.title}>MCQ Test · 管理调试</h1>
      <p className={styles.note}>只动本机 localStorage，不碰任何远端。改完刷新主站页面生效。</p>

      <section className={styles.section}>
        <h2 className={styles.head}>做题记录</h2>
        <p className={styles.mono}>
          已做 {stats.seen} 题 · {stats.attempts} 次作答 · 当前错 {stats.wrongNow} · 场次{' '}
          {records.s.length} · Grill 绑定 {grillCount(records)} · 诊断{' '}
          {records.diag
            ? `${records.diag.passed ? '已通过' : '未通过'} / 用了 ${records.diag.attempts} 次`
            : '未考过'}
        </p>
        <div className={styles.row}>
          <button
            type="button"
            className={styles.btn}
            onClick={() =>
              apply(
                {
                  ...records,
                  diag: { passed: true, attempts: records.diag?.attempts ?? 1, lastTs: Date.now() },
                },
                '已设为诊断通过（9.0 解锁）',
              )
            }
          >
            设为诊断通过
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={() => {
              const next = { ...records };
              delete next.diag;
              delete next.grill;
              apply(next, '已重置诊断与 Grill 绑定');
            }}
          >
            重置诊断/Grill
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.danger}`}
            onClick={() => {
              // 管理员语义的彻底归零：连解锁和绑定一起清。
              // 用户端的「清空」刻意保留这两样，这里正相反——调试要能回到出厂
              apply(createEmptyRecords(), '已彻底清空（含解锁与绑定）');
            }}
          >
            彻底清空记录
          </button>
        </div>
        {message && <p className={styles.ok}>{message}</p>}
      </section>

      <section className={styles.section}>
        <h2 className={styles.head}>qid 检查器</h2>
        <div className={styles.row}>
          <input
            className={styles.input}
            inputMode="numeric"
            placeholder="qid，如 20132101214107"
            value={qidInput}
            onChange={(e) => setQidInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void inspect()}
          />
          <button type="button" className={styles.btn} onClick={() => void inspect()}>
            查看
          </button>
        </div>
        {qError && <p className={styles.error}>{qError}</p>}
        {question && (
          <div className={styles.card}>
            <p className={styles.mono}>
              {question.id} · {question.paper} · {question.database} · 答案 {question.answer} · 选项{' '}
              {question.choices.map((c) => c.label).join('')}
            </p>
            <MathText text={question.statement} />
            <ol className={styles.choices}>
              {question.choices.map((c) => (
                <li key={c.label}>
                  <strong>{c.label}</strong> <MathText text={c.text} />
                </li>
              ))}
            </ol>
            {question.solution && (
              <details>
                <summary>解析</summary>
                <MathText text={question.solution} />
              </details>
            )}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.head}>构建统计</h2>
        {bankStats.map((line) => (
          <p key={line} className={styles.mono}>
            {line}
          </p>
        ))}
        {corrupted && corrupted.length > 0 && (
          <details>
            <summary>损坏拦截 {corrupted.length} 条</summary>
            {corrupted.map((row) => (
              <p key={row.file} className={styles.mono}>
                {row.db} {row.id} — {row.reason}
              </p>
            ))}
          </details>
        )}
        {corrupted && corrupted.length === 0 && <p className={styles.mono}>损坏拦截：0 条</p>}
      </section>
    </main>
  );
}
