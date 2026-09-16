---
database: MAT
qid: 90010310300
id: Spec2-Q3
paper: MAT Specimen 2
year: 2009
number: Q3
section: Long Question
audience: Maths
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: [重复题, FTC]
duplicate_of: MAT/2004/04-Q3.md
status: 已入库
---
## 题目
For **APPLICANTS IN** $\left\{\begin{array}{l}\textbf{MATHEMATICS} \\ \textbf{MATHEMATICS \& STATISTICS} \\ \textbf{MATHEMATICS \& PHILOSOPHY} \\ \textbf{MATHEMATICS \& COMPUTER SCIENCE}\end{array}\right\}$ **ONLY**.

Let
$$
f(x) = \begin{cases}
x + 1 & \text{for } 0 \leqslant x \leqslant 1; \\
2x^{2} - 6x + 6 & \text{for } 1 \leqslant x \leqslant 2.
\end{cases}
$$

**(i)** On the axes provided below, sketch a graph of $y = f(x)$ for $0 \leqslant x \leqslant 2$, labelling any turning points and the values attained at $x = 0, 1, 2$.

![[Image/Spec2-Q3-fig1.png]]
**(ii)** For $1 \leqslant t \leqslant 2$, define
$$
g(t) = \int_{t-1}^{t} f(x)\,\mathrm{d}x.
$$
Express $g(t)$ as a cubic in $t$.

**(iii)** Calculate and factorize $g'(t)$.

**(iv)** What are the minimum and maximum values of $g(t)$ for $t$ in the range $1 \leqslant t \leqslant 2$?

## 备注

### 我的备注

### AI备注
本题与 `MAT/2004/04-Q3.md` 是同一道题——牛津样卷是从 1996–2006 历年真题里挑题拼成的。已打 `重复题` 标签、排除出组卷池，避免随机组卷时同题出现两次。本条保留的价值在于**解析是原卷官方版**（Dr. Richard Earl），而孪生题的解析是自撰的。

差异：2004 原卷小问标号为 (a)–(d)，本卷为 (i)–(iv)，内容一致。

## 答案
（无）

## 解析
**(i)**
![[Image/Spec2-Q3-sol1.png]]
To find the turning point in the range $1 \leqslant x \leqslant 2$ we note $y'(x) = 4x - 6 = 0$ when $x = 3/2$. Then
$$
y\left(\frac{3}{2}\right) = 2\left(\frac{3}{2}\right)^{2} - 6\left(\frac{3}{2}\right) + 6 = \frac{3}{2}.
$$

**(ii)** Splitting the integral of $f(x)$ about $x = 1$ we see
$$
\begin{aligned}
g(t) &= \int_{t-1}^{1} (x + 1)\,\mathrm{d}x + \int_{1}^{t} \left(2x^{2} - 6x + 6\right)\mathrm{d}x \\
&= \left[\frac{(x + 1)^{2}}{2}\right]_{t-1}^{1} + \left[\frac{2x^{3}}{3} - 3x^{2} + 6x\right]_{1}^{t} \\
&= \left\{2 - \frac{t^{2}}{2}\right\} + \left\{\frac{2t^{3}}{3} - 3t^{2} + 6t - \frac{2}{3} + 3 - 6\right\} \\
&= \frac{2t^{3}}{3} - \frac{7t^{2}}{2} + 6t - \frac{5}{3}.
\end{aligned}
$$

**(iii)**
$$
g'(t) = 2t^{2} - 7t + 6 = (2t - 3)(t - 2).
$$

**(iv)** The minimum/maximum values will occur at the ends ($t = 1$ or $t = 2$) or as a local extremum ($t = 3/2$). Note that
$$
\begin{aligned}
g(1) &= \frac{2}{3} - \frac{7}{2} + 6 - \frac{5}{3} = \frac{3}{2}; \\
g\left(\frac{3}{2}\right) &= \frac{9}{4} - \frac{63}{8} + 9 - \frac{5}{3} = \frac{9}{4} + \frac{9}{8} - \frac{5}{3} = \frac{54 + 27 - 40}{24} = \frac{41}{24}; \\
g(2) &= \frac{16}{3} - 14 + 12 - \frac{5}{3} = \frac{16 - 6 - 5}{3} = \frac{5}{3}.
\end{aligned}
$$
These answers are respectively $36/24$, $41/24$ and $40/24$. Hence the minimum is at $t = 1$ and the maximum at $t = 3/2$.
