---
database: TMUA
qid: 20132101213119
id: BeyondHorizonS3-Mock-P1-Q19
paper: TMUA Mock
year:
number: Q19
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
What is the value of the expression
$$1 + \frac{1}{2}\binom{n}{1} + \frac{1}{3}\binom{n}{2} + \cdots + \frac{1}{n+1}\binom{n}{n}$$
$$\mathbf{A} \quad \frac{2^{n+1}-1}{n+1}$$
$$\mathbf{B} \quad \frac{2(2^{n}-1)}{n+1}$$
$$\mathbf{C} \quad \frac{2^{n}-1}{n}$$
$$\mathbf{D} \quad \frac{2(2^{n+1}-1)}{n+1}$$
$$\mathbf{E} \quad \frac{2^{n+2}-1}{n+2}$$
$$\mathbf{F} \quad \frac{2(2^{n}-1)}{n}$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
The sum is $\sum_{r=0}^{n} \frac{1}{r+1}\binom{n}{r}$, and the key is the absorption identity $\frac{1}{r+1}\binom{n}{r} = \frac{1}{n+1}\binom{n+1}{r+1}$, which follows immediately from writing both sides in factorials. Hence the sum equals $\frac{1}{n+1}\sum_{r=0}^{n}\binom{n+1}{r+1} = \frac{1}{n+1}\sum_{s=1}^{n+1}\binom{n+1}{s} = \frac{2^{n+1}-1}{n+1}$, the $-1$ accounting for the missing $s = 0$ term. Equivalently, $\sum_r \frac{1}{r+1}\binom{n}{r} = \int_0^1 (1+t)^n\,dt = \frac{2^{n+1}-1}{n+1}$. Testing $n = 1$ gives $1 + \frac{1}{2} = \frac{3}{2}$, matching $\frac{2^2-1}{2}$. The answer is A. Option B is the trap for anyone who writes $2^{n+1}$ as $2\cdot 2^n$ but then subtracts the $1$ inside the bracket, producing $\frac{2^{n+1}-2}{n+1}$ instead.
