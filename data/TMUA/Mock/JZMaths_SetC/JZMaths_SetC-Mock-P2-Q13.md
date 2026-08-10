---
database: TMUA
qid: 20132101207213
id: JZMaths_SetC-Mock-P2-Q13
paper: TMUA Mock
year:
number: Q13
section: Multiple Choice
difficulty: 7
topics: [Logic and Proof, Algebra (Basic)]
subtopics: [Logic, Surds and indices]
tags: [Logic Sufficiency, Logic Equivalence, Logic Deduction]
status: 已入库
---

## 题目
Let $x$ and $y$ be non-zero real numbers with $x \neq y$.

Which one of the following statements is both **necessary and sufficient** for $x < y$?

$$ \mathbf{A} \quad y^{-1/3} < x^{-1/3} $$
$$ \mathbf{B} \quad y^{1/5} < x^{1/5} $$
$$ \mathbf{C} \quad x^{2/3} < y^{2/3} $$
$$ \mathbf{D} \quad y^{2/3} < x^{2/3} $$
$$ \mathbf{E} \quad |x|^{1/3} < |y|^{1/3} $$
$$ \mathbf{F} \quad x^{-1/3} < y^{-1/3} $$
$$ \mathbf{G} \quad x^{1/5} < y^{1/5} $$

## 备注

### 我的备注

### AI备注


## 答案
G

## 解析
Here are some general facts to note.

If $n$ is odd, then $a < b$ is equivalent to $a^{1/n} < b^{1/n}$, since taking an odd $n$th root preserves the inequality.

However, if $n$ is even, then $a < b$ is not equivalent to $a^n < b^n$, since raising both sides to an even power does not preserve the inequality in general.

Apply the first result to our $x < y$, we can see that $x^{1/5} < y^{1/5}$ is definitely equivalent, and given there is only one equivalent statement, this must be it.

**Remark:** It is possible to rule out each of the distractors with a single numerical counterexample.

For **A**, take $x = -1$ and $y = 1$. Then $x < y$, but

$$ y^{-1/3} = 1 \quad \text{and} \quad x^{-1/3} = -1, $$

so $y^{-1/3} < x^{-1/3}$ is false.
