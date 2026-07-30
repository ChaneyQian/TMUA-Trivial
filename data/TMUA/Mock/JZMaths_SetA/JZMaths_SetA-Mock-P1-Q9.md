---
database: TMUA
qid: 20132101205109
id: JZMaths_SetA-Mock-P1-Q9
paper: TMUA Mock
year:
number: Q9
section: Multiple Choice
difficulty: 7.5
topics: []
subtopics: []
tags: [Circle Geometry]
status: 已入库
---

## 题目
The circles $C_1$ and $C_2$ have equations
$$ x^2 + y^2 - 8y - 64 = 0 \quad \text{and} \quad x^2 + y^2 - 6x - 11 = 0. $$

A **common external tangent** is a line which touches both circles, with the two circles lying on the same side of the line. The two common external tangents to $C_1$ and $C_2$ meet at $P$. One of these common external tangents has equation $y = 2x - 16$. Let $A$ be the centre of $C_1$ and let $B$ be the centre of $C_2$. Find the value of $AP$.

$$ \mathbf{A} \quad 12 $$
$$ \mathbf{B} \quad 10 $$
$$ \mathbf{C} \quad 15 $$
$$ \mathbf{D} \quad 3\sqrt{5} $$
$$ \mathbf{E} \quad 4\sqrt{5} $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
You maybe tempted to find the equation of the other tangent, then find $P$. While that could be done, but it is a tricky calculation, and not the easiest way to find $AP$. Intead, $AP$ can be found purely geometrically, without knowledge of any of the tangent equations!

$C_1$: $x^2 + (y - 4)^2 = 80$. So $C_1$ has centre $A = (0, 4)$ and radius $4\sqrt{5}$.

$C_2$: $(x - 3)^2 + y^2 = 20$. So $C_2$ has centre $B = (3, 0)$ and radius $2\sqrt{5}$.

Let the contact points of one of the tangents with the circles $C_1$ and $C_2$ be $X$ and $Y$ respectively. Then observer that triangles $AXP$ and $BYP$ are similar, because they have the same angles.

Now let's first find $AB$ by Pythagoras: $AB = \sqrt{(3-0)^2 + (0-4)^2} = 5$, and let $BP = x$.

By similar triangles:
$$ \frac{AX}{AY} = \frac{AP}{BP} \quad \Leftrightarrow \quad \frac{4\sqrt{5}}{2\sqrt{5}} = \frac{5+x}{x} \quad \Leftrightarrow \quad x = 5. $$

Hence $BP = 5$, so $AP = AB + BP = 5 + 5 = 10$.
