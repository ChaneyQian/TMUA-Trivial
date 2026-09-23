---
database: TMUA
qid: 90020210100
id: SMT-Ch3-Q1
paper: SMT Skills Ch3
year:
number: Q1
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
The expansion of $(a - bx)^c$ is $4 - px + 108x^2 + qx^3 + rx^4$ where $a, b, c, p, q$ and $r$ are positive real constants. Find the value of $p + q + r$.

$$\mathbf{A} \quad 81 + 132\sqrt{2}$$

$$\mathbf{B} \quad 81 - 84\sqrt{2}$$

$$\mathbf{C} \quad 132\sqrt{2} - 81$$

$$\mathbf{D} \quad 81 + 84\sqrt{2}$$

$$\mathbf{E} \quad 81 - 132\sqrt{2}$$

$$\mathbf{F} \quad 84\sqrt{2} - 81$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 3 章 Algebra 章末 TMUA style 第 1 题；解析为书后官方 worked solution。

## 答案
B

## 解析
For the expansion to give a quartic polynomial, $c = 4$ is necessary.
Looking at the constant term of $(a - bx)^{4}$ shows that $a^{4} = 4$. Since $a$ is positive and real, $a = \sqrt{2}$ is necessary.
The $x^{2}$ term in the expansion of $\left( \sqrt{2} - bx \right)^{4}$ is $6 \times \left( \sqrt{2} \right)^{2} \times ( - bx)^{2} \equiv 12b^{2}x^{2}$, so $12b^{2} = 108 \Leftrightarrow b^{2} = 9 \Leftrightarrow b = 3$, since $b$ is positive. (Seeing the possible answers and the appearance everywhere of $81 = 3^{4}$, does suggest the possibility of $b = 3$.)
The expansion is $\left( \sqrt{2} - 3x \right)^{4} \equiv \left( \sqrt{2} \right)^{4} + 4 \times \left( \sqrt{2} \right)^{3} \times ( - 3x) + 6 \times \left( \sqrt{2} \right)^{2} \times ( - 3x)^{2} + 4 \times \sqrt{2} \times ( - 3x)^{3} + ( - 3x)^{4} \equiv 4 - 24\sqrt{2}x + 108x^{2} - 108\sqrt{2}x^{3} + 81x^{4}$.
From this, $p + q + r = 24\sqrt{2} - 108\sqrt{2} + 81 = 81 - 84\sqrt{2}$.
The answer is B.
