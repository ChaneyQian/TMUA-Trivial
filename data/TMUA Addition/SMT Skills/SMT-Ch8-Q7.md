---
database: MAT
qid: 90020360700
id: SMT-Ch8-Q7
paper: SMT Skills Ch8
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
A sequence $a_n$ has the property that
$a_{n+1} = 2r a_n$
for $n \ge 2$ where $r$ is a constant.
Given that the first term $a_1 = 2$, what is the **product** of the first 20 terms of the sequence?

(a) $2^{200}r^{190}$
(b) $2^{20}(2r)^{190}$
(c) $(2r)^{210}$
(d) $(2r)^{190}$
(e) $2r^{190}$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 8 章 Sequences and series 章末 MAT style 第 7 题；解析为书后官方 worked solution。

## 答案
B

## 解析
The recurrence $a_{n+1} = 2ra_n$ says the sequence is geometric with common ratio $2r$, so with $a_1 = 2$,

$$a_n = 2(2r)^{\,n-1}.$$

Multiplying the first $20$ of these, the factors of $2$ contribute $2^{20}$ and the powers of $2r$ contribute the sum $0 + 1 + 2 + \dots + 19$:

$$\begin{aligned}
\prod_{n=1}^{20} a_n &= \prod_{n=1}^{20} 2(2r)^{\,n-1} \
&= 2^{20}\,(2r)^{\,0+1+2+\dots+19} \
&= 2^{20}\,(2r)^{\frac{19 \times 20}{2}} = 2^{20}(2r)^{190}.
\end{aligned}$$

The correct answer is (b).

Option (a) is not the same thing: $2^{20}(2r)^{190} = 2^{210}r^{190}$, not $2^{200}r^{190}$.
Option (d) forgets the $2^{20}$ from the first factors altogether, and option (c) uses $\sum_{n=1}^{20} n = 210$ in place of $\sum_{n=1}^{20}(n-1) = 190$.

> ⚠️ **原书疑似有错** —— 原书 Ch08 分册 p35 写 “for $n \ge 2$”，字面上只约束了 $a_3$ 起的各项，$a_2$ 完全自由，整个乘积因而无法确定，题目将无解。
> 应为 $n \ge 1$：只有这样五个选项才都成为 $a_1 = 2$、公比 $2r$ 的等比数列的候选答案，其中 (b) $= 2^{20}(2r)^{190}$ 正是正确值。本解按 $n \ge 1$ 处理。
