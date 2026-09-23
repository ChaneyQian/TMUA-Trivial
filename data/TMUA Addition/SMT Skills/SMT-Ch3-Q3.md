---
database: TMUA
qid: 90020210300
id: SMT-Ch3-Q3
paper: SMT Skills Ch3
year:
number: Q3
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
style: TMUA
solution_source: 书后解答
answer_verified: true
status: 已入库
---

## 题目
A region is defined by the inequalities $y < x + 4$ and $x + y < 8$. Consider the four statements:

	1. $x < -1$
	2. $y < 6$
	3. $x^2 + y^2 \le 4(x + y)$
	4. $y < (x + 1)(3 - x)$

Which of the statements above is/are true for **every** point in the region?

$$\mathbf{A} \quad \text{1 only}$$

$$\mathbf{B} \quad \text{2 only}$$

$$\mathbf{C} \quad \text{3 only}$$

$$\mathbf{D} \quad \text{4 only}$$

$$\mathbf{E} \quad \text{1 and 2 only}$$

$$\mathbf{F} \quad \text{1 and 3 only}$$

$$\mathbf{G} \quad \text{1 and 4 only}$$

$$\mathbf{H} \quad \text{2 and 3 only}$$

$$\mathbf{I} \quad \text{2 and 4 only}$$

$$\mathbf{J} \quad \text{3 and 4 only}$$

$$\mathbf{K} \quad \text{1, 2 and 3 only}$$

$$\mathbf{L} \quad \text{2, 3 and 4 only}$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 3 章 Algebra 章末 TMUA style 第 3 题；解析为书后官方 worked solution。
- **书后答案印的是 L，已订正为 B。** 区域 $y<x+4,\ x+y<8$ 是顶点 $(2,6)$、向下张开的无界楔形：语句 2（$y<6$）对区域内每点成立；语句 1 在 $(0,0)$ 失败，语句 3 在 $(0,-100)$ 失败，语句 4 在 $(10,-3)$ 失败。书后解答论证的是反方向（「满足语句的点都落在区域内」），与题面问法不符。题面已回原书 PDF 核过，转写无误。

## 答案
B

## 解析
A quick sketch is worth doing. The line $y = x + 4$ passes through $(0,\ 4)$ with gradient $1$ and $x + y = 8$ passes through $(0,\ 8)$ with gradient $- 1$. By inspection or simultaneous equations, the two lines intersect at $(2,\ 6)$. The co-ordinates of all points in the unshaded area of the following image satisfy both inequalities.

![[Image/SMT-sol-image08.png]]

Considering the four statements in turn:

1.  $x < - 1$: **not true** for every point in the region (for example, $(0,\ 0)$).

2.  $y < 6$: **true** for every point in the region (note that $(2,\ 6)$ does not quite lie in the region).

3.  $x^{2} + y^{2} \leq 4(x + y) \Leftrightarrow x^{2} - 4x + y^{2} - 4y \leq 0 \Leftrightarrow (x - 2)^{2} + (y - 2)^{2} \leq 8$, meaning inside, or on the circumference of, a circle of radius $2\sqrt{2}$ and centred at $(2,\ 2)$. The sketch below shows that the centre of the circle is never less than distance $2\sqrt{2}$ from either of the lines:

    ![[Image/SMT-sol-image09.png]]

    Since the dotted lines are not included in the region, the given statement must be **true** for every point in the region.

4.  $y < (x + 1)(3 - x)$, meaning all points below the quadratic curve given by the equation $y = - x^{2} + 2x + 3 = - (x - 1)^{2} + 4$. This passes through $( - 1,\ 0),\ (1,\ 4)$ and $(3,\ 0)$, so lies completely in the region: **true** for every point in the region.

The points in the region satisfy 2., 3. and 4. only. The correct answer is L.
