---
database: TMUA
qid: 20132101206216
id: JZMaths_SetB-Mock-P2-Q16
paper: TMUA Mock
year:
number: Q16
section: Multiple Choice
difficulty: 7.5
topics: []
subtopics: []
tags: [Integration, Inequalities]
status: 已入库
---

## 题目
Let

$$ W = \int_{0}^{1} 4^{\sqrt{x}} \,dx, \quad X = \int_{1}^{2} 2^{\sqrt{x-1}} \,dx, \quad Y = \int_{0}^{1/2} 2 \cdot 2^{2x} \,dx, \quad Z = \int_{-1}^{1} \frac{1}{2}(\sqrt{2})^{(x+1)/2} \,dx. $$

Which of the following gives $W$, $X$, $Y$, $Z$ in order from **smallest to largest**?

$$ \mathbf{A} \quad Z < Y < X < W $$
$$ \mathbf{B} \quad W < X < Y < Z $$
$$ \mathbf{C} \quad Z < X < Y < W $$
$$ \mathbf{D} \quad Y < Z < X < W $$
$$ \mathbf{E} \quad Z < Y < W < X $$
$$ \mathbf{F} \quad X < Z < Y < W $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
This question is about using transformations to transform the integrals to a comparable form.

The integral $W = \int_{0}^{1} 4^{\sqrt{x}} \,dx = \int_{0}^{1} 2^{2\sqrt{x}} \,dx$.

The integral $X = \int_{1}^{2} 2^{\sqrt{x-1}} \,dx$, we transform to the left by 1 unit, this changes $x$ to $x+1$, and move the range $[1, 2]$ to $[0, 1]$. So that $X = \int_{0}^{1} 2^{\sqrt{x}} \,dx$.

The integral $Y = \int_{0}^{1/2} 2 \cdot 2^{2x} \,dx$, we transform by stretching it horizontally by factor of 2, to enlarge the range from $[0, 1/2]$ to $[0, 1]$, this changes $x$ to $x/2$, to make the area the same as before, we also have to multiply by $1/2$. Therefore

$$ Y = \int_{0}^{1/2} 2 \cdot 2^{2x} \,dx = \int_{0}^{1} 2 \cdot 2^{2(x/2)} \,dx \times \frac{1}{2} = \int_{0}^{1} 2^{x} \,dx. $$

The integral $Z = \int_{-1}^{1} \frac{1}{2}(\sqrt{2})^{(x+1)/2} \,dx$ is the most tricky, but its range tell us a sensible transformation scheme: $[-1, 1]$ to $[0, 2]$, then $[0, 2]$ to $[0, 1]$. The first transformation changes $x$ to $x-1$, the second
changes $x$ to $2x$ which is a horizontal stretch by scale factor $1/2$, thus we also need to times the area by 2 to preserve the original area. Therefore
$$
Z=\int_0^2\frac12(\sqrt{2})^{(x-1+1)/2}\,dx
=\int_0^1\frac12(\sqrt{2})^{(2x)/2}\,dx\times 2
=\int_0^1(\sqrt{2})^x\,dx
=\int_0^1 2^{x/2}\,dx.
$$

So the question is equivalent to comparing
$$
W=\int_0^1 2^{2\sqrt{x}}\,dx,\qquad
X=\int_0^1 2^{\sqrt{x}}\,dx,\qquad
Y=\int_0^1 2^x\,dx,\qquad
Z=\int_0^1 2^{x/2}\,dx.
$$

Since $2^t$ is strictly increasing, the ordering of the four integrands on $(0,1)$ is determined by the ordering of their exponents:
$$
2\sqrt{x}\geq \sqrt{x}\geq x\geq \frac{x}{2},
$$
with equality only sometimes occurring on the end points 0 and 1, this is enough for us to immediately deduce:
$$
W>X>Y>Z
\quad\text{or}\quad
Z<Y<X<W.
$$

**Remark:** You can derive at the comparable integrals also by **integration by substitution**, though the intention here is to get the student to do the question using transformations, this is faster if you are familiar with the technique.
