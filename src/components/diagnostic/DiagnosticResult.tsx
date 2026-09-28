'use client';

// 诊断成绩页。只有两态：Pass / Fail。
// 不列题目、不显示对错、不给正确率数字——这是「全程不给对错」的最后一环。
// 内层版式，沿成绩页规矩用中文。

import examStyles from '../exam/Exam.module.css';
import styles from './Diagnostic.module.css';

interface Props {
  passed: boolean;
  /** 本场并入 Grill 的题数 */
  bound: number;
  /** 交卷后还剩几次机会（两次机会制），Fail 文案据此分叉 */
  attemptsLeft: number;
  /** 下一次机会要用的卷（卷二）还没出齐：Fail 文案要把「现在还考不了」说在前头 */
  nextPaperPending: boolean;
  onBack: () => void;
  /** 直接去复烤区把这批题烤明白，别让用户自己找 */
  onGoGrill: () => void;
}

export default function DiagnosticResult({
  passed,
  bound,
  attemptsLeft,
  nextPaperPending,
  onBack,
  onGoGrill,
}: Props) {
  return (
    <div className={examStyles.wrap}>
      <div className={examStyles.resultWrap}>
        <div className={`${styles.verdictCard} ${passed ? styles.verdictPass : styles.verdictFail}`}>
          <div className={styles.verdictExam}>7.5+ Diagnostic</div>
          <div className={styles.verdictBig}>{passed ? 'PASS' : 'FAIL'}</div>
          <p className={styles.verdictLine}>
            {passed
              ? '9.0 Trivial 已解锁。扩展题库从现在起对你开放。'
              : attemptsLeft > 0
                ? nextPaperPending
                  ? `这次没有通过。还有 ${attemptsLeft} 次机会，下次用的是另一套题——那套题还在准备，出齐后就能考，这次机会先给你留着。`
                  : `这次没有通过。还有 ${attemptsLeft} 次机会，下次用的是另一套题。`
                : '这次没有通过，两次机会已用完。做满 365 题仍然可以解锁 9.0 Trivial。'}
          </p>
          <p className={styles.verdictBound}>本场 {bound} 道题已加入 Grill 复烤区，答案和解析都在那里</p>
          <div className={styles.verdictBtns}>
            <button type="button" className={examStyles.btnGhost} onClick={onGoGrill}>
              去 Grill 看看
            </button>
            <button type="button" className={examStyles.btnPrimary} onClick={onBack}>
              返回
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
