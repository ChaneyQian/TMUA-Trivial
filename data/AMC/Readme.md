# AMC 库

上游源仓库：`D:\Juypter\AoPS-downloader-main`（下称**上游**）

本文记录 AMC / AIME 库与上游的对接方式。qid 规则见 [[题库端Qid]]，
TMUA Paper 2 选题背景见 [[support material for Paper2]]。

> **结论先行**：上游已经是一条成熟的一键流水线，但它的终点是 PDF，不是 Obsidian Markdown。
> 缺的不是解析能力，是一个「Markdown 输出后端」。

---

## 1. 上游已具备的能力（不要重复造）

| 能力 | 位置 | 说明 |
| :-- | :-- | :-- |
| 页面下载 + 缓存 | `aops_downloader.py` `async_download_wiki_page()` | 抓 `?action=edit` 源码页，落 `wiki_cache/` |
| 按题切分 | `extract_problems()` | 按 `== Problem N ==` 切，已剥离 See also / References |
| 数学环境转换 | `process_problem_content()` | `<imath>`→`$..$`、`<math>`→`\(..\)`、`<cmath>`→显示公式 |
| **长选项重排** | `reflow_long_option_math()` | 按 `\textbf{(A)}` 锚点拆行，**不是**按 `\qquad` 盲切 |
| **拆散选项合并** | `merge_split_choice_blocks()` | AoPS 常把 A–C 和 D–E 分在两个 math 段，这里缝回去 |
| 分数/定界符归一 | `normalize_fraction_style()` 等 | `\over`→`\frac`、修复 `$\( .. \)$` 畸形定界符 |
| **Asymptote 图** | `run_asymptote_compilation()` + `asy_cache/` | `<asy>` 内联编译，按内容 MD5 复用缓存 |
| 题单解析 | `format_problem_list.py` `extract_problem_refs.py` | 认 `2021 Fall AMC10B Problem 12` 这类人写格式 |
| TMUA P2 筛选 | `scripts/tmua_p2_screen.py` | L0–L2 确定性筛选 |

> 选项重排和 asy **都已有测试覆盖**（上游 `python -m unittest discover -p "test_*.py"`，共 23 个）。
> 评估工作量时不要把这两块当成待开发项。

上游数据规模：`wiki_cache/` 188 个 HTML（AIME 73 · AMC 10 50 · AMC 12 50 · AMC 8 15），
切出 **3940 道题**。缓存的是 wiki 源码编辑页，正文在 `<textarea id="wpTextbox1">` 里，
数学被转义成 `&lt;math>`，需 `html.unescape()`。

**答案与解析不在缓存内**（全库 `==Solution` 命中 0 次）。每题末尾有
`[[2019 AMC 10B Problems/Problem 2|Solution]]` 形式的链接，那是取解析的唯一钥匙。

---

## 2. 已经接上的一个点

`scripts/tmua_p2_screen.py` 的 `--output-dir` 默认值就是 `D:\Obsidian\repo\题库\TMUA\_support`，
即上游筛选结果直接落进本 vault。

但**该目录目前不存在**——说明历次运行都显式传了别的路径，产物停在上游 `output/` 里
（`output/pdf/TMUA-P2-direct.pdf`、`TMUA-P2-adaptation-pool.pdf`）。

**待办**：要么建出 `_support/` 让默认值生效，要么改掉默认值。
别留一个指向不存在目录的默认参数。

---

## 3. 缺口：Markdown 输出后端

上游整条链路终点是 LaTeX → PDF。转 Markdown 需要在末端换后端，
约 80% 的解析和归一化逻辑可原样复用。真正要写的只有：

| # | 待补 | 量级 |
| :-: | :-- | :-- |
| 1 | 定界符改写：`\(..\)`→`$..$`、`\[..\]`→`$$..$$` | 小 |
| 2 | **跳过** `escape_non_math_content()` | 小 |
| 3 | wiki 标记 → Markdown：`'''b'''`→`**b**`、`''i''`→`*i*`、`<i><u>not</u></i>`→`**not**` | 小 |
| 4 | asy → 独立图片文件 | **大** |
| 5 | frontmatter 组装（qid/id/paper 见 §4） | 小 |

**第 2 条易漏**：`escape_non_math_content()` 是为 LaTeX 转义 `#$%&_{}` 的，
Markdown 不需要，照跑会污染正文。

**第 3 条别当小事**：`'''not'''`、`<i><u>not</u></i>` 这类否定词标记若渲染丢失，
**题意会反向，学生直接做错**。这是本项目里少数「转换出错但看不出来」的坑。

**第 4 条是唯一的硬工作量**。现状：`<asy>` 被内联编译进 LaTeX，
`asy_cache/` 里是 575 个 `.asy` + 574 个 `.pdf`，按 asy 源码内容 MD5 命名，**全库 0 个 png**。
走 Markdown 需要 pdf→png（Ghostscript 已是上游依赖）并按题生成图片文件名，
落到 `AMC/Image/`、写成 `![[Image/xxx.png]]`。

> 首批 18 道 Logic 题**无一含 `[asy]`**，所以能手工快速完成——这是运气，不是常态。
> 全库 3940 题带图比例不低，下一批大概率撞上。**建议第 4 条单独排期。**

---

## 4. 本库命名方案

**qid**：全库 11 位 `YYYY DB P QQ SS`，详见 [[题库端Qid]]。AMC 系相关段：

- `DB`：`11` AMC 8 · `12` AMC 10 · `13` AMC 12 · `14` AIME
- `P`：无后缀（2000–2001）→ `0` · A → `1` · B → `2` · Fall A → `3` · Fall B → `4`
- `SS`：AMC 无子题，恒 `00`

例：`2019 AMC 10B Q2` → `20191220200`；`2021 Fall AMC 10B Q12` → `20211241200`；
`2010 AMC 12A Q4` → `20101310400`。

**id / 文件名**：`<四位年>-<卷别>-Q<题号>`，如 `2019-10B-Q2`、`2021-F-10B-Q12`、`2010-12A-Q4`。
此处**用四位年**而非 TMUA 的两位年——AMC/AIME 跨 1983–2025，两位年会歧义。

**目录**：`题库/AMC/<年份>/`。Fall 卷与春季卷同放该年目录，靠 id 中的 `F` 区分。

**逻辑题打标**：`topics: [Logic and Proof]` + `subtopics: [Logic]`，
与 TMUA / ECAA 同批打标口径一致。

---

## 5. 当前入库情况

首批 **18 题**（2000–2023，AMC 10 ×14 + AMC 12 ×4），全部为 Logic 类，
`status: 待复核`，**只做了题面，答案与解析留空**。

来源：`AoPS-downloader-main/scripts/gen_amc_logic.py`。
注意该脚本是**一次性发布器，不是转换器**——18 道题面以字符串字面量硬编码在其 `P` 列表里，
换一批题它帮不上忙。§3 的后端做出来后它就可以退役。

---

## 6. 边界约定

- 上游是**只读源**：任何流程都不得写 `wiki_cache/`。
- Python 脚本一律留在上游 `scripts/`，**不进 vault**，保持 vault 纯 Markdown。
- 上游 `.git` 目录为空（见其 README「项目状态说明」），**不具备版本恢复能力**。
  批量写 vault 的脚本必须自带改动清单（参考 `scripts/tag_logic.py` 的 `tag_manifest.json`），
  否则出错无法回滚。
