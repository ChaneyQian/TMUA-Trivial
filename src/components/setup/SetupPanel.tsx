'use client';

// 经典区 / 9.0 区的配置面板：题库、逻辑推理题、模式、抽题范围、题目数量（Mock 另有限时），
// 收尾是开始按钮。
//
// 从 ExamApp 拆出来的（Design §22 P8-A3，R2 拆分的第一刀）：状态一律还在 ExamApp，
// 这里只管画和回调——抽题池、题数、兜底题库这些口径都在外层算好了递进来，
// 面板不重新推一遍，免得同一个数有两个出处。五组选项都是 SegmentedGroup（ARIA 单选组）。

import { useId } from 'react';
import type { ZoneId } from '@/components/deck/zones';
import { useLang } from '@/lib/LangContext';
import type { LibraryMode, LogicCoverage, LogicFilter, PickMode } from '@/lib/records';
import styles from '../exam/Exam.module.css';
import SegmentedGroup from './SegmentedGroup';
import panelStyles from './SetupPanel.module.css';

/** 题库按钮的取值：各库 + 混合 */
export type Db = 'TMUA' | 'TMUA_MOCK' | 'MAT' | 'SMC' | 'ECAA' | 'AMC' | 'ALL';
export type Mode = 'practice' | 'mock';

interface Props {
  /** 面板标题取这个区的名字 */
  zone: ZoneId;
  /** 这个区里有题的库（外层按 zoneCounts 筛好，末尾是「混合」） */
  bankChoices: Db[];
  db: Db;
  setDb: (db: Db) => void;
  /** 按钮上的「N 题」：题库范围 + 逻辑推理开关收窄之后的池子 */
  poolCounts: Record<string, number>;
  dbName: (db: Db) => string;
  libraryMode: LibraryMode;
  /** 逻辑推理开关生效之前的覆盖（见 ExamApp 的 scopedIndex） */
  logicCov: LogicCoverage;
  logicFilter: LogicFilter;
  chooseLogicReasoning: (next: LogicFilter) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  pickMode: PickMode;
  setPickMode: (mode: PickMode) => void;
  /** 当前配置下可抽的题数 */
  totalPool: number;
  count: number;
  setCountAnd: (n: number) => void;
  minutes: number;
  /** 手动改了限时：外层记下「改过」，之后换题数不再覆盖它 */
  onMinutes: (minutes: number) => void;
  /** 正在抽题（phase 'loading'） */
  busy: boolean;
  /** 题库索引到了没有 */
  indexReady: boolean;
  indexError: string;
  error: string;
  /** 上一场的回执（「统计后再来一次」之后还看得见结果） */
  recordMessage: string;
  onStart: () => void;
}

