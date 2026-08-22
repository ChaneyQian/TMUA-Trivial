---
database: TMUA
qid: 20132101212112
id: BeyondHorizonS2-Mock-P1-Q12
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
In the range $0 \leq x < 2\pi$, the equation
$$4\sin^2 x + 4\cos x = \frac{9}{2}$$
$$\mathbf{A} \quad \text{has no solutions}$$
$$\mathbf{B} \quad \text{has 1 solution}$$
$$\mathbf{C} \quad \text{has 2 solutions}$$
$$\mathbf{D} \quad \text{has 3 solutions}$$
$$\mathbf{E} \quad \text{has 4 solutions}$$
$$\mathbf{F} \quad \text{has 5 solutions}$$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
Replace $\sin^2 x$ by $1 - \cos^2 x$ and write $c = \cos x$:
$$4(1 - c^2) + 4c = \frac{9}{2} \quad \Longrightarrow \quad 8c^2 - 8c + 1 = 0 \quad \Longrightarrow \quad c = \frac{2 \pm \sqrt{2}}{4}.$$
Numerically the two roots are $c \approx 0.8536$ and $c \approx 0.1464$, and both lie strictly inside $(-1, 1)$. For each such value the equation $\cos x = c$ has exactly two solutions in $[0, 2\pi)$, one acute and its reflection $2\pi - x$. That gives four solutions in all, at approximately $x = 0.548$, $1.424$, $4.859$ and $5.735$. The answer is E. The trap is to discard one root of the quadratic without checking that it lies in $[-1, 1]$, which would give C.
