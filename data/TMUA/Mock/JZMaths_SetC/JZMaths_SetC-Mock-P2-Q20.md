---
database: TMUA
qid: 20132101207220
id: JZMaths_SetC-Mock-P2-Q20
paper: TMUA Mock
year:
number: Q20
section: Multiple Choice
difficulty: 8.5
topics: [Logic and Proof, Geometry]
subtopics: [Logic, Proof, Euclid Geometry]
tags: [Logic Sufficiency]
status: 已入库
---

## 题目
A quadrilateral is convex if each of its interior angles is less than $180^\circ$.

Let $ABCD$ be a convex quadrilateral, with its vertices labelled in order. A quadrilateral is called a rhombus if all four of its sides are equal in length.

Which of the following statements, taken individually, are **sufficient** to guarantee that $ABCD$ is a rhombus?

1. $AB = AD$, and the diagonals $AC$ and $BD$ intersect at right angles.
2. $AB = CD$, and the diagonals $AC$ and $BD$ divide $ABCD$ into four similar triangles.
3. The diagonals $AC$ and $BD$ divide $ABCD$ into four similar triangles.
4. The diagonal $AC$ divides $ABCD$ into two triangles, and the diagonal $BD$ divides $ABCD$ into two triangles, with all four of these triangles having the same area.
5. $AB = BC = CD$, and the triangles $ABC$ and $BCD$ are congruent.

$$ \mathbf{A} \quad \text{Only 1.} $$
$$ \mathbf{B} \quad \text{Only 2.} $$
$$ \mathbf{C} \quad \text{Only 4.} $$
$$ \mathbf{D} \quad \text{Only 5.} $$
$$ \mathbf{E} \quad \text{Only 1 and 3.} $$
$$ \mathbf{F} \quad \text{Only 2 and 3.} $$
$$ \mathbf{G} \quad \text{Only 2 and 4.} $$
$$ \mathbf{H} \quad \text{Only 3 and 4.} $$
$$ \mathbf{I} \quad \text{Only 5 and 1.} $$
$$ \mathbf{J} \quad \text{Only 2 and 5.} $$
$$ \mathbf{K} \quad \text{Only 1 and 2.} $$
$$ \mathbf{L} \quad \text{None of them.} $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
**Disclaimer:** Sorry! This question is longer than I originally intended. I had planned to include only three statements, but all five turned out to be interesting, so I was unwilling to delete any of them. In any case, for students this means more practice, and therefore more learning!

**Statement 1** is not sufficient. For example, take
$$ A = (1, 0), \quad B = (0, 1), \quad C = (-2, 0), \quad D = (0, -1). $$
Then the diagonals $AC$ and $BD$ are perpendicular, and $AB = AD = \sqrt{2}$. However, $BC = CD = \sqrt{5}$, so $ABCD$ is not a rhombus.

**Statement 2** is sufficient, although this is quite hard to see!

Let the diagonals meet at $O$, and write
$$ OA = a, \quad OB = b, \quad OC = c, \quad OD = d. $$
Since the four triangles $AOB$, $BOC$, $COD$ and $DOA$ are all similar, the triangles $AOB$ and $BOC$ are similar. The angles $\angle AOB$ and $\angle BOC$ are supplementary.

If two similar non-degenerate triangles have supplementary angles at $O$, those angles must both be $90^\circ$. (Proof of this crucial fact by contradiction is left as an exercise!) Hence the diagonals are perpendicular.

So the four small triangles are similar right-angled triangles.

Now compare triangles $AOB$ and $COD$. They are similar right-angled triangles. Also, statement 2 gives $AB = CD$, which are their hypotenuses. Therefore the two triangles are congruent.

Hence either $a = c$ and $b = d$, or $a = d$ and $b = c$.

If $a = c$ and $b = d$, then
$$ AB = BC = CD = DA = \sqrt{a^2 + b^2}. $$
So $ABCD$ is a rhombus.

If $a = d$ and $b = c$, then triangle $BOC$ has equal perpendicular sides. Since all four small triangles are similar, all four are isosceles right-angled triangles. Hence again all four sides of $ABCD$ are equal.

So statement 2 is sufficient.

**Statement 3** is a weaker version of 2, and is not sufficient. It in fact describes a kite, and need not be a rhombus!

**Statement 4** is not sufficient. A non-square rectangle satisfies statement 4, since each diagonal divides the rectangle into two triangles of equal area. However, a non-square rectangle is not a rhombus.

**Statement 5** is not sufficient. For example, take $A = (-2, \sqrt{3})$, $B = (-1, 0)$, $C = (1, 0)$ and $D = (2, \sqrt{3})$. These points form a convex quadrilateral, and $AB = BC = CD = 2$.

Also, triangles $ABC$ and $BCD$ are congruent by SSS, since $AB = CD$, $BC$ is common, and $AC = BD = 2\sqrt{3}$. However, $AD = 4$, so $ABCD$ is not a rhombus.

Therefore the only sufficient statement is **statement 2**.
