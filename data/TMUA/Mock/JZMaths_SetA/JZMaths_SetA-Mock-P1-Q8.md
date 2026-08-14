---
database: TMUA
qid: 20132101205108
id: JZMaths_SetA-Mock-P1-Q8
paper: TMUA Mock
year:
number: Q8
section: Multiple Choice
difficulty: 7
topics: [Algebra (Basic)]
subtopics: [Surds and indices]
tags: [Exponentials-and-Logarithms]
status: 已入库
---

## 题目
Let $a$, $b$ and $c$ be positive integers satisfying
$$ 18^{a+c}6^{a+b+5} = 12^{b-2}18^5 6^{c+2}. $$
Find the value of $a+b+c$.
$$ \mathbf{A} \quad 5 $$
$$ \mathbf{B} \quad 6 $$
$$ \mathbf{C} \quad 7 $$
$$ \mathbf{D} \quad 8 $$
$$ \mathbf{E} \quad 9 $$
$$ \mathbf{F} \quad 10 $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Write each base as a product of powers of $2$ and $3$:
$$ 6 = 2 \cdot 3, \qquad 12 = 2^2 \cdot 3, \qquad 18 = 2 \cdot 3^2. $$

The left-hand side is
$$ 2^{(a+c)+(a+b+5)}3^{2(a+c)+(a+b+5)} = 2^{2a+b+c+5}3^{3a+b+2c+5}. $$

The right-hand side is
$$ 2^{2(b-2)+5+(c+2)}3^{(b-2)+10+(c+2)} = 2^{2b+c+3}3^{b+c+10}. $$

Equating the powers of $2$ gives
$$ 2a + b + c + 5 = 2b + c + 3, $$

so
$$ b = 2a + 2. $$

Equating the powers of $3$ gives

$$ 3a+b+2c+5=b+c+10, $$

so

$$ c=5-3a. $$

Therefore

$$ a+b+c=a+(2a+2)+(5-3a)=7. $$
