---
database: TMUA
qid: 20132101208108
id: JZMaths_SetD-Mock-P1-Q8
paper: TMUA Mock
year:
number: Q8
section: Multiple Choice
difficulty: 6.5
topics: [Geometry]
subtopics: [Coordinate Geometry]
tags: [Circle-Geometry, General-Algebra]
status: 已入库
---

## 题目
The two curves $C_1$ and $C_2$ in the $xy$-plane have equations
$$ x^2 + y^2 - 2y - 12 = 0 \quad \text{and} \quad x^2 + y^2 - 2x - 4y = 0. $$

Let $P$ be a point on $C_1$ and $Q$ be a point on $C_2$. What is the **least** possible value of the length of $PQ$?
$$ \mathbf{A} \quad \sqrt{2} + \sqrt{5} - \sqrt{13} $$
$$ \mathbf{B} \quad \sqrt{13} - \sqrt{5} - \sqrt{2} $$
$$ \mathbf{C} \quad \sqrt{13} - \sqrt{2} $$
$$ \mathbf{D} \quad 0 $$
$$ \mathbf{E} \quad \sqrt{13} + \sqrt{5} - \sqrt{2} $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
$C_1$: $x^2 + (y - 1)^2 = 13$, so its centre is $A = (0, 1)$ and its radius is $\sqrt{13}$.

$C_2$: $(x - 1)^2 + (y - 2)^2 = 5$, so its centre is $B = (1, 2)$ and its radius is $\sqrt{5}$.

Now $AB = \sqrt{2}$. The circles intersect if $\sqrt{2} + \sqrt{5} > \sqrt{13}$. Since
$$ (\sqrt{2} + \sqrt{5})^2 = 7 + 2\sqrt{10} > 13, $$
the circles intersect.

Hence we may choose $P = Q$ at an intersection point, so the least possible value of $PQ$ is $0$. Indeed the whole point of this question is to get you to determine how close they really are.

Alternatively, shortcut to mushrooms: subtracting the two equations gives $2x + 2y - 12 = 0$, so $y = 6 - x$. Substituting this into either equation gives
$$ x^2 - 5x + 6 = 0, $$
which has two distinct real roots. Hence the circles intersect, so the least possible value of $PQ$ is $0$.
