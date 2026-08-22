---
database: TMUA
qid: 20132101212105
id: BeyondHorizonS2-Mock-P1-Q5
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
Find the complete set of values of $p$ for which the equation
$$x^2 - 3px + y^2 - 4y - p^2 + 6p + 7 = 0$$
describes a circle in the $xy$-plane.
$$\mathbf{A} \quad p < -\frac{7}{3}$$
$$\mathbf{B} \quad p < \frac{12 - 10\sqrt{5}}{13} \text{ or } p > \frac{12 + 10\sqrt{5}}{13}$$
$$\mathbf{C} \quad p < \frac{10 - 10\sqrt{3}}{13} \text{ or } p > \frac{10 + 10\sqrt{3}}{13}$$
$$\mathbf{D} \quad p < \frac{12 - 10\sqrt{3}}{13} \text{ or } p > \frac{12 + 10\sqrt{3}}{13}$$
$$\mathbf{E} \quad p < -2 \text{ or } p > 8$$
$$\mathbf{F} \quad \text{All real values of } p$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Complete the square in $x$ and in $y$:
$$\left(x - \frac{3p}{2}\right)^2 - \frac{9p^2}{4} + (y - 2)^2 - 4 - p^2 + 6p + 7 = 0,$$
so that
$$\left(x - \frac{3p}{2}\right)^2 + (y - 2)^2 = \frac{9p^2}{4} + p^2 - 6p - 3 = \frac{13p^2 - 24p - 12}{4}.$$
The locus is a genuine circle exactly when the right-hand side is strictly positive, i.e. $13p^2 - 24p - 12 > 0$. The roots of $13p^2 - 24p - 12 = 0$ are
$$p = \frac{24 \pm \sqrt{576 + 624}}{26} = \frac{24 \pm 20\sqrt{3}}{26} = \frac{12 \pm 10\sqrt{3}}{13},$$
and since the quadratic opens upwards the inequality holds outside the roots, namely for $p < \frac{12 - 10\sqrt{3}}{13} \approx -0.409$ or $p > \frac{12 + 10\sqrt{3}}{13} \approx 2.256$. The answer is D. Option B is the same calculation with the surd mis-simplified to $\sqrt{5}$, and F is the trap of forgetting that a zero or negative right-hand side gives a single point or the empty set rather than a circle.
