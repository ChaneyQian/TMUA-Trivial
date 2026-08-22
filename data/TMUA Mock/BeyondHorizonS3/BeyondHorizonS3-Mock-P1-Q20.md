---
database: TMUA
qid: 20132101213120
id: BeyondHorizonS3-Mock-P1-Q20
paper: TMUA Mock
year:
number: Q20
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
What is the value of this expression ($q \neq 1$)
$$(1+q)(1+q^2)(1+q^4)(1+q^8)(1+q^{16})(1+q^{32})(1+q^{64})$$
$$\mathbf{A} \quad \frac{1-q^{128}}{1-q}$$
$$\mathbf{B} \quad \frac{1-q^{64}}{1-q}$$
$$\mathbf{C} \quad \frac{1-q^{2^{1+2+\cdots+6}}}{1-q}$$
$$\mathbf{D} \quad \text{none of the foregoing expressions}$$
$$\mathbf{E} \quad \frac{1-q^{2^{64}}}{1-q}$$
$$\mathbf{F} \quad \frac{1-q^{128}}{1+q}$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Multiply the product by $1-q$ and telescope using the difference of two squares repeatedly: $(1-q)(1+q) = 1-q^2$, then $(1-q^2)(1+q^2) = 1-q^4$, and so on, each step doubling the exponent. There are seven factors, with exponents $2^0$ through $2^6$, so after all seven steps the exponent has doubled seven times from $1$ to $2^7 = 128$, giving $(1-q)\cdot P = 1 - q^{128}$. Since $q \neq 1$ we may divide, and $P = \frac{1-q^{128}}{1-q}$. The answer is A. Option C is the trap for anyone who adds the exponents' indices instead of noticing that the exponents themselves sum to $1+2+4+\cdots+64 = 127$, so that the final exponent is $128$ rather than $2^{21}$.
