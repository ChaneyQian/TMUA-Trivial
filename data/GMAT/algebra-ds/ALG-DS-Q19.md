---
database: GMAT
qid: 90020721900
id: ALG-DS-Q19
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q19
section: Data Sufficiency
band: MEDIUM
level: LEVEL 4
solution_source: 非官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
If $m$ and $n$ are positive two-digit integers, what is the value of the tens digit of $m$ minus the tens digit of $n$ ?

(1) $m - n = 42$.
(2) The units digit of $m$ minus the units digit of $n$ is not a multiple of 3.

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

Let $d$ be the difference of the tens digits and $u$ the difference of the units digits. Then $m-n=10d+u$, where $-9\leq u\leq9$.

**Statement (1):**

From $10d+u=42$, the possibilities are $(d,u)=(4,2)$ and $(5,-8)$. Thus, $d$ is not unique. Not sufficient.

**Statement (2):**

The units-digit condition alone gives no fixed value of $d$. Not sufficient.

**Together:**

Both possible values $u=2$ and $u=-8$ are not multiples of 3. Therefore, the second statement does not eliminate either value of $d$. Not sufficient.

Answer: E
