---
database: TMUA
qid: 20132101202117
id: Zetta-Mock-P1-Q17
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
Three circles of radius $s$ are drawn in the first quadrant of the $xy$-plane. The first circle is tangent to both axes, the second is tangent to the first circle and the $x$-axis, and the third is tangent to the first circle and the $y$-axis. A circle of radius $r > s$ is tangent to both axes and to the second and third circles. What is $r/s$?

![[Image/Zetta-Mock-P1-Q17-fig1.png]]

$$
\mathbf{A} \quad 5
$$

$$
\mathbf{B} \quad 6
$$

$$
\mathbf{C} \quad 8
$$

$$
\mathbf{D} \quad 9
$$

$$
\mathbf{E} \quad 10
$$

$$
\mathbf{F} \quad 12
$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
![[Image/Zetta-Mock-P1-Q17-sol1.png]]

A circle of radius $\rho$ tangent to both axes in the first quadrant has centre $(\rho,\rho)$. So the first small circle is centred at $(s,s)$ and the big one at $(r,r)$.

The second circle has radius $s$ and touches the $x$-axis, so its centre is at height $s$; touching the first circle puts the centres $2s$ apart, giving centre $(3s,s)$. By symmetry the third is centred at $(s,3s)$.

The big circle touches the second circle externally, so the distance between their centres is $r+s$:

$$ (r-3s)^{2}+(r-s)^{2} = (r+s)^{2} $$

$$ r^{2}-6rs+9s^{2}+r^{2}-2rs+s^{2} = r^{2}+2rs+s^{2} \implies r^{2}-10rs+9s^{2} = 0 $$

$$ (r-s)(r-9s) = 0 $$

Since $r>s$ we need $r = 9s$, so $\dfrac{r}{s} = 9$.

The answer is D.
