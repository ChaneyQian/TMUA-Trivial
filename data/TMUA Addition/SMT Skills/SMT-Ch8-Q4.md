---
database: TMUA
qid: 90020260400
id: SMT-Ch8-Q4
paper: SMT Skills Ch8
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
An arithmetic sequence has first term $a$ and common difference $d$.
The sum of the first 100 terms is one hundred times the sum of the first 10 terms.
Which of the following describes the relationship between $a$ and $d$?

$$\mathbf{A} \quad a = 10d$$

$$\mathbf{B} \quad d = 10a$$

$$\mathbf{C} \quad a + d = 90$$

$$\mathbf{D} \quad a - d = 90$$

$$\mathbf{E} \quad a = 2d$$

$$\mathbf{F} \quad d = 2a$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 8 章 Sequences and series 章末 TMUA style 第 4 题；解析为书后官方 worked solution。

## 答案
F

## 解析
With $S_n = \frac{n}{2}\bigl(2a + (n-1)d\bigr)$,

$$\begin{aligned}
S_{100} &= 50(2a + 99d) = 100a + 4950d \
S_{10} &= 5(2a + 9d) = 10a + 45d.
\end{aligned}$$

The condition $S_{100} = 100\,S_{10}$ therefore reads

$$\begin{aligned}
100a + 4950d &= 100(10a + 45d) = 1000a + 4500d \
450d &= 900a \
d &= 2a.
\end{aligned}$$

The correct answer is (F).

Option E, $a = 2d$, is the same relation the wrong way round, and the numerical options C and D cannot be right because the condition is homogeneous in $a$ and $d$: scaling both by any constant preserves it.
