---
database: GMAT
qid: 90020722400
id: ALG-DS-Q24
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q24
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
Is $p + q > pq$ ?

(1) $p > 0 > q$
(2) $|q| = p$

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

**Statement (1):**

We have $p>0$ and $q<0$. The expression $p+q-pq=p+q(1-p)$ can be positive or nonpositive. For example, $p=2,q=-1$ gives a positive value, while $p=\frac12,q=-2$ gives a negative value. Not sufficient.

**Statement (2):**

Since $|q|=p$, either $q=p$ or $q=-p$. Different values give different answers. Not sufficient.

**Together:**

The signs from (1) force $q=-p$, with $p>0$. Then $p+q=0$ and $pq=-p^2<0$, so $p+q>pq$ is always true. Sufficient.

Answer: C
