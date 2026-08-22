---
database: TMUA
qid: 20132101215108
id: BeyondHorizonSpec-Mock-P1-Q8
paper: TMUA Mock
year:
number: Q8
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Find the minimum value of the following function:
$$f(x) = \frac{1}{4 \cdot 7^x - 7 - 7^{2x}}$$
$$\mathbf{A} \quad \frac{-1}{14}$$
$$\mathbf{B} \quad \frac{1}{10}$$
$$\mathbf{C} \quad \frac{-1}{7}$$
$$\mathbf{D} \quad \frac{1}{5}$$
$$\mathbf{E} \quad \frac{-1}{3}$$
$$\mathbf{F} \quad \frac{1}{2}$$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
Substitute $t = 7^x$, which ranges over all of $t > 0$ as $x$ ranges over the reals, and note that $7^{2x} = t^2$. The denominator becomes
$$g(t) = -t^2 + 4t - 7 = -\left((t-2)^2 + 3\right),$$
so $g(t) \leq -3$ for every $t$, with equality exactly at $t = 2$, that is at $x = \log_7 2$. Thus $g$ takes every value in $(-\infty, -3]$ and is never zero, so $f = \frac{1}{g}$ takes every value in $\left[-\frac{1}{3}, 0\right)$. The smallest such value is $-\frac{1}{3}$, attained when the denominator is at its largest, namely $-3$. The answer is E.
