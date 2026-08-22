---
database: TMUA
qid: 20132101203211
id: Yotta-Mock-P2-Q11
paper: TMUA Mock
year:
number: Q11
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
A *repunit* is an integer consisting of only ones. Examples: $1111$ or $1$ or $11111111$.
Complete the sentence: A repunit with $n$ digits ($n > 0$) is divisible by 7 **if and only if...**

$$
\mathbf{A} \quad n \text{ is a multiple of 3}
$$

$$
\mathbf{B} \quad n \text{ is a multiple of 6}
$$

$$
\mathbf{C} \quad n \text{ is a multiple of 7}
$$

$$
\mathbf{D} \quad n \text{ is a multiple of 12}
$$

$$
\mathbf{E} \quad n \text{ is of the form } 4k + 6 \text{ where } k \text{ is a non-negative integer}
$$

$$
\mathbf{F} \quad n \text{ is of the form } 2k + 4 \text{ where } k \text{ is a non-negative integer}
$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
The repunit with $n$ digits is $R_{n} = \frac{10^{n} - 1}{9}$. Since $\gcd(9,7) = 1$, we have $7 \mid R_{n}$ exactly when $7 \mid 10^{n} - 1$, that is when

$$ 10^{n} \equiv 1 \pmod 7 $$

Now $10 \equiv 3 \pmod 7$, and the powers of $3$ modulo $7$ are

$$ 3,\; 2,\; 6,\; 4,\; 5,\; 1,\; 3,\; 2,\; \dots $$

so the multiplicative order of $10$ modulo $7$ is $6$. A power is congruent to $1$ precisely when the exponent is a multiple of the order, so $7 \mid R_{n}$ if and only if $6 \mid n$.

The answer is B. (Checking directly: $111111 = 7 \times 15873$, while none of $1, 11, 111, 1111, 11111$ is divisible by $7$.)
