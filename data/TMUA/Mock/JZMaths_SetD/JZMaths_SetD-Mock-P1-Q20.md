---
database: TMUA
qid: 20132101208120
id: JZMaths_SetD-Mock-P1-Q20
paper: TMUA Mock
year:
number: Q20
section: Multiple Choice
difficulty: 8.5
topics: [Sequences and Series, Algebra (Basic)]
subtopics: [AP GP, Algebra Manipulation]
tags: [Ratio-and-Proportion, General-Algebra]
status: 已入库
---

## 题目
The positive real numbers $a, b, c, d$ form a geometric progression in this order. Given that
$$a + d = 35 \quad \text{and} \quad b + c = 30,$$
find the value of
$$\frac{1}{a} + \frac{1}{b} + \frac{1}{c} + \frac{1}{d}.$$
$$ \mathbf{A} \quad \frac{65}{216} $$
$$ \mathbf{B} \quad \frac{13}{7} $$
$$ \mathbf{C} \quad \frac{13}{6} $$
$$ \mathbf{D} \quad \frac{1}{216} $$
$$ \mathbf{E} \quad \frac{5}{216} $$
$$ \mathbf{F} \quad \frac{13}{210} $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
**Remark:** This is an example of a challenging algebra problem. In problems of this kind, it is important to look for opportunities to simplify the algebra as early as possible.

**Step 1:** A useful identity for a 4-term geometric progression. Write $b = ar$, $c = ar^2$, $d = ar^3$ for some common ratio $r > 0$. Then
$$ad = a \cdot ar^3 = a^2r^3 \quad \text{and} \quad bc = ar \cdot ar^2 = a^2r^3,$$
so $ad = bc$. Calling this common product $P$, we have
$$\frac{1}{a} + \frac{1}{d} = \frac{a+d}{ad} = \frac{a+d}{P}, \quad \frac{1}{b} + \frac{1}{c} = \frac{b+c}{bc} = \frac{b+c}{P}.$$
Hence
$$\frac{1}{a} + \frac{1}{b} + \frac{1}{c} + \frac{1}{d} = \frac{(a+d) + (b+c)}{P} = \frac{65}{P}.$$

**Step 2:** Find $P = ad$. Using the geometric progression form,
$$a + d = a(1 + r^3) = a(1 + r)(1 - r + r^2), \quad b + c = ar(1 + r).$$
Dividing,
$$\frac{a+d}{b+c} = \frac{1-r+r^2}{r} = \frac{35}{30} = \frac{7}{6}.$$
So $6(1 - r + r^2) = 7r$, i.e. $6r^2 - 13r + 6 = 0$, giving $r = \frac{3}{2}$ or $r = \frac{2}{3}$.

Either choice gives the same value of $P = ad$. For $r = 3/2$: $a(1+r)(1-r+r^2) = a \cdot \frac{5}{2} \cdot \frac{7}{4} = \frac{35a}{8} = 35$, so $a = 8$. Then $d = ar^3 = 8 \cdot \frac{27}{8} = 27$, and $P = ad = 216$. For $r = 2/3$ the values of $a$ and $d$ swap, and $P$ is unchanged.

**Step 3:** Combine.
$$\frac{1}{a} + \frac{1}{b} + \frac{1}{c} + \frac{1}{d} = \frac{65}{216}.$$
