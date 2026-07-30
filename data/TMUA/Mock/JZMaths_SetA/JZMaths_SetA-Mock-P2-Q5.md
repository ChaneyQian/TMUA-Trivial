---
database: TMUA
qid: 20132101205205
id: JZMaths_SetA-Mock-P2-Q5
paper: TMUA Mock
year:
number: Q5
section: Multiple Choice
difficulty: 6
topics: []
subtopics: []
tags: [Logic Deduction]
status: 已入库
---

## 题目
A student attempts to prove the following **claim:**

For every positive integer $n$, if $n^2 + 2$ is prime, then $n$ is a multiple of $3$.

The student's argument is given line by line below.

I. Suppose $n$ is a positive integer such that $n^2 + 2$ is prime, but $n$ is not a multiple of $3$.
II. Then the remainder of $n$ on division by $3$ is $1$ or $2$.
III. In either case, $n^2$ leaves remainder $1$ when divided by $3$.
IV. Therefore $n^2 + 2$ leaves remainder $0$ when divided by $3$.
V. So $3$ divides $n^2 + 2$.
VI. Hence $n^2 + 2 = 3k$ for some integer $k$.
VII. It follows that $n^2 + 2$ is composite and not prime.
VIII. This contradicts the assumption in (I) that $n^2 + 2$ is prime.
IX. Therefore $n$ is a multiple of $3$.

Which one of the following statements about the argument is correct?

$$ \mathbf{A} \quad \text{The argument is completely correct.} $$
$$ \mathbf{B} \quad \text{The first error in the argument is on line I.} $$
$$ \mathbf{C} \quad \text{The first error in the argument is on line II.} $$
$$ \mathbf{D} \quad \text{The first error in the argument is on line III.} $$
$$ \mathbf{E} \quad \text{The first error in the argument is on line IV.} $$
$$ \mathbf{F} \quad \text{The first error in the argument is on line V.} $$
$$ \mathbf{G} \quad \text{The first error in the argument is on line VI.} $$
$$ \mathbf{H} \quad \text{The first error in the argument is on line VII.} $$
$$ \mathbf{I} \quad \text{The first error in the argument is on line VIII.} $$
$$ \mathbf{J} \quad \text{The first error in the argument is on line IX.} $$

## 备注

### 我的备注

### AI备注


## 答案
H

## 解析
Lines I to VI are correct. In particular, if $n$ is not a multiple of $3$, then $n^2$ has remainder $1$ modulo $3$, so $3$ divides $n^2+2$.

The first error is line VII: a number of the form $3k$ need not be composite when $k=1$, because $3$ is prime. Indeed, $n=1$ gives $n^2+2=3$, so the answer is H.
