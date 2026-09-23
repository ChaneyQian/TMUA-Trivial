---
database: MAT
qid: 90020351100
id: SMT-Ch7-Q11
paper: SMT Skills Ch7
year:
number: Q11
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
style: MAT
solution_source: 书后解答
status: 已入库
---

## 题目
Into how many regions is the plane divided when the following curves are drawn?
$y = x^3 - x^2, \quad y = x^3 - 4x, \quad y = x^2$

(a) $11$
(b) $10$
(c) $9$
(d) $8$
(e) $7$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 7 章 Graphs 章末 MAT style 第 11 题；解析为书后官方 worked solution。

## 答案
B

## 解析
Name the curves $C_{1}: y = x^{3} - x^{2}$, $C_{2}: y = x^{3} - 4x$, $C_{3}: y = x^{2}$, and find every point of intersection first.
$$\begin{aligned}
C_{1} \cap C_{2}: \quad x^{3} - x^{2} = x^{3} - 4x &\Rightarrow x(x - 4) = 0 \Rightarrow x = 0,\ 4\
C_{1} \cap C_{3}: \quad x^{3} - x^{2} = x^{2} &\Rightarrow x^{2}(x - 2) = 0 \Rightarrow x = 0,\ 2\
C_{2} \cap C_{3}: \quad x^{3} - 4x = x^{2} &\Rightarrow x\left(x^{2} - x - 4\right) = 0 \Rightarrow x = 0,\ \frac{1 \pm \sqrt{17}}{2}
\end{aligned}$$
All three curves pass through the origin, so there are five distinct points in all: $O(0, 0)$, $(2, 4)$, $(4, 48)$, and the two points $A$, $B$
where $C_{2}$ meets $C_{3}$ at $x = \frac{1 \mp \sqrt{17}}{2}$.

Now count the regions with Euler's formula $V - E + F = 2$, applied on the sphere: add a single point at infinity, at which all six ends of the
three curves meet, so that each curve closes into a loop and the whole figure is a connected graph.

- $V$: the five points above, together with the point at infinity, so $V = 6$.
- $E$: each curve is cut into as many arcs as it carries vertices. $C_{1}$ carries $O$, $(2, 4)$, $(4, 48)$ and $\infty$, so $4$ arcs; $C_{2}$
  carries $O$, $(4, 48)$, $A$, $B$, $\infty$, so $5$; $C_{3}$ carries $O$, $(2, 4)$, $A$, $B$, $\infty$, so $5$. Hence $E = 14$.
- $F = 2 - V + E = 2 - 6 + 14 = 10$.

The point at infinity is a vertex, not the interior of a face, so every one of these faces is a genuine region of the plane: the plane is divided into $10$ regions.
The correct answer is (b).

A quicker check: build the picture one curve at a time, using the fact that a new curve cut into $k$ arcs by the figure already drawn adds $k$
regions. Starting from $1$: drawing $C_{3}$ gives $2$; $C_{1}$ meets it at $2$ points, so $3$ arcs, giving $5$; $C_{2}$ meets the figure at $4$ points, so $5$ arcs, giving $10$.
Note that at the origin $C_{1}$ and $C_{3}$ touch without crossing, since $\left(x^{3} - x^{2}\right) - x^{2} = x^{2}(x - 2) \le 0$ near $x = 0$;
that does not change the count, because the point of contact still cuts each of the two curves into separate arcs.

![[Image/SMT-Ch7-Q11-sol1.png]]
