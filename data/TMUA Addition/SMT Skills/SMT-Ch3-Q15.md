---
database: MAT
qid: 90020311500
id: SMT-Ch3-Q15
paper: SMT Skills Ch3
year:
number: Q15
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
Let $a$ and $b$ be integers. Then
$$ \frac{2^{3a-2b} \times 3^{a+3b} \times 5^b}{4^a \times 5^{a-b} \times 6^{a-2b} \times 9^b \times 15^{2b-a}} $$
is an integer if

(a) $a > 0$
(b) $a \ge b$
(c) $a + b \ge 0$
(d) $a + b < 0$
(e) $b > 0$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 3 章 Algebra 章末 MAT style 第 15 题；解析为书后官方 worked solution。

## 答案
C

## 解析
$$
\frac{2^{3a - 2b} \times 3^{a + 3b} \times 5^{b}}{4^{a} \times 5^{a - b} \times 6^{a - 2b} \times 9^{b} \times 15^{2b - a}} = \frac{2^{3a - 2b} \times 3^{a + 3b} \times 5^{b}}{2^{2a} \times 5^{a - b} \times 2^{a - 2b} \times 3^{a - 2b} \times 3^{2b} \times 3^{2b - a} \times 5^{2b - a}}
$$

$$
= 2^{3a - 2b - 2a - (a - 2b)} \times 3^{a + 3b - (a - 2b) - 2b - (2b - a)} \times 5^{b - (a - b) - (2b - a)}
$$

$$
= 2^{0} \times 3^{a + b} \times 5^{0}
$$

$$
= 3^{a + b}.
$$
$3^{a + b}$ is an integer precisely when $a + b \geq 0$. The answer is (c).
