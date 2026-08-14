---
database: TMUA
qid: 20132101209210
id: JZMaths_SetE-Mock-P2-Q10
paper: TMUA Mock
year:
number: Q10
section: Multiple Choice
difficulty: 7
topics: [Polynomial]
subtopics: [Factor and Remainder Theorem, Polynomials]
tags: [Polynomial-Expansions, General-Number-of-Solutions]
status: 已入库
---

## 题目
A polynomial $p(x)$ has degree at most 3. When $p(x)$ is divided by $x-1$, $x-2$ and $x-4$, the remainders are 1, 2 and 4 respectively.

It is also known that $p(0) = 0$.

Find the coefficient of $x^3$ in $p(x)$.
$$ \mathbf{A} \quad -3 $$
$$ \mathbf{B} \quad -2 $$
$$ \mathbf{C} \quad -1 $$
$$ \mathbf{D} \quad 0 $$
$$ \mathbf{E} \quad 1 $$
$$ \mathbf{F} \quad 2 $$
$$ \mathbf{G} \quad 3 $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
The remainder conditions imply:
$$ p(1) = 1, \qquad p(2) = 2, \qquad p(4) = 4, $$
and we are also given $p(0) = 0$.

Now consider
$$ q(x) = p(x) - x. $$

The polynomial $q$ has degree at most 3, and it has roots
$$ 0, 1, 2, 4. $$

A non-zero polynomial of degree at most 3 cannot have four distinct roots, so $q(x)$ is the zero polynomial. Hence
$$ p(x) = x. $$
The coefficient of $x^3$ is 0.
