---
database: TMUA
qid: 20132101203110
id: Yotta-Mock-P1-Q10
paper: TMUA Mock
year:
number: Q10
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
A fair coin is flipped repeatedly until 4 consecutive heads are obtained. Find the expected number of coin flips.

$$
\mathbf{A} \quad 4
$$

$$
\mathbf{B} \quad 14
$$

$$
\mathbf{C} \quad 16
$$

$$
\mathbf{D} \quad 30
$$

$$
\mathbf{E} \quad \frac{196}{5}
$$

$$
\mathbf{F} \quad \frac{288}{7}
$$

$$
\mathbf{G} \quad 62
$$

$$
\mathbf{H} \quad 64
$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Let $E_{j}$ be the expected number of further flips needed when $j$ consecutive heads have just been obtained, so the answer is $E_{0}$. From a run of $j < 4$, one more flip gives a head (probability $\frac12$, moving to state $j+1$) or a tail (probability $\frac12$, back to state $0$):

$$ E_{j} = 1 + \tfrac{1}{2}E_{j+1} + \tfrac{1}{2}E_{0}, \qquad E_{4} = 0 $$

Solving downwards from $E_{4} = 0$ gives $E_{0} = 2 + 4 + 8 + 16 = 30$; in general the expected wait for $n$ consecutive heads with a fair coin is

$$ 2^{1} + 2^{2} + \cdots + 2^{n} = 2^{n+1} - 2 $$

which for $n = 4$ is $2^{5} - 2 = 30$. The answer is D.
