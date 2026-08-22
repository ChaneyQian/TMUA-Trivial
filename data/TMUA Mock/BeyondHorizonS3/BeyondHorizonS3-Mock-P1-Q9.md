---
database: TMUA
qid: 20132101213109
id: BeyondHorizonS3-Mock-P1-Q9
paper: TMUA Mock
year:
number: Q9
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The coefficient of $x^4$ in the expansion of $(1 + x - 2x^2)^7$ is
$$\mathbf{A} \quad -81$$
$$\mathbf{B} \quad -91$$
$$\mathbf{C} \quad 81$$
$$\mathbf{D} \quad 91$$
$$\mathbf{E} \quad 101$$
$$\mathbf{F} \quad -101$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
The quadratic factorises, $1 + x - 2x^2 = (1 + 2x)(1 - x)$, so the expression is $(1+2x)^7 (1-x)^7$ and the coefficient of $x^4$ is $\sum_{j=0}^{4} \binom{7}{j} 2^j \binom{7}{4-j}(-1)^{4-j}$. Term by term this is $1 \cdot 35 = 35$ for $j = 0$, then $14 \cdot (-35) = -490$, then $84 \cdot 21 = 1764$, then $280 \cdot (-7) = -1960$, and finally $560 \cdot 1 = 560$. Adding gives $35 - 490 + 1764 - 1960 + 560 = -91$. The answer is B. Option D is the trap for anyone who loses a sign in the $(1-x)^7$ factor, and option A for anyone who drops one of the middle terms.
