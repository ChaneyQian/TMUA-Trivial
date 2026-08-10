---
database: TMUA
qid: 20132101206109
id: JZMaths_SetB-Mock-P1-Q9
paper: TMUA Mock
year:
number: Q9
section: Multiple Choice
difficulty: 7
topics: [Algebra (Basic)]
subtopics: [Surds and indices]
tags: [Exponentials and Logarithms, General Algebra, Logic Equivalence]
status: 已入库
---

## 题目
Let $a$, $b$ and $c$ be non-zero integers. The expression

$$ \frac{6^{a+b+c} \cdot 10^{a-b-c}}{15^{a-b+c}} $$

is a positive integer if which of the following is true?

$$ \mathbf{A} \quad a > 0, b > 0 \text{ and } c < 0 $$
$$ \mathbf{B} \quad a > 0, b > 0 \text{ and } c > 0 $$
$$ \mathbf{C} \quad a > 0, b < 0 \text{ and } c < 0 $$
$$ \mathbf{D} \quad a < 0, b > 0 \text{ and } c < 0 $$
$$ \mathbf{E} \quad a < 0, b < 0 \text{ and } c > 0 $$
$$ \mathbf{F} \quad a < 0, b < 0 \text{ and } c < 0 $$
$$ \mathbf{G} \quad a > 0 \text{ and } c < 0 \text{ (no condition on } b) $$
$$ \mathbf{H} \quad c < 0 \text{ only (no conditions on } a \text{ or } b) $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Disclaimer: this is a variation of a TMUA specimen question, a type of question which I felt is very useful to practice more of, so here it is!

Factor each base into primes: $6 = 2 \cdot 3$, $10 = 2 \cdot 5$, $15 = 3 \cdot 5$.

The exponent of each prime in the expression is:

$$ \text{prime } 2 : (a + b + c) + (a - b - c) = 2a, $$
$$ \text{prime } 3 : (a + b + c) - (a - b + c) = 2b, $$
$$ \text{prime } 5 : (a - b - c) - (a - b + c) = -2c. $$

So the expression equals $2^{2a} \cdot 3^{2b} \cdot 5^{-2c}$.

This is a positive integer if and only if every prime exponent is non-negative, i.e. $2a\geq 0$, $2b\geq 0$ and $-2c\geq 0$. Since $a,b,c$ are non-zero integers, this is equivalent to $a>0$, $b>0$ and $c<0$.
