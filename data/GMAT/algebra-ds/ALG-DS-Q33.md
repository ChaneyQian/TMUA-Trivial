---
database: GMAT
qid: 90020723300
id: ALG-DS-Q33
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q33
section: Data Sufficiency
band: VERY HARD
level: LEVEL 7
solution_source: 非官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
If $x \neq 0$, is $x < |x|$ ?

(1) $|x|< 1$
(2) $\dfrac{x}{|x|} < x$

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

The target inequality is true exactly when $x<0$.

**Statement (1):**

The condition $|x|<1$ allows both positive and negative values. Not sufficient.

**Statement (2):**

If $x>0$, the inequality becomes $1<x$, so positive values greater than 1 work. If $x<0$, it becomes $-1<x$, so negative values between $-1$ and 0 work. Thus, the sign is not determined. Not sufficient.

**Together:**

Statement (1) eliminates the positive possibility $x>1$. Therefore, $-1<x<0$, and the target inequality is true. Sufficient.

Answer: C
