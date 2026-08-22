---
database: TMUA
qid: 20132101207217
id: JZMaths_SetC-Mock-P2-Q17
paper: TMUA Mock
year:
number: Q17
section: Multiple Choice
difficulty: 7.5
topics: [Number Theory, Algebra (Basic)]
subtopics: [Diophantine Equations, Algebra Manipulation]
tags: [Logic-Deduction, General-Algebra]
status: 已入库
---

## 题目
Determine the total number of ordered pairs of positive integers $(x,y)$ satisfying

$$ \frac{1}{x} + \frac{1}{y} = \frac{1}{9}. $$

$$ \mathbf{A} \quad 5 $$
$$ \mathbf{B} \quad 6 $$
$$ \mathbf{C} \quad 8 $$
$$ \mathbf{D} \quad 9 $$
$$ \mathbf{E} \quad 10 $$
$$ \mathbf{F} \quad 12 $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Clearing denominators gives $9(x + y) = xy$, so $xy - 9x - 9y = 0$.

Now, **crucially**, notice that we want to factorise this in some way so that we can enumerate the possible values of $x$ and $y$. This can be done by adding a constant to both sides. If $x = 9$, for example, then the $xy$ and $9y$ terms cancel, leaving $-81$. Hence the correct constant to add is $81$, which completes the factorisation, as this makes $(x - 9)$ a factor:

$$ xy - 9x - 9y + 81 = 81 \implies (x - 9)(y - 9) = 81. $$

Also, since $1/y > 0$, we have $1/x < 1/9$, so $x > 9$. Similarly, $y > 9$. Therefore, both $x - 9$ and $y - 9$ must be positive divisors of $81$.

Each positive divisor $d$ of $81$ gives exactly one solution

$$ x = 9 + d, \quad y = 9 + \frac{81}{d}, $$

and both values are automatically positive integers.

Since

$$ 81 = 3^4, $$

the number of positive divisors of $81$ is

$$ 4 + 1 = 5. $$

Therefore, there are $5$ ordered pairs.

**Remark:** This method of factorising an expression involving two variables is extremely useful for TMUA questions. It is covered, or will be covered, in the **Additional Useful Topics** section of my site. The question itself belongs to another well-known class of solvable Diophantine equations.
