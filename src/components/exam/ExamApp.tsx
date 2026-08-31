'use client';

// design.md §2.6 Test 模式:CBT 模拟(照 TMUA 官方机考模板)
// 练习=点选项后 Enter 批改;Mock=倒计时交卷统一批改

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import IdBadge from '@/components/badge/IdBadge';
import LangToggle from '@/components/LangToggle';
import CardDeck from '@/components/deck/CardDeck';
import { ZONES, zoneById, type ZoneId } from '@/components/deck/zones';
import ProgressPanel from '@/components/progress/ProgressPanel';
import DiagnosticIntro from '@/components/diagnostic/DiagnosticIntro';
import DiagnosticRunner from '@/components/diagnostic/DiagnosticRunner';
import DiagnosticResult from '@/components/diagnostic/DiagnosticResult';
import GrillPanel from '@/components/grill/GrillPanel';
import NoticeBoard from '@/components/notice/NoticeBoard';
import { pickGrillQids } from '@/lib/grill';
import { historyFor, practiceOverview, practiceQids } from '@/lib/progress';
import {
  cachedPapers,
  loadPapers,
  papersJustCompleted,
  type PapersData,
} from '@/lib/papers';
import {
  attemptsLeft,
  canAttempt,
  fetchDiagnosticSets,
  isPass,
  setIndexForAttempt,
  type DiagnosticSets,
} from '@/lib/diagnostic';
import MathText from '@/components/MathText';
import {
  buildExam,
  fetchIndex,
  fetchQuestions,
  EXAM_DATABASES,
  ExamQuestion,
  IndexEntry,
} from '@/lib/exam';
import {
  addSession,
  availableCountForMode,
  clearRecords,
  createEmptyRecords,
  exportRecordsWorkbook,
  hiddenUnlockProgress,
  importRecordsWorkbook,
  indexForLibraryMode,
  indexForLogicReasoning,
  isHiddenModeUnlocked,
  loadIncludeLogicReasoning,
  loadRecords,
  logicCoverage,
  overview,
  pickQidsForMode,
  reachableIndex,
  saveIncludeLogicReasoning,
  saveRecords,
  validCompletedCount,
  wrongRanking,
  grillCount,
  mergeDiagnostic,
  recordDiagnostic,
  HIDDEN_UNLOCK_COUNT,
  type LibraryMode,
  type PickMode,
  type Records,
} from '@/lib/records';
import { useLang } from '@/lib/LangContext';
import styles from './Exam.module.css';

/**
 * diagnostic / diagResult 是独立的两相，不塞进 exam。
 * 诊断是单向、无批改、逐题倒计时的另一套规则，挂进 exam 相就得在
 * 已经稳定的运行时里到处加分支；分开之后 practice / mock 一行没动，
 * 全局键盘那句 `if (phase !== 'exam' || !q) return;` 也天然把诊断挡在外面。
 */
type Phase = 'setup' | 'loading' | 'exam' | 'result' | 'diagnostic' | 'diagResult';
/** setup 相内部的三个子视图；phase 仍是四相，exam 运行时完全不受影响 */
type StageView = 'deck' | 'zone' | 'progress';
type Mode = 'practice' | 'mock';
type Db = 'TMUA' | 'TMUA_MOCK' | 'MAT' | 'SMC' | 'ECAA' | 'AMC' | 'ALL';
/**
 * 本场是从复烤区哪一块开出来的；不是复烤区来的就是 null。
 * 成绩页的错题闭环回执（B3）和复烤区顶部的操作回执（B5）都只认这一个标记。
 *
 * 刻意**不进** SessionRecord、不进 XLSX 线格式：它是「当场的一句话」，
 * 不是持久数据。换台机器导入记录，谁也不需要知道去年某一场是从哪个按钮点进去的。
 */
type GrillOrigin = 'grill' | 'retry' | 'topic';

