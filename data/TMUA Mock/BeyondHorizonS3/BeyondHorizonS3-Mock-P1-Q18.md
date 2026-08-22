---
database: TMUA
qid: 20132101213118
id: BeyondHorizonS3-Mock-P1-Q18
paper: TMUA Mock
year:
number: Q18
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Let $\{F_n\}$ be the sequence of numbers defined by $F_1 = 1 = F_2$; $F_{n+1} = F_n + F_{n-1}$ for $n \geq 2$. Let $f_n$ be the remainder left when $F_n$ is divided by $5$. Then $f_{2000}$ equals
$$\mathbf{A} \quad 0$$
$$\mathbf{B} \quad 1$$
$$\mathbf{C} \quad 2$$
$$\mathbf{D} \quad 3$$
$$\mathbf{E} \quad 4$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Reducing the Fibonacci recurrence modulo $5$ produces a sequence determined entirely by the pair of previous residues, so it must eventually repeat, and since the recurrence is reversible the repetition is purely periodic. Running the residues out gives $1, 1, 2, 3, 0, 3, 3, 1, 4, 0, 4, 4, 3, 2, 0, 2, 2, 4, 1, 0$ and then $1, 1$ again, so the period is $20$. Because $2000$ is a multiple of $20$, $f_{2000} = f_{20} = 0$; equivalently $F_{20} = 6765 = 5 \times 1353$. The pattern visible above is the familiar fact that $5$ divides $F_n$ exactly when $5$ divides $n$. The answer is A. Option B is the trap for anyone who mistakenly aligns the period with $f_1 = 1$ rather than with the zero at index $20$.
