---
database: TMUA
qid: 20132101208206
id: JZMaths_SetD-Mock-P2-Q6
paper: TMUA Mock
year:
number: Q6
section: Multiple Choice
difficulty: 6.5
topics: [Logic and Proof, Function, Algebra (Basic)]
subtopics: [Logic, Algebraic Functions, Surds and indices]
tags: [General-Algebra, Inequalities]
status: 已入库
---

## 题目
Which of the following is a **sufficient** condition on the real constant $k$ for the equation

$$ (x + k)^{1/2} + (x - k)^{1/4} = k $$

to have at least one real solution for $x$?
$$ \mathbf{A} \quad k = 0 \text{ or } k > 3 $$
$$ \mathbf{B} \quad k = 1 \text{ or } k > 3 $$
$$ \mathbf{C} \quad k = 0 \text{ or } 1 < k < 3 $$
$$ \mathbf{D} \quad k \geq 1 $$
$$ \mathbf{E} \quad 0 \leq k \leq 3 $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Since the left-hand side is non-negative, there can be no solution when $k < 0$. When $k = 0$, the equation has the solution $x = 0$.

Now suppose $k > 0$. The domain requires $x \geq k$. The left-hand side is increasing in $x$, so its least value occurs at $x = k$ and is $(2k)^{1/2}$. Hence a solution exists if and only if $(2k)^{1/2} \leq k$. Since $k > 0$, this is equivalent to $2k \leq k^2$, so $k \geq 2$.

Therefore the equation has a real solution if and only if $k = 0$ or $k \geq 2$. Of the given conditions, $k = 0 \text{ or } k > 3$ is sufficient.
