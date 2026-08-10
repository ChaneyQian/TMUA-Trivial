---
database: TMUA
qid: 20132101206214
id: JZMaths_SetB-Mock-P2-Q14
paper: TMUA Mock
year:
number: Q14
section: Multiple Choice
difficulty: 7.5
topics: [Sequences and Series, Trigonometry]
subtopics: [AP GP, Sequences and Series, Trigonometric Equations]
tags: [General Trigonometry, Sequences and Series]
status: 已入库
---

## 题目
For each positive integer $k$, let $F(k)$ be the sum of all real solutions $x$ of
$$ \sin(2^k x) = \frac{1}{2} $$
in the interval $0 \leq x \leq \frac{2\pi}{2^k}$. Find
$$ \sum_{k=1}^\infty F(k). $$
$$ \mathbf{A} \quad \frac{\pi}{2} $$
$$ \mathbf{B} \quad \frac{3\pi}{2} $$
$$ \mathbf{C} \quad \pi $$
$$ \mathbf{D} \quad \frac{3\pi}{4} $$
$$ \mathbf{E} \quad \frac{5\pi}{2} $$
$$ \mathbf{F} \quad 2\pi $$
$$ \mathbf{G} \quad \text{The series diverges.} $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
For $k=1$, there are exactly two solutions:
$$ \frac{\pi}{6} \times \frac{1}{2} \text{ and } \frac{5\pi}{6} \times \frac{1}{2}. $$

For $k=2$, because of the domain restriction, there are also exactly two solutions:
$$ \frac{\pi}{6} \times \frac{1}{2^2} \text{ and } \frac{5\pi}{6} \times \frac{1}{2^2}. $$

Similarly for $k=3$, because of the domain restriction, there are also exactly two solutions:
$$ \frac{\pi}{6} \times \frac{1}{2^3} \text{ and } \frac{5\pi}{6} \times \frac{1}{2^3}. $$

The same pattern continues.

Therefore: $F(1)=\pi\times\frac12$, $F(2)=\pi\times\frac{1}{2^2}$ and $F(3)=\pi\times\frac{1}{2^3}$. They form a geometric sequence with first term $\frac{\pi}{2}$, common ratio $1/2$. Thus
$$
\sum_{k=1}^{\infty}F(k)
=\frac{\frac{\pi}{2}}{1-\frac12}
=\pi.
$$
