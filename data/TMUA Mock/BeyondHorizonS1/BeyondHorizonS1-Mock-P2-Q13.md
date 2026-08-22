---
database: TMUA
qid: 20132101211213
id: BeyondHorizonS1-Mock-P2-Q13
paper: TMUA Mock
year:
number: Q13
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
A set of tiles numbered 1 through 100 is modified repeatedly by the following operation: remove all tiles numbered with a perfect square and renumber the remaining tiles consecutively starting with 1. How many times must the operation be performed to reduce the number of tiles in the set to one?
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
Because the tiles are always renumbered $1,2,\dots,N$, one application of the operation removes exactly the perfect squares in that range, of which there are $\lfloor\sqrt{N}\rfloor$, so the operation is the map
$$N\mapsto N-\lfloor\sqrt{N}\rfloor.$$
Iterating from $N=100$ gives the chain $100\to 90\to 81\to 72\to 64\to 56\to 49\to 42\to 36\to 30\to 25\to 20\to 16\to 12\to 9\to 6\to 4\to 2\to 1$. Counting the arrows in that chain gives $18$ operations, the last of which removes the single tile numbered $1$ from a pair. The answer is C.
