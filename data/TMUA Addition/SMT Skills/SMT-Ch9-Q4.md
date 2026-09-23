---
database: TMUA
qid: 90020270400
id: SMT-Ch9-Q4
paper: SMT Skills Ch9
year:
number: Q4
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
$x$, satisfies the simultaneous equations
$$ \sqrt{2} \sin 3x - 2\cos 3x = 1 - \sqrt{2} $$
$$ \sin 3x + 2\sqrt{2} \cos 3x = \frac{1}{2}(4 + \sqrt{2}) $$
where $-180^\circ \le x \le 180^\circ$.
Find the sum of the possible values of $x$.

$$\mathbf{A} \quad 45^\circ$$

$$\mathbf{B} \quad 90^\circ$$

$$\mathbf{C} \quad 135^\circ$$

$$\mathbf{D} \quad 180^\circ$$

$$\mathbf{E} \quad 225^\circ$$

$$\mathbf{F} \quad 0^\circ$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 9 章 Trigonometry 章末 TMUA style 第 4 题；解析为书后官方 worked solution。

## 答案
A

## 解析
Treat $\sin 3x$ and $\cos 3x$ as two unknowns and solve the pair as a linear system. Multiplying the first equation by $\sqrt{2}$ and adding the second eliminates the cosine:

$$\begin{aligned}
2\sin 3x - 2\sqrt{2}\cos 3x &= \sqrt{2} - 2 \
\sin 3x + 2\sqrt{2}\cos 3x &= 2 + \frac{\sqrt{2}}{2} \
3\sin 3x &= \frac{3\sqrt{2}}{2}.
\end{aligned}$$

So $\sin 3x = \frac{\sqrt{2}}{2}$, and substituting back into the second equation gives $2\sqrt{2}\cos 3x = 2$, i.e.

$$\cos 3x = \frac{1}{\sqrt{2}} = \frac{\sqrt{2}}{2}.$$

The pair is consistent, since $\left(\frac{\sqrt{2}}{2}\right)^2 + \left(\frac{\sqrt{2}}{2}\right)^2 = 1$, and sine and cosine of $3x$ are both positive and equal, which happens only for

$$3x = 45^\circ + 360^\circ k.$$

The condition $-180^\circ \le x \le 180^\circ$ means $-540^\circ \le 3x \le 540^\circ$, which admits $3x = -315^\circ, 45^\circ, 405^\circ$ and hence

$$x = -105^\circ, \quad 15^\circ, \quad 135^\circ.$$

Their sum is $-105^\circ + 15^\circ + 135^\circ = 45^\circ$.

The correct answer is (A).

> ⚠️ **与书末 Answers 附录不一致** —— 附录给 D（$180^\circ$），本解得 A（$45^\circ$）。
> 裁决计算：把 $\sin 3x = \cos 3x = \frac{\sqrt{2}}{2}$ 代回原方程组，$\sqrt{2}\cdot\frac{\sqrt{2}}{2} - 2\cdot\frac{\sqrt{2}}{2} = 1 - \sqrt{2}$ ✓、$\frac{\sqrt{2}}{2} + 2\sqrt{2}\cdot\frac{\sqrt{2}}{2} = \frac{1}{2}(4+\sqrt{2})$ ✓；
> 在 $-180^\circ \le x \le 180^\circ$ 上以步长 $0.00005^\circ$ 数值扫描两式的残差，得到的解恰是 $-105^\circ, 15^\circ, 135^\circ$，和为 $45^\circ$。
> $180^\circ$ 正是 “只用 $\sin 3x = \frac{\sqrt{2}}{2}$ 而漏掉 $\cos 3x$ 条件” 的结果：那样还会多出 $3x = 135^\circ + 360^\circ k$ 一族，即 $x = -75^\circ, 45^\circ, 165^\circ$，六个值之和恰为 $180^\circ$。
> 但这三个多出来的 $x$ 都有 $\cos 3x = -\frac{\sqrt{2}}{2}$，代入第二式左边得 $\frac{\sqrt{2}}{2} - 2 \neq \frac{1}{2}(4+\sqrt{2})$，并不满足方程组。
