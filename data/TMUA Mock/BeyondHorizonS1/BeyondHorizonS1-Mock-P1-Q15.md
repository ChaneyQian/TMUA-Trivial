---
database: TMUA
qid: 20132101211115
id: BeyondHorizonS1-Mock-P1-Q15
paper: TMUA Mock
year:
number: Q15
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The values of $m$ for which $mx^2 - 6mx + 5m + 1 > 0$ for all real $x$ is
$$\mathbf{A} \quad 0 < m < \frac{1}{4}$$
$$\mathbf{B} \quad 0 \leq m < \frac{1}{8}$$
$$\mathbf{C} \quad m > 0$$
$$\mathbf{D} \quad 0 \leq m < \frac{1}{4}$$
$$\mathbf{E} \quad m < 0$$
$$\mathbf{F} \quad m = 0$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
The case $m = 0$ has to be treated separately, and it works: the expression collapses to the constant $1$, which is indeed positive for all $x$. If $m < 0$ the parabola opens downwards and tends to $-\infty$, so it fails. If $m > 0$ the parabola opens upwards and stays positive precisely when its discriminant is negative:
$$36m^2 - 4m(5m+1) < 0 \implies 16m^2 - 4m < 0 \implies 4m(4m-1) < 0$$
which for positive $m$ means $m < \tfrac14$. Combining the two surviving cases gives $0 \leq m < \tfrac14$. The answer is D. Option A is the trap for anyone who divides by $m$ without checking $m = 0$ first.
