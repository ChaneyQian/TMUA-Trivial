---
database: TMUA
qid: 20132101209113
id: JZMaths_SetE-Mock-P1-Q13
paper: TMUA Mock
year:
number: Q13
section: Multiple Choice
difficulty: 7
topics: [Trigonometry]
subtopics: [Trigonometric Equations, Trigonometry]
tags: [General-Trigonometry]
status: 已入库
---

## 题目
The values of $x$, measured in degrees, satisfy both
$$ \sin 3x + 2\cos 3x = \frac{\sqrt{3} + 2}{2} $$
and
$$ 3\sin 3x - 2\cos 3x = \frac{3\sqrt{3} - 2}{2}. $$

The sum of all such values of $x$ in the interval $0 \le x \le k^{\circ}$ is $800^{\circ}$.
Find the least possible value of $k$.

$$ \mathbf{A} \quad 240^{\circ} $$
$$ \mathbf{B} \quad 500^{\circ} $$
$$ \mathbf{C} \quad 380^{\circ} $$
$$ \mathbf{D} \quad 400^{\circ} $$
$$ \mathbf{E} \quad 360^{\circ} $$
$$ \mathbf{F} \quad 720^{\circ} $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
We first routinely solve for $\sin 3x$ and $\cos 3x$, adding the two equations gives $\sin 3x = \frac{\sqrt{3}}{2}$, then substituting this into the first equation gives $\cos 3x = \frac{1}{2}$.

Remember here $x$ has to satisfy both equations!

The general solutions of the first equation are
$$ 3x = 60^{\circ} + 360^{\circ}n $$
or
$$ 3x = 120^{\circ} + 360^{\circ}n. $$

The general solutions of the second equation are
$$ 3x = 60^{\circ} + 360^{\circ}m $$
or
$$ 3x = 300^{\circ} + 360^{\circ}m, $$
where $m$ and $n$ are integers.

The only values common to both sets are
$$ 3x = 60^{\circ} + 360^{\circ}n. $$

Hence $x = 20^{\circ} + 120^{\circ}n$. Since $x \ge 0$, the values are
$$ 20^{\circ}, \; 140^{\circ}, \; 260^{\circ}, \; 380^{\circ}, \dots $$

The first four have sum $20 + 140 + 260 + 380 = 800$, so the least possible value of $k$ is
$$ 380. $$
