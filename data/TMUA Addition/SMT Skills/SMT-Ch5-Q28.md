---
database: MAT
qid: 90020332800
id: SMT-Ch5-Q28
paper: SMT Skills Ch5
year:
number: Q28
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
For a real number $x$ we denote by $\lfloor x \rfloor$ the largest integer less than or equal to $x$.
Let $f(x) = x + \left\lfloor \frac{x}{2} \right\rfloor$.
The value of $\int_0^4 f(x) \, \text{d}x$ is

(a) $4$
(b) $8$
(c) $10$
(d) $16$
(e) $20$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 5 章 Functions 章末 MAT style 第 28 题；解析为书后官方 worked solution。

## 答案
C

## 解析
$\left\lfloor \frac{x}{2} \right\rfloor = 0$ for $0 \leq x < 2$

$\left\lfloor \frac{x}{2} \right\rfloor = 1$ for $2 \leq x < 4$

When $x = 4$,$\ \left\lfloor \frac{x}{2} \right\rfloor = 2$

$$
\int_{0}^{4}{x + \left\lfloor \frac{x}{2} \right\rfloor}\ dx = \int_{0}^{2}x\ dx + \int_{2}^{4}{x + 1}\ dx = \left\lbrack \frac{x^{2}}{2} \right\rbrack_{0}^{2} + \left\lbrack \frac{x^{2}}{2} + x \right\rbrack_{2}^{4}
$$

$$
= (2 - 0) + (8 + 4 - 2 - 2) = 10
$$

The correct answer is (c)
