---
database: TMUA
qid: 20132101205219
id: JZMaths_SetA-Mock-P2-Q19
paper: TMUA Mock
year:
number: Q19
section: Multiple Choice
difficulty: 8.5
topics: [Sequences and Series, Function]
subtopics: [Sequences and Series, "Floor, Ceiling and Fractional Part Functions"]
tags:
  - Integration
  - Sequences and Series
status: 已入库
---

## 题目
Let $\lceil x \rceil$ denote the smallest integer that is greater than or equal to $x$. Compute
$$ \int_0^{20} \lceil x \rceil \cdot 2^{\lceil x \rceil} \, dx. $$
$$ \mathbf{A} \quad 20 \cdot 2^{21} $$
$$ \mathbf{B} \quad 19 \cdot 2^{21} $$
$$ \mathbf{C} \quad 18 \cdot 2^{20} + 2 $$
$$ \mathbf{D} \quad 19 \cdot 2^{21} + 2 $$
$$ \mathbf{E} \quad 19 \cdot 2^{20} + 2 $$
$$ \mathbf{F} \quad 20 \cdot 2^{20} + 2 $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
On the interval $(k - 1, k]$ we have $\lceil x \rceil = k$, so the integrand equals $k \cdot 2^k$ on each unit interval. Hence
$$ \int_0^{20} \lceil x \rceil \cdot 2^{\lceil x \rceil} \, dx = \sum_{k=1}^{20} k \cdot 2^k. $$
To evaluate $S = \sum_{k=1}^{20} k \cdot 2^k$, use the standard trick of subtracting a shifted copy:
$$ 2S = \sum_{k=1}^{20} k \cdot 2^{k+1} = \sum_{j=2}^{21} (j - 1) \cdot 2^j. $$
Then
$$ S = 2S - S = - \sum_{j=2}^{20} 2^j + 20 \cdot 2^{21} - 1 \cdot 2^1. $$
The geometric sum is $\sum_{j=2}^{20} 2^j = 2^{21} - 4$, so
$$ S = -(2^{21} - 4) + 20 \cdot 2^{21} - 2 = 19 \cdot 2^{21} + 2. $$
