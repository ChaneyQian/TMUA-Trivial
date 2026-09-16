// 本站往浏览器存储里写的每一个键，都登记在这里。
//
// 为什么要集中：站点发布在 GitHub Pages 的 <user>.github.io 下，同一个 origin
// 上还住着这个账号的其他项目——localStorage 是按 origin 共享的。裸键（早先的
// 'theme' 就是）随时可能和邻居撞上，读到别人写的值。前缀 + 版本号既圈出命名空间，
// 也给将来改结构留了 v2 的位置。
//
// 这个模块只登记名字，不碰读写语义：各处该怎么读怎么写维持原样。
//
// 注意：`mcq-test:pet-command` 不在这里——它是个 CustomEvent 的事件名，
// 从来没写进过存储，混进这张表只会让人以为它占了一格。

/** 做题记录（题级统计 + 场次日志 + 9.0 解锁 + Grill 绑定集） */
export const RECORDS_KEY = 'mcq-test:records:v1';

/** 界面语言 */
export const LANG_KEY = 'mcq-test:lang:v1';

/** 配色方案（light / dark / sepia） */
export const THEME_KEY = 'mcq-test:theme:v1';

/**
 * 旧的裸键。只用于一次性迁移：读到有值就搬进 THEME_KEY 并删掉它。
 * 迁移那段代码在 app/layout.tsx 的首屏内联脚本里——配色必须在首帧前定下来，
 * 那段脚本没法 import，键名在那里是字面量，靠测试钉住两边一致。
 */
export const LEGACY_THEME_KEY = 'theme';

/** 上次停在哪张卡（卡组的四个区） */
export const ZONE_KEY = 'mcq-test:zone:v1';

/** 9.0 解锁横幅是否已经放过一次 */
export const UNLOCK_SEEN_KEY = 'mcq-test:hidden-unlock-seen:v1';

/** 学生证是否已经亮过相 */
export const BADGE_SEEN_KEY = 'mcq-test:badge-seen:v1';

/** 公告牌上一次读到的是哪一则（存的是 NOTICE_ID，不是布尔） */
export const NOTICE_KEY = 'mcq-test:notice:v1';

/**
 * 逻辑推理题开关。三档（2026-09-16 起）：'all' / 'only' / 'exclude'，缺省即 'all'。
 * 两态时代存的是 '1' / '0'，读取端就地映射（'1' → all、'0' → exclude），
 * 所以这里不另开 v2：存量用户的选择要原样接上。
 */
export const LOGIC_REASONING_KEY = 'mcq-test:logic-reasoning:v1';

/** /admin 的登录态。**sessionStorage**，关标签页即失效——这道门只防误入 */
export const ADMIN_SESSION_KEY = 'mcq-test:admin:v1';
