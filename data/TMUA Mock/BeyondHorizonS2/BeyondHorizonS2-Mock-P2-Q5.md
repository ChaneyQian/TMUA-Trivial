---
database: TMUA
qid: 20132101212205
id: BeyondHorizonS2-Mock-P2-Q5
paper: TMUA Mock
year:
number: Q5
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Every integer of the form $(n^3 - n)(n - 2)$, for $n = 3, 4, \ldots$, is
$$\mathbf{A} \quad \text{divisible by 6 but not always divisible by 12}$$
$$\mathbf{B} \quad \text{divisible by 12 but not always divisible by 24}$$
$$\mathbf{C} \quad \text{divisible by 24 but not always divisible by 48}$$
$$\mathbf{D} \quad \text{divisible by 9}$$
$$\mathbf{E} \quad \text{divisible by 48 but not always divisible by 96}$$
$$\mathbf{F} \quad \text{divisible by 5}$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Factorising, $(n^3 - n)(n - 2) = n(n - 1)(n + 1)(n - 2) = (n - 2)(n - 1)n(n + 1)$, which is a product of four consecutive integers. Any such product is divisible by $4! = 24$, because among four consecutive integers one is a multiple of $4$, another is an even number not divisible by $4$ contributing a further factor of $2$, and one is a multiple of $3$. Divisibility by $48$ can fail: at $n = 3$ the product is $1 \cdot 2 \cdot 3 \cdot 4 = 24$, which is not a multiple of $48$. That same example also rules out E, and $24$ is divisible by neither $9$ nor $5$, ruling out D and F; A and B are true but strictly weaker than C. The answer is C.
