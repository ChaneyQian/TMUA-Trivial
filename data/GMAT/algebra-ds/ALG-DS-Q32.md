---
database: GMAT
qid: 90020723200
id: ALG-DS-Q32
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q32
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
If $xy \neq 0$, is $x < y$?

(1) $x^8 < y^8$
(2) $x^{(-9)} < y^{(-9)}$

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
E

## 解析
**Inofficial Solution:**

**Statement (1):**

Since $x^8<y^8$, we know only that $|x|<|y|$. The signs are unknown, so $x<y$ is not determined. Not sufficient.

**Statement (2):**

The function $u^{-9}$ is decreasing on each side of 0, but values of opposite signs also satisfy the inequality. For example, $x=-1,y=2$ gives $x<y$, while $x=-1,y=-2$ gives $x>y$; both satisfy $x^{-9}<y^{-9}$. Not sufficient.

**Together:**

The same two examples also satisfy $|x|<|y|$, so the statements together still give different answers. Not sufficient.

Answer: E
