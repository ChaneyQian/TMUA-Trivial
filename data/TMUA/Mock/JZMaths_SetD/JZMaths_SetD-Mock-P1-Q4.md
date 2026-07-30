---
database: TMUA
qid: 20132101208104
id: JZMaths_SetD-Mock-P1-Q4
paper: TMUA Mock
year:
number: Q4
section: Multiple Choice
difficulty: 6
topics: []
subtopics: []
tags: [Differentiation]
status: 已入库
---

## 题目
Find the total length of interval(s) on which
$$ f(x) = \frac{2}{5}x^{5/2} - 2x^{3/2} + 4x^{1/2} \quad \quad x > 0 $$
is decreasing.
$$ \mathbf{A} \quad \frac{1}{2} $$
$$ \mathbf{B} \quad 1 $$
$$ \mathbf{C} \quad 2 $$
$$ \mathbf{D} \quad 3 $$
$$ \mathbf{E} \quad 4 $$
$$ \mathbf{F} \quad \frac{5}{2} $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Differentiate:
$$ f'(x) = x^{3/2} - 3x^{1/2} + 2x^{-1/2}. $$

Factorise:
$$ f'(x) = x^{-1/2}(x^2 - 3x + 2) = x^{-1/2}(x - 1)(x - 2). $$

Since $x > 0$, we have $x^{-1/2} > 0$, so the sign of $f'(x)$ is the sign of $(x - 1)(x - 2)$.

The function is decreasing when $f'(x) \le 0$, so
$$ (x - 1)(x - 2) \le 0. $$

Hence $1 \le x \le 2$. Therefore the total length of the interval on which $f$ is decreasing is $2 - 1 = 1$.
