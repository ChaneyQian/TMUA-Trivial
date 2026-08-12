---
database: GMAT
qid: 90020723600
id: ALG-DS-Q36
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q36
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
If $a + b + c + d = 12$, what is the value of $\sqrt{a^2+b^2+c^2+d^2}$ ?

(1) $ab = cd = ad$
(2) $|a| = |b| = |c| = |d|$

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

The equal products do not fix the four values. For example, $a=b=c=d=3$ gives the required sum and a norm of 6, while $a=d=0,b=5,c=7$ also satisfies $ab=cd=ad=0$ but gives a different norm. Not sufficient.

**Statement (2):**

Let the common absolute value be $k$. If all four numbers are positive, $k=3$ and the norm is 6. If three are positive and one is negative, $2k=12$, so $k=6$ and the norm is 12. Not sufficient.

**Together:**

Since the common absolute value is nonzero, $ab=ad$ gives $b=d$, and $ad=cd$ gives $a=c$. Thus, signs occur in equal pairs. A pair of positive and a pair of negative values would sum to 0, so all four must be positive. Hence, $a=b=c=d=3$ and

$$
\sqrt{a^2+b^2+c^2+d^2}=\sqrt{4*9}=6.
$$

Sufficient.

Answer: C
