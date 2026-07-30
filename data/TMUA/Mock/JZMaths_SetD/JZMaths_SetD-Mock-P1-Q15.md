---
database: TMUA
qid: 20132101208115
id: JZMaths_SetD-Mock-P1-Q15
paper: TMUA Mock
year:
number: Q15
section: Multiple Choice
difficulty: 7.5
topics: []
subtopics: []
tags: [Circle Geometry, Geometry]
status: 已入库
---

## 题目
The circle $C$ is inscribed in the triangle bounded by the three lines
$$y = 0, \quad y = \sqrt{3}x, \quad x + y = \sqrt{1} + \sqrt{2} + \sqrt{3}.$$
You may use find $\tan 22.5^\circ = \sqrt{2} - 1$ useful.
Which of the following is the equation of $C$?
$$ \mathbf{A} \quad (x - \sqrt{3})^2 + (y - 1)^2 = 1 $$
$$ \mathbf{B} \quad (x - 1)^2 + (y - \sqrt{3})^2 = 1 $$
$$ \mathbf{C} \quad (x - \sqrt{3})^2 + (y - \sqrt{2})^2 = 1 $$
$$ \mathbf{D} \quad (x - \sqrt{2})^2 + (y - 1)^2 = 2 $$
$$ \mathbf{E} \quad (x - \sqrt{2})^2 + (y - \sqrt{2})^2 = 2 $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
The centre of an inscribed circle is the intersection of the internal angle bisectors. (GCSEish knowledge!)

At the origin, the angle between $y = 0$ and $y = \sqrt{3}x$ is $60^\circ$, so the angle bisector makes an angle of $30^\circ$ with the positive $x$-axis. Therefore its equation is
$$y = x \tan 30^\circ = \frac{x}{\sqrt{3}}.$$
The line $x + y = 1 + \sqrt{2} + \sqrt{3}$ meets the $x$-axis at
$$(1 + \sqrt{2} + \sqrt{3}, 0).$$
At this point, the internal angle is between the negative $x$-axis and the line $x + y = 1 + \sqrt{2} + \sqrt{3}$. Since the line has gradient $-1$, the angle bisector makes an angle of $22.5^\circ$ above the negative $x$-axis.

Using $\tan 22.5^\circ = \sqrt{2} - 1$, the second angle bisector is
$$y = (\sqrt{2} - 1)(1 + \sqrt{2} + \sqrt{3} - x).$$
Now intersect the two angle bisectors:
$$\frac{x}{\sqrt{3}} = (\sqrt{2} - 1)(1 + \sqrt{2} + \sqrt{3} - x).$$
Try $x = \sqrt{3}, \sqrt{2}, 1$, from the options, we find that $x = \sqrt{3}$. Then the left-hand side is $1$, and the right-hand side is $(\sqrt{2} - 1)(1 + \sqrt{2}) = 1$.

So $x = \sqrt{3}$, and hence $y = 1$.

Therefore the centre is $(\sqrt{3}, 1)$.

Since the circle touches the line $y = 0$, its radius is $1$. Therefore the equation of the circle is
$$(x - \sqrt{3})^2 + (y - 1)^2 = 1.$$
