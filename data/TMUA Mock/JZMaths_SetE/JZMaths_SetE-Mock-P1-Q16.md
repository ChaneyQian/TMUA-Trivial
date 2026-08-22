---
database: TMUA
qid: 20132101209116
id: JZMaths_SetE-Mock-P1-Q16
paper: TMUA Mock
year:
number: Q16
section: Multiple Choice
difficulty: 7.5
topics: [Function, Polynomial, Algebra (Basic)]
subtopics: [Algebraic Functions, Solution of Equations, Algebra Manipulation]
tags: [General-Functions, General-Algebra]
status: 已入库
---

## 题目
The function
$$ f(x) = \frac{x}{x^2 + x + 1} $$
is defined for all real $x$. Find the difference between its maximum and minimum values.

$$ \mathbf{A} \quad \frac{4}{3} $$
$$ \mathbf{B} \quad \frac{2}{3} $$
$$ \mathbf{C} \quad \frac{5}{4} $$
$$ \mathbf{D} \quad \frac{3}{2} $$
$$ \mathbf{E} \quad 3 $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Let $y = f(x)$. Since $x^2 + x + 1 > 0$ for all $x$, we can write $y(x^2 + x + 1) = x$, that is
$$ yx^2 + (y - 1)x + y = 0. $$

As a quadratic in $x$, for a real solution $x$ to exist, the quadratic in $x$ needs non-negative discriminant:
$$ (y - 1)^2 - 4y^2 \ge 0 \quad \Rightarrow \quad (3y - 1)(y + 1) \le 0, $$
so $-1 \le y \le \frac{1}{3}$. The maximum value is $\frac{1}{3}$ and the minimum is $-1$, and the difference is $\frac{4}{3}$.
