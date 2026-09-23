---
database: MAT
qid: 90020370800
id: SMT-Ch9-Q8
paper: SMT Skills Ch9
year:
number: Q8
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
What is the maximum value of
$$ \left[ \frac{1}{2 - \sin(x + 135^\circ)} \right]^2 $$
in the interval $90^\circ \le x \le 270^\circ$.

(a) $\frac{1}{4}$
(b) $\frac{1}{9}$
(c) $2$
(d) $\frac{18 + 8\sqrt{2}}{49}$
(e) $4$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 9 章 Trigonometry 章末 MAT style 第 8 题；解析为书后官方 worked solution。

## 答案
D

## 解析
Substitute $\theta = x + 135^\circ$. As $x$ runs over $90^\circ \le x \le 270^\circ$, the angle $\theta$ runs over $225^\circ \le \theta \le 405^\circ$, and the expression is $\left(\frac{1}{2 - \sin\theta}\right)^2$.

Since $-1 \le \sin\theta \le 1$, the denominator satisfies $1 \le 2 - \sin\theta \le 3$ and is always positive, so the expression is largest when $2 - \sin\theta$ is smallest,
i.e. when $\sin\theta$ is as large as possible on the given range of $\theta$.

On $225^\circ \le \theta \le 360^\circ$ the sine is never positive.
On $360^\circ \le \theta \le 405^\circ$ it equals $\sin(\theta - 360^\circ)$ and increases from $0$ up to $\sin 45^\circ = \frac{\sqrt{2}}{2}$.
So the maximum of $\sin\theta$ is $\frac{\sqrt{2}}{2}$, attained at $\theta = 405^\circ$, i.e. at the endpoint $x = 270^\circ$.

The maximum value is therefore

$$\begin{aligned}
\left(\frac{1}{2 - \frac{\sqrt{2}}{2}}\right)^2 &= \left(\frac{2}{4 - \sqrt{2}}\right)^2 = \frac{4}{18 - 8\sqrt{2}} \
&= \frac{4\left(18 + 8\sqrt{2}\right)}{18^2 - \left(8\sqrt{2}\right)^2} = \frac{4\left(18 + 8\sqrt{2}\right)}{196} = \frac{18 + 8\sqrt{2}}{49}.
\end{aligned}$$

The correct answer is (d).

Options (c) and (e) can be ruled out immediately: since $2 - \sin\theta \ge 1$, the expression never exceeds $1$, whatever the interval.
Option (b), $\frac{1}{9}$, is the *minimum* on this interval, reached where $\sin\theta = -1$ at $\theta = 270^\circ$, i.e. $x = 135^\circ$.
