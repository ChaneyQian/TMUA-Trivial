---
database: TMUA
qid: 20132101209106
id: JZMaths_SetE-Mock-P1-Q6
paper: TMUA Mock
year:
number: Q6
section: Multiple Choice
difficulty: 6
topics: [Miscellaneous Pure, Function]
subtopics: [Inequalities, Algebraic Functions]
tags: [Inequalities]
status: 已入库
---

## 题目
The real number $x$ satisfies both
$$ \frac{x + 3}{x^2 - 4} \le 0 \quad \text{and} \quad \frac{x^2 - 9}{x - 1} > 0. $$
Find the total length of the set of possible values of $x$.
$$ \mathbf{A} \quad 0 $$
$$ \mathbf{B} \quad 1 $$
$$ \mathbf{C} \quad 2 $$
$$ \mathbf{D} \quad 3 $$
$$ \mathbf{E} \quad 4 $$
$$ \mathbf{F} \quad 6 $$
$$ \mathbf{G} \quad 8 $$
$$ \mathbf{H} \quad \infty $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
First consider
$$ \frac{x + 3}{x^2 - 4} = \frac{x + 3}{(x - 2)(x + 2)} \le 0. $$
The critical values are $-3$, $-2$ and $2$. A sign analysis gives
$$ x \le -3 \quad \text{or} \quad -2 < x < 2. $$
Next,
$$ \frac{x^2 - 9}{x - 1} = \frac{(x - 3)(x + 3)}{x - 1} > 0. $$
The critical values are $-3$, $1$ and $3$. A sign analysis gives
$$ -3 < x < 1 \quad \text{or} \quad x > 3. $$
Both inequalities must hold, so we take the intersection:
$$ ((-\infty, -3] \cup (-2, 2)) \cap ((-3, 1) \cup (3, \infty)) = (-2, 1). $$
Therefore the complete set of values of $x$ is $-2 < x < 1$, and the length of the interval is $3$.
