---
database: TMUA
qid: 20132101203215
id: Yotta-Mock-P2-Q15
paper: TMUA Mock
year:
number: Q15
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Which of these statements is true for two positive integers, $p$ and $q$, where $p$ is prime?
1. The highest common factor of $p$ and $q$ is 1 **if** $q$ is also prime.
2. $pq$ has exactly four factors

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
Nothing in the question says $p$ and $q$ are distinct, and taking $p = q = 2$ defeats both statements.

**Statement 1** claims that if $q$ is prime then $\gcd(p,q) = 1$. With $p = q = 2$, both are prime yet $\gcd(2,2) = 2$. False.

**Statement 2** claims $pq$ always has exactly four factors. With $p = q = 2$, $pq = 4$, whose factors are $1, 2, 4$ — only three. False. (Taking $q = 1$ also breaks it: $pq = p$ has two factors.)

Neither holds, so the answer is A. The statements *are* true once $p$ and $q$ are distinct primes; the whole question is whether you noticed that this was never assumed.
