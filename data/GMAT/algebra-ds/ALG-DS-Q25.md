---
database: GMAT
qid: 90020722500
id: ALG-DS-Q25
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q25
section: Data Sufficiency
band: HARD
level: LEVEL 5
solution_source: 非官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
If $m$ and $n$ are positive two-digit integers, what is the value of the tens digit of $m$ minus the tens digit of $n$ ?

(1) $m - n = 43$.
(2) The units digit of $m$ minus the units digit of $n$ is not a multiple of 3.

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
**Inofficial Solution:**

Let $d$ be the difference of the tens digits and $u$ the difference of the units digits. Then $m-n=10d+u$, with $-9\leq u\leq9$.

**Statement (1):**

From $10d+u=43$, the possibilities are $(d,u)=(4,3)$ and $(5,-7)$. Not sufficient.

**Statement (2):**

The units-digit condition alone does not determine $d$. Not sufficient.

**Together:**

Of the two values from (1), $u=3$ is a multiple of 3 and is excluded, while $u=-7$ is not. Hence, $d=5$. Sufficient.

Answer: C
