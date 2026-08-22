---
database: TMUA
qid: 20132101203202
id: Yotta-Mock-P2-Q2
paper: TMUA Mock
year:
number: Q2
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Which of these statements is true for positive integers $n$:
1. $n$ is prime **if** $n = 6k + 1$ **or** $n = 6k - 1$ for some integer $k$
2. $n$ is prime **only if** $n = 6k + 1$ **or** $n = 6k - 1$ for some integer $k$

$$
\mathbf{A} \quad \text{Neither}
$$

$$
\mathbf{B} \quad \text{1 only}
$$

$$
\mathbf{C} \quad \text{2 only}
$$

$$
\mathbf{D} \quad \text{Both 1 and 2}
$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Read the connectives carefully: "$n$ is prime **if** $P$" means $P \implies n \text{ prime}$, whereas "$n$ is prime **only if** $P$" means $n \text{ prime} \implies P$. The two statements are converses of one another, and both fail.

Statement 1 claims every $n$ of the form $6k \pm 1$ is prime. But $25 = 6(4) + 1$ is $5^{2}$, and $35 = 6(6) - 1 = 5 \times 7$. So statement 1 is false.

Statement 2 claims every prime has the form $6k \pm 1$. This is true for every prime greater than $3$ — any other residue class mod $6$ is divisible by $2$ or $3$ — but it fails for the primes $2$ and $3$ themselves, neither of which is $6k \pm 1$ for any integer $k$. So statement 2 is false too.

The answer is A. Statement 2 is the trap: it is the familiar true fact with its two exceptional cases quietly reinstated.
