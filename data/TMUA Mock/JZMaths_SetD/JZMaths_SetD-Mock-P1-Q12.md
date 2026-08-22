---
database: TMUA
qid: 20132101208112
id: JZMaths_SetD-Mock-P1-Q12
paper: TMUA Mock
year:
number: Q12
section: Multiple Choice
difficulty: 7
topics: [Geometry, Function, Algebra (Basic)]
subtopics: [Coordinate Geometry, Functions, Algebra Manipulation]
tags: [Transformation-of-Graphs]
status: 已入库
---

## 题目
The curve $x = y^2 - 8y + 19$ is rotated $90^\circ$ clockwise about $P_1 = (1, 2)$, and then $90^\circ$ clockwise about $P_2$. The final curve is $x = -y^2 + 2y - 7$. Given $P_2$ lies on the line $y = 5$, find the $x$-coordinate of $P_2$.

$$ \mathbf{A} \quad -1 $$
$$ \mathbf{B} \quad -2 $$
$$ \mathbf{C} \quad -3 $$
$$ \mathbf{D} \quad 0 $$
$$ \mathbf{E} \quad 1 $$
$$ \mathbf{F} \quad 2 $$
$$ \mathbf{G} \quad 3 $$
$$ \mathbf{H} \quad 4 $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Let $P_2 = (a, 5)$.

First rewrite the original curve:
$$ x = y^2 - 8y + 19 = (y - 4)^2 + 3. $$
So its vertex is $(3, 4)$.

The final curve is
$$ x = -y^2 + 2y - 7 = -(y - 1)^2 - 6. $$
So its vertex is $(-6, 1)$.

A rotation maps the vertex of the parabola to the vertex of the new parabola, so track the vertex only.

The key observation here is: a $90^\circ$ clockwise rotation about $(h, k)$ sends a point $(x, y)$ to $(h + (y - k), k - (x - h)) = (h + y - k, k - x + h)$, which can be seen from a diagram (check it out yourself).

Rotating $(3, 4)$ about $P_1 = (1, 2)$ gives
$$ (1 + 4 - 2, 2 - 3 + 1) = (3, 0). $$

Now rotate $(3, 0)$ about $P_2 = (a, 5)$:
$$ (a + 0 - 5, 5 - 3 + a) = (a - 5, a + 2). $$

This must equal the final vertex $(-6, 1)$, so
$$ a - 5 = -6 $$
and hence $a = -1$.

Therefore the $x$-coordinate of $P_2$ is $-1$.
