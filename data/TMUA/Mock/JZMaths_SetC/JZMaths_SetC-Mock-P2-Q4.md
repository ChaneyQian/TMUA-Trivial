---
database: TMUA
qid: 20132101207204
id: JZMaths_SetC-Mock-P2-Q4
paper: TMUA Mock
year:
number: Q4
section: Multiple Choice
difficulty: 6
topics: []
subtopics: []
tags: [Logic Deduction, Differentiation]
status: 已入库
---

## 题目
Consider the following statements about the polynomial $f(x)$, where $a < b$:

(1) $f(a) > f(b)$;

(2) $f'(x) \leq 0$ for all $x \in [a, b]$;

(3) $\int_a^b f(x) \, dx \leq 0$;

(4) $f(a) + f(b) \leq 2f\left(\frac{a+b}{2}\right)$.

Which of these statements is a **necessary** condition for $f(x)$ to be decreasing for $a \leq x \leq b$? Here, decreasing means that $x_1 \leq x_2$ implies $f(x_1) \geq f(x_2)$.
$$ \mathbf{A} \quad \text{none of them} $$
$$ \mathbf{B} \quad \text{Only 1.} $$
$$ \mathbf{C} \quad \text{Only 2.} $$
$$ \mathbf{D} \quad \text{Only 3.} $$
$$ \mathbf{E} \quad \text{Only 4.} $$
$$ \mathbf{F} \quad \text{Only 1 and 2.} $$
$$ \mathbf{G} \quad \text{Only 1 and 3.} $$
$$ \mathbf{H} \quad \text{Only 1 and 4.} $$
$$ \mathbf{I} \quad \text{Only 2 and 3.} $$
$$ \mathbf{J} \quad \text{Only 2 and 4.} $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
**Statement 1** is not necessary. For example, if $f(x) = 1$, then $f(x)$ is decreasing according to the definition given, but $f(a) = f(b)$.

**Statement 2** is necessary, because you may remember from A-level Mathematics that the definition of $f(x)$ being decreasing is that $f'(x) \leq 0$ throughout the interval.

This is equivalent to saying that $x_1 \leq x_2$ implies $f(x_1) \geq f(x_2)$, because $f'(x) \leq 0$ means that the graph never rises as $x$ increases. Therefore, a point further to the right cannot have a greater function value.

**Statement 3** is not necessary. For example, let $f(x) = 1 - x$ on $[0,1]$. This function is decreasing, but

$$ \int_0^1 (1-x)\,dx = \frac{1}{2} > 0. $$

**Statement 4** is not necessary. For example, let $f(x) = x^2$ on $[-1,0]$. This function is decreasing, but

$$ f(-1) + f(0) = 1 > 2f\left(-\frac{1}{2}\right) = \frac{1}{2}. $$

Therefore, only **statement 2** is necessary.
