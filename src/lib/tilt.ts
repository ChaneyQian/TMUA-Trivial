// 卡片随指针倾斜的换算：指针落在元素上的位置 → 两个轴的倾角 + 高光圆心。
//
// 纯函数，不碰 DOM、不碰 React，好直接用 node --test 测。挂监听、rAF 节流、
// 写 CSS 变量这些副作用在 components/fx/useCardTilt.ts；前牌（CardDeck）与
// 工牌（P8-B）共用这一套，两处手感才一致。

/** 默认最大倾角（度）。±6° 已经读得出「牌被托起来了」，再大就像要翻牌 */
export const TILT_MAX_DEG = 6;

/** getBoundingClientRect() 的子集：只用得到这四个数 */
export interface TiltRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface TiltPose {
  /** rotateX（度）。正值 = 下缘朝观者抬起 */
  rx: number;
  /** rotateY（度）。负值 = 右缘朝观者抬起 */
  ry: number;
  /** 高光圆心：占元素宽的百分比，0–100 */
  gx: number;
  /** 高光圆心：占元素高的百分比，0–100 */
  gy: number;
}

/** 夹到 0–1；NaN / ±Infinity 一律当正中（不倾斜），不把坏值写进样式 */
function unit(n: number): number {
  if (!Number.isFinite(n)) return 0.5;
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/**
 * 指针的视口坐标 + 元素的包围盒 → 倾角与高光圆心。
 *
 * - 正中不倾斜；四边中点各把一个轴推到 ±maxDeg；四角两个轴同时 ±maxDeg
 * - 指针所在的那一侧朝观者抬起：透视下抬起的一侧变大，指针始终落在卡面上，
 *   高光也正好落在「迎光」的那一侧
 * - 越界（指针在盒子外一点点、盒子正在补间）一律夹紧，永远不超过 ±maxDeg；
 *   盒子没有尺寸（未布局 / display: none）时返回静止姿态
 */
export function tiltPose(
  clientX: number,
  clientY: number,
  rect: TiltRect,
  maxDeg: number = TILT_MAX_DEG,
): TiltPose {
  const max = Number.isFinite(maxDeg) ? Math.abs(maxDeg) : TILT_MAX_DEG;
  if (!(rect.width > 0) || !(rect.height > 0)) return { rx: 0, ry: 0, gx: 50, gy: 50 };
  const nx = unit((clientX - rect.left) / rect.width);
  const ny = unit((clientY - rect.top) / rect.height);
  // + 0 把 -0 规整成 0：正中心就是不倾斜，不留一个带符号的零
  return {
    rx: (ny - 0.5) * 2 * max + 0,
    ry: (0.5 - nx) * 2 * max + 0,
    gx: nx * 100,
    gy: ny * 100,
  };
}
