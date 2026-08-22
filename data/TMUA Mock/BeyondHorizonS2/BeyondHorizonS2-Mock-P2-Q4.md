---
database: TMUA
qid: 20132101212204
id: BeyondHorizonS2-Mock-P2-Q4
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
In a football league, a particular team played 60 games in a season. The team never lost three games consecutively and never won five games consecutively in that season. If $N$ is the number of games the team won in that season, then $N$ satisfies
$$\mathbf{A} \quad 24 \leq N \leq 50$$
$$\mathbf{B} \quad 20 \leq N \leq 48$$
$$\mathbf{C} \quad 12 \leq N \leq 40$$
$$\mathbf{D} \quad 18 \leq N \leq 42$$
$$\mathbf{E} \quad 20 \leq N \leq 42$$
$$\mathbf{F} \quad 24 \leq N \leq 42$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Treat the season as a word of 60 letters in $W$ and $L$ in which no three consecutive $L$s and no five consecutive $W$s occur. The $N$ wins cut the sequence into $N + 1$ gaps, each holding at most two losses, so $60 - N \leq 2(N + 1)$, which rearranges to $3N \geq 58$ and hence $N \geq 20$ since $N$ is an integer. Symmetrically the $60 - N$ losses cut the sequence into $61 - N$ gaps, each holding at most four wins, so $N \leq 4(61 - N)$, giving $5N \leq 244$ and hence $N \leq 48$. Both endpoints are attained: repeating the block $LLW$ twenty times gives exactly 20 wins, and repeating the block $WWWWL$ twelve times gives exactly 48 wins, and neither pattern violates a constraint. The answer is B.
