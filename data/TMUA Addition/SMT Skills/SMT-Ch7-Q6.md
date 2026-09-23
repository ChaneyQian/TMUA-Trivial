---
database: TMUA
qid: 90020250600
id: SMT-Ch7-Q6
paper: SMT Skills Ch7
year:
number: Q6
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
How many solutions does the equation $x\sin x = 2\cos x$ have in the interval $-\pi \le x \le \pi$?

$$\mathbf{A} \quad 0$$

$$\mathbf{B} \quad 1$$

$$\mathbf{C} \quad 2$$

$$\mathbf{D} \quad 3$$

$$\mathbf{E} \quad 4$$

$$\mathbf{F} \quad 5$$

$$\mathbf{G} \quad 6$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 7 章 Graphs 章末 TMUA style 第 6 题；解析为书后官方 worked solution。

## 答案
C

## 解析
At $x = \pm\frac{\pi}{2}$ the right-hand side is $0$ but $x\sin x = \pm\frac{\pi}{2} \ne 0$, so there is no solution there, and elsewhere we may divide by $\cos x$ to get $x\tan x = 2$.
Let $f(x) = x\tan x$, which is even. On $\left[0, \frac{\pi}{2}\right)$,
$$f'(x) = \tan x + x\sec^{2}x > 0$$
so $f$ increases strictly from $f(0) = 0$ to $+\infty$: exactly one solution of $f(x) = 2$, at $x \approx 1.077$. On
$\left(\frac{\pi}{2}, \pi\right]$ we have $\tan x \le 0$ and $x > 0$, so $f(x) \le 0 < 2$ and there is nothing there. By symmetry there is exactly one negative solution.
There are two solutions. The correct answer is (C).
