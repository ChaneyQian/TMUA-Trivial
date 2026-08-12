---
database: GMAT
qid: 90020724000
id: ALG-DS-Q40
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q40
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
If $n$ is an integer such that $\dfrac{1}{9} < \dfrac{1}{(n^2-1)} < \dfrac{1}{2}$, what is the value of $n$?

(1) $\dfrac{1}{3} > \dfrac{1}{(1 - n)} > 1/7$

(2) $n$ is not an even integer.

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

The denominator must be positive. Taking reciprocals gives $2<n^2-1<9$, or $3<n^2<10$. Hence,

$$
n\in\{-3,-2,2,3\}.
$$

**Statement (1):**

The reciprocals are positive, and

$$
\frac17<\frac{1}{1-n}<\frac13
$$

gives $3<1-n<7$, or $-6<-n<-2$, so $2<n<6$. Intersecting this with the values from the stem leaves $n=3$. Sufficient.

**Statement (2):**

If $n$ is not even, the stem leaves $n=-3$ or $n=3$. Not sufficient.

Answer: A
