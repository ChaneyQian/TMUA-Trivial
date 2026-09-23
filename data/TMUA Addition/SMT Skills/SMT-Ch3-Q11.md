---
database: MAT
qid: 90020311100
id: SMT-Ch3-Q11
paper: SMT Skills Ch3
year:
number: Q11
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
If $m$ and $n$ are integers, which of the following statements is true for **all** $m$ and $n$.

(a) $m^2n^4 - m^4n^2$ is a square number.
(b) $mn(3n - 3m + 1) + m^3 + n^3$ is a cube number.
(c) $m^4n^5$ is not a square number.
(d) $m^3(m^3 - 3n^2) + n^2(n^2 + m^3)$ is a square number.
(e) $mn^2$ is not a cube number.

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 3 章 Algebra 章末 MAT style 第 11 题；解析为书后官方 worked solution。

## 答案
D

## 解析
(a): $m^{2}n^{4} - m^{4}n^{2} \equiv m^{2}n^{2}\left( n^{2} - m^{2} \right)$. The left-hand expression is a square number precisely when $n^{2} - m^{2}$ is, but this is not true for all integer values of $m$ and $n$ ($n = 2$ and $m = 1$, for example).
(b): There is no obvious reason to suspect that the given expression should be a cube number for all integer values of $m$ and $n$, so it is worth looking for a counterexample. The value of the expression when $m = n = 1$ is $1 \times 1 + 1 + 1 = 3$, and this is not a cube number. So this is also not true for all integer values of $m$ and $n$.
(c): $m^{4}n^{4} \equiv \left( m^{2}n^{2} \right)^{2}$ is a square number, so $m^{4}n^{5}$ is a square number precisely when $n$ is. In particular, ‘$m^{4}n^{5}$ is not a square number’ is not true for all integer values of $m$ and $n$ ($n = 1$ and $m = 1$, for example).
(d): To show whether this can be written as a square number, you need to expand, simplify and then see if it is possible to factorise.
$m^{3}\left( m^{3} - 3n^{2} \right) + n^{2}\left( n^{2} + m^{3} \right) \equiv m^{6} - 3m^{3}n^{2} + n^{4} + m^{3}n^{2} \equiv m^{6} - 2m^{3}n^{2} + n^{4} \equiv \left( m^{3} - n^{2} \right)^{2}$, showing that this is a square number for all integer values of $m$ and $n$.
(e): Always consider that counterexamples may be easy to find. For example, if $m = n = 1$ then $mn^{2} = 1$, which is a cube number. This shows that ‘$mn^{2}$ is not a cube number’ is not true for all integer values of $m$ and $n$.

The answer is (d).
