---
database: TMUA
qid: 20132101213212
id: BeyondHorizonS3-Mock-P2-Q12
paper: TMUA Mock
year:
number: Q12
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Let $l, m, n$ be any three positive integers such that $l^2 + m^2 = n^2$. Then,
$$\mathbf{A} \quad \text{3 always divides } mn$$
$$\mathbf{B} \quad \text{3 always divides } lm$$
$$\mathbf{C} \quad \text{3 always divides } ln$$
$$\mathbf{D} \quad \text{3 does not divide } lmn$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Work modulo $3$. A square is congruent to $0$ or $1$ modulo $3$, because $0^2 \equiv 0$, $1^2 \equiv 1$ and $2^2 = 4 \equiv 1$.

Suppose neither $l$ nor $m$ were divisible by $3$. Then $l^2 \equiv 1$ and $m^2 \equiv 1$, so
$$n^2 = l^2 + m^2 \equiv 2 \pmod 3,$$
which is impossible since a square is never $2$ modulo $3$. Hence at least one of $l$ and $m$ is divisible by $3$, and therefore $3 \mid lm$ always. This is option B.

The other options fail on explicit triples. Taking $(l,m,n) = (3,4,5)$ gives $mn = 20$, not a multiple of $3$, so A fails; taking $(l,m,n) = (4,3,5)$ gives $ln = 20$, not a multiple of $3$, so C fails; and the same triple has $lmn = 60$, which is a multiple of $3$, so D fails. The answer is B.
