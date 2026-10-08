// 堆叠卡片的五个功能区。这里是唯一的数据源：封面、
// 展开后开哪套配置、以及解锁走哪条路，全部由这张表驱动，
// CardDeck 里不写任何「如果是某张卡就……」的分支。
//
// 卡面文案（标题/副文）是双语的，按 id 存在 lib/i18n.ts 的 zone.title / zone.sub 里，
// 组件用 t.zone.title[zone.id] 取；这张表只留与语言无关的结构。
//
// P2/P3 接入点：
//   - Grill 开放时把 comingSoon 翻成 false、panel 改 'countOnly'
//   - 9.0 的 unlockPath 从 'progress' 改 'diagnostic'（Diagnostic Test 入口）
//
// P7-C1 接入点：
//   - board（标化题库）是分类看板的骨架卡，先摆位不接内容。C2 上看板阅读器时
//     把 comingSoon 翻成 false、panel 从 'none' 改成看板自己的那一档
//
// P10（2026-10-08）：
//   - sealed（05 密卷）限时开放 MAT / TMUA 2024–2025：开放窗口与密码在 lib/sealed.ts，
//     题池是 build-data 打了 sealed 的那批题。卡面态（即将开放 / 要密码 / 已解锁 / 已结束）由 ExamApp 按窗口与解锁算

export type ZoneId = 'classic' | 'grill' | 'trivial' | 'board' | 'sealed';

/** 展开后给哪套配置面板：全量 / 只开题数 / 不展开 */
export type ZonePanel = 'full' | 'countOnly' | 'none';

/** 解锁路径：免费 / 练习进度充能 / 通过 Diagnostic Test（P2）/ 开放窗口内输密码（05 密卷） */
export type ZoneUnlockPath = 'free' | 'progress' | 'diagnostic' | 'password';

export interface ZoneDef {
  id: ZoneId;
  /** 卡面编号 01–05 */
  no: string;
  /** public/cards/ 下的文件名；缺图时卡片露出 grad 兜底，不需要任何 JS */
  cover: string;
  /** CSS 渐变占位，垫在封面 <img> 底下 */
  grad: string;
  /**
   * 区色：设置页环境光的主光斑、前牌的彩色投影、光标聚光的网格线都取它。
   * 从 grad 的主色相里挑出来的一个饱和色，主题（深浅 / 护眼）只调强弱，不换色相
   */
  tint: string;
  /** 副光斑的第二色相（9.0 是「深空青 + 靛」两色，其余区取同色系的浅一档） */
  tint2: string;
  panel: ZonePanel;
  unlockPath: ZoneUnlockPath;
  comingSoon: boolean;
  /** 卡面给不给「快速开始」。Grill 的池子是绑定集，跟外面那套配置不是一回事 */
  quickStart: boolean;
}

