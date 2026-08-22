---
database: TMUA
qid: 20132101212107
id: BeyondHorizonS2-Mock-P1-Q7
paper: TMUA Mock
year:
number: Q7
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
For any real number $x$, let $\lfloor x \rfloor$ denote the greatest integer $m$ such that $m \leq x$. Evaluate the following integral
$$\int_{-2}^{2} \left\lfloor x^2 - 1 \right\rfloor \, dx$$
$$\mathbf{A} \quad 2\left(3 - \sqrt{3} - \sqrt{2}\right)$$
$$\mathbf{B} \quad 2\left(5 - \sqrt{3} - \sqrt{2}\right)$$
$$\mathbf{C} \quad 2\left(1 - \sqrt{3} - \sqrt{2}\right)$$
$$\mathbf{D} \quad 3\left(5 - \sqrt{3} - \sqrt{2}\right)$$
$$\mathbf{E} \quad 3\left(1 - \sqrt{5} - \sqrt{3}\right)$$
$$\mathbf{F} \quad \text{None of the above}$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
The integrand depends on $x$ only through $x^2$, so it is even and the integral equals $2\int_{0}^{2}\lfloor x^2 - 1\rfloor\,dx$. On $[0, 2]$ the quantity $x^2 - 1$ increases from $-1$ to $3$, and $\lfloor x^2 - 1\rfloor = n$ precisely when $n + 1 \leq x^2 < n + 2$, i.e. when $\sqrt{n + 1} \leq x < \sqrt{n + 2}$. This gives the value $-1$ on $[0, 1)$, the value $0$ on $[1, \sqrt{2})$, the value $1$ on $[\sqrt{2}, \sqrt{3})$ and the value $2$ on $[\sqrt{3}, 2)$, with the single point $x = 2$ contributing nothing. Adding the four pieces,
$$\int_{0}^{2}\lfloor x^2 - 1\rfloor\,dx = -1 + 0 + \left(\sqrt{3} - \sqrt{2}\right) + 2\left(2 - \sqrt{3}\right) = 3 - \sqrt{3} - \sqrt{2},$$
so the whole integral is $2\left(3 - \sqrt{3} - \sqrt{2}\right) \approx -0.2925$. The answer is A. The trap is to read the integrand as $\lfloor x \rfloor^2 - 1$, or to forget that the floor rounds downwards on $[0, 1)$ where $x^2 - 1$ is negative.
