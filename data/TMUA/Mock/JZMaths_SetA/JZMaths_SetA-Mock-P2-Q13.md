---
database: TMUA
qid: 20132101205213
id: JZMaths_SetA-Mock-P2-Q13
paper: TMUA Mock
year:
number: Q13
section: Multiple Choice
difficulty: 7
topics: []
subtopics: []
tags: [General Trigonometry, General Algebra]
status: 已入库
---

## 题目
Find the maximum value of
$$ f(x) = \frac{2\sin^2 x + 10\cos x - 14}{\cos^2 x + 3\cos x - 10} $$
where $x$ is a real number.
$$ \mathbf{A} \quad \frac{2}{3} $$
$$ \mathbf{B} \quad 1 $$
$$ \mathbf{C} \quad \frac{5}{3} $$
$$ \mathbf{D} \quad 2 $$
$$ \mathbf{E} \quad \frac{8}{3} $$
$$ \mathbf{F} \quad f \text{ has no maximum value} $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Let $u = \cos x$, so $u \in [-1, 1]$ and $\sin^2 x = 1 - u^2$.

The numerator becomes
$$ 2(1 - u^2) + 10u - 14 = -2u^2 + 10u - 12 = -2(u-2)(u-3). $$

The denominator becomes
$$ u^2 + 3u - 10 = (u - 2)(u + 5). $$

Since $u \in [-1, 1]$ we have $u \neq 2$, so the factor $(u - 2)$ cancels:
$$ f = \frac{-2(u - 3)}{u + 5} = \frac{6 - 2u}{u + 5} = -2 + \frac{16}{u + 5}. $$

Therefore maximum is attained at $u = -1$, and it is $-2 + 16/4 = 2$.
