---
database: TMUA
qid: 20132101213210
id: BeyondHorizonS3-Mock-P2-Q10
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
A hockey team consists of 1 goalkeeper, 4 defenders, 4 midfielders and 2 forwards. There are 4 substitutes: 1 goalkeeper, 1 defender, 1 midfielder and 1 forward. A substitute may only replace a player of the same category (e.g., midfielder for midfielder). Given that a maximum of 3 substitutes may be used and that there are still 11 players on the pitch at the end, how many different teams could finish the game?
$$\mathbf{A} \quad 110$$
$$\mathbf{B} \quad 118$$
$$\mathbf{C} \quad 121$$
$$\mathbf{D} \quad 125$$
$$\mathbf{E} \quad 132$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Each category has exactly one substitute, so within a category the substitute is either unused or used, and if used there is a choice of which starter he replaces. The number of ways to use the substitute in a given category is therefore: goalkeeper $1$ way (only one goalkeeper to replace), defender $4$ ways, midfielder $4$ ways, forward $2$ ways.

Since each substitute can be used at most once and the categories are independent, choosing a set of $k$ categories in which a substitution occurs and then choosing the displaced player in each gives, for $k$ substitutions, the sum of the products of the weights $\{1, 4, 4, 2\}$ taken $k$ at a time.

With $k = 0$ there is $1$ finishing team. With $k = 1$ we get $1 + 4 + 4 + 2 = 11$. With $k = 2$ we get
$$1\cdot4 + 1\cdot4 + 1\cdot2 + 4\cdot4 + 4\cdot2 + 4\cdot2 = 4+4+2+16+8+8 = 42.$$
With $k = 3$ we get $1\cdot4\cdot4 + 1\cdot4\cdot2 + 1\cdot4\cdot2 + 4\cdot4\cdot2 = 16+8+8+32 = 64$.

At most $3$ substitutes may be used, so we stop there and add: $1 + 11 + 42 + 64 = 118$. The answer is B.
