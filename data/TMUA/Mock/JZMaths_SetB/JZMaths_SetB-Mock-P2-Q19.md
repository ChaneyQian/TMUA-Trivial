---
database: TMUA
qid: 20132101206219
id: JZMaths_SetB-Mock-P2-Q19
paper: TMUA Mock
year:
number: Q19
section: Multiple Choice
difficulty: 8.5
topics: []
subtopics: []
tags: [Geometry, General Algebra]
status: 已入库
---

## 题目
A circle has centre $A = (6, 7)$. Two tangents from the point $B = (1, 2)$ touch the circle at $P$ and $Q$.
Given that length $BP = 2\sqrt{10}$, find the sum of the gradients of the tangent lines $BP$ and $BQ$.
$$ \mathbf{A} \quad \frac{4}{3} $$
$$ \mathbf{B} \quad \frac{3}{4} $$
$$ \mathbf{C} \quad \frac{8}{3} $$
$$ \mathbf{D} \quad \frac{3}{2} $$
$$ \mathbf{E} \quad \frac{10}{3} $$
$$ \mathbf{F} \quad \frac{7}{4} $$
$$ \mathbf{G} \quad \frac{5}{4} $$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
Translate everything by the vector $(-1, -2)$. This does not change any gradients, so we can work in the transformed universe which has much nicer numbers!

The point $B = (1, 2)$ becomes $O = (0, 0)$, and the centre $A = (6, 7)$ becomes $C = (5, 5)$.

Let the radius of the circle be $r$. Since $OP = 2\sqrt{10}$ and $OC = \sqrt{5^2 + 5^2} = 5\sqrt{2}$, the right triangle $OCP$ gives
$$ OC^2 = OP^2 + r^2. $$

So $50 = 40 + r^2$, hence $r^2 = 10$. The transformed circle is
$$ (x - 5)^2 + (y - 5)^2 = 10. $$

A tangent line through the origin has equation $y = mx$. Substitute the tangent equation into the circle equation:
$$ (x - 5)^2 + (mx - 5)^2 = 10. $$

The expanded quadratic is
$$
(m^2+1)x^2-10(m+1)x+40=0.
$$

For the line to be a tangent, this quadratic must have exactly one solution for $x$, so its discriminant must be 0:
$$
[-10(m+1)]^2-4(m^2+1)(40)=0.
$$
So
$$
100(m+1)^2-160(m^2+1)=0.
$$
Dividing by 20 gives
$$
5(m+1)^2-8(m^2+1)=0.
$$
Expanding,
$$
5m^2+10m+5-8m^2-8=0,
$$
so
$$
3m^2-10m+3=0.
$$

The two tangent lines have gradients equal to the two roots of this quadratic. Therefore the sum of the gradients is $\frac{10}{3}$.

**Alternative geometrical method**

![[Image/JZMaths_SetB-Mock-P2-Q19-fig1.png]]

It is possible to find the answer to this geometrically. Work with the transformed version of the problem, centre $(5,5)$, two tangents both passing $O$. Let $P$ be the lower of the two points, drop a perpendicular vertical line from $P$ to the $x$-axis, let $X$ be the point where it crosses the $x$-axis. Let $PX=a$ and $OX=b$. By symmetry, we can draw a horizontal line from $Q$ to the $y$-axis, call the point of intersection $Y$, and then $QY=a$ and $OY=b$. The sum of gradients is then just
$$
\frac{a}{b}+\frac{b}{a}
=\frac{a^2+b^2}{ab}
=\frac{(2\sqrt{10})^2}{ab}.
$$

Therefore, it is enough to find $ab$.

Next observe that crucially, if we construct a right angled triangle with $XC$ being the hypotenuse, by drawing two lines, one horizontal one vertical, then this triangle is similar to $OXP$, by scale factor $1/2$, which we get by comparing the lengths of their hypotenuses. Thus its other sides are $a/2$ and $b/2$. Next bring these together into the isosceles right-angled triangle with hypotenuse $OC$, so that we deduce:
$$
\frac{b}{2}+a=5
\quad\text{and}\quad
b-\frac{a}{2}=5.
$$

From which we find $b=6$ and $a=2$, hence
$$
\frac{a}{b}+\frac{b}{a}
=\frac{a^2+b^2}{ab}
=\frac{(2\sqrt{10})^2}{12}
=\frac{10}{3}.
$$
