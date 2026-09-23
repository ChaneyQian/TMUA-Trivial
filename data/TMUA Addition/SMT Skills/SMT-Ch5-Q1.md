---
database: TMUA
qid: 90020230100
id: SMT-Ch5-Q1
paper: SMT Skills Ch5
year:
number: Q1
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
The function $f$ is defined on the positive integers as follows.
$f(1) = 2$ and for $n \ge 1$:
$f(n+1) = 5f(n) + 1$ if $f(n)$ is odd
$f(n+1) = \frac{1}{2}f(n)$ if $f(n)$ is even
What is the value of $\sum_{r=1}^{100} f(r)$?

$$\mathbf{A} \quad \text{523}$$

$$\mathbf{B} \quad \text{535}$$

$$\mathbf{C} \quad \text{546}$$

$$\mathbf{D} \quad \text{560}$$

$$\mathbf{E} \quad \text{563}$$

$$\mathbf{F} \quad \text{600}$$

$$\mathbf{G} \quad \text{603}$$

$$\mathbf{H} \quad \text{640}$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 5 章 Functions 章末 TMUA style 第 1 题；解析为书后官方 worked solution。

## 答案
E

## 解析
$f(1) = 2,\ f(2) = 1,\ f(3) = 6,\ f(4) = 3,\ f(5) = 16,\ f(6) = 8,\ f(7) = 4,\ f(8) = 2$

Since $f(8) = f(1) = 2$, the values will repeat in sets of the seven values $2,\ 1,\ 6,\ 3,\ 16,\ 8,\ 4$

$\frac{100}{7} = 14\frac{2}{7}$ so there will be 14 complete sets followed by $2,\ 1$

$$
\sum_{r = 1}^{100}{f(r)} = 14(2 + 1 + 6 + 3 + 16 + 8 + 4) + 1 + 2 = 14 \times 40 + 3
$$

The answer is E
