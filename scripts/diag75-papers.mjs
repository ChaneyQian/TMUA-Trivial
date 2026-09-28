// 7.5+ Diagnostic 的组卷（构建期）。
//
// 纯函数：不读盘、不写盘、不看环境变量以外的任何东西。build-data.mjs 调它产出
// public\exam\diag.json，测试直接 import 它验证组卷规则。
//
// 规则（用户 2026-09-28 拍板，Design §21 / §22 P8-C）：
//   - 每场 10 题、单卷。第一次机会考卷一，第二次考卷二，两卷互不重题
//   - 卷一固定为指定的 10 道，按下面的顺序出题。缺任何一道（不在 index 里，
//     也就是判不了分）就构建失败，并报出是哪一道
//   - 卷二从已复核的 SMT 题（index 里 db 为 DIAG75 且 id 以 SMT- 开头）按章节分层、
//     确定性地取 10 道：章节轮转，章内按 qid 升序；与卷一不重题。
//     凑不满 10 道时卷二不出（null），前端显示「卷二准备中」
//   - 两卷里落在经典区（非 hidden、非 diag）的题打 reserved：移出所有练习抽题路径，
//     作答记录照常计入 365。9.0 Trivial 区的考题不动——还没解锁的人本来就见不到它们，
//     而能考这场的恰恰只有还没解锁的人

/** diag.json 的形状版本。v1 是 GMAT 两卷制（2026-09 下线），前端的形状闸一律拒收 */
export const DIAG75_VERSION = 2;
/** diag.json 里的考试名，前端形状闸也认它 */
export const DIAG75_EXAM = '7.5+';
/** 每卷题数 */
export const DIAG75_PAPER_SIZE = 10;

/**
 * 卷一：用户指定的 10 道（2026-09-18 转来的文章），出题顺序就是这个顺序。
 * label 只用来在构建失败时把「是哪道」说清楚，不进产物
 */
export const DIAG75_PAPER1_SPEC = Object.freeze([
  { qid: 20132101203120, label: 'TMUA Mock Yotta P1 Q20' },
  { qid: 20132101203117, label: 'TMUA Mock Yotta P1 Q17' },
  { qid: 20132101203115, label: 'TMUA Mock Yotta P1 Q15' },
  { qid: 20050300104, label: 'MAT 2005 Q1D' },
  { qid: 20040300103, label: 'MAT 2004 Q1C' },
  { qid: 20050300102, label: 'MAT 2005 Q1B' },
  { qid: 20180211900, label: 'TMUA 2018 P1 Q19' },
  { qid: 20132101203108, label: 'TMUA Mock Yotta P1 Q8' },
  { qid: 99000200100, label: '野题 Wild-Q01' },
  { qid: 20230300110, label: 'MAT 2023 Q1J' },
]);

export const DIAG75_PAPER1 = Object.freeze(DIAG75_PAPER1_SPEC.map((item) => item.qid));

const PAPER1_LABELS = new Map(DIAG75_PAPER1_SPEC.map((item) => [item.qid, item.label]));

/**
 * 卷一取哪份清单。环境变量 DIAG75_PAPER1 只给测试用（同 EXAM_OUT / BANK_PATH /
 * MIN_GRADEABLE）：
 *   未设置     → 生产用的那 10 道
 *   'off'      → 不出 7.5+ 的卷：合成题库里根本没有这 10 道题，那些测试测的也不是诊断
 *   '1,2,3,…'  → 用这份清单当卷一，给合成题库测组卷与校验
 * 返回 null 表示 'off'；认不出来的值直接抛错——配错了就该当场炸，不能悄悄退回默认
 */
export function paper1FromEnv(value) {
  if (value === undefined) return [...DIAG75_PAPER1];
  const text = String(value).trim();
  if (text.toLowerCase() === 'off') return null;
  const qids = text
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map(Number);
  if (qids.length === 0 || qids.some((qid) => !Number.isSafeInteger(qid) || qid <= 0)) {
    throw new Error(`DIAG75_PAPER1 认不出来：${JSON.stringify(value)}（应为 off 或逗号分隔的 qid）`);
  }
  return qids;
}

/** 构建日志里「是哪道」：认得的带上卷号，认不得的只报 qid */
function describe(qid, position) {
  const label = PAPER1_LABELS.get(qid);
  return `卷一第 ${position} 题 ${qid}${label ? `（${label}）` : ''}`;
}

