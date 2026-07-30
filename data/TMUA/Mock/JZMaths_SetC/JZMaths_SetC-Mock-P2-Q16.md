---
database: TMUA
qid: 20132101207216
id: JZMaths_SetC-Mock-P2-Q16
paper: TMUA Mock
year:
number: Q16
section: Multiple Choice
difficulty: 7.5
topics: []
subtopics: []
tags: [Logic Equivalence, Transformation of Graphs]
status: 已入库
---

## 题目
Three transformations of the plane are defined as follows. $R$ is the reflection in the $y$-axis. $T$ is the translation by $4$ units in the positive $x$-direction. $S$ is the horizontal stretch with scale factor $2$ parallel to the $x$-axis, fixing the $y$-axis.

Let $y = f(x)$ be a function defined on the real numbers.

When the graph of $y = f(x)$ is transformed by applying $R$, then $T$, then $S$ in that order, the result is the graph of $y = g(x)$.

When the graph of the same function $y = f(x)$ is transformed by applying $S$, then $T$, then $R$ in that order, the result is the graph of $y = h(x)$.

Which one of the following conditions on $y = f(x)$ is **necessary and sufficient** for the functions $g(x)$ and $h(x)$ to be identical?

$$ \mathbf{A} \quad f(x) = f(x + 3) \text{ for all } x $$
$$ \mathbf{B} \quad f(x) = f(x + 4) \text{ for all } x $$
$$ \mathbf{C} \quad f(x) = f(x + 6) \text{ for all } x $$
$$ \mathbf{D} \quad f(x) = f(x + 12) \text{ for all } x $$
$$ \mathbf{E} \quad f(x) = f(-x) \text{ for all } x $$
$$ \mathbf{F} \quad f(x) = f(6 - x) \text{ for all } x $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Compute $g(x)$ by applying $R$, $T$, and $S$ in turn to $y = f(x)$.

Apply $R$ by replacing $x$ with $-x$: $y = f(-x)$.

Apply $T$ by replacing $x$ with $x - 4$: $y = f(-(x - 4)) = f(4 - x)$.

Apply $S$ by replacing $x$ with $\frac{x}{2}$: $y = f\left(4 - \frac{x}{2}\right)$.

Therefore, $g(x) = f\left(4 - \frac{x}{2}\right)$.

Now compute $h(x)$ by applying $S$, $T$, and $R$ in turn to $y = f(x)$.

Apply $S$: $y = f\left(\frac{x}{2}\right)$.

Apply $T$: $y = f\left(\frac{x-4}{2}\right) = f\left(\frac{x}{2} - 2\right)$.

Apply $R$: $y = f\left(-\frac{x}{2} - 2\right)$.

Therefore, $h(x) = f\left(-\frac{x}{2} - 2\right)$.

For $g(x) = h(x)$ for all $x$, we need

$$ f\left(4 - \frac{x}{2}\right) = f\left(-\frac{x}{2} - 2\right) $$

for all $x$.

Let $u = -\frac{x}{2} - 2$. As $x$ ranges over $\mathbb{R}$, so does $u$, and $4 - \frac{x}{2} = u + 6$. Hence the condition is

$$ f(u + 6) = f(u) \text{ or } f(x) = f(x + 6). $$

**Remark:** This question is inspired by a similar exam question, but is a more difficult version. It tests students' understanding of the order and application of horizontal transformations, which is often subtly misunderstood.
