---
database: TMUA
qid: 20132101203115
id: Yotta-Mock-P1-Q15
paper: TMUA Mock
year:
number: Q15
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The function $f(x)$ has the property that $f(x) = f(6 - x)$ for all real $x$. Given that:
$$ \left(\int_{2}^{3} f(x) \,dx\right)^2 + \left(\int_{4}^{6} f(x) \,dx\right)^2 + \left(\int_{2}^{4} f(x) \,dx\right)\left(\int_{0}^{2} f(x) \,dx\right) - \int_{6}^{3} 3f(x) \,dx = -2 $$
Find the sum of the possible values of $\int_{0}^{3} f(x) \,dx$.

$$
\mathbf{A} \quad -10
$$

$$
\mathbf{B} \quad -5
$$

$$
\mathbf{C} \quad -3
$$

$$
\mathbf{D} \quad 0
$$

$$
\mathbf{E} \quad 3
$$

$$
\mathbf{F} \quad 5
$$

$$
\mathbf{G} \quad 10
$$

$$
\mathbf{H} \quad \frac{27}{2}
$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
The condition $f(x) = f(6-x)$ says the graph is symmetric about $x = 3$. Substituting $x \mapsto 6-x$ therefore gives $\int_{4}^{6} f = \int_{0}^{2} f$ and $\int_{3}^{4} f = \int_{2}^{3} f$.

Write $A = \int_{0}^{2} f$ and $B = \int_{2}^{3} f$. Then

$$ \int_{4}^{6} f = A, \qquad \int_{2}^{4} f = 2B, \qquad \int_{6}^{3} 3f = -3\int_{3}^{6} f = -3\int_{0}^{3} f = -3(A+B) $$

Substituting into the given equation:

$$ B^{2} + A^{2} + (2B)(A) + 3(A+B) = -2 $$

The first three terms are $(A+B)^{2}$, so with $S = \int_{0}^{3} f = A + B$ this is

$$ S^{2} + 3S + 2 = 0 \implies (S+1)(S+2) = 0 $$

The possible values are $S = -1$ and $S = -2$, whose sum is $-3$. The answer is C.
