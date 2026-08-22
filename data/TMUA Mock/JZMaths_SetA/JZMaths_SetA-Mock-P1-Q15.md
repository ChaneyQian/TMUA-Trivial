---
database: TMUA
qid: 20132101205115
id: JZMaths_SetA-Mock-P1-Q15
paper: TMUA Mock
year:
number: Q15
section: Multiple Choice
difficulty: 7.5
topics: [Trigonometry, Function]
subtopics: [Trigonometric Equations, Algebraic Functions]
tags: [General-Trigonometry]
status: 已入库
---

## 题目
Find the sum of the solutions of the equation
$$ \sqrt{1 - \sin^2 x} = 2 \sin^2 x - \cos x $$
where $0 \le x \le 360^\circ$.

$$ \mathbf{A} \quad 180^\circ $$
$$ \mathbf{B} \quad 360^\circ $$
$$ \mathbf{C} \quad 540^\circ $$
$$ \mathbf{D} \quad 720^\circ $$
$$ \mathbf{E} \quad 900^\circ $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
The left-hand side is $\sqrt{1 - \sin^2 x} = \sqrt{\cos^2 x} = |\cos x|$ (note it does not equal to just $\cos x$!).

Using $\sin^2 x = 1 - \cos^2 x$, the right-hand side becomes $2(1 - \cos^2 x) - \cos x = 2 - 2 \cos^2 x - \cos x$.
Let $c = \cos x$, so the equation is $|c| = 2 - 2c^2 - c$.

**Case 1**: $c \ge 0$ (so $x \in [0^\circ, 90^\circ] \cup [270^\circ, 360^\circ]$). Then $c = 2 - 2c^2 - c \Leftrightarrow c^2 + c - 1 = 0$, giving $c = \frac{-1 \pm \sqrt{5}}{2}$.

The minus root is outside of -1 to 1 range of cos. The positive root is a value strictly between 0 and 1, by **considering the graph** of $\cos x$, we deduce it gives two solutions for $x$, one in 0 to 90, and one in 270 to 360 degree range, precisely matching the case 1 requirements, and the two roots sum to exactly $360^\circ$, again this can be observed from the graph. (Or by basic properties of the cosine function: $\cos x = \cos(x \pm 360n) = \cos(-x)$.) **Case 2**: $c < 0$ (so $x \in (90^\circ, 270^\circ)$). Then $-c = 2 - 2c^2 - c$, i.e. $2c^2 = 2$, so $c = \pm 1$. Only $c = -1$ satisfies $c < 0$, giving $x = 180^\circ$.

Total: 3 solutions. Sum = $360^\circ + 180^\circ = 540^\circ$.

**Remark:** On my site, in **additional useful topics**, there is a section on $\sqrt{x^2} = |x|$ to discuss this in more details.
