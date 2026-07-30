---
database: TMUA
qid: 20132101205101
id: JZMaths_SetA-Mock-P1-Q1
paper: TMUA Mock
year:
number: Q1
section: Multiple Choice
difficulty: 5.5
topics: []
subtopics: []
tags: [Area Integration]
status: 已入库
---

## 题目
Find the finite area enclosed between the curve $y = |x^2 - 1|$ and the line $y = 3$.
$$ \mathbf{A} \quad \frac{13}{3} $$
$$ \mathbf{B} \quad 4 $$
$$ \mathbf{C} \quad 8 $$
$$ \mathbf{D} \quad \frac{25}{3} $$
$$ \mathbf{E} \quad \frac{23}{3} $$
$$ \mathbf{F} \quad \frac{11}{3} $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Note the curve and line meet at $x = 2, -2$, and the setup is symmetric about the $y$-axis, so we find the area from $x = 0$ to $x = 2$ and double it.

It is easier to calculate area bounded below the curve with $x$-axis then subtract it from the bounding rectangle.

For $0 < x < 1$, the curve $y = |x^2 - 1| = 1 - x^2$, thus area is $\int_0^1 1 - x^2 dx = 2/3$.

For $1 < x < 2$, the curve $y = |x^2 - 1| = x^2 - 1$, thus area is $\int_1^2 x^2 - 1 dx = 4/3$.

Then $2/3 + 4/3 = 2$, and rectangle area is $2 \times 3 = 6$, therefore final answer is $2 \times (6 - 2) = 8$.
