---
database: TMUA
qid: 20132101215114
id: BeyondHorizonSpec-Mock-P1-Q14
paper: TMUA Mock
year:
number: Q14
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Let $f(x) = \sqrt{4-x^2}$, and define the integral
$$I = \int_{-2}^{2} f(x)\,dx.$$
Now define
$$J = \int_{0}^{4} \sqrt{16-x^2}\,dx + \int_{0}^{2} \sqrt{4x-x^2}\,dx.$$
Which of the following is **equal to** $J$?
$$\mathbf{A} \quad 2I$$
$$\mathbf{B} \quad I$$
$$\mathbf{C} \quad \frac{I}{2}$$
$$\mathbf{D} \quad \frac{3I}{2}$$
$$\mathbf{E} \quad 3I$$
$$\mathbf{F} \quad \frac{5I}{2}$$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
Each integral is a piece of a circle, so no antiderivatives are needed. The graph of $y = \sqrt{4-x^2}$ is the upper half of the circle of radius 2 centred at the origin, so $I$ is the area of that semicircle, namely $I = \frac{1}{2}\pi(2)^2 = 2\pi$. The first integral in $J$ is the quarter of the disc of radius 4 lying in the first quadrant, of area $\frac{1}{4}\pi(4)^2 = 4\pi$. For the second, complete the square: $4x - x^2 = 4 - (x-2)^2$, so with $u = x-2$ the integral becomes $\int_{-2}^{0}\sqrt{4-u^2}\,du$, a quarter of the disc of radius 2, of area $\pi$. Hence $J = 4\pi + \pi = 5\pi = \frac{5}{2}I$. The answer is F.
