---
database: TMUA
qid: 20132101213101
id: BeyondHorizonS3-Mock-P1-Q1
paper: TMUA Mock
year:
number: Q1
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Consider the inequality $\sqrt{x+3} - \sqrt{x-1} \geq 1$. Find the range of $x$ that satisfies this inequality.
$$\mathbf{A} \quad [-2, 3.25]$$
$$\mathbf{B} \quad [-1, 2.5]$$
$$\mathbf{C} \quad [1, 3]$$
$$\mathbf{D} \quad [2, 3.5]$$
$$\mathbf{E} \quad [-1, 2]$$
$$\mathbf{F} \quad [0, 3]$$
$$\mathbf{G} \quad [1, 3.25]$$

## 备注

### 我的备注

### AI备注


## 答案
G

## 解析
Both surds must be real, so the domain is already restricted to $x \geq 1$; any option whose left endpoint is below $1$ is therefore dead on arrival. On that domain both sides of $\sqrt{x+3} \geq 1 + \sqrt{x-1}$ are non-negative, so squaring is reversible and gives $x+3 \geq 1 + 2\sqrt{x-1} + x - 1$, i.e. $3 \geq 2\sqrt{x-1}$. Squaring once more (again both sides non-negative) yields $9 \geq 4(x-1)$, so $x \leq 3.25$. Combining with the domain gives $1 \leq x \leq 3.25$. A useful sanity check is that $\sqrt{x+3} - \sqrt{x-1} = \frac{4}{\sqrt{x+3}+\sqrt{x-1}}$ is strictly decreasing, so the solution set really is an interval running from the left end of the domain up to the single crossing point, and at $x = 3.25$ we get $\sqrt{6.25} - \sqrt{2.25} = 2.5 - 1.5 = 1$ exactly. The answer is G. Option C is the trap for anyone who squares carelessly and lands on $x \leq 3$, and options A, B, E and F all ignore the domain restriction $x \geq 1$.
