---
database: MAT
qid: 90020332600
id: SMT-Ch5-Q26
paper: SMT Skills Ch5
year:
number: Q26
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
How many real distinct solutions does the following equation have?
$$ \log_{(x^2 + x - 3)} (x^3 + 3x^2 + 6x + 9) = 2 $$

(a) $0$
(b) $1$
(c) $2$
(d) $3$
(e) $4$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 5 章 Functions 章末 MAT style 第 26 题；解析为书后官方 worked solution。

## 答案
B

## 解析
The first thing to note is that as $x^{2} + x - 3$ is the base of a logarithm, it must be greater than $0$.

The equation can be rewritten as

$\left( x^{2} + x - 3 \right)^{2} = x^{3} + 3x^{2} + 6x + 9$

$x^{4} + 2x^{3} - 5x^{2} - 6x + 9 = x^{3} + 3x^{2} + 6x + 9$

$x^{4} + x^{3} - 8x^{2} - 12x = 0$

$x\left( x^{3} + x^{2} - 8x - 12 \right) = 0$

$x(x - 3)(x + 2)^{2} = 0$ (\*)

There are three solutions to the equation (\*)

When $x = 0$, $x^{2} + x - 3 = - 3$ which is not greater than $0$.

When $x = - 2$, $x^{2} + x - 3 = - 1$ which is not greater than $0$.

When $x = 3$, $x^{2} + x - 3 = 9$ which is greater than $0$.

So x = 3 is the only solution to the equation.

The correct answer is (b)
