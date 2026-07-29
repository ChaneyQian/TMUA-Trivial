---
database: TMUA
qid: 20132101100112
id: Spec-P1-Q12
paper: TMUA P1
year:
number: Q12
section: Applications
difficulty: 0
topics: []
subtopics: []
tags:
  - specimen
status: 已入库
---

## 题目
The cross-section of a triangular prism is an equilateral triangle with side 2x cm. The length of the prism is d cm.

Let the total surface area of the prism be $T \, \text{cm}^2$ . Given that the volume of the prism is $T \, \text{cm}^3$ , which one of the following is an expression for $d$ in terms of $x$ ?
$$
\mathbf {A} \quad \frac{x}{2x - 3}
$$

$$
\mathbf {B} \quad \frac{3x}{3x - 2\sqrt{3}}
$$

$$
\mathbf {C} \quad \frac{2x}{x - 4\sqrt{3}}
$$

$$
\mathbf {D} \quad \frac{2x}{x - 2\sqrt{3}}
$$

$$
\mathbf {E} \quad \frac{2x}{x - \sqrt{3}}
$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
The volume of the prism is the length times the cross-sectional area, so we need to work out the area of the equilateral triangle:

![[Image/Spec-P1-Q12-sol1.jpg]]

We could use trigonometry and the formula for the area of a triangle, $\mathrm { a r e a } = { \textstyle \frac { 1 } { 2 } } a b \mathrm { s i n } C ;$ this gives the area as ${ \scriptstyle { \frac { 1 } { 2 } } } ( 2 x ) ( 2 x )$ sin $6 0 ^ { \circ } = x ^ { 2 } { \sqrt { 3 } }$

Alternatively, we could find the length CM using Pythagoras’s theorem, giving $C M ^ { 2 } = ( 2 x ) ^ { 2 } -$ $x ^ { 2 } = 3 x ^ { 2 }$ , so $C M = x { \sqrt { 3 } }$ . Thus the area of the triangle is ${ \textstyle \frac { 1 } { 2 } } A B \times C M = x ^ { 2 } { \sqrt { 3 } }$

Thus the volume of the prism is $T = x ^ { 2 } d { \sqrt { 3 } } .$

The total surface area of the prism is twice the area of the triangle, plus the area of the three rectangular faces, so

$$
T = 2 x ^ {2} \sqrt {3} + 3 (2 x d) = 2 x ^ {2} \sqrt {3} + 6 x d.
$$

These expressions for T are equal, so

$$
x ^ {2} d \sqrt {3} = 2 x ^ {2} \sqrt {3} + 6 x d.
$$

Collecting the d terms to the left hand side gives

$$
x ^ {2} d \sqrt {3} - 6 x d = 2 x ^ {2} \sqrt {3}
$$

so

$$
d (x ^ {2} \sqrt {3} - 6 x) = 2 x ^ {2} \sqrt {3}
$$

hence

$$
d = \frac {2 x ^ {2} \sqrt {3}}{x ^ {2} \sqrt {3} - 6 x} = \frac {2 x \sqrt {3}}{x \sqrt {3} - 6}.
$$

If we now divide the numerator and denominator by ${ \sqrt { 3 } } .$ , we obtain

$$
d = \frac {2 x}{x - 2 \sqrt {3}},
$$

which is option D.
