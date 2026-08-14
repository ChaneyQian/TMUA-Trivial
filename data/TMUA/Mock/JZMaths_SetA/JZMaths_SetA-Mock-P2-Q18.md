---
database: TMUA
qid: 20132101205218
id: JZMaths_SetA-Mock-P2-Q18
paper: TMUA Mock
year:
number: Q18
section: Multiple Choice
difficulty: 8
topics: [Function, Polynomial]
subtopics: [Exponentials and Logarithms, Symmetric and Cyclic Polynomials]
tags: [Logic-Deduction, Exponentials-and-Logarithms]
status: 已入库
---

## 题目
Let $a, b, c > 0$ with $a \neq 1$, $b \neq 1$ and $c \neq 1$. Consider the three equations

$$ \log_a b = c, \qquad \log_b c = a, \qquad \log_c a = b. $$

Which one of the following statements about the solutions $(a, b, c)$ of this system is correct?

$$ \mathbf{A} \quad \text{The equations specify } a\text{, } b \text{ and } c \text{ uniquely.} $$
$$ \mathbf{B} \quad \text{The equations specify the product } abc \text{ uniquely but have infinitely many solutions for } (a, b, c). $$
$$ \mathbf{C} \quad \text{The equations specify exactly one of } a\text{, } b\text{, } c \text{ uniquely but have infinitely many solutions for the other two.} $$
$$ \mathbf{D} \quad \text{The equations have no solutions.} $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
We are given

$$ \log_a b = c, \qquad \log_b c = a, \qquad \log_c a = b. $$

Since $a, b, c > 0$, the right hand sides are all positive. Therefore

$$ \log_a b > 0, \qquad \log_b c > 0, \qquad \log_c a > 0. $$

This means that in each logarithm, the base and the argument must be on the **same side of 1**.

So $a$ and $b$ are on the same side of $1$, $b$ and $c$ are on the same side of $1$, and $c$ and $a$ are on the same side of $1$.

Therefore either $a, b, c > 1$ or $0 < a, b, c < 1$.

Now rewrite the equations in exponential form: $b = a^c, \qquad c = b^a, \qquad a = c^b$.

First suppose

$$ a, b, c > 1. $$

Then $c > 1$, so $b = a^c > a$. Similarly, in a cyclic way, $c > b$ and $a > c$. Therefore $a < b < c < a$, this is not possible.

Therefore it must be the case that

$$ 0 < a, b, c < 1. $$

For a number between $0$ and $1$, raising it to a power less than $1$ makes it larger. Since $c < 1$, $b = a^c > a$, and similarly $c > b$ and $a > c$. So we get $a < b < c < a$, which again is impossible.

Therefore there are no solutions.
