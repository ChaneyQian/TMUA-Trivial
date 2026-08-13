# 设计计划 — 堆叠卡片架构与功能分流

> 依据 `Plan MCQ test.md` 拟定。状态：**已确认，按此执行**。
>
> 四项决定（2026-08-09）：
> 1. Grill 给答案与解析，正常练习——诊断时不给、事后在 Grill 烤明白，两区分工
> 2. 解锁两条路并存：365 题 **或** Diagnostic Pass 任一达成
> 3. P1 先上骨架：Grill 卡挂「即将开放」，9.0 暂沿用现行解锁
> 4. 封面图由用户拿 prompt 找生成模型出图，落位 `public/cards/`；出图前用 CSS 渐变占位

## 0. 一句话

设置页从「单卡片 + 一排切换按钮」改为**三张堆叠功能卡**（Classic / Grill / 9.0 Trivial），
前牌即当前功能区，点后牌或左右滑切换；每张卡自带封面图与编号，切换时封面做层叠位移动效。
9.0 Trivial 的解锁入口改走 **Diagnostic Test**（压力测试，≥90% 通过），做过的诊断题绑定进 Grill。

## 1. 信息架构：三个功能区

| # | 卡 | 开放 | 内容 |
|---|---|---|---|
| 01 | **Classic** | 免费 | 现有练习 / Mock，题库 TMUA·MAT·SMC·ECAA（经典池） |
| 02 | **Grill** | 免费 | 「复烤区」：Diagnostic 里出现过的题绑定于此，可正常练习批改 |
| 03 | **9.0 Trivial** | 进度解锁 | 扩展池（TMUA Mock、MAT/TMUA 回忆题、Style Problem…），锁定时卡面呈锁定态，入口 = Diagnostic Test |

现有设置项（题库选择、模式、抽题策略、题数、记录面板）**不消失**：
选中某张卡后，该卡展开为该区的配置面板——即两级结构「选区 → 配置」。
Classic 展开后就是现在的设置页去掉 9.0 充电条；9.0 展开后是同一套配置 + 扩展池；
Grill 展开后只有题数（池子固定为绑定题）。

## 2. 堆叠卡片 UI（对照参考截图）

**布局**
- 三张卡居中堆叠：前牌完整，左右各露出一张后牌的边缘（约 15–18%），后牌缩小 ~8%、下移、模糊 1px、降亮度
- 每张卡：封面图（上半）、编号 `01/02/03`、右上角状态徽章（题数 / 🔒 / 火焰）、标题、一行副文
- 桌面 ≤ 3 张全露；手机上后牌只露边缘，支持横滑

**交互**
- 点后牌 → 该牌转到前位（deck 旋转）
- 键盘 ← →；触屏横滑（复用工牌那套 touch 处理经验）
- 前牌点击 / Enter → 展开为配置面板（卡片放大为现有 setupCard 的形态，deck 收纳为顶部小页签，可点回）
- 锁定的 9.0 卡：可以转到前位查看，但展开动作变成「进入 Diagnostic Test」

**动效（图片切换）**
- deck 旋转：前牌沿弧线退到侧后（translateX + rotate ±6° + scale 0.92），后牌升前；350ms，`cubic-bezier(0.2, 0.7, 0.2, 1)`
- 封面图在卡内做 1.06→1.00 的缓慢 settle（Ken Burns 微缩放），切换瞬间不裁切跳变
- 展开：卡片 FLIP 到配置面板尺寸，封面图上滑淡出、表单内容下入
- `prefers-reduced-motion`：全部退化为瞬时切换
- 实现约束：动效纯 CSS transform/opacity（合成器层），不做布局属性动画——工牌那次 scale 踩过的坑（布局盒子不随 transform 变）这里天然规避，因为 deck 是绝对定位叠放，不参与文档流

**封面素材**（已定：外部模型生成，prompt 见 §8）
- 落位：`public/cards/classic.jpg` / `grill.jpg` / `trivial.jpg`，建议 1536×1024（3:2），单张 ≤ 400KB
- 出图前用 CSS 渐变占位，图片就绪后直接替换文件即可，不改代码

## 3. Diagnostic Test（压力测试）

