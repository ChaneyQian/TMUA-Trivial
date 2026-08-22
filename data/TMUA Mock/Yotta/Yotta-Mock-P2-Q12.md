---
database: TMUA
qid: 20132101203212
id: Yotta-Mock-P2-Q12
paper: TMUA Mock
year:
number: Q12
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
$f(x) = 5x^2 - x^3 - 7x + 3$, and $0 \leq x \leq 4$. Find the maximum value of $f(x)$ in this range.

$$
\mathbf{A} \quad \frac{32}{27}
$$

$$
\mathbf{B} \quad 3
$$

$$
\mathbf{C} \quad 0
$$

$$
\mathbf{D} \quad 12
$$

$$
\mathbf{E} \quad \frac{46}{27}
$$

$$
\mathbf{F} \quad \frac{46}{3}
$$

$$
\mathbf{G} \quad -4
$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Differentiating,

$$ f'(x) = 10x - 3x^{2} - 7 = -(3x-7)(x-1) $$

so the stationary points are $x = 1$ and $x = \frac{7}{3}$, both inside $[0,4]$. On a closed interval the maximum is attained either at a stationary point or at an endpoint, so evaluate all four:

$$ f(0) = 3, \qquad f(1) = 0, \qquad f\left(\tfrac{7}{3}\right) = \tfrac{32}{27}, \qquad f(4) = -9 $$

The largest is $f(0) = 3$.

The answer is B. Note the trap: $\frac{32}{27}$ is the *local* maximum at $x = \frac73$, but the endpoint $x = 0$ beats it, so checking endpoints is essential.
