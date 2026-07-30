---
database: TMUA
qid: 20132101206106
id: JZMaths_SetB-Mock-P1-Q6
paper: TMUA Mock
year:
number: Q6
section: Multiple Choice
difficulty: 6.5
topics: []
subtopics: []
tags: [Inequalities]
status: 已入库
---

## 题目
Which of the following represents the set of $x$ satisfying: $x^2 > x$ and $1 < 17 - 4x$.
$$ \mathbf{A} \quad (x - 1)(x - 4) < 0 $$
$$ \mathbf{B} \quad x^2 - 5x + 4 > 0 $$
$$ \mathbf{C} \quad \frac{3}{x - 1} > x - 3 $$
$$ \mathbf{D} \quad x^3 - 5x^2 + 4x > 0 $$
$$ \mathbf{E} \quad x(x - 1) < 0 $$
$$ \mathbf{F} \quad x^2 - x > 0 $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
First, find the solution for the simultaneous inequalities. From $x^2 > x$: $x(x - 1) > 0$, so $x < 0$ or $x > 1$. From $1 < 17 - 4x$: $x < 4$. Intersection is $(-\infty, 0) \cup (1, 4)$.

This cannot be achieved by any quadratic inequality, therefore the only possible options are **C** and **D**.

**C:** we could use the graph method for this. Sketch $y = \frac{3}{x - 1}$ and $y = x - 3$ on the same axes.

![[Image/JZMaths_SetB-Mock-P1-Q6-fig1.png]]

Intersections satisfy
$$ \frac{3}{x - 1} = x - 3 \Leftrightarrow x = 0, 4, $$
so the curves meet at $(0, -3)$ and $(4, 1)$.

Using the intersection points and asymptote at $x=1$, we can observe it gives the correct set of $x$ of $(-\infty,0)\cup(1,4)$, so it is the correct option.

For completeness, let's check **D**: $x^3-5x^2+4x=x(x-1)(x-4)>0$ gives $0<x<1$ or $x>4$. Wrong sign; the correct cubic representation is $x(x-1)(x-4)<0$.
