---
database: TMUA
qid: 20132101205112
id: JZMaths_SetA-Mock-P1-Q12
paper: TMUA Mock
year:
number: Q12
section: Multiple Choice
difficulty: 7.5
topics: [Sequences and Series, Algebra (Basic)]
subtopics: [AP GP, Algebra Manipulation]
tags: [Sequences and Series]
status: 已入库
---

## 题目
The sum to infinity of a geometric sequence $(u_n)$ is $\sqrt{3}$, and the sum to infinity of the sequence obtained by squaring each term of $(u_n)$ is $\sqrt{6}$.

Define a new sequence $(v_n)$ by
$$ v_n = (-1)^{n+1}u_n $$
for all integers $n \geq 1$.

What is the sum to infinity of $(v_n)$?

$$ \mathbf{A} \quad \sqrt{3} $$
$$ \mathbf{B} \quad \frac{2\sqrt{2}}{3} $$
$$ \mathbf{C} \quad \sqrt{2} $$
$$ \mathbf{D} \quad \text{infinity} $$
$$ \mathbf{E} \quad \frac{\sqrt{3}}{2} $$
$$ \mathbf{F} \quad \frac{\sqrt{2}}{2} $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Let the original geometric sequence be the usual:

$$ a,\ ar,\ ar^2, \dots $$

Since its sum to infinity is $\sqrt{3}$,

$$ \frac{a}{1-r} = \sqrt{3}. $$

The sequence obtained by squaring each term is therefore

$$ a^2,\ a^2r^2,\ a^2r^4, \dots $$

so its sum to infinity is

$$ \frac{a^2}{1-r^2} = \sqrt{6}. $$

Rather than solve the simultaneous equations directly, use

$$ \frac{a^2}{1-r^2}=\frac{a}{1-r}\cdot\frac{a}{1+r}=\sqrt6. $$

Since $\frac{a}{1-r}=\sqrt3$, it follows that

$$ \frac{a}{1+r}=\sqrt2. $$

Now

$$ v_n=a,-ar,ar^2,-ar^3,\ldots $$

is geometric with common ratio $-r$, so its sum to infinity is

$$ \frac{a}{1+r}=\sqrt2. $$
