---
database: TMUA
qid: 20132101203102
id: Yotta-Mock-P1-Q2
paper: TMUA Mock
year:
number: Q2
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
A cubic function $f(x)$ is such that $f(2) = 4$, $f(3) = 9$, $f(-1) = 1$, and the coefficient of $x^3$ is 2. Find $f(4)$.

$$
\mathbf{A} \quad -16
$$

$$
\mathbf{B} \quad 6
$$

$$
\mathbf{C} \quad 16
$$

$$
\mathbf{D} \quad 32
$$

$$
\mathbf{E} \quad 36
$$

$$
\mathbf{F} \quad 46
$$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
The three given values satisfy $f(2) = 4 = 2^{2}$, $f(3) = 9 = 3^{2}$ and $f(-1) = 1 = (-1)^{2}$, which suggests comparing $f$ with $x^{2}$.

Let $g(x) = f(x) - x^{2}$. Since $f$ is a cubic with leading coefficient $2$, so is $g$, and $g(2) = g(3) = g(-1) = 0$. A cubic has at most three roots, so these are all of them and

$$ g(x) = 2(x-2)(x-3)(x+1) $$

Hence $f(x) = 2(x-2)(x-3)(x+1) + x^{2}$, and

$$ f(4) = 2(2)(1)(5) + 16 = 20 + 16 = 36 $$

The answer is E.
