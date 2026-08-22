---
database: TMUA
qid: 20132101203107
id: Yotta-Mock-P1-Q7
paper: TMUA Mock
year:
number: Q7
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
How many real solutions are there to
$$ 2(27^x) - 3^{2x+1} - 4(3^{x+1}) + 5 = 0 $$

$$
\mathbf{A} \quad 0
$$

$$
\mathbf{B} \quad 1
$$

$$
\mathbf{C} \quad 2
$$

$$
\mathbf{D} \quad 3
$$

$$
\mathbf{E} \quad 4
$$

$$
\mathbf{F} \quad 5
$$

$$
\mathbf{G} \quad 6
$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Substitute $t = 3^{x}$, noting $t > 0$ and that each positive $t$ corresponds to exactly one real $x$. Since $27^{x} = t^{3}$, $3^{2x+1} = 3t^{2}$ and $3^{x+1} = 3t$, the equation becomes

$$ 2t^{3} - 3t^{2} - 12t + 5 = 0 $$

Let $P(t) = 2t^{3} - 3t^{2} - 12t + 5$. Then $P'(t) = 6t^{2} - 6t - 12 = 6(t-2)(t+1)$, so on $t > 0$ the cubic decreases on $(0, 2)$ and increases on $(2, \infty)$ — at most one root in each piece.

Since $P(0) = 5 > 0$, $P(2) = 16 - 12 - 24 + 5 = -15 < 0$ and $P(t) \to +\infty$, there is exactly one root in $(0, 2)$ and exactly one in $(2, \infty)$.

So there are $2$ admissible values of $t$, hence $2$ real solutions for $x$. The answer is C. (The cubic does have a third root, but it is negative and so gives no value of $x$.)
