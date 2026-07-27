# TMUA-Trivial

TMUA / MAT / SMC 选择题机考练习。随机抽题，仿 TMUA 官方 CBT 界面，题目、判分、渲染全在浏览器完成。

**在线使用 → <https://chaneyqian.github.io/TMUA-Trivial/>**

## 特性

- **两种模式** — 练习模式选完按 Enter 即时批改，右半屏揭示答案与解析；Mock 模式限时作答，交卷后统一批改并逐题回看
- **1343 道可判分选择题** — TMUA 360、MAT 309、SMC 674，均在构建期逐题解析验证，不是估算
- **CBT 机考界面** — 全屏、倒计时、Flag for Review、Navigator 题号跳转、Light / Dark / Sepia 三套配色
- **纯静态** — 没有后端。索引仅 44 KB，抽中哪几题就取哪几题
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
解析器认三种选项写法：TMUA 的 `$$\mathbf{A} \quad …$$` 公式块、MAT 的 `(a)`／`(i)` 标号、SMC 的 `$\qquad$` 单行排列，
以及选项本身是图片的图形选择题。只有能自动判分的题会进抽题池，损坏的题由质量闸门拦下并记入 `public/exam/corrupted.json`。

想接自己的题库，设环境变量 `BANK_PATH` 指到同结构的目录再构建即可。

## 技术栈

Next.js 16 静态导出 · React 19 · KaTeX · marked

## 许可

代码以 [MIT](LICENSE) 协议发布。

> 题库内容为各考试的历年真题，版权分别归属 Cambridge Assessment（TMUA）、牛津大学（MAT）
> 与 UK Mathematics Trust（SMC），仅供个人学习使用，不在本项目的 MIT 授权范围内。
