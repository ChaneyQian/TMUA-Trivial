---
database: TMUA
qid: 20132101205215
id: JZMaths_SetA-Mock-P2-Q15
paper: TMUA Mock
year:
number: Q15
section: Multiple Choice
difficulty: 7
topics: []
subtopics: []
tags: [Geometry]
status: 已入库
---

## 题目
A regular tetrahedron $OABC$ has every edge of length $12$ metres. The point $X$ is the midpoint of edge $OA$, and the point $Y$ lies on edge $BC$ with $BY = 3$ metres, as shown below.

![[Image/JZMaths_SetA-Mock-P2-Q15-fig1.png]]

What is the shortest distance, in metres, from $X$ to $Y$ measured entirely along the outer surface of the tetrahedron?

$$ \mathbf{A} \quad 3\sqrt{3} $$
$$ \mathbf{B} \quad 3\sqrt{7} $$
$$ \mathbf{C} \quad 3\sqrt{13} $$
$$ \mathbf{D} \quad 3\sqrt{21} $$
$$ \mathbf{E} \quad 21 $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Unfold and flatten the two faces $ABC$ and $ABO$ along their common edge $AB$. The shortest path across these two faces is then the straight line segment $XY$.

Let $Z$ be the midpoint of $BC$. Since $X$ and $Z$ are the midpoints of $OA$ and $BC$ respectively, $XZ$ is parallel and equal in length to $AC$, so $XZ = 12$. Also, $BZ = 6$ and $BY = 3$, so $ZY = 3$.

Since $XZ$ is parallel to $AC$, we have $\angle XZY = 60^\circ$. Applying the cosine rule to triangle $XZY$ gives

$$ XY^2 = 12^2 + 3^2 - 2(12)(3)\cos 60^\circ = 117. $$

Therefore $XY = \sqrt{117} = 3\sqrt{13}$.
