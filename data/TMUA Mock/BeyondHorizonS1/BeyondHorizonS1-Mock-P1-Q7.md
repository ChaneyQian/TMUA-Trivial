---
database: TMUA
qid: 20132101211107
id: BeyondHorizonS1-Mock-P1-Q7
paper: TMUA Mock
year:
number: Q7
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The number of polynomials of the form $x^3 + ax^2 + bx + c$ which are divisible by $x^2 + 1$ and where $a$, $b$, and $c$ belong to $\{1, 2, \ldots, 10\}$, is
$$\mathbf{A} \quad 1$$
$$\mathbf{B} \quad 10$$
$$\mathbf{C} \quad 11$$
$$\mathbf{D} \quad 12$$
$$\mathbf{E} \quad 100$$
$$\mathbf{F} \quad 101$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
If $x^2+1$ divides the monic cubic, the quotient must be a monic linear factor $x + k$, so
$$x^3 + ax^2 + bx + c = (x^2+1)(x+k) = x^3 + kx^2 + x + k$$
Comparing coefficients gives $a = k$, $b = 1$ and $c = k$, so the polynomial is completely determined by the single value $a$, with $b = 1$ forced and $c = a$. Both $b = 1$ and $c = a$ lie in $\{1, \ldots, 10\}$ for every choice of $a$ in that set, so there are exactly $10$ such polynomials. The answer is B. Option E is the trap for anyone who thinks $a$ and $c$ can be chosen independently.
