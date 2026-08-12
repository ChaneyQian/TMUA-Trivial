---
database: GMAT
qid: 90020723100
id: ALG-DS-Q31
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q31
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
Positive integers a, b and c are all less than 10. If the sum of all the distinguishable three digit numbers that can be formed by juxtaposing these integers is 3108, is $a = b$?

(1) $c = 9$
(2) $a = 2$

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

If $a,b,c$ are all distinct, the six three-digit permutations have sum $222(a+b+c)$. Thus, $a+b+c=3108/222=14$.

If exactly two digits are equal, say the repeated digit is $r$ and the other digit is $s$, the three distinguishable numbers have sum $111(2r+s)$. Thus, $2r+s=3108/111=28$.

**Statement (1):**

If $c=9$, the repeated-digit equation has no single-digit solution involving $c$. Therefore, the digits are distinct and $a+b=5$, so $a\neq b$. Sufficient.

**Statement (2):**

If $a=2$, the repeated-digit equation again has no single-digit solution involving $a$. Hence, the digits are distinct, so $a\neq b$. Sufficient.

Answer: D
