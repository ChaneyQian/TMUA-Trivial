---
database: GMAT
qid: 90020721700
id: ALG-DS-Q17
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q17
section: Data Sufficiency
band: MEDIUM
level: LEVEL 4
solution_source: 非官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Is $ac + \sqrt{(a^2 - 1)(c^2 - 1)} \leq 1$ ?

(1) $a^2 + b^2 = 1$
(2) $c^2 + d^2 = 1$

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

We know $a^2\leq1$, but $c$ is not fully determined. In the boundary case $a=1,b=0$, the expression becomes $c$, which can be either less than or greater than 1. Not sufficient.

**Statement (2):**

Similarly, $c^2\leq1$, but $a$ is not fully determined. Not sufficient.

**Together:**

We have $1-a^2=b^2$ and $1-c^2=d^2$. Therefore,

$$
ac+\sqrt{(a^2-1)(c^2-1)}=ac+\sqrt{(1-a^2)(1-c^2)}=ac+|bd|.
$$

By the Cauchy-Schwarz inequality,

$$
ac+|bd|\leq\sqrt{a^2+b^2}\sqrt{c^2+d^2}=1.
$$

Sufficient.

Answer: C
