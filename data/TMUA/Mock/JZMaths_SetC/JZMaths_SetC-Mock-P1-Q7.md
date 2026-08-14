---
database: TMUA
qid: 20132101207107
id: JZMaths_SetC-Mock-P1-Q7
paper: TMUA Mock
year:
number: Q7
section: Multiple Choice
difficulty: 6.5
topics: [Geometry, Trigonometry]
subtopics: [Coordinate Geometry, Trigonometry]
tags: [Circle-Geometry, Geometry]
status: 已入库
---

## 题目
A line $l$ with positive gradient is a common tangent to the circles $x^2+y^2=4$ and $(x-9)^2+y^2=25$, such that the two circles lie on the same side of $l$.

Find the gradient of $l$.
$$ \mathbf{A} \quad \frac{1}{3} $$
$$ \mathbf{B} \quad 2\sqrt{2} $$
$$ \mathbf{C} \quad \frac{\sqrt{2}}{4} $$
$$ \mathbf{D} \quad \frac{3\sqrt{2}}{8} $$
$$ \mathbf{E} \quad \frac{\sqrt{2}}{2} $$
$$ \mathbf{F} \quad \frac{2\sqrt{2}}{3} $$
$$ \mathbf{G} \quad \frac{3\sqrt{2}}{4} $$
$$ \mathbf{H} \quad \frac{7\sqrt{2}}{8} $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Let $O = (0, 0)$ be the centre of $x^2 + y^2 = 4$, and let $O_2 = (9, 0)$ be the centre of $(x - 9)^2 + y^2 = 25$.

![[Image/JZMaths_SetC-Mock-P1-Q7-fig1.png]]

Since $l$ is tangent to both circles, $OP$ and $O_2Q$ are perpendicular to $l$. Their lengths are the radii of the circles, so $OP = 2$ and $O_2Q = 5$.

Draw $OR$ parallel to $l$, and draw $O_2R$ perpendicular to $OR$, as in the diagram. Then $O_2R$ represents the difference between the perpendicular distances from the two centres to the tangent line, so

$$ O_2R = 5 - 2 = 3. $$

Let $OR = a$. Since $OR \perp O_2R$, triangle $OO_2R$ is right-angled at $R$. Also $OO_2 = 9$, because the centres are $(0,0)$ and $(9,0)$.

By Pythagoras,

$$ a^2 + 3^2 = 9^2. $$

So $a^2 = 72$, hence $a = 6\sqrt{2}$.

Now let $\theta$ be the angle that $l$ makes with the positive $x$-axis. Since $OR$ is parallel to $l$, the gradient of $l$ is $\tan \theta$. In triangle $OO_2R$,

$$ \tan \theta = \frac{O_2R}{OR} = \frac{3}{6\sqrt{2}} = \frac{1}{2\sqrt{2}} = \frac{\sqrt{2}}{4}. $$

Therefore the gradient of $l$ is $\frac{\sqrt{2}}{4}$.

**Remark:** If you are not aware of the fact that the gradient of $l$ is $\tan \theta$, you can use a different approach. Drop a perpendicular from $R$ down to $OO_2$, call the point of intersection $X$, then $ORX$ and $ORO_2$ are similar triangles. The required gradient is

$$ \frac{XR}{OX} = \frac{O_2R}{OR}. $$
