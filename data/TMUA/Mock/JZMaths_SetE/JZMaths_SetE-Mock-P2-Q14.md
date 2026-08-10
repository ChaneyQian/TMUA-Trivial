---
database: TMUA
qid: 20132101209214
id: JZMaths_SetE-Mock-P2-Q14
paper: TMUA Mock
year:
number: Q14
section: Multiple Choice
difficulty: 7
topics: [Logic and Proof, Geometry]
subtopics: [Logic, Euclid Geometry, Vectors]
tags: [Logic Deduction, Geometry]
status: 已入库
---

## 题目
The two diagonals of the convex quadrilateral $Q$ have equal length. A quadrilateral is convex if each of its interior angles is less than $180^\circ$.

Consider the following statements.

(I) The four midpoints of the sides of $Q$ are the vertices of a rhombus.

(II) At least one pair of opposite sides of $Q$ is parallel.

(III) $Q$ has at least one line of symmetry.

(IV) Let $A, B, C, D$ be the vertices of $Q$, labelled in order, then $AB^2 + CD^2 = BC^2 + DA^2$.

Which of these statements is/are **necessarily** true for the quadrilateral $Q$?
$$ \mathbf{A} \quad \text{(I) only} $$
$$ \mathbf{B} \quad \text{(I) and (II) only} $$
$$ \mathbf{C} \quad \text{(I) and (III) only} $$
$$ \mathbf{D} \quad \text{(II) and (IV) only} $$
$$ \mathbf{E} \quad \text{(II) and (III) only} $$
$$ \mathbf{F} \quad \text{(I) and (IV) only} $$
$$ \mathbf{G} \quad \text{(I), (III) and (IV) only} $$
$$ \mathbf{H} \quad \text{(II), (III) and (IV) only} $$
$$ \mathbf{I} \quad \text{all of them} $$
$$ \mathbf{J} \quad \text{none of them} $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Let $A, B, C, D$ be the vertices of $Q$ in order, and let $E, F, G, H$ be the midpoints of $AB, BC, CD, DA$, respectively.

From the definitions of the midpoints,
$$ \overrightarrow{EF} = \frac{1}{2} \overrightarrow{AC}, \qquad \overrightarrow{FG} = \frac{1}{2} \overrightarrow{BD}, $$
and similarly,
$$ \overrightarrow{GH} = -\frac{1}{2} \overrightarrow{AC}, \qquad \overrightarrow{HE} = -\frac{1}{2} \overrightarrow{BD}. $$
Thus opposite sides of $EFGH$ are parallel and equal, so $EFGH$ is a parallelogram. Also,
$$ EF = \frac{1}{2} AC, \qquad FG = \frac{1}{2} BD. $$
Since $AC = BD$, we have $EF = FG$. Therefore the parallelogram $EFGH$ has equal adjacent sides, so it is a rhombus. Hence statement (I) is necessarily true.

Now for statements (II) and (III), consider possible construction of $Q$ by drawing the two diagonals first, it becomes immediately obvious that both are not generally necessarily true, as counterexamples can be easily found with this construction.

(IV) feels not necessarily true, but is best confirmed with a counterexample. Take $A = (0, 0)$, $B = (1, -1)$, $C = (5, 0)$ and $D = (4, 3)$, listed in order. These points form a convex quadrilateral, and the diagonals have equal length, since $AC = 5$ and $BD = 5$.

However, $AB^2 + CD^2 = 2 + 10 = 12$, while $BC^2 + DA^2 = 17 + 25 = 42$. Therefore $AB^2 + CD^2 \neq BC^2 + DA^2$, and (IV) is not necessarily true.

So only (I) is necessarily true.
