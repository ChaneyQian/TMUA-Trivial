---
database: TMUA
qid: 20132101211112
id: BeyondHorizonS1-Mock-P1-Q12
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
Suppose $a < b$. The maximum value of the integral
$$\int_a^b \left( \frac{3}{4} - x - x^2 \right) dx$$
over all possible values of $a$ and $b$ is
$$\mathbf{A} \quad \frac{3}{4}$$
$$\mathbf{B} \quad \frac{4}{3}$$
$$\mathbf{C} \quad \frac{3}{2}$$
$$\mathbf{D} \quad \frac{2}{3}$$
$$\mathbf{E} \quad \frac{4}{5}$$
$$\mathbf{F} \quad \frac{5}{4}$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
The integral is largest exactly when the interval $[a,b]$ collects all of the region where the integrand is positive and none of the region where it is negative, so $a$ and $b$ must be the roots of $\frac34 - x - x^2 = 0$. Multiplying by $-1$ gives $x^2 + x - \frac34 = 0$, whose roots are
$$x = \frac{-1 \pm \sqrt{1+3}}{2} = \frac{1}{2} \text{ or } -\frac{3}{2}$$
Taking $a = -\tfrac32$ and $b = \tfrac12$ and using the antiderivative $\frac{3x}{4} - \frac{x^2}{2} - \frac{x^3}{3}$ gives
$$\left( \frac{3}{8} - \frac{1}{8} - \frac{1}{24} \right) - \left( -\frac{9}{8} - \frac{9}{8} + \frac{9}{8} \right) = \frac{5}{24} + \frac{9}{8} = \frac{4}{3}$$
The answer is B. Option A is the trap for anyone who reads off the maximum of the integrand rather than of the integral.
