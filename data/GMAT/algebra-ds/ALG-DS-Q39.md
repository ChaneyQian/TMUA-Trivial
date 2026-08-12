---
database: GMAT
qid: 90020723900
id: ALG-DS-Q39
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q39
section: Data Sufficiency
band: VERY HARD
level: LEVEL 8
solution_source: 非官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
If $|a| > |b| > |c|$, is $a*b^3*c^3 > a*b^4*c^2$ ?

(1) $a > b > c$
(2) $a + b > 0$

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
D

## 解析
**Inofficial Solution:**

Subtracting the right side from the left gives

$$
ab^3c^2(c-b).
$$

Since $c^2>0$, the sign is the sign of $ab(c-b)$.

**Statement (1):**

The conditions $a>b>c$ and $|a|>|b|>|c|$ force $a>0$ and $b>0$, while $c<b$. Hence, $ab(c-b)<0$, so the target inequality is always false. Sufficient.

**Statement (2):**

Since $|a|>|b|$ and $a+b>0$, we must have $a>0$. If $b>0$, then $|c|<b$ gives $c-b<0$. If $b<0$, then $|c|<|b|$ gives $c>b$, so again $b(c-b)<0$. Thus, the target inequality is always false. Sufficient.

Answer: D