const UNLOCK_SEEN_KEY = 'mcq-test:hidden-unlock-seen:v1';
const ZONE_KEY = 'mcq-test:zone:v1';
/** deck 淡出与面板淡入交叠的窗口，和 Exam.module.css / Deck.module.css 的 280ms 对齐 */
const ZONE_SWAP_MS = 280;

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
  // 成绩页（内层，保持中文）直接读这张表；外层的选区/面板走 dbName() 取双语
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
  const { t } = useLang();
  /** 题库名里只有「混合」需要翻译，其余是考试专名 */
  const dbName = (d: Db) => (d === 'ALL' ? t.setup.mixed : DB_NAMES[d]);

  // ---- 题库索引（构建期生成，只含能自动判分的题）----
  const [index, setIndex] = useState<IndexEntry[] | null>(null);
  const [indexError, setIndexError] = useState('');

  useEffect(() => {
    fetchIndex()
      .then(setIndex)
      .catch((e) => setIndexError(e instanceof Error ? e.message : t.errors.indexLoad));
  }, []);

  const [records, setRecords] = useState<Records>(() => createEmptyRecords());
  const [recordMessage, setRecordMessage] = useState('');
  const [recordBusy, setRecordBusy] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);

  // ---- 堆叠卡片：setup 相的两个子态（选区 deck ↔ 展开的配置面板）----
  // phase 仍是四相；deck/panel 只是 setup 相内部的分支，exam 运行时完全不受影响。
  const [frontZone, setFrontZone] = useState<ZoneId>('classic');
  // deck = 选区一级页；zone = 展开的配置面板；progress = 成绩回顾面板。
  // 三者共用 .stage 的同一个 grid 格，只在 280ms 过渡窗口内和 deck 交叠。
  const [stageView, setStageView] = useState<StageView>('deck');
  const [deckLive, setDeckLive] = useState(true); // deck 是否还挂着（过渡窗口内与面板共存）
  const [deckFocus, setDeckFocus] = useState(false);
  const [deckHint, setDeckHint] = useState('');
  const pendingZoneRef = useRef<ZoneId | null>(null);
  const deckTimerRef = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  // 逻辑推理题开关。默认勾选；回读放 effect 里，
  // 静态导出的首帧按默认值预渲染，同步读 localStorage 会水合不匹配（同 lang / zone）
  const [includeLogic, setIncludeLogic] = useState(true);

  useEffect(() => {
    setIncludeLogic(loadIncludeLogicReasoning());
  }, []);

  /** 落盘写在 setter 里而不是 effect 里，免得上面那次回读被首帧的默认值盖掉 */
  const chooseLogicReasoning = (next: boolean) => {
    setIncludeLogic(next);
    saveIncludeLogicReasoning(next);
  };

  // 这三个数都读整份索引，与开关无关：365 解锁算的是「做过的题」，
  // 关掉逻辑题只是抽不到新的，已经做过的不该被追认作废
  const completedCount = index ? validCompletedCount(index, records) : 0;
  const unlockProgress = index ? hiddenUnlockProgress(index, records) : 0;
  const hiddenUnlocked = index ? isHiddenModeUnlocked(index, records) : false;
  // 题库范围不再是独立 state：前位卡就是唯一真源
  const libraryMode: LibraryMode = frontZone === 'trivial' && hiddenUnlocked ? 'hidden' : 'classic';
  // 抽题池分两层收窄：先按题库范围（classic / 9.0），再按逻辑推理开关。
  // 中间那层单独留个名字，因为覆盖率提示要读的正是「开关生效之前」的池子——
  // 提示说的是这个开关能做什么，不能自己跟着勾选状态变
  const scopedIndex = indexForLibraryMode(index || [], hiddenUnlocked ? libraryMode : 'classic');
  const activeIndex = indexForLogicReasoning(scopedIndex, includeLogic);

  /** 转牌并落盘。写在 setter 里而不是 effect 里，免得首帧把回读结果覆盖掉 */
  const chooseZone = useCallback((id: ZoneId) => {
    setFrontZone(id);
    try {
      localStorage.setItem(ZONE_KEY, id);
    } catch {}
  }, []);

  // 回读上次的选区。三个区现在都开放了，都接受；
  // 'trivial' 要等索引到位才知道解不解得开（锁着也进得去，只是给 Diagnostic 介绍页），
  // 所以先挂起、下一个 effect 再定。
  useEffect(() => {
    try {
      const saved = localStorage.getItem(ZONE_KEY);
      if (saved === 'trivial' || saved === 'classic' || saved === 'grill') {
        pendingZoneRef.current = saved;
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!index || !pendingZoneRef.current) return;
    const want = pendingZoneRef.current;
    pendingZoneRef.current = null;
    setFrontZone(want === 'trivial' && !hiddenUnlocked ? 'classic' : want);
  }, [index, hiddenUnlocked]);

  useEffect(() => {
    if (!hiddenUnlocked) return;

    // 进度满了就直接把 9.0 转到前位：解锁本身就是结果，不该再要用户手点一下。
    // 只在「第一次」解锁时抢方向盘，之后一律尊重用户存下来的选区。
    let firstTime = false;
    try {
      firstTime = !localStorage.getItem(UNLOCK_SEEN_KEY);
      if (firstTime) localStorage.setItem(UNLOCK_SEEN_KEY, '1');
    } catch {
      firstTime = true;
    }
    if (!firstTime) return;

    pendingZoneRef.current = null;
    chooseZone('trivial');
    setShowUnlock(true); // 自动收起由 UnlockOverlay 自己管，好带上淡出动画
  }, [hiddenUnlocked, chooseZone]);

  useEffect(() => {
    return () => {
      if (deckTimerRef.current) window.clearTimeout(deckTimerRef.current);
    };
  }, []);

  const reducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * 为什么这张卡展不开；返回空串表示可以展开。
   * 9.0 锁定态不再算「展不开」：展开动作变成 Diagnostic Test 的介绍页，
   * 那正是它的第二条解锁路（见 Design §3）。
   */
  const zoneBlockReason = (id: ZoneId): string => {
    const zone = zoneById(id);
    if (zone.comingSoon) return t.block.comingSoon(t.zone.title[id]);
    return '';
  };

  /** 离开 deck 去某个覆盖视图：deck 淡出，280ms 后卸载 */
  const leaveDeckFor = (view: Exclude<StageView, 'deck'>) => {
    setDeckHint('');
    setError(''); // 上一个视图留下的抽题错误不带过去
    setDeckFocus(false);
    setStageView(view);
    if (deckTimerRef.current) window.clearTimeout(deckTimerRef.current);
    deckTimerRef.current = window.setTimeout(
      () => setDeckLive(false),
      reducedMotion() ? 0 : ZONE_SWAP_MS,
    );
  };

  const openZone = (id: ZoneId) => {
    const blocked = zoneBlockReason(id);
    if (blocked) {
      setDeckHint(blocked);
      return;
    }
    leaveDeckFor('zone');
  };

  const backToDeck = () => {
    if (deckTimerRef.current) window.clearTimeout(deckTimerRef.current);
    setDeckLive(true);
    setStageView('deck');
    setError('');
    setDeckFocus(true);
  };

  /**
   * 转牌。展不开的区只挪前位、不落盘——存进去也只会在下次回读时被判非法，
   * localStorage 里不该留一个永远走不通的值。
   */
  const turnToZone = (id: ZoneId) => {
    setDeckHint('');
    if (zoneBlockReason(id)) setFrontZone(id);
    else chooseZone(id);
  };

  /** 顶部小页签换区：换到展不开的区就退回 deck，并说明原因 */
  const selectZoneFromTab = (id: ZoneId) => {
    // 页签切区不清残留报错的话，复烤区抽题失败的红字会跟到经典区的 errMsg 里
    setError('');
    const blocked = zoneBlockReason(id);
    if (!blocked) {
      chooseZone(id);
      return;
    }
    setFrontZone(id);
    backToDeck();
    setDeckHint(blocked);
  };

  useEffect(() => {
    if (stageView !== 'deck') panelRef.current?.focus();
  }, [stageView]);

  // 卡面徽章要的是各区自己的题量，跟当前前位无关，所以两边都单独算一次。
  // 互斥之后 expandedCount 报的是扩展池本身的题数（不再是「经典 + 扩展」的全集）——
  // 9.0 卡上写 583 题，进去抽到的就是这 583 道，徽章与池子终于是同一件事。
  // 也刻意不过逻辑推理开关：徽章报的是「这个区有多少题」，
  // 跟着一个抽题偏好上下跳会让人以为题库缩水了
  const classicCount = index ? indexForLibraryMode(index, 'classic').length : 0;
  const expandedCount = index ? indexForLibraryMode(index, 'hidden').length : 0;

  // 复盘视图能摸到的范围：经典卷 ∪（解锁后的）扩展卷。
  // 「练这类题」的池子和卷面进度墙的分母都读它——两者都是跨区的复盘口径，
  // 不该跟着 classic / 9.0 互斥一起收窄（站在 9.0 卡前面打开复盘，
  // 做过的 TMUA 真题不该凭空消失）。但它同样不是绕过 9.0 门槛的后门。
  //
  // 刻意不过逻辑推理开关（P5 裁决，Design §13）：「练这类题」也是随机抽、
  // 也会发新题，和开关管的范围确实重叠——但按钮上写着知识点的名字，
  // 点「练 Logic and Proof」却因为一个别处的开关抽不到逻辑题，
  // 比「开关没拦住」更让人糊涂。显式点名胜过口味开关。
  //
  // useMemo 不是装饰：GrillPanel 里 12 个知识点 × 全量索引的求交、
  // ProgressPanel 里 107 套卷的 qid 求交，都挂在这个引用上
  const reachable = useMemo(
    () => (index ? reachableIndex(index, hiddenUnlocked) : []),
    [index, hiddenUnlocked],
  );

  // 两套计数各有各的问题要回答：
  //   poolCounts 走 activeIndex（题库范围 + 逻辑开关），是按钮上那个「N 题」；
  //   zoneCounts 只走题库范围，回答「这个区里有没有这个库」。
  // 分开是因为开关清空某个库时该置灰、不该让按钮整个消失——
  // 消失了用户就找不到「勾回来能救它」这条路
  const poolCounts: Record<string, number> = { TMUA: 0, TMUA_MOCK: 0, MAT: 0, SMC: 0, ECAA: 0, AMC: 0 };
  for (const e of activeIndex) {
    if (poolCounts[e.db] !== undefined) poolCounts[e.db]++;
  }
  const zoneCounts: Record<string, number> = { TMUA: 0, TMUA_MOCK: 0, MAT: 0, SMC: 0, ECAA: 0, AMC: 0 };
  for (const e of scopedIndex) {
    if (zoneCounts[e.db] !== undefined) zoneCounts[e.db]++;
  }

  /**
   * 这个区的题库按钮。互斥之后两区的库集合不再是包含关系：classic 有
   * TMUA/MAT/SMC/ECAA，9.0 只有 TMUA_MOCK/MAT。在 9.0 面板上摆一排
   * 「TMUA 0 题」的灰按钮既难看又误导——一个库在这个区没题就不列出来。
   */
  const bankChoices: Db[] = [...EXAM_DATABASES.filter((d) => zoneCounts[d] > 0), 'ALL'];

  // ---- 设置 ----
  const [phase, setPhase] = useState<Phase>('setup');
  const [db, setDb] = useState<Db>('TMUA');
  const [mode, setMode] = useState<Mode>('practice');
  const [pickMode, setPickMode] = useState<PickMode>('random');
  const [count, setCount] = useState(10);
  const [minutes, setMinutes] = useState(defaultMinutes(10));
  const [minutesTouched, setMinutesTouched] = useState(false);
  const [error, setError] = useState('');

  /**
   * 记住的题库若在当前区里一道题都没有，退到这个区第一个有题的库。
   *
   * 互斥之前只有一个方向会落空（classic 记着 TMUA_MOCK），现在两个方向都会：
   * 在 9.0 里选了 MAT、转回 classic 要退回 TMUA；在 classic 里选了 SMC、
   * 转进 9.0 也得退（9.0 没有 SMC）。不退的话卡面「快速开始」的摘要会写着
   * 一个抽不出题的库，按下去只得到一句「没有可用题目」。
   *
   * zoneCounts 由 index + libraryMode 完全决定，所以这三个就是全部依赖。
   */
  useEffect(() => {
    if (!index || db === 'ALL' || zoneCounts[db] > 0) return;
    const fallback = EXAM_DATABASES.find((d) => zoneCounts[d] > 0);
    setDb(fallback ?? 'ALL');
    // zoneCounts 每次渲染都是新对象，写进依赖数组等于「每次都跑」；
    // 它的取值完全由 index + libraryMode 决定，列这三个就是完整依赖
  }, [index, db, libraryMode]);

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
  /** 本场开考那一刻的 records 快照，成绩页逐题历史与完卷横幅都只读它 */
  const historyAtStartRef = useRef<Records | null>(null);
  /** 见 GrillOrigin：本场从复烤区哪一块开出来的，只活在当场 */
  const sessionOriginRef = useRef<GrillOrigin | null>(null);
  /**
   * 复烤区顶部的一次性回执（B5）。挂 state 不落盘：下次进面板还在，
   * 开新场（start 里清）或刷新（state 天然归零）就消失。
   */
  const [grillReceipt, setGrillReceipt] = useState<{
    origin: GrillOrigin;
    n: number;
    right: number;
  } | null>(null);
  // 主题只在 exam 阶段渲染(无 SSR 标记),惰性初始化读 dataset 不会造成水合不匹配
  const [scheme, setScheme] = useState(() =>
    typeof document === 'undefined' ? 'light' : document.documentElement.dataset.theme || 'light'
  );

  useEffect(() => {
    if (phase === 'exam' || phase === 'diagnostic') commandPet({ state: 'waiting', moveTo: 'grade' });
    else if (phase === 'result' || phase === 'diagResult') {
      commandPet({ state: 'review', moveTo: 'home' });
    } else if (phase === 'setup') commandPet({ state: 'idle', moveTo: 'home' });
  }, [phase]);

  // ---- 完卷横幅的数据（B2）----
  //
  // papers.json 只在走到成绩页时才取：deck 首屏和考试运行时都用不到它，
  // 没道理让每次冷启动替一条横幅买单（与进度面板的卷墙同一个思路，
  // 缓存也共用 lib/papers 的模块级那份，两处只会取一次）。
  // 取失败就一直是 null，横幅整块不渲染——绝不挡成绩页主体。
  const [papers, setPapers] = useState<PapersData | null>(() => cachedPapers());
  useEffect(() => {
    if (phase !== 'result' || papers) return;
    let alive = true;
    loadPapers()
      .then((data) => {
        if (alive) setPapers(data);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [phase, papers]);

  /**
   * 本场把哪几套卷做满了。
   *
   * 「之前」读的是开考快照（historyAtStartRef），不是 records —— records 要等
   * 用户在成绩页点了某个按钮才落盘，读它会让横幅在点击那一刻才冒出来。
   * 「之后」＝快照 + 本场作答过的题，判据与卷面进度墙共用（papersJustCompleted）。
   *
   * 范围仍走 reachable：够不着的卷压根不参与，锁定用户不会在横幅上
   * 看见扩展卷的卷名。papers 为 null（还在取 / 取失败）时返回空数组。
   */
  const finishedPapers = useMemo(() => {
    if (phase !== 'result' || !papers || !historyAtStartRef.current) return [];
    const answeredQids = new Set<number>();
    questions.forEach((question, i) => {
      if (answers[i] !== null) answeredQids.add(question.qid);
    });
    if (answeredQids.size === 0) return [];
    const reach = new Set(reachable.map((entry) => entry.qid));
    return papersJustCompleted(papers, reach, historyAtStartRef.current, answeredQids);
    // historyAtStartRef 是 ref，本身不进依赖；它只在 start() 里、也就是进 exam 相
    // 之前写一次，成绩页整段生命周期里都不会变
  }, [phase, papers, questions, answers, reachable]);

  const setCountAnd = (n: number) => {
    setCount(n);
    if (!minutesTouched) setMinutes(defaultMinutes(n));
  };

  const totalPool = index ? availableCountForMode(activeIndex, db, pickMode, records) : 0;
  // 读收窄之前的池子，见 scopedIndex 处的说明。logic 为 0 时整行都不渲染
  const logicCov = logicCoverage(scopedIndex, db);
  const recordOverview = overview(records);
  // deck 上那条统计条和进度面板里的数字必须同源，否则会出现
  // 「14 道当前错题」而榜上只列得出 12 条
  const practicePool = useMemo(() => practiceQids(index), [index]);
  const practiceStats = practiceOverview(records, practicePool);
  // 复烤区卡面的错题数必须与面板里那张榜同源：榜用的是「历史错过（w>0）」，
  // 而 wrongNow 是「最近一次做错」——错过后改对的题仍在榜上，卡面却报 0，
  // 两处会当面打臉
  const grillMissedCount = useMemo(
    () =>
      wrongRanking(records, Number.POSITIVE_INFINITY).filter((row) => practicePool.has(row.qid))
        .length,
    [records, practicePool],
  );

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
      setRecordMessage(t.records.exported(recordOverview.seen));
    } catch (e) {
      setRecordMessage(e instanceof Error ? e.message : t.records.exportFailed);
    } finally {
      setRecordBusy(false);
    }
  };

  const importWorkbook = async (file: File) => {
    // 导入会把场次历史清空（importRecordsWorkbook 一律返回 s: []），
    // 而趋势图正是靠它画的——必须在确认框里先说清楚
    const confirmText = `${t.records.importConfirm}\n${t.records.importConfirmSessions}`;
    if ((recordOverview.seen > 0 || records.s.length > 0) && !window.confirm(confirmText)) return;
    setRecordBusy(true);
    setRecordMessage('');
    try {
      if (!index) throw new Error(t.records.indexNotReady);
      const imported = await importRecordsWorkbook(file, new Set(index.map((entry) => entry.qid)));
      // 记录文件现在带得动诊断战绩了（Diagnostic 表），但老文件没有。
      // 一律与本机合并：并集 / OR / max，只会往前不会倒退——
      // 换台机器导入既不该弄丢已有的解锁，也不该盖掉文件里带来的
      const merged = mergeDiagnostic(records, imported);
      saveRecords(merged);
      setRecords(merged);
      setRecordMessage(t.records.imported(overview(imported).seen));
    } catch (e) {
      setRecordMessage(e instanceof Error ? e.message : t.records.importFailed);
    } finally {
      setRecordBusy(false);
    }
  };

  const removeRecords = () => {
    // 清空只清练习记录；9.0 解锁与 Grill 绑定留着，确认框里也说清楚
    const confirmText = `${t.records.clearConfirm}\n${t.records.clearKeepsUnlock}`;
    if (recordOverview.seen > 0 && !window.confirm(confirmText)) return;
    setRecords(clearRecords(records));
    setRecordMessage(t.records.cleared);
  };

  // ---- 开始考试 ----
  /**
   * override 是给「重练错题」用的：setState 要到下一次渲染才生效，
   * 先 setDb 再 start() 会读到旧闭包里的值，所以本次抽题的参数直接传进来，
   * 同时也把它们写回 state，好让配置面板显示的就是刚才用的那套。
   *
   * 带 qids 时跳过抽题，直接考这几道——错题榜上列的是哪几行，重练的就是哪几道，
   * 不再由 pickQidsForMode 掺新题。池子仍显式排除 diag：调用方已经滤过一遍，
   * 这里是第二道闸，诊断题不该有任何路径进入普通考试。
   */
  const start = async (override?: {
    db?: Db;
    pickMode?: PickMode;
    count?: number;
    qids?: number[];
    /** 只有 Grill 用：它的池子本来就是诊断题 */
    allowDiag?: boolean;
    /** 本场从复烤区哪一块开出来的；不传＝不是复烤区来的（见 GrillOrigin） */
    origin?: GrillOrigin;
  }) => {
    if (!index) return;
    const useDb = override?.db ?? db;
    const usePick = override?.pickMode ?? pickMode;
    const useCount = override?.count ?? count;
    if (override?.db) setDb(override.db);
    if (override?.pickMode) setPickMode(override.pickMode);
    if (override?.count) setCountAnd(override.count);
    // 来源标记与上一场的回执都在这唯一的开考入口收拢，不摊到各个调用点：
    // 日后再多一条开考路径，忘了清理就会把别人的回执挂在自己头上
    sessionOriginRef.current = override?.origin ?? null;
    setGrillReceipt(null);
    setError('');
    setPhase('loading');
    // 全屏须在用户手势同步调用链里发起(失败静默降级)
    document.documentElement.requestFullscreen?.().catch(() => {});
    try {
      const qids = override?.qids ?? pickQidsForMode(activeIndex, useDb, useCount, usePick, records);
      if (qids.length === 0) throw new Error(t.errors.emptySelection);
      const selected = new Set(qids);
      // 显式指定 qid 时按整份索引取：错题可能落在当前题库范围之外。
      // diag 默认仍然排除（错题重练那条路不该混进诊断题），只有 Grill 例外——
      // 复烤区的池子本来就是诊断题，事后把它们烤明白正是这个区的分工。
      const pool = override?.qids
        ? index.filter(
            (entry) => (override.allowDiag || !entry.diag) && selected.has(entry.qid),
          )
        : activeIndex.filter((entry) => selected.has(entry.qid));
      if (pool.length === 0) throw new Error(t.errors.emptySelection);
      const qs = await buildExam(pool, 'ALL', pool.length);
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
      // 成绩页逐题卡上的「做过 N 次」要的是本场之前的历史。
      // 不能在渲染时读 records：saveExportAndExit 会先同步写入本场、再 await 导出，
      // 那段 await 里成绩页带着新数据重渲染，数字会当着用户面跳一下。
      historyAtStartRef.current = records;
      setPhase('exam');
    } catch (e) {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      const message = e instanceof Error ? e.message : t.errors.pickFailed;
      setError(message);
      // 从 deck 快速开始时面板没挂载，errMsg 没人渲染；提示行是这条路径唯一的出口
      setDeckHint(message);
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

  /**
   * 离开成绩页时给复烤区留一条回执（B5）。
   *
   * 写在这里而不是 finish()：finish 是 useCallback([])，把 questions / answers
   * 塞进它的依赖会让计时器那个 effect 每次渲染都重挂一次 setInterval——
   * 为一条回执动考试运行时的计时器不值得。离开成绩页时 questions / answers
   * 都还在（是 leaveResult 自己把它们清空的），现算一遍就够。
   */
  const stashGrillReceipt = () => {
    const origin = sessionOriginRef.current;
    if (!origin) return;
    const right = questions.filter((question, i) => sameLabel(answers[i], question.answer)).length;
    setGrillReceipt({ origin, n: questions.length, right });
    // 离开成绩页即清来源标记：别让不变量靠「只有 start() 能进成绩页」这条外部事实兑着
  sessionOriginRef.current = null;
};

  const leaveResult = (message: string) => {
    stashGrillReceipt();
    setRecordMessage(message);
    setQuestions([]);
    setPhase('setup');
  };

  /**
   * 成绩页 → 进度面板。先落盘再走：点「查看进度」却把刚考完的这场丢了，
   * 是没人想要的结果；saveCurrentResult 幂等，之后再点「统计后再来一次」不会重复计入。
   * deckLive 直接置 false，免得中途闪一下选区。
   */
  const openProgressFromResult = () => {
    saveCurrentResult();
    stashGrillReceipt();
    setRecordMessage(t.records.sessionSaved);
    setQuestions([]);
    if (deckTimerRef.current) window.clearTimeout(deckTimerRef.current);
    setDeckLive(false);
    setStageView('progress');
    setPhase('setup');
  };

  // ---- Diagnostic Test ----
  const [diagPapers, setDiagPapers] = useState<ExamQuestion[][]>([]);
  const [diagPassed, setDiagPassed] = useState(false);
  const [diagBound, setDiagBound] = useState(0);
  const [diagSets, setDiagSets] = useState<DiagnosticSets | null>(null);

  // 固定卷定义只在 9.0 还锁着（也就是真有可能要考）时才取，不占冷启动
  useEffect(() => {
    if (hiddenUnlocked || diagSets) return;
    let alive = true;
    fetchDiagnosticSets()
      .then((sets) => {
        if (alive) setDiagSets(sets);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [hiddenUnlocked, diagSets]);

  /** 介绍页的 Start。和 start() 一样必须是同步手势链，全屏才批准 */
  const startDiagnostic = async () => {
    // 机会闸的第二道：介绍页只是不渲染按钮（展示层），真正的拦截在这里。
    // 「仅两次机会」是本功能最重的规则，不能只押在一个三元表达式上。
    if (!index || !canAttempt(records.diag)) return;
    setError('');
    // 一场诊断也是「新的上一场」：不清的话，考完回到复烤区顶上还挂着更早那场的回执
    setGrillReceipt(null);
    setPhase('loading');
    document.documentElement.requestFullscreen?.().catch(() => {});
    try {
      const sets = diagSets || (await fetchDiagnosticSets());
      if (!diagSets) setDiagSets(sets);
      // 第 N 次机会固定用第 N 套卷，零随机；越界时 setIndexForAttempt 返回 -1，
      // 落到下面的 !chosen 硬失败，不会静默重发套二
      const chosen = sets.sets[setIndexForAttempt(records.diag)];
      if (!chosen || chosen.p1.length === 0 || chosen.p2.length === 0) {
        throw new Error(t.errors.emptySelection);
      }
      // 卷内顺序就是难度升序，必须原样取回，不能走会洗牌的 buildExam
      const [p1, p2] = await Promise.all([
        fetchQuestions(chosen.p1),
        fetchQuestions(chosen.p2),
      ]);
      setDiagPapers([p1, p2]);
      setPhase('diagnostic');
    } catch (e) {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      setError(e instanceof Error ? e.message : t.errors.pickFailed);
      setPhase('setup');
    }
  };

  /**
   * 诊断交卷。只落三件事：Grill 绑定集、attempts、passed。
   * q 和 s 一个都不写——写了对错就会经错题榜 / Sessions 导出表泄出去。
   */
  const finishDiagnostic = ({ right, qids }: { right: number; qids: number[] }) => {
    const passed = isPass(right, qids.length);
    const next = recordDiagnostic(records, qids, passed);
    saveRecords(next);
    setRecords(next);
    setDiagPassed(next.diag?.passed === true);
    setDiagBound(qids.length);
    setDiagPapers([]);
    setPhase('diagResult');
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  };

  const leaveDiagnostic = () => {
    setPhase('setup');
    setStageView('zone');
    setDeckLive(false);
  };

  /**
   * 放弃本次诊断。语义与「刷新页面」完全一致：一个字都不落盘——
   * attempts 不 +1、qid 不进 Grill、passed 不动。
   */
  const abandonDiagnostic = () => {
    setDiagPapers([]);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    leaveDiagnostic();
  };

  // ---- Grill（复烤区）----
  const [grillPickMode, setGrillPickMode] = useState<PickMode>('random');
  const [grillCountChoice, setGrillCountChoice] = useState(10);

  /**
   * 开一场复烤。池子是绑定集 ∩ 当前索引（悬空 qid 已在 grill.ts 里滤掉），
   * 挑完直接走 start({ qids }) —— 和「重练错题」同一条通道，考试引擎零改动。
   * mode 保持 practice：Grill 的分工就是给答案和解析。
   */
  const startGrill = () => {
    const qids = pickGrillQids(index, records, grillCountChoice, grillPickMode);
    if (qids.length === 0) {
      setError(t.errors.emptySelection);
      return;
    }
    // Grill 一律练习模式：这里的分工就是给批改与解析，Mock 的限时交卷没意义。
    // setMode 与下面的 setPhase('loading') 同批渲染，等 phase 变 'exam' 时早已生效
    setMode('practice');
    void start({ db: 'ALL', qids, allowDiag: true, origin: 'grill' });
  };

  /** 诊断成绩页 → 复烤区：把刚绑上的这批题直接摆到面前 */
  const goToGrillFromResult = () => {
    chooseZone('grill');
    leaveDiagnostic();
  };

  /**
   * 复烤区顶部那条回执的文案（B5）。在渲染时取字典而不是把成句存进 state，
   * 这样切语言时它会跟着翻——存成句子的话，切到英文还挂着上一句中文。
   */
  const grillReceiptText = (): string => {
    if (!grillReceipt) return '';
    const line =
      grillReceipt.origin === 'retry'
        ? t.grill.receiptRetry
        : grillReceipt.origin === 'topic'
          ? t.grill.receiptTopic
          : t.grill.receiptGrill;
    return line(grillReceipt.n, grillReceipt.right);
  };

  /** 空态里的指路：转到 9.0 卡并展开（锁着就是 Diagnostic 介绍页） */
  const goToDiagnostic = () => {
    chooseZone('trivial');
    setError('');
  };

  /**
   * 复烤区错题榜的「重练这些」：练的就是榜上渲染出来的那几行，不掺新题。
   * 传进来的 qid 已经过 practiceQids 滤掉 diag，start() 里还会再滤一次。
   * db 记成 ALL——错题跨库，写成某一个库的场次记录是错的。
   *
   * 不过 9.0 门禁（P5 已裁决维持，Design §13）：重练的是用户自己的错题历史，
   * 与 Grill 绑定集同理。
   */
  const retryMissed = (qids: number[]) => {
    // 显式落 practice，与邻居 startGrill / practiceTopic 同一套理由：复烤区的
    // 卡面写着「可批改可看解析」，上一场碰巧选过 Mock 就开出限时卷是违约
    setMode('practice');
    // origin: 'retry' 是成绩页那句「这批错题这次对了 M / N」的唯一开关（B3）——
    // 另外两条路不带这个标记，那句话就只在真的重练错题时才出现
    void start({ db: 'ALL', qids, origin: 'retry' });
  };

  /**
   * 复烤区知识点复盘的「练这类题」：面板已经按解锁状态划好池子、挑好题，
   * 这里只把它送进既有的 start({ qids }) 通道。db 同样记 ALL——一个知识点跨库。
   * 显式落 practice：复盘要的是批改与解析，Mock 的限时交卷在这儿没有意义
   * （和 startGrill 同一套理由）。
   */
  const practiceTopic = (qids: number[]) => {
    if (qids.length === 0) {
      setError(t.errors.emptySelection);
      return;
    }
    setMode('practice');
    void start({ db: 'ALL', qids, origin: 'topic' });
  };

  const saveAndRetry = () => {
    saveCurrentResult();
    leaveResult(t.records.sessionSaved);
  };

  const saveExportAndExit = async () => {
    setRecordBusy(true);
    setResultActionError('');
    try {
      await downloadWorkbook(saveCurrentResult());
      leaveResult(t.records.sessionSavedExported);
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
        <div
          className={styles.stage}
          onKeyDown={(e) => {
            // Escape 从配置面板退回选区。工牌浮层开着时它先吃这一下，别抢。
            if (e.key !== 'Escape' || stageView === 'deck') return;
            const target = e.target as HTMLElement | null;
            // 焦点在题数输入框 / 配色下拉里时，Escape 归表单控件（撤销输入、收起下拉）
            if (target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return;
            if (document.querySelector('[aria-modal="true"]')) return;
            backToDeck();
          }}
        >
          <IdBadge />
          <LangToggle />
          {/* 公告只在 setup 相挂载：考试进行中不该有任何浮层打扰 */}
          <NoticeBoard />

          {deckLive && (
            <CardDeck
              front={frontZone}
              onFront={turnToZone}
              onOpen={openZone}
              badges={{
                classic: t.cardBadge.questions(classicCount),
                // 复烤区的池子是「绑定题 + 当前错题」，两者不相交（诊断题不进错题榜）。
                // 只报绑定数会让卡面写着「0 题」而副文写着「21 道错题」，自相矛盾
                grill: t.cardBadge.questions(grillCount(records) + grillMissedCount),
                trivial: hiddenUnlocked
                  ? t.cardBadge.expanded(expandedCount)
                  : t.cardBadge.charging,
                // 标化题库还没上内容，报的是「即将开放」而不是题数——
                // 一个 0 会被读成「这个库空了」，而它是还没开门
                board: t.cardBadge.comingSoon,
              }}
              // board 刻意不锁：它没有门槛，只是内容没到（Design §17-C）。
              // 锁定态在卡面是另一套读法（充能中 / 去考 Diagnostic），别混用
              locked={{ classic: false, grill: false, trivial: !hiddenUnlocked, board: false }}
              // Grill 卡面副文：复烤区现在管两批题（诊断绑定 + 全站错题），
              // 只报绑定数会让「一次诊断没考过、但有一堆错题」的人以为这张卡是空的。
              // 两个数都为 0 时才说定位，其余情况直接报数
              subs={{
                grill:
                  grillCount(records) > 0 || grillMissedCount > 0
                    ? t.grill.sub(grillCount(records), grillMissedCount)
                    : t.grill.emptySub,
              }}
              charge={{
                unlocked: hiddenUnlocked,
                progress: unlockProgress,
                value: completedCount,
                max: HIDDEN_UNLOCK_COUNT,
              }}
              leaving={stageView !== 'deck'}
              autoFocus={deckFocus}
              hint={deckHint}
              quickStart={{
                label: phase === 'loading' ? t.setup.picking : t.setup.quickStart,
                summary: t.setup.quickSummary(
                  dbName(db),
                  mode === 'mock' ? t.setup.mockShort : t.setup.practice,
                  count,
                ),
                disabled: phase === 'loading' || !index || totalPool === 0,
                // 同一条 start 路径。不能包 setTimeout：
                // requestFullscreen 只在用户手势的同步调用链里才批准
                onStart: () => void start(),
              }}
              progress={{
                label:
                  practiceStats.seen > 0
                    ? t.progress.strip(practiceStats.seen, practiceStats.wrongNow)
                    : t.progress.stripEmpty,
                onOpen: () => leaveDeckFor('progress'),
              }}
            />
          )}

          {stageView === 'progress' && (
            <div className={styles.panelLayer} ref={panelRef} tabIndex={-1}>
              <ProgressPanel
                records={records}
                index={index}
                reachable={reachable}
                onBack={backToDeck}
                dbLabel={(d) => dbName(d as Db)}
                tools={{
                  busy: recordBusy,
                  message: recordMessage,
                  indexReady: !!index,
                  // 导出/清空的可用性按整档记录算：P2 之后会有「只有诊断记录」的
                  // 用户，用练习池口径会把他们的按钮错误地禁掉
                  recordCount: recordOverview.seen,
                  onFile: (file) => void importWorkbook(file),
                  onExport: exportCurrentRecords,
                  onClear: removeRecords,
                }}
              />
            </div>
          )}

          {stageView === 'zone' && (
        <div className={styles.panelLayer} ref={panelRef} tabIndex={-1}>
          <div className={styles.zoneTabs}>
            <button type="button" className={styles.zoneBack} onClick={backToDeck}>
              {t.setup.back}
            </button>
            {ZONES.map((zone) => (
              <button
                key={zone.id}
                type="button"
                className={`${styles.zoneTab} ${zone.id === frontZone ? styles.zoneTabOn : ''}`}
                onClick={() => selectZoneFromTab(zone.id)}
                aria-current={zone.id === frontZone ? 'true' : undefined}
              >
                <span className={styles.zoneTabNo}>{zone.no}</span>
                {t.zone.title[zone.id]}
              </button>
            ))}
          </div>

          {/* 9.0 还没解锁时，展开动作给的是 Diagnostic 介绍页而不是抽题配置 */}
          {frontZone === 'trivial' && !hiddenUnlocked ? (
            <>
              <DiagnosticIntro
                ready={!!diagSets && diagSets.sets.length > 0}
                diag={records.diag}
                busy={phase === 'loading' || !index}
                onStart={() => void startDiagnostic()}
                charge={{
                  progress: unlockProgress,
                  value: completedCount,
                  max: HIDDEN_UNLOCK_COUNT,
                }}
              />
              {error && <div className={styles.errMsg}>{error}</div>}
            </>
          ) : frontZone === 'grill' ? (
            /* 复烤区：诊断绑定集 + 全站错题榜 + 知识点复盘，三块都走既有的练习通道 */
            <GrillPanel
              index={index}
              records={records}
              topicScope={reachable}
              pickMode={grillPickMode}
              onPickMode={setGrillPickMode}
              count={grillCountChoice}
              onCount={setGrillCountChoice}
              busy={phase === 'loading' || !index}
              onStart={startGrill}
              onGoDiagnostic={goToDiagnostic}
              onRetry={retryMissed}
              onPractice={practiceTopic}
              dbLabel={(d) => dbName(d as Db)}
              // 复烤视图下 errMsg / deckHint 都没挂载，抽题失败必须有自己的出口
              error={error}
              // 上一场从这个区开出去的成绩回执（B5）。开新场就清，不落盘
              receipt={grillReceiptText()}
            />
          ) : (
        <div className={styles.setupCard}>
          <div className={styles.setupTitle}>{t.zone.title[frontZone]}</div>
          <div className={styles.setupSub}>{t.setup.sub}</div>

          <div className={styles.fieldLabel}>{t.setup.fieldBank}</div>
          <div className={styles.segRow}>
            {bankChoices.map((d) => (
              <button
                key={d}
                className={`${styles.segBtn} ${db === d ? styles.segActive : ''}`}
                onClick={() => setDb(d)}
                disabled={d !== 'ALL' && poolCounts[d] === 0}
              >
                {dbName(d)}
                <span className={styles.segHint}>
                  {d === 'ALL'
                    ? t.setup.questions(Object.values(poolCounts).reduce((a, b) => a + b, 0))
                    : t.setup.questions(poolCounts[d] || 0)}
                </span>
              </button>
            ))}
          </div>
          {/* 互斥之后同名库在两个区指的不是同一批题：9.0 的 TMUA 是回忆题、
              MAT 是老卷与回忆题——按钮上只有题数，而题数恰恰是用户最不会
              去做减法的东西，得把范围说破 */}
          {libraryMode === 'hidden' && (
            <p className={styles.zoneScopeNote}>{t.setup.trivialScopeNote}</p>
          )}

          {/* 逻辑推理开关属于「题库」这一组，所以不另起 fieldLabel。
              一道标注过的逻辑题都没有时整行不渲染——摆着也只是个按不动的开关。
              覆盖率披露已按用户裁定移除（2026-08-23）：那是维护者视角的打标
              进度报告，普通学生不需要读。抽题池的真实数字在题数档位里，
              空池时另有「勾回可再抽 N 道」的操作提示兑底 */}
          {logicCov.logic > 0 && (
            <div className={styles.segRow}>
              <label className={`${styles.checkLabel} ${includeLogic ? styles.segActive : ''}`}>
                <input
                  className={styles.checkBox}
                  type="checkbox"
                  checked={includeLogic}
                  onChange={(e) => chooseLogicReasoning(e.target.checked)}
                />
                {t.setup.logicReasoning}
              </label>
            </div>
          )}

          <div className={styles.fieldLabel}>{t.setup.fieldMode}</div>
          <div className={styles.segRow}>
            <button
              className={`${styles.segBtn} ${mode === 'practice' ? styles.segActive : ''}`}
              onClick={() => setMode('practice')}
            >
              {t.setup.practiceLabel}
              <span className={styles.segHint}>{t.setup.practiceHint}</span>
            </button>
            <button
              className={`${styles.segBtn} ${mode === 'mock' ? styles.segActive : ''}`}
              onClick={() => setMode('mock')}
            >
              {t.setup.mockLabel}
              <span className={styles.segHint}>{t.setup.mockHint}</span>
            </button>
          </div>

          <div className={styles.fieldLabel}>{t.setup.fieldPick}</div>
          <div className={styles.segRow}>
            <button
              className={`${styles.segBtn} ${pickMode === 'random' ? styles.segActive : ''}`}
              onClick={() => setPickMode('random')}
            >
              {t.setup.pickRandom}
              <span className={styles.segHint}>{t.setup.pickRandomHint}</span>
            </button>
            <button
              className={`${styles.segBtn} ${pickMode === 'wrong-and-new' ? styles.segActive : ''}`}
              onClick={() => setPickMode('wrong-and-new')}
            >
              {t.setup.pickWrongNew}
              <span className={styles.segHint}>{t.setup.pickWrongNewHint}</span>
            </button>
            <button
              className={`${styles.segBtn} ${pickMode === 'new-only' ? styles.segActive : ''}`}
              onClick={() => setPickMode('new-only')}
            >
              {t.setup.pickNewOnly}
              <span className={styles.segHint}>{t.setup.pickNewOnlyHint}</span>
            </button>
          </div>

          <div className={styles.fieldLabel}>{t.setup.fieldCount(totalPool)}</div>
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
              <div className={styles.fieldLabel}>{t.setup.fieldMinutes}</div>
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

          {/* 主操作收尾。做题记录整块已经搬进进度面板，配置面板只管「怎么考」 */}
          <button
            className={styles.startBtn}
            onClick={() => void start()}
            disabled={phase === 'loading' || !index || totalPool === 0}
          >
            {phase === 'loading'
              ? t.setup.picking
              : !index && !indexError
                ? t.setup.bankLoading
                : t.setup.start}
          </button>
          {error && <div className={styles.errMsg}>{error}</div>}
          {indexError && <div className={styles.errMsg}>{indexError}</div>}
          {index && totalPool === 0 && (
            <div className={styles.errMsg}>
              {t.setup.emptyBank}
              {/* 池子空掉时，若逻辑题正被开关挡在外面，直接说明勾回来能多出多少题——
                  开关就在同屏上方，但「没有可用题目」这句话本身不指向它 */}
              {!includeLogic && logicCov.logic > 0 && ` ${t.setup.emptyBankLogicHint(logicCov.logic)}`}
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
          )}
        </div>
          )}
        </div>
        {showUnlock && <UnlockOverlay onDismiss={() => setShowUnlock(false)} />}
      </div>
    );
  }

  // ================= Diagnostic Test =================
  if (phase === 'diagnostic') {
    return (
      <DiagnosticRunner
        papers={diagPapers}
        onFinish={finishDiagnostic}
        onAbandon={abandonDiagnostic}
      />
    );
  }

  if (phase === 'diagResult') {
    return (
      <DiagnosticResult
        passed={diagPassed}
        bound={diagBound}
        attemptsLeft={attemptsLeft(records.diag)}
        onBack={leaveDiagnostic}
        onGoGrill={goToGrillFromResult}
      />
    );
  }

  // ================= 成绩页 =================
  if (phase === 'result') {
    const right = questions.filter((qq, i) => sameLabel(answers[i], qq.answer)).length;
    const answered = answers.filter(Boolean).length;
    return (
      <div className={styles.wrap}>
        <div className={styles.resultWrap}>
          {/* 完卷横幅（B2）。只在本场真把某套卷从「未做满」推到「做满」时出现，
              一次性、不落盘——刷新成绩页就没了，这是明确接受的。
              papers.json 取不到时 finishedPapers 恒为空，整块不渲染，
              绝不挡住下面的成绩主体 */}
          {finishedPapers.length > 0 && (
            <div className={styles.finishBanner} role="status">
              <span className={styles.finishMark} aria-hidden="true" />
              <div className={styles.finishText}>
                <div className={styles.finishTitle}>
                  {finishedPapers.length === 1
                    ? '完卷 · 计入统计后这一套就做满'
                    : `完卷 · 计入统计后将做满 ${finishedPapers.length} 套卷`}
                </div>
                {/* 横幅算在落盘之前（完卷时刻的仪式感不能等按钮），
                    但用户若点「跳过本场统计」，这一场不写入记录、卷墙不会点亮——
                    这句小字把条件说破，横幅就不是断言既成事实的假话 */}
                <div className={styles.finishNote}>计入统计后，卷面进度墙上这一格就会点亮</div>
                <div className={styles.finishPapers}>
                  {finishedPapers.map((paper) => (
                    <span key={paper.key} className={styles.finishPaper}>
                      {paper.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className={styles.scoreCard}>
            <div className={styles.scoreBig}>
              {right} / {questions.length}
            </div>
            <div className={styles.scoreMeta}>
              {DB_NAMES[db]} · {mode === 'mock' ? 'Mock 限时' : '练习'}模式
              <br />
              已作答 {answered} 题 · 用时 {fmtClock(elapsed)}
              {/* 错题重练的闭环回执（B3）：只有从复烤区「重练这些」进来的场次才有
                  这一句。分母是本场题数，分子是本场做对的——它回答的是
                  「上次错的这批，这次救回来几道」 */}
              {sessionOriginRef.current === 'retry' && (
                <>
                  <br />
                  <span className={styles.retryReceipt}>
                    上次错的这 {questions.length} 道，这次对了 {right} 道
                  </span>
                </>
              )}
            </div>
            <div className={styles.scoreBtns}>
              <button
                className={styles.btnGhost}
                onClick={() => leaveResult(t.records.sessionSkipped)}
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
            {/* 进度面板属外层，名字跟着外层语言走；点它会先把本场计入统计 */}
            <button
              type="button"
              className={styles.progressLink}
              onClick={openProgressFromResult}
              disabled={recordBusy}
            >
              {t.progress.open} ›
            </button>
          </div>
          {resultActionError && <div className={styles.errMsg}>{resultActionError}</div>}

          {questions.map((qq, i) => {
            const ok = sameLabel(answers[i], qq.answer);
            // 本场之前的历史。读快照而不是 records：导出那条路径会先写入本场再 await，
            // 直接读 records 会让这行数字在导出转圈时跳一下
            const past = historyFor(historyAtStartRef.current, qq.qid);
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
                  <span className={styles.reviewHistory}>
                    {past ? `做过 ${past.a} 次 · 错过 ${past.w} 次` : '首次作答'}
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
            {/* 未揭示时压根不渲染真实内容——高斯模糊挡不住轮廓（「答案:C」的
                大字短行、图形题的图都能透出来），而且 blur 只是视觉滤镜，
                DOM 里仍是明文，划选/Ctrl+F/读屏都拿得到。骨架条是假的，随便看 */}
            {solShown.has(idx) && isGraded ? (
              <div>
                <p>
                  <strong>答案:{q.answer.toUpperCase()}</strong>
                </p>
                {q.solution && <MathText text={q.solution} />}
              </div>
            ) : (
              <div className={styles.solPlaceholder} aria-hidden="true">
                <span className={styles.solBar} style={{ width: '34%' }} />
                <span className={styles.solBar} style={{ width: '92%' }} />
                <span className={styles.solBar} style={{ width: '85%' }} />
                <span className={styles.solBar} style={{ width: '63%' }} />
              </div>
            )}
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
