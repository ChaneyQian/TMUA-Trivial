---
database: TMUA
qid: 20132101206115
id: JZMaths_SetB-Mock-P1-Q15
paper: TMUA Mock
year:
number: Q15
section: Multiple Choice
difficulty: 7.5
topics: [Geometry]
subtopics: [Coordinate Geometry]
tags: [Circle-Geometry, Geometry]
status: 已入库
---

## 题目
The circles $C_1$ and $C_2$ are defined by the equations
$$ C_1: (x - 2)^2 + (y - 3)^2 = 9 $$
$$ C_2: (x - 11)^2 + (y - 15)^2 = 16 $$
A common tangent to $C_1$ and $C_2$ touches $C_1$ at $X$ and $C_2$ at $Y$. Find the sum of the squares of all distinct possible lengths of $XY$.
$$ \mathbf{A} \quad 1 $$
$$ \mathbf{B} \quad 49 $$
$$ \mathbf{C} \quad 176 $$
$$ \mathbf{D} \quad 224 $$
$$ \mathbf{E} \quad 400 $$
$$ \mathbf{F} \quad 450 $$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
Let $A$ and $B$ be the centres $C_1$ and $C_2$ respectively, then the distance between the centres is
$$ AB = \sqrt{(11 - 2)^2 + (15 - 3)^2} = \sqrt{9^2 + 12^2} = 15. $$
There are two types of common tangents: external common tangents and internal common tangents.

For an external common tangent, where the circles are on the same side of the tangent line, the radii to the points of contact are parallel. The difference between the radii is $4 - 3 = 1$. So the length between the two points of contact is by Pythagoras:
$$ XY^2 = AB^2 - 1^2 = 225 - 1 = 224. $$
For an internal common tangent, the radii to the points of contact point in opposite directions. The relevant distance is the sum of the radii $3 + 4 = 7$, which together with $XY$ and $AB$ forms a right-angled triangle.

![[Image/JZMaths_SetB-Mock-P1-Q15-fig1.png]]

So the length between the two points of contact is given by Pythagoras:
$$
XY^2=AB^2-(4+3)^2=225-49=176.
$$

Therefore the sum of distinct values of $XY^2$ is
$$
224+176=400.
$$
