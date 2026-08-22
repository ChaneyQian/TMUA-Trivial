---
database: TMUA
qid: 20132101211114
id: BeyondHorizonS1-Mock-P1-Q14
paper: TMUA Mock
year:
number: Q14
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The $m$th term of an arithmetic progression is $x$ and the $n$th term is $y$. What is the sum of the first $(m+n)$ terms?
$$\mathbf{A} \quad \frac{m+n}{2}\left[ (x+y) + \frac{x-y}{m-n} \right]$$
$$\mathbf{B} \quad \frac{m+n}{2}\left[ (x-y) + \frac{x+y}{m-n} \right]$$
$$\mathbf{C} \quad \frac{1}{2}\left[ \frac{x+y}{m+n} + \frac{x-y}{m-n} \right]$$
$$\mathbf{D} \quad \frac{1}{2}\left[ \frac{x+y}{m+n} - \frac{x-y}{m-n} \right]$$
$$\mathbf{E} \quad \frac{m-n}{2}\left[ (x-y) + \frac{x+y}{m-n} \right]$$
$$\mathbf{F} \quad \frac{m+n}{2}\left[ (x+y) + \frac{x+y}{m-n} \right]$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Let the first term be $A$ and the common difference be $d$. From $A + (m-1)d = x$ and $A + (n-1)d = y$, subtracting gives $d = \frac{x-y}{m-n}$, while adding gives $2A + (m+n-2)d = x+y$. The sum of the first $m+n$ terms is
$$S_{m+n} = \frac{m+n}{2}\left[ 2A + (m+n-1)d \right] = \frac{m+n}{2}\left[ \left( 2A + (m+n-2)d \right) + d \right]$$
and substituting the two results above turns this into
$$S_{m+n} = \frac{m+n}{2}\left[ (x+y) + \frac{x-y}{m-n} \right]$$
A numerical check confirms it: for the progression $1, 3, 5, 7, \ldots$ with $m = 2$, $n = 4$ we have $x = 3$, $y = 7$ and $S_6 = 36$, and the formula gives $3\left[10 + \frac{-4}{-2}\right] = 36$. The answer is A. Option F, which swaps the numerator of the correction term, fails this check.