export const ZONES: ZoneDef[] = [
  {
    id: 'classic',
    no: '01',
    cover: 'classic.jpg',
    grad:
      'radial-gradient(120% 92% at 18% 10%, #f2f5ff 0%, #dde5ff 46%, #b8c8f6 100%)',
    tint: '#4a6cf7',
    tint2: '#8fa4ff',
    panel: 'full',
    unlockPath: 'free',
    comingSoon: false,
    quickStart: true,
  },
  {
    id: 'grill',
    no: '02',
    cover: 'grill.jpg',
    grad:
      'radial-gradient(120% 100% at 50% 116%, #ffc46b 0%, #f2762e 38%, #6f2a12 100%)',
    tint: '#f2762e',
    tint2: '#ffb54d',
    panel: 'countOnly',
    unlockPath: 'free',
    comingSoon: false,
    quickStart: false,
  },
  {
    id: 'trivial',
    no: '03',
    cover: 'trivial.jpg',
    grad:
      'radial-gradient(130% 100% at 74% 18%, #33459c 0%, #1a2354 46%, #0a0f28 100%)',
    // 封面是深空底，区色取 9.0 充电条满格的那道青（#00c8c2），副色取封面的靛
    tint: '#00c8c2',
    tint2: '#4054c4',
    panel: 'full',
    unlockPath: 'progress',
    comingSoon: false,
    quickStart: true,
  },
  {
    // 标化题库（P7-C1 骨架）。定位是阅读器不是考场：无作答无判分无计时，
    // 所以 panel 是 'none'、quickStart 也是 false —— 「快速开始」在一张
    // 不发卷的卡上没有意义。unlockPath 留 'free'：这个区从来不设门槛，
    // comingSoon 只表示内容还没进来，不是锁着（见 Design §17-C）。
    // 封面渐变走鼠尾草绿，与经典的蓝、复烤的橙、9.0 的深青各占一个色相
    id: 'board',
    no: '04',
    cover: 'board.jpg',
    grad:
      'radial-gradient(120% 96% at 30% 14%, #eef4ee 0%, #b8cfba 44%, #5a8a6a 100%)',
    tint: '#5a8a6a',
    tint2: '#9cc4a3',
    panel: 'none',
    unlockPath: 'free',
    comingSoon: true,
    quickStart: false,
  },
  {
    // 05 密卷（P10，用户 2026-10-08）：限时开放的 MAT / TMUA 2024–2025。
    // 区色酒红封蜡、副色金（环境光、前牌投影、页签都取它）。不是 comingSoon：开没开、
    // 解没解锁是运行时的事（窗口 + 密码，lib/sealed.ts），由 ExamApp 递进 locked / closed。
    // 封面图出来之前是这条 CSS 渐变：酒红底、极淡的坐标纸网格、一枚金色封蜡印；
    // 图放到 public/cards/sealed.jpg 即替换（出图提示词见 Design 文档 §23），零代码。
    // 渐变分四层（上层先画）：封蜡印的金面与压纹圈 → 蜡印的落影 → 横竖两道网格 → 酒红底
    id: 'sealed',
    no: '05',
    cover: 'sealed.jpg',
    grad:
      'radial-gradient(circle at 70% 56%, #f6e2a8 0%, #d8b15a 6.2%, #f0d28a 7.3%, #b48530 8.4%, #c99b45 11.6%, #8c6420 13.2%, transparent 14%), ' +
      'radial-gradient(circle at 71.5% 59%, rgb(40 4 12 / 45%) 0%, rgb(40 4 12 / 45%) 13.5%, transparent 17%), ' +
      'repeating-linear-gradient(0deg, rgb(255 255 255 / 5%) 0 1px, transparent 1px 24px), ' +
      'repeating-linear-gradient(90deg, rgb(255 255 255 / 5%) 0 1px, transparent 1px 24px), ' +
      'radial-gradient(120% 100% at 28% 12%, #b23a55 0%, #8a1c35 48%, #3d0816 100%)',
    tint: '#8a1c35',
    tint2: '#c9a24a',
    panel: 'full',
    unlockPath: 'password',
    comingSoon: false,
    quickStart: true,
  },
];

export const ZONE_IDS: ZoneId[] = ZONES.map((zone) => zone.id);

export function zoneById(id: ZoneId): ZoneDef {
  return ZONES.find((zone) => zone.id === id) ?? ZONES[0];
}

/**
 * 环形位次：0=前牌，1=右后牌，末位=左后牌，中间的落到「更深的一层」。
 * 位次到槽位的映射见下面的 slotForOffset（按牌的张数算）；
 * 这个函数只管环上的相对距离，加卡不用改它。
 */
export function ringOffset(id: ZoneId, front: ZoneId): number {
  const total = ZONE_IDS.length;
  return (ZONE_IDS.indexOf(id) - ZONE_IDS.indexOf(front) + total) % total;
}

/** 卡组的槽位：前牌、右后牌、左后牌、第三层、第三层之后（与第三层同位、整张淡出） */
export type SlotName = 'front' | 'right' | 'left' | 'back' | 'deep';

/**
 * 位次 → 槽位：0 前牌、1 右后牌、末位左后牌、2 第三层（居中偏上、更小更暗）；
 * 五张牌起，第三层之后的位次落到 deep——与第三层同一个位置、整张淡出、不接指针。
 * 两张牌叠在第三层的同一处时谁露在上面只由 DOM 顺序定，转牌时那道露边会在层级翻面的
 * 中点瞬间换成另一张封面；只留一张看得见，换牌就成了交叉淡变（见 Deck.module.css 的 .slotDeep）。
 * 写成「末位即左后牌」而不是钉死数字：三张牌时末位是 2，四张是 3，五张是 4，加卡不用回来改
 */
export function slotForOffset(offset: number, total: number): SlotName {
  if (offset === 0) return 'front';
  if (offset === 1) return 'right';
  if (offset === total - 1) return 'left';
  return offset === 2 ? 'back' : 'deep';
}

/** 按方向转牌：dir=1 右旋（下一张上前），dir=-1 左旋 */
export function stepZone(front: ZoneId, dir: number): ZoneId {
  const total = ZONE_IDS.length;
  const next = (ZONE_IDS.indexOf(front) + dir + total) % total;
  return ZONE_IDS[next];
}