**入口**：9.0 卡锁定态的展开动作。

**规则**（按 Plan 逐条落实，标 ⚠ 的是我的解读、需确认）
- 题源：GMAT 诊断集（见 §5 数据）
- 每题基础 2:00 倒计时
- 提前点「确认」→ 当题计时冻结，**剩余秒数滚存到下一题**（时间银行）⚠
- 倒计时归 0 → 自动确认当前所选（未选按未答）并跳下一题
- 不可回看：Navigator / Back 禁用，单向流
- 全程不显示对错、不显示答案
- 交卷后仅显示 **Pass / Fail**（正确率 ≥90% = Pass），不给分数明细、不给答案与批改 ⚠（连正确率数字都不给，只给两态；要给数字请在 Q2 说明）
- 本场全部题目 qid 写入 Grill 绑定集
- Pass → 解锁 9.0 Trivial（持久化）；Fail → 可重考（是否限次待定，默认不限）

**工程**：复用现有 exam runtime，新增 `mode: 'diagnostic'` 分支——计时器换成逐题倒计时 + 银行、隐藏批改路径、结果页换 Pass/Fail 版式。判分逻辑本身零改动。

## 4. Grill 区

- 池子 = `records` 里的 Grill 绑定集（qid 数组，随 Diagnostic 每场并入、去重）
- 练习形态：正常练习模式（可批改、可看解析）——诊断时不给答案，事后在 Grill 里«烤»明白，这是两区的分工 ⚠（若 Grill 也不给答案，请在 Q1 说明）
- 绑定集入 XLSX 导出/导入（记录文件加一列或一表）
- 空态文案：「完成一次 Diagnostic 后，这里会出现你的题」

## 5. 数据与构建

- **GMAT 切题化**：6 个源文件 → 逐题 md（frontmatter qid/id/section=Diagnostic + `## 题目/答案/解析`），写一个一次性转换脚本；GMAT 是五选一 A–E，正好走现有 MAT 括号解析器的兜底格式，或直接产成标准格式
- **诊断题不入常规池**：build-data 给 GMAT 打 `diag: true`，index 里三态：普通 / hidden / diag；Classic 与 9.0 的抽题过滤掉 diag
- **records.ts 新增**：
  ```
  grill: number[]            // 绑定 qid
  diag: { passed: boolean, attempts: number, lastTs: number }
  ```
  版本迁移：v1 → v2，读到 v1 自动补空字段
- 回忆题 / Style Problem 未标化——9.0 池内容不在本期，入库后自动出现，无需改代码

## 6. 分期

| 期 | 内容 | 依赖 |
|---|---|---|
| **P1** | 堆叠卡片架构 + 切换动效 + Classic/9.0 两卡接通（9.0 暂沿用现行解锁），Grill 卡挂「即将开放」 | 无 |
| **P2** | GMAT 切题脚本 + diag 数据通道 + Diagnostic Test 引擎 + Pass 解锁 | P1 |
| **P3** | Grill 区接通 + 绑定集 + XLSX 扩展 | P2 |

P1 独立可发布；P2/P3 各自独立可发布。

## 7. 明确不动的

exam 运行时（选项/批改/键盘流）、build-data 解析器、工牌、9.0 流光充电条视觉（挪进 9.0 卡内）、成绩页。

## 8. 封面出图 Prompt（外部模型用）

三张共用一段风格前缀，保证成一套；均**不得含任何文字**（标题由 HTML 叠加）。
比例 3:2（建议 1536×1024），单张压到 ≤400KB 再入库。

