'use client';

// Grill（复烤区）的配置面板。
// 组卷走 P0 建好的 start({ qids }) 通道 + practice 模式，考试引擎一行没动。

import { useEffect } from 'react';

import { useLang } from '@/lib/LangContext';
import type { IndexEntry } from '@/lib/exam';
import { grillAvailable, grillCountOptions, boundCount, danglingCount } from '@/lib/grill';
import type { PickMode, Records } from '@/lib/records';
import examStyles from '../exam/Exam.module.css';
import styles from './Grill.module.css';

interface Props {
  index: IndexEntry[] | null;
  records: Records;
  pickMode: PickMode;
  onPickMode: (mode: PickMode) => void;
  count: number;
  onCount: (n: number) => void;
  busy: boolean;
  onStart: () => void;
  /** 空态里指路：直接去 9.0 的 Diagnostic 介绍页 */
  onGoDiagnostic: () => void;
  error: string;
}

export default function GrillPanel({
  index,
  records,
  pickMode,
  onPickMode,
  count,
  onCount,
  busy,
  onStart,
  onGoDiagnostic,
  error,
}: Props) {
  const { t } = useLang();

  const bound = boundCount(records);
  const dangling = danglingCount(index, records);
  const available = grillAvailable(index, records, pickMode);
  const choices = grillCountOptions(available);

  // 切到更窄的策略后，选中的题数可能超出新上限——pickGrillQids 会悄悄截断，
  // 但界面上就成了「显示 20、实抽 3」。超限时直接落到「全部」档，显示与行为对齐
  useEffect(() => {
    if (available > 0 && count > available) onCount(available);
  }, [available, count, onCount]);

  // 空态：一次诊断都没考过，这里本来就该是空的
  if (bound === 0) {
    return (
      <div className={styles.panel}>
        <h2 className={styles.title}>{t.grill.title}</h2>
        <div className={styles.emptyBox}>
          <p className={styles.emptyTitle}>{t.grill.emptyTitle}</p>
          <p className={styles.emptyHint}>{t.grill.emptyHint}</p>
          <button type="button" className={styles.ghost} onClick={onGoDiagnostic}>
            {t.grill.goDiagnostic}
          </button>
        </div>
      </div>
    );
  }

  const modes: { id: PickMode; label: string; hint: string }[] = [
    { id: 'random', label: t.setup.pickRandom, hint: t.setup.pickRandomHint },
    { id: 'wrong-and-new', label: t.setup.pickWrongNew, hint: t.setup.pickWrongNewHint },
    { id: 'new-only', label: t.setup.pickNewOnly, hint: t.setup.pickNewOnlyHint },
  ];

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>{t.grill.title}</h2>
      <p className={styles.lead}>{t.grill.lead}</p>

      <p className={styles.bound}>
        {t.grill.bound(bound)}
        {/* 题库换代后绑定的 qid 可能已经不存在，如实说明，别让用户对不上数 */}
        {dangling > 0 && <span className={styles.dangling}> · {t.grill.dangling(dangling)}</span>}
      </p>

      <div className={examStyles.fieldLabel}>{t.setup.fieldPick}</div>
      <div className={examStyles.segRow}>
        {modes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            className={`${examStyles.segBtn} ${pickMode === mode.id ? examStyles.segActive : ''}`}
            onClick={() => onPickMode(mode.id)}
          >
            {mode.label}
            <span className={examStyles.segHint}>{mode.hint}</span>
          </button>
        ))}
      </div>

      <div className={examStyles.fieldLabel}>{t.grill.fieldCount(available)}</div>
      <div className={examStyles.segRow}>
        {choices.map((n, i) => (
          <button
            key={n}
            type="button"
            className={`${examStyles.segBtn} ${count === n ? examStyles.segActive : ''}`}
            onClick={() => onCount(n)}
          >
            {/* 最后一档就是「全部」，省得用户自己算上限 */}
            {i === choices.length - 1 && n === available ? `${t.grill.countAll} (${n})` : n}
          </button>
        ))}
      </div>

      <button
        className={examStyles.startBtn}
        // 直调，不包异步：requestFullscreen 只认用户手势的同步调用链
        onClick={onStart}
        disabled={busy || !index || available === 0}
      >
        {busy ? t.setup.picking : t.grill.start}
      </button>
      {available === 0 && <div className={examStyles.errMsg}>{t.grill.empty}</div>}
      {error && <div className={examStyles.errMsg}>{error}</div>}
    </div>
  );
}
