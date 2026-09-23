---
database: TMUA
qid: 90020250800
id: SMT-Ch7-Q8
paper: SMT Skills Ch7
year:
number: Q8
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
style: TMUA
solution_source: 书后解答
status: 已入库
---

## 题目
Find the complete set of values of the constant $k$ for which the quartic equation $y = 3x^4 - 32x^3 + 72x^2 + k$ has four distinct real solutions.

$$\mathbf{A} \quad 0 < k < 432$$

$$\mathbf{B} \quad -432 < k < 0$$

$$\mathbf{C} \quad -80 < k < 0$$

$$\mathbf{D} \quad 0 < k < 80$$

$$\mathbf{E} \quad k > 0$$

$$\mathbf{F} \quad k < 0$$

$$\mathbf{G} \quad k > 80$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 7 章 Graphs 章末 TMUA style 第 8 题；解析为书后官方 worked solution。

## 答案
C

## 解析
Separate the constant: the equation is $g(x) = -k$ where $g(x) = 3x^{4} - 32x^{3} + 72x^{2}$.
$$g'(x) = 12x^{3} - 96x^{2} + 144x = 12x(x - 2)(x - 6)$$
so the stationary points are at $x = 0, 2, 6$ with $g(0) = 0$, $g(2) = 80$, $g(6) = -432$. As the leading coefficient is positive this is a W-shape: minimum $0$, maximum $80$, minimum $-432$.
A horizontal line $y = c$ meets such a curve four times exactly when $c$ lies strictly between the **higher** of the two minima and the maximum,
that is $0 < c < 80$. (For $-432 < c < 0$ it meets the curve only twice.)
Hence $0 < -k < 80$, that is $-80 < k < 0$.
The correct answer is (C).
At $k = 0$ and $k = -80$ the line passes through a turning point, giving a repeated root and only three distinct solutions, so the inequalities are strict.

![[Image/SMT-Ch7-Q8-sol1.png]]

### MAT style questions
