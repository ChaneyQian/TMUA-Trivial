---
database: TMUA
qid: 20132101209115
id: JZMaths_SetE-Mock-P1-Q15
paper: TMUA Mock
year:
number: Q15
section: Multiple Choice
difficulty: 7
topics: []
subtopics: []
tags: [Geometry]
status: 已入库
---

## 题目
You may use the following result: for any triangle with area $A$, perimeter $p$ and inradius $r$, where the inradius is the radius of the circle which touches all three sides of the triangle,
$$ A = \frac{rp}{2}. $$

A triangle has integer side lengths which form a non-constant arithmetic sequence. Its inradius is 3 and its area is 54.

What is the length of its shortest side?

$$ \mathbf{A} \quad 7 $$
$$ \mathbf{B} \quad 8 $$
$$ \mathbf{C} \quad 9 $$
$$ \mathbf{D} \quad 10 $$
$$ \mathbf{E} \quad 11 $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Since $A = \frac{rp}{2}$, and $r = 3$ and $A = 54$, the perimeter is 36.

Let the side lengths be $m - d$, $m$ and $m + d$, where $d$ is a positive integer. Their sum is $3m$, so $3m = 36$ and hence $m = 12$.

Thus the side lengths are $12 - d$, 12 and $12 + d$. Let $C$ be the angle between the sides of lengths $12 - d$ and 12, so the side opposite $C$ has length $12 + d$.

Now we must remember that we still need to include the area constraint. Using the area formula,
$$ 54 = \frac{1}{2} \cdot 12(12 - d) \sin C, $$
so
$$ \sin C = \frac{9}{12 - d}. $$

By the cosine rule,
$$ \cos C = \frac{(12 - d)^2 + 12^2 - (12 + d)^2}{2 \cdot 12(12 - d)} = \frac{6 - 2d}{12 - d}. $$

Using $\sin^2 C + \cos^2 C = 1$ gives
$$ \frac{9^2 + (6 - 2d)^2}{(12 - d)^2} = 1. $$

Therefore
$$ 81 + (6 - 2d)^2 = (12 - d)^2, $$
which simplifies to $3d^2 = 27$. Hence $d = 3$.

The side lengths are therefore $9$, $12$ and $15$, so the shortest side has length $9$.

**Alternatively**, from $12 - d$, $12$ and $12 + d$.

By Heron's nearly 2000 year old formula:
$$ A^2 = s(s - a)(s - b)(s - c). $$

Therefore,
$$ 54^2 = 18(18 - (12 - d))(18 - 12)(18 - (12 + d)), $$
so
$$ 2916 = 18(6 + d) \cdot 6(6 - d) = 108(36 - d^2). $$
Hence $36 - d^2 = 27$, so $d^2 = 9$ and therefore $d = 3$.
