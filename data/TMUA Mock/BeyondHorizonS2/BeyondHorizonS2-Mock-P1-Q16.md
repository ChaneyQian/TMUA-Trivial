---
database: TMUA
qid: 20132101212116
id: BeyondHorizonS2-Mock-P1-Q16
paper: TMUA Mock
year:
number: Q16
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Evaluate the following integral
$$\int_{0}^{100} e^{\,x - \lfloor x \rfloor}\,dx$$
$$\mathbf{A} \quad \frac{e^{100} - 1}{100}$$
$$\mathbf{B} \quad \frac{e^{100} - 1}{e - 1}$$
$$\mathbf{C} \quad 100(e - 1)$$
$$\mathbf{D} \quad \frac{e - 1}{100}$$
$$\mathbf{E} \quad \frac{1 - e}{100}$$
$$\mathbf{F} \quad \frac{e^{100}}{100}$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
The exponent $x - \lfloor x \rfloor$ is the fractional part of $x$, which is periodic with period $1$: on each interval $[n, n + 1)$ it equals $x - n$ and runs from $0$ up to $1$. The integrand therefore repeats identically on every unit interval, and
$$\int_{n}^{n+1} e^{\,x - \lfloor x \rfloor}\,dx = \int_{0}^{1} e^{t}\,dt = e - 1.$$
The range $[0, 100]$ consists of exactly $100$ such unit intervals, so the integral equals $100(e - 1) \approx 171.83$. The answer is C. Option A is the trap of ignoring the floor and integrating $e^{x}$ straight through.
