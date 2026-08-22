---
database: TMUA
qid: 20132101202109
id: Zetta-Mock-P1-Q9
paper: TMUA Mock
year:
number: Q9
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
A circle of radius $r$ is *dropped* into the curve $y = x^2$ such that it only touches the curve.

![[Image/Zetta-Mock-P1-Q9-fig1.png]]

The circle's center is $(0, c)$
Express $c$ in terms of $r$.

$$
\mathbf{A} \quad \frac{1 + 2r^2}{2}
$$

$$
\mathbf{B} \quad \frac{1 - 4r^2}{4}
$$

$$
\mathbf{C} \quad \frac{4r}{r^2 - 2}
$$

$$
\mathbf{D} \quad \frac{r^2}{4} - 1
$$

$$
\mathbf{E} \quad \frac{1 + 4r^2}{4}
$$

$$
\mathbf{F} \quad \frac{1 - 6r^2}{2}
$$

$$
\mathbf{G} \quad \frac{r^3 - r}{4}
$$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
![[Image/Zetta-Mock-P1-Q9-sol1.png]]

Let $(x,x^{2})$ be a point of the parabola. Its squared distance to the centre $(0,c)$ is

$$ D = x^{2}+(x^{2}-c)^{2} $$

Write $u = x^{2} \geq 0$, so $D = u+(u-c)^{2} = u^{2}+(1-2c)u+c^{2}$, a quadratic in $u$.

The circle touches the curve exactly when the minimum of $D$ equals $r^{2}$. That minimum is at $u = \dfrac{2c-1}{2}$, which is a legitimate value of $u$ (it is non-negative) precisely when $c>\tfrac12$ — the case drawn, where the circle rests on two symmetric contact points rather than sitting on the vertex. There,

$$ D_{\min} = c^{2}-\frac{(2c-1)^{2}}{4} = \frac{4c-1}{4} $$

Setting $D_{\min}=r^{2}$ gives $4c-1 = 4r^{2}$, so

$$ c = \frac{1+4r^{2}}{4} $$

The answer is E.
