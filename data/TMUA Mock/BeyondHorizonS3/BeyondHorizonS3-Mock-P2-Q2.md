---
database: TMUA
qid: 20132101213202
id: BeyondHorizonS3-Mock-P2-Q2
paper: TMUA Mock
year:
number: Q2
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The graph of the function $y = 2^{x^2-4x+3}$ can be obtained from the graph of $y = 2^{x^2}$ by
$$\mathbf{A} \quad \text{a stretch parallel to the y-axis followed by a translation parallel to the y-axis}$$
$$\mathbf{B} \quad \text{a translation parallel to the x-axis followed by a stretch parallel to the y-axis}$$
$$\mathbf{C} \quad \text{a translation parallel to the x-axis followed by a stretch parallel to the x-axis}$$
$$\mathbf{D} \quad \text{a translation parallel to the x-axis followed by reflection in the y-axis}$$
$$\mathbf{E} \quad \text{reflection in the y-axis followed by translation parallel to the y-axis}$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Complete the square in the exponent: $x^2 - 4x + 3 = (x-2)^2 - 1$. Therefore
$$2^{x^2-4x+3} = 2^{(x-2)^2 - 1} = \tfrac{1}{2} \cdot 2^{(x-2)^2}.$$
Reading this from the inside out, we first replace $x$ by $x-2$, which is a translation of $2$ units in the positive $x$ direction, i.e. a translation parallel to the $x$-axis. We then multiply the whole output by $\tfrac{1}{2}$, which is a stretch parallel to the $y$-axis with scale factor $\tfrac{1}{2}$.

No additive constant ever appears outside the power, so any option ending in a translation parallel to the $y$-axis (A and E) is wrong; the exponent's argument is scaled by $1$, not by a constant, so there is no stretch parallel to the $x$-axis (C); and the graph is not reflected, since $(x-2)^2$ is not of the form $(-x+k)^2$ applied to $x^2$ alone (D). The answer is B.
