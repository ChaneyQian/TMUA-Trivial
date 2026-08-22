---
database: TMUA
qid: 20132101203203
id: Yotta-Mock-P2-Q3
paper: TMUA Mock
year:
number: Q3
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Which of these statements is true about $x = 21222324252627$:
1. $x$ can be written as $p^2 + q^2$ where $p$ and $q$ are 2 distinct positive integers
2. $x$ can be written as $p^2 - q^2$ where $p$ and $q$ are 2 distinct positive integers
3. $x$ can be written as $p^2q^6$ where $p$ and $q$ are 2 distinct positive integers

$$
\mathbf{A} \quad \text{None}
$$

$$
\mathbf{B} \quad \text{1 only}
$$

$$
\mathbf{C} \quad \text{2 only}
$$

$$
\mathbf{D} \quad \text{3 only}
$$

$$
\mathbf{E} \quad \text{1 and 2 only}
$$

$$
\mathbf{F} \quad \text{1 and 3 only}
$$

$$
\mathbf{G} \quad \text{2 and 3 only}
$$

$$
\mathbf{H} \quad \text{1, 2 and 3}
$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
The last two digits of $x = 21222324252627$ are $27$, and $27 \equiv 3 \pmod 4$, so $x \equiv 3 \pmod 4$. That single observation settles two of the three statements.

**Statement 1.** Every square is $0$ or $1 \pmod 4$, so a sum of two squares is $0$, $1$ or $2 \pmod 4$ — never $3$. So $x$ is not a sum of two squares, and statement 1 is false.

**Statement 2.** Every odd number $x = 2m+1$ is a difference of two squares, since $(m+1)^{2} - m^{2} = 2m+1$. Here $x$ is odd and large, so $p = \frac{x+1}{2}$ and $q = \frac{x-1}{2}$ are distinct positive integers with $p^{2} - q^{2} = x$. Statement 2 is true.

**Statement 3.** $p^{2}q^{6} = \left(pq^{3}\right)^{2}$ is a perfect square, and perfect squares are $0$ or $1 \pmod 4$. Since $x \equiv 3$, statement 3 is false.

Only statement 2 holds, so the answer is C.
