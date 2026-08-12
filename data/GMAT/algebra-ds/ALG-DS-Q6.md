---
database: GMAT
qid: 90020720600
id: ALG-DS-Q6
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q6
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
If $x + y \neq 0$, is $\dfrac{1}{(x + y)} < 2$?

(1) $x^3 = y^3$
(2) $\dfrac{1}{x} < 2$

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

Since the real cube function is one-to-one, $x^3=y^3$ gives $x=y$. The stem gives $2x\neq0$. If $x=2$, then $\frac{1}{x+y}=\frac14<2$; if $x=\frac{1}{10}$, then $\frac{1}{x+y}=5>2$. Not sufficient.

**Statement (2):**

This gives no information about $y$. For example, $x=3,y=-2.99$ satisfies $\frac1x<2$, but $\frac{1}{x+y}=100$. Not sufficient.

**Together:**

We have $x=y$ and $\frac1x<2$. If $x<0$, then $\frac{1}{2x}<0<2$. If $x>0$, then $\frac1x<2$ implies $x>\frac12$, so $\frac{1}{2x}<1<2$. Sufficient.

Answer: C
