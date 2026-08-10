---
database: TMUA
qid: 20132101208217
id: JZMaths_SetD-Mock-P2-Q17
paper: TMUA Mock
year:
number: Q17
section: Multiple Choice
difficulty: 8
topics: [Logic and Proof, Function, Trigonometry]
subtopics: [Logic, Functions, Trigonometry]
tags: [Logic Equivalence, Logic Deduction]
status: 已入库
---

## 题目
Let $f$ be a function defined on the real numbers.

When the graph of $y = f(x)$ is reflected in the $y$-axis and then stretched in the $x$-direction by a factor of $\frac{1}{2}$, the result is the graph of $y = g(x)$.

When the graph of $y = f(x)$ is stretched in the $x$-direction by a factor of $\frac{1}{2}$ and then translated by $1$ unit in the negative $x$-direction, the result is the graph of $y = h(x)$.

Which of the following is a **sufficient but not necessary condition** for $g(x)$ and $h(x)$ to be identical, that is $g(x) = h(x)$ for all real values of $x$?

$$ \mathbf{A} \quad f(0) = f(2) $$
$$ \mathbf{B} \quad f(x) = f(2 - x) \text{ for all } x $$
$$ \mathbf{C} \quad f(x + 1) = f(1 - x) \text{ for all } x $$
$$ \mathbf{D} \quad f(x) = \sum_{k=1}^{10} \cos(\pi kx) $$
$$ \mathbf{E} \quad f(x) = f(1 - x) \text{ for all } x $$
$$ \mathbf{F} \quad f(x) = \cos(\pi x) + \sin(\pi x) $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
**Remark:** This is really a question about vertical line of symmetry.

Reflecting $y = f(x)$ in the $y$-axis gives $y = f(-x)$, and then stretching in the $x$-direction by a factor of $\frac{1}{2}$ gives $g(x) = f(-2x)$.

Stretching $y = f(x)$ in the $x$-direction by a factor of $\frac{1}{2}$ first gives $y = f(2x)$. Translating this graph by $1$ unit in the negative $x$-direction means replacing $x$ by $x + 1$, so

$$ h(x) = f(2(x + 1)) = f(2x + 2). $$

Hence $g(x) = h(x)$ for all $x$ if and only if $f(-2x) = f(2x + 2)$ for all $x$. Writing $u = -2x$, this is equivalent to

$$ f(u) = f(2 - u) \text{ for all } u. $$

Thus the required condition is that the graph of $f$ has **symmetry** about the line $x = 1$.

Option (B) is exactly this condition, so it is necessary and sufficient. Option (C) is equivalent to it: setting $u = x + 1$ gives $1 - x = 2 - u$. Hence neither is sufficient but not necessary.

Option (A) checks only one pair of points, so it is not sufficient. Option (E) gives symmetry about $x = \frac{1}{2}$, not about $x = 1$. This leaves options (D) and (F).

The graph of $y = \cos x$ has lines of symmetry at $x = n\pi$ for every integer $n$. Therefore $y = \cos(\pi kx)$ has lines of symmetry at $x = \frac{n}{k}$. In particular, taking $n = k$ shows that every term $\cos(\pi kx)$ has symmetry about $x = 1$. Their sum therefore also has symmetry about $x = 1$, so option (D) is sufficient.

However, $y = \sin(\pi x)$ does not have symmetry about $x = 1$. Indeed, $\sin(\pi(2 - x)) = -\sin(\pi x)$, so option (F) is not sufficient.

Option (D) gives one specific function satisfying the general condition $f(x) = f(2 - x)$. It is therefore sufficient, but it is not necessary, since many other functions also satisfy this symmetry condition.

Therefore the answer is option (D).
