---
database: GMAT
qid: 90020723000
id: ALG-DS-Q30
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q30
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
If a, b, and c are three-digit positive integers and if $a = b + c$, is the hundreds digit of $a$ greater than the sum of the hundreds digits of $b$ and $c$ ?

(1) The tens digit of $a$ is equal to the sum of the tens digits of $b$ and $c$.
(2) The tens digit of $a$ is equal to the product of the tens digits of $b$ and $c$.

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

The hundreds digit of $a$ is greater than the sum of the hundreds digits of $b$ and $c$ exactly when the addition of the tens column produces a carry into the hundreds column.

**Statement (1):**

If the tens digit of $a$ equals the ordinary sum of the tens digits of $b$ and $c$, there can be neither a carry from the units column nor a carry into the hundreds column. Therefore, the answer is always NO. Sufficient.

**Statement (2):**

Under the intended assumption that the tens digits of $b$ and $c$ are nonzero, let them be $r$ and $s$, and let the units carry be $u\in\{0,1\}$. The digit condition is $(r+s+u)\bmod10=rs$. The feasible pairs are $(r,s,u)=(2,2,0),(2,3,1),(3,2,1)$, none of which creates a hundreds carry. Thus, the answer is always NO. Sufficient under that intended assumption.

However, ordinary three-digit integers may contain a zero tens digit. Then statement (2) is not sufficient: $100+200=300$ gives NO, while $109+291=400$ gives YES, and both satisfy the statement. Under the standard definition, the logically correct answer would be A rather than the source OA D.

Answer: D (source OA; requires the unstated nonzero-tens-digit assumption)
