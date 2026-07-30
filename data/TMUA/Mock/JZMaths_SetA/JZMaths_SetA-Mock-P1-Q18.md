---
database: TMUA
qid: 20132101205118
id: JZMaths_SetA-Mock-P1-Q18
paper: TMUA Mock
year:
number: Q18
section: Multiple Choice
difficulty: 8
topics: []
subtopics: []
tags: [Integration]
status: 已入库
---

## 题目
A function $f$ satisfies

$$ \int_0^2 f(x + 1) \, dx = 1, \qquad \int_0^2 f(2 - x) \, dx = 2, \qquad \int_0^{3/2} f(2x) \, dx = 3. $$

Find the value of $\int_1^2 f(x) \, dx$.

$$ \mathbf{A} \quad -6 $$
$$ \mathbf{B} \quad -3 $$
$$ \mathbf{C} \quad 0 $$
$$ \mathbf{D} \quad 1 $$
$$ \mathbf{E} \quad 3 $$
$$ \mathbf{F} \quad 4 $$
$$ \mathbf{G} \quad 5 $$
$$ \mathbf{H} \quad 6 $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Our strategy here is to express each of the 3 integrals as integrals of $f(x)$ over some limits, then deduce its integral between 1 to 2.

For the **first integral**, $f(x + 1)$ is a horizontal transformation of $f(x)$. A sneakily quick way to find the corresponding limits is: for $f(x + 1)$, when $x = 0$, it is $f(1)$, so the integral should start from $f(1)$, and so therefore the equivalent integral of $f(x)$ should start at $x = 1$, over same inteval of 2, so end at $x = 3$, thus we estabish:

$$ \int_0^2 f(x + 1) \, dx = \int_1^3 f(x) \, dx = 1. $$

For the second integral, reflection and translation give

$$ \int_0^2 f(2-x)\,dx=\int_0^2 f(x)\,dx=2. $$

For the third integral, horizontal compression gives

$$ \int_0^{3/2}f(2x)\,dx=\frac12\int_0^3f(x)\,dx=3, $$

so

$$ \int_0^3f(x)\,dx=6. $$

Let

$$ A=\int_0^1f(x)\,dx,\qquad B=\int_1^2f(x)\,dx,\qquad C=\int_2^3f(x)\,dx. $$

The three given equations become

$$ B+C=1,\qquad A+B=2,\qquad A+B+C=6. $$

Adding the first two and subtracting the third gives

$$ B=1+2-6=-3. $$
