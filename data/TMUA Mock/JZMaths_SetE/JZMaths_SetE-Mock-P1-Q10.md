---
database: TMUA
qid: 20132101209110
id: JZMaths_SetE-Mock-P1-Q10
paper: TMUA Mock
year:
number: Q10
section: Multiple Choice
difficulty: 6.5
topics: [Calculus, Function]
subtopics: [Integration, Absolute Value Functions]
tags: [Graphs-of-Functions, Integration]
status: 已入库
---

## 题目
For each real number $a$, let $F(a)$ be the area between the graph $y = |x - a|$ and the $x$-axis from $x = 0$ to $x = 2$. How many real values of $a$ satisfy
$$ F(a) = a + 1? $$

$$ \mathbf{A} \quad 0 $$
$$ \mathbf{B} \quad 1 $$
$$ \mathbf{C} \quad 2 $$
$$ \mathbf{D} \quad 3 $$
$$ \mathbf{E} \quad 4 $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
If $a < 0$, then
$$ F(a) = \int_0^2 (x - a) \, dx = 2 - 2a. $$

The equation $2 - 2a = a + 1$ gives $a = \frac{1}{3}$, but $a < 0$, so not valid.

If $0 \le a \le 2$, then
$$ F(a) = \frac{a^2}{2} + \frac{(2 - a)^2}{2} = a^2 - 2a + 2. $$

So
$$ a^2 - 2a + 2 = a + 1, $$

which gives
$$ a^2 - 3a + 1 = 0. $$

Of its two roots, only $\frac{3 - \sqrt{5}}{2}$ lies in $[0, 2]$.

If $a > 2$, then
$$ F(a) = \int_0^2 (a - x) \, dx = 2a - 2. $$

The equation $2a - 2 = a + 1$ gives $a = 3$, which is valid. Hence there are 2 solutions.
