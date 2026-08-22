---
database: TMUA
qid: 20132101214108
id: BeyondHorizonS4-Mock-P1-Q8
paper: TMUA Mock
year:
number: Q8
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Given that
$$\frac{dy}{dx} = 4x^2 - \frac{3 - 2x}{x^3}, \quad x \neq 0$$
and $y = 6$ when $x = 1$, find $y$ in terms of $x$.
$$\mathbf{A} \quad y = \frac{4}{3}x^3 + \frac{3}{2}x^{-2} - \frac{2}{3}x^{-1} + \frac{31}{6}$$
$$\mathbf{B} \quad y = 2x^3 + x^{-2} - x^{-1} + 5$$
$$\mathbf{C} \quad y = \frac{4}{3}x^3 + \frac{3}{2}x^{-2} - 2x^{-3} + \frac{23}{6}$$
$$\mathbf{D} \quad y = \frac{4}{3}x^3 + \frac{3}{2}x^{-2} - 2x^{-1} + \frac{31}{6}$$
$$\mathbf{E} \quad y = \frac{4}{3}x^3 + \frac{3}{2}x^{-2} - \frac{2}{3}x^{-3} + 4$$
$$\mathbf{F} \quad y = 3x^3 + x^{-2} - x^{-1} + 3$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Split the fraction first: $\frac{3 - 2x}{x^3} = 3x^{-3} - 2x^{-2}$, so the derivative is $4x^2 - 3x^{-3} + 2x^{-2}$. Integrating term by term, $\int 4x^2\,dx = \frac{4}{3}x^3$, $\int -3x^{-3}\,dx = \frac{3}{2}x^{-2}$ and $\int 2x^{-2}\,dx = -2x^{-1}$, so
$$y = \frac{4}{3}x^3 + \frac{3}{2}x^{-2} - 2x^{-1} + C.$$
Imposing $y = 6$ at $x = 1$ gives $\frac{4}{3} + \frac{3}{2} - 2 + C = 6$, i.e. $\frac{5}{6} + C = 6$ and $C = \frac{31}{6}$. The answer is D. Option A carries the same constant but has $-\frac{2}{3}x^{-1}$, the result of mis-integrating $2x^{-2}$ as though the exponent rule gave a factor $\frac{1}{3}$.
