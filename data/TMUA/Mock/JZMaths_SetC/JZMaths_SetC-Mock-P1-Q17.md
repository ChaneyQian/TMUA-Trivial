---
database: TMUA
qid: 20132101207117
id: JZMaths_SetC-Mock-P1-Q17
paper: TMUA Mock
year:
number: Q17
section: Multiple Choice
difficulty: 7.5
topics: [Calculus, Function]
subtopics: [Differentiation, Optimization, Absolute Value Functions]
tags: [Differentiation, General-Functions, General-Algebra]
status: 已入库
---

## 题目
A rectangle has its sides parallel to the coordinate axes and lies entirely within the region enclosed by $y = 2|x - 4|$ and $y = x + 6$.

What is the maximum possible area of the rectangle?

You may assume that the rectangle with maximum possible area has its bottom edge meeting both arms of the graph $y = 2|x - 4|$.

$$ \mathbf{A} \quad \frac{40}{3} $$
$$ \mathbf{B} \quad 16 $$
$$ \mathbf{C} \quad 16.5 $$
$$ \mathbf{D} \quad \frac{49}{3} $$
$$ \mathbf{E} \quad 15 $$
$$ \mathbf{F} \quad \frac{50}{3} $$
$$ \mathbf{G} \quad \frac{35}{2} $$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
Let the bottom side of the rectangle have equation $y = a$. On the lower curve,

$$ a = 2|x - 4|. $$

So

$$ |x - 4| = \frac{a}{2}, $$

giving

$$ x = 4 - \frac{a}{2} = \frac{8 - a}{2} $$

or

$$ x = 4 + \frac{a}{2} = \frac{8 + a}{2}. $$

Therefore the maximum possible width at height $y = a$ is

$$ \frac{8+a}{2} - \frac{8-a}{2} = a. $$

Alternatively, the arms of $2|x-4|$ have gradient $2$ or $-2$. At height $y=a$, each half of the bottom edge has length $a/2$, so the full bottom edge has length $a$.

Now take the left bottom corner to be $\left(\frac{8-a}{2},a\right)$. The top of the rectangle is limited by the line $y=x+6$. Substituting $x=\frac{8-a}{2}$ gives

$$ y = \frac{8-a}{2} + 6 = 10 - \frac{a}{2}. $$

So the height of the rectangle is

$$ 10 - \frac{a}{2} - a = 10 - \frac{3a}{2}. $$

Hence the area is

$$ A = a\left(10-\frac{3a}{2}\right) = 10a - \frac{3a^2}{2}. $$

Differentiate:

$$ A' = 10 - 3a. $$

For a maximum, set $A'=0$, giving $a=\frac{10}{3}$, which is clearly a maximum. Therefore the maximum area is

$$ A = \frac{10}{3}\left(10-\frac{3}{2}\cdot\frac{10}{3}\right) = \frac{10}{3}\cdot 5 = \frac{50}{3}. $$

**Remark:** More generally, suppose a finite triangular region is enclosed by a graph of the form $y=|ax+b|$ and a straight line $y=cx+d$, where the line lies above the V-shaped graph between the two intersection points. Among all rectangles with sides parallel to the coordinate axes and lying entirely inside this region, the rectangle with maximum possible area always has its bottom edge meeting both arms of the V-shaped graph.
