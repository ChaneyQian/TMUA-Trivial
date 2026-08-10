---
database: TMUA
qid: 20132101205214
id: JZMaths_SetA-Mock-P2-Q14
paper: TMUA Mock
year:
number: Q14
section: Multiple Choice
difficulty: 7
topics: [Calculus, Function]
subtopics: [Differentiation Application, Algebraic Functions]
tags: [Logic Sufficiency, Differentiation]
status: 已入库
---

## 题目
Given curve $y = -\frac{1}{3}x^3 + a^2x + a$, has a local minimum in the second quadrant, find the possible values of $a$.
$$ \mathbf{A} \quad 0 < a < \sqrt{\frac{3}{2}} $$
$$ \mathbf{B} \quad \text{Any } a \text{ such that } a \neq 0 $$
$$ \mathbf{C} \quad -\sqrt{\frac{3}{2}} < a < \sqrt{\frac{3}{2}} \text{ with } a \neq 0 $$
$$ \mathbf{D} \quad -\sqrt{3} < a < 0 $$
$$ \mathbf{E} \quad 0 < a < \sqrt{3} $$
$$ \mathbf{F} \quad -\sqrt{3} < a < \sqrt{3} \text{ with } a \neq 0 $$
$$ \mathbf{G} \quad \text{There are no possible values of } a. $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
First note $a \neq 0$ or else $y = -1/3x^3$ has no local minimum.

Differentiate: $y' = -x^2 + a^2 = -(x - a)(x + a)$, so the stationary points are at $x = a, -a$ with corresponding $y = \frac{2}{3}a^3 + a, -\frac{2}{3}a^3 + a$.

Due to the shape of the cubic, the local minimum must be the one with the smaller $x$-coordinate.

Suppose $a < 0$, then the 2nd quadrant minimum has $x = a$, but its $y = \frac{2}{3}a^3 + a < 0$, which puts it in 3rd quadrant, so this can't work.

Therefore $a > 0$, and the 2nd quadrant minimum has $x = -a$, and we need its $y > 0$:

$$ -\frac{2}{3}a^3 + a > 0 \quad \Leftrightarrow \quad -\frac{2}{3}a^2 + 1 > 0 \quad \Leftrightarrow \quad 0 < a < \sqrt{\frac{3}{2}}. $$

In the last steps, we are relying on $a > 0$.
