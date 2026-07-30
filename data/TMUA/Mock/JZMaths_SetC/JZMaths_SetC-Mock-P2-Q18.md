---
database: TMUA
qid: 20132101207218
id: JZMaths_SetC-Mock-P2-Q18
paper: TMUA Mock
year:
number: Q18
section: Multiple Choice
difficulty: 8
topics: []
subtopics: []
tags: [Inequalities, General Algebra]
status: 已入库
---

## 题目
Let $f(x) = x^3 - px^2 - p^2x + k$ where $k$ is a real constant. Suppose that $p$ and $q$ are real numbers satisfying $-3 \le p \le 3$ and $-3 \le q \le 3$.

The function $f$ has non-negative gradient at $x = q$.

Find the area of the region of all possible points $(p,q)$ in the $p$-$q$ plane.

$$ \mathbf{A} \quad 20 $$
$$ \mathbf{B} \quad 21 $$
$$ \mathbf{C} \quad 24 $$
$$ \mathbf{D} \quad 30 $$
$$ \mathbf{E} \quad 36 $$
$$ \mathbf{F} \quad 42 $$
$$ \mathbf{G} \quad 56 $$
$$ \mathbf{H} \quad 60 $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
We have $f'(x) = 3x^2 - 2px - p^2$. Since $f$ has non-negative gradient at $x = q$, we need

$$ 3q^2 - 2pq - p^2 \ge 0. $$

Notice that $p$ is a root, so $(q - p)$ is a factor, and factorising gives

$$ 3q^2 - 2pq - p^2 = (3q + p)(q - p). $$

So we need

$$ (3q + p)(q - p) \ge 0. $$

Therefore $q - p \ge 0$ and $3q + p \ge 0$, or $q - p \le 0$ and $3q + p \le 0$. See the diagram below.

![[Image/JZMaths_SetC-Mock-P2-Q18-fig1.png]]

The regions are congruent when split at $p=0$, so we can just work out the right side, and then double the area.

The entire right half of the square is a rectangle of area $3 \times 6 = 18$.

The unshaded region between the two lines is a triangle. Its vertical side lies on $p=3$, between $(3, -1)$ and $(3, 3)$, so its base has length $4$. Its perpendicular height is $3$. Hence its area is $\frac{1}{2} \times 4 \times 3 = 6$.

Therefore, the shaded area for $p \geq 0$ is $18 - 6 = 12$, and the total for the region is twice of this which is $24$.
