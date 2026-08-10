---
database: TMUA
qid: 20132101209111
id: JZMaths_SetE-Mock-P1-Q11
paper: TMUA Mock
year:
number: Q11
section: Multiple Choice
difficulty: 6.5
topics: [Sequences and Series, Geometry]
subtopics: [AP GP, Sequences and Series, Euclid Geometry]
tags: [Ratio and Proportion, Sequences and Series]
status: 已入库
---

## 题目
Triangle $ABC$ is right-angled at $C$, with
$$ AC = 5, \quad BC = 12, \quad AB = 13. $$
The perpendicular from $C$ to $AB$ is drawn. Of the two smaller triangles formed, the larger triangle is selected.
Within the selected triangle, the perpendicular from its right-angled vertex to its hypotenuse is drawn, and the larger of the two new triangles is selected. This process is continued indefinitely.
Find the sum of the lengths of all the perpendiculars drawn.

$$ \mathbf{A} \quad 60 $$
$$ \mathbf{B} \quad 30 $$
$$ \mathbf{C} \quad 48 $$
$$ \mathbf{D} \quad 80 $$
$$ \mathbf{E} \quad 72 $$
$$ \mathbf{F} \quad \text{The sum does not converge.} $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Remark: This question uses a remarkable property of right-angled triangles: the perpendicular from the right angle to the hypotenuse divides the triangle into two smaller triangles, each of which is similar to the original triangle.

The first perpendicular divides triangle $ABC$ into two triangles similar to the original. Their hypotenuses have lengths 5 and 12, while the hypotenuse of the original triangle has length 13. Therefore the larger new triangle is a scaled copy of the original, with scale factor
$$ \frac{12}{13}. $$

The same reasoning applies at every stage, so each new perpendicular is $\frac{12}{13}$ times the previous one.

Let the first perpendicular have length $h$. Comparing two expressions for the area of triangle $ABC$ gives
$$ \frac{1}{2}(5)(12) = \frac{1}{2}(13)h, $$
so $h = \frac{60}{13}$.

The perpendicular lengths therefore form the geometric sequence
$$ \frac{60}{13}, \quad \frac{60}{13}\left(\frac{12}{13}\right), \quad \frac{60}{13}\left(\frac{12}{13}\right)^2, \quad \dots $$

Hence their sum is
$$ \frac{\frac{60}{13}}{1 - \frac{12}{13}} = 60. $$
