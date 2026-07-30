---
database: TMUA
qid: 20132101209203
id: JZMaths_SetE-Mock-P2-Q3
paper: TMUA Mock
year:
number: Q3
section: Multiple Choice
difficulty: 6
topics: []
subtopics: []
tags: [Logic Deduction]
status: 已入库
---

## 题目
A real number $x$ is such that **exactly one** of the following six statements is true.

I $\quad x^2 < 9$

II $\quad |x - 1| < 1$

III $\quad x, 2, 4$ are the first three terms of a geometric sequence with positive common ratio

IV $\quad \log_2(x + 1)$ is defined and less than 1

V $\quad x$ is a positive solution of $u^2 - 3u + 2 = 0$

VI $\quad$ the circle $X^2 + Y^2 = 1$ meets the line $X = x$ in two distinct points

$$ \mathbf{A} \quad \text{I} $$
$$ \mathbf{B} \quad \text{II} $$
$$ \mathbf{C} \quad \text{III} $$
$$ \mathbf{D} \quad \text{IV} $$
$$ \mathbf{E} \quad \text{V} $$
$$ \mathbf{F} \quad \text{VI} $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
It turns out each of II to VI implies I!

Indeed, II gives $0 < x < 2$, III gives $x = 1$, IV gives $-1 < x < 1$, V gives $x = 1$ or $x = 2$, and VI gives $-1 < x < 1$. In each case, $x^2 < 9$.

Therefore, if any of II to VI were true, then I would also be true. Since exactly one statement is true, the only possible true statement is I.

Note it is also possible for I to be the only true statement, for example when $x = \frac{5}{2}$.
