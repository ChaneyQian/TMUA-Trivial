---
database: MAT
qid: 90020360600
id: SMT-Ch8-Q6
paper: SMT Skills Ch8
year:
number: Q6
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
A sequence $t_n$ has the property that
$t_{n+1} = \frac{6t_n}{t_{n-1}}$
for every $n \ge 2$.
Given that $a_1 = 3$ and $a_2 = 12$, what is $a_{2020}$?

(a) $1.5$
(b) $3$
(c) $6$
(d) $12$
(e) $24$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 8 章 Sequences and series 章末 MAT style 第 6 题；解析为书后官方 worked solution。

## 答案
D

## 解析
The question writes the recurrence with $t$ and the data with $a$; they are the same sequence. Just generate terms.

$$a_3 = \frac{6 \times 12}{3} = 24, \quad a_4 = \frac{6 \times 24}{12} = 12, \quad a_5 = \frac{6 \times 12}{24} = 3,$$

$$a_6 = \frac{6 \times 3}{12} = \frac{3}{2}, \quad a_7 = \frac{6 \times \frac{3}{2}}{3} = 3, \quad a_8 = \frac{6 \times 3}{\frac{3}{2}} = 12.$$

Since $a_7 = a_1$ and $a_8 = a_2$, and each term is determined by the two before it, the sequence is periodic with period $6$:

$$3,\ 12,\ 24,\ 12,\ 3,\ \frac{3}{2},\ 3,\ 12,\ 24,\ \dots$$

Now $2020 = 6 \times 336 + 4$, so $a_{2020} = a_4 = 12$.

The correct answer is (d).

Options (b) and (a) are what you get from the off-by-one errors $2020 \equiv 1$ or $2020 \equiv 0 \pmod 6$; note that $2016$, not $2020$, is the multiple of $6$.
