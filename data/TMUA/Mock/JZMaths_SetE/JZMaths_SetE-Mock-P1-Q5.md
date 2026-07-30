---
database: TMUA
qid: 20132101209105
id: JZMaths_SetE-Mock-P1-Q5
paper: TMUA Mock
year:
number: Q5
section: Multiple Choice
difficulty: 6
topics: []
subtopics: []
tags: [Area Integration]
status: 已入库
---

## 题目
What is the value of
$$ \int_{-2}^3 \Big| \, |x| - 1 \Big| \, dx \,? $$
$$ \mathbf{A} \quad 3 $$
$$ \mathbf{B} \quad \frac{9}{2} $$
$$ \mathbf{C} \quad 4 $$
$$ \mathbf{D} \quad \frac{7}{2} $$
$$ \mathbf{E} \quad \frac{13}{4} $$
$$ \mathbf{F} \quad 5 $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
The expression changes form at $x = -1$, $x = 0$ and $x = 1$. Hence
$$ \big| |x| - 1 \big| =
\begin{cases}
-x - 1, & -2 \le x \le -1, \\
x + 1, & -1 \le x \le 0, \\
1 - x, & 0 \le x \le 1, \\
x - 1, & 1 \le x \le 3.
\end{cases}
$$
Therefore,
$$ \int_{-2}^3 \big| |x| - 1 \big| \, dx = \int_{-2}^{-1} (-x - 1) \, dx + \int_{-1}^0 (x + 1) \, dx + \int_0^1 (1 - x) \, dx + \int_1^3 (x - 1) \, dx. $$
These four integrals are the areas of triangles, so no need to actually integrate, just find triangular areas, giving
$$ \frac{1}{2} + \frac{1}{2} + \frac{1}{2} + 2 = \frac{7}{2}. $$
