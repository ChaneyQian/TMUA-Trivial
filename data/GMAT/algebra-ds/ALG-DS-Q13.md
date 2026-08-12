---
database: GMAT
qid: 90020721300
id: ALG-DS-Q13
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q13
section: Data Sufficiency
band: MEDIUM
level: LEVEL 3
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
If $m$ and $n$ are positive integers, and $x = 2^m3^n$, is $m < n$ ?

(1) $x$ is divisible by 144
(2) $x$ is not divisible by 648

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

**Statement (1):**

Factoring 144, we get $144=2^4*3^2$. Hence, this statement implies that $m\geq4$ and $n\geq2$. Without upper limits for $m$ and $n$, we cannot determine whether $m<n$. Not sufficient.

**Statement (2):**

Factoring 648, we get $648=2^3*3^4$. Hence, this statement implies either $m<3$ or $n<4$, or both. For instance, if $m=2,n=10$, then $m<n$, but if $m=10,n=3$, then $m>n$. Not sufficient.

**Together:**

From (1), $m\geq4$, so the condition $m<3$ from (2) cannot hold. Therefore, $n<4$. Hence, $m\geq4>n$, and the answer is always NO. Sufficient.

Answer: C
