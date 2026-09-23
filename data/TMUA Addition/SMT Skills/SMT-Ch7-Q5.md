---
database: TMUA
qid: 90020250500
id: SMT-Ch7-Q5
paper: SMT Skills Ch7
year:
number: Q5
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
style: TMUA
solution_source: 书后解答
status: 已入库
---

## 题目
Find the number of solutions of the equation
$x\tan x = \sin x \text{ with } -\pi \le x \le \pi$.

$$\mathbf{A} \quad 0$$

$$\mathbf{B} \quad 1$$

$$\mathbf{C} \quad 2$$

$$\mathbf{D} \quad 3$$

$$\mathbf{E} \quad 4$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 7 章 Graphs 章末 TMUA style 第 5 题；解析为书后官方 worked solution。

## 答案
E

## 解析
First note that $\tan x$ is undefined at $x = \pm\frac{\pi}{2}$, so those two points are excluded. Everywhere else $\cos x \ne 0$, so multiplying by $\cos x$ is reversible:
$$x\sin x = \sin x\cos x \quad\Longleftrightarrow\quad \sin x\,(x - \cos x) = 0$$
So either $\sin x = 0$, giving $x = -\pi,\ 0,\ \pi$ in the range, or $\cos x = x$.
The equation $\cos x = x$ has exactly one root: $h(x) = \cos x - x$ has $h'(x) = -\sin x - 1 \le 0$, with equality only at isolated points, so $h$
is strictly decreasing, and $h(0) = 1 > 0$ while $h\left(\frac{\pi}{2}\right) = -\frac{\pi}{2} < 0$. That root is $x \approx 0.739$, which is in range and is not $\pm\frac{\pi}{2}$.
Altogether $x = -\pi,\ 0,\ 0.739\ldots,\ \pi$: four solutions.
The correct answer is (E).
It is easy to lose $x = \pm\pi$, where both sides are $0$; they are genuine solutions.
