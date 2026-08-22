---
database: TMUA
qid: 20132101215113
id: BeyondHorizonSpec-Mock-P1-Q13
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
How many solutions are there to the equation
$$\left(1 + 2\sin\left(\frac{3}{2}\theta - \frac{\pi}{2}\right)\right)^2 = 4$$
in the interval $0^\circ \leq \theta \leq \pi$?
$$\mathbf{A} \quad 0$$
$$\mathbf{B} \quad 1$$
$$\mathbf{C} \quad 2$$
$$\mathbf{D} \quad 3$$
$$\mathbf{E} \quad 4$$
$$\mathbf{F} \quad 5$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Since $\sin\left(u - \frac{\pi}{2}\right) = -\cos u$, the bracket simplifies to $1 - 2\cos\frac{3\theta}{2}$, and taking square roots gives $1 - 2\cos\frac{3\theta}{2} = \pm 2$. The choice $-2$ leads to $\cos\frac{3\theta}{2} = \frac{3}{2}$, which is impossible. The choice $+2$ gives $\cos\frac{3\theta}{2} = -\frac{1}{2}$. As $\theta$ runs over $[0, \pi]$ the argument $\frac{3\theta}{2}$ runs over $\left[0, \frac{3\pi}{2}\right]$, and within that range the cosine equals $-\frac{1}{2}$ at $\frac{2\pi}{3}$ and at $\frac{4\pi}{3}$, giving $\theta = \frac{4\pi}{9}$ and $\theta = \frac{8\pi}{9}$. The next candidate, $\frac{8\pi}{3}$, is already beyond $\frac{3\pi}{2}$. So there are two solutions. The answer is C.
