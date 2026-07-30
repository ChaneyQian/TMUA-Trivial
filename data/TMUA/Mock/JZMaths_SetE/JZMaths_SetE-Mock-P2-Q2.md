---
database: TMUA
qid: 20132101209202
id: JZMaths_SetE-Mock-P2-Q2
paper: TMUA Mock
year:
number: Q2
section: Multiple Choice
difficulty: 5.5
topics: []
subtopics: []
tags: [Logic Deduction, General Algebra]
status: 已入库
---

## 题目
Consider the following attempt to solve the equation $(x - 2)\sqrt{x + 3} = x^2 - 5x + 6$:
$$ (x - 2)\sqrt{x + 3} = x^2 - 5x + 6 \quad \text{(I)} $$
$$ (x - 2)\sqrt{x + 3} = (x - 2)(x - 3) \quad \text{(II)} $$
$$ \sqrt{x + 3} = x - 3 \quad \text{(III)} $$
$$ x + 3 = (x - 3)^2 \quad \text{(IV)} $$
$$ x + 3 = x^2 - 6x + 9 \quad \text{(V)} $$
$$ x^2 - 7x + 6 = 0 \quad \text{(VI)} $$
$$ (x - 1)(x - 6) = 0 \quad \text{(VII)} $$
The solutions of the original equation are concluded to be $x = 1$ and $x = 6$.

Which one of the following is true?

$$ \mathbf{A} \quad \text{The conclusion is entirely correct.} $$
$$ \mathbf{B} \quad \text{The conclusion is not entirely correct; the first error occurs in passing from (I) to (II).} $$
$$ \mathbf{C} \quad \text{The conclusion is not entirely correct; the first error occurs in passing from (II) to (III).} $$
$$ \mathbf{D} \quad \text{The conclusion is not entirely correct; the first error occurs in passing from (III) to (IV).} $$
$$ \mathbf{E} \quad \text{The conclusion is not entirely correct; the first error occurs in passing from (IV) to (V).} $$
$$ \mathbf{F} \quad \text{The conclusion is not entirely correct; the first error occurs in passing from (V) to (VI).} $$
$$ \mathbf{G} \quad \text{The conclusion is not entirely correct; the first error occurs in passing from (VI) to (VII).} $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
The factorisation in passing from (I) to (II) is correct, since $x^2 - 5x + 6 = (x - 2)(x - 3)$.

The first error occurs in passing from (II) to (III). Dividing both sides by $x - 2$ assumes that $x 
e 2$, but $x = 2$ satisfies the original equation, since both sides are 0. This solution is therefore lost.

For $x 
e 2$, equation (III) is $\sqrt{x + 3} = x - 3$. Since the left-hand side is non-negative, any solution must satisfy $x \ge 3$. Squaring gives $(x - 1)(x - 6) = 0$, so the only possible value satisfying $x \ge 3$ is $x = 6$.

Thus the solutions of the original equation are $x = 2$ and $x = 6$. The stated conclusion $x = 1$ and $x = 6$ is not entirely correct, and the first error occurs in passing from (II) to (III).
