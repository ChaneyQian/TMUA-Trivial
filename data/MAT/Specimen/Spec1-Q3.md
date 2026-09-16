---
database: MAT
qid: 90010300300
id: Spec1-Q3
paper: MAT Specimen 1
year: 2009
number: Q3
section: Long Question
audience: Maths
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: [重复题]
duplicate_of: MAT/2003/03-Q4.md
status: 已入库
---
## 题目
For **APPLICANTS IN** $\left\{\begin{array}{l}\textbf{MATHEMATICS} \\ \textbf{MATHEMATICS \& STATISTICS} \\ \textbf{MATHEMATICS \& PHILOSOPHY} \\ \textbf{MATHEMATICS \& COMPUTER SCIENCE}\end{array}\right\}$ **ONLY**.

In this question we shall consider the function $f(x)$ defined by
$$
f(x) = x^{2} - 2px + 3
$$
where $p$ is a constant.

**(i)** Show that the function $f(x)$ has one stationary value in the range $0 < x < 1$ if $0 < p < 1$, and no stationary values in that range otherwise.

In the remainder of the question we shall be interested in the smallest value attained by $f(x)$ in the range $0 \leqslant x \leqslant 1$. Of course, this value, which we shall call $m$, will depend on $p$.

**(ii)** Show that if $p \geqslant 1$ then $m = 4 - 2p$.

**(iii)** What is the value of $m$ if $p \leqslant 0$?

**(iv)** Obtain a formula for $m$ in terms of $p$, valid for $0 < p < 1$.

**(v)** Using the axes opposite, sketch the graph of $m$ as a function of $p$ in the range $-2 \leqslant p \leqslant 2$.

![[Image/Spec1-Q3-fig1.png]]

## 备注

### 我的备注

### AI备注
本题与 `MAT/2003/03-Q4.md` 是同一道题——牛津样卷是从 1996–2006 历年真题里挑题拼成的。已打 `重复题` 标签、排除出组卷池，避免随机组卷时同题出现两次。本条保留的价值在于**解析是原卷官方版**（Dr. Richard Earl），而孪生题的解析是自撰的。

差异：2003 原卷小问标号为 (a)–(e)，本卷为 (i)–(v)，内容一致。

## 答案
（无）

## 解析
**(i)** If
$$
f(x) = x^{2} - 2px + 3
$$
then $f'(x) = 2x - 2p = 2(x - p) = 0$ at $x = p$. So the stationary point is in the range $0 < x < 1$ only if $0 < p < 1$, and is otherwise outside that $x$-range.

**(ii)** The minimum value $m(p)$ attained by $f(x)$ in the range $0 \leqslant x \leqslant 1$ will occur either at an endpoint ($x = 0$ or $x = 1$) or at a stationary point in between. If $p \geqslant 1$ then we have seen there is no stationary point in between; as $f(0) = 3$ and $f(1) = 4 - 2p \leqslant 3$ then $m(p) = 4 - 2p$.

**(iii)** If $p \leqslant 0$ then again there is no stationary point in the range $0 < x < 1$. However this time
$$
f(1) = 4 - 2p \geqslant 3 = f(0)
$$
and so $m(p) = 3$.

**(iv)** If $0 < p < 1$ then there is a stationary point at $x = p$, which is a minimum (because of the U-shape of the parabola, or by calculating $f''(p) = 2$). Now
$$
f(p) = p^{2} - 2p^{2} + 3 = 3 - p^{2}.
$$
From our knowledge of the graph's shape, or by checking that
$$
3 - p^{2} < 3 = f(0); \qquad 3 - p^{2} < 4 - 2p = f(1)
$$
as $1 - 2p + p^{2} = (1 - p)^{2} > 0$; then $x = p$ is the minimum on the whole range $0 \leqslant x \leqslant 1$ and $m(p) = 3 - p^{2}$ when $0 < p < 1$.

**(v)**
![[Image/Spec1-Q3-sol1.png]]
