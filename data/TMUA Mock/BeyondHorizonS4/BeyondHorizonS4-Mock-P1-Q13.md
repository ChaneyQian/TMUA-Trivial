---
database: TMUA
qid: 20132101214113
id: BeyondHorizonS4-Mock-P1-Q13
paper: TMUA Mock
year:
number: Q13
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Find the number of solutions of the equation
$$x \sin 3x = \cos x$$
in the interval $0 \leq x \leq 3\pi$.
$$\mathbf{A} \quad 1$$
$$\mathbf{B} \quad 3$$
$$\mathbf{C} \quad 5$$
$$\mathbf{D} \quad 7$$
$$\mathbf{E} \quad 9$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Think of the left side as a sine wave whose amplitude grows linearly, and the right side as a bounded wave confined to $[-1, 1]$. Set $h(x) = x\sin 3x - \cos x$. On $[0, 3\pi]$ the factor $\sin 3x$ completes nine half-arches, and on every half-arch far enough from the origin the amplitude $x$ exceeds $1$, so $h$ changes sign there and contributes a root. The exception is the very first half-arch: for small $x$ the product $x\sin 3x$ is too small to reach $\cos x \approx 1$, so no crossing occurs before $x$ has grown past about $2$. Tracking the sign changes of $h$ gives roots near
$$x \approx 2.02,\; 3.25,\; 4.15,\; 5.21,\; 6.34,\; 7.31,\; 8.36,$$
which is seven of them. The answer is D. Option E, $9$, is exactly the trap: it is the count you get by assuming every one of the nine half-arches of $\sin 3x$ delivers a crossing.
