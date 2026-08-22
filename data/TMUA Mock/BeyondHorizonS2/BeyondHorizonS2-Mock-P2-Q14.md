---
database: TMUA
qid: 20132101212214
id: BeyondHorizonS2-Mock-P2-Q14
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
Let $\{a_k\}$ be a sequence of integers such that $a_1 = 1$ and $a_{m+n} = a_m + a_n + mn$, for all positive integers $m$ and $n$. Then $a_{12}$ is
$$\mathbf{A} \quad 45$$
$$\mathbf{B} \quad 56$$
$$\mathbf{C} \quad 67$$
$$\mathbf{D} \quad 78$$
$$\mathbf{E} \quad 89$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Taking $n = 1$ turns the functional equation into the recurrence $a_{m+1} = a_m + a_1 + m = a_m + m + 1$, so starting from $a_1 = 1$ the terms accumulate as $a_k = 1 + 2 + \cdots + k = \frac{k(k+1)}{2}$. This closed form does satisfy the original relation, since
$$a_m + a_n + mn = \frac{m^2 + m + n^2 + n}{2} + mn = \frac{(m+n)^2 + (m+n)}{2} = a_{m+n}.$$
Therefore $a_{12} = \frac{12 \times 13}{2} = 78$. The answer is D.
