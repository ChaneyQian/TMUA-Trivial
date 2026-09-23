---
database: MAT
qid: 90020361000
id: SMT-Ch8-Q10
paper: SMT Skills Ch8
year:
number: Q10
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
The sum of the first $2n$ terms of the sequence
$1, 64, 2, 32, 4, 16, 8, 8, 16, 4, \dots$
is

(a) $2^n(1 + 2^{7-n})$
(b) $2^7 - 2^{7-n}$
(c) $2^9 - 2^{9-n}$
(d) $2^n - 2^{7-n} + 127$
(e) $2^n - 2^{9-n} + 511$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 8 章 Sequences and series 章末 MAT style 第 10 题；解析为书后官方 worked solution。

## 答案
D

## 解析
Separate the two interleaved progressions. The terms in odd positions are $1, 2, 4, 8, \dots$, so the $k^{\text{th}}$ of them is $2^{\,k-1}$; the terms in even positions are $64, 32, 16, 8, \dots$, so the $k^{\text{th}}$ of them is $2^{\,7-k}$.

The first $2n$ terms consist of the first $n$ of each, so their sum is

$$\begin{aligned}
S_{2n} &= \left(1 + 2 + 4 + \dots + 2^{\,n-1}\right) + \left(2^6 + 2^5 + \dots + 2^{\,7-n}\right) \
&= \frac{1\left(2^n - 1\right)}{2 - 1} + \frac{2^6\left(1 - \left(\frac{1}{2}\right)^n\right)}{1 - \frac{1}{2}} \
&= \left(2^n - 1\right) + \left(2^7 - 2^{\,7-n}\right) \
&= 2^n - 2^{\,7-n} + 127.
\end{aligned}$$

Checking against $n = 1$: the first two terms are $1 + 64 = 65$, and $2^1 - 2^6 + 127 = 2 - 64 + 127 = 65$.

The correct answer is (d).

Option (b) is only the even-position part of the sum, and option (a) would require the two geometric series to have the same number of terms *and* the same first term, which they do not.
