'use client';

// Diagnostic Test 的运行时。刻意和 practice/mock 那套分开：
// 单向、无批改、无解析、逐题倒计时 + 时间银行，和普通考试没有一行共享逻辑，
// 免得为了这场特例去改动已经稳定的 exam 运行时。
//
// 两卷制：Paper 1 → 中场休息（不限时）→ Paper 2。银行只在卷内滚存，
// Paper 2 开场把计时和银行一起清零。

import { useCallback, useEffect, useRef, useState } from 'react';
import MathText from '@/components/MathText';
import { useLang } from '@/lib/LangContext';
import type { ExamQuestion } from '@/lib/exam';
import {
  DIAGNOSTIC_TICK_MS,
  DIAGNOSTIC_WARN_SECONDS,
  bankAfter,
  budgetFor,
  deadlineFrom,
  fmtCountdown,
  remainingSeconds,
} from '@/lib/diagnostic';
import examStyles from '../exam/Exam.module.css';
import styles from './Diagnostic.module.css';

interface Props {
  /** 按卷分好的题目，卷内顺序即出题顺序（难度升序，不洗牌） */
  papers: ExamQuestion[][];
  /** 交卷：全场答对几题、本场都考了哪些 qid */
  onFinish: (result: { right: number; qids: number[] }) => void;
  /** 放弃：语义等同刷新页面，什么都不落盘 */
  onAbandon: () => void;
}

function sameLabel(a: string | null, b: string): boolean {
  return !!a && a.toLowerCase() === b.toLowerCase();
}

