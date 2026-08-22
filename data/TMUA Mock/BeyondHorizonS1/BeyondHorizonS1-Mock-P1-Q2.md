---
database: TMUA
qid: 20132101211102
id: BeyondHorizonS1-Mock-P1-Q2
paper: TMUA Mock
year:
number: Q2
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
For a real number $x$, let $[x]$ denote the largest integer less than or equal to $x$. Find the value of
$$\int_{-100}^{100} [t^3]\, dt$$
$$\mathbf{A} \quad 0$$
$$\mathbf{B} \quad 100$$
$$\mathbf{C} \quad -100^2$$
$$\mathbf{D} \quad -100^3$$
$$\mathbf{E} \quad 100^2$$
$$\mathbf{F} \quad -100$$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
The key identity is that for any real $u$ that is not an integer, $[u] + [-u] = -1$. Splitting the integral at $0$ and substituting $t \mapsto -t$ on the negative half gives
$$\int_{-100}^{100} [t^3]\, dt = \int_0^{100} \left( [t^3] + [-t^3] \right) dt$$
For all but countably many $t$ in $(0,100)$ the number $t^3$ is not an integer, so the bracket equals $-1$ almost everywhere and the finitely many exceptional points contribute nothing. Hence the integral is $\int_0^{100} (-1)\, dt = -100$. The answer is F. Option A is the trap for anyone who assumes the integrand inherits the oddness of $t^3$; the floor function destroys that symmetry, replacing $[t^3] + [-t^3] = 0$ by $-1$.
