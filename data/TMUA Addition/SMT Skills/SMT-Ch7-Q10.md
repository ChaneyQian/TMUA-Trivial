---
database: MAT
qid: 90020351000
id: SMT-Ch7-Q10
paper: SMT Skills Ch7
year:
number: Q10
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
style: MAT
solution_source: 书后解答
status: 已入库
---

## 题目
The equation $x^2 = x^3 - ax + 12$ has three real roots (including possible repeated roots) for

(a) all real values of $a$
(b) $2 \le a \le 8$
(c) $0 \le a \le 8$
(d) $a < 8$
(e) $a > 8$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 7 章 Graphs 章末 MAT style 第 10 题；解析为书后官方 worked solution。

## 答案
E

## 解析
Rearrange to $x^{3} - x^{2} - ax + 12 = 0$. Note $x = 0$ is never a root (it would need $12 = 0$), so we may divide by $x$ and make $a$ the subject:
$$a = \frac{x^{3} - x^{2} + 12}{x} = x^{2} - x + \frac{12}{x}$$
The number of real roots is now the number of times the horizontal line at height $a$ meets $y = \phi(x)$, where $\phi(x) = x^{2} - x + \frac{12}{x}$.
$$\phi'(x) = 2x - 1 - \frac{12}{x^{2}} = \frac{2x^{3} - x^{2} - 12}{x^{2}} = \frac{(x - 2)\left(2x^{2} + 3x + 6\right)}{x^{2}}$$
The quadratic factor has discriminant $9 - 48 < 0$, so it is always positive, and $\phi'$ has the sign of $x - 2$.
Hence $\phi$ is strictly decreasing on $(-\infty, 0)$ and on $(0, 2)$, and strictly increasing on $(2, \infty)$, with $\phi(2) = 4 - 2 + 6 = 8$.
On $x < 0$ the curve falls from $+\infty$ to $-\infty$, so there is exactly one negative root whatever $a$ is. On $x > 0$ it falls from $+\infty$
to the minimum $8$ and rises back to $+\infty$, so there are two positive roots when $a > 8$, one repeated root when $a = 8$, and none when $a < 8$.
The cubic therefore has three real roots when $a > 8$.
The correct answer is (e).

> ⚠️ **原书疑似有错（选项边界）** —— 严格按题面「including possible repeated roots」，$a = 8$ 时
> $x^{3} - x^{2} - 8x + 12 = (x - 2)^{2}(x + 3)$，三个实根（含重根）齐备，所以完整答案是 $a \ge 8$，选项 (e) 印的 $a > 8$ 在 $a = 8$
> 这一点上是错的。已用 sympy 逐点验证：$a \le 7.9$ 时只有 $1$ 个实根，$a = 8$ 时 $3$ 个（其中一对重根），$a \ge 8.1$ 时 $3$ 个互异实根。
> 选项中没有 $a \ge 8$，而 (e) 是唯一既包含所有 $a > 8$ 又排除所有 $a < 8$ 的选项，故答案取 (e)（书末附录亦给 (e)）。
