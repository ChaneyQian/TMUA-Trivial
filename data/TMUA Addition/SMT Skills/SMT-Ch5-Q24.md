---
database: MAT
qid: 90020332400
id: SMT-Ch5-Q24
paper: SMT Skills Ch5
year:
number: Q24
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
The polynomial $P_n$ is defined by
$$ P_n(x) = (x - 2n + 1) + (2x - 2n + 3) + (3x - 2n + 5) + \dots + (nx - 1) $$
Given that $n \ge 2$, what is the remainder when $P_n(x)$ is divided by $P_{n-1}(x)$?

(a) $\frac{n^2 - 1}{2}$
(b) $n$
(c) $-1$
(d) $1$
(e) $\frac{n}{2}$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 5 章 Functions 章末 MAT style 第 24 题；解析为书后官方 worked solution。

## 答案
C

## 解析
The answer can be found by using a simple value for $n$

If $n = 3$ then

$p_{3}(x) = (x - 5) + (2x - 3) + (3x - 1) = 6x - 9$

$p_{2}(x) = (x - 3) + (2x - 1) = 3x - 4$

Using the remainder theorem with $x = \frac{4}{3}$

$p_{3}\left( \frac{4}{3} \right) = 6 \times \frac{4}{3} - 9 = 8 - 9 = - 1$

It looks like (c) is the correct answer. To confirm this the other values can be checked

$n = 3$ (a) $\frac{n^{2} - 1}{2} = \frac{9 - 1}{2} = 4$, (b) $n = 3$, (d) $1 \neq - 1$, (e) $\frac{n}{2} = \frac{3}{2}$

The correct answer is (c)