export default function DiagnosticRunner({ papers, onFinish, onAbandon }: Props) {
  const { t } = useLang();
  const [confirmAbandon, setConfirmAbandon] = useState(false);
  /** run = 正在答卷；break = 中场休息（不计时） */
  const [stage, setStage] = useState<'run' | 'break'>('run');
  const [paperIdx, setPaperIdx] = useState(0);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[][]>(() =>
    papers.map((paper) => new Array(paper.length).fill(null)),
  );
  const [bank, setBank] = useState(0);
  const [left, setLeft] = useState(() => budgetFor(0));
  /**
   * 当题的截止时间戳。剩余秒数一律由它现算，不靠 tick 累减——
   * 后台标签页的 setInterval 会被浏览器限流甚至冻住，数 tick 等于把 Alt-Tab
   * 变成免费暂停键，冻住的 left 还会被原样滚进时间银行。
   */
  const deadlineRef = useRef(Date.now() + budgetFor(0) * 1000);

  const answersRef = useRef(answers);
  answersRef.current = answers;
  const idxRef = useRef(idx);
  idxRef.current = idx;
  const paperIdxRef = useRef(paperIdx);
  paperIdxRef.current = paperIdx;
  const stageRef = useRef(stage);
  stageRef.current = stage;
  /** 交卷只能发生一次：归零和手动确认可能挤在同一帧 */
  const doneRef = useRef(false);
  const abandonOpenRef = useRef(confirmAbandon);
  abandonOpenRef.current = confirmAbandon;

  const paper = papers[paperIdx] || [];
  const q = paper[idx];

  /** 从截止时间戳现算剩余秒数并同步到界面 */
  const syncLeft = useCallback(() => {
    const remaining = remainingSeconds(deadlineRef.current);
    setLeft(remaining);
    return remaining;
  }, []);

  const finishAll = useCallback(() => {
    doneRef.current = true;
    let right = 0;
    const qids: number[] = [];
    papers.forEach((items, p) => {
      items.forEach((question, i) => {
        qids.push(question.qid);
        if (sameLabel(answersRef.current[p]?.[i] ?? null, question.answer)) right++;
      });
    });
    onFinish({ right, qids });
  }, [onFinish, papers]);

  /** 确认当题：剩余秒数滚存进银行，然后单向前进一题 */
  const confirmCurrent = useCallback(() => {
    if (doneRef.current || stageRef.current !== 'run') return;
    // 用截止时间现算，不读 left state：state 最多落后一个 tick，
    // 那点误差会被 bankAfter 原样滚进下一题
    const nextBank = bankAfter(remainingSeconds(deadlineRef.current));
    const current = papers[paperIdxRef.current] || [];

    if (idxRef.current < current.length - 1) {
      setBank(nextBank);
      setIdx((i) => i + 1);
      deadlineRef.current = deadlineFrom(nextBank);
      setLeft(budgetFor(nextBank));
      return;
    }
    // 本卷答完
    if (paperIdxRef.current < papers.length - 1) {
      setStage('break');
      return;
    }
    finishAll();
  }, [finishAll, papers]);

  const confirmRef = useRef(confirmCurrent);
  confirmRef.current = confirmCurrent;

  /** 开下一卷：计时与银行一起归零，上一卷剩的时间不带过来 */
  const startNextPaper = useCallback(() => {
    setPaperIdx((p) => p + 1);
    setIdx(0);
    setBank(0);
    deadlineRef.current = deadlineFrom(0);
    setLeft(budgetFor(0));
    setStage('run');
  }, []);

  // 逐题倒计时。每次都拿 Date.now() 和截止时间戳比，不累减；
  // 休息期间不计时，所以 stage 变了就把 interval 撤掉
  useEffect(() => {
    if (stage !== 'run') return;
    const timer = window.setInterval(syncLeft, DIAGNOSTIC_TICK_MS);
    return () => window.clearInterval(timer);
  }, [stage, syncLeft]);

  // 回到前台立刻重算一次：限流期间 tick 可能一次都没跑，
  // 界面上那个数字必须马上对上真实流逝的时间
  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden && stageRef.current === 'run') syncLeft();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [syncLeft]);

  useEffect(() => {
    if (left > 0 || stage !== 'run') return;
    // 归零：自动确认当前所选（没选就是未答），继续下一题
    confirmRef.current();
  }, [left, stage]);

  const select = useCallback((label: string) => {
    setAnswers((prev) =>
      prev.map((paperAnswers, p) =>
        p === paperIdxRef.current
          ? paperAnswers.map((value, i) => (i === idxRef.current ? label : value))
          : paperAnswers,
      ),
    );
  }, []);

  // 诊断的键盘只有两件事：选项与确认。
  // ←→ 和 F 在这里没有意义（单向、无旗标），一律不接。
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return;
      // 确认框开着时按键归弹窗；倒计时照常走，弹窗不是暂停后门
      if (abandonOpenRef.current) {
        if (e.key === 'Escape') setConfirmAbandon(false);
        return;
      }
      if (stageRef.current !== 'run') return;
      const current = (papers[paperIdxRef.current] || [])[idxRef.current];
      if (!current) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        confirmRef.current();
        return;
      }
      if (/^[1-9]$/.test(e.key)) {
        const choice = current.choices[Number(e.key) - 1];
        if (choice) select(choice.label);
        return;
      }
      if (/^[a-zA-Z]$/.test(e.key)) {
        const choice = current.choices.find(
          (item) => item.label.toLowerCase() === e.key.toLowerCase(),
        );
        if (choice) select(choice.label);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [papers, select]);

  const abandonDialog = confirmAbandon && (
    /* 自绘弹窗，不用 window.confirm：那玩意会阻塞事件循环，
       倒计时会跟着停——压力测试不该有这种暂停后门 */
    <div
      className={examStyles.overlay}
      role="dialog"
      aria-modal="true"
      onClick={() => setConfirmAbandon(false)}
    >
      <div className={examStyles.confirmBox} onClick={(e) => e.stopPropagation()}>
        <div>{t.diagnostic.abandonConfirm}</div>
        <div className={styles.abandonNote}>{t.diagnostic.abandonNote}</div>
        <div className={examStyles.confirmBtns}>
          <button
            type="button"
            className={examStyles.btnGhost}
            onClick={() => setConfirmAbandon(false)}
          >
            {t.diagnostic.abandonNo}
          </button>
          <button
            type="button"
            className={examStyles.btnPrimary}
            onClick={() => {
              // 末题归零与点放弃同帧：交卷若已发生（doneRef 已置位），本场已
              // 消耗一次机会，放弃只会把结果页盖掉——先读后写，读到就退让
              if (doneRef.current) return;
              doneRef.current = true; // 挡住归零那条路，别在退场路上又交一次卷
              onAbandon();
            }}
          >
            {t.diagnostic.abandon}
          </button>
        </div>
      </div>
    </div>
  );

  // ---- 中场休息：不限时，且一个成绩字样都不给 ----
  if (stage === 'break') {
    return (
      <div className={examStyles.wrap}>
        <div className={examStyles.resultWrap}>
          <div className={styles.breakCard}>
            <h2 className={styles.breakTitle}>{t.diagnostic.breakTitle}</h2>
            <p className={styles.breakLine}>{t.diagnostic.breakLine}</p>
            <p className={styles.breakNote}>{t.diagnostic.breakNote}</p>
            <button type="button" className={styles.startBtn} onClick={startNextPaper}>
              {t.diagnostic.breakStart}
            </button>
          </div>
        </div>
        {abandonDialog}
      </div>
    );
  }

  if (!q) return null;

  const warn = left <= DIAGNOSTIC_WARN_SECONDS;

  return (
    <div className={examStyles.exam}>
      <div className={examStyles.cbtHeader}>
        <div className={examStyles.cbtTitle}>
          {t.diagnostic.title} · {t.diagnostic.paper(paperIdx + 1)}
        </div>
        <div className={examStyles.cbtHeaderRight}>
          <div className={warn ? examStyles.timeWarn : undefined}>
            🕐 Time Remaining {fmtCountdown(left)}
          </div>
          <div>
            {idx + 1} of {paper.length}
          </div>
          {/* 误开一场就得枯坐很久不合理，给个不显眼的出口。
              语义和刷新页面完全一致：什么都不落盘 */}
          <button
            type="button"
            className={styles.abandonBtn}
            onClick={(e) => {
              e.currentTarget.blur(); // 别让它抢走 Enter
              // 末题归零和这一下可能挤在同一帧：那时本场已经落盘，
              // 再弹放弃框只会把结果页挡掉
              if (doneRef.current) return;
              setConfirmAbandon(true);
            }}
          >
            {t.diagnostic.abandon}
          </button>
        </div>
      </div>

      {/* 单向流：没有 Navigator、没有 Back、没有旗标，footer 只剩确认 */}
      <div className={examStyles.cbtSubbar}>
        <span className={styles.oneWay}>单向作答 · 不可回看 · 全程不显示对错</span>
        {bank > 0 && <span className={styles.bank}>含滚存 +{bank}s</span>}
      </div>

      <div className={examStyles.cbtBody}>
        <div className={examStyles.colMain}>
          <div className={examStyles.stem}>
            <MathText text={q.statement} />
          </div>

          <div className={examStyles.choiceList}>
            {q.choices.map((c) => {
              // 选中只有「选中」一种状态：不着对错色，不给任何反馈
              const cls = [examStyles.choiceRow];
              if (sameLabel(answers[paperIdx]?.[idx] ?? null, c.label)) {
                cls.push(examStyles.optSelected);
              }
              return (
                <button key={c.label} className={cls.join(' ')} onClick={() => select(c.label)}>
                  <span className={examStyles.radio} />
                  <span className={examStyles.choiceLabel}>{c.label.toUpperCase()}</span>
                  {c.text && (
                    <span className={examStyles.choiceText}>
                      <MathText text={c.text} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            className={examStyles.enterBtn}
            onClick={(e) => {
              e.currentTarget.blur();
              confirmRef.current();
            }}
            aria-keyshortcuts="Enter"
          >
            {idx < paper.length - 1
              ? '确认并进入下一题'
              : paperIdx < papers.length - 1
                ? '确认并结束本卷'
                : '确认并交卷'}
            <span className={examStyles.enterBtnKey}>Enter</span>
          </button>
          <div className={styles.hint}>
            提前确认可把剩下的时间滚存到下一题；归零会自动确认当前所选。
          </div>
        </div>
      </div>

      {abandonDialog}
    </div>
  );
}
