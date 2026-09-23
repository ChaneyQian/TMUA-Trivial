---
database: MAT
qid: 90020332300
id: SMT-Ch5-Q23
paper: SMT Skills Ch5
year:
number: Q23
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
$a$ and $b$ are non-zero integers. When the polynomial $x^2 - 2ax - a^2$ is divided by $x - b$, the remainder is $1$. The polynomial $4bx^2 - 6x + 6$ has $2x - a$ as a factor.
It follows that $a + b$ equals

(a) $-5$
(b) $-3$
(c) $-1$
(d) $0$
(e) $5$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 5 章 Functions 章末 MAT style 第 23 题；解析为书后官方 worked solution。

## 答案
C

## 解析
$x^{2} - 2ax - a^{2}$ divided by $x - b$ remainder $1$

$4bx^{2} - 6x - 10$ divided by $2x - a$ remainder $0$

Using the remainder theorem

$x = b$ in $x^{2} - 2ax - a^{2}$ gives $b^{2} - 2ab - a^{2} = 1$ A

Using the factor theorem

$x = \frac{a}{2}$ in $4bx^{2} - 6x - 10$ gives $a^{2}b - 3a - 10 = 0$ B

From A

$a^{2} + 2ab + 1 - b^{2} = 0$

Completing the square for $a$ gives

$(a + b)^{2} + 1 - 2b^{2} = 0$

$(a + b)^{2} = 2b^{2} - 1$

From the options, if $a + b = \pm 5$ (options (a) and (e)) then

$2b^{2} - 1 = 25$ but this means that $b$ is not an integer as specified in the question so (a) and (e) can be eliminated.

If $a + b = - 3$ then $2b^{2} - 1 = 9$ and again, $b$ is not an integer so (b) can be eliminated

If $a + b = - 1$ then $2b^{2} - 1 = 1$ giving $b = \pm 1$ since $a + b = - 1$, $b$ must be $+ 1$ otherwise $a = 0$. So it is possible that (c) is correct with $b = 1$ and $a = - 2$

If $a + b = 0$ then $2b^{2} - 1 = 0$ and again, $b$ is not an integer.

\(c\) is the correct answer.

A final substituting $a = - 2$ and $b = 1$ into the LHS of B: $a^{2}b - 3a - 10 = 0$ gives

$4 + 6 - 10 = 0$ which is consistent.

The correct answer is (c)
