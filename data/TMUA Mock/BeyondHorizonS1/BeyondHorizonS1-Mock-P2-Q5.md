---
database: TMUA
qid: 20132101211205
id: BeyondHorizonS1-Mock-P2-Q5
paper: TMUA Mock
year:
number: Q5
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Consider the sequence: $a_1=101, a_2=10101, a_3=1010101,\dots$. Then $a_k$ is a composite number (that is, not a prime number):
$$\mathbf{A} \quad \text{if and only if } k\geq 2 \text{ and } 11 \text{ divides } 10^{k+1}+1;$$
$$\mathbf{B} \quad \text{if and only if } k\geq 2 \text{ and } 11 \text{ divides } 10^{k+1}-1;$$
$$\mathbf{C} \quad \text{if and only if } k\geq 2 \text{ and } k-2 \text{ is divisible by } 3;$$
$$\mathbf{D} \quad \text{if and only if } k\geq 2.$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Reading off the digits, $a_k=\sum_{j=0}^{k}100^{j}=\frac{100^{k+1}-1}{99}=\frac{(10^{k+1}-1)(10^{k+1}+1)}{9\cdot 11}$. When $k+1$ is odd the factor $11$ divides $10^{k+1}+1$, and the identity splits as
$$a_k=\frac{10^{k+1}-1}{9}\cdot\frac{10^{k+1}+1}{11},$$
in which both factors exceed $1$ once $k\geq 2$, so $a_k$ is composite. When $k+1$ is even the factor $11$ divides $10^{k+1}-1$ instead, and
$$a_k=\frac{10^{k+1}-1}{99}\cdot\left(10^{k+1}+1\right),$$
whose first factor equals $1$ only for $k=1$ and exceeds $1$ for every odd $k\geq 3$, again giving a composite. Since $a_1=101$ is prime, compositeness is equivalent to $k\geq 2$ alone, and the divisibility clauses in A, B and C are spurious: for instance $a_3=101\times 73\times 137$ is composite although $11\nmid 10^4+1$ and $3\nmid k-2$. The answer is D.
