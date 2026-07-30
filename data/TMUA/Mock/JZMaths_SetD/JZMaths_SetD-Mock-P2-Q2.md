---
database: TMUA
qid: 20132101208202
id: JZMaths_SetD-Mock-P2-Q2
paper: TMUA Mock
year:
number: Q2
section: Multiple Choice
difficulty: 5.5
topics: []
subtopics: []
tags: [Exponentials and Logarithms]
status: 已入库
---

## 题目
Real numbers $w, x, y, z$ all satisfy $w, x, y, z > 1$ and

$$ \log_w x = x, \qquad \log_x y = y, \qquad \log_y z = z. $$

Which of the following is equal to $\log_w z$?
$$ \mathbf{A} \quad xyz $$
$$ \mathbf{B} \quad \frac{1}{xyz} $$
$$ \mathbf{C} \quad \frac{1}{wxyz} $$
$$ \mathbf{D} \quad \frac{1}{x + y + z} $$
$$ \mathbf{E} \quad \frac{1}{xy} $$
$$ \mathbf{F} \quad \frac{1}{yz} $$
$$ \mathbf{G} \quad x + y + z $$
$$ \mathbf{H} \quad wxyz $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Convert each given equation to exponential form and chain the substitutions.

From $\log_w x = x$ we have $x = w^x$.

From $\log_x y = y$ we have $y = x^y = (w^x)^y = w^{xy}$, so $\log_w y = xy$.

From $\log_y z = z$ we have $z = y^z = (w^{xy})^z = w^{xyz}$, so $\log_w z = xyz$.
