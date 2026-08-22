---
database: TMUA
qid: 20132101204004
id: Zack-Mock-Q4
paper: TMUA Mock
year:
number: Q4
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
For what values of $x$ is
$$ x + 3 = 1 + 1 + x + 1 + 2x + x^2 + 1 + 3x + 3x^2 + x^3 + \dots $$

$$
\mathbf{A} \quad -1
$$

$$
\mathbf{B} \quad 0
$$

$$
\mathbf{C} \quad \frac{-3-\sqrt{5}}{2}
$$

$$
\mathbf{D} \quad \frac{-3+\sqrt{5}}{2}
$$

$$
\mathbf{E} \quad \frac{-3-\sqrt{5}}{2} \text{ and } \frac{-3+\sqrt{5}}{2}
$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Read the right-hand side by rows: the terms are $1$, then $1+x$, then $1+2x+x^{2}$, then $1+3x+3x^{2}+x^{3}$ — these are the binomial expansions of $(1+x)^{0}, (1+x)^{1}, (1+x)^{2}, (1+x)^{3},\dots$ So it is a geometric series with ratio $1+x$:

$$ \sum_{k=0}^{\infty}(1+x)^{k} = \frac{1}{1-(1+x)} = -\frac{1}{x}, \qquad \text{valid only for } |1+x|<1 \text{, i.e. } -2<x<0 $$

Setting $x+3 = -\dfrac{1}{x}$ gives $x^{2}+3x+1 = 0$, so $x = \dfrac{-3\pm\sqrt5}{2}$.

Now apply the convergence condition. $\dfrac{-3+\sqrt5}{2} \approx -0.38$ lies in $(-2,0)$ and is genuine, while $\dfrac{-3-\sqrt5}{2} \approx -2.62$ does not — there the series diverges and the equation is meaningless.

Only one root survives, so the answer is D. Option E is the trap: it is what you get if you solve the quadratic and forget where the series converges.
