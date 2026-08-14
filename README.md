# TMUA-Trivial

TMUA / TMUA Mock / MAT / SMC / ECAA / AMC 选择题机考练习。随机抽题，仿 TMUA 官方 CBT 界面，题目、判分、渲染全在浏览器完成。

**在线使用 → <https://chaneyqian.github.io/TMUA-Trivial/>**

## 特性

- **三大功能区** — 堆叠卡片分流：**Classic**（经典练习/Mock）、**Grill**（复烤区）、**9.0 Trivial**（扩展题库）；点卡切换，键盘 `←` `→`、触屏横滑均可
- **两种练习模式** — 练习模式选完按 Enter 即时批改，右半屏揭示答案与解析；Mock 模式限时作答，交卷后统一批改并逐题回看
- **1819 道可判分选择题** — 练习池 1706（TMUA 360、TMUA Mock 240、MAT 309、SMC 674、ECAA 123）+ GMAT 诊断集 113，均在构建期逐题解析验证，不是估算；AMC 题源已接入，待答案补齐后进入可判分池
- **9.0 Trivial 双路解锁** — 完成 365 道有效 QID，**或**通过一次 Diagnostic Test，任一达成即永久解锁 TMUA Mock、AMC 与扩展年份题
- **Diagnostic Test 压力测试** — 固定两卷共 40 题：每题 2 分钟倒计时，提前确认可把余时滚存到下一题；仅两次机会，结果只给 Pass / Fail，不给分数与批改；考过的题绑定进 Grill
- **Grill 复烤区** — 诊断里出现过的题在这里正常练习：可批改、可看解析，把没烤熟的题烤明白
- **成绩回顾** — 练习趋势折线、错题频次榜、一键重练错题；逐题卡片标注见过几次、错过几次
- **做题记录 XLSX 导入/导出** — Records + Sessions + Diagnostic 三张表，换设备导入即续上进度与解锁
- **中英双语** — 外层界面一键中/英切换，考试内保持 CBT 英文题面 + 中文辅助
- **CBT 机考界面** — 全屏、倒计时、Flag for Review、Navigator 题号跳转、Light / Dark / Sepia 三套配色
- **纯静态** — 没有后端。索引约 47 KB，抽中哪几题就取哪几题
- **键盘流** — `A`–`H` / `1`–`9` 选项，`Enter` 批改或下一题，`←` `→` 切题，`F` 旗标

## 本地运行

双击 `Click here to start.bat` 即可（需要 [Node.js](https://nodejs.org/zh-cn)，没装会自动提示并打开下载页）。

或者：

```bash
npm install
npm run build
npm start          # http://localhost:3210
```

## 题库

题源为 `data/<库名>/<年份>/*.md`，每题一个 Markdown 文件，正文按 `## 题目`、`## 答案`、`## 解析` 分节。

`npm run build` 会先跑 `scripts/build-data.mjs`，扫描题库、解析出选项、生成 `public/exam/` 下的静态 JSON 与图片。
解析器识别 TMUA/ECAA 的 `$$\mathbf{A} \quad …$$` 公式块、MAT 的 `(a)`／`(i)` 标号、SMC 的 `$\qquad$` 单行排列，
以及选项本身是图片的图形选择题。只有能自动判分的题会进抽题池，损坏的题由质量闸门拦下并记入 `public/exam/corrupted.json`。

题源仓库改动后，用 `npm run sync` 全量同步到 `data/`（镜像语义，源里删掉的这边也删）。
它按「frontmatter 有没有 `qid`」过滤：没有 `qid` 的 md 是工作笔记而非题目，不会同步进来——
那些笔记常含本机绝对路径与 Obsidian 双链，不适合进公开仓库。源目录默认
`D:\Obsidian\repo\题库`，可用 `BANK_SRC` 覆盖。

想接自己的题库，设环境变量 `BANK_PATH` 指到同结构的目录再构建即可。

## 技术栈

Next.js 16 静态导出 · React 19 · KaTeX · marked

## 许可

代码以 [MIT](LICENSE) 协议发布。

> 题库内容为各考试的历年真题及注明来源的非官方增补题，版权分别归属 Cambridge Assessment（TMUA、ECAA）、牛津大学（MAT）
> 与 UK Mathematics Trust（SMC），仅供个人学习使用，不在本项目的 MIT 授权范围内。
