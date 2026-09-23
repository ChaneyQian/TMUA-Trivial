---
database: MAT
qid: 90020370600
id: SMT-Ch9-Q6
paper: SMT Skills Ch9
year:
number: Q6
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
How many solutions does the equation
$$ \cos^4 x + \sin^3 x = 0 $$
have in the interval $0^\circ \le x \le 360^\circ$?

(a) $0$
(b) $1$
(c) $2$
(d) $3$
(e) $4$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 9 章 Trigonometry 章末 MAT style 第 6 题；解析为书后官方 worked solution。

## 答案
C

## 解析
Since $\cos^4 x \ge 0$, the equation forces $\sin^3 x \le 0$, i.e. $\sin x \le 0$.

Put $s = \sin x$, so that $\cos^4 x = \left(\cos^2 x\right)^2 = \left(1 - s^2\right)^2$ and the equation becomes

$$\left(1 - s^2\right)^2 + s^3 = 0, \qquad -1 \le s \le 0.$$

Now watch both terms as $s$ decreases from $0$ to $-1$. The square $s^2$ increases from $0$ to $1$, so $1 - s^2$ decreases from $1$ to $0$
and $\left(1-s^2\right)^2$ decreases from $1$ to $0$; meanwhile $s^3$ decreases from $0$ to $-1$.
The left-hand side is therefore strictly decreasing, running from $+1$ at $s = 0$ to $-1$ at $s = -1$, so it is zero for exactly one value $s_0$, and $-1 < s_0 < 0$.

Since $s_0$ is strictly between $-1$ and $0$, the equation $\sin x = s_0$ has exactly two solutions in $0^\circ \le x \le 360^\circ$, one in each of the third and fourth quadrants.

The correct answer is (c).

Numerically $s_0 \approx -0.671$, giving $x \approx 222.1^\circ$ and $x \approx 317.9^\circ$; the quartic $s^4 + s^3 - 2s^2 + 1 = 0$ has no nice closed-form root,
which is a good sign that the question wants the counting argument rather than the solutions themselves.

Option (e), $4$, is what you get by forgetting that $\sin x$ must be negative and counting a solution in every quadrant.
