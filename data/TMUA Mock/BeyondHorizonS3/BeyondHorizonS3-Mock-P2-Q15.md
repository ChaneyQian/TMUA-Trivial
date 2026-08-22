---
database: TMUA
qid: 20132101213215
id: BeyondHorizonS3-Mock-P2-Q15
paper: TMUA Mock
year:
number: Q15
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Find an expression for $\int_1^n (-1)^{\lfloor x \rfloor} \lfloor x \rfloor^{-1} \, dx$ where $n \in N$.
$$\mathbf{A} \quad \sum_{k=1}^{n} (-1)^k \frac{1}{k}$$
$$\mathbf{B} \quad \sum_{k=1}^{n-1} (-1)^k \frac{1}{k}$$
$$\mathbf{C} \quad \sum_{k=1}^{n-1} (-1)^k \frac{1}{k^2}$$
$$\mathbf{D} \quad \sum_{k=1}^{n} (-1)^k \frac{1}{k^2}$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
The integrand is a step function. On the interval $[k, k+1)$ we have $\lfloor x \rfloor = k$, so the integrand takes the constant value $(-1)^k \cdot \tfrac{1}{k}$ there.

Split the range of integration into unit intervals:
$$\int_1^n (-1)^{\lfloor x \rfloor} \lfloor x \rfloor^{-1} \, dx = \sum_{k=1}^{n-1} \int_k^{k+1} (-1)^k \frac{1}{k} \, dx.$$
Each of these pieces is a constant times an interval of length $1$, so it contributes exactly $(-1)^k \tfrac{1}{k}$.

The upper limit is $n$, so the last full interval is $[n-1, n)$ and the top index of the sum is $k = n-1$, not $k = n$; the single point $x = n$ contributes nothing to the integral. That rules out A and D. The powers are first powers of $k$ in the denominator, not squares, which rules out C and D. The answer is B.
