---
database: TMUA
qid: 90020260200
id: SMT-Ch8-Q2
paper: SMT Skills Ch8
year:
number: Q2
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
The sequence $t_n$ is given by:
$$ t_1 = 1000 $$
$$ t_{n+1} = 1000\sqrt[3]{t_n} $$
As $n \to \infty$, the value of $t_n$ tends to

$$\mathbf{A} \quad 10^{2/9}$$

$$\mathbf{B} \quad 10^{2/3}$$

$$\mathbf{C} \quad 0$$

$$\mathbf{D} \quad 1000$$

$$\mathbf{E} \quad 10^{9/2}$$

$$\mathbf{F} \quad 10^{3/2}$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 8 章 Sequences and series 章末 TMUA style 第 2 题；解析为书后官方 worked solution。

## 答案
E

## 解析
From Question 1, $c_n = \frac{9}{2} - \frac{3}{2}\left(\frac{1}{3}\right)^{n-1}$. As $n \to \infty$ the term $\left(\frac{1}{3}\right)^{n-1} \to 0$, so $c_n \to \frac{9}{2}$ and

$$t_n = 10^{c_n} \longrightarrow 10^{9/2}.$$

The staircase diagram below shows the same thing without any algebra: the terms $c_1 = 3$, $c_2 = 4$, $c_3 = \frac{13}{3}$, …
climb the line $c_{n+1} = 3 + \frac{c_n}{3}$ towards its intersection with $c_{n+1} = c_n$, which is at $c = \frac{9}{2}$.

![[Image/SMT-Ch8-Q2-sol1.png]]

The correct answer is (E).

Option D, $1000$, is the value the sequence starts from, not the value it tends to; the sequence is increasing, so its limit must exceed $1000$.
