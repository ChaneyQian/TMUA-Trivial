---
database: TMUA
qid: 20132101214116
id: BeyondHorizonS4-Mock-P1-Q16
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
In the interval $0 \leq x \leq 2\pi$, the equation
$$\sin(3\cos(3x) + 1) = 0$$
has exactly
$$\mathbf{A} \quad 2 \text{ solutions}$$
$$\mathbf{B} \quad 4 \text{ solutions}$$
$$\mathbf{C} \quad 6 \text{ solutions}$$
$$\mathbf{D} \quad 8 \text{ solutions}$$
$$\mathbf{E} \quad 10 \text{ solutions}$$
$$\mathbf{F} \quad 12 \text{ solutions}$$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
The outer sine vanishes only when its argument is an integer multiple of $\pi$. Here the argument $3\cos(3x) + 1$ ranges over $[-2, 4]$, and the only multiples of $\pi$ in that range are $0$ and $\pi$, since $-\pi < -2$ and $2\pi > 4$. So we need $\cos 3x = -\frac{1}{3}$ or $\cos 3x = \frac{\pi - 1}{3} \approx 0.714$, and both of these lie strictly between $-1$ and $1$. Substituting $u = 3x$, as $x$ runs over $[0, 2\pi]$ the variable $u$ runs over $[0, 6\pi]$, which is exactly three full periods of the cosine, so each equation $\cos u = c$ with $|c| < 1$ has $2 \times 3 = 6$ solutions there. The total is
$$6 + 6 = 12.$$
The answer is F. Option C, $6$, is the trap for spotting only one of the two admissible values of $\cos 3x$ — most people find $\cos 3x = -\frac{1}{3}$ and stop, forgetting that $\pi$ itself is also inside the range of the argument.
