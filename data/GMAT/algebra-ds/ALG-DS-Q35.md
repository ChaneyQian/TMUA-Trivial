---
database: GMAT
qid: 90020723500
id: ALG-DS-Q35
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q35
section: Data Sufficiency
band: VERY HARD
level: LEVEL 7
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
If $a$ and $b$ are single-digit positive numbers and $a/b$ is NOT a recurring decimal, what is the value of $a$?

(1) $-\dfrac{1}{3} > -\dfrac{a}{b} > -\dfrac{4}{5}$
(2) $b$ is equal to the sum of its positive divisors excluding $b$ itself

$$
\mathbf{A} \quad \text{Statement (1) ALONE is sufficient but statement (2) ALONE is not sufficient.}
$$

$$
\mathbf{B} \quad \text{Statement (2) ALONE is sufficient but statement (1) ALONE is not sufficient.}
$$

$$
\mathbf{C} \quad \text{BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient.}
$$

$$
\mathbf{D} \quad \text{EACH statement ALONE is sufficient.}
$$

$$
\mathbf{E} \quad \text{Statements (1) and (2) TOGETHER are not sufficient.}
$$

## 备注

### 我的备注

### AI备注

## 答案
C

## 解析
**Official Solution:**

Given that $a$ and $b$ are single-digit positive numbers, the possible values for each are 1, 2, 3, 4, 5, 6, 7, 8, or 9.

**Statement (1):**

Multiplying by $-1$ reverses the inequalities and gives

$$
\frac13<\frac ab<\frac45.
$$

Since $\frac ab$ is not a recurring decimal, possible values include 0.4 ($a=2,b=5$), 0.5 ($a=1,b=2$), and others. Not sufficient.

**Statement (2):**

Of the single-digit numbers, only 6 equals the sum of its positive divisors excluding itself: $6=1+2+3$. For $\frac a6$ to terminate, the possible numerators are $a=3,6,9$, giving 0.5, 1, and 1.5. Not sufficient.

**Together:**

Among these three values, only $\frac36=0.5$ lies between $\frac13$ and $\frac45$. Therefore, $a=3$.

Answer: C
