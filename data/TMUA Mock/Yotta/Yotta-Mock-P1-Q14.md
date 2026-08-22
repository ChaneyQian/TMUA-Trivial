---
database: TMUA
qid: 20132101203114
id: Yotta-Mock-P1-Q14
paper: TMUA Mock
year:
number: Q14
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The digital root of a number is where you find the sum of the digits of a number, then find the sum of the answer, and repeat until you get a 1-digit number. For example, to find the digital root of 9678996 you do $9 + 6 + 7 + 8 + 9 + 9 + 6 = 54$, $5 + 4 = 9$, so its digital root is 9. What's the digital root of $7^{3935}$?

$$
\mathbf{A} \quad 1
$$

$$
\mathbf{B} \quad 2
$$

$$
\mathbf{C} \quad 3
$$

$$
\mathbf{D} \quad 4
$$

$$
\mathbf{E} \quad 5
$$

$$
\mathbf{F} \quad 6
$$

$$
\mathbf{G} \quad 7
$$

$$
\mathbf{H} \quad 8
$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Repeatedly summing digits computes the value modulo $9$, because $10 \equiv 1 \pmod 9$ makes a number congruent to its digit sum. So the digital root of $N$ is $N \bmod 9$, except that a residue of $0$ gives digital root $9$.

Powers of $7$ modulo $9$ cycle with period $3$:

$$ 7^{1} \equiv 7, \qquad 7^{2} \equiv 49 \equiv 4, \qquad 7^{3} \equiv 28 \equiv 1 \pmod 9 $$

Since $3935 = 3 \times 1311 + 2$, we get $7^{3935} \equiv 7^{2} \equiv 4 \pmod 9$.

The digital root is $4$, so the answer is D.
