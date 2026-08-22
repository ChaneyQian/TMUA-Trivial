---
database: TMUA
qid: 20132101213220
id: BeyondHorizonS3-Mock-P2-Q20
paper: TMUA Mock
year:
number: Q20
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Consider the triangular array of numbers with $0, 1, 2, 3, \ldots$ along the sides and interior numbers obtained by adding the two adjacent numbers in the previous row. Rows 1 through 6 are shown:
$$\begin{array}{ccccccccccc}
 & & & & & 0 & & & & & \\
 & & & & 1 & & 1 & & & & \\
 & & & 2 & & 2 & & 2 & & & \\
 & & 3 & & 4 & & 4 & & 3 & & \\
 & 4 & & 7 & & 8 & & 7 & & 4 & \\
5 & & 11 & & 15 & & 15 & & 11 & & 5
\end{array}$$
Let $f(n)$ denote the sum of the numbers in row $n$. What is the remainder when $f(100)$ is divided by 100?
$$\mathbf{A} \quad 12$$
$$\mathbf{B} \quad 30$$
$$\mathbf{C} \quad 50$$
$$\mathbf{D} \quad 62$$
$$\mathbf{E} \quad 74$$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
First find a recurrence for the row sums. Row $n$ has $n$ entries: the two outer ones are both $n-1$, and each of the $n-2$ interior entries is the sum of two adjacent entries of row $n-1$. In that interior sum every entry of row $n-1$ is used twice except the two end entries of row $n-1$, each of which is used once. Since those ends are both $n-2$,
$$f(n) = 2(n-1) + \big(2f(n-1) - 2(n-2)\big) = 2f(n-1) + 2.$$
Checking against the picture: $f(1) = 0$, then $2, 6, 14, 30, 62$, which matches the rows shown.

Adding $2$ to both sides gives $f(n) + 2 = 2\big(f(n-1) + 2\big)$, so $f(n) + 2 = 2^{n-1}\big(f(1)+2\big) = 2^n$, that is
$$f(n) = 2^n - 2.$$

Now reduce $2^{100}$ modulo $100$ using the Chinese remainder theorem. Modulo $4$ we have $2^{100} \equiv 0$. Modulo $25$ the order of $2$ is $20$ and $100 = 20 \times 5$, so $2^{100} \equiv 1$. The number below $100$ that is $0$ modulo $4$ and $1$ modulo $25$ is $76$, so $2^{100} \equiv 76 \pmod{100}$ and
$$f(100) = 2^{100} - 2 \equiv 76 - 2 = 74 \pmod{100}.$$
The answer is E.
