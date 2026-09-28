'use client';

// 7.5+ Diagnostic 的运行时。刻意和 practice/mock 那套分开：
// 单向、无批改、无解析、逐题倒计时 + 时间银行，和普通考试没有一行共享逻辑，
// 免得为了这场特例去改动已经稳定的 exam 运行时。
//
// 单卷 10 题，没有中场休息（用户裁定 2026-09-28）：一卷一只钟，
// 银行从第一题一路滚到最后一题。选项 4–12 个（A–L）、MAT 体例的小写标号、
// 选项留在题面里的内联题（按钮只显标号）、题图，全按题目自己的数据渲染。

import { useCallback, useEffect, useRef, useState } from 'react';
import MathText from '@/components/MathText';
import { useLang } from '@/lib/LangContext';
import type { ExamQuestion } from '@/lib/exam';
import {
  DIAGNOSTIC_TICK_MS,
  DIAGNOSTIC_WARN_SECONDS,
  bankAfter,
  budgetFor,
  choiceForKey,
  deadlineFrom,
  fmtCountdown,
  remainingSeconds,
} from '@/lib/diagnostic';
import examStyles from '../exam/Exam.module.css';
import styles from './Diagnostic.module.css';

interface Props {
  /** 这一卷的题，数组顺序就是出题顺序（固定卷，不洗牌） */
  questions: ExamQuestion[];
  /** 第几次机会（1 起），题头显示 Paper 1 / Paper 2 */
  nth: number;
  /** 交卷：答对几题、本场都考了哪些 qid */
  onFinish: (result: { right: number; qids: number[] }) => void;
  /** 放弃：语义等同刷新页面，什么都不落盘 */
  onAbandon: () => void;
}

function sameLabel(a: string | null, b: string): boolean {
  return !!a && a.toLowerCase() === b.toLowerCase();
}

export default function DiagnosticRunner({ questions, nth, onFinish, onAbandon }: Props) {
  const { t } = useLang();
  const [confirmAbandon, setConfirmAbandon] = useState(false);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(() =>
    new Array(questions.length).fill(null),
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
  /** 交卷只能发生一次：归零和手动确认可能挤在同一帧 */
  const doneRef = useRef(false);
  const abandonOpenRef = useRef(confirmAbandon);
  abandonOpenRef.current = confirmAbandon;

  const q = questions[idx];

  /** 从截止时间戳现算剩余秒数并同步到界面 */
  const syncLeft = useCallback(() => {
    const remaining = remainingSeconds(deadlineRef.current);
    setLeft(remaining);
    return remaining;
  }, []);

  const finishAll = useCallback(() => {
    doneRef.current = true;
    let right = 0;
    questions.forEach((question, i) => {
      if (sameLabel(answersRef.current[i] ?? null, question.answer)) right++;
    });
    onFinish({ right, qids: questions.map((question) => question.qid) });
  }, [onFinish, questions]);

  /** 确认当题：剩余秒数滚存进银行，然后单向前进一题；最后一题确认即交卷 */
  const confirmCurrent = useCallback(() => {
    if (doneRef.current) return;
    // 用截止时间现算，不读 left state：state 最多落后一个 tick，
    // 那点误差会被 bankAfter 原样滚进下一题
    const nextBank = bankAfter(remainingSeconds(deadlineRef.current));
    if (idxRef.current < questions.length - 1) {
      setBank(nextBank);
      setIdx((i) => i + 1);
      deadlineRef.current = deadlineFrom(nextBank);
      setLeft(budgetFor(nextBank));
      return;
    }
    finishAll();
  }, [finishAll, questions]);

  const confirmRef = useRef(confirmCurrent);
  confirmRef.current = confirmCurrent;

  // 逐题倒计时。每次都拿 Date.now() 和截止时间戳比，不累减
  useEffect(() => {
    const timer = window.setInterval(syncLeft, DIAGNOSTIC_TICK_MS);
    return () => window.clearInterval(timer);
  }, [syncLeft]);

  // 回到前台立刻重算一次：限流期间 tick 可能一次都没跑，
  // 界面上那个数字必须马上对上真实流逝的时间
  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden) syncLeft();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [syncLeft]);

  useEffect(() => {
    if (left > 0) return;
    // 归零：自动确认当前所选（没选就是未答），继续下一题
    confirmRef.current();
  }, [left]);

  const select = useCallback((label: string) => {
    if (doneRef.current) return;
    setAnswers((prev) => prev.map((value, i) => (i === idxRef.current ? label : value)));
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
      const current = questions[idxRef.current];
      if (!current) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        confirmRef.current();
        return;
      }
      // Ctrl+C / Cmd+R 这类组合键不是在选选项
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const label = choiceForKey(
        current.choices.map((choice) => choice.label),
        e.key,
      );
      if (label) select(label);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [questions, select]);

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

  if (!q) return null;

  const warn = left <= DIAGNOSTIC_WARN_SECONDS;
  const last = idx === questions.length - 1;

  return (
    <div className={examStyles.exam}>
      <div className={examStyles.cbtHeader}>
        <div className={examStyles.cbtTitle}>
          {t.diagnostic.title} · {t.diagnostic.paper(nth)}
        </div>
        <div className={examStyles.cbtHeaderRight}>
          <div className={warn ? examStyles.timeWarn : undefined}>
            🕐 Time Remaining {fmtCountdown(left)}
          </div>
          <div>
            {idx + 1} of {questions.length}
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
              const selected = sameLabel(answers[idx] ?? null, c.label);
              const cls = [examStyles.choiceRow];
              if (selected) cls.push(examStyles.optSelected);
              return (
                <button
                  key={c.label}
                  type="button"
                  className={cls.join(' ')}
                  aria-pressed={selected}
                  onClick={() => select(c.label)}
                >
                  <span className={examStyles.radio} />
                  {/* 标号统一大写显示，与练习、复烤区同一套体例；比对一律不分大小写 */}
                  <span className={examStyles.choiceLabel}>{c.label.toUpperCase()}</span>
                  {/* 内联题（选项留在题面里）的 text 是空串，按钮只显标号 */}
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
            type="button"
            className={examStyles.enterBtn}
            onClick={(e) => {
              e.currentTarget.blur();
              confirmRef.current();
            }}
            aria-keyshortcuts="Enter"
          >
            {last ? '确认并交卷' : '确认并进入下一题'}
            <span className={examStyles.enterBtnKey}>Enter</span>
          </button>
          <div className={styles.hint}>
            提前确认可把剩下的时间滚存到下一题；归零会自动确认当前所选。
            <br />
            键盘：A–L / 1–9 选项 · Enter 确认
          </div>
        </div>
      </div>

      {abandonDialog}
    </div>
  );
}
