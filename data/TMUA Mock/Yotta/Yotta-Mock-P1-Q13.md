---
database: TMUA
qid: 20132101203113
id: Yotta-Mock-P1-Q13
paper: TMUA Mock
year:
number: Q13
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Find the sum of the reciprocals of all of the factors of 1600.

$$
\mathbf{A} \quad \frac{1}{3937}
$$

$$
\mathbf{B} \quad \frac{1600}{3937}
$$

$$
\mathbf{C} \quad \frac{3937}{1600}
$$

$$
\mathbf{D} \quad \frac{378}{1600}
$$

$$
\mathbf{E} \quad \frac{1600}{378}
$$

$$
\mathbf{F} \quad \frac{1}{378}
$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
If the divisors of $N$ are $d_{1}, \dots, d_{m}$, then dividing each into $N$ permutes the list, so $\frac{N}{d_{i}}$ runs over the same divisors. Hence

$$ \sum_{i} \frac{1}{d_{i}} = \frac{1}{N}\sum_{i} \frac{N}{d_{i}} = \frac{\sigma(N)}{N} $$

where $\sigma(N)$ is the sum of the divisors. Here $1600 = 2^{6} \times 5^{2}$, so

$$ \sigma(1600) = (1 + 2 + 4 + 8 + 16 + 32 + 64)(1 + 5 + 25) = 127 \times 31 = 3937 $$

and the sum of the reciprocals is $\frac{3937}{1600}$. The answer is C.
