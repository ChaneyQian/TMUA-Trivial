---
database: TMUA
qid: 20132101206118
id: JZMaths_SetB-Mock-P1-Q18
paper: TMUA Mock
year:
number: Q18
section: Multiple Choice
difficulty: 8
topics: [Calculus, Geometry]
subtopics: [Differentiation, Optimization, Euclid Geometry]
tags: [Differentiation]
status: 已入库
---

## 题目
A right circular cylinder is placed inside a regular square-based pyramid. One circular face of the cylinder lies in the square base of the pyramid, and the other circular face is parallel to it. All edges of the pyramid have the same length.

![[Image/JZMaths_SetB-Mock-P1-Q18-fig1.png]]

What is the largest possible value of
$$ \frac{\text{volume of the cylinder}}{\text{volume of the pyramid}}? $$

$$ \mathbf{A} \quad \frac{\pi}{9} $$
$$ \mathbf{B} \quad \frac{\pi}{10} $$
$$ \mathbf{C} \quad \frac{\sqrt{2}\pi}{9} $$
$$ \mathbf{D} \quad \frac{\pi}{12} $$
$$ \mathbf{E} \quad \frac{2\sqrt{2}\pi}{27} $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Since the required answer is a proportion, we may choose a convenient edge length. Let every edge of the pyramid have length $\sqrt{2}$, we will see shortly that this leads to a most convenient value for the height of the pyramid.

By Pythagoras, the distance from the centre of the square base to a vertex is 1. Since the sloping edge also has length $\sqrt{2}$, the height $H$ of the pyramid satisfies
$$
H^2+1^2=(\sqrt{2})^2 \quad\Rightarrow\quad H=1.
$$

At height $h$ above the base, the horizontal cross-section of the pyramid is a square similar to the base square. Since the total height of the pyramid is 1, the smaller pyramid above this cross-section has height $1-h$. By similar pyramids, the ratio of corresponding lengths in the original pyramid and this smaller pyramid is
$$
1:(1-h).
$$

Therefore the side length of the square cross-section is scaled by a factor of $1-h$ compared with the base square. Since the base square has side length $\sqrt{2}$, the side length of the square cross-section is
$$
\sqrt{2}(1-h).
$$

So the radius of the largest circle that fits inside this square is
$$
r=\frac{\sqrt{2}}{2}(1-h).
$$

Hence the volume of the cylinder is
$$
V=\pi r^2h=\frac{\pi}{2}h(1-h)^2.
$$

So we need to maximise $h(1-h)^2$. Now
$$
h(1-h)^2=h-2h^2+h^3.
$$
Differentiating gives
$$
1-4h+3h^2=(1-h)(1-3h).
$$
The maximum occurs at
$$
h=\frac13.
$$
Therefore
$$
r=\frac{\sqrt{2}}{2}\left(1-\frac13\right)=\frac{\sqrt{2}}{3}.
$$
So the largest cylinder has volume
$$
V_{\mathrm{cyl}}=\pi\left(\frac{\sqrt{2}}{3}\right)^2\frac13=\frac{2\pi}{27}.
$$

The volume of the pyramid is
$$
V_{\mathrm{pyr}}=\frac13\cdot 2\cdot 1=\frac23.
$$
Hence the required proportion is
$$
\frac{V_{\mathrm{cyl}}}{V_{\mathrm{pyr}}}
=\frac{\frac{2\pi}{27}}{\frac23}
=\frac{\pi}{9}.
$$

**Remark:** As a general rule of thumb, I try not to make these questions too long, though this one may be an exception. However, I think the length is justified here, since the question tests several useful ideas: recognising the role of similar pyramids, setting up the cylinder volume, and choosing a convenient edge length to simplify the calculation. There did not seem to be an obvious way to shorten the question meaningfully without losing these essential learning points. So as a practice mock question, it serves its purpose well.
