---
database: TMUA
qid: 20132101209217
id: JZMaths_SetE-Mock-P2-Q17
paper: TMUA Mock
year:
number: Q17
section: Multiple Choice
difficulty: 8
topics: [Geometry, Sequences and Series]
subtopics: [Euclid Geometry, AP GP]
tags: [Geometry, Sequences and Series]
status: 已入库
---

## 题目
A sphere has volume $1$ cubic unit. A regular tetrahedron is inscribed in the sphere, so that all four vertices of the tetrahedron lie on the sphere. A second sphere is then inscribed in this tetrahedron, so that it is tangent to all four faces of the tetrahedron.
This process is repeated indefinitely: inside each sphere, a regular tetrahedron is inscribed, and inside that tetrahedron another sphere is inscribed.
Find the sum of the volumes of all the spheres formed, including the original sphere.
$$ \mathbf{A} \quad \frac{5 + \sqrt{5}}{4} $$
$$ \mathbf{B} \quad \frac{5}{4} $$
$$ \mathbf{C} \quad \frac{27}{26} $$
$$ \mathbf{D} \quad \frac{3 + \sqrt{3}}{2} $$
$$ \mathbf{E} \quad \frac{9 + 3\sqrt{2}}{7} $$
$$ \mathbf{F} \quad \frac{4}{3} $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
The volumes of the successive spheres clearly form a geometric sequence. Therefore, it is enough to determine the ratio between the radius of a sphere inscribed in a regular tetrahedron and the radius of a sphere circumscribed about that tetrahedron. Once this ratio is known, the ratio of the volumes can be deduced immediately.

Let $ABCD$ be the regular tetrahedron, with $ABC$ as its base, and let $O$ be the centre of the equilateral triangle $ABC$. Since we only care about ratios of lengths, we may choose the side length of the tetrahedron. Let us choose it to be $2$, which is particularly convenient.

The height of the equilateral triangle $ABC$ is
$$ \frac{\sqrt{3}}{2} \times 2 = \sqrt{3}. $$

The centre $O$ lies two-thirds of the way from a vertex to the opposite side, so
$$ AO = \frac{2}{3} \times \sqrt{3} = \frac{2\sqrt{3}}{3}. $$

Since $DO$ is perpendicular to the base, triangle $AOD$ is right-angled. Therefore,
$$ DO^2 = AD^2 - AO^2 = 2^2 - \left(\frac{2\sqrt{3}}{3}\right)^2 = 4 - \frac{4}{3} = \frac{8}{3}, $$
so
$$ DO = \frac{4}{\sqrt{6}}. $$

Let $P$ be the centre of the tetrahedron, and let $OP = t$. By symmetry, $P$ lies on $DO$. Since $P$ is equally distant from all four vertices,
$$ PA = PD. $$

Now
$$ PA^2 = AO^2 + OP^2 = \frac{4}{3} + t^2 $$
and
$$ PD = DO - OP = \frac{4}{\sqrt{6}} - t. $$

Therefore,
$$ \left(\frac{4}{\sqrt{6}} - t\right)^2 = \frac{4}{3} + t^2. $$

Expanding gives
$$ \frac{8}{3} - \frac{8}{\sqrt{6}}t + t^2 = \frac{4}{3} + t^2, $$
so
$$ t = \frac{1}{\sqrt{6}}. $$

Hence the distance from the centre to each vertex is
$$ PD = \frac{4}{\sqrt{6}} - \frac{1}{\sqrt{6}} = \frac{3}{\sqrt{6}}. $$

Thus, the radius of the inscribed sphere is $\frac{1}{\sqrt{6}}$, while the radius of the circumscribed sphere is $\frac{3}{\sqrt{6}}$. Their radii are therefore in the ratio $1 : 3$.

Hence their volumes are in the ratio $1 : 27$. The successive sphere volumes therefore form a convergent geometric sequence with first term $1$ and common ratio $\frac{1}{27}$. Their sum is
$$ \frac{1}{1 - \frac{1}{27}} = \frac{27}{26}. $$
