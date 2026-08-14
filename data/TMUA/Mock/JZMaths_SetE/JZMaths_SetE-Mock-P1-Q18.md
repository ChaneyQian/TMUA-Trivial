---
database: TMUA
qid: 20132101209118
id: JZMaths_SetE-Mock-P1-Q18
paper: TMUA Mock
year:
number: Q18
section: Multiple Choice
difficulty: 7.5
topics: [Miscellaneous Pure, Trigonometry]
subtopics: [Inequalities, Trigonometric Equations, Graph Sketching]
tags: [General-Trigonometry, Inequalities]
status: 已入库
---

## 题目
Find the total length of the intervals for which
$$ (2 \sin x - 1) \cos \left( 2x - \frac{\pi}{6} \right) \tan x \le 0 $$
for $0 < x < \pi$, with $x \neq \frac{\pi}{2}$.

$$ \mathbf{A} \quad \frac{5\pi}{6} $$
$$ \mathbf{B} \quad \frac{\pi}{3} $$
$$ \mathbf{C} \quad \frac{\pi}{4} $$
$$ \mathbf{D} \quad \frac{5\pi}{12} $$
$$ \mathbf{E} \quad \frac{\pi}{6} $$
$$ \mathbf{F} \quad \frac{7\pi}{12} $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
For this, we use the same method as for sketching a polynomial written as a product of linear factors.
We do not need to sketch the curve itself; we only need to track how the sign changes at each root
and discontinuity.

The first factor is zero when $2 \sin x - 1 = 0$, giving $x = \frac{\pi}{6}$ and $x = \frac{5\pi}{6}$.

The second factor is zero when $\cos \left( 2x - \frac{\pi}{6} \right) = 0$, giving $x = \frac{\pi}{3}$ and $x = \frac{5\pi}{6}$.

Also, $\tan x$ is undefined at $x = \frac{\pi}{2}$. We list $x = \frac{5\pi}{6}$ twice because two factors are zero there.

For $x$ just greater than $0$, the product is negative. The signs therefore alternate as follows:

$$
\begin{array}{c|ccccccccccccc}
x & 0 & & \frac{\pi}{6} & & \frac{\pi}{3} & & \frac{\pi}{2} & & \frac{5\pi}{6} & & \frac{5\pi}{6} & & \pi \\
\hline
\text{sign} & & - & 0 & + & 0 & - & \text{undefined} & + & 0 & - & 0 & + & 
\end{array}
$$

There is no interval between the two appearances of $\frac{5\pi}{6}$; listing it twice simply records the two simultaneous sign changes.

Hence the inequality is satisfied on
$$ \left( 0, \frac{\pi}{6} \right] \cup \left[ \frac{\pi}{3}, \frac{\pi}{2} \right) $$
and at the isolated point $x = \frac{5\pi}{6}$. The isolated point has no length, so the total length is
$$ \frac{\pi}{6} + \left( \frac{\pi}{2} - \frac{\pi}{3} \right) = \frac{\pi}{3}. $$
