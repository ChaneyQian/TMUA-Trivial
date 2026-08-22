---
database: TMUA
qid: 20132101203116
id: Yotta-Mock-P1-Q16
paper: TMUA Mock
year:
number: Q16
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
A point $A$ is chosen on the curve with equation:
$$ (x - 2)^2 + (y - 3)^2 = 4 $$
and another point $B$ is chosen on the curve with equation:
$$ x^2 + y^2 + 8x + 10y = r $$
Find the length of the interval within the range $0 < r < 125$ for which the shortest possible distance of $AB$ is less than 1.

$$
\mathbf{A} \quad 3
$$

$$
\mathbf{B} \quad 5
$$

$$
\mathbf{C} \quad 6
$$

$$
\mathbf{D} \quad 49
$$

$$
\mathbf{E} \quad 76
$$

$$
\mathbf{F} \quad 117
$$

$$
\mathbf{G} \quad 119
$$

$$
\mathbf{H} \quad 120
$$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
The first curve is a circle with centre $C_{1}(2,3)$ and radius $2$. Completing the square on the second,

$$ (x+4)^{2} + (y+5)^{2} = r + 41 $$

a circle with centre $C_{2}(-4,-5)$ and radius $R = \sqrt{r+41}$ (real and positive throughout $0 < r < 125$). The centres are

$$ d = \sqrt{(2+4)^{2} + (3+5)^{2}} = \sqrt{36+64} = 10 $$

apart. For two circles the shortest distance between a point of one and a point of the other is

$$ \max\left(0,\; d - 2 - R,\; R - d - 2\right) $$

the three cases being: the circles meet; they lie outside each other; or the big one encloses the small one. We need this to be less than $1$, i.e. both $d - 2 - R < 1$ and $R - d - 2 < 1$:

$$ 10 - 2 - R < 1 \implies R > 7, \qquad R - 10 - 2 < 1 \implies R < 13 $$

So $7 < \sqrt{r+41} < 13$, giving $49 < r + 41 < 169$ and hence $8 < r < 128$. Intersecting with $0 < r < 125$ leaves $8 < r < 125$, an interval of length $125 - 8 = 117$.

The answer is F.
