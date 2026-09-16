---
database: MAT
qid: 90010300101
id: Spec1-Q1A
paper: MAT Specimen 1
year: 2009
number: Q1A
section: Multiple Choice
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: [重复题]
duplicate_of: MAT/2005/05-Q1A.md
status: 已入库
---
## 题目
The area of the region bounded by the curves $y = x^{2}$ and $y = x + 2$ equals
(a) $\dfrac{7}{3}$
(b) $\dfrac{7}{2}$
(c) $\dfrac{9}{2}$
(d) $\dfrac{11}{2}$

## 备注

### 我的备注

### AI备注
本题与 `MAT/2005/05-Q1A.md` 是同一道题——牛津样卷是从 1996–2006 历年真题里挑题拼成的。已打 `重复题` 标签、排除出组卷池，避免随机组卷时同题出现两次。本条保留的价值在于**解析是原卷官方版**（Dr. Richard Earl），而孪生题的解析是自撰的。

差异：与 2005 原卷同题，但**选项顺序不同**：本卷 (c) = 原卷 (a) = $9/2$。

## 答案
C

## 解析
The two curves $y = x^{2}$ and $y = x + 2$ meet when
$$
x^{2} - (x + 2) = (x + 1)(x - 2) = 0,
$$
i.e. when $x = -1$ or $x = 2$. Within the region $-1 \leqslant x \leqslant 2$ then $x^{2} \leqslant x + 2$ (see graph) and so the area between the curves is
$$
\int_{-1}^{2} \left(x + 2 - x^{2}\right) \mathrm{d}x = \left[\frac{x^{2}}{2} + 2x - \frac{x^{3}}{3}\right]_{-1}^{2} = \left(\frac{4}{2} + 4 - \frac{8}{3}\right) - \left(\frac{1}{2} - 2 + \frac{1}{3}\right) = \frac{9}{2}.
$$
![[Image/Spec1-Q1A-sol1.png]]
The answer is (c).
