---
database: TMUA
qid: 20132101208109
id: JZMaths_SetD-Mock-P1-Q9
paper: TMUA Mock
year:
number: Q9
section: Multiple Choice
difficulty: 6.5
topics: []
subtopics: []
tags: [General Trigonometry, General Algebra]
status: 已入库
---

## 题目
Let $x$ be any real number, find the minimum value of
$$ 4^{\sin^2 x} - 5 \cdot 2^{\sin^2 x} + 7. $$

$$ \mathbf{A} \quad \text{There is no minimum value.} $$
$$ \mathbf{B} \quad 1 $$
$$ \mathbf{C} \quad \frac{5}{4} $$
$$ \mathbf{D} \quad 3 $$
$$ \mathbf{E} \quad 7 $$
$$ \mathbf{F} \quad \frac{3}{4} $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Another completing the square question with a twist!

Let $u = 2^{\sin^2 x}$. Since $\sin^2 x$ takes every value in $[0, 1]$ (and only those values) as $x$ varies over $\mathbb{R}$, $u$ ranges over $[2^0, 2^1] = [1, 2]$.

Note that $4^{\sin^2 x} = (2^{\sin^2 x})^2 = u^2$, so the expression becomes
$$ g(u) = u^2 - 5u + 7 = \left(u - \frac{5}{2}\right)^2 + \frac{3}{4}. $$

The minimum of $g$ is $\frac{3}{4}$ if $u$ is allowed to be $\frac{5}{2}$, it is not! As $u$ varies between $1$ to $2$, given the shape of $g(u)$, the minimum is clearly at $u = 2$:
$$ g(2) = 4 - 10 + 7 = 1. $$
