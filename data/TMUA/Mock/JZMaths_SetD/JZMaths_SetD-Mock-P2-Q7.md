---
database: TMUA
qid: 20132101208207
id: JZMaths_SetD-Mock-P2-Q7
paper: TMUA Mock
year:
number: Q7
section: Multiple Choice
difficulty: 6.5
topics: []
subtopics: []
tags: [Differentiation, Logic Deduction]
status: 已入库
---

## 题目
Which of the following is a **necessary but not sufficient** condition for

$$ x^4 - 4x^2 + c = 0 $$

to have exactly 4 distinct real roots?
$$ \mathbf{A} \quad -2 < c < 3 $$
$$ \mathbf{B} \quad -1 < c < 5 $$
$$ \mathbf{C} \quad 1 < c < 6 $$
$$ \mathbf{D} \quad -3 < c < 2 $$
$$ \mathbf{E} \quad 2 < c < 7 $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Let $y = x^2$. Then the equation becomes

$$ y^2 - 4y + c = 0, $$

so $y = 2 \pm \sqrt{4 - c}$.

For the original equation to have four distinct real roots, there must be two distinct positive values of $y$. They are real and distinct when $c < 4$, while the smaller root is positive when $2 - \sqrt{4 - c} > 0$, which gives $c > 0$.

Hence the equation has exactly four distinct real roots if and only if $0 < c < 4$.

A necessary but not sufficient condition must contain every value in $(0, 4)$, as well as some values outside this interval. The condition $-1 < c < 5$ does this. It is not sufficient since, for example, $c = 4.5$ satisfies $-1 < c < 5$ but does not give four distinct real roots.

Therefore, the answer is $-1 < c < 5$.
