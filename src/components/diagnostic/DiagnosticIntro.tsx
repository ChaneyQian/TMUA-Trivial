'use client';

// 9.0 锁定态展开后看到的介绍页：7.5+ Diagnostic 的规则与入口，
// 下面并列着既有的 365 充电条——两条解锁路摆在一起。
//
// 规则是大白话短句、双语；题数、分钟、通过线、机会次数全从 lib/diagnostic 的常量取，
// 规则改了文案自己跟上。能不能开考只认 diagnosticStatus——和 ExamApp 开考那道闸
// 同一个函数，两处判据不会分叉。

import { useLang } from '@/lib/LangContext';
import {
  DIAGNOSTIC_BASE_SECONDS,
  DIAGNOSTIC_MAX_ATTEMPTS,
  DIAGNOSTIC_PAPER_SIZE,
  attemptsLeft,
  diagnosticStatus,
  passMark,
  showLegacyNote,
  type DiagnosticPapers,
} from '@/lib/diagnostic';
import type { DiagState } from '@/lib/records';
import examStyles from '../exam/Exam.module.css';
import styles from './Diagnostic.module.css';

interface Props {
  /** diag.json（形状闸过了的）；null ＝ 还没取到，或取不到 */
  papers: DiagnosticPapers | null;
  /** 7.5+ 的战绩整个传入：只挑 attempts 会把 passed 丢在半路，
      让这里与 startDiagnostic 的判据分叉 */
  diag?: DiagState;
  /** 旧 GMAT 诊断考过几次。只用来决定要不要说一句「之前的次数不算」 */
  legacyAttempts: number;
  busy: boolean;
  onStart: () => void;
  charge: {
    progress: number;
    value: number;
    max: number;
  };
}

export default function DiagnosticIntro({
  papers,
  diag,
  legacyAttempts,
  busy,
  onStart,
  charge,
}: Props) {
  const { t } = useLang();
  const status = diagnosticStatus(papers, diag);
  // 这是第几次机会：卷二准备中时同样要说清楚「你还有第 2 次」
  const nth = DIAGNOSTIC_MAX_ATTEMPTS - attemptsLeft(diag) + 1;

  const rules = [
    t.diagnostic.rulePaper(DIAGNOSTIC_PAPER_SIZE),
    t.diagnostic.ruleTime(DIAGNOSTIC_BASE_SECONDS / 60),
    t.diagnostic.ruleOneWay,
    t.diagnostic.ruleNoFeedback,
    t.diagnostic.rulePass(passMark(), DIAGNOSTIC_PAPER_SIZE),
    t.diagnostic.ruleChances(DIAGNOSTIC_MAX_ATTEMPTS),
    t.diagnostic.ruleUnlock,
  ];

  return (
    <div className={styles.intro}>
      <h2 className={styles.introTitle}>{t.diagnostic.title}</h2>
      <p className={styles.lead}>{t.diagnostic.lead}</p>
      {/* 考过旧 GMAT 诊断、还没碰过新考试的人：先把「之前那几次不算」说破，
          免得他看着「两次机会用完」的旧印象不敢点开始 */}
      {showLegacyNote(legacyAttempts, diag) && (
        <p className={styles.legacyNote}>{t.diagnostic.legacyNote}</p>
      )}

      <h3 className={styles.rulesTitle}>{t.diagnostic.rulesTitle}</h3>
      <ul className={styles.rules} role="list">
        {rules.map((rule) => (
          <li key={rule} className={styles.rule}>
            {rule}
          </li>
        ))}
      </ul>

      {status.kind === 'ready' || status.kind === 'unavailable' ? (
        <>
          <button
            type="button"
            className={styles.startBtn}
            // 直调，不包异步：requestFullscreen 只认用户手势的同步调用链
            onClick={onStart}
            disabled={busy || status.kind !== 'ready'}
          >
            {busy ? t.diagnostic.starting : t.diagnostic.start}
          </button>
          {status.kind === 'unavailable' && <p className={styles.warn}>{t.diagnostic.unavailable}</p>}
          <p className={styles.attempts}>{t.diagnostic.chance(nth, DIAGNOSTIC_MAX_ATTEMPTS)}</p>
        </>
      ) : status.kind === 'pending' ? (
        /* 卷二还没出齐：不给开始，也不扣这次机会，把原因说清楚 */
        <div className={styles.exhausted} role="status">
          <p className={styles.exhaustedTitle}>{t.diagnostic.pendingTitle}</p>
          <p className={styles.exhaustedHint}>{t.diagnostic.pendingHint}</p>
          <p className={styles.attempts}>{t.diagnostic.chance(status.nth, DIAGNOSTIC_MAX_ATTEMPTS)}</p>
        </div>
      ) : status.kind === 'exhausted' ? (
        /* 机会用完：不再给入口，但要把另一条路指清楚 */
        <div className={styles.exhausted}>
          <p className={styles.exhaustedTitle}>{t.diagnostic.exhausted}</p>
          <p className={styles.exhaustedHint}>{t.diagnostic.exhaustedHint}</p>
        </div>
      ) : (
        /* 已通过：通过即解锁，正常走不到这一页，兜底别再给开始按钮 */
        <div className={styles.exhausted}>
          <p className={styles.exhaustedTitle}>{t.diagnostic.passedNote}</p>
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
