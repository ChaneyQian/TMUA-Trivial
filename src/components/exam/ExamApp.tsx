'use client';

// design.md §2.6 Test 模式:CBT 模拟(照 TMUA 官方机考模板)
// 练习=点选项后 Enter 批改;Mock=倒计时交卷统一批改

import { useCallback, useEffect, useRef, useState } from 'react';
import IdBadge from '@/components/badge/IdBadge';
import MathText from '@/components/MathText';
import { buildExam, fetchIndex, ExamQuestion, IndexEntry } from '@/lib/exam';
import {
  addSession,
  availableCountForMode,
  clearRecords,
  createEmptyRecords,
  exportRecordsWorkbook,
  hiddenUnlockProgress,
  importRecordsWorkbook,
  indexForLibraryMode,
  isHiddenModeUnlocked,
  loadRecords,
  overview,
  pickQidsForMode,
  saveRecords,
  validCompletedCount,
  HIDDEN_UNLOCK_COUNT,
  type LibraryMode,
  type PickMode,
  type Records,
} from '@/lib/records';
import styles from './Exam.module.css';

type Phase = 'setup' | 'loading' | 'exam' | 'result';
type Mode = 'practice' | 'mock';
type Db = 'TMUA' | 'TMUA_MOCK' | 'MAT' | 'SMC' | 'ECAA' | 'AMC' | 'ALL';

const UNLOCK_SEEN_KEY = 'mcq-test:hidden-unlock-seen:v1';

const DB_TITLES: Record<Db, string> = {
  TMUA: 'Test of Mathematics for University Admission',
  TMUA_MOCK: 'TMUA Mock Papers',
  MAT: 'Mathematics Admissions Test',
  SMC: 'Senior Mathematical Challenge',
  ECAA: 'Engineering and Computer Science Admissions Assessment',
  AMC: 'American Mathematics Competitions',
  ALL: 'MCQ Test — Mixed Paper',
};

const DB_NAMES: Record<Db, string> = {
  TMUA: 'TMUA',
  TMUA_MOCK: 'TMUA Mock',
  MAT: 'MAT',
  SMC: 'SMC',
  ECAA: 'ECAA',
  AMC: 'AMC',
  ALL: '混合',
};

function sameLabel(a: string | null, b: string): boolean {
  return !!a && a.toLowerCase() === b.toLowerCase();
}

