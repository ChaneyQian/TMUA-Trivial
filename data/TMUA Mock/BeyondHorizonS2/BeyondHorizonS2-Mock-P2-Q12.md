---
database: TMUA
qid: 20132101212212
id: BeyondHorizonS2-Mock-P2-Q12
paper: TMUA Mock
year:
number: Q12
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
How many positive real roots does this equation have?
$$x^4 - 2\sqrt{2}x^3 + 2x^2 - 4x = 0.$$
$$\mathbf{A} \quad 0$$
$$\mathbf{B} \quad 1$$
$$\mathbf{C} \quad 2$$
$$\mathbf{D} \quad 3$$
$$\mathbf{E} \quad 4$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Factor out $x$ to get $x\left(x^3 - 2\sqrt{2}x^2 + 2x - 4\right) = 0$. The root $x = 0$ is not positive, so everything depends on the cubic $g(x) = x^3 - 2\sqrt{2}x^2 + 2x - 4$. Its derivative $g'(x) = 3x^2 - 4\sqrt{2}x + 2$ has discriminant $32 - 24 = 8 > 0$, so $g$ has a local maximum at $x = \frac{\sqrt{2}}{3}$ and a local minimum at $x = \sqrt{2}$. The local maximum value $g\left(\frac{\sqrt{2}}{3}\right)$ is about $-3.58$, so the graph is already below the axis at its highest point on the left branch. Consequently $g$ crosses zero exactly once, on the increasing branch to the right of $x = \sqrt{2}$; numerically $g(2) \approx -3.31$ and $g(3) \approx 3.54$, which places that single crossing between $2$ and $3$. Hence the quartic has exactly one positive real root. The answer is B.
