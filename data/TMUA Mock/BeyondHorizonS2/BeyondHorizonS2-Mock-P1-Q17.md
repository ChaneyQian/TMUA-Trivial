---
database: TMUA
qid: 20132101212117
id: BeyondHorizonS2-Mock-P1-Q17
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
Consider six players $P_1, P_2, P_3, P_4, P_5$, and $P_6$. A team consists of two players (Thus, there are 15 distinct teams). Two teams play a match exactly once if there is no common player. For example, team $\{P_1, P_2\}$ cannot play with $\{P_2, P_3\}$, but will play with $\{P_4, P_5\}$. Then the total number of possible matches is
$$\mathbf{A} \quad 36$$
$$\mathbf{B} \quad 40$$
$$\mathbf{C} \quad 45$$
$$\mathbf{D} \quad 54$$
$$\mathbf{E} \quad 55$$
$$\mathbf{F} \quad 60$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
A match is an unordered pair of disjoint two-player teams, so it uses four distinct players split into two pairs. Choose the four players in $\binom{6}{4} = 15$ ways, then split them into two unordered pairs in $3$ ways, giving $15 \times 3 = 45$ matches. The same count follows by fixing a team: each of the $15$ teams is disjoint from the $\binom{4}{2} = 6$ teams formed from the remaining four players, and halving to avoid counting each match twice gives $\frac{15 \times 6}{2} = 45$. The answer is C. The usual slip is to leave $15 \times 6$ undivided, or to count ordered pairs, which lands on one of the larger options.
