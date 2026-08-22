---
database: TMUA
qid: 20132101214120
id: BeyondHorizonS4-Mock-P1-Q20
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
What is the degree of the following polynomial
$$\frac{d^2}{dx^2}\left[(3x - 2)^4(2 - x)^5\right] + \frac{d}{dx}\left[(3x + 2)^4(4x^2 - 3)^2\right]$$
$$\mathbf{A} \quad 11$$
$$\mathbf{B} \quad 10$$
$$\mathbf{C} \quad 9$$
$$\mathbf{D} \quad 8$$
$$\mathbf{E} \quad 7$$
$$\mathbf{F} \quad \text{less than } 7$$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
Only the leading terms matter. The first bracket has degree $4 + 5 = 9$ with leading term $(3x)^4(-x)^5 = -81x^9$, so differentiating twice leaves degree $7$ with leading coefficient $-81 \cdot 9 \cdot 8 = -5832$. The second bracket has degree $4 + 4 = 8$ with leading term $(3x)^4(4x^2)^2 = 81x^4 \cdot 16x^4 = 1296x^8$, so differentiating once leaves degree $7$ with leading coefficient $8 \cdot 1296 = 10368$. Adding the two $x^7$ terms,
$$-5832 + 10368 = 4536 \neq 0,$$
so the leading terms do not cancel and the degree is $7$. The answer is E. Option F is the trap: the question is built so that both pieces land on degree $7$ and invites you to assume the coefficients were arranged to annihilate each other, but they are not.
