---
database: GMAT
qid: 90020722600
id: ALG-DS-Q26
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q26
section: Data Sufficiency
band: HARD
level: LEVEL 6
solution_source: 非官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
If $m$ and $n$ are integers, is $mn > 0$ ?

(1) $\dfrac{m}{n}$ is an integer.
(2) $|m| < |n|$

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

If $\frac{m}{n}$ is an integer, $m$ and $n$ can have the same sign, opposite signs, or $m$ can be 0. Not sufficient.

**Statement (2):**

The comparison $|m|<|n|$ gives no information about their signs. Not sufficient.

**Together:**

Write $m=kn$, where $k$ is an integer and $n\neq0$. Then $|m|<|n|$ gives $|k|<1$. The only integer satisfying this is $k=0$, so $m=0$ and $mn=0$. The answer is always NO. Sufficient.

Answer: C
