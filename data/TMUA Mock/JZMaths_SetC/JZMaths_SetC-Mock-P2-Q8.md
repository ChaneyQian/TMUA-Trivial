---
database: TMUA
qid: 20132101207208
id: JZMaths_SetC-Mock-P2-Q8
paper: TMUA Mock
year:
number: Q8
section: Multiple Choice
difficulty: 6.5
topics: [Polynomial]
subtopics: [Factor and Remainder Theorem, Polynomials]
tags: [Remainder-Theorem]
status: 已入库
---

## 题目
A polynomial $p(x)$ satisfies $p(2) = 7$ and $p(-3) = -8$.

Which of the following can be deduced, where $q(x)$ denotes some polynomial?

$$ \mathbf{A} \quad p(x) = (x + 2)(x - 3) \, q(x) + 3x + 1 $$
$$ \mathbf{B} \quad p(x) = (x - 2)(x + 3) \, q(x) - 3x + 1 $$
$$ \mathbf{C} \quad p(x) = (x - 2)(x + 3) \, q(x) + 3x - 1 $$
$$ \mathbf{D} \quad p(x) = (x - 2)(x + 3) \, q(x) + 3x + 1 $$
$$ \mathbf{E} \quad p(x) = (x - 2)(x + 3) \, q(x) - x + 5 $$
$$ \mathbf{F} \quad p(x) = (x - 2)(x + 3) \, q(x) + x - 5 $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Divide $p(x)$ by the quadratic $(x - 2)(x + 3)$. The remainder must have degree less than $2$, so write

$$ p(x) = (x - 2)(x + 3) \, q(x) + ax + b. $$

Applying the remainder theorem at $x = 2$ and $x = -3$:

$$ p(2) = 2a + b = 7, $$
$$ p(-3) = -3a + b = -8. $$

Subtracting the second from the first gives $5a = 15$, so $a = 3$, and then $b = 7 - 2(3) = 1$.

Hence $p(x) = (x - 2)(x + 3) \, q(x) + 3x + 1$.
