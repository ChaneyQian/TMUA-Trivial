---
database: TMUA
qid: 20132101204019
id: Zack-Mock-Q19
paper: TMUA Mock
year:
number: Q19
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
A proper divisor of a number is a positive factor that is smaller than the number.
E.g. The proper divisors of 6 are 1,2,3
How many proper divisors does $30^4$ have?

$$
\mathbf{A} \quad 63
$$

$$
\mathbf{B} \quad 125
$$

$$
\mathbf{C} \quad 124
$$

$$
\mathbf{D} \quad 64
$$

$$
\mathbf{E} \quad \text{None of the above}
$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Factor the base before raising it to the fourth power:

$$ 30^{4} = (2\cdot3\cdot5)^{4} = 2^{4}\cdot3^{4}\cdot5^{4} $$

The number of divisors is the product of one more than each exponent:

$$ (4+1)(4+1)(4+1) = 5^{3} = 125 $$

A *proper* divisor excludes the number itself, so subtract one:

$$ 125-1 = 124 $$

The answer is C. Option B is the trap — that is the total divisor count, not the proper one.
