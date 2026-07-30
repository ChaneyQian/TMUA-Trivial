---
database: TMUA
qid: 20132101209109
id: JZMaths_SetE-Mock-P1-Q9
paper: TMUA Mock
year:
number: Q9
section: Multiple Choice
difficulty: 6.5
topics: []
subtopics: []
tags: [Sequences and Series]
status: 已入库
---

## 题目
The sequence $u_n$ is defined by $u_n = \frac{n}{2^{n-1}}$ for $n \ge 1$. For a positive integer $n$, let
$$ S_n = \sum_{k=1}^n u_k. $$

Which of the following is an expression for $S_n$?

$$ \mathbf{A} \quad 3 - \frac{4}{2^n} $$
$$ \mathbf{B} \quad 2 + \frac{n - 2}{2^{n-1}} $$
$$ \mathbf{C} \quad 4 - \frac{n^2 - 2n + 4}{2^{n-1}} $$
$$ \mathbf{D} \quad 4 - \frac{n + 2}{2^{n-1}} $$
$$ \mathbf{E} \quad 2 - \frac{n + 2}{2^n} $$
$$ \mathbf{F} \quad 4 - \frac{n}{2^{n-1}} $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Remark: This solution adapts the standard method for summing a geometric series: multiply the sum by the common ratio, then subtract the two expressions. Many similar problems are solved this way.

Write $S_n = \sum_{k=1}^n \frac{k}{2^{k-1}}$, so
$$ S_n = 1 + \frac{2}{2} + \frac{3}{2^2} + \cdots + \frac{n}{2^{n-1}}. $$

Halving each term gives
$$ \frac{1}{2}S_n = \frac{1}{2} + \frac{2}{2^2} + \cdots + \frac{n-1}{2^{n-1}} + \frac{n}{2^n}. $$

Subtracting, every numerator drops by 1 apart from a leftover $\frac{n}{2^n}$:
$$ \frac{1}{2}S_n = 1 + \frac{1}{2} + \frac{1}{2^2} + \cdots + \frac{1}{2^{n-1}} - \frac{n}{2^n}. $$

The first $n$ terms form a geometric series with sum $2 - 2^{1-n}$ and therefore
$$ \frac{1}{2}S_n = 2 - 2^{1-n} - \frac{n}{2^n}. $$

Doubling,
$$ S_n = 4 - 2^{2-n} - \frac{n}{2^{n-1}} = 4 - \frac{n + 2}{2^{n-1}}. $$
