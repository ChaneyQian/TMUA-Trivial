---
database: TMUA
qid: 20132101205119
id: JZMaths_SetA-Mock-P1-Q19
paper: TMUA Mock
year:
number: Q19
section: Multiple Choice
difficulty: 8
topics: [Trigonometry, Geometry]
subtopics: [Sine and Cosine Rule, Euclid Geometry]
tags: [General Trigonometry, Geometry]
status: 已入库
---

## 题目
In a triangle $ABC$ the angle at vertex $A$ is $30^\circ$. The side $BC$ has length $(x - 2)(x - 3)$ and the side $AC$ has length $(3 - x)(x - 8)$. Find the complete set of values of $x$ for which there are two non-congruent triangles.

![[Image/JZMaths_SetA-Mock-P1-Q19-fig1.png]]

$$ \mathbf{A} \quad 3 < x < 4 $$
$$ \mathbf{B} \quad 3 < x < 5 $$
$$ \mathbf{C} \quad 3 < x < 8 $$
$$ \mathbf{D} \quad 4 < x < 5 $$
$$ \mathbf{E} \quad 4 < x < 8 $$
$$ \mathbf{F} \quad 5 < x < 8 $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Let $a = BC$ and $b = AC$ so that $a = (x - 2)(x - 3)$ and $b = (3 - x)(x - 8) = (x - 3)(8 - x)$.

Both side lengths must be positive. The condition $a > 0$ gives $x < 2$ or $x > 3$, while $b > 0$ gives

$$ 3<x<8. $$

This is the ambiguous SSA case. For there to be two non-congruent triangles, the opposite side $BC$ must be longer than the height $AC\sin30^\circ$ but shorter than the adjacent side $AC$:

$$ b\sin30^\circ<a<b \quad\Longleftrightarrow\quad \frac b2<a<b. $$

Substitute $a=(x-3)(x-2)$ and $b=(x-3)(8-x)$. Since $3<x<8$, we have $x-3>0$.

First,

$$ a<b\quad\Longleftrightarrow\quad x-2<8-x\quad\Longleftrightarrow\quad x<5. $$

Second,

$$ \frac b2<a\quad\Longleftrightarrow\quad 8-x<2x-4\quad\Longleftrightarrow\quad x>4. $$

Combining these conditions with $3<x<8$ gives

$$ 4<x<5. $$
