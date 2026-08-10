---
database: TMUA
qid: 20132101206108
id: JZMaths_SetB-Mock-P1-Q8
paper: TMUA Mock
year:
number: Q8
section: Multiple Choice
difficulty: 6.5
topics: [Calculus, Function]
subtopics: [Integration, Absolute Value Functions]
tags: [Integration]
status: 已入库
---

## 题目
Evaluate the following integral.
$$ \int_{-2}^{2} x^2|1 - x^2| dx $$
$$ \mathbf{A} \quad 6 $$
$$ \mathbf{B} \quad 2 $$
$$ \mathbf{C} \quad 4 $$
$$ \mathbf{D} \quad 8 $$
$$ \mathbf{E} \quad 0 $$
$$ \mathbf{F} \quad \frac{13}{2} $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
The integrand $x^2|1 - x^2|$ is an even function, so $\int_{-2}^{2} x^2|1 - x^2| dx = 2 \int_{0}^{2} x^2|1 - x^2| dx$. Split at $x = 1$, where $1 - x^2$ changes sign.

On $[0, 1]$: $|1 - x^2| = 1 - x^2$, so the integrand is $x^2 - x^4$.
$$ \int_{0}^{1} (x^2 - x^4) dx = \left[ \frac{x^3}{3} - \frac{x^5}{5} \right]_{0}^{1} = \frac{1}{3} - \frac{1}{5} = \frac{2}{15}. $$

On $[1, 2]$: $|1 - x^2| = x^2 - 1$, so the integrand is $x^4 - x^2$.
$$ \int_{1}^{2} (x^4 - x^2) dx = \left[ \frac{x^5}{5} - \frac{x^3}{3} \right]_{1}^{2} = \frac{31}{5} - \frac{7}{3} = \frac{58}{15}. $$

Summing and doubling: $2 \left( \frac{2}{15} + \frac{58}{15} \right) = 2 \cdot 4 = 8$.
