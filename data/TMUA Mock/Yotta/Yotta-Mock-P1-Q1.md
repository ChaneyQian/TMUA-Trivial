---
database: TMUA
qid: 20132101203101
id: Yotta-Mock-P1-Q1
paper: TMUA Mock
year:
number: Q1
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Find the sum of the $x$-coordinates of the six points of intersection of
$$ y = \pi x (x - 1) (x - 2) (x - 3) (x - 4) (x - 5) $$
and
$$ y = \frac{5}{17}x + \frac{\pi}{3} $$

$$
\mathbf{A} \quad -15
$$

$$
\mathbf{B} \quad -\frac{44\pi}{51} + 1
$$

$$
\mathbf{C} \quad -\frac{7}{15}
$$

$$
\mathbf{D} \quad 0
$$

$$
\mathbf{E} \quad \frac{7}{15}
$$

$$
\mathbf{F} \quad \frac{44\pi}{51} - 1
$$

$$
\mathbf{G} \quad 12
$$

$$
\mathbf{H} \quad 15
$$

## 备注

### 我的备注

### AI备注


## 答案
H

## 解析
The $x$-coordinates of the intersection points are the roots of

$$ \pi x(x-1)(x-2)(x-3)(x-4)(x-5) - \frac{5}{17}x - \frac{\pi}{3} = 0 $$

which is a polynomial equation of degree $6$. Expanding the product, the two highest terms are

$$ \pi x(x-1)(x-2)(x-3)(x-4)(x-5) = \pi\left(x^{6} - 15x^{5} + \cdots\right) $$

because the coefficient of $x^{5}$ collects $-(0+1+2+3+4+5) = -15$. Subtracting $\frac{5}{17}x + \frac{\pi}{3}$ changes only the linear and constant terms, so the $x^{6}$ and $x^{5}$ coefficients are untouched. By Vieta's formulas the sum of the six roots is $-\frac{-15\pi}{\pi} = 15$.

The answer is H. Note that the awkward-looking constants $\pi$, $\frac{5}{17}$ and $\frac{\pi}{3}$ are deliberate distractions: none of them can affect the answer.
