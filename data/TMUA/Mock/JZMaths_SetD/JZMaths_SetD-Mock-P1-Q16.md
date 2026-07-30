---
database: TMUA
qid: 20132101208116
id: JZMaths_SetD-Mock-P1-Q16
paper: TMUA Mock
year:
number: Q16
section: Multiple Choice
difficulty: 7.5
topics: []
subtopics: []
tags: [Integration, Sequences and Series]
status: 已入库
---

## 题目
Let $f$ be a real-valued function such that
$$\int_0^1 f(x) \, dx = 1$$
and $f(x) = f(x + 1)$ for all real $x$.
Find
$$\sum_{r=1}^{100} \int_0^r f(r^r x) \, dx.$$
$$ \mathbf{A} \quad 50 $$
$$ \mathbf{B} \quad 100 $$
$$ \mathbf{C} \quad 101 $$
$$ \mathbf{D} \quad 5050 $$
$$ \mathbf{E} \quad 2050 $$
$$ \mathbf{F} \quad 4950 $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
**Remark:** The functions $f(x), f(4x), f(27x), f(256x), \dots$ do not look especially friendly. You may wonder how much the coefficients of $x$ inside $f$ matter. It turns out that they do not matter at all!

For any positive integer $k$, the graph of $y = f(kx)$ is obtained from the graph of $y = f(x)$ by a horizontal stretch with scale factor $\frac{1}{k}$.

Since $f$ has period $1$, the function $f(kx)$ completes $k$ periods on the interval $[0, 1]$. Each compressed period has integral
$$\frac{1}{k} \int_0^1 f(x) \, dx = \frac{1}{k}.$$
Therefore,
$$\int_0^1 f(kx) \, dx = k \cdot \frac{1}{k} = 1.$$
For each $r$, the number $r^r$ is a positive integer, so
$$\int_0^1 f(r^r x) \, dx = 1.$$
Also, since $r^r$ is an integer,
$$f(r^r(x + 1)) = f(r^rx + r^r) = f(r^rx),$$
so $f(r^r x)$ has period $1$.

Hence the interval $[0, r]$ consists of $r$ intervals of length $1$, each contributing an integral of $1$. Therefore,
$$\int_0^r f(r^r x) \, dx = r.$$
Thus the required sum is
$$\sum_{r=1}^{100} r = 1 + 2 + 3 + \dots + 100 = \frac{100 \cdot 101}{2} = 5050.$$
