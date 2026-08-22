---
database: TMUA
qid: 20132101213204
id: BeyondHorizonS3-Mock-P2-Q4
paper: TMUA Mock
year:
number: Q4
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Three positive numbers $a, b, c$ satisfy $\log_b a = 2$, $\log_b (c-3) = 3$, $\log_a (c+5) = 2$. This information
$$\mathbf{A} \quad \text{specifies } a \text{ uniquely}$$
$$\mathbf{B} \quad \text{is satisfied by two values of } a$$
$$\mathbf{C} \quad \text{is satisfied by infinitely many values of } a$$
$$\mathbf{D} \quad \text{is contradictory}$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Rewrite each logarithm in exponential form. From $\log_b a = 2$ we get $a = b^2$; from $\log_b(c-3) = 3$ we get $c = b^3 + 3$; and from $\log_a(c+5) = 2$ we get $c + 5 = a^2 = b^4$.

Substituting the second into the third gives $b^3 + 8 = b^4$, that is
$$b^4 - b^3 - 8 = 0.$$
Trying $b = 2$ gives $16 - 8 - 8 = 0$, so $b - 2$ is a factor, and dividing out gives
$$b^4 - b^3 - 8 = (b-2)(b^3 + b^2 + 2b + 4).$$
For $b > 0$ every term of $b^3 + b^2 + 2b + 4$ is positive, so that cubic has no positive root. Hence $b = 2$ is the only admissible base, and then $a = b^2 = 4$ and $c = b^3 + 3 = 11$.

Checking: $\log_2 4 = 2$, $\log_2(11-3) = \log_2 8 = 3$, and $\log_4(11+5) = \log_4 16 = 2$, all valid with $a, b, c$ positive and the bases not equal to $1$. So the data are consistent and pin $a$ down to the single value $4$. The answer is A.
