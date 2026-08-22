---
database: TMUA
qid: 20132101212106
id: BeyondHorizonS2-Mock-P1-Q6
paper: TMUA Mock
year:
number: Q6
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Find the finite area enclosed between the line $y = 0$ and the curve $y = x^2 - 5|x| - 24$.
$$\mathbf{A} \quad \frac{544}{3}$$
$$\mathbf{B} \quad \frac{264}{3}$$
$$\mathbf{C} \quad \frac{1088}{3}$$
$$\mathbf{D} \quad 162$$
$$\mathbf{E} \quad 216$$
$$\mathbf{F} \quad 432$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
The curve is even in $x$, so it is symmetric about the $y$-axis. For $x \geq 0$ it reduces to $y = x^2 - 5x - 24 = (x - 8)(x + 3)$, whose only non-negative root is $x = 8$; by symmetry the curve meets $y = 0$ at $x = \pm 8$ and lies below the axis in between. The enclosed area is therefore
$$2\int_{0}^{8} \big(24 + 5x - x^2\big)\,dx = 2\left[24x + \frac{5x^2}{2} - \frac{x^3}{3}\right]_{0}^{8} = 2\left(192 + 160 - \frac{512}{3}\right) = 2 \cdot \frac{544}{3} = \frac{1088}{3}.$$
The answer is C. Option A is exactly half of this and is what you get by integrating only over $0 \leq x \leq 8$ and forgetting the mirror image.
