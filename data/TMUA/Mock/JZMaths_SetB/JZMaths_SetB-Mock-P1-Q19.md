---
database: TMUA
qid: 20132101206119
id: JZMaths_SetB-Mock-P1-Q19
paper: TMUA Mock
year:
number: Q19
section: Multiple Choice
difficulty: 8
topics: [Polynomial, Function, Logic and Proof]
subtopics: [Solution of Equations, Absolute Value Functions, Graphical Arguments]
tags: [General Number of Solutions, Graphs of Functions]
status: 已入库
---

## 题目
Let $p$ be a real number, and let $n$ denote the number of points of intersection of the curves $y = |x^3 - p^3|$ and $y = p^3|x - 1|$. $n$ **cannot** take which of the following values?

$$ \mathbf{A} \quad 0 $$
$$ \mathbf{B} \quad 1 $$
$$ \mathbf{C} \quad 4 $$
$$ \mathbf{D} \quad 3 $$
$$ \mathbf{E} \quad 2 $$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
Setting the curves equal: $|x^3 - p^3| = p^3|x - 1|$.

**Case** $p < 0$. Then $p^3 < 0$, so $\text{LHS} \ge 0 \ge \text{RHS}$. Equality forces both sides to vanish, requiring $x = p$ and $x = 1$ simultaneously, which is impossible. Hence $n = 0$.

**Case** $p = 0$. The equation reduces to $|x^3| = 0$, giving the single root $x = 0$. Hence $n = 1$.

**Case** $p > 0$. There are a couple of ways to analyse this, and sketching graphs is a great method, since both curves are easy to sketch for $p > 0$.

Now, the absolute value causes the graph of $x^3 - p^3$ to be reflected where it would be negative, with the turning point at $x = p$. Similarly, the graph of $x - 1$ is reflected where it would be negative, with the corner at $x = 1$. This indicates that we should examine three sub-cases: $0 < p < 1$, $p = 1$ and $1 < p$.

For $0 < p < 1$, if you sketch both graphs, for example with $p = 1/2$, you will observe that $-(x^3 - 1/8)$ and $1/8(-x + 1)$ intersect 3 times, and $(x^3 - 1/8)$ and $1/8(-x + 1)$ intersect once, so $n = 4$ in this case. The same qualitative shape holds for all $0 < p < 1$, so for all these cases, $n = 4$.

For $p = 1$, if you sketch both graphs, you will observe that $-(x^3 - 1)$ and $(-x + 1)$ intersect 3 times, and the two reflection points coincide at $x = 1$. So altogether in this case, there are still 3 intersections, and hence $n = 3$.

For $1<p$, if you sketch both graphs, for example with $p=2$, you will observe that $-(x^3-8)$ and $8(-x+1)$ intersect 2 times, $-(x^3-8)$ and $8(x-1)$ intersect once, and $(x^3-8)$ and $8(x-1)$ intersect once, so $n=4$ in this case too. The same qualitative shape holds for all $1<p$, so for all these cases, $n=4$.

Therefore the only value in the options $n$ cannot take is 2.
