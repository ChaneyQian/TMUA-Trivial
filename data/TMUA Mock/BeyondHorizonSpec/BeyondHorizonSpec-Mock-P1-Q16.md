---
database: TMUA
qid: 20132101215116
id: BeyondHorizonSpec-Mock-P1-Q16
paper: TMUA Mock
year:
number: Q16
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Suppose you are continually rolling a fair 8-sided die. What is the probability that all of the odd values show up before the first even value?
$$\mathbf{A} \quad \frac{1}{70}$$
$$\mathbf{B} \quad \frac{1}{60}$$
$$\mathbf{C} \quad \frac{1}{50}$$
$$\mathbf{D} \quad \frac{1}{40}$$
$$\mathbf{E} \quad \frac{1}{30}$$
$$\mathbf{F} \quad \frac{1}{20}$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Record, for each of the eight faces, the moment at which it first appears. Because the die is fair and the rolls are independent, the eight faces are exchangeable, so the order in which they first appear is a uniformly random permutation of the eight faces. The event described is exactly that the four odd faces all come before the four even faces in that permutation. The number of orderings placing one specified block of four ahead of the other four is $4! \times 4!$ out of $8!$, so the probability is
$$\frac{4!\,4!}{8!} = \frac{1}{\binom{8}{4}} = \frac{1}{70}.$$
The answer is A.
