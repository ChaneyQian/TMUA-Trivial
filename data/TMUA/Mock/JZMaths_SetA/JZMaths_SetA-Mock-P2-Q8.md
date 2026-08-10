---
database: TMUA
qid: 20132101205208
id: JZMaths_SetA-Mock-P2-Q8
paper: TMUA Mock
year:
number: Q8
section: Multiple Choice
difficulty: 7
topics: [Sequences and Series, Algebra (Basic)]
subtopics: [Recurrence Relations, Sequences and Series, Algebra Manipulation]
tags: [Sequences and Series]
status: 已入库
---

## 题目
A sequence is defined by $a_1 = 1$ and
$$ a_{n+1} = \frac{a_n}{1+a_n} $$
for $n \ge 1$. Find the value of
$$ \sum_{n=1}^{\infty} a_n a_{n+1}. $$
$$ \mathbf{A} \quad 0 $$
$$ \mathbf{B} \quad 1 $$
$$ \mathbf{C} \quad 2 $$
$$ \mathbf{D} \quad 4 $$
$$ \mathbf{E} \quad \frac{5}{2} $$
$$ \mathbf{F} \quad \frac{3}{2} $$
$$ \mathbf{G} \quad \infty $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Take reciprocals of the recurrence: from $a_{n+1} = \frac{a_n}{1+a_n}$ we get
$$ \frac{1}{a_{n+1}} = \frac{1+a_n}{a_n} = \frac{1}{a_n} + 1. $$

Think of $\frac{1}{a_n}$ as $b_n$, then $b_{n+1} = b_n + 1$ is an arithmetic sequence, and $b_1 = 1$. Therefore $b_n = n$, and $a_n = \frac{1}{n}$.

**Remark 1:** You could also manually find the first a few terms of $a_n$ to guess that $a_n = \frac{1}{n}$.
