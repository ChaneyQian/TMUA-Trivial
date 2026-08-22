---
database: TMUA
qid: 20132101214111
id: BeyondHorizonS4-Mock-P1-Q11
paper: TMUA Mock
year:
number: Q11
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: [待补答案, 原卷缺陷]
status: 已入库
---

## 题目
The functions $f$ and $g$ are given by $f(x) = 4x^2 + 10x + 5$ and $g(x) = x^3 + 5x^2 + 8x - 10$.
What is the complete set of values of $x$ for which one of the functions is increasing and the other decreasing?
$$\mathbf{A} \quad x \geq -2$$
$$\mathbf{B} \quad x \leq -2$$
$$\mathbf{C} \quad -4 \leq x \leq -3,\; x \geq -2$$
$$\mathbf{D} \quad x \leq -3,\; x \geq -2$$
$$\mathbf{E} \quad x \leq -4,\; -3 \leq x \leq -2$$
$$\mathbf{F} \quad x \leq -4,\; x \geq -3$$
$$\mathbf{G} \quad -3 \leq x \leq -2$$

## 备注

### 我的备注

### AI备注

- **原卷缺陷：由题面系数推出的解集与选项的分界点对不上，疑为原卷系数笔误。**
  题面（600dpi 逐字确认）$f(x)=4x^{2}+10x+5$、$g(x)=x^{3}+5x^{2}+8x-10$。
  于是 $f'$ 零点在 $-\frac54$，$g'=(3x+4)(x+2)$ 零点在 $-2$ 与 $-\frac43$。
  因 $-\frac43 < -\frac54$，「$f$ 增且 $g$ 减」为空集；「$f$ 减且 $g$ 增」给出
  $$x \leq -2 \quad\text{或}\quad -\tfrac43 \leq x \leq -\tfrac54$$
  而选项里的分界点全是 $-2,-3,-4$。若 $f=4x^{2}+24x+5$、$g=x^{3}+9x^{2}+24x-10$
  （即 $f'$ 零点 $-3$、$g'$ 零点 $-4$ 与 $-2$），答案恰为选项 E，形状完全对上。
  按「以原卷为准」题面未改，`ANSWER` 记 B（只取主分支），**不是正确答案**。


## 答案
B

## 解析
Here $f'(x) = 8x + 10$, so $f$ is decreasing for $x < -\frac{5}{4}$ and increasing for $x > -\frac{5}{4}$. Also $g'(x) = 3x^2 + 10x + 8 = (3x + 4)(x + 2)$, so $g$ is increasing for $x < -2$ and for $x > -\frac{4}{3}$, and decreasing on $-2 < x < -\frac{4}{3}$. Because $-\frac{4}{3} < -\frac{5}{4}$, the case "$f$ increasing and $g$ decreasing" has empty solution set, and the case "$f$ decreasing and $g$ increasing" gives
$$x \leq -2 \quad \text{or} \quad -\tfrac{4}{3} \leq x \leq -\tfrac{5}{4}.$$
That set is not among the listed options; its main branch $x \leq -2$ is option B, which is what is recorded here pending review. The answer is B.
TODO(待校对): Q11 自解结果为 $x \leq -2$ 或 $-4/3 \leq x \leq -5/4$，与 A–G 任何一项都不吻合。选项中反复出现的 $-2, -3, -4$ 提示原卷题干系数可能有误：若 $f'$ 的零点在 $-3$、$g'$ 的零点在 $-4$ 与 $-2$，答案恰好是 E。此处暂记 ANSWER: B（只取主分支），请统筹者裁定。
