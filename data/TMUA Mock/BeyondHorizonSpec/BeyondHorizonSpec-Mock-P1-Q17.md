---
database: TMUA
qid: 20132101215117
id: BeyondHorizonSpec-Mock-P1-Q17
paper: TMUA Mock
year:
number: Q17
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Let the functions $f(x) = \lfloor x \rfloor$ and $g(x) = \lceil x \rceil$ be defined on the interval $[2.3, 5.7]$, where $\lfloor x \rfloor$ is the greatest integer less than or equal to $x$, and $\lceil x \rceil$ is the smallest integer greater than or equal to $x$.

Calculate the exact area enclosed between $f(x)$ and $g(x)$ over the interval $[2.3, 5.7]$:
$$Area = \int_{2.3}^{5.7} (g(x) - f(x))\,dx.$$
$$\mathbf{A} \quad 3.4$$
$$\mathbf{B} \quad 4.0$$
$$\mathbf{C} \quad 4.4$$
$$\mathbf{D} \quad 5.0$$
$$\mathbf{E} \quad 5.4$$
$$\mathbf{F} \quad 6.0$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
For any non-integer $x$ the ceiling exceeds the floor by exactly one, so $g(x) - f(x) = 1$; at an integer the two agree and the difference is 0. On $[2.3, 5.7]$ the exceptional points are just $x = 3, 4, 5$, a finite set which cannot affect the value of the integral. The integrand is therefore 1 except at three points, and the area is simply the length of the interval:
$$\int_{2.3}^{5.7} 1\,dx = 5.7 - 2.3 = 3.4.$$
The answer is A.
