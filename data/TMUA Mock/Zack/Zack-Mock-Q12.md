---
database: TMUA
qid: 20132101204012
id: Zack-Mock-Q12
paper: TMUA Mock
year:
number: Q12
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Find the sum of the solutions to
$$ 16^{\log_2 x} - 10 \times 27^{\log_3 x} + 35 \times 64^{\log_8 x} - 50x + 24 = 0 $$

$$
\mathbf{A} \quad 0
$$

$$
\mathbf{B} \quad 8
$$

$$
\mathbf{C} \quad 10
$$

$$
\mathbf{D} \quad 24
$$

$$
\mathbf{E} \quad 43
$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Each exponential collapses once you notice the base is a power of the logarithm's base. Using $a^{\log_{b}x} = x^{\log_{b}a}$:

$$ 16^{\log_{2}x} = 2^{4\log_{2}x} = x^{4}, \qquad 27^{\log_{3}x} = x^{3}, \qquad 64^{\log_{8}x} = 8^{2\log_{8}x} = x^{2} $$

So the equation becomes the quartic

$$ x^{4}-10x^{3}+35x^{2}-50x+24 = 0 $$

By Vieta the sum of its roots is $10$. That is already the answer, **provided** all roots are admissible — the logarithms require $x>0$. Factorising confirms it: the roots are $1, 2, 3, 4$, all positive.

The sum is $1+2+3+4 = 10$, so the answer is C.
