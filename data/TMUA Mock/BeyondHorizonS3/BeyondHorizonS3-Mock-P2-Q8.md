---
database: TMUA
qid: 20132101213208
id: BeyondHorizonS3-Mock-P2-Q8
paper: TMUA Mock
year:
number: Q8
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Let $f$ be a linear function with the properties that $f(1) \leq f(2)$, $f(3) \geq f(4)$, and $f(5) = 5$. Which of the following is true?
$$\mathbf{A} \quad f(0) < 0$$
$$\mathbf{B} \quad f(0) = 0$$
$$\mathbf{C} \quad f(1) < f(0) < f(-1)$$
$$\mathbf{D} \quad f(0) = 5$$
$$\mathbf{E} \quad f(0) > 5$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Write $f(x) = mx + c$ for constants $m$ and $c$.

From $f(1) \leq f(2)$ we get $m + c \leq 2m + c$, i.e. $0 \leq m$. From $f(3) \geq f(4)$ we get $3m + c \geq 4m + c$, i.e. $m \leq 0$. The two inequalities together force $m = 0$, so $f$ is the constant function $f(x) = c$.

The third condition $f(5) = 5$ then gives $c = 5$, so $f(x) = 5$ for every $x$. In particular $f(0) = 5$, which is exactly option D. Options A, B and E all fail because $f(0)$ is exactly $5$, and C fails because $f(1) = f(0) = f(-1) = 5$, so the strict inequalities do not hold. The answer is D.
