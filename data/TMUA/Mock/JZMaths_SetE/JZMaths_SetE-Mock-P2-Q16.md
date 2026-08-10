---
database: TMUA
qid: 20132101209216
id: JZMaths_SetE-Mock-P2-Q16
paper: TMUA Mock
year:
number: Q16
section: Multiple Choice
difficulty: 7.5
topics: [Logic and Proof, Miscellaneous Pure, Calculus]
subtopics: [Logic, Numerical Methods, Differentiation Application, Integral Identity]
tags: [Logic Deduction, Integration, Differentiation]
status: 已入库
---

## 题目
Let $f$ be a positive function defined on $[0, \infty)$ and twice differentiable on $(0, \infty)$. Define
$$ I = \int_0^4 f(x) \,dx, $$
and let $J_n$ be the trapezium rule estimate of $I$ using $n$ strips of equal width, where $n$ is a positive integer.
Which of the following statements are necessarily true?
(1) If $f''(x) > 0$ for all $0 < x < 4$, then $J_n > I$ for every positive integer $n$.
(2) If $f''(x) \ge 0$ and $f'(x) > 0$ for all $0 < x < 4$, then $J_{n+1} < J_n$ for every positive integer $n$.
(3) If $I < J_n$ for some positive integer $n$, then
$$ \int_0^4 f(4 - x) \,dx < J_{n+1}. $$
$$ \mathbf{A} \quad \text{(1) only.} $$
$$ \mathbf{B} \quad \text{(2) only.} $$
$$ \mathbf{C} \quad \text{(3) only.} $$
$$ \mathbf{D} \quad \text{(1) and (2) only.} $$
$$ \mathbf{E} \quad \text{(1) and (3) only.} $$
$$ \mathbf{F} \quad \text{(2) and (3) only.} $$
$$ \mathbf{G} \quad \text{none of them.} $$
$$ \mathbf{H} \quad \text{all of them} $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Statement (1) is true. Since $f''(x) > 0$ on $(0, 4)$, the graph of $f$ is strictly convex. On each strip, the chord joining the endpoints of the graph lies strictly above the graph inside the strip. Therefore, the area of each trapezium is greater than the corresponding area under the curve. Adding the areas of all the strips gives $J_n > I$.

For statement (2), $f(x) = x + 1$ is a counterexample, since $f(x) > 0$ on $[0, \infty)$, while $f''(x) = 0$ and $f'(x) = 1 > 0$. Since the trapezium rule is exact for a linear function,
$$ J_{n+1} = J_n = I $$
for every positive integer $n$. Therefore, statement (2) is false.

For statement (3), reflection does not change the value of the integral:
$$ \int_0^4 f(4 - x) \,dx = \int_0^4 f(x) \,dx = I. $$
Therefore, statement (3) is really claiming that
$$ I < J_n \quad \implies \quad I < J_{n+1}. $$
However, without any condition on the curvature of $f$, this is not necessarily true. Increasing the number of strips can change an overestimate into an underestimate. A suitable polynomial counterexample can be constructed for which $J_n > I$ but $J_{n+1} < I$. Therefore, statement (3) is false.

Therefore, only statement (1) is true.

**Remark:** Just to be rigorous,for a counterexample of (3), for example, take
$$ f(x) = 2 + 2x - \frac{(x(4 - x))^3}{64}. $$
This curve passes through $(0, 2)$ and $(4, 10)$, but dips below the chord joining these points, particularly near $x = 2$. Thus the one-strip estimate is too large, while the extra midpoint used by the two-strip estimate makes it too small.
Indeed,
$$ J_1 = 24, \quad I = 22.17, \quad J_2 = 22, $$
so
$$ J_1 > I > J_2. $$
