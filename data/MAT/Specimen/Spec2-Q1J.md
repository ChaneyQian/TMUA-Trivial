---
database: MAT
qid: 90010310110
id: Spec2-Q1J
paper: MAT Specimen 2
year: 2009
number: Q1J
section: Multiple Choice
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: [重复题]
duplicate_of: MAT/2003/03-Q1H.md
status: 已入库
---
## 题目
Into how many regions is the plane divided when the following three parabolas are drawn?
$$
\begin{aligned}
y &= x^{2} \\
y &= x^{2} - 2x \\
y &= x^{2} + 2x + 2.
\end{aligned}
$$
(a) $4$
(b) $5$
(c) $6$
(d) $7$

## 备注

### 我的备注

### AI备注
本题与 `MAT/2003/03-Q1H.md` 是同一道题——牛津样卷是从 1996–2006 历年真题里挑题拼成的。已打 `重复题` 标签、排除出组卷池，避免随机组卷时同题出现两次。本条保留的价值在于**解析是原卷官方版**（Dr. Richard Earl），而孪生题的解析是自撰的。

## 答案
D

## 解析
From the sketch below we can see that there are $7$ regions.

![[Image/Spec2-Q1J-sol1.png]]
Alternatively notice that solving the equations pairwise
$$
\begin{aligned}
y = x^{2},\quad y = x^{2} - 2x &\implies x = 0, \\
y = x^{2},\quad y = x^{2} + 2x + 2 &\implies x = -1, \\
y = x^{2} - 2x,\quad y = x^{2} + 2x + 2 &\implies x = -\tfrac{1}{2},
\end{aligned}
$$
we see that each of the three parabolas intersects with each of the other two.

The parabola $y = x^{2}$ splits the plane into two. Adding the second parabola $y = x^{2} - 2x$, this crosses the first parabola once and so splits each of the other two regions into two — making four regions now. As we add the third parabola, $y = x^{2} + 2x + 2$, this cuts the two curves in two different points, passing through three of the four regions and dividing them into two, and so adding three more regions. In all then there are $7$ regions and the answer is (d).
