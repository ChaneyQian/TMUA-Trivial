---
database: TMUA
qid: 20132101209220
id: JZMaths_SetE-Mock-P2-Q20
paper: TMUA Mock
year:
number: Q20
section: Multiple Choice
difficulty: 9
topics: [Logic and Proof, Geometry]
subtopics: [Logic, Euclid Geometry]
tags: [Logic Deduction]
status: 已入库
---

## 题目
**Warning:** Students should be aware that JZ Maths policies may change at any time, entirely at the whim of the unstable chief mock examiner - Mr JZ.

Statement $P$: $ABC$ is a right-angled triangle.

Which of the following statements are true?

(1) Statement $P$ is true if and only if triangle $ABC$ can be divided by a line segment into two smaller triangles, each of which is similar to triangle $ABC$.

(2) Statement $P$ is necessary for triangle $ABC$ to be divisible by a line segment into two smaller triangles whose areas, together with the area of triangle $ABC$, can be arranged to form a geometric sequence with common ratio not equal to 1.

(3) $P$ is a necessary condition, that must be satisfied by all the triangles made when a convex kite is divided into four triangles by its diagonals.

(4) Statement $P$ is sufficient for every SSA specification of triangle $ABC$ to determine it uniquely up to congruence.

(5) Statement $P$ is true if and only if four congruent copies of triangle $ABC$ can be assembled edge-to-edge, without gaps or overlaps, so that their union is exactly a rhombus.

$$ \mathbf{A} \quad \text{Statements (1), (3), (5) only.} $$
$$ \mathbf{B} \quad \text{Statements (3), (5) only.} $$
$$ \mathbf{C} \quad \text{Statements (1), (2), (3), (5) only.} $$
$$ \mathbf{D} \quad \text{Statements (1), (5) only.} $$
$$ \mathbf{E} \quad \text{Statements (1), (3), (4), (5) only.} $$
$$ \mathbf{F} \quad \text{Statements (1), (3) only.} $$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
**Remark 1:** Did you gamble? You would have lost!

For statement (1), suppose first that $ABC$ is right-angled. Drawing the altitude from the right-angled vertex to the hypotenuse divides $ABC$ into two smaller triangles, each similar to $ABC$.

Conversely, suppose a line segment divides $ABC$ into two smaller triangles, each similar to $ABC$. The line segment must join a vertex to a point on the opposite side. The two angles formed at this point are supplementary.

Since both smaller triangles are similar to $ABC$, these two supplementary angles must both occur among the angles of $ABC$. They cannot be two distinct angles of $ABC$, since the sum of any two angles of a triangle is less than $180^\circ$. Therefore they are equal, so each is $90^\circ$. Hence $ABC$ is right-angled.

Thus statement (1) is true.

For statement (2), let the area of $ABC$ be $S$, and let $r > 1$ satisfy
$$ r^2 = r + 1. $$

A line segment from a vertex to the opposite side can divide any triangle in any prescribed positive area ratio. In particular, it can produce two triangles with areas
$$ \frac{S}{r^2} \quad \text{and} \quad \frac{S}{r}. $$

Indeed,
$$ \frac{S}{r^2} + \frac{S}{r} = S, $$
since $r^2 = r + 1$.

The three areas can therefore be arranged as
$$ \frac{S}{r^2}, \quad \frac{S}{r}, \quad S, $$
which form a geometric sequence with common ratio $r \neq 1$.

This construction works for any triangle, so being right-angled is not necessary. Thus statement (2) is false.

For statement (3), the diagonals of a convex kite are perpendicular. Therefore each of the four triangles formed by the diagonals has a right angle at the point where the diagonals intersect.

Thus statement (3) is true.

For statement (4), consider a right-angled triangle for which
$$ A = 30^\circ, \quad a = 1, \quad c = \sqrt{3}. $$

By the sine rule,
$$ \frac{\sin C}{\sqrt{3}} = \frac{\sin 30^\circ}{1}, $$
so
$$ \sin C = \frac{\sqrt{3}}{2}. $$
Hence
$$ C = 60^\circ \quad \text{or} \quad C = 120^\circ. $$

Both possibilities give valid, non-congruent triangles with the same SSA information. Therefore, even when $ABC$ is right-angled, an SSA specification does not always determine it uniquely.

Thus statement (4) is false.

For statement (5), consider a rhombus with side length 2 and acute angle $60^\circ$. Join the midpoints of a pair of opposite sides. This divides the rhombus into two congruent parallelograms, each with adjacent side lengths 1 and 2.

Divide each parallelogram along its longer diagonal. This produces four congruent triangles which fill the rhombus edge-to-edge, without gaps or overlaps.

In each triangle, the sides of lengths 1 and 2 enclose an angle of $120^\circ$. If the third side has length $d$, then
$$ d^2 = 1^2 + 2^2 - 2(1)(2) \cos 120^\circ = 1 + 4 + 2 = 7. $$

The triangle is not right-angled, since
$$ 1^2 + 2^2 = 5 \neq 7. $$

Therefore four congruent copies of a non-right-angled triangle can be assembled to form a rhombus.

Thus statement (5) is false.

Therefore the true statements are
$$ \text{statements (1) and (3) only.} $$

**Remark 2:** Well done, you survived these mock paper sets, best of luck!
