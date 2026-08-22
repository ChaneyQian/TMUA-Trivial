---
database: TMUA
qid: 20132101213103
id: BeyondHorizonS3-Mock-P1-Q3
paper: TMUA Mock
year:
number: Q3
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
How many values of $x$ satisfy the equation
$$3\cos^2 x + 4\sin x = 3$$
in the range $0 \leq x < 2\pi$?
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
Replacing $\cos^2 x$ by $1 - \sin^2 x$ converts the equation into a quadratic in $s = \sin x$: $3 - 3s^2 + 4s = 3$, which collapses to $s(4 - 3s) = 0$. So either $\sin x = 0$ or $\sin x = \frac{4}{3}$, and the latter is impossible since $|\sin x| \leq 1$. On $0 \leq x < 2\pi$ the equation $\sin x = 0$ has exactly the two solutions $x = 0$ and $x = \pi$ — note that $x = 2\pi$ is excluded by the strict inequality at the top of the range. The answer is C. Option D is the trap for anyone who counts $2\pi$ as a third solution, and option E for anyone who forgets that $\sin x = \frac{4}{3}$ has no real solutions.
