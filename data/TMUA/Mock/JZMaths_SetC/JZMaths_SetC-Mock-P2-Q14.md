---
database: TMUA
qid: 20132101207214
id: JZMaths_SetC-Mock-P2-Q14
paper: TMUA Mock
year:
number: Q14
section: Multiple Choice
difficulty: 7.5
topics: []
subtopics: []
tags: [Logic Deduction, Logic Sufficiency]
status: 已入库
---

## 题目
For which of the following is it a **necessary but not sufficient** condition that

$$ 2x^3 - 3px^2 + p = 0 $$

has exactly one real root?

$$ \mathbf{A} \quad -1 < p < 1 $$
$$ \mathbf{B} \quad -1 \le p \le 1 $$
$$ \mathbf{C} \quad 0 < p < 1 $$
$$ \mathbf{D} \quad p = 0 $$
$$ \mathbf{E} \quad p \le 0 $$
$$ \mathbf{F} \quad p \ge 0 $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Let $f(x) = 2x^3 - 3px^2 + p$, then $f'(x) = 6x^2 - 6px = 6x(x - p)$. So the stationary points are at $x = 0$ and $x = p$.

Their corresponding values are $f(0) = p$ and $f(p) = 2p^3 - 3p^3 + p = p - p^3 = p(1 - p^2)$.

First consider $p \neq 0$. For the cubic to have exactly one real root, the two stationary values must have the same sign. If either stationary value is zero, then the cubic has a repeated root and another real root. So we need

$$ f(0)f(p) = p \cdot p(1 - p^2) > 0. $$

This gives

$$ p^2(1 - p^2) > 0. $$

Since $p^2 > 0$, we need

$$ 1 - p^2 > 0. $$

Hence

$$ -1 < p < 0 \quad \text{or} \quad 0 < p < 1. $$

Now we check $p=0$ separately. In this case, $f(x)=2x^3$, which has exactly one real root, namely $x=0$.

Therefore, the necessary and sufficient condition is $-1<p<1$.

Option A is necessary and sufficient, so it is not the answer. Option B is necessary because $-1<p<1$ implies $-1\leq p\leq 1$, but the converse is not true. Therefore, it is a necessary but not sufficient condition. So option B is the correct answer.

**Remark:** Since we are looking for a necessary but not sufficient condition, and there should be only one correct option, we can immediately rule out A because A implies B. If A were the solution, then B would also be a solution, but there can be only one solution. In the same way, we can immediately rule out C and D. However, these eliminations do not make it any quicker to deduce the correct option for this question.
