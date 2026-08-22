---
database: TMUA
qid: 20132101203205
id: Yotta-Mock-P2-Q5
paper: TMUA Mock
year:
number: Q5
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Find the sum of the $x$-coordinates of the points of intersections of
$$ y = (\sqrt{x} - 3)(\sqrt{x} + 3) $$
and
$$ |x| = \frac{y + 20}{3} $$

$$
\mathbf{A} \quad \text{There are no points of intersection}
$$

$$
\mathbf{B} \quad -11.75
$$

$$
\mathbf{C} \quad -3.5
$$

$$
\mathbf{D} \quad -2.75
$$

$$
\mathbf{E} \quad 0
$$

$$
\mathbf{F} \quad 2.75
$$

$$
\mathbf{G} \quad 5.5
$$

$$
\mathbf{H} \quad 15.25
$$

## 备注

### 我的备注

### AI备注


## 答案
G

## 解析
The first equation is $y = \left(\sqrt{x}\right)^{2} - 9 = x - 9$, but the presence of $\sqrt{x}$ restricts the curve to $x \geq 0$ — it is only the right-hand half of that line.

Because $x \geq 0$ we have $|x| = x$, so the second equation reads $x = \frac{y+20}{3}$. Substituting $y = x - 9$:

$$ x = \frac{(x-9) + 20}{3} = \frac{x+11}{3} \implies 3x = x + 11 \implies x = 5.5 $$

This satisfies $x \geq 0$, so it is genuine: $y = -3.5$, and $\frac{-3.5+20}{3} = 5.5 = |x|$ as required. There is only this one intersection, so the sum of the $x$-coordinates is $5.5$.

The answer is G. The branch $x < 0$ of $|x| = \frac{y+20}{3}$ contributes nothing, because the first curve does not exist there.
