// 堆叠卡片的四个功能区。这里是唯一的数据源：封面、
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

export type ZoneId = 'classic' | 'grill' | 'trivial' | 'board';

/** 展开后给哪套配置面板：全量 / 只开题数 / 不展开 */
export type ZonePanel = 'full' | 'countOnly' | 'none';

/** 解锁路径：免费 / 练习进度充能 / 通过 Diagnostic Test（P2） */
export type ZoneUnlockPath = 'free' | 'progress' | 'diagnostic';

export interface ZoneDef {
  id: ZoneId;
  /** 卡面编号 01–04 */
  no: string;
  /** public/cards/ 下的文件名；缺图时卡片露出 grad 兜底，不需要任何 JS */
  cover: string;
  /** CSS 渐变占位，垫在封面 <img> 底下 */
  grad: string;
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
    panel: 'none',
    unlockPath: 'free',
    comingSoon: true,
    quickStart: false,
  },
];

export const ZONE_IDS: ZoneId[] = ZONES.map((zone) => zone.id);

export function zoneById(id: ZoneId): ZoneDef {
  return ZONES.find((zone) => zone.id === id) ?? ZONES[0];
}

/**
 * 环形位次：0=前牌，1=右后牌，末位=左后牌，中间的落到「更深的一层」。
 * 位次到 CSS 槽位的映射写在 CardDeck 里，那里才知道有几张牌；
 * 这个函数只管环上的相对距离，加卡不用改它。
 */
export function ringOffset(id: ZoneId, front: ZoneId): number {
  const total = ZONE_IDS.length;
  return (ZONE_IDS.indexOf(id) - ZONE_IDS.indexOf(front) + total) % total;
}

/** 按方向转牌：dir=1 右旋（下一张上前），dir=-1 左旋 */
export function stepZone(front: ZoneId, dir: number): ZoneId {
  const total = ZONE_IDS.length;
  const next = (ZONE_IDS.indexOf(front) + dir + total) % total;
  return ZONE_IDS[next];
}
