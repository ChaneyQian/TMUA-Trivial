---
database: TMUA
qid: 20132101205207
id: JZMaths_SetA-Mock-P2-Q7
paper: TMUA Mock
year:
number: Q7
section: Multiple Choice
difficulty: 6.5
topics: [Logic and Proof, Miscellaneous Pure]
subtopics: [Logic, Inequalities]
tags: [Logic Deduction, Inequalities]
status: 已入库
---

## 题目
The non-zero real numbers $a$, $b$, $c$ and $d$ satisfy $a < b$ and $c < d$.

Which of the following statements are **necessarily** true?

**I** $\quad$ $\frac{1}{a^3} > \frac{1}{b^3}$.

**II** $\quad$ $3^{-a} < 3^{-b}$.

**III** $\quad$ If $a, b$ are negative, then $ac < bd$.

**IV** $\quad$ If $a, b, c, d$ are all negative, then $ac > bd$.

$$ \mathbf{A} \quad \text{none of them} $$
$$ \mathbf{B} \quad \mathbf{II} \text{ only} $$
$$ \mathbf{C} \quad \mathbf{III} \text{ only} $$
$$ \mathbf{D} \quad \mathbf{II} \text{ and } \mathbf{IV} \text{ only} $$
$$ \mathbf{E} \quad \mathbf{I}, \mathbf{II} \text{ and } \mathbf{III} \text{ only} $$
$$ \mathbf{F} \quad \mathbf{II}, \mathbf{III} \text{ and } \mathbf{IV} \text{ only} $$
$$ \mathbf{G} \quad \mathbf{I}, \mathbf{II} \text{ and } \mathbf{IV} \text{ only} $$
$$ \mathbf{H} \quad \mathbf{IV} \text{ only} $$
$$ \mathbf{I} \quad \mathbf{I} \text{ only} $$
$$ \mathbf{J} \quad \mathbf{III} \text{ and } \mathbf{IV} \text{ only} $$

## 备注

### 我的备注

### AI备注


## 答案
H

## 解析
For **I**, this is necessarily true **if** $a$ and $b$ are both positive, but without the additional constraint, not true in general. A counterexample is $a = -1$ and $b = 1$.

For **II**, since $a < b$, multiplying by $-1$ gives $-a > -b$. Since $3^x$ is an increasing function, $3^{-a} > 3^{-b}$ must be true, and the statement stated with the reverse sign is never true.

For **III**, this is necessarily true if, in addition, $b$ and $d$ are positive, but without the additional constraint, it is not true in general. A counterexample is $a = -2$, $b = -1$, $c = -4$ and $d = -3$.

For **IV**, this is necessarily true. We have $a < b < 0$ and $c < d < 0$. Since $c < 0$, multiplying $a < b$ by $c$ reverses the inequality, so

$$ ac > bc. $$

Since $b < 0$, multiplying $c < d$ by $b$ also reverses the inequality, so

$$ bc > bd. $$

Therefore $ac > bc > bd$ and hence $ac > bd$.

Only **IV** is necessarily true.
