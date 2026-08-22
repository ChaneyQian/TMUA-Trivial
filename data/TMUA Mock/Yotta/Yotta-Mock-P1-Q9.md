---
database: TMUA
qid: 20132101203109
id: Yotta-Mock-P1-Q9
paper: TMUA Mock
year:
number: Q9
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
How many real solutions are there to
$$ \ln(\sin(x)) = \ln\left(1 - \frac{4x}{7\pi}\right) $$

$$
\mathbf{A} \quad 0
$$

$$
\mathbf{B} \quad 1
$$

$$
\mathbf{C} \quad 2
$$

$$
\mathbf{D} \quad 3
$$

$$
\mathbf{E} \quad 4
$$

$$
\mathbf{F} \quad 5
$$

$$
\mathbf{G} \quad 6
$$

$$
\mathbf{H} \quad \text{infinitely many}
$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Both logarithms need positive arguments, so we need $\sin x > 0$ and $1 - \frac{4x}{7\pi} > 0$, the latter meaning $x < \frac{7\pi}{4}$. Where both hold, the equation is equivalent to

$$ \sin x = 1 - \frac{4x}{7\pi} $$

For $x < 0$ the right-hand side exceeds $1$, which $\sin x$ never does, so there are no solutions there. Combined with $\sin x > 0$ and $x < \frac{7\pi}{4}$, the only interval left is $0 < x < \pi$.

On that interval compare the two sides. Near $x = 0^{+}$ we have $\sin x \approx 0$ while the line is near $1$, so the line is above. At $x = \frac{\pi}{2}$, $\sin x = 1$ while the line is $1 - \frac{2}{7} = \frac{5}{7}$, so the curve is above. Near $x = \pi^{-}$, $\sin x \approx 0$ while the line is $\frac{3}{7}$, so the line is above again.

The difference therefore changes sign once in $\bigl(0, \frac{\pi}{2}\bigr)$ and once in $\bigl(\frac{\pi}{2}, \pi\bigr)$, and both sides are monotonic on each of those pieces, so there is exactly one crossing in each. There are $2$ real solutions, so the answer is C.
