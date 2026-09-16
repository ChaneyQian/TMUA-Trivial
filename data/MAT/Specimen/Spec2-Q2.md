---
database: MAT
qid: 90010310200
id: Spec2-Q2
paper: MAT Specimen 2
year: 2009
number: Q2
section: Long Question
audience: All
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: [重复题]
duplicate_of: MAT/2002/02-Q2.md
status: 已入库
---
## 题目
**For ALL APPLICANTS.**

Suppose that the equation
$$
x^{4} + Ax^{2} + B = \left(x^{2} + ax + b\right)\left(x^{2} - ax + b\right)
$$
holds for all values of $x$.

**(i)** Find $A$ and $B$ in terms of $a$ and $b$.

**(ii)** Use this information to find a factorization of the expression
$$
x^{4} - 20x^{2} + 16
$$
as a product of two quadratics in $x$.

**(iii)** Show that the four solutions of the equation
$$
x^{4} - 20x^{2} + 16 = 0
$$
can be written as $\pm\sqrt{7} \pm \sqrt{3}$.

## 备注

### 我的备注

### AI备注
本题与 `MAT/2002/02-Q2.md` 是同一道题——牛津样卷是从 1996–2006 历年真题里挑题拼成的。已打 `重复题` 标签、排除出组卷池，避免随机组卷时同题出现两次。本条保留的价值在于**解析是原卷官方版**（Dr. Richard Earl），而孪生题的解析是自撰的。

差异：2002 原卷小问标号为 (a)–(c)，本卷为 (i)–(iii)，内容一致。

## 答案
（无）

## 解析
**(i)**
$$
\left(x^{2} + ax + b\right)\left(x^{2} - ax + b\right) = x^{4} + (a - a)x^{3} + \left(b + b - a^{2}\right)x^{2} + (-ab - ab)x + b^{2} = x^{4} + \left(2b - a^{2}\right)x^{2} + b^{2}
$$
which equals $x^{4} + Ax^{2} + B$ when
$$
A = 2b - a^{2}, \qquad B = b^{2}.
$$

**(ii)** We can write
$$
\left(x^{2} + ax + b\right)\left(x^{2} - ax + b\right) = x^{4} - 20x^{2} + 16
$$
if we can solve
$$
2b - a^{2} = -20 \quad \text{and} \quad b^{2} = 16.
$$
These equations are solved by $b = 4$ and $a = \sqrt{28} = 2\sqrt{7}$. So
$$
x^{4} - 20x^{2} + 16 = \left(x^{2} - 2\sqrt{7}x + 4\right)\left(x^{2} + 2\sqrt{7}x + 4\right).
$$

**(iii)** Finding the roots of these two quadratics we get
$$
x^{2} - 2\sqrt{7}x + 4 = 0 \implies \left(x - \sqrt{7}\right)^{2} = \left(\sqrt{7}\right)^{2} - 4 = 3 \implies x = \sqrt{7} \pm \sqrt{3},
$$
and
$$
x^{2} + 2\sqrt{7}x + 4 = 0 \implies \left(x + \sqrt{7}\right)^{2} = \left(\sqrt{7}\right)^{2} - 4 = 3 \implies x = -\sqrt{7} \pm \sqrt{3}.
$$
Hence the four roots of $x^{4} - 20x^{2} + 16$ are
$$
\pm\sqrt{7} \pm \sqrt{3}.
$$
