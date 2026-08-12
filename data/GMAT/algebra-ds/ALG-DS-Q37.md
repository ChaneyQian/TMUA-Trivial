---
database: GMAT
qid: 90020723700
id: ALG-DS-Q37
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q37
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
If $xy \neq 0$, is $x + y < 0$?

(1) $\dfrac{x}{\sqrt{x^2-\sqrt{-y*|y|}}} = y-1$
(2) $(x+3)^2+(y+4)^2<15$

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

Bunuel later noted that this type of pure algebraic DS question is no longer part of the current GMAT syllabus. For the expression as written:

**Statement (1):**

The inner radical requires $-y|y|\geq0$. Since $y\neq0$, this forces $y<0$. The right side $y-1$ is negative, while the denominator on the left is positive, so $x<0$. Therefore, $x+y<0$. Sufficient.

**Statement (2):**

The inequality describes the interior of a circle centered at $(-3,-4)$ with radius $\sqrt{15}$. The maximum possible value of $x+y$ in this disk is

$$
-7+\sqrt{15}\sqrt2=-7+\sqrt{30}<0.
$$

Thus, $x+y<0$ throughout the disk. Sufficient.

Answer: D
