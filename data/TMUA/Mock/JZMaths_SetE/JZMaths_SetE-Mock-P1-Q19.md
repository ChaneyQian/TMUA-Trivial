---
database: TMUA
qid: 20132101209119
id: JZMaths_SetE-Mock-P1-Q19
paper: TMUA Mock
year:
number: Q19
section: Multiple Choice
difficulty: 7.5
topics: [Polynomial, Number Theory]
subtopics: [Vieta's Formulas, Diophantine Equations]
tags: [General Algebra, Polynomial Expansions]
status: 已入库
---

## 题目
Given that $x^3 + ax + 120 = 0$ has exactly two positive integer roots, what is the value of $a$?

The equation may or may not have other roots.

$$ \mathbf{A} \quad -20 $$
$$ \mathbf{B} \quad -42 $$
$$ \mathbf{C} \quad -21 $$
$$ \mathbf{D} \quad -55 $$
$$ \mathbf{E} \quad -49 $$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
Let the two positive integer roots be $r$ and $s$, where $r < s$.

Since both are roots,
$$ r^3 + ar + 120 = 0 $$
and
$$ s^3 + as + 120 = 0. $$

Subtracting gives
$$ r^3 - s^3 + a(r - s) = 0. $$

Since $r \neq s$, dividing by $r - s$ gives
$$ r^2 + rs + s^2 + a = 0, $$
so
$$ a = -(r^2 + rs + s^2). $$

Substituting this into $r^3 + ar + 120 = 0$ gives
$$ r^3 - r(r^2 + rs + s^2) + 120 = 0, $$

which simplifies to
$$ rs(r + s) = 120. $$

Since $120$ is divisible by $5$, at least one of $r$, $s$ and $r + s$ must be divisible by $5$. This leaves relatively few plausible pairs to check.

The factorisation $120 = 3 \cdot 5 \cdot 8$ suggests trying $r = 3$ and $s = 5$, since $r + s = 8$. Indeed,
$$ 3 \cdot 5 \cdot (3 + 5) = 120. $$

Therefore, the two positive integer roots are $3$ and $5$. Hence
$$ a = -(3^2 + 3 \cdot 5 + 5^2) = -49. $$

Finally,
$$ x^3 - 49x + 120 = (x - 3)(x - 5)(x + 8), $$
so the equation has exactly two positive integer roots, $3$ and $5$.

Therefore, $a = -49$.
