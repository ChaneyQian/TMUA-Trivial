---
database: TMUA
qid: 20132101205105
id: JZMaths_SetA-Mock-P1-Q5
paper: TMUA Mock
year:
number: Q5
section: Multiple Choice
difficulty: 6
topics: [Function, Logic and Proof]
subtopics: [Absolute Value Functions, Graphical Arguments]
tags: [Geometry, Linear Equations]
status: 已入库
---

## 题目
Find the area of the region enclosed between the curves $y = 2|x - 1|$ and $y = 6 - |x + 2|$.
$$ \mathbf{A} \quad \frac{11}{2} $$
$$ \mathbf{B} \quad \frac{20}{3} $$
$$ \mathbf{C} \quad \frac{17}{3} $$
$$ \mathbf{D} \quad 6 $$
$$ \mathbf{E} \quad \frac{13}{2} $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Start by making a sketch of both modulus V-shaped graphs.

![[Image/JZMaths_SetA-Mock-P1-Q5-fig1.png]]

Note that we should also find the two intersections. It turns out it is the negative gradient arm of $y = 6 - |x + 2|$ that intercepts both arms of $y = 2|x - 1|$. Thus the equations to solve are:

$$ 6 - (x + 2) = 2(x - 1) \quad \text{and} \quad 6 - (x + 2) = 2(1 - x), $$

which gives $x=-2$ and $x=1$, where $y=6$ and $y=2$.

To find the enclosed area, subtract from the enclosing trapezium the two triangles under the graph of $y=2|x-1|$ and above the $x$-axis.

The left triangle has area $\frac12\cdot 6\cdot 3=9$, the right triangle has area $\frac12\cdot 1\cdot 2=1$, and the trapezium has area

$$ \frac12\cdot 4\cdot(2+6)=16. $$

Therefore the bounded area is $16-9-1=6$.