/**
 * 卷一的问题清单；空数组就是通过。
 *
 * 「可判分」与「在 index 里」是同一件事：build-data 只把能自动判分的题写进 index，
 * 缺答案、选项解析不出、被损坏闸拦下、复核闸没过的题一律进不来。
 * 所以这里只查 has(qid)——index 是唯一的判据，不再另起一套「能不能判分」的规则。
 */
export function paper1Problems(qids, indexed) {
  const problems = [];
  if (qids.length !== DIAG75_PAPER_SIZE) {
    problems.push(`卷一应为 ${DIAG75_PAPER_SIZE} 道，实为 ${qids.length} 道`);
  }
  const seen = new Set();
  qids.forEach((qid, i) => {
    if (seen.has(qid)) problems.push(`${describe(qid, i + 1)}：重复出现`);
    seen.add(qid);
    if (!indexed.has(qid)) problems.push(`${describe(qid, i + 1)}：不在 index 里（缺题，或判不了分被跳过）`);
  });
  return problems;
}

/** 'SMT-Ch10-Q3' → 10；认不出章号返回 null */
export function smtChapter(id) {
  const m = /^SMT-Ch(\d+)-/.exec(String(id || ''));
  return m ? Number(m[1]) : null;
}

/**
 * 卷二：已复核的 SMT 题按章节分层、轮转取 size 道。
 *
 * 章节按章号升序；章内按 qid 升序；第一轮每章取第一道，第二轮每章取第二道……
 * 取满为止，出题顺序就是取题顺序（章节交替，前后几题不扎堆在同一章）。
 * 零随机：同一批候选，不管以什么顺序传进来，结果都一样。
 *
 * candidates 是 index 里 DIAG75 那批题的 { qid, id }；id 不以 SMT- 开头的
 * （野题等）不收；与卷一重复的先剔掉。凑不满 size 道返回 null——卷二不出，
 * 前端据此显示「卷二准备中」，而不是拿一套残卷去消耗一次机会。
 * 认不出章号的 SMT 题归进排在最后的一层，不静默丢掉
 */
export function selectPaper2(candidates, exclude = new Set(), size = DIAG75_PAPER_SIZE) {
  const byChapter = new Map();
  for (const { qid, id } of candidates) {
    if (!String(id || '').startsWith('SMT-') || exclude.has(qid)) continue;
    const chapter = smtChapter(id) ?? Number.POSITIVE_INFINITY;
    if (!byChapter.has(chapter)) byChapter.set(chapter, new Set());
    byChapter.get(chapter).add(qid);
  }
  const strata = [...byChapter.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, qids]) => [...qids].sort((a, b) => a - b));
  const total = strata.reduce((n, stratum) => n + stratum.length, 0);
  if (total < size) return null;

  const picked = [];
  for (let round = 0; picked.length < size; round++) {
    for (const stratum of strata) {
      if (round < stratum.length) picked.push(stratum[round]);
      if (picked.length === size) break;
    }
  }
  return picked;
}

/**
 * 两卷里落在经典区的题：要移出练习抽题池的那几道（reserved）。
 *
 * 判据写成结构而不是写死两个 qid：「经典区」＝ 非 hidden、非 diag。今天正好是
 * TMUA 2018 P1 Q19 与 MAT 2023 Q1J（测试钉住）；哪天卷一换题，规则自己跟上。
 * 9.0 Trivial 区（hidden）的考题不收：没解锁的人见不到它们，而能考的只有没解锁的人
 */
export function reservedQids(papers, indexByQid) {
  const out = new Set();
  for (const qids of papers) {
    for (const qid of qids || []) {
      const entry = indexByQid.get(qid);
      if (entry && !entry.hidden && !entry.diag) out.add(qid);
    }
  }
  return [...out].sort((a, b) => a - b);
}

/** diag.json 的内容。卷二可以是 null（准备中），卷一永远是满的数组 */
export function diagnosticPapersJson(p1, p2) {
  return {
    v: DIAG75_VERSION,
    exam: DIAG75_EXAM,
    papers: [
      { id: 'p1', qids: [...p1] },
      { id: 'p2', qids: p2 ? [...p2] : null },
    ],
  };
}
