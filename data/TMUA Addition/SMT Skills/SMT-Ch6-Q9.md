---
database: MAT
qid: 90020340900
id: SMT-Ch6-Q9
paper: SMT Skills Ch6
year:
number: Q9
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
style: MAT
solution_source: 书后解答
answer_verified: true
status: 已入库
---

## 题目
Which of these gives the greatest value?

(a) $\int_2^3 (x - 2) \, \text{d}x$
(b) $\int_3^6 (2x - 9) \, \text{d}x$
(c) $\frac{1}{2}\int_{-2}^0 (x^2 + 4x + 4) \, \text{d}x$
(d) $\int_{-1}^0 (2 - x^2) \, \text{d}x$
(e) $2\int_{100}^{101} (x^2 - 200x + 10^4) \, \text{d}x$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 6 章 Calculus 章末 MAT style 第 9 题；解析为书后官方 worked solution。
- 书后解答未给字母，答案由统筹者自解：五个积分依次为 $\tfrac12,\ 0,\ \tfrac43,\ \tfrac53,\ \tfrac23$，最大是 (d)。

## 答案
D

## 解析
A quick sketch will shows that $\int_{2}^{4}(x - 2)dx = \frac{1}{2}$ and $= \int_{3}^{6}{2x - 9}dx = 0$

c), d) and e) are quadratic curves. All quadratic curves are a transformation of the graph of $y = x^{2}$: $y = x^{2} + 4x + 4 \equiv (x + 2)^{2}$ is a translation by $\begin{pmatrix} - 2 \\ 0 \end{pmatrix}$ of $y = x^{2}$; $y = 2 - x^{2}$ is a reflection in the $x$-axis of $y = x^{2}$ followed by a translation by $\begin{pmatrix} 0 \\ 2 \end{pmatrix}$; $y = x^{2} - 200x + 10^{4}$ is a translation by $\begin{pmatrix} 100 \\ 0 \end{pmatrix}$ of $y = x^{2}$. It may be easier to find an equivalent area below or above the $y = x^{2}$ curve.
![[Image/SMT-sol-image31.png]]
d) has the greatest value (in fact, the work above establishes that e) $<$ c) $\  <$ a) $=$ b)$\  <$ d)).