export default function SetupPanel({
  zone,
  bankChoices,
  db,
  setDb,
  poolCounts,
  dbName,
  libraryMode,
  logicCov,
  logicFilter,
  chooseLogicReasoning,
  mode,
  setMode,
  pickMode,
  setPickMode,
  totalPool,
  count,
  setCountAnd,
  minutes,
  onMinutes,
  busy,
  indexReady,
  indexError,
  error,
  recordMessage,
  onStart,
}: Props) {
  const { t } = useLang();
  // 五组单选各有一个组标题，aria-labelledby 指过去；限时框同理
  const idBase = useId();
  const labelId = (field: 'bank' | 'logic' | 'mode' | 'pick' | 'count' | 'minutes') => `${idBase}-${field}`;

  return (
    <div className={styles.setupCard}>
      <div className={styles.setupTitle}>{t.zone.title[zone]}</div>
      <div className={styles.setupSub}>{t.setup.sub}</div>

      <div className={styles.fieldLabel} id={labelId('bank')}>
        {t.setup.fieldBank}
      </div>
      {/* 当前区里一道题都抽不到的库（比如「仅逻辑题」把它清空了）置灰、方向键跳过它，
          但不从这排里消失——消失了就找不到「勾回来能救它」这条路 */}
      <SegmentedGroup
        labelledBy={labelId('bank')}
        value={db}
        onChange={setDb}
        options={bankChoices.map((d) => ({
          value: d,
          label: dbName(d),
          hint:
            d === 'ALL'
              ? t.setup.questions(Object.values(poolCounts).reduce((a, b) => a + b, 0))
              : t.setup.questions(poolCounts[d] || 0),
          disabled: d !== 'ALL' && poolCounts[d] === 0,
        }))}
      />
      {/* 互斥之后同名库在两个区指的不是同一批题：9.0 的 TMUA 是回忆题、
          MAT 是老卷与回忆题——按钮上只有题数，而题数恰恰是用户最不会
          去做减法的东西，得把范围说破 */}
      {libraryMode === 'hidden' && (
        <p className={styles.zoneScopeNote}>{t.setup.trivialScopeNote}</p>
      )}

      {/* 逻辑推理三档（用户裁定 2026-09-16）：全部 / 仅逻辑题 / 排除。
          当前 db 一道标注过的逻辑题都没有时整组不渲染——摆着也只是三个按不动的按钮。
          注意这**不**等于「仅逻辑题」永远选不空池子：它只保证「同一个 db、
          且不叠加抽题范围」这一种情形。叠上「仅新题」照样能归零（Start 会置灰，
          下面那条提示负责指路）；而万一将来某个区×库组合一道 logic 标注都没有，
          用户存着的 'only' 会配上一个隐藏了的控件——现有数据里每个组合都 > 0，
          所以当下不触发，但这是**数据依赖**，不是结构保证。
          覆盖率披露已按用户裁定移除（2026-08-23）：那是维护者视角的打标
          进度报告，普通学生不需要读。抽题池的真实数字在题数档位里，
          空池时另有「切回全部可再抽 N 道」的操作提示兑底。
          五组统一成 ARIA 单选组（P8-A3）：radiogroup / radio + roving tabindex，
          ←→↑↓ / Home / End 移动并选中，Tab 进出整组只停一次（见 SegmentedGroup） */}
      {logicCov.logic > 0 && (
        <>
          <div className={styles.fieldLabel} id={labelId('logic')}>
            {t.setup.logicReasoning}
          </div>
          <SegmentedGroup
            labelledBy={labelId('logic')}
            value={logicFilter}
            onChange={chooseLogicReasoning}
            options={(
              [
                ['all', t.setup.logicAll],
                ['only', t.setup.logicOnly],
                ['exclude', t.setup.logicExclude],
              ] as [LogicFilter, string][]
            ).map(([value, label]) => ({ value, label }))}
          />
        </>
      )}

      <div className={styles.fieldLabel} id={labelId('mode')}>
        {t.setup.fieldMode}
      </div>
      <SegmentedGroup
        labelledBy={labelId('mode')}
        value={mode}
        onChange={setMode}
        options={[
          { value: 'practice', label: t.setup.practiceLabel, hint: t.setup.practiceHint },
          { value: 'mock', label: t.setup.mockLabel, hint: t.setup.mockHint },
        ]}
      />

      <div className={styles.fieldLabel} id={labelId('pick')}>
        {t.setup.fieldPick}
      </div>
      <SegmentedGroup
        labelledBy={labelId('pick')}
        value={pickMode}
        onChange={setPickMode}
        options={[
          { value: 'random', label: t.setup.pickRandom, hint: t.setup.pickRandomHint },
          { value: 'wrong-and-new', label: t.setup.pickWrongNew, hint: t.setup.pickWrongNewHint },
          { value: 'new-only', label: t.setup.pickNewOnly, hint: t.setup.pickNewOnlyHint },
        ]}
      />

      <div className={styles.fieldLabel} id={labelId('count')}>
        {t.setup.fieldCount(totalPool)}
      </div>
      {/* 三档预设是单选组；自定义题数框不在组里，自己占一个 Tab 位。
          框里的数不等于任何一档时组内没有选中项，Tab 位落在第一档（见 lib/segmented 的 tabStopIndex） */}
      <div className={panelStyles.countRow}>
        <SegmentedGroup
          className={panelStyles.countPresets}
          labelledBy={labelId('count')}
          value={count}
          onChange={setCountAnd}
          options={[5, 10, 20].map((n) => ({ value: n, label: n }))}
        />
        <input
          className={styles.numInput}
          type="number"
          min={1}
          max={100}
          value={count}
          aria-label={t.setup.countCustom}
          onChange={(e) => setCountAnd(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
        />
      </div>

      {mode === 'mock' && (
        <>
          <div className={styles.fieldLabel} id={labelId('minutes')}>
            {t.setup.fieldMinutes}
          </div>
          <div className={styles.segRow}>
            <input
              className={styles.numInput}
              type="number"
              min={1}
              max={300}
              value={minutes}
              aria-labelledby={labelId('minutes')}
              onChange={(e) => onMinutes(Math.max(1, Math.min(300, Number(e.target.value) || 1)))}
            />
          </div>
        </>
      )}

      {/* 主操作收尾。做题记录整块已经搬进进度面板，配置面板只管「怎么考」 */}
      <button
        className={styles.startBtn}
        onClick={() => onStart()}
        disabled={busy || !indexReady || totalPool === 0}
      >
        {busy
          ? t.setup.picking
          : !indexReady && !indexError
            ? t.setup.bankLoading
            : t.setup.start}
      </button>
      {error && <div className={styles.errMsg}>{error}</div>}
      {indexError && <div className={styles.errMsg}>{indexError}</div>}
      {indexReady && totalPool === 0 && (
        <div className={styles.errMsg}>
          {t.setup.emptyBank}
          {/* 池子空掉时，若有题正被这组按钮挡在外面，直接说明切回「全部」能多出多少题——
              那组按钮就在同屏上方，但「没有可用题目」这句话本身不指向它。
              两档对称：「排除」挡住的是已标注的逻辑题，「仅逻辑题」挡住的是其余全部。
              条件与控件的显示条件同源，免得提示指向一个没渲染出来的控件 */}
          {logicFilter !== 'all' &&
            logicCov.logic > 0 &&
            ` ${t.setup.emptyBankLogicHint(
              logicFilter === 'only' ? logicCov.total - logicCov.logic : logicCov.logic,
            )}`}
        </div>
      )}
      <div className={styles.backLink}>{t.setup.keyboard}</div>

      {/* 导入导出与统计都搬去进度面板了，这里只留一条回执，
          好让「统计后再来一次」之后还看得见结果 */}
      {recordMessage && (
        <div className={styles.recordSection}>
          <div className={styles.recordMessage}>{recordMessage}</div>
        </div>
      )}
    </div>
  );
}
