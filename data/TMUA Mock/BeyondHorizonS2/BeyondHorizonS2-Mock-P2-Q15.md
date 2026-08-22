---
database: TMUA
qid: 20132101212215
id: BeyondHorizonS2-Mock-P2-Q15
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
If $l^2 + m^2 + n^2 = 1$ and $p^2 + q^2 + r^2 = 1$, then the range of values $lp + mq + nr$ can take is
$$\mathbf{A} \quad [2, \infty)$$
$$\mathbf{B} \quad [2, 1]$$
$$\mathbf{C} \quad (\infty, 1]$$
$$\mathbf{D} \quad [-1, 1]$$
$$\mathbf{E} \quad [1, \infty)$$
$$\mathbf{F} \quad \text{does not satisfy any of the above conditions}$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
The two conditions say that $u = (l, m, n)$ and $v = (p, q, r)$ are unit vectors in three dimensions, and $lp + mq + nr$ is their dot product. By the Cauchy-Schwarz inequality,
$$|lp + mq + nr| \leq \sqrt{l^2 + m^2 + n^2}\,\sqrt{p^2 + q^2 + r^2} = 1,$$
so the expression always lies in $[-1, 1]$. Both endpoints are achieved, at $u = v$ and at $u = -v$, and every intermediate value is achieved by rotating $v$ continuously, so the range is exactly $[-1, 1]$. The answer is D.
