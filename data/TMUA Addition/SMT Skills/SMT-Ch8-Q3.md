---
database: TMUA
qid: 90020260300
id: SMT-Ch8-Q3
paper: SMT Skills Ch8
year:
number: Q3
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
$S$ is a geometric sequence with a common ratio $r$ where $r > 1$.
The sum of the first 8 terms of $S$ is equal to four times the sum of the first 4 terms of $S$.
The common ratio of $S$ is

$$\mathbf{A} \quad 3^{1/2}$$

$$\mathbf{B} \quad 2^{1/2}$$

$$\mathbf{C} \quad 2^{1/3}$$

$$\mathbf{D} \quad 3^{1/4}$$

$$\mathbf{E} \quad 3^{1/8}$$

$$\mathbf{F} \quad 2^{1/8}$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 8 章 Sequences and series 章末 TMUA style 第 3 题；解析为书后官方 worked solution。

## 答案
D

## 解析
Let the first term be $a$. Since $r > 1$, in particular $r \neq 1$, the sum of the first $n$ terms is $\frac{a(r^n - 1)}{r - 1}$, so the condition $S_8 = 4S_4$ becomes

$$\begin{aligned}
\frac{a\left(r^8 - 1\right)}{r-1} &= 4 \times \frac{a\left(r^4 - 1\right)}{r-1} \
r^8 - 1 &= 4\left(r^4 - 1\right) \
\left(r^4 - 1\right)\left(r^4 + 1\right) &= 4\left(r^4 - 1\right).
\end{aligned}$$

Because $r > 1$, $r^4 - 1 \neq 0$ and it may be cancelled, giving $r^4 + 1 = 4$, so $r^4 = 3$ and $r = 3^{1/4}$.

The correct answer is (D).

The tempting slip is to cancel $r^4 - 1$ carelessly and read off $r^4 = 4$, giving $r = 2^{1/2}$, which is option B.
