---
database: MAT
qid: 90010300102
id: Spec1-Q1B
paper: MAT Specimen 1
year: 2009
number: Q1B
section: Multiple Choice
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: [重复题]
duplicate_of: MAT/2004/04-Q1B.md
status: 已入库
---
## 题目
The smallest value of the function
$$
f(x) = 2x^{3} - 9x^{2} + 12x + 3
$$
in the range $0 \leqslant x \leqslant 2$ is
(a) $1$
(b) $3$
(c) $5$
(d) $7$

## 备注

### 我的备注

### AI备注
本题与 `MAT/2004/04-Q1B.md` 是同一道题——牛津样卷是从 1996–2006 历年真题里挑题拼成的。已打 `重复题` 标签、排除出组卷池，避免随机组卷时同题出现两次。本条保留的价值在于**解析是原卷官方版**（Dr. Richard Earl），而孪生题的解析是自撰的。

## 答案
B

## 解析
A function on the region $0 \leqslant x \leqslant 2$ takes its minimum (and likewise maximum) either at a point $x_{0}$ inside the region $0 < x < 2$, in which case $f'(x_{0}) = 0$, or at an endpoint $x_{0} = 0$ or $2$ (see graph). If
$$
f(x) = 2x^{3} - 9x^{2} + 12x + 3
$$
then
$$
f'(x) = 6x^{2} - 18x + 12 = 6(x - 1)(x - 2).
$$
The graph has two turning points at $x = 1$ and $x = 2$. From our knowledge of the shape of cubics, or by looking at $f''(x)$, we know that $x = 1$ is a maximum and $x = 2$ is a minimum. So the minimum is either at $2$, or possibly at the other endpoint $x = 0$ (even though this is not a turning point of $f$). Now
$$
f(2) = 16 - 36 + 24 + 3 = 7, \qquad f(0) = 3.
$$
![[Image/Spec1-Q1B-sol1.png]]
So the minimum value of $f(x)$ for $0 \leqslant x \leqslant 2$ is $3$ and the answer is (b).
