---
database: TMUA
qid: 20132101214101
id: BeyondHorizonS4-Mock-P1-Q1
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
Find the area bounded by the straight lines $x = -1$ and $x = 1$ and the graphs of $f(x)$ and $g(x)$, where $f(x) = x^3$ and
$$g(x) = \begin{cases} x^5 & \text{if } -1 \leq x \leq 0, \\ x & \text{if } 0 \leq x \leq 1, \end{cases}$$
$$\mathbf{A} \quad \frac{1}{3}$$
$$\mathbf{B} \quad \frac{1}{8}$$
$$\mathbf{C} \quad \frac{1}{2}$$
$$\mathbf{D} \quad \frac{1}{4}$$
$$\mathbf{E} \quad \frac{1}{5}$$
$$\mathbf{F} \quad \frac{1}{6}$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
On $[-1, 0]$ the two graphs are $x^3$ and $x^5$. Writing $x = -t$ with $t \in [0, 1]$ turns the gap into $|x^3 - x^5| = t^3 - t^5$, so that piece of the region has area $\int_0^1 (t^3 - t^5)\,dt = \frac{1}{4} - \frac{1}{6} = \frac{1}{12}$. On $[0, 1]$ the graphs are $x^3$ and $x$, and there $x \geq x^3$, so that piece contributes $\int_0^1 (x - x^3)\,dx = \frac{1}{2} - \frac{1}{4} = \frac{1}{4}$. Adding the two pieces,
$$\frac{1}{12} + \frac{1}{4} = \frac{1}{3}.$$
The answer is A. Option D, $\frac{1}{4}$, is the right-hand piece on its own, which is what you get if you forget that $g$ changes formula at $x = 0$.
