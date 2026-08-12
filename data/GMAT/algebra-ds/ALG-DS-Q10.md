---
database: GMAT
qid: 90020721000
id: ALG-DS-Q10
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q10
section: Data Sufficiency
band: EASY
level: LEVEL 2
solution_source: 非官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Is $x > y$ ?

(1) $x^2 < y^2$
(2) $y < 0$

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

The inequality $x^2<y^2$ means $|x|<|y|$. If $y=3,x=2$, then $x<y$; if $y=-3,x=2$, then $x>y$. Not sufficient.

**Statement (2):**

Knowing only that $y<0$ gives no information about $x$. Not sufficient.

**Together:**

Since $y<0$, we have $y=-|y|$. From $|x|<|y|$, it follows that $x>-|y|=y$. Therefore, $x>y$ is always true. Sufficient.

Answer: C
