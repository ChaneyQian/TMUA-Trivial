---
database: TMUA
qid: 20132101203210
id: Yotta-Mock-P2-Q10
paper: TMUA Mock
year:
number: Q10
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Find the full range of values of the real number $k$ such that
$$ \ln(x)^2 + \ln\left(\frac{1}{x^6}\right) + k = 0 $$
has exactly 2 real solutions.

$$
\mathbf{A} \quad k > 9
$$

$$
\mathbf{B} \quad k < 9
$$

$$
\mathbf{C} \quad k > 0
$$

$$
\mathbf{D} \quad k < 0
$$

$$
\mathbf{E} \quad 0 < k < 9
$$

$$
\mathbf{F} \quad k < 0, k > 9
$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
The equation only makes sense for $x > 0$. There $\ln\left(\frac{1}{x^{6}}\right) = \ln\left(x^{-6}\right) = -6\ln x$, so with $u = \ln x$ the equation becomes

$$ u^{2} - 6u + k = 0 $$

As $x$ ranges over $(0,\infty)$, $u = \ln x$ ranges over all of $\mathbb{R}$, once each. So distinct real roots $u$ correspond one-to-one with distinct real solutions $x$, and we need the quadratic to have exactly two distinct real roots:

$$ \Delta = 36 - 4k > 0 \implies k < 9 $$

The answer is B.
