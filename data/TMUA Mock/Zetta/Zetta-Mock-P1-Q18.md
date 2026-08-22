---
database: TMUA
qid: 20132101202118
id: Zetta-Mock-P1-Q18
paper: TMUA Mock
year:
number: Q18
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Let $S$ be the set of all points with coordinates $(x, y, z)$, where $x, y$, and $z$ are each chosen from the set $\{0, 1, 2\}$. How many equilateral triangles all have their vertices in $S$?

$$
\mathbf{A} \quad 72
$$

$$
\mathbf{B} \quad 80
$$

$$
\mathbf{C} \quad 86
$$

$$
\mathbf{D} \quad 94
$$

$$
\mathbf{E} \quad 96
$$

$$
\mathbf{F} \quad 102
$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
$S$ is the $3\times3\times3$ grid of $27$ lattice points. An equilateral triangle in this grid must have all three squared side lengths equal, and lattice distances here are limited, so only a few sizes are possible.

**Side $\sqrt2$ (face diagonals).** These triangles are the "corner" triangles cutting off a vertex of a unit cube. Each unit cube contributes $8$ of them, one per vertex, and the $3\times3\times3$ grid contains $8$ unit cubes: $8\times8 = 64$ triangles.

**Side $2\sqrt2$.** The same construction on the whole $2\times2\times2$ cube gives one triangle per vertex: $8$ triangles.

**Side $\sqrt6$.** These are the triangles joining midpoints of three mutually skew edges of the big cube; there are $8$ of them.

No other squared side length supports an equilateral triangle here. The total is

$$ 64+8+8 = 80 $$

The answer is B.
