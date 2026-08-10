---
database: TMUA
qid: 20132101207206
id: JZMaths_SetC-Mock-P2-Q6
paper: TMUA Mock
year:
number: Q6
section: Multiple Choice
difficulty: 6.5
topics: [Logic and Proof, Calculus, Function]
subtopics: [Logic, Differentiation Application, Algebraic Functions]
tags: [Logic Deduction, Inequalities]
status: 已入库
---

## 题目
Let $x \neq 0$ and
$$ f(x) = \frac{3}{7}x^{7/3} + \frac{3}{4}x^{4/3} - 6x^{1/3}. $$

A student attempts to find the values of $x$ for which the curve is increasing.

Their working is shown below.

**I.** $f'(x) = x^{4/3} + x^{1/3} - 2x^{-2/3}$

**II.** $f'(x) = x^{-2/3}(x^2 + x - 2)$

**III.** $x^{-2/3}(x^2 + x - 2) \geq 0$

**IV.** $x^2 + x - 2 \geq 0$

**V.** $(x - 1)(x + 2) \geq 0$

**VI.** $x \leq -2$ or $x \geq 1$

Which of the following is true?

$$ \mathbf{A} \quad \text{The first error is in step \textbf{I}.} $$
$$ \mathbf{B} \quad \text{The first error is in step \textbf{II}.} $$
$$ \mathbf{C} \quad \text{The first error is in step \textbf{III}.} $$
$$ \mathbf{D} \quad \text{The first error is in step \textbf{IV}.} $$
$$ \mathbf{E} \quad \text{The first error is in step \textbf{V}.} $$
$$ \mathbf{F} \quad \text{The first error is in step \textbf{VI}.} $$
$$ \mathbf{G} \quad \text{The student's answer is correct.} $$

## 备注

### 我的备注

### AI备注


## 答案
G

## 解析
For $x \neq 0$, differentiating term by term gives

$$ f'(x) = \frac{3}{7} \cdot \frac{7}{3}x^{4/3} + \frac{3}{4} \cdot \frac{4}{3}x^{1/3} - 6 \cdot \frac{1}{3}x^{-2/3}, $$

so

$$ f'(x) = x^{4/3} + x^{1/3} - 2x^{-2/3}. $$

Therefore step I is correct.

Now

$$ x^{4/3} = x^{-2/3}x^2 \quad \text{and} \quad x^{1/3} = x^{-2/3}x, $$

so

$$ f'(x) = x^{-2/3}(x^2 + x - 2). $$

Therefore step II is correct.

The curve is increasing when $f'(x) \geq 0$, so step III is correct. Since $x \neq 0$, we have $x^{-2/3} > 0$, so dividing by $x^{-2/3}$ does not change the direction of the inequality. Hence

$$ x^2 + x - 2 \geq 0. $$

Therefore step IV is correct.

Next,

$$ x^2 + x - 2 = (x - 1)(x + 2), $$

so step V is correct. Finally, $(x - 1)(x + 2) \geq 0$ outside the two roots, giving

$$ x \leq -2 \quad \text{or} \quad x \geq 1. $$

Therefore step VI is correct. So the student's working is correct!

**Remark:** When dividing by an expression involving $x$, we must check carefully whether that expression could be zero. Sometimes division is valid; other times it is not!
