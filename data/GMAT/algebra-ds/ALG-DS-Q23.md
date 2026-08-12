---
database: GMAT
qid: 90020722300
id: ALG-DS-Q23
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q23
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
If $x$ and $y$ are integers, $m = 3^{x-y}*5^{2y-1}*7^{4-x}$ and $n = 105^y$, what is the value of $y$?

(1) $n$ is NOT a multiple of $m$.
(2) $m$ is a multiple of $n$.

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
B

## 解析
**Inofficial Solution:**

Write $n=3^y5^y7^y$.

**Statement (1):**

If $n$ is not a multiple of $m$, at least one prime exponent in $n$ is smaller than the corresponding exponent in $m$. This can occur through different inequalities involving $x$ and $y$, so $y$ is not fixed. Not sufficient.

**Statement (2):**

If $m$ is a multiple of $n$, comparison of prime exponents gives

$$
x-y\geq y,\qquad 2y-1\geq y,\qquad 4-x\geq y.
$$

Thus, $x\geq2y$, $y\geq1$, and $x+y\leq4$. Combining the first and third inequalities gives $3y\leq4$. Since $y$ is an integer and $y\geq1$, we must have $y=1$. Sufficient.

Answer: B
