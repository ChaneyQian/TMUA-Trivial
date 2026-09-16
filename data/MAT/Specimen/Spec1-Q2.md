---
database: MAT
qid: 90010300200
id: Spec1-Q2
paper: MAT Specimen 1
year: 2009
number: Q2
section: Long Question
audience: All
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: [重复题]
duplicate_of: MAT/2005/05-Q2.md
status: 已入库
---
## 题目
**For ALL APPLICANTS.**

**(i)** Show, with working, that
$$
x^{3} - (1 + \cos\theta + \sin\theta)x^{2} + (\cos\theta\sin\theta + \cos\theta + \sin\theta)x - \sin\theta\cos\theta, \tag{1}
$$
equals
$$
(x - 1)\left(x^{2} - (\cos\theta + \sin\theta)x + \cos\theta\sin\theta\right).
$$
Deduce that the cubic in (1) has roots
$$
1, \qquad \cos\theta, \qquad \sin\theta.
$$

**(ii)** Give the roots when $\theta = \dfrac{\pi}{3}$.

**(iii)** Find all values of $\theta$ in the range $0 \leqslant \theta < 2\pi$ such that two of the three roots are equal.

**(iv)** What is the greatest possible difference between two of the roots, and for what values of $\theta$ in the range $0 \leqslant \theta < 2\pi$ does this greatest difference occur?

Show that for each such $\theta$ the cubic (1) is the same.

## 备注

### 我的备注

### AI备注
本题与 `MAT/2005/05-Q2.md` 是同一道题——牛津样卷是从 1996–2006 历年真题里挑题拼成的。已打 `重复题` 标签、排除出组卷池，避免随机组卷时同题出现两次。本条保留的价值在于**解析是原卷官方版**（Dr. Richard Earl），而孪生题的解析是自撰的。

差异：2005 原卷小问标号为 (a)–(d)，本卷为 (i)–(iv)，内容一致。

## 答案
（无）

## 解析
**(i)** Writing $c$ for $\cos\theta$ and $s$ for $\sin\theta$ we have
$$
(x - 1)\left(x^{2} - (c + s)x + cs\right) = \left[x^{3} - (c + s)x^{2} + csx\right] - \left[x^{2} - (c + s)x + cs\right] = x^{3} - (1 + c + s)x^{2} + (cs + c + s)x - cs,
$$
as required. Factorising the quadratic further we get
$$
x^{2} - (c + s)x + cs = (x - c)(x - s),
$$
and hence the three roots of the cubic are $1$, $c$, $s$.

**(ii)** When $\theta = \pi/3$ then the three roots are $1$, $c = \dfrac{1}{2}$ and $s = \dfrac{\sqrt{3}}{2}$.

**(iii)** Two of the three roots can be equal when

- $s = 1$, which only occurs in the range $0 \leqslant \theta < 2\pi$ when $\theta = \pi/2$;
- $c = 1$, in which case $\theta = 0$;
- $s = c$, in which case $\tan\theta = 1$ and $\theta = \pi/4$ or $5\pi/4$.

So the list of possibilities is $\theta = 0,\ \pi/4,\ \pi/2,\ 5\pi/4$.

**(iv)** As $s$ and $c$ vary between $-1$ and $1$, and the other root is $1$, then the greatest difference possible is $2$. However, $|s - c|$ cannot equal $2$, so the difference is greatest when $s = -1$ or when $c = -1$. These cases occur at $\theta = 3\pi/2$ and $\theta = \pi$ respectively.

When $s = -1$ then $c = 0$, and when $c = -1$ then $s = 0$. As the cubic is symmetric in $s$ and $c$ then the cubic is the same in each case — or we might explicitly calculate it in each case to get
$$
(x - 1)(x - 0)(x + 1) = x^{3} - x.
$$
