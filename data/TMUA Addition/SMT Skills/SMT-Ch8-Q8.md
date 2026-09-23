---
database: MAT
qid: 90020360800
id: SMT-Ch8-Q8
paper: SMT Skills Ch8
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
For a real number $x$ we denote by $\lfloor x \rfloor$ the largest integer less than or equal to $x$.
A sequence $a_n$ is defined by $a_n = \left\lfloor \sqrt{2n} + \frac{1}{2} \right\rfloor$
The sum of the first 45 terms is

(a) 285
(b) 420
(c) 855
(d) 1125
(e) 2125

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 8 章 Sequences and series 章末 MAT style 第 8 题；解析为书后官方 worked solution。

## 答案
A

## 解析
Ask when $a_n$ takes a given value $k$. Since $\lfloor x \rfloor = k$ means $k \le x < k+1$,

$$a_n = k \iff k \le \sqrt{2n} + \frac{1}{2} < k+1 \iff k - \frac{1}{2} \le \sqrt{2n} < k + \frac{1}{2} \iff \frac{(2k-1)^2}{8} \le n < \frac{(2k+1)^2}{8}.$$

The length of that interval is $\frac{(2k+1)^2 - (2k-1)^2}{8} = \frac{8k}{8} = k$, and neither endpoint is an integer because $(2k \pm 1)^2$ is odd. So the value $k$ is taken by exactly $k$ terms.

![[Image/SMT-Ch8-Q8-sol1.png]]

The blocks of equal terms have lengths $1, 2, 3, \dots$, and $1 + 2 + \dots + 9 = 45$, so the first $45$ terms are exactly the blocks for $k = 1$ up to $k = 9$ and nothing more. Their sum is

$$\sum_{k=1}^{9} k \times k = \sum_{k=1}^{9} k^2 = \frac{9 \times 10 \times 19}{6} = 285.$$

The correct answer is (a).

Option (c), $855 = 3 \times 285$, and option (d) come from summing $45$ copies of an "average" term rather than counting how many times each value occurs.
