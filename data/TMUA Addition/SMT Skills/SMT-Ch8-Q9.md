---
database: MAT
qid: 90020360900
id: SMT-Ch8-Q9
paper: SMT Skills Ch8
year:
number: Q9
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
The function $F(n)$ is defined for positive integers $n$ by
$F(n) = \text{the sum of the squares of the digits of } n.$
For example $F(234) = 2^2 + 3^2 + 4^2 = 29$.
$\sum_{r=1}^{50} F(r)$ is equal to

(a) $1650$
(b) $1710$
(c) $1725$
(d) $1750$
(e) $1800$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 8 章 Sequences and series 章末 MAT style 第 9 题；解析为书后官方 worked solution。

## 答案
D

## 解析
Split the range at the points where the number of digits or the tens digit changes.

For $r = 1$ to $9$ the number has one digit, so $F(r) = r^2$ and

$$\sum_{r=1}^{9} F(r) = 1^2 + 2^2 + \dots + 9^2 = \frac{9 \times 10 \times 19}{6} = 285.$$

For $r = 10$ to $49$ write $r = 10t + u$ with $t \in \{1,2,3,4\}$ and $u \in \{0,1,\dots,9\}$, so that $F(r) = t^2 + u^2$. Each tens digit occurs with all ten units digits and each units digit occurs with all four tens digits, so

$$\begin{aligned}
\sum_{r=10}^{49} F(r) &= 10\left(1^2 + 2^2 + 3^2 + 4^2\right) + 4\left(0^2 + 1^2 + \dots + 9^2\right) \
&= 10 \times 30 + 4 \times 285 \
&= 300 + 1140 = 1440.
\end{aligned}$$

Finally $F(50) = 5^2 + 0^2 = 25$. Adding the three pieces,

$$\sum_{r=1}^{50} F(r) = 285 + 1440 + 25 = 1750.$$

The correct answer is (d).

Option (c), $1725$, is what you get by stopping at $r = 49$ and then adding $F(50)$ incorrectly; option (a), $1650$, drops the contribution of the tens digits entirely.
