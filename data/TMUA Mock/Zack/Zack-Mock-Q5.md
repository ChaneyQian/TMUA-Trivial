---
database: TMUA
qid: 20132101204005
id: Zack-Mock-Q5
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
How many four-digit square numbers are multiples of 3, 4 and 5?

$$
\mathbf{A} \quad 0
$$

$$
\mathbf{B} \quad 1
$$

$$
\mathbf{C} \quad 2
$$

$$
\mathbf{D} \quad 3
$$

$$
\mathbf{E} \quad 4
$$

$$
\mathbf{F} \quad 5
$$

$$
\mathbf{G} \quad 6
$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
A multiple of $3$, $4$ and $5$ is a multiple of $\operatorname{lcm}(3,4,5) = 60$. If $n^{2}$ is divisible by $60 = 2^{2}\cdot3\cdot5$ then, since $3$ and $5$ appear to the first power, $n$ itself must be divisible by $3$ and by $5$; and $4 \mid n^{2}$ needs $2 \mid n$. So $30 \mid n$.

Write $n = 30m$, giving $n^{2} = 900m^{2}$. For a four-digit square,

$$ 1000 \leq 900m^{2} \leq 9999 \implies 1.11 \leq m^{2} \leq 11.1 $$

so $m = 2$ or $m = 3$, giving $n^{2} = 3600$ and $8100$.

That is $2$ such squares, so the answer is C.
