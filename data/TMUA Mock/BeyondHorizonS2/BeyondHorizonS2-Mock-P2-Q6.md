---
database: TMUA
qid: 20132101212206
id: BeyondHorizonS2-Mock-P2-Q6
paper: TMUA Mock
year:
number: Q6
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
From a group of seven persons, seven committees are formed. Any two committees have exactly one member in common. Each person is in exactly three committees. Then
$$\mathbf{A} \quad \text{at least one committee must have more than three members}$$
$$\mathbf{B} \quad \text{each committee must have exactly three members}$$
$$\mathbf{C} \quad \text{each committee must have more than three members}$$
$$\mathbf{D} \quad \text{nothing can be said about the sizes of the committees}$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Fix one committee $C$ and let $k$ be its size. Each of the six remaining committees meets $C$ in exactly one person, so counting pairs consisting of another committee together with its common member with $C$ gives six such pairs. Counting the same pairs from the other side, every person of $C$ belongs to exactly three committees and hence to exactly two committees other than $C$, contributing exactly two pairs. Therefore $2k = 6$ and $k = 3$. The committee $C$ was arbitrary, so every committee has exactly three members. As a consistency check, the total number of memberships is $7 \times 3 = 21$, which matches seven committees of size three. The answer is B.
