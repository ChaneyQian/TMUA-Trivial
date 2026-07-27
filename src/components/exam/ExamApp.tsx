'use client';

// design.md §2.6 Test 模式:CBT 模拟(照 TMUA 官方机考模板)
// 练习=点选项后 Enter 批改;Mock=倒计时交卷统一批改

import { useCallback, useEffect, useRef, useState } from 'react';
import MathText from '@/components/MathText';
import { buildExam, fetchIndex, ExamQuestion, IndexEntry } from '@/lib/exam';
import styles from './Exam.module.css';

type Phase = 'setup' | 'loading' | 'exam' | 'result';
type Mode = 'practice' | 'mock';
type Db = 'TMUA' | 'MAT' | 'SMC' | 'ALL';

const DB_TITLES: Record<Db, string> = {
  TMUA: 'Test of Mathematics for University Admission',
  MAT: 'Mathematics Admissions Test',
  SMC: 'Senior Mathematical Challenge',
  ALL: 'MCQ Test — Mixed Paper',
};

const DB_NAMES: Record<Db, string> = { TMUA: 'TMUA', MAT: 'MAT', SMC: 'SMC', ALL: '混合' };

function sameLabel(a: string | null, b: string): boolean {
  return !!a && a.toLowerCase() === b.toLowerCase();
}

function fmtClock(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** 默认限时 ≈ 题数 × 3.75 分钟(TMUA 20 题 75 分钟节奏) */
function defaultMinutes(count: number): number {
  return Math.max(1, Math.ceil(count * 3.75));
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

  const poolCounts: Record<string, number> = { TMUA: 0, MAT: 0, SMC: 0 };
  for (const e of index || []) {
    if (poolCounts[e.db] !== undefined) poolCounts[e.db]++;
  }

  // ---- 设置 ----
  const [phase, setPhase] = useState<Phase>('setup');
  const [db, setDb] = useState<Db>('TMUA');
  const [mode, setMode] = useState<Mode>('practice');
  const [count, setCount] = useState(10);
  const [minutes, setMinutes] = useState(defaultMinutes(10));
  const [minutesTouched, setMinutesTouched] = useState(false);
  const [error, setError] = useState('');

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
  // 主题只在 exam 阶段渲染(无 SSR 标记),惰性初始化读 dataset 不会造成水合不匹配
  const [scheme, setScheme] = useState(() =>
    typeof document === 'undefined' ? 'light' : document.documentElement.dataset.theme || 'light'
  );

  const setCountAnd = (n: number) => {
    setCount(n);
    if (!minutesTouched) setMinutes(defaultMinutes(n));
  };

  const totalPool = db === 'ALL' ? Object.values(poolCounts).reduce((a, b) => a + b, 0) : poolCounts[db] || 0;

  // ---- 开始考试 ----
  const start = async () => {
    if (!index) return;
    setError('');
    setPhase('loading');
    // 全屏须在用户手势同步调用链里发起(失败静默降级)
    document.documentElement.requestFullscreen?.().catch(() => {});
    try {
      const qs = await buildExam(index, db, count);
      setQuestions(qs);
      setIdx(0);
      setAnswers(new Array(qs.length).fill(null));
      setGraded(new Array(qs.length).fill(false));
      setFlagged(new Array(qs.length).fill(false));
      setSolShown(new Set());
      setSecondsLeft(minutes * 60);
      setElapsed(0);
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
  };

  const gradeCurrent = () => {
    if (!answers[idx]) return;
    setGraded((g) => g.map((v, i) => (i === idx ? true : v)));
  };

  const goto = (i: number) => {
    if (i < 0 || i >= questions.length) return;
    setIdx(i);
    setNavOpen(false);
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
      else n.add(idx);
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
          <div className={styles.setupTitle}>MCQ Test</div>
          <div className={styles.setupSub}>TMUA / MAT / SMC 随机抽题 · CBT 机考界面 · 开始后自动全屏</div>

          <div className={styles.fieldLabel}>题库</div>
          <div className={styles.segRow}>
            {(['TMUA', 'MAT', 'SMC', 'ALL'] as Db[]).map((d) => (
              <button
                key={d}
                className={`${styles.segBtn} ${db === d ? styles.segActive : ''}`}
                onClick={() => setDb(d)}
              >
                {DB_NAMES[d]}
                <span className={styles.segHint}>
                  {d === 'ALL'
                    ? `${Object.values(poolCounts).reduce((a, b) => a + b, 0)} 题`
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
              <button className={styles.btnPrimary} onClick={() => setPhase('setup')}>
                再来一组
              </button>
            </div>
          </div>

          {questions.map((qq, i) => {
            const ok = sameLabel(answers[i], qq.answer);
            return (
              <div key={qq.qid} className={styles.reviewCard}>
                <div className={styles.reviewHead}>
                  <span className={ok ? styles.verdictOk : styles.verdictBad}>
                    {ok ? '✓' : '✗'} 第 {i + 1} 题
                  </span>
                  <span>
                    {qq.paper.includes(String(qq.year)) ? qq.paper : `${qq.paper} ${qq.year}`} ·{' '}
                    {qq.number}
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
            {q.paper.includes(String(q.year)) ? q.paper : `${q.paper} ${q.year}`} · {q.number}
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
