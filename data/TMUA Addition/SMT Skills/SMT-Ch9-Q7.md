---
database: MAT
qid: 90020370700
id: SMT-Ch9-Q7
paper: SMT Skills Ch9
year:
number: Q7
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
$$ \cos^{2n} x + \sin^n x = 0 $$
have in the interval $0^\circ \le x \le 360^\circ$ where $n$ is a positive integer?

(a) one for all $n$
(b) two for all $n$
(c) two for odd $n$ only
(d) two for even $n$ and one for odd $n$
(e) two for even $n$ and three for odd $n$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 9 章 Trigonometry 章末 MAT style 第 7 题；解析为书后官方 worked solution。

## 答案
C

## 解析
Again $\cos^{2n} x = \left(\cos^2 x\right)^n \ge 0$ for every $n$, so everything turns on the sign of $\sin^n x$.

If $n$ is even then $\sin^n x \ge 0$ as well, so the left-hand side is a sum of two non-negative terms and can vanish only if $\cos x = 0$ and $\sin x = 0$ at the same time
— impossible, since $\sin^2 x + \cos^2 x = 1$. So there are no solutions for even $n$.

If $n$ is odd, write $s = \sin x$; as in Question 6 the equation forces $s \le 0$, and

$$\left(1 - s^2\right)^n = -s^n = (-s)^n$$

because $n$ is odd. Raising to the $n$th power is a one-to-one operation on the real numbers when $n$ is odd, so this is equivalent to

$$1 - s^2 = -s, \qquad \text{i.e.} \qquad s^2 - s - 1 = 0,$$

with roots $s = \frac{1 \pm \sqrt{5}}{2}$. Only $s = \frac{1 - \sqrt{5}}{2} \approx -0.618$ lies in $-1 \le s \le 0$, and being strictly between $-1$ and $0$ it gives exactly two solutions in $0^\circ \le x \le 360^\circ$.

So there are two solutions when $n$ is odd and none when $n$ is even.

The correct answer is (c).

Options (b), (d) and (e) all claim solutions for even $n$, but for even $n$ both terms are non-negative and cannot cancel. A quick check at $n = 2$ makes this concrete: $\cos^4 x + \sin^2 x = 0$ needs both $\cos x = 0$ and $\sin x = 0$.
