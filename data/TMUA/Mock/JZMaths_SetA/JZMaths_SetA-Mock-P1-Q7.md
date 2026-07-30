---
database: TMUA
qid: 20132101205107
id: JZMaths_SetA-Mock-P1-Q7
paper: TMUA Mock
year:
number: Q7
section: Multiple Choice
difficulty: 7
topics: []
subtopics: []
tags: [General Number of Solutions, General Algebra]
status: 已入库
---

## 题目
Find the product of all distinct values of $p$ for which

$$ (x - p)(x^2 + px + p) = 0 $$

is satisfied by exactly two distinct values of $x$?

$$ \mathbf{A} \quad 0 $$
$$ \mathbf{B} \quad -2 $$
$$ \mathbf{C} \quad \frac{7}{2} $$
$$ \mathbf{D} \quad -4 $$
$$ \mathbf{E} \quad -\frac{7}{2} $$
$$ \mathbf{F} \quad 2 $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Clearly $x = p$ is always a solution, thus for the cubic to have 2 distinct solutions, we must have exactly $1$ doubly repeated root and a single root. There are two ways this could occur:

(i) $x = p$ is the doubly repeated root.

(ii) The doubly repeated root is not $p$, and comes from $(x^2 + px + p)$.

While examining both cases, we need to be careful to check we don't end up with a single triply repeated root.

**case (i):** So $p$ must be a root of $(x^2 + px + p)$, therefore $p^2 + p^2 + p = 0$, and so $p = 0$ or $p = -\frac{1}{2}$. If $p = 0$, then the overall equation becomes $x^3 = 0$, and has only one triply repeated root, so $p \neq 0$. However, we can easily check $p = -\frac{1}{2}$ works as $(x^2 + px + p)$ is not a square in this case.

**case (ii):** For $(x^2 + px + p)$ to have a single doubly repeated root, we need its $b^2 - 4ac$ to be zero. This gives $p^2 - 4p = 0$, so $p = 0$ or $p = 4$. We already know $p = 0$ does not work, and $p = 4$ makes $(x^2 + px + p)$ into a square, and its root is necessarily not $p$. Since this only happens when $p = -\frac{1}{2}$. Thus it is definitely not a triply repeated root.

Therefore the product of the two valid values is

$$ -\frac12\cdot 4=-2. $$
