---
database: TMUA
qid: 20132101211118
id: BeyondHorizonS1-Mock-P1-Q18
paper: TMUA Mock
year:
number: Q18
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Let $x, y, z$ be positive. The least value of the following expression is
$$\frac{x(1+y) + y(1+z) + z(1+x)}{\sqrt{xyz}}$$
$$\mathbf{A} \quad \frac{9}{\sqrt{2}}$$
$$\mathbf{B} \quad 6$$
$$\mathbf{C} \quad \frac{1}{\sqrt{6}}$$
$$\mathbf{D} \quad 3$$
$$\mathbf{E} \quad 1$$
$$\mathbf{F} \quad \text{None of the Above}$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
The numerator expands to $x + y + z + xy + yz + zx$. Writing $p = (xyz)^{1/3}$, the AM-GM inequality applied separately to the two groups of three terms gives $x+y+z \geq 3p$ and $xy + yz + zx \geq 3p^2$, so the whole expression is at least
$$\frac{3p + 3p^2}{p^{3/2}} = 3\left( p^{-1/2} + p^{1/2} \right)$$
A second application of AM-GM to $p^{-1/2} + p^{1/2}$ shows this is at least $3 \times 2 = 6$. Both inequalities become equalities when $x = y = z = 1$, and substituting those values indeed gives $\frac{2+2+2}{1} = 6$, so the bound is attained. The answer is B. Option D is the trap for anyone who applies AM-GM to only one of the two groups.
