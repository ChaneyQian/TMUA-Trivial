---
database: GMAT
qid: 90020723800
id: ALG-DS-Q38
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q38
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
Positive integers a, b and c are all less than 10. If the sum of all the distinguishable three digit numbers that can be formed by juxtaposing these integers is 1332, is $a = b$?

(1) $c = 3$
(2) $b = 2$

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
A

## 解析
**Inofficial Solution:**

If the digits are all distinct, the six permutations have sum $222(a+b+c)$, so $a+b+c=1332/222=6$.

If exactly two digits are equal, with repeated digit $r$ and other digit $s$, the three distinguishable numbers have sum $111(2r+s)$, so $2r+s=12$.

**Statement (1):**

If $c=3$, the all-distinct case gives $a+b=3$, so $a$ and $b$ are 1 and 2 and are unequal. In the repeated-digit case, the only possibilities involving $c=3$ have the other digit equal to 6, again giving $a\neq b$. Sufficient.

**Statement (2):**

If $b=2$, both $a=b=2,c=8$ and $a=8,b=c=2$ satisfy the repeated-digit equation, but the first has $a=b$ and the second does not. Not sufficient.

Answer: A
