---
database: TMUA
qid: 20132101213217
id: BeyondHorizonS3-Mock-P2-Q17
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
For all $x$ such that $1 \leq x \leq 3$, the inequality $(x-3a)(x-a-3) < 0$ holds for
$$\mathbf{A} \quad \text{no value of } a$$
$$\mathbf{B} \quad \text{all } a \text{ satisfying } \frac{2}{3} < a < 1$$
$$\mathbf{C} \quad \text{all } a \text{ satisfying } 0 < a < \frac{1}{3}$$
$$\mathbf{D} \quad \text{all } a \text{ satisfying } \frac{1}{3} < a < \frac{2}{3}$$
$$\mathbf{E} \quad \text{all } a \text{ satisfying } 0 < a < \frac{2}{3}$$
$$\mathbf{F} \quad \text{all } a \text{ satisfying } 0 < a < 1$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
The quadratic in $x$ has roots $3a$ and $a+3$, and since the coefficient of $x^2$ is positive the product is negative exactly for $x$ strictly between the two roots. So we need the closed interval $[1,3]$ to lie strictly inside the open interval determined by the roots.

If $3a < a + 3$, i.e. $a < \tfrac{3}{2}$, the requirement is
$$3a < 1 \quad \text{and} \quad a + 3 > 3,$$
which gives $a < \tfrac{1}{3}$ and $a > 0$, that is $0 < a < \tfrac{1}{3}$.

If $3a > a + 3$, i.e. $a > \tfrac{3}{2}$, the roles swap and we would need $a + 3 < 1$, i.e. $a < -2$, contradicting $a > \tfrac{3}{2}$. If $a = \tfrac{3}{2}$ the roots coincide and the expression is $(x - 4.5)^2 \geq 0$, never negative.

So the condition holds precisely when $0 < a < \tfrac{1}{3}$; note for instance that $a = \tfrac{1}{2}$ fails at $x = 1$ because $(1 - 1.5)(1 - 3.5) = 1.25 > 0$, which kills options B, D, E and F. The answer is C.
