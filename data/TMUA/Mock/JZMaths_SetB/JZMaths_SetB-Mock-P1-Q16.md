---
database: TMUA
qid: 20132101206116
id: JZMaths_SetB-Mock-P1-Q16
paper: TMUA Mock
year:
number: Q16
section: Multiple Choice
difficulty: 7.5
topics: [Sequences and Series]
subtopics: [AP GP, Sequences and Series]
tags: [Sequences and Series, General Algebra]
status: 已入库
---

## 题目
An arithmetic sequence $(a_n)$ and a convergent geometric sequence $(g_n)$ are combined to form a new sequence $(T_n)$, where $T_n = a_n + g_n$. Given that

$$ T_1 = 3, \quad T_2 = 2, \quad T_3 = \frac{3}{2}, \quad T_4 = \frac{9}{8}, $$

find the sum to infinity of the geometric sequence $(g_n)$.

$$ \mathbf{A} \quad \frac{8}{9} $$
$$ \mathbf{B} \quad \frac{32}{27} $$
$$ \mathbf{C} \quad \frac{4}{3} $$
$$ \mathbf{D} \quad \frac{3}{2} $$
$$ \mathbf{E} \quad \frac{27}{8} $$
$$ \mathbf{F} \quad 4 $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
The $n$th terms of the two sequence be $p + (n - 1)d$ and $qr^{n-1}$, so

$$ T_n = p + (n - 1)d + qr^{n-1}. $$

Form the first differences $\Delta_n = T_{n+1} - T_n$:

$$ \Delta_1 = d + q(r - 1) = 2 - 3 = -1, $$
$$ \Delta_2 = d + qr(r - 1) = \frac{3}{2} - 2 = -\frac{1}{2}, $$
$$ \Delta_3 = d + qr^2(r - 1) = \frac{9}{8} - \frac{3}{2} = -\frac{3}{8}. $$

The constant $d$ cancels in second differences:
$$
\Delta_2-\Delta_1=q(r-1)(r-1)=q(r-1)^2=\frac{1}{2},
$$
$$
\Delta_3-\Delta_2=q(r^2-r)(r-1)=qr(r-1)^2=\frac{1}{8}.
$$

Dividing the second by the first gives $r=\frac14$, which satisfies $|r|<1$ as required.

Then $q(r-1)^2=q\cdot\frac{9}{16}=\frac12$, so $q=\frac89$. Hence
$$
S_\infty=\frac{q}{1-r}=\frac{8/9}{3/4}=\frac{32}{27}.
$$
