---
database: TMUA
qid: 20132101215103
id: BeyondHorizonSpec-Mock-P1-Q3
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
Consider the closed interval $[1.5, 2]$. Which function is the largest in that domain?
$$\mathbf{A} \quad f(x) = \frac{1}{1-x}$$
$$\mathbf{B} \quad f(x) = \frac{1}{1-x^2}$$
$$\mathbf{C} \quad f(x) = \frac{1}{1-2x}$$
$$\mathbf{D} \quad f(x) = \frac{1}{1-x^3}$$
$$\mathbf{E} \quad f(x) = \frac{1}{2-x^2}$$
$$\mathbf{F} \quad f(x) = \frac{1}{2-x^3}$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
On $[1.5, 2]$ every one of the six denominators is negative, so all six functions are negative there. For a reciprocal $\frac{1}{g}$ with $g < 0$, the value is closest to zero — hence largest — when $|g|$ is largest, so the winner is whichever denominator has the greatest magnitude at every point of the interval. Comparing magnitudes, $|1-x^3| = x^3 - 1$ beats $|2-x^3| = x^3 - 2$ by exactly 1, and it beats $|1-2x| = 2x-1$ because $(x^3-1)-(2x-1) = x(x^2-2) > 0$ once $x > \sqrt{2}$, which holds throughout $[1.5, 2]$. The remaining denominators $1-x$, $1-x^2$ and $2-x^2$ have magnitudes at most $1$, $3$ and $2$ respectively, all smaller than $x^3-1 \geq 2.375$. So $\frac{1}{1-x^3}$ is the largest at every point, rising from about $-0.421$ at $x = 1.5$ to about $-0.143$ at $x = 2$. The answer is D.
