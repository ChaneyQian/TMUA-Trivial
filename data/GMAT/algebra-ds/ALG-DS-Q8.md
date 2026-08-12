---
database: GMAT
qid: 90020720800
id: ALG-DS-Q8
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q8
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
Is $x > y$?

(1) $x + y > 0$
(2) $y^2 > x^2$

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

From $x+y>0$, we get $x>-y$, but this does not determine whether $x>y$. Not sufficient.

**Statement (2):**

From $y^2>x^2$, we get $|y|>|x|$. If $y>0$, then $x<y$; if $y<0$, then $x>y$. Not sufficient.

**Together:**

If $y<0$, then $|y|>|x|$ gives $x<|y|=-y$, contradicting $x>-y$. Therefore, $y>0$. Since $|y|>|x|$, it follows that $x<y$, so the answer is always NO. Sufficient.

Answer: C
