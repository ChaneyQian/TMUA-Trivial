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

## 11. P3 审查遗留（2026-08-13）
- J1 已裁决接受：XLSX 第三表使 9.0 解锁可随文件分享。公益站+激励性门槛+
  答案本在公开 JSON，合法用户跨设备可携带性优先，不收口
- ~~待办~~（2026-08-14 清账）：m1 表头校验已加（列序对不上整表跳过，前四列
  前缀匹配给追加列留缝）；m3 已核+已修（切窄策略后 count 超限自动落「全部」档，
  消掉「显示 20 实抽 3」的错位，浏览器目检通过）；README 特性段刷到四期全量，
  版本抬 1.1.0，tag v1.1.0 已打，Release 文案已交用户贴 GitHub UI
- 仍在用户侧：iOS 真机烟测诊断计时

## 12. P4 逻辑推理开关（2026-08-14）

用户口径裁定：**Logic Reasoning 绑定题库自己的 subtopic 打标，不是 TMUA Paper 2
整卷**。实测立论：TMUA P1 的 180 题里有 15 道标了 Logic，P2 的 180 题里只有
103 道是——卷别当代理精确率仅 57%，既错杀 77 道非逻辑题又漏掉 P1 那 15 道。

- 判定 = `subtopics` 含 `Logic`（精确）**或** `topics` 含 `Logic and Proof`
  （包含），并集。全站 236 道（TMUA 118 / Mock 69 / SMC 26 / MAT 13 / ECAA 10）
- **取消勾选只排除已标注的题**，没打标的一律保留：证明不了是逻辑题就不能排除，
  否则 MAT（打标 5%）会被清空
- **覆盖率必须披露**，且随勾选状态换时态。打标覆盖极不均：SMC 100% / TMUA 90% /
  Mock 83% / ECAA 9% / MAT 5%
- 硬约束（均有行为测试）：365 计数、重练错题、Grill、Diagnostic、卡面徽章一律
  走整份索引
- index 新增 `logic?` / `tagged?` 两个标记，gzip +0.6KB。`tagged` 是覆盖率的分母，
  实测省掉它只省 37 字节（压缩吃掉冗余），维持现状
- 顺带修掉 build-data frontmatter 解析器丢块状列表的 bug（741/2067 文件受影响），
  并容忍列表中的空行与注释行

审查采纳 5 条 MINOR：解析器空行容忍、文案时态、「本题库」→「所选范围」、
aria-describedby 关联、空池提示指向开关。未采纳：`Proof` 标签口径维持精确匹配
（in-index 影响 0 题）。数据侧待清：JZMaths_SetB-Mock-P2-Q8 的 subtopics
有重复项 `[Proof, Proof, Trigonometry]`（在 vault 侧，需你确认后清）

## 13. P5 复盘弱项图（2026-08-15）

§9 图纸落地 + 审查裁决。数据管线：独立 topics.json（12 词表 + alias 归并 +
按库覆盖，diag 结构性排除）、进度面板懒取、n≥5 门槛、弱的排前面、按库披露、
每行「练这类题」（错题优先 ≤10 道，范围按 9.0 解锁划）。

审查 PASS-WITH-FIXES（1 MAJOR + 11 MINOR），裁决：
- 采纳 M1（topics.json 形状闸，200 错误体不再白屏整个应用）、m1（CSS 层叠序，
  紧凑样式曾被 .ghost 整块盖掉）、m3（标题「弱项」→「复盘」，全对的人不该看到
  100% 的「弱项」）、m4（披露只点名整库覆盖不过半的库，TMUA 90% 不再被个例
  冤枉；名单可为空走无名单文案）、m6（构建期倒排结构性排除 diag，顺带 GMAT
  整库退出 coverage）、m7（topicScope useMemo）、m8（知识点中文译名 12 条 +
  新词原文兜底）、m11（口径措辞与统计块对齐）
- **口径裁决 m2**：「练这类题」不过 P4 逻辑推理开关。它确实也是随机抽、也发
  新题，与开关管辖重叠——但按钮上写着知识点的名字，点「练逻辑与证明」却因
  别处的开关抽不到逻辑题，比「开关没拦住」更让人糊涂。显式点名胜过口味开关
- 备案不改：m5（coverage 已被 m4 接进前端）、m9（挂载竞态瞬态自愈）、
  m10（resetTopicsCache 进生产包，无害）
- **范围外发现留档**：进度面板「重练这些」不过 9.0 门禁（P0 既有行为）——
  裁决维持：重练的是用户自己的错题历史，与 Grill 同理；到达路径需先经
  XLSX 导入（即 §11 已接受的 J1 场景）

数据侧同步观察（用户重整进行中）：Combinatorics 作为 topics 级词汇归零
（64→0，SMC 重归类），Probability 12→21、Algebra 384→285、Misc Pure
103→136。管线零故障（空词不渲染、无词表外告警），待用户确认是否符合预期。

## 14. 题库层级调整：TMUA Mock 独立成库（2026-08-15）

题库源把 `TMUA/Mock/` 提升为顶层库 `TMUA Mock/`，并扩充到 15 套 480 题
（新增 BeyondHorizon S1–S4 + Spec 共 160 题、Zetta 20 题，全部带答案）。

