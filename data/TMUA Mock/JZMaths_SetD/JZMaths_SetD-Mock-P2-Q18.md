---
database: TMUA
qid: 20132101208218
id: JZMaths_SetD-Mock-P2-Q18
paper: TMUA Mock
year:
number: Q18
section: Multiple Choice
difficulty: 8
topics: [Calculus, Function, Logic and Proof]
subtopics: [Integration, Absolute Value Functions, Graphical Arguments]
tags: [Integration, General-Number-of-Solutions, Graphs-of-Functions]
status: 已入库
---

## 题目
Find all values of $k$ such that the equation

$$ \int_0^y (x + 1 - k - |x - 1| + |x - k|) \ dx = 0 $$

has exactly three distinct solutions for $y$, where $k > 1$ and $y \ge 0$.

$$ \mathbf{A} \quad k > 2 $$
$$ \mathbf{B} \quad k > 3 $$
$$ \mathbf{C} \quad k > 4 $$
$$ \mathbf{D} \quad k > 5 $$
$$ \mathbf{E} \quad 3 < k < 4 $$
$$ \mathbf{F} \quad 2 < k < 4 $$
$$ \mathbf{G} \quad \text{no such values of } k \text{ exist} $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Let

$$ f(x) = x + 1 - k - |x - 1| + |x - k|. $$

Resolving the modulus signs gives

$$ f(x) = \begin{cases}
x & \text{for } 0 \le x < 1, \\
2 - x & \text{for } 1 \le x < k, \\
x + 2 - 2k & \text{for } x \ge k.
\end{cases} $$

Thus the graph consists of straight-line segments with gradients $1$, $-1$ and $1$. The graph below illustrates the case $k = 3.5$.

![[Image/JZMaths_SetD-Mock-P2-Q18-fig1.png]]

From the diagram, it is immediately clear that $y = 0$ is a solution, another solution lies between $2$ and $5$, and a third lies to the right of $6$. From the same example, we see that the existence of three solutions for $y$ depends only on whether the area of the negative triangle is greater than the area of the first positive triangle. From the graph, this happens precisely when $k > 3$, so this is the required solution.

**Remark:** Although it is possible to evaluate the integral directly and use the resulting expression to deduce the answer, this is unwise, as it involves a large amount of calculation.
