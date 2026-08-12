---
database: GMAT
qid: 90020720400
id: ALG-DS-Q4
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q4
section: Data Sufficiency
band: EASY
level: LEVEL 1
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
If $x$ and $y$ are integers, is $x = 0$?

(1) $(-2)^x*y^3 > 0$
(2) $(-3)^x*y^2 < 0$

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
B

## 解析
**Official Solution:**

**Statement (1):**

If $x$ is even (including 0), $(-2)^x$ is positive. If $x$ is odd, $(-2)^x$ is negative. The sign of $y^3$ depends on $y$.

Thus, $(-2)^x*y^3>0$ can hold when $x$ is even (including 0) and $y$ is positive, as well as when $x$ is odd and $y$ is negative. Therefore, $x$ may or may not be 0. Not sufficient.

**Statement (2):**

Since the product is negative, $y\neq0$, so $y^2>0$. Therefore, $(-3)^x$ must be negative, which means that $x$ is odd. Hence, $x$ cannot be 0. Sufficient.

Answer: B
