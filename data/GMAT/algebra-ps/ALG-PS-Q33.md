---
database: GMAT
qid: 90020713300
id: ALG-PS-Q33
paper: GMAT Algebra PS Diagnostic
year: 0
number: Q33
section: Problem Solving
band: VERY HARD
level: LEVEL 7
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
$\{x, y, z\}$ is an increasing sequence of numbers such that the ratio between the consecutive terms is constant.
$\{x + 2y, 2x + y + z, x + 3y + z\}$ is an increasing sequence of numbers such that the difference between the consecutive terms is constant.

What is the value of $x/z$ ?

$$
\mathbf{A} \quad \dfrac{1}{4}
$$

$$
\mathbf{B} \quad \dfrac{1}{2}
$$

$$
\mathbf{C} \quad 1
$$

$$
\mathbf{D} \quad 2
$$

$$
\mathbf{E} \quad 4
$$

## 备注

### 我的备注

### AI备注

## 答案
A

## 解析
**Official Solution:**

The first statement implies that $\frac{x}{y}=\frac{y}{z}$, which yields $y^2 = xz$.

The second statement implies that $(2x + y + z) - (x + 2y) = (x + 3y + z) - (2x + y + z)$, which yields $3y = z + 2x$.

Squaring $3y = z + 2x$ yields $9y^2= (z + 2x)^2$. Substituting $y^2 = xz$ gives us $9xz = (z + 2x)^2$.

$9xz= z^2 + 4xz + 4x^2$

$4x^2 - 5xz + z^2 = 0$

$4x^2 - 4xz - xz + z^2 = 0$

$4x(x - z) - z(x - z) = 0$

$(4x - z)(x - z)= 0$

$4x - z = 0$ or $x - z = 0$, which is not possible since it would give $x = z$, and this is not possible given that $\{x, y, z\}$ is an increasing sequence.

Therefore, $4x = z$, and thus $\frac{x}{z}=\frac{1}{4}$.

Answer: A