function fmtClock(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function sourceLabel(paper: string, year: number): string {
  if (!year || paper.includes(String(year))) return paper;
  return `${paper} ${year}`;
}

/** 默认限时 ≈ 题数 × 3.75 分钟(TMUA 20 题 75 分钟节奏) */
function defaultMinutes(count: number): number {
  return Math.max(1, Math.ceil(count * 3.75));
}

type PetCommandState = 'idle' | 'waving' | 'failed' | 'waiting' | 'running' | 'review';

function commandPet(detail: {
  state: PetCommandState;
  after?: PetCommandState;
  moveTo?: 'grade' | 'home';
}) {
  window.dispatchEvent(new CustomEvent('mcq-test:pet-command', { detail }));
}

/** 解锁过渡层：盖在设置页之上（背景是虚化的页面本身，不是另开一屏），放完自行淡出 */
function UnlockOverlay({ onDismiss }: { onDismiss: () => void }) {
  const [closing, setClosing] = useState(false);

  const close = useCallback(() => {
    setClosing(true);
    window.setTimeout(onDismiss, 420); // 等淡出动画走完再卸载
  }, [onDismiss]);

  useEffect(() => {
    const t = window.setTimeout(close, 4000);
    return () => window.clearTimeout(t);
  }, [close]);

  return (
    <div
      className={`${styles.unlockOverlay} ${closing ? styles.unlockClosing : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="9.0 Trivial 已解锁"
      onClick={close}
    >
      <div className={styles.unlockPanel}>
        <span className={styles.unlockRule} aria-hidden="true" />
        <div className={styles.unlockNumber} aria-hidden="true">
          9.0
        </div>
        <div className={styles.unlockName}>Trivial</div>
        <p className={styles.unlockLine}>你已窥见更多的可能性</p>
        <span className={styles.unlockRule} aria-hidden="true" />
      </div>
      <span className={styles.unlockTapHint}>点击任意处继续</span>
    </div>
  );
}

export default function ExamApp() {
  // ---- 题库索引（构建期生成，只含能自动判分的题）----
  const [index, setIndex] = useState<IndexEntry[] | null>(null);
  const [indexError, setIndexError] = useState('');

  useEffect(() => {
    fetchIndex()
      .then(setIndex)
      .catch((e) => setIndexError(e instanceof Error ? e.message : '题库索引加载失败'));
  }, []);

  const [records, setRecords] = useState<Records>(() => createEmptyRecords());
  const [recordMessage, setRecordMessage] = useState('');
  const [recordBusy, setRecordBusy] = useState(false);
  const [libraryMode, setLibraryMode] = useState<LibraryMode>('classic');
  const [showUnlock, setShowUnlock] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  const completedCount = index ? validCompletedCount(index, records) : 0;
  const unlockProgress = index ? hiddenUnlockProgress(index, records) : 0;
  const hiddenUnlocked = index ? isHiddenModeUnlocked(index, records) : false;
  const activeIndex = indexForLibraryMode(index || [], hiddenUnlocked ? libraryMode : 'classic');

  useEffect(() => {
    if (!hiddenUnlocked) {
      setLibraryMode('classic');
      return;
    }

    // 进度满了就直接切到 9.0 Trivial：解锁本身就是结果，不该再要用户手点一下。
    // 这个 effect 只在 hiddenUnlocked 翻转时跑，所以之后用户自己切回经典不会被覆盖。
    setLibraryMode('hidden');

    try {
      if (localStorage.getItem(UNLOCK_SEEN_KEY)) return;
      localStorage.setItem(UNLOCK_SEEN_KEY, '1');
    } catch {}

    setShowUnlock(true); // 自动收起由 UnlockOverlay 自己管，好带上淡出动画
  }, [hiddenUnlocked]);

  const poolCounts: Record<string, number> = { TMUA: 0, TMUA_MOCK: 0, MAT: 0, SMC: 0, ECAA: 0, AMC: 0 };
  for (const e of activeIndex) {
    if (poolCounts[e.db] !== undefined) poolCounts[e.db]++;
  }

  // ---- 设置 ----
  const [phase, setPhase] = useState<Phase>('setup');
  const [db, setDb] = useState<Db>('TMUA');
  const [mode, setMode] = useState<Mode>('practice');
  const [pickMode, setPickMode] = useState<PickMode>('random');
  const [count, setCount] = useState(10);
  const [minutes, setMinutes] = useState(defaultMinutes(10));
  const [minutesTouched, setMinutesTouched] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (libraryMode === 'classic' && (db === 'TMUA_MOCK' || db === 'AMC')) setDb('TMUA');
  }, [db, libraryMode]);

  // ---- 考试 ----
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [graded, setGraded] = useState<boolean[]>([]);
  const [flagged, setFlagged] = useState<boolean[]>([]);
  const [solShown, setSolShown] = useState<Set<number>>(new Set());
  const [navOpen, setNavOpen] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [resultActionError, setResultActionError] = useState('');
  const savedResultRef = useRef<Records | null>(null);
  // 主题只在 exam 阶段渲染(无 SSR 标记),惰性初始化读 dataset 不会造成水合不匹配
  const [scheme, setScheme] = useState(() =>
    typeof document === 'undefined' ? 'light' : document.documentElement.dataset.theme || 'light'
  );

  useEffect(() => {
    if (phase === 'exam') commandPet({ state: 'waiting', moveTo: 'grade' });
    else if (phase === 'result') commandPet({ state: 'review', moveTo: 'home' });
    else if (phase === 'setup') commandPet({ state: 'idle', moveTo: 'home' });
  }, [phase]);

  const setCountAnd = (n: number) => {
    setCount(n);
    if (!minutesTouched) setMinutes(defaultMinutes(n));
  };

  const totalPool = index ? availableCountForMode(activeIndex, db, pickMode, records) : 0;
  const recordOverview = overview(records);

  const downloadWorkbook = async (data: Records) => {
    const blob = await exportRecordsWorkbook(data);
    const date = new Date().toISOString().slice(0, 10);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MCQ-Test-records-${date}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const exportCurrentRecords = async () => {
    setRecordBusy(true);
    setRecordMessage('');
    try {
      await downloadWorkbook(records);
      setRecordMessage(`已导出 ${recordOverview.seen} 道题的记录`);
    } catch (e) {
      setRecordMessage(e instanceof Error ? e.message : '导出失败');
    } finally {
      setRecordBusy(false);
    }
  };

  const importWorkbook = async (file: File) => {
    if (recordOverview.seen > 0 && !window.confirm('导入会替换当前做题记录，是否继续？')) return;
    setRecordBusy(true);
    setRecordMessage('');
    try {
      if (!index) throw new Error('题库索引尚未加载完成');
      const imported = await importRecordsWorkbook(file, new Set(index.map((entry) => entry.qid)));
      saveRecords(imported);
      setRecords(imported);
      setRecordMessage(`已导入 ${overview(imported).seen} 道题的记录`);
    } catch (e) {
      setRecordMessage(e instanceof Error ? e.message : '导入失败');
    } finally {
      setRecordBusy(false);
      if (importInputRef.current) importInputRef.current.value = '';
    }
  };

  const removeRecords = () => {
    if (recordOverview.seen > 0 && !window.confirm('确定清空全部做题和错题记录？')) return;
    setRecords(clearRecords());
    setRecordMessage('记录已清空');
  };

  // ---- 开始考试 ----
  const start = async () => {
    if (!index) return;
    setError('');
    setPhase('loading');
    // 全屏须在用户手势同步调用链里发起(失败静默降级)
    document.documentElement.requestFullscreen?.().catch(() => {});
    try {
      const qids = pickQidsForMode(activeIndex, db, count, pickMode, records);
      if (qids.length === 0) throw new Error('当前抽题范围内没有可用题目');
      const selected = new Set(qids);
      const qs = await buildExam(activeIndex.filter((entry) => selected.has(entry.qid)), 'ALL', qids.length);
      setQuestions(qs);
      setIdx(0);
      setAnswers(new Array(qs.length).fill(null));
      setGraded(new Array(qs.length).fill(false));
      setFlagged(new Array(qs.length).fill(false));
      setSolShown(new Set());
      setSecondsLeft(minutes * 60);
      setElapsed(0);
      setResultActionError('');
      savedResultRef.current = null;
      setPhase('exam');
    } catch (e) {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      setError(e instanceof Error ? e.message : '抽题失败');
      setPhase('setup');
    }
  };

  const finish = useCallback(() => {
    setNavOpen(false);
    setConfirmEnd(false);
    setPhase('result');
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }, []);

  const saveCurrentResult = (): Records => {
    if (savedResultRef.current) return savedResultRef.current;
    const right = questions.filter((question, i) => sameLabel(answers[i], question.answer)).length;
    const answered = answers.filter(Boolean).length;
    const next = addSession(
      records,
      questions.map((question, i) => ({
        qid: question.qid,
        selected: answers[i],
        answer: question.answer,
        correct: sameLabel(answers[i], question.answer),
        answered: answers[i] !== null,
      })),
      { db, mode, n: questions.length, right, answered, sec: elapsed },
    );
    saveRecords(next);
    setRecords(next);
    savedResultRef.current = next;
    return next;
  };

  const leaveResult = (message: string) => {
    setRecordMessage(message);
    setQuestions([]);
    setPhase('setup');
  };

  const saveAndRetry = () => {
    saveCurrentResult();
    leaveResult('本场已计入统计');
  };

  const saveExportAndExit = async () => {
    setRecordBusy(true);
    setResultActionError('');
    try {
      await downloadWorkbook(saveCurrentResult());
      leaveResult('本场已计入统计并导出');
    } catch (e) {
      setResultActionError(e instanceof Error ? e.message : '导出失败');
    } finally {
      setRecordBusy(false);
    }
  };

  // ---- 计时 ----
  useEffect(() => {
    if (phase !== 'exam') return;
    const t = setInterval(() => {
      setElapsed((e) => e + 1);
      if (mode === 'mock') {
        setSecondsLeft((s) => {
          if (s <= 1) {
            finish();
            return 0;
          }
          return s - 1;
        });
      }
    }, 1000);
    return () => clearInterval(t);
  }, [phase, mode, finish]);

  // ---- 组件卸载兜底退全屏 ----
  useEffect(() => {
    return () => {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, []);

  const q = questions[idx];

  const selectChoice = (label: string) => {
    if (mode === 'practice' && graded[idx]) return;
    setAnswers((a) => a.map((v, i) => (i === idx ? label : v)));
    commandPet({ state: 'running' });
  };

  const gradeCurrent = () => {
    if (!answers[idx]) return;
    setGraded((g) => g.map((v, i) => (i === idx ? true : v)));
    if (sameLabel(answers[idx], q.answer)) commandPet({ state: 'waving', after: 'review' });
    else commandPet({ state: 'failed', after: 'review' });
  };

  const goto = (i: number) => {
    if (i < 0 || i >= questions.length) return;
    setIdx(i);
    setNavOpen(false);
    commandPet({ state: 'waiting', moveTo: 'grade' });
  };

  /**
   * Enter 的全部行为。键盘和屏幕上的主操作按钮共用这一条路径，
   * 免得两边逻辑各写一份、日后改一处漏一处。
   * 触屏设备没有物理 Enter，按钮是唯一入口。
   */
  const pressEnter = () => {
    if (mode === 'practice') {
      if (!graded[idx]) gradeCurrent();
      else if (idx < questions.length - 1) goto(idx + 1);
      else setConfirmEnd(true);
    } else if (idx < questions.length - 1) {
      goto(idx + 1);
    } else {
      setConfirmEnd(true);
    }
  };

  /** 主操作按钮的文案；null=当前不可操作（练习模式还没选答案） */
  const enterLabel = (): string | null => {
    if (mode === 'practice' && !graded[idx]) return answers[idx] ? '批改' : null;
    return idx < questions.length - 1 ? '下一题' : '交卷';
  };

  const toggleFlag = () => setFlagged((f) => f.map((v, i) => (i === idx ? !v : v)));

  const toggleSol = () =>
    setSolShown((s) => {
      const n = new Set(s);
      if (n.has(idx)) n.delete(idx);
      else {
        n.add(idx);
        commandPet({ state: 'review' });
      }
      return n;
    });

  const changeScheme = (v: string) => {
    setScheme(v);
    document.documentElement.dataset.theme = v;
    try {
      localStorage.setItem('theme', v);
    } catch {}
  };

  // ---- 键盘流(A–H/1–9 选项、Enter 批改/下一题、←→ 切题、F 旗标)----
  const keyRef = useRef<(e: KeyboardEvent) => void>(() => {});
  const onKey = (e: KeyboardEvent) => {
    if (phase !== 'exam' || !q) return;
    const t = e.target as HTMLElement | null;
    if (t && ['INPUT', 'SELECT', 'TEXTAREA'].includes(t.tagName)) return;
    if (navOpen || confirmEnd) {
      if (e.key === 'Escape') {
        setNavOpen(false);
        setConfirmEnd(false);
      }
      return;
    }
    const k = e.key;
    if (k === 'Enter') {
      e.preventDefault();
      pressEnter();
      return;
    }
    if (k === 'ArrowRight') return goto(idx + 1);
    if (k === 'ArrowLeft') return goto(idx - 1);
    if (k === 'ArrowDown' || k === 'ArrowUp') {
      e.preventDefault(); // 防止页面滚动
      if (mode === 'practice' && graded[idx]) return;
      const cur = q.choices.findIndex((c) => sameLabel(answers[idx], c.label));
      const dir = k === 'ArrowDown' ? 1 : -1;
      const next =
        cur === -1
          ? dir === 1
            ? 0
            : q.choices.length - 1
          : Math.max(0, Math.min(q.choices.length - 1, cur + dir));
      selectChoice(q.choices[next].label);
      return;
    }
    if (k === 'f' || k === 'F') return toggleFlag();
    if (/^[1-9]$/.test(k)) {
      const c = q.choices[Number(k) - 1];
      if (c) selectChoice(c.label);
      return;
    }
    if (/^[a-zA-Z]$/.test(k)) {
      const c = q.choices.find((c) => c.label.toLowerCase() === k.toLowerCase());
      if (c) selectChoice(c.label);
    }
  };

  useEffect(() => {
    keyRef.current = onKey; // 每次渲染同步最新闭包
  });

  useEffect(() => {
    const h = (e: KeyboardEvent) => keyRef.current(e);
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // ================= 设置页 =================
  if (phase === 'setup' || phase === 'loading') {
    return (
      <div className={styles.wrap}>
        <div className={styles.setupCard}>
          <IdBadge />
          <div className={styles.setupTitle}>MCQ Test</div>
          <div className={styles.setupSub}>TMUA / MAT / SMC / ECAA 随机抽题 · 9.0 Trivial 解锁扩展题库 · CBT 机考界面</div>

          <div className={styles.libraryHead}>
            <div className={styles.fieldLabel}>题库范围</div>
            <div className={styles.libraryCurrent}>
              当前：{libraryMode === 'hidden' && hiddenUnlocked ? '9.0 Trivial' : '经典'}
            </div>
          </div>
          <div className={styles.libraryChargeRow}>
            <button
              type="button"
              className={`${styles.libraryCharge} ${hiddenUnlocked ? styles.libraryChargeReady : ''} ${libraryMode === 'hidden' ? styles.libraryChargeActive : ''}`}
              onClick={() => hiddenUnlocked && setLibraryMode(libraryMode === 'hidden' ? 'classic' : 'hidden')}
              disabled={!hiddenUnlocked}
              aria-pressed={hiddenUnlocked ? libraryMode === 'hidden' : undefined}
              aria-label={hiddenUnlocked ? '切换 9.0 Trivial 扩展题库' : '经典题库，解锁充电中'}
            >
              <span className={styles.libraryChargeLabel}>
                <span className={styles.chargeLight} aria-hidden="true" />
                {hiddenUnlocked ? '9.0 Trivial' : '经典'}
              </span>
              <span
                className={styles.libraryChargeTrack}
                role="progressbar"
                aria-label="9.0 Trivial 解锁进度"
                aria-valuemin={0}
                aria-valuemax={HIDDEN_UNLOCK_COUNT}
                aria-valuenow={Math.min(completedCount, HIDDEN_UNLOCK_COUNT)}
              >
                <span
                  className={styles.libraryChargeFill}
                  style={{ width: `${unlockProgress * 100}%` }}
                />
              </span>
            </button>
          </div>

          <div className={styles.fieldLabel}>题库</div>
          <div className={styles.segRow}>
            {(hiddenUnlocked && libraryMode === 'hidden'
              ? (['TMUA', 'TMUA_MOCK', 'MAT', 'SMC', 'ECAA', 'AMC', 'ALL'] as Db[])
              : (['TMUA', 'MAT', 'SMC', 'ECAA', 'ALL'] as Db[])
            ).map((d) => (
              <button
                key={d}
                className={`${styles.segBtn} ${db === d ? styles.segActive : ''}`}
                onClick={() => setDb(d)}
                disabled={d !== 'ALL' && poolCounts[d] === 0}
              >
                {DB_NAMES[d]}
                <span className={styles.segHint}>
                  {d === 'ALL'
                    ? `${Object.values(poolCounts).reduce((a, b) => a + b, 0)} 题`
                    : d === 'AMC' && poolCounts[d] === 0
                      ? '待补答案'
                      : `${poolCounts[d] || 0} 题`}
                </span>
              </button>
            ))}
          </div>

          <div className={styles.fieldLabel}>模式</div>
          <div className={styles.segRow}>
            <button
              className={`${styles.segBtn} ${mode === 'practice' ? styles.segActive : ''}`}
              onClick={() => setMode('practice')}
            >
              练习(默认)
              <span className={styles.segHint}>选完 Enter 即时批改</span>
            </button>
            <button
              className={`${styles.segBtn} ${mode === 'mock' ? styles.segActive : ''}`}
              onClick={() => setMode('mock')}
            >
              Mock(限时)
              <span className={styles.segHint}>倒计时,交卷统一批改</span>
            </button>
          </div>

          <div className={styles.fieldLabel}>抽题范围</div>
          <div className={styles.segRow}>
            <button
              className={`${styles.segBtn} ${pickMode === 'random' ? styles.segActive : ''}`}
              onClick={() => setPickMode('random')}
            >
              纯随机
              <span className={styles.segHint}>全部题目</span>
            </button>
            <button
              className={`${styles.segBtn} ${pickMode === 'wrong-and-new' ? styles.segActive : ''}`}
              onClick={() => setPickMode('wrong-and-new')}
            >
              新题 + 错题
              <span className={styles.segHint}>排除最近做对</span>
            </button>
            <button
              className={`${styles.segBtn} ${pickMode === 'new-only' ? styles.segActive : ''}`}
              onClick={() => setPickMode('new-only')}
            >
              仅新题
              <span className={styles.segHint}>排除全部已做</span>
            </button>
          </div>

          <div className={styles.fieldLabel}>题目数量(题库可用 {totalPool} 题)</div>
          <div className={styles.segRow}>
            {[5, 10, 20].map((n) => (
              <button
                key={n}
                className={`${styles.segBtn} ${count === n ? styles.segActive : ''}`}
                onClick={() => setCountAnd(n)}
              >
                {n}
              </button>
            ))}
            <input
              className={styles.numInput}
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCountAnd(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
            />
          </div>

          {mode === 'mock' && (
            <>
              <div className={styles.fieldLabel}>限时(分钟)</div>
              <div className={styles.segRow}>
                <input
                  className={styles.numInput}
                  type="number"
                  min={1}
                  max={300}
                  value={minutes}
                  onChange={(e) => {
                    setMinutesTouched(true);
                    setMinutes(Math.max(1, Math.min(300, Number(e.target.value) || 1)));
                  }}
                />
              </div>
            </>
          )}

          <div className={styles.recordSection}>
            <div className={styles.fieldLabel}>做题记录（可选）</div>
            <div className={styles.recordSummary}>
              <span>
                <strong>{recordOverview.seen}</strong> 已做
              </span>
              <span>
                <strong>{recordOverview.wrongNow}</strong> 当前错题
              </span>
              <span>
                <strong>{recordOverview.attempts}</strong> 次作答
              </span>
            </div>
            <div className={styles.recordActions}>
              <button
                className={styles.btnGhost}
                onClick={() => importInputRef.current?.click()}
                disabled={recordBusy || !index}
              >
                导入 XLSX
              </button>
              <button
                className={styles.btnGhost}
                onClick={exportCurrentRecords}
                disabled={recordBusy || recordOverview.seen === 0}
              >
                导出 XLSX
              </button>
              <button
                className={styles.btnGhost}
                onClick={removeRecords}
                disabled={recordBusy || recordOverview.seen === 0}
              >
                清空
              </button>
              <input
                ref={importInputRef}
                className={styles.fileInput}
                type="file"
                accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void importWorkbook(file);
                }}
              />
            </div>
            {recordMessage && <div className={styles.recordMessage}>{recordMessage}</div>}
          </div>

          <button
            className={styles.startBtn}
            onClick={start}
            disabled={phase === 'loading' || !index || totalPool === 0}
          >
            {phase === 'loading' ? '抽题中…' : !index && !indexError ? '题库加载中…' : '开始 Test'}
          </button>
          {error && <div className={styles.errMsg}>{error}</div>}
          {indexError && <div className={styles.errMsg}>{indexError}</div>}
          {index && totalPool === 0 && (
            <div className={styles.errMsg}>该题库没有可用题目。</div>
          )}
          <div className={styles.backLink}>
            键盘：A–H / 1–9 选项 · Enter 批改或下一题 · ←→ 切题 · F 旗标
          </div>
        </div>
        {showUnlock && <UnlockOverlay onDismiss={() => setShowUnlock(false)} />}
      </div>
    );
  }

  // ================= 成绩页 =================
  if (phase === 'result') {
    const right = questions.filter((qq, i) => sameLabel(answers[i], qq.answer)).length;
    const answered = answers.filter(Boolean).length;
    return (
      <div className={styles.wrap}>
        <div className={styles.resultWrap}>
          <div className={styles.scoreCard}>
            <div className={styles.scoreBig}>
              {right} / {questions.length}
            </div>
            <div className={styles.scoreMeta}>
              {DB_NAMES[db]} · {mode === 'mock' ? 'Mock 限时' : '练习'}模式
              <br />
              已作答 {answered} 题 · 用时 {fmtClock(elapsed)}
            </div>
            <div className={styles.scoreBtns}>
              <button
                className={styles.btnGhost}
                onClick={() => leaveResult('本场未计入统计')}
                disabled={recordBusy}
              >
                跳过本场统计
              </button>
              <button className={styles.btnGhost} onClick={saveExportAndExit} disabled={recordBusy}>
                {recordBusy ? '正在导出…' : '统计并导出后退出'}
              </button>
              <button className={styles.btnPrimary} onClick={saveAndRetry} disabled={recordBusy}>
                统计后再来一次
              </button>
            </div>
          </div>
          {resultActionError && <div className={styles.errMsg}>{resultActionError}</div>}

          {questions.map((qq, i) => {
            const ok = sameLabel(answers[i], qq.answer);
            return (
              <div key={qq.qid} className={styles.reviewCard}>
                <div className={styles.reviewHead}>
                  <span className={ok ? styles.verdictOk : styles.verdictBad}>
                    {ok ? '✓' : '✗'} 第 {i + 1} 题
                  </span>
                  <span>
                    {sourceLabel(qq.paper, qq.year)} · {qq.number}
                  </span>
                  <span>
                    你的答案:{answers[i]?.toUpperCase() || '—'} · 正确答案:{qq.answer.toUpperCase()}
                  </span>
                </div>
                <div className={styles.stem}>
                  <MathText text={qq.statement} />
                </div>
                <div className={styles.choiceList}>
                  {qq.choices.map((c) => {
                    const cls = [styles.choiceRow];
                    if (sameLabel(c.label, qq.answer)) cls.push(styles.optCorrect);
                    else if (sameLabel(answers[i], c.label)) cls.push(styles.optWrong);
                    return (
                      <div key={c.label} className={cls.join(' ')} style={{ cursor: 'default' }}>
                        <span className={styles.radio} />
                        <span className={styles.choiceLabel}>{c.label.toUpperCase()}</span>
                        {c.text && (
                          <span className={styles.choiceText}>
                            <MathText text={c.text} />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {qq.solution && (
                  <details className={styles.reviewSol}>
                    <summary>解析</summary>
                    <div className={styles.solBox}>
                      <MathText text={qq.solution} />
                    </div>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ================= CBT 考试界面 =================
  if (!q) return null;
  const isGraded = mode === 'practice' && graded[idx];
  const isRight = isGraded && sameLabel(answers[idx], q.answer);

  return (
    <div className={styles.exam}>
      <div className={styles.cbtHeader}>
        <div className={styles.cbtTitle}>{DB_TITLES[db]}</div>
        <div className={styles.cbtHeaderRight}>
          {mode === 'mock' ? (
            <div className={secondsLeft <= 300 ? styles.timeWarn : undefined}>
              🕐 Time Remaining {fmtClock(secondsLeft)}
            </div>
          ) : (
            <div>🕐 Elapsed {fmtClock(elapsed)}</div>
          )}
          <div>
            {idx + 1} of {questions.length}
          </div>
        </div>
      </div>

      <div className={styles.cbtSubbar}>
        <button
          className={`${styles.subbarBtn} ${flagged[idx] ? styles.flagOn : ''}`}
          onClick={toggleFlag}
        >
          🚩 Flag for Review
        </button>
        <label>
          Color Scheme{' '}
          <select
            className={styles.schemeSelect}
            value={scheme}
            onChange={(e) => changeScheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="sepia">Sepia</option>
          </select>
        </label>
      </div>

      <div className={`${styles.cbtBody} ${mode === 'practice' ? styles.bodySplit : ''}`}>
        <div className={styles.colMain}>
        {/* Mock 隐藏题目出处,避免年份/卷别提示 */}
        {mode === 'practice' && (
          <div className={styles.qMeta}>
            {sourceLabel(q.paper, q.year)} · {q.number}
          </div>
        )}
        <div className={styles.stem}>
          <MathText text={q.statement} />
        </div>

        <div className={styles.choiceList}>
          {q.choices.map((c) => {
            const selected = sameLabel(answers[idx], c.label);
            const cls = [styles.choiceRow];
            if (isGraded) {
              if (sameLabel(c.label, q.answer)) cls.push(styles.optCorrect);
              else if (selected) cls.push(styles.optWrong);
            } else if (selected) {
              cls.push(styles.optSelected);
            }
            return (
              <button key={c.label} className={cls.join(' ')} onClick={() => selectChoice(c.label)}>
                <span className={styles.radio} />
                <span className={styles.choiceLabel}>{c.label.toUpperCase()}</span>
                {c.text && (
                  <span className={styles.choiceText}>
                    <MathText text={c.text} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {mode === 'practice' && !isGraded && answers[idx] && (
          <div className={styles.enterHint}>已选 {answers[idx]?.toUpperCase()}</div>
        )}

        {isGraded && (
          <div className={`${styles.feedback} ${isRight ? styles.fbOk : styles.fbBad}`}>
            <span>
              {isRight ? '✓ 回答正确' : `✗ 回答错误,正确答案 ${q.answer.toUpperCase()}`}
            </span>
          </div>
        )}

        {/* 主操作按钮:触屏没有物理 Enter,这里是唯一入口;键盘用户按 Enter 等效 */}
        <button
          className={styles.enterBtn}
          data-pet-target="grade"
          // 点完立刻失焦:否则按钮保持 focus,下一次按 Enter 会同时触发
          // 全局键盘处理和浏览器对焦点按钮的默认激活,一次按键跳两题
          onClick={(e) => {
            e.currentTarget.blur();
            pressEnter();
          }}
          disabled={!enterLabel()}
          aria-keyshortcuts="Enter"
        >
          {enterLabel() ?? '请先选择一个选项'}
          {enterLabel() && <span className={styles.enterBtnKey}>Enter</span>}
        </button>
        </div>

        {/* 练习模式:右半页答案/解析遮罩区,批改后才可点击揭示 */}
        {mode === 'practice' && (
          <div
            className={`${styles.solPanel} ${isGraded && !solShown.has(idx) ? styles.solClickable : ''}`}
            onClick={() => {
              if (isGraded && !solShown.has(idx)) toggleSol();
            }}
          >
            <div className={styles.solPanelTitle}>
              {!isGraded
                ? '🔒 答案与解析 — Enter 批改后可查看'
                : solShown.has(idx)
                  ? '答案与解析'
                  : '👁 已批改 — 点击查看解析'}
              {isGraded && solShown.has(idx) && (
                <button className={styles.solBtn} onClick={toggleSol}>
                  收起
                </button>
              )}
            </div>
            <div className={solShown.has(idx) && isGraded ? undefined : styles.solBlur}>
              <p>
                <strong>答案:{q.answer.toUpperCase()}</strong>
              </p>
              {q.solution && <MathText text={q.solution} />}
            </div>
          </div>
        )}
      </div>

      <div className={styles.cbtFooter}>
        <button className={styles.footBtn} onClick={() => setConfirmEnd(true)}>
          ⏻ End Exam
        </button>
        <div className={styles.footRight}>
          <button className={styles.footBtn} onClick={() => goto(idx - 1)} disabled={idx === 0}>
            ◀ Back
          </button>
          <button className={styles.footBtn} onClick={() => setNavOpen(true)}>
            ❖ Navigator
          </button>
          <button
            className={styles.footBtn}
            onClick={() => goto(idx + 1)}
            disabled={idx === questions.length - 1}
          >
            Next ▶
          </button>
        </div>
      </div>

      {navOpen && (
        <div className={styles.overlay} onClick={() => setNavOpen(false)}>
          <div className={styles.navPanel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.navTitle}>Navigator — 点击题号跳转</div>
            <div className={styles.navGrid}>
              {questions.map((qq, i) => {
                const cls = [styles.navCell];
                if (mode === 'practice' && graded[i]) {
                  cls.push(sameLabel(answers[i], qq.answer) ? styles.navRight : styles.navWrongCell);
                } else if (answers[i]) {
                  cls.push(styles.navAnswered);
                }
                if (i === idx) cls.push(styles.navCurrent);
                return (
                  <button key={qq.qid} className={cls.join(' ')} onClick={() => goto(i)}>
                    {i + 1}
                    {flagged[i] && <span className={styles.navFlag}>🚩</span>}
                  </button>
                );
              })}
            </div>
            <div className={styles.navLegend}>
              <span>空白=未作答</span>
              <span>蓝=已作答</span>
              {mode === 'practice' && <span>绿/红=批改对错</span>}
              <span>🚩=旗标</span>
            </div>
          </div>
        </div>
      )}

      {confirmEnd && (
        <div className={styles.overlay} onClick={() => setConfirmEnd(false)}>
          <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
            <div>
              确认交卷?已作答 {answers.filter(Boolean).length} / {questions.length} 题
              {mode === 'mock' && `,剩余 ${fmtClock(secondsLeft)}`}。
            </div>
            <div className={styles.confirmBtns}>
              <button className={styles.btnGhost} onClick={() => setConfirmEnd(false)}>
                继续作答
              </button>
              <button className={styles.btnPrimary} onClick={finish}>
                交卷
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
