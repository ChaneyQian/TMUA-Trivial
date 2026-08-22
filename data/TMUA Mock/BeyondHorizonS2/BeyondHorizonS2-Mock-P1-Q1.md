---
database: TMUA
qid: 20132101212101
id: BeyondHorizonS2-Mock-P1-Q1
paper: TMUA Mock
year:
number: Q1
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
How many solutions does the equation $x \tan x = 2$ have in the interval $-3\pi \leq x \leq 3\pi$?
$$\mathbf{A} \quad 1$$
$$\mathbf{B} \quad 2$$
$$\mathbf{C} \quad 3$$
$$\mathbf{D} \quad 4$$
$$\mathbf{E} \quad 5$$
$$\mathbf{F} \quad 6$$
$$\mathbf{G} \quad 7$$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
The function $x \tan x$ is even, so its solution set is symmetric about the origin and it is enough to count roots on $(0, 3\pi]$ and then double. On that range $\tan x$ is positive exactly on $\left(0, \frac{\pi}{2}\right)$, $\left(\pi, \frac{3\pi}{2}\right)$ and $\left(2\pi, \frac{5\pi}{2}\right)$; on each of these three intervals both $x$ and $\tan x$ are positive and increasing, so $x \tan x$ increases continuously from $0$ to $+\infty$ and hits the value $2$ exactly once. On the complementary intervals $\left(\frac{\pi}{2}, \pi\right]$, $\left(\frac{3\pi}{2}, 2\pi\right]$ and $\left(\frac{5\pi}{2}, 3\pi\right]$ we have $\tan x \leq 0$, so $x \tan x \leq 0$ and the value $2$ is never attained. That gives three positive roots, at approximately $x = 1.077$, $3.644$ and $6.578$, and by symmetry three negative ones; $x = 0$ is not a root since $0 \neq 2$. The total is $6$. The answer is F. The trap is to count only the positive half of the interval and stop at C.
