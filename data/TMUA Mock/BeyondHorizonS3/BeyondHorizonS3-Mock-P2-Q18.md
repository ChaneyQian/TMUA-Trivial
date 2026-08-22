---
database: TMUA
qid: 20132101213218
id: BeyondHorizonS3-Mock-P2-Q18
paper: TMUA Mock
year:
number: Q18
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
A set of tiles numbered 1 through 100 is modified repeatedly by the following operation: remove all tiles numbered with a perfect square, and renumber the remaining tiles consecutively starting with 1. How many times must the operation be performed to reduce the number of tiles in the set to one?
$$\mathbf{A} \quad 10$$
$$\mathbf{B} \quad 11$$
$$\mathbf{C} \quad 18$$
$$\mathbf{D} \quad 19$$
$$\mathbf{E} \quad 20$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Because the tiles are renumbered $1, 2, \ldots$ after each pass, the only thing that matters is the count. If there are $t$ tiles, the number of perfect squares among $1, \ldots, t$ is $\lfloor \sqrt{t} \rfloor$, so one operation sends
$$t \longmapsto t - \lfloor \sqrt{t} \rfloor.$$

Iterating from $t = 100$:
$$100 \to 90 \to 81 \to 72 \to 64 \to 56 \to 49 \to 42 \to 36 \to 30 \to 25 \to 20 \to 16 \to 12 \to 9 \to 6 \to 4 \to 2 \to 1.$$
Counting the arrows gives $18$ operations, the eighteenth taking $2$ tiles down to $1$. The answer is C.