- `sync-bank.mjs` / `build-data.mjs` 各加一个库名，**照源的层级 1:1 镜像**，
  不替它改嫁回 TMUA/ 底下——data\ 与源长得一样才不会有人对着两棵目录树犯迷糊
- 同步顺带补了「删文件不删目录」的缺口：整棵子树搬走后会留下空壳
- 新增 `choiceFormat()`：库名决定**池子**，格式家族决定**用哪个解析器**，
  两件事分开。TMUA Mock 是独立库但题目照 TMUA 体例写，格式上仍当 TMUA 认。
  （漏了这层会让整库掉进 inlineFallback，选项内联数从 44 暴涨到 483）
- 质量闸规则 5 收窄：整句陈述型干扰项（"x cannot be determined from the
  given information"）天生就长，不该判成吞了题干。改为「长度比 + 没有题干痕迹
  （问号 / 自己的标号+取值）才放行」，误伤的 2 道 BeyondHorizon 题回到池子。
  正反两向都有行为测试钉住

可判分题数 1819 → **2018**（Mock 240 → 439）。

**待用户处置的源数据问题：**
1. MAT 1996/1997 共 6 个文件行尾变成双回车（`\r\r\n`），frontmatter 整块解析
   不出来 → 对所有工具不可见。全是 Long Question，站点零影响，但建议归一化
2. `BeyondHorizonS4-Mock-P1-Q7` 有 **9 个选项（A–I）**，答案 I。解析器与键盘流
   都只到 H，该题被跳过。扩到 I 有坑：`normalizeAnswer` 里单个 "i" 目前按
   MAT 罗马标号解析，扩字母会与之冲突，需连带改判据
3. ThrivingScholars 40 题仍无答案
4. `TMUA Addition`（Euclid Modification 19 题）**按用户指示暂不启用**；
   Clarkson / SMT Skills 目前是空目录

### 14.1 9 选项题支持（2026-08-15，接 §14 待处置第 2 条）

`BeyondHorizonS4-Mock-P1-Q7` 有 9 个选项（A–I，选项值 0–8，答案 I）。
用户否掉「删一个选项」的做法——答案就是 I，删它等于删掉正确答案，删别的是改题。

实测下来代价比预估小得多：
- **键盘流本来就通用**，一行没改：数字键按序号取（1–9 天然支持 9 项），
  字母键是拿按键去匹配选项自己的标号，按 I 本来就选得中。只有提示文案里
  写死的「A–H」改成了「A–I」
- 解析侧四处 `[A-H]` 一起扩到 `[A-I]`，`LETTERS` 补一个 `i`
  （MAT / SMC 最多 5 选，括号解析器遇到找不到的标号就停，够不着新加的字母）
- **罗马标号的歧义用「不猜」化解**：`normalizeAnswer` 不再判断单个 "i" 是字母
  还是罗马数字，改由**选项自己的标号**规范化答案体例。全库校验：29 道罗马标号题
  （其中 4 道答案正好是 i）全部保持小写，答案与标号大小写不一致的题 0 道

可判分题数 2018 → **2019**。测试补一条正反双向守卫（9 选项进池 + 全库答案
必须严格等于某个选项标号），109 → 110。

### 14.2 选项漏进题面的线上 bug + 卷号 + 管理页（2026-08-16）

**线上 bug（用户截图报告）**：14.1 只把选项扩到 I，而新 Mock 里有 7 道 10 选项
（A–J）、2 道 12 选项（A–L）的题——超出的选项块解析不到，整块留在题面里当
公式渲染（截图里居中的「J none of them」正是漏掉的 J 选项）。9 道题带病上线。

- 解析范围一步扩到 **L**（按实测最大值），并新增质量闸规则 7：题面里若残留
  「恰好是下一个标号」的选项块，大声拦下——将来冒出 13 选项的题会进损坏名单
  而不是再悄悄漏。只查下一个标号，避免误伤 $$\mathbf{M}=…$$ 矩阵记号
- 键盘流零改动（字母键本来就按选项标号通用匹配），提示文案 A–I → A–L
- 全库审计：题面残留 mathbf 块的题归零；9 道受影响题全部完整进池

**Mock 卷号（用户裁定格式）**：frontmatter 的 paper 统一是「TMUA Mock」，卷名
只在 id 里，题头显示不出在做哪套卷。构建时从 id 拆出，显示为
「TMUA Mock JZMaths_SetE P2 · Q14」；Zack 这类无分卷的显示「TMUA Mock Zack」。
真题与其他库的卷号不受影响。

**管理调试页 /admin（用户要求，密码 admin123）**：纯静态站没有后端，密码就在
前端代码里——这道门只防误入，**不是安全边界**，页面上原样写明。功能：
做题记录概览与调试开关（设为诊断通过 / 重置诊断与 Grill / 彻底清空——管理员
语义连解锁一起归零，与用户端「清空保留解锁」刻意相反）、qid 检查器（渲染任意
题的题面/选项/答案/解析）、构建统计（按库计数 + 损坏名单）。主站无任何入口，
只能手输 URL；登录态在 sessionStorage，关标签页即失效。

