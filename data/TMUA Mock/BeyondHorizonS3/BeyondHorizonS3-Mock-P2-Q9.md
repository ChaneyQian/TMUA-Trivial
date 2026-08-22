---
database: TMUA
qid: 20132101213209
id: BeyondHorizonS3-Mock-P2-Q9
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
When $n$ standard 6-sided dice are rolled, the probability of obtaining a sum of $1994$ is greater than zero and is the same as the probability of obtaining a sum of $S$. The smallest possible value of $S$ is
$$\mathbf{A} \quad 333$$
$$\mathbf{B} \quad 335$$
$$\mathbf{C} \quad 337$$
$$\mathbf{D} \quad 339$$
$$\mathbf{E} \quad 341$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
The key fact is the symmetry of the distribution of the sum of $n$ dice. Replacing each die score $x_i$ by $7 - x_i$ is a bijection of outcomes, and it sends a total of $T$ to a total of $7n - T$. Hence
$$P(\text{sum} = T) = P(\text{sum} = 7n - T)$$
for every $T$, so we may take $S = 7n - 1994$.

For the sum $1994$ to be attainable at all we need $n \leq 1994 \leq 6n$, so $n \geq 1994/6 = 332.33\ldots$, giving $n \geq 333$. Since $S = 7n - 1994$ increases with $n$, the smallest $S$ comes from the smallest admissible $n$, namely $n = 333$, and then
$$S = 7 \times 333 - 1994 = 2331 - 1994 = 337.$$
This is consistent: with $333$ dice the possible totals run from $333$ to $1998$, so both $1994$ and $337$ lie in range. The answer is C.
