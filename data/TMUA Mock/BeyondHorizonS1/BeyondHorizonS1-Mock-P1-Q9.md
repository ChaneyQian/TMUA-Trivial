---
database: TMUA
qid: 20132101211109
id: BeyondHorizonS1-Mock-P1-Q9
paper: TMUA Mock
year:
number: Q9
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Suppose that $F(n+1) = \frac{2F(n)+1}{2}$ for $n = 1, 2, 3, \ldots$ and $F(1) = 2$. Then $F(101)$ equals
$$\mathbf{A} \quad 50$$
$$\mathbf{B} \quad 52$$
$$\mathbf{C} \quad 54$$
$$\mathbf{D} \quad 56$$
$$\mathbf{E} \quad 58$$
$$\mathbf{F} \quad \text{None of the above}$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Dividing through, the recurrence is simply
$$F(n+1) = F(n) + \frac{1}{2}$$
so the sequence is arithmetic with common difference $\tfrac12$. Starting from $F(1) = 2$ and taking $100$ steps to reach $n = 101$ gives
$$F(101) = 2 + 100 \times \frac{1}{2} = 52$$
The answer is B. The trap is to take $101$ steps instead of $100$, which gives $52.5$ and pushes a careless candidate towards option F.
