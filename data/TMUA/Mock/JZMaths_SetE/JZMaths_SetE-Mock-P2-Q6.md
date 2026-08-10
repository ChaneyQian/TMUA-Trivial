---
database: TMUA
qid: 20132101209206
id: JZMaths_SetE-Mock-P2-Q6
paper: TMUA Mock
year:
number: Q6
section: Multiple Choice
difficulty: 6
topics: [Geometry, Function, Algebra (Basic)]
subtopics: [Coordinate Geometry, Algebraic Functions, Algebra Manipulation]
tags: [Transformation of Graphs]
status: 已入库
---

## 题目
Let $c > 0$ be a fixed real constant. For each real number $b$, define
$$ f_b(x) = x^2 - 2bx + c, $$

and let $P_b$ denote the vertex of the graph $y = f_b(x)$. As $b$ varies over the real numbers, the point $P_b$ traces out a curve $\Gamma$ in the $(x, y)$-plane.

Consider the following three statements.

(I) The curve $\Gamma$ has equation $y = c + x^2$.

(II) For all real numbers $b_1 < b_2$, the point $P_{b_2}$ lies strictly to the right of, and strictly below, the point $P_{b_1}$.

(III) There is a unique real value of $b$ for which $f_b$ has a repeated root.

Which of the statements are necessarily true?

$$ \mathbf{A} \quad \text{(I) only} $$
$$ \mathbf{B} \quad \text{(II) only} $$
$$ \mathbf{C} \quad \text{(III) only} $$
$$ \mathbf{D} \quad \text{(I) and (II) only} $$
$$ \mathbf{E} \quad \text{(I) and (III) only} $$
$$ \mathbf{F} \quad \text{(II) and (III) only} $$
$$ \mathbf{G} \quad \text{all of them} $$
$$ \mathbf{H} \quad \text{none of them} $$

## 备注

### 我的备注

### AI备注


## 答案
H

## 解析
Completing the square, $f_b(x) = (x - b)^2 + (c - b^2)$, so the vertex is $P_b = (b, c - b^2)$.

(I) Setting $X = b$ and $Y = c - b^2$, the locus satisfies $Y = c - X^2$. As $b$ ranges over $\mathbb{R}$, $X$ also ranges over $\mathbb{R}$, so $\Gamma$ is exactly the parabola $y = c - x^2$. Therefore (I) is false.

(II) Recall that the actual curve of $P_b$ is $y = c - x^2$, this is an inverted quadratic, and so (II) is not true for all the points to the left of the maximum of the curve. Therefore (II) is false.

(III) Repeated root occurs if and only if $(c - b^2) = 0$, and since $c > 0$, there are two values of $b$ that works, $\pm\sqrt{c}$, hence (III) is also false, as (III) require there to be always precisely one value of $b$ for which $f_b$ has repeated roots.

So none of them are true.
