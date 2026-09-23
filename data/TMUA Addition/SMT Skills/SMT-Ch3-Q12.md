---
database: MAT
qid: 90020311200
id: SMT-Ch3-Q12
paper: SMT Skills Ch3
year:
number: Q12
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
$p$ and $q$ are positive integers such that $p + q = 13$. What is the maximum value that $p^3q$ can take?

(a) $2662$
(b) $2916$
(c) $3000$
(d) $3048$
(e) $3401$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 3 章 Algebra 章末 MAT style 第 12 题；解析为书后官方 worked solution。

## 答案
C

## 解析
Since $p + q = 13$, $p^{3}q \equiv p^{3}(13 - p) \equiv 13p^{3} - p^{4}$.
Differentiating gives $\frac{d}{dp}\left( 13p^{3} - p^{4} \right) = 39p^{2} - 4p^{3} \equiv p^{2}(39 - 4p) = 0$ precisely when $p = 0$ or $p = \frac{39}{4}$.
When $p = 0$, $q = 13$ and $p^{3}q = 0$.
It is crucial to read the question carefully and realise that $p$ and $q$ must be positive integers. The closest integers to $p = \frac{39}{4}$ are $p = 10$, giving $q = 3$, and $p = 9$, giving $q = 4$.
When $p = 10$ and $q = 3$, $p^{3}q = 10^{3} \times 3 = 3000$.
When $p = 9$ and $q = 4$, $p^{3}q = 9^{3} \times 4 = 729 \times 4 = 1458 \times 2 < 3000$.

The correct answer is (c).

(There is at least one other possible method. Following a similar trend of thought to that which lies behind linear programming, consider all values of $p$ and $q$ for which $p^{3}q$ has the same value, say $k$. Converting to Cartesian variables, the question is equivalent to finding points with integer co-ordinates where the line $x + y = 13$ intersects the curve $x^{3}y = k \Leftrightarrow y = \frac{k}{x^{3}}$. Raising the value of $k$ causes the curve to stretch parallel to the $y$-axis; eventually the line $x + y = 13$ becomes tangent to the curve. Where the curve touches the line, the gradient of the curve must be $- 1$, that is, the gradient of the line. This gives a third equation in addition to the equations of the line and the curve. You can use these to eliminate $y$ and $k$ to obtain an equation just in terms of just $x$. This leads to $x = \frac{39}{4}$ and then you proceed as shown in the solution above.)
