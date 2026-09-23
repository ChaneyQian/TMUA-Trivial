---
database: TMUA
qid: 90020250700
id: SMT-Ch7-Q7
paper: SMT Skills Ch7
year:
number: Q7
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
style: TMUA
solution_source: 书后解答
status: 已入库
---

## 题目
How many real roots does the equation $3x^5 - 10x^3 - 225x + 10 = 0$ have?

$$\mathbf{A} \quad 1$$

$$\mathbf{B} \quad 2$$

$$\mathbf{C} \quad 3$$

$$\mathbf{D} \quad 4$$

$$\mathbf{E} \quad 5$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 7 章 Graphs 章末 TMUA style 第 7 题；解析为书后官方 worked solution。

## 答案
C

## 解析
Differentiate to locate the turning points.
$$\frac{\mathrm{d}y}{\mathrm{d}x} = 15x^{4} - 30x^{2} - 225 = 15\left(x^{2} - 5\right)\left(x^{2} + 3\right)$$
Since $x^{2} + 3 > 0$ always, the only stationary points are $x = \pm\sqrt{5}$, and
$$\begin{aligned}
f\left(\sqrt{5}\right) &= 75\sqrt{5} - 50\sqrt{5} - 225\sqrt{5} + 10 = 10 - 200\sqrt{5} < 0\
f\left(-\sqrt{5}\right) &= 10 + 200\sqrt{5} > 0
\end{aligned}$$
So the quintic has a local maximum above the $x$ axis and a local minimum below it, and it runs from $-\infty$ to $+\infty$. It therefore crosses
the axis once before the maximum, once between the two turning points and once after the minimum.
There are three real roots. The correct answer is (C).
