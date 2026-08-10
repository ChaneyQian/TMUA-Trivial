---
database: TMUA
qid: 20132101205209
id: JZMaths_SetA-Mock-P2-Q9
paper: TMUA Mock
year:
number: Q9
section: Multiple Choice
difficulty: 7
topics: [Miscellaneous Pure, Function]
subtopics: [Inequalities, Absolute Value Functions]
tags: [Inequalities]
status: 已入库
---

## 题目
Find the complete set of values of $k$ for which the graph $y = |2x + k|$ lies strictly below the curve $y = x^2 + (k - 1)x + 5$ for every real value of $x$.
$$ \mathbf{A} \quad 1 - 2\sqrt{3} < k < 1 + 2\sqrt{3} $$
$$ \mathbf{B} \quad k < 1 + 2\sqrt{7} $$
$$ \mathbf{C} \quad 1 - 2\sqrt{5} < k < 1 + 2\sqrt{5} $$
$$ \mathbf{D} \quad 1 - 2\sqrt{3} < k < 1 + 2\sqrt{5} $$
$$ \mathbf{E} \quad k < 1 - 2\sqrt{3} \text{ or } k > 1 + 2\sqrt{3} $$
$$ \mathbf{F} \quad \text{There are no such values of } k. $$
$$ \mathbf{G} \quad k < 1 - 2\sqrt{5} \text{ or } k > 1 + 2\sqrt{5} $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
The line $y = |2x + k|$ lies strictly below the curve if and only if:

$$ |2x + k| < x^2 + (k - 1)x + 5 \quad \text{for all } x \in \mathbb{R}, $$

which is equivalent to:

$$ 2x + k < x^2 + (k - 1)x + 5 \text{ and } -(2x + k) < x^2 + (k - 1)x + 5 \quad \text{for all } x \in \mathbb{R}. $$

This is because $|A| < B$ if and only if $A < B$ and $-A < B$. Geometrically, the parabola must dominate both branches of the V.

Rearranging gives

$$ x^2 + (k - 3)x + (5 - k) > 0 \quad \text{and} \quad x^2 + (k + 1)x + (5 + k) > 0 \quad \text{for all } x \in \mathbb{R}. $$

Each has positive leading coefficient, so each holds everywhere if and only if its discriminant is strictly negative.

First discriminant:

$$ (k - 3)^2 - 4(5 - k) = k^2 - 2k - 11 < 0 \quad \Leftrightarrow \quad 1 - 2\sqrt{3} < k < 1 + 2\sqrt{3}. $$

Second discriminant:

$$ (k + 1)^2 - 4(5 + k) = k^2 - 2k - 19 < 0 \quad \Leftrightarrow \quad 1 - 2\sqrt{5} < k < 1 + 2\sqrt{5}. $$

We require both to be true, therefore

$$ 1 - 2\sqrt{3} < k < 1 + 2\sqrt{3}. $$
