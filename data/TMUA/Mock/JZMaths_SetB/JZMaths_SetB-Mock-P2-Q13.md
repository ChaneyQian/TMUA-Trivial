---
database: TMUA
qid: 20132101206213
id: JZMaths_SetB-Mock-P2-Q13
paper: TMUA Mock
year:
number: Q13
section: Multiple Choice
difficulty: 7.5
topics: []
subtopics: []
tags: [Exponentials and Logarithms]
status: 已入库
---

## 题目
Positive real numbers $x$, $y$, $z$, none equal to 1, satisfy

$$ x^{\log_y z} = y^{\log_z x} = z^{\log_x y} = 8. $$

What is the value of $(\log_2 x)(\log_2 y)(\log_2 z)$?

$$ \mathbf{A} \quad 27 $$
$$ \mathbf{B} \quad 18 $$
$$ \mathbf{C} \quad 8 $$
$$ \mathbf{D} \quad 16 $$
$$ \mathbf{E} \quad 32 $$
$$ \mathbf{F} \quad \text{not possible to determine} $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Let $a = \log_2 x$, $b = \log_2 y$, and $c = \log_2 z$. Then $x = 2^a$, $y = 2^b$, and $z = 2^c$.

Since $x$, $y$, and $z$ are not equal to 1, we have $a, b, c \neq 0$.

Now

$$ y^{\frac{c}{b}} = (2^b)^{\frac{c}{b}} = 2^c = z. $$

So $\log_y z = \frac{c}{b}$. Hence

$$ x^{\log_y z} = (2^a)^{\frac{c}{b}} = 2^{\frac{ac}{b}}. $$

Since $x^{\log_y z} = 8 = 2^3$, we get

$$ \frac{ac}{b} = 3. $$

Similarly, due to symmetry we get $\frac{ab}{c} = 3$ and $\frac{bc}{a} = 3$.

Multiplying the three equations gives

$$ \frac{ac}{b} \cdot \frac{ab}{c} \cdot \frac{bc}{a} = 27 \quad \Leftrightarrow \quad abc = 27 \quad \Leftrightarrow \quad (\log_2 x)(\log_2 y)(\log_2 z) = 27. $$
