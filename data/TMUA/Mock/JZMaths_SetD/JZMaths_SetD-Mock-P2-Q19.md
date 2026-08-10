---
database: TMUA
qid: 20132101208219
id: JZMaths_SetD-Mock-P2-Q19
paper: TMUA Mock
year:
number: Q19
section: Multiple Choice
difficulty: 8
topics: [Logic and Proof]
subtopics: [Logic]
tags: [Logic Deduction, Logic Sufficiency, Logic Equivalence]
status: 已入库
---

## 题目
Let $f$ be a function defined on the real numbers. Consider the following seven statements, each intended to hold for all real values of $a$:

(1) $f(a) > 0$ if $a > 0$.
(2) $a > 0$ is necessary for $f(a) > 0$.
(3) $a \le 0$ only if $f(a) \le 0$.
(4) If $f(a) \le 0$, then $a \le 0$.
(5) $f(a) > 0$ whenever $a \le 0$.
(6) $a > 0$ is sufficient for $f(a) > 0$.
(7) $f(a) \le 0$ is sufficient and necessary for $a > 0$.

Given that **exactly one** of these seven statements is true for the particular function $f$ in question, which one is it?

$$ \mathbf{A} \quad \text{Statement } (1) $$
$$ \mathbf{B} \quad \text{Statement } (2) $$
$$ \mathbf{C} \quad \text{Statement } (3) $$
$$ \mathbf{D} \quad \text{Statement } (4) $$
$$ \mathbf{E} \quad \text{Statement } (5) $$
$$ \mathbf{F} \quad \text{Statement } (6) $$
$$ \mathbf{G} \quad \text{Statement } (7) $$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
**Remark.** We had to include this classic somewhere for a little more practice, so here it is.

We first reformulate each statement equivalently, placing the condition involving $a$ first.

$\text{Statement } (1): \quad a > 0 \quad \Rightarrow \quad f(a) > 0$.

$\text{Statement } (2): \quad a \le 0 \quad \Rightarrow \quad f(a) \le 0$.

$\text{Statement } (3): \quad a \le 0 \quad \Rightarrow \quad f(a) \le 0$.

$\text{Statement } (4): \quad a > 0 \quad \Rightarrow \quad f(a) > 0$.

$\text{Statement } (5): \quad a \le 0 \quad \Rightarrow \quad f(a) > 0$.

$\text{Statement } (6): \quad a > 0 \quad \Rightarrow \quad f(a) > 0$.

$\text{Statement } (7): \quad a > 0 \quad \Leftrightarrow \quad f(a) \le 0$.

Statements (1), (4) and (6) are equivalent, so none can be the only true statement. Similarly, statements (2) and (3) are equivalent, so neither can be the only true statement.

Also, statement (7) implies statement (5), since $a \le 0$ forces $f(a) > 0$. Therefore statement (7) cannot be the only true statement.

Hence the only possible answer is Statement (5).
