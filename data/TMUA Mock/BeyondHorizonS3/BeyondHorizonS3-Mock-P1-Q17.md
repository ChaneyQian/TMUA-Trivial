---
database: TMUA
qid: 20132101213117
id: BeyondHorizonS3-Mock-P1-Q17
paper: TMUA Mock
year:
number: Q17
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The number of terms in the expansion of $(x + y + z + w)^{10}$ is
$$\mathbf{A} \quad \binom{10}{4}$$
$$\mathbf{B} \quad \binom{13}{3}$$
$$\mathbf{C} \quad \binom{14}{4}$$
$$\mathbf{D} \quad 11^4$$
$$\mathbf{E} \quad \binom{12}{2}$$
$$\mathbf{F} \quad \binom{15}{3}$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
After collecting like terms, the distinct monomials are exactly $x^a y^b z^c w^d$ with $a, b, c, d$ non-negative integers summing to $10$, and distinct exponent vectors give distinct monomials. Counting such solutions is the standard stars-and-bars problem: $10$ identical stars separated by $3$ bars, giving $\binom{10+3}{3} = \binom{13}{3} = 286$ terms. The answer is B. Option D is the trap for anyone who multiplies the $11$ possible values of each exponent independently, which badly overcounts because the four exponents are constrained to sum to $10$.
