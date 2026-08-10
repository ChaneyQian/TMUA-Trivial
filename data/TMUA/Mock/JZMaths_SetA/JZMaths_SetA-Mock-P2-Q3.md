---
database: TMUA
qid: 20132101205203
id: JZMaths_SetA-Mock-P2-Q3
paper: TMUA Mock
year:
number: Q3
section: Multiple Choice
difficulty: 5.5
topics: [Logic and Proof, Miscellaneous Pure]
subtopics: [Logic, Inequalities]
tags: [Logic Deduction, Logic Equivalence]
status: 已入库
---

## 题目
A student attempts to solve the inequality

$$ \sqrt{x - 3} < x - 2. $$

Consider the following attempt:

Can only square-root non-negative, therefore $x - 3 \ge 0 \quad \Leftrightarrow \quad x \ge 3$. $\quad$ (I)

Squaring both sides gives $x - 3 < (x - 2)^2$. $\quad$ (II)

Simplifies to $0 < x^2 - 5x + 7$. $\quad$ (III)

The discriminant of $x^2 - 5x + 7$ is $25 - 28 = -3 < 0$. $\quad$ (IV)

Since the leading coefficient is positive, $x^2 - 5x + 7 > 0$ for all real $x \ge 3$. $\quad$ (V)

Therefore the solution is $x \ge 3$. $\quad$ (VI)

$$ \mathbf{A} \quad \text{The attempt is invalid, and the first problematic step is (I).} $$
$$ \mathbf{B} \quad \text{The attempt is invalid, and the first problematic step is (II).} $$
$$ \mathbf{C} \quad \text{The attempt is invalid, and the first problematic step is (III).} $$
$$ \mathbf{D} \quad \text{The attempt is invalid, and the first problematic step is (IV).} $$
$$ \mathbf{E} \quad \text{The attempt is invalid, and the first problematic step is (V).} $$
$$ \mathbf{F} \quad \text{The attempt is invalid, and the first problematic step is (VI).} $$
$$ \mathbf{G} \quad \text{The attempt is valid, and the solution is correct.} $$

## 备注

### 我的备注

### AI备注


## 答案
G

## 解析
The attempt is valid, and the solution is correct!

The **trap** in this question is that step **(II)** may look careless. Students are often under the impression that we cannot square both sides of an inequality, so they may wrongly think that step **(II)** is automatically invalid.

However, the true rule is more nuanced. Whether squaring is valid depends on whether the original inequality and the squared inequality are equivalent.

In general, they are not equivalent. But in this case, step **(I)** gives $x \ge 3$, so $x - 2 \ge 1 > 0$. Also, $\sqrt{x - 3}$ is non-negative. Therefore both sides of the inequality are non-negative, and squaring both sides gives an equivalent inequality:

$$ \sqrt{x - 3} < x - 2 \quad \Leftrightarrow \quad x - 3 < (x - 2)^2. $$

So step **(II)** is a valid and useful step, not an error. The rest of the working correctly shows that $x^2 - 5x + 7 > 0$ for all real $x$, so the inequality holds for every $x$ in the domain $x \ge 3$.
