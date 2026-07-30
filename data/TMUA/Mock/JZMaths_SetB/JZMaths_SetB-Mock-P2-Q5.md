---
database: TMUA
qid: 20132101206205
id: JZMaths_SetB-Mock-P2-Q5
paper: TMUA Mock
year:
number: Q5
section: Multiple Choice
difficulty: 6
topics: []
subtopics: []
tags: [Inequalities, Logic Equivalence]
status: 已入库
---

## 题目
Let $k$ be a real constant. Consider the polynomial functions

$$ p(x) = 2kx^4 - x^2 + 5k \quad \text{and} \quad q(x) = kx^4 + x^2 + k. $$

Which of the following is the **necessary and sufficient** condition on $k$ for $p(x) \ge q(x)$ for all real $x$?

$$ \mathbf{A} \quad k \ge 0 $$
$$ \mathbf{B} \quad k > 0 $$
$$ \mathbf{C} \quad k \ge \frac{1}{4} $$
$$ \mathbf{D} \quad k \ge \frac{1}{2} $$
$$ \mathbf{E} \quad k > \frac{1}{2} $$
$$ \mathbf{F} \quad k \le -\frac{1}{2} $$
$$ \mathbf{G} \quad k \ge \frac{1}{2} \text{ or } k \le -\frac{1}{2} $$
$$ \mathbf{H} \quad -\frac{1}{2} \le k \le \frac{1}{2} $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
We need $p(x) \ge q(x)$ for all real $x$, so

$$ 2kx^4 - x^2 + 5k \ge kx^4 + x^2 + k. $$

Rearranging gives

$$ kx^4 - 2x^2 + 4k \ge 0. $$

This is a quadratic in $x^2$, let $u = x^2$. Since $x$ is real, $u \ge 0$. So we need

$$ ku^2 - 2u + 4k \ge 0 $$

for all $u\geq 0$.

If $k\leq 0$, then $ku^2-2u+4k$ cannot be non-negative for all $u\geq 0$. So we need $k>0$.

For $k>0$, for the quadratic to be non-negative for all $u$, we just need $b^2-4ac\leq 0$:
$$
4-16k^2\leq 0
\quad\Leftrightarrow\quad
4k^2-1\geq 0
\quad\Leftrightarrow\quad
(2k-1)(2k+1)\geq 0.
$$

Recall $k>0$, therefore $k\geq \frac12$.