### 14.3 答案区遮罩重做（用户报告，2026-08-16）

高斯模糊遮罩能透看轮廓（用户实测）。病根比「模糊不够浓」深：真实答案与
解析一直渲染在 DOM 里，blur(7px) 只是视觉滤镜——「答案:C」的大字短行、
图形题的图都透得出形状，且划选 / Ctrl+F / 读屏拿到的全是明文。

修法不是加浓模糊，是**未揭示时压根不渲染**：真实内容挪进「已批改且点开」
的条件分支，未揭示时渲染四条骨架占位（aria-hidden，读屏不念）。
solBlur 类整个删除，测试钉住「不许回潮」。网络层 q/<qid>.json 里答案可见
是既有接受的静态架构现实（同 J1），不在此次范围。

## 15. 公告牌（用户要求，2026-08-16）

左下角常驻药丸（与右下角像素小助手对称），展开成票券式告示卡：
- 仪式线夹 NOTICE 字标（解锁横幅基因）→ 流光渐变大标题（充电条满格同款
  青色纹理的文字版，@supports 兜底实色，不可用时绝不显示成渐变色砖）→
  [MAT]/[TMUA CN] 标签列表 → 虚线撕票线 + 两侧缺口圆（--bg 抠出票根质感）→
  主观提示小字 + 收起
- 子元素 70–270ms 阶梯浮现；全部合成器动效；prefers-reduced-motion 一律瞬时
- **版本化已读**：NOTICE_ID（年月开头）变更即对全员重新弹出；同一则收起过
  保持收起（localStorage）；药丸永远可再展开，带呼吸小灯
- 只挂 setup 相：考试/诊断进行中绝不出现；双语（notice.title 拉丁字标
  两语同文，入 i18n 白名单）
- 本期内容：9.0 已开放 / MAT 2024–2025 回忆题 MCQ / TMUA CN 2024–2025
  回忆题 / 主观 7.5–9.0 适配提示（两种语言都如实标明是个人观点）

## 16. P6 三件结构改动（用户裁定，2026-08-23）

**A. 复烤区 = 完整复盘区**：错题榜（重练这些）与知识点复盘（练这类题）从进度
面板迁入 Grill，三块结构（诊断绑定 / 错题 / 弱项），行为字节级不变（审查
逐行比对确认）。进度面板瘦身为 tiles / 趋势 / 卷墙 / 记录工具——
「我练到哪儿了」归进度，「我该回头做哪些题」归复烤。

**B. 卷面进度墙**：papers.json（构建期产出、懒取、~34KB/gzip 5.8KB、109 套卷）；
每卷一格、颜色五档按已做占比、满卷 ✓；锁定用户不见 hidden 卷名（reachable
求交落实）；格子 title+aria-label 双通道。

**C. 池子互斥**：indexForLibraryMode('hidden') 改为仅 hidden；新增
reachableIndex(unlocked) 联合口径给跨区功能。互斥后 classic 1367 /
9.0 池 658（TMUA 回忆 75 + Mock 440 + MAT 143）。365 计数仍走全集
（审查实证：150 道 hidden 记录下解锁进度零回退）。

**审查（PASS-WITH-FIXES）采纳与裁决**：
- B1 测试红：我在实现交付后推入 TMUA 24/25 数据冲过期了期望——bank-refresh
  三处对齐，deck 库名单改数据推导式断言（不再钉死库名）
- M1 采纳：「重练这些」显式落 practice，与两个邻居按钮同一套理由——复烤区
  卡面写着可批改可看解析，上一场碰巧选过 Mock 就开出限时卷是违约
- M2 采纳：卡面徽章/副文与面板错题榜同源（历史错过 w>0 ∩ 练习池），
  wrongNow 口径会出现「卡面 0 题、面板十行」的当面打脸
- **M3 裁决：维持「重练这些」不过 9.0 门禁**（三裁）。错题榜只含用户亲手
  做错过的题——题面和卷名他都见过，对本人不构成剧透；这与卷墙的「不剧透」
  不矛盾：卷墙是前瞻性目录，错题榜是本人历史。到达路径仍需 §11 J1 的
  XLSX 导入。收口反而会让合法换机用户的错题榜缺题
- M4 采纳：9.0 面板题库行下加范围说明「此区只收扩展卷（Mock 与回忆题），
  与经典题库不重复」——互斥后同名库是另一批题，只有题数看不出来
- MINOR 采纳：m2 papers.json 落盘前剥掉 hidden 死字段（防剧透名单零收益）、
  m5 分母文案改「卷内可判分题数」、m8 页签切区清残留报错、m9 误导注释修正、
  m14 未登记库构建告警、m15 注释修正、m16 格子 aria-label
- 备案不改：m1 AMC 全站不可见（信号留构建日志）、m3 lv4 对比度（沿用全站
  配方，信息不只靠颜色）、m4 Specimen 卷号光秃（修法在 vault：paper 写成
  TMUA Spec P1，待用户）、m6 索引加载瞬时塌格、m17 半 hidden 混卷已有
  构建测试钉住不变量