**共用风格前缀：**
> Flat modern editorial illustration, soft airy gradients, minimalist academic aesthetic,
> clean vector shapes, generous negative space, muted ivory background (#f5f6f8),
> ink-navy line work (#1a1a2e), no text, no letters, no watermark, 3:2 aspect ratio

**01 Classic** （宁静学术蓝）：
> + a serene study scene abstracted into geometry: cream grid paper backdrop,
> elegant royal-blue (#4a6cf7) polynomial curves drawn in fountain-pen ink,
> a drafting compass and a translucent ruler resting diagonally,
> soft morning light from upper left, calm and orderly mood

**02 Grill** （温热复烤橙）：
> + an abstract heat-and-forge motif: warm amber-to-ember gradient rising from below,
> charcoal-navy coordinate grid partially glowing at the intersections,
> a single bold curve reheating from dark ink to molten orange along its length,
> subtle floating sparks, intense but controlled mood

**03 9.0 Trivial** （深空流光）：
> + a deep midnight-indigo field with a faint constellation lattice,
> one luminous teal-to-cyan aurora ribbon flowing diagonally like silk,
> tiny star glints, a barely-visible keyhole silhouette formed by negative space
> at the golden-ratio point, mysterious and premium mood

## 9. P0 成绩回顾面板（Progress）——裁决记录（2026-08-12）

双 Opus 方案交叉互审后定稿。上线范围：
- stageView: 'deck'|'zone'|'progress'（先做零视觉变化的重构，跑通全测试再接功能）
- 入口 2 处：deck 统计条（N seen · M wrong now · View progress ›）+ 成绩页链接
- 内容：stat tiles / Recent sessions 折线（同 viewBox 底部用时细柱、透明 rect 命中、
  点击出详情行、x 轴序号等距只标首末日期）/ Most missed（wrongRanking(10) 懒取
  单题 JSON、Retry these 同步直调 start()）/ recordSection 迁入
- 成绩页逐题卡：Seen N× · missed M×，读 start() 时的 records 快照
  （async 导出窗口内 live records 会当面跳数，快照免疫）
- XLSX：追加只读 Sessions 表（表头引用常量）；导入确认框加
  "Session history is not transferred."
- diag（GMAT 诊断题）从 wrongRanking 与重练池中过滤

**推迟：Weak topics 弱项图与整条 topics 数据管线**（用户决定，2026-08-12）。
打标覆盖 1007/1706=59% 且按库极度倾斜（SMC 100% / Mock 83% / TMUA 29% /
MAT 5% / ECAA 9%），知识点未结清前不上站。已留档待启用的图纸：
- 双格式 YAML 解析（块状 + 行内 topics: [A, B]，行内 200 条全在 TMUA Mock）
- alias 归并 12 词表：Algebra 337 / Geometry 271 / Logic and Proof 235 /
  Number Theory 174 / Function 79 / Combinatorics 64 / Misc Pure 62 /
  Calculus 41 / Trigonometry 33 / Sequences and Series 33 / Polynomial 31 /
  Probability 3（Algebra (Basic)→Algebra、Algebra (Function)→Function、
  Algebra (Polynomial)→Polynomial、Mis Pure+Miscellaneous Pure→Misc Pure）
- 数据通道：独立倒排 public/exam/topics.json {vocab, byTopic, coverage(含按库)}，
  ≈16KB/4-5KB gzip，仅 Progress 打开时懒取；index 与单题 JSON 形状冻结
- UI：n≥5 门槛 + 按库覆盖披露 + 覆盖不足换引导文案；口径写死
  "Lifetime accuracy on attempted questions"

## 10. Diagnostic 规格修订（用户裁定，2026-08-13）——覆盖 §3 的题源与流程

- **固定两卷制**：每次诊断 = Paper 1（20 题，algebra-ps）→ 中场休息（不限时，
  无成绩信息）→ Paper 2（20 题，algebra-ds），共 40 题，仿 TMUA 结构
- **仅 2 次机会**：交卷时消耗；两次用不同固定卷（套一/套二）；用完且未过 →
  入口变「机会已用完」态，365 题路仍可解锁。放弃/刷新不消耗（接受偷看代价）
- **拆套**：每个 40 题文件按难度（level）升序后奇偶交错拆两套 20 题，
  两套难度分布对等、卷内升序、零随机
- **计时**：每题 120s + 银行滚存仅卷内有效；Paper 2 开始时计时与银行清零
- Pass = 全场 ≥90%（36/40），其余（两态结果、不写 q/s、grill 并入、
  passed 永久、clearRecords 保留解锁）沿用 §3 与 P2 裁决
- word-problems 两套（33 题）留 diag 池但引擎不用
- 介绍页规则文案改大白话短句（普通学生一眼看懂），双语
