---
database: TMUA
qid: 90020230200
id: SMT-Ch5-Q2
paper: SMT Skills Ch5
year:
number: Q2
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
$f(n+1) = 2f(n) + 3$ if $f(n)$ is odd
$f(n+1) = \frac{1}{2}f(n) + 1$ if $f(n)$ is even
The function $g$ is defined on the positive integers as follows.
$g(1) = 4$ and for $n \ge 1$:
$g(n+1) = \frac{1}{2}(g(n) + 3)$ if $g(n)$ is even
$g(n+1) = 2g(n) + 3$ if $g(n)$ otherwise
What is the value of $f(99) + g(99)$?

$$\mathbf{A} \quad \text{288}$$

$$\mathbf{B} \quad \text{300}$$

$$\mathbf{C} \quad \text{388}$$

$$\mathbf{D} \quad \text{400}$$

$$\mathbf{E} \quad \text{488}$$

$$\mathbf{F} \quad \text{500}$$

$$\mathbf{G} \quad \text{588}$$

$$\mathbf{H} \quad \text{600}$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 5 章 Functions 章末 TMUA style 第 2 题；解析为书后官方 worked solution。

## 答案
B

## 解析
$f(1) = 2,\ f(2) = 2\ldots$ all the values will be $2$ so $f(99) = 2$

$g(1) = 4,\ g(2) = 3.5,\ g(3) = 10,\ g(4) = 6.5,\ g(5) = 16,\ g(6) = 9.5,\ g(7) = 22,\ f(8) = 12.5$

For $n$ odd, the terms are $4,\ 10,\ 16,\ 22,\ \ldots$

This is an arithmetic sequence with $a = 4$ and $d = 6$.

$g(99)$ is the $50$<sup>th</sup> term in the sequence so $g(99) = 4 + 49 \times 6 = 4 + 294 = 298$

Hence $f(99) + g(99) = 2 + 298 = 300$.

The correct answer is B
