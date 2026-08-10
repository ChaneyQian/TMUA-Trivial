---
database: TMUA
qid: 20132101207110
id: JZMaths_SetC-Mock-P1-Q10
paper: TMUA Mock
year:
number: Q10
section: Multiple Choice
difficulty: 6.5
topics: [Function, Geometry]
subtopics: [Functions, Coordinate Geometry]
tags: [Transformation of Graphs]
status: 已入库
---

## 题目
The curve $x = (y - 2)^2 - 1$ is transformed as follows:

First, it is translated vertically in the positive $y$-direction by $2$ units.

Next, it is reflected in the line $x = 2$.

Finally, it is rotated $90^\circ$ clockwise about the point $(1, 1)$.

Which of the following is the equation of the resulting curve?

$$ \mathbf{A} \quad y = x^2 - 8x + 13 $$
$$ \mathbf{B} \quad y = x^2 - 8x + 19 $$
$$ \mathbf{C} \quad y = -x^2 + 8x - 13 $$
$$ \mathbf{D} \quad x = y^2 - 8y + 15 $$
$$ \mathbf{E} \quad y = x^2 - 4x + 1 $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Our strategy in this question is to keep track of the apex and direction of the quadratic curve through the transformations.

The original curve $x = (y - 2)^2 - 1$ is a sideways quadratic. Its apex is $(-1, 2)$, and it faces right, since $x$ is equal to a positive square expression.

After translating vertically in the positive $y$-direction by $2$ units, the apex moves from $(-1, 2)$ to $(-1, 4)$. The curve still faces right.

Next, the curve is reflected in the line $x = 2$. The apex $(-1, 4)$ is reflected to $(5, 4)$, because $-1$ is $3$ units to the left of $x = 2$, so its reflection is $3$ units to the right of $x = 2$. The curve now faces left.

Finally, the curve is rotated $90^\circ$ clockwise about $(1, 1)$. Relative to $(1, 1)$, the apex $(5, 4)$ has displacement $(4, 3)$. A $90^\circ$ clockwise rotation sends displacement $(u, v)$ to $(v, -u)$, this can be seen with similar triangles. So in this case $(4, 3) \mapsto (3, -4)$ and the new displacement from $(1, 1)$ is $(3, -4)$. Therefore the new apex is $(1, 1) + (3, -4) = (4, -3)$. The curve was facing left before the rotation. A direction pointing left becomes a direction pointing up after a $90^\circ$ clockwise rotation.

A quadratic facing up has the form $y = (x - h)^2 + k$, where $(h, k)$ is its apex. Since the new apex is $(4, -3)$, the resulting curve is $y = (x - 4)^2 - 3 = x^2 - 8x + 13$.
