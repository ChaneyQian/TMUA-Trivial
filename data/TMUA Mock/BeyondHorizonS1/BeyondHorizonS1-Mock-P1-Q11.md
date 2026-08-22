---
database: TMUA
qid: 20132101211111
id: BeyondHorizonS1-Mock-P1-Q11
paper: TMUA Mock
year:
number: Q11
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
How many real solutions does the equation $2\sin^3(x) - 6\sin(x)\cos^2(x) + \sin(x) = 0$ have in the interval $0 < x < 2\pi$?
$$\mathbf{A} \quad 1$$
$$\mathbf{B} \quad 2$$
$$\mathbf{C} \quad 3$$
$$\mathbf{D} \quad 4$$
$$\mathbf{E} \quad 5$$
$$\mathbf{F} \quad 6$$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
Factor out $\sin x$:
$$\sin(x)\left( 2\sin^2(x) - 6\cos^2(x) + 1 \right) = 0$$
The first factor vanishes when $\sin x = 0$, which inside the open interval $0 < x < 2\pi$ happens only at $x = \pi$, giving one solution. For the bracket, replace $\sin^2 x$ by $1 - \cos^2 x$:
$$2 - 2\cos^2(x) - 6\cos^2(x) + 1 = 3 - 8\cos^2(x) = 0$$
so $\cos^2 x = \tfrac38$ and $\cos x = \pm\frac{\sqrt{6}}{4} \approx \pm 0.612$. Each of these two values of $\cos x$ lies strictly between $-1$ and $1$ and so yields two values of $x$ in $(0, 2\pi)$, giving four more solutions, none of which is $\pi$ because $\cos\pi = -1$. Altogether there are $5$ solutions. The answer is E. Forgetting the factor $\sin x = 0$ leaves option D.
