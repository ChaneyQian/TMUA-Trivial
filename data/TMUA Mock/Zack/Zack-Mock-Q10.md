---
database: TMUA
qid: 20132101204010
id: Zack-Mock-Q10
paper: TMUA Mock
year:
number: Q10
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Find the units digit of $34657^{267} + 81$.

$$
\mathbf{A} \quad 0
$$

$$
\mathbf{B} \quad 1
$$

$$
\mathbf{C} \quad 2
$$

$$
\mathbf{D} \quad 3
$$

$$
\mathbf{E} \quad 4
$$

$$
\mathbf{F} \quad 5
$$

$$
\mathbf{G} \quad 6
$$

$$
\mathbf{H} \quad 7
$$

$$
\mathbf{I} \quad 8
$$

$$
\mathbf{J} \quad 9
$$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
Only the units digit of the base matters, so work with $7^{267}$.

Powers of $7$ end in $7, 9, 3, 1$ and then repeat with period $4$. Since $267 = 4(66)+3$, the exponent sits at position $3$ in the cycle, so $34657^{267}$ ends in $3$.

Adding $81$, whose units digit is $1$, gives units digit $3+1 = 4$.

The answer is E.
