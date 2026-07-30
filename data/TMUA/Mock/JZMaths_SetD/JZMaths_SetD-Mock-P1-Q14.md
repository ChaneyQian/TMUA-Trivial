---
database: TMUA
qid: 20132101208114
id: JZMaths_SetD-Mock-P1-Q14
paper: TMUA Mock
year:
number: Q14
section: Multiple Choice
difficulty: 7
topics: []
subtopics: []
tags: [Sequences and Series, Trig Equation Number of Solutions]
status: 已入库
---

## 题目
The equation
$$ \cos x + \cos^3 x + \cos^5 x + \cos^7 x + \ldots = \tan x $$
has how many solutions for $0 \le x < 2\pi$?

$$ \mathbf{A} \quad 0 $$
$$ \mathbf{B} \quad 1 $$
$$ \mathbf{C} \quad 2 $$
$$ \mathbf{D} \quad 3 $$
$$ \mathbf{E} \quad 4 $$
$$ \mathbf{F} \quad \text{infinitely many} $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
The left-hand side is a geometric series with first term $\cos x$ and common ratio $\cos^2 x$. It converges for $\cos^2 x < 1$, so we must exclude $x = 0$ and $x = \pi$, where $\cos^2 x = 1$. The right-hand side $\tan x$ is not defined for $x = \frac{\pi}{2}$ and $x = \frac{3\pi}{2}$, so we also exclude these $x$.

When the series converges, its sum to infinity is
$$ \frac{\cos x}{1 - \cos^2 x} = \frac{\cos x}{\sin^2 x}. $$

Substituting into the equation, we get
$$ \frac{\cos x}{\sin^2 x} = \tan x \quad \Longleftrightarrow \quad \frac{\cos x}{\sin^2 x} = \frac{\sin x}{\cos x}. $$

Multiplying both sides by $\sin^2 x \cdot \cos x$, which is nonzero as we precisely excluded the values of $x$ for which they are zero, simplify, eventually gives
$$ \sin^3 x + \sin^2 x - 1 = 0 $$

Let $u = \sin x$. Since $-1 \le u \le 1$, we need to count the solutions of $u^3 = 1 - u^2$ in this interval. For $-1 \le u \le 0$, we have $u^3 \le 0$ and $1 - u^2 \ge 0$, so there are no solutions. For $0 \le u \le 1$, the function $u^3$ is strictly increasing from $0$ to $1$, while $1 - u^2$ is strictly decreasing from $1$ to $0$. Hence they intersect exactly once, at some $u = k$ with $0 < k < 1$. The equation $\sin x = k$ has exactly two solutions for $0 \le x < 2\pi$, so the original equation has 2 solutions.
