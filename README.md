# MCQ Test

TMUA / MAT / SMC 选择题机考练习。随机抽题，仿 TMUA 官方 CBT 界面，纯静态站点——
既能双击本地运行，也能直接托管到 GitHub Pages。

## 本地怎么用

**双击 `Click here to start.bat`**，等浏览器自己打开就行。

如果收到的压缩包里带了 `out\` 文件夹（已构建好的站点），那么：**不用装依赖、不用联网、秒开**，
只需要电脑上有 Node.js。没装的话双击后会提示并自动打开下载页，装 LTS 版本一路「下一步」即可。

用完直接关掉那个黑窗口。地址是 <http://localhost:3210>，题目全在本地，不上传任何东西。

## 两种模式

| 模式 | 说明 |
| --- | --- |
| **练习**（默认） | 选完按 Enter 立刻批改，右半屏可揭示答案与解析 |
| **Mock**（限时） | 倒计时，中途不给反馈，交卷后统一批改并逐题回看 |

题库范围：TMUA 360 题、MAT 309 题、SMC 674 题，合计 1343 题。
这是**能自动判分**的题数（构建时已逐题解析验证），不是估算值。

## 键盘操作

| 键 | 作用 |
| --- | --- |
| `A`–`H` / `1`–`9` | 选选项 |
| `↑` `↓` | 上下移动选项 |
| `Enter` | 练习模式批改 / 已批改则下一题 |
| `←` `→` | 上一题 / 下一题 |
| `F` | 旗标（Flag for Review） |
| `Esc` | 关闭 Navigator 或交卷确认框 |

右上角 Color Scheme 可切 Light / Dark / Sepia。

## 部署到 GitHub Pages

仓库里已经带了 `.github\workflows\deploy.yml`：

1. 把本项目推到 GitHub（`data\` 要一起提交，它是题源）
2. 仓库 Settings → Pages → Source 选 **GitHub Actions**
3. 推到 `main` 分支即自动构建部署，地址是 `https://<用户名>.github.io/<仓库名>/`

路径前缀由 workflow 按仓库名自动注入（`NEXT_PUBLIC_BASE_PATH`）。
如果用的是 `<用户名>.github.io` 主页仓库或自定义域名，把 workflow 里那个 env 删掉即可。

> ⚠️ **注意**：GitHub Pages 站点是公开的，任何人都能访问。TMUA / MAT / SMC 真题的版权分别
> 属于 Cambridge Assessment、牛津大学和 UKMT，公开托管前请自行确认是否合适。
>
> ⚠️ 静态站点意味着答案和解析会随题目一起下发到浏览器，开 F12 就能看到。练习模式无所谓
> （批改后本来就展示），但 Mock 模式的「限时不给反馈」只是形式上的约束，防不住有心人。

## 发给别人时

最省事的做法是只打包这几项（约 36 MB，对方双击即用，无需联网和安装）：

```
out\                      构建好的站点
scripts\serve.mjs         零依赖静态服务器
docs\                     bat 用到的中文提示
Click here to start.bat
README.md
```

`data\`、`public\`、`src\` 只有重新构建时才需要，日常发给同学不必带。

要发完整项目（让对方能改题重建）就整个文件夹压缩，但**先删掉 `node_modules`、`.next`**。
这种情况下如果不带 `out\`，对方第一次双击会自动 `npm install` + 构建（需联网 2~7 分钟）。

注意 `out\` 里烘焙了路径前缀：本地分发用的必须是**不带** `NEXT_PUBLIC_BASE_PATH` 构建的产物
（也就是直接 `npm run build` 的结果）。CI 里那份带 `/<仓库名>` 前缀的只适用于 Pages。

## 数据与改题

题源在 `data\<库名>\<年份>\*.md`，图片在 `data\<库名>\Image\`。
每题一个 Markdown 文件，frontmatter 含 `qid` / `id` / `year` / `paper` / `number`，
正文按 `## 题目`、`## 答案`、`## 解析` 分节。

改完题库后跑一次：

```bash
npm run build
```

`scripts\build-data.mjs` 会重新扫描 `data\`，把能判分的题输出到 `public\exam\`：
`index.json`（索引，44 KB）+ 每题一个 `q\<qid>.json` + 引用到的图片。
浏览器只下载抽中的那几道题，首屏几十 KB。

**判分条件**：能解析出 3 个以上选项，且 `## 答案` 是单个选项标号（`D`、`(ii)` 之类）。
不满足的题（简答题等，目前 150 道）会被自动排除，不会出现在抽题池里。

想接自己的题库，设环境变量 `BANK_PATH` 指到同结构的目录再构建即可。

## 技术栈

Next.js 16 静态导出（`output: 'export'`）+ React 19 + KaTeX + marked。
没有服务端：抽题、判分、渲染全在浏览器。本地那个 `scripts\serve.mjs` 是个零依赖的静态文件服务器，
仅仅因为 `file://` 下 `fetch` 会被 CORS 拦掉才需要它。
