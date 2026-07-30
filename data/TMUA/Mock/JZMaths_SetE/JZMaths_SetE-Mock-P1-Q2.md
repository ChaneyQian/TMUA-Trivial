---
database: TMUA
qid: 20132101209102
id: JZMaths_SetE-Mock-P1-Q2
paper: TMUA Mock
year:
number: Q2
section: Multiple Choice
difficulty: 6
topics: []
subtopics: []
tags: [Integration, Differentiation]
status: 已入库
---

## 题目
For $0 < a < 2$, let $f(x) = |x - a|$. The trapezium rule with two equal strips is used to estimate
$$ \int_0^2 f(x) \, dx. $$
Find the product of all values of $a$ for which the trapezium estimate exceed the exact integral by $\frac{1}{4}$.
$$ \mathbf{A} \quad \frac{4}{3} $$
$$ \mathbf{B} \quad \frac{3}{4} $$
$$ \mathbf{C} \quad 2 $$
$$ \mathbf{D} \quad 1 $$
$$ \mathbf{E} \quad \frac{3}{2} $$
$$ \mathbf{F} \quad \frac{2}{3} $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
The two strips have width 1, so the trapezium estimate is
$$ T = \frac{1}{2}\left( f(0) + 2f(1) + f(2) \right). $$
Since $0 < a < 2$, we have $f(0) = a$, $f(1) = |1 - a|$ and $f(2) = 2 - a$. Hence $T = 1 + |1 - a|$.
The exact integral is the sum of the areas of two right-angled triangles:
$$ \int_0^2 |x - a| \, dx = \frac{a^2}{2} + \frac{(2-a)^2}{2} = 1 + (a-1)^2. $$
Therefore the amount by which the trapezium estimate exceeds the exact integral is $|1-a| - (a-1)^2$.
Let $t = |1-a|$. Since $(a-1)^2 = t^2$, we require
$$ t - t^2 = \frac{1}{4}, $$
so $(t-\frac{1}{2})^2 = 0$. Thus $|1-a| = \frac{1}{2}$, giving $a = \frac{1}{2}$ or $a = \frac{3}{2}$.
Their product is $\frac{1}{2} \times \frac{3}{2} = \frac{3}{4}$.
Remark: Alternatively, after $T = 1 + |1-a|$, split into the cases $a < 1$ and $a \ge 1$ to remove the modulus.
