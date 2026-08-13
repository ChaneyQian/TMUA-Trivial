'use client';

// 9.0 锁定态展开后看到的介绍页。
// 两条解锁路并列摆着：上面是 Diagnostic 的规则和入口，下面是既有的 365 充电条。

import { useLang } from '@/lib/LangContext';
import {
  DIAGNOSTIC_MAX_ATTEMPTS,
  DIAGNOSTIC_TOTAL,
  attemptsLeft,
  canAttempt,
  passMark,
} from '@/lib/diagnostic';
import type { DiagState } from '@/lib/records';
import examStyles from '../exam/Exam.module.css';
import styles from './Diagnostic.module.css';

interface Props {
  /** 固定卷是否已就绪；没就绪不给开考 */
  ready: boolean;
  /** 整个 diag 状态原样传入：只挑 attempts 会把 passed 丢在半路，
      让这里与 startDiagnostic 的 canAttempt 判据分叉 */
  diag?: DiagState;
  busy: boolean;
  onStart: () => void;
  charge: {
    progress: number;
    value: number;
    max: number;
  };
}

export default function DiagnosticIntro({ ready, diag, busy, onStart, charge }: Props) {
  const { t } = useLang();
  const left = attemptsLeft(diag);
  const allowed = canAttempt(diag);

  const rules = [
    t.diagnostic.rulePapers,
    t.diagnostic.ruleTime,
    t.diagnostic.ruleTimeout,
    t.diagnostic.ruleNoFeedback,
    t.diagnostic.rulePass(passMark(), DIAGNOSTIC_TOTAL),
    t.diagnostic.ruleChances(DIAGNOSTIC_MAX_ATTEMPTS),
  ];

  return (
    <div className={styles.intro}>
      <h2 className={styles.introTitle}>{t.diagnostic.title}</h2>
      <p className={styles.lead}>{t.diagnostic.lead}</p>

      <h3 className={styles.rulesTitle}>{t.diagnostic.rulesTitle}</h3>
      <ul className={styles.rules} role="list">
        {rules.map((rule) => (
          <li key={rule} className={styles.rule}>
            {rule}
          </li>
        ))}
      </ul>

      {allowed ? (
        <>
          <button
            type="button"
            className={styles.startBtn}
            // 直调，不包异步：requestFullscreen 只认用户手势的同步调用链
            onClick={onStart}
            disabled={busy || !ready}
          >
            {busy ? t.diagnostic.starting : t.diagnostic.start}
          </button>
          {!ready && <p className={styles.warn}>{t.diagnostic.unavailable}</p>}
          <p className={styles.attempts}>
            {t.diagnostic.chance(DIAGNOSTIC_MAX_ATTEMPTS - left + 1, DIAGNOSTIC_MAX_ATTEMPTS)}
          </p>
        </>
      ) : (
        /* 机会用完：不再给入口，但要把另一条路指清楚 */
        <div className={styles.exhausted}>
          <p className={styles.exhaustedTitle}>{t.diagnostic.exhausted}</p>
          <p className={styles.exhaustedHint}>{t.diagnostic.exhaustedHint}</p>
        </div>
      )}

      {/* 另一条路照常摆着：诊断没过也不影响练满 365 题解锁 */}
      <div className={styles.altRoute}>
        <p className={styles.altText}>{t.diagnostic.orPractice}</p>
        <div className={styles.charge}>
          <div className={examStyles.libraryCharge}>
            <span className={examStyles.libraryChargeLabel}>
              <span className={examStyles.chargeLight} aria-hidden="true" />
              {t.deck.chargeLabel(charge.value, charge.max)}
            </span>
            <span
              className={examStyles.libraryChargeTrack}
              role="progressbar"
              aria-label={t.deck.chargeAria}
              aria-valuemin={0}
              aria-valuemax={charge.max}
              aria-valuenow={Math.min(charge.value, charge.max)}
            >
              <span
                className={examStyles.libraryChargeFill}
                style={{ width: `${charge.progress * 100}%` }}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
