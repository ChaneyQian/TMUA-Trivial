---
database: TMUA
qid: 20132101207116
id: JZMaths_SetC-Mock-P1-Q16
paper: TMUA Mock
year:
number: Q16
section: Multiple Choice
difficulty: 7.5
topics: [Trigonometry, Geometry]
subtopics: [Trigonometric Equations, Coordinate Geometry]
tags: [General-Trigonometry, Graphs-of-Functions]
status: 已入库
---

## 题目
The set of points satisfying
$$ \tan(x^2 + y^2) = 1, \qquad x^2 + y^2 < k\pi, $$
is made up of finitely many separate closed curves. For each separate closed curve, consider the region enclosed by that curve.

Given that the sum of the areas of these regions is $30\pi^2$, find the smallest possible integer value of $k$.

$$ \mathbf{A} \quad 5 $$
$$ \mathbf{B} \quad 6 $$
$$ \mathbf{C} \quad 7 $$
$$ \mathbf{D} \quad 8 $$
$$ \mathbf{E} \quad 9 $$
$$ \mathbf{F} \quad 10 $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Treating $x^2 + y^2$ as a single unknown, solving gives:
$$ x^2 + y^2 = \frac{\pi}{4} + n\pi \ge 0. $$

This is a circle for $n = 0, 1, 2, ...$ on the right-hand side.

Since $x^2 + y^2 < k\pi$, we need
$$ \frac{\pi}{4} + n\pi < k\pi. $$

Dividing by $\pi$ gives
$$ n + \frac{1}{4} < k. $$

If $k$ is a positive integer, then this means
$$ n = 0, 1, 2, \dots, k - 1. $$

So there are $k$ circles. The area enclosed by each circle is $\pi r^2$, so the sum of the areas is
$$ \pi \sum_{n=0}^{k-1} \left( \frac{\pi}{4} + n\pi \right). $$

This is the sum of an arithmetic sequence, therefore it is
$$ \pi^2 \left( \frac{k}{4} + \frac{k(k - 1)}{2} \right). $$

Equate to $30\pi^2$, so
$$ \frac{k}{4} + \frac{k(k - 1)}{2} = 30 \quad \Longleftrightarrow \quad (2k + 15)(k - 8) = 0. $$

Since $k$ is positive,
$$ k = 8. $$

The smallest integer value of $k$ is 8.
