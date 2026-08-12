---
database: GMAT
qid: 90020722700
id: ALG-DS-Q27
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q27
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
If $x^2 +y^2 \leq 25$, is $x^2 < x$ ?

(1) $y^2 > 9$.
(2) $x = y + 3$.

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

The target inequality $x^2<x$ is true exactly when $0<x<1$.

**Statement (1):**

Since $y^2>9$, the stem gives $x^2<16$, or $-4<x<4$. This contains values both inside and outside $(0,1)$. Not sufficient.

**Statement (2):**

Substituting $y=x-3$ into the stem gives $x^2+(x-3)^2\leq25$, or $2x^2-6x-16\leq0$. This also allows values both inside and outside $(0,1)$. Not sufficient.

**Together:**

From $y=x-3$ and $y^2>9$, we get $|x-3|>3$, so either $x<0$ or $x>6$. The disk condition from the stem rules out $x>6$. Hence, $x<0$, and $x^2<x$ is always false. Sufficient.

Answer: C
