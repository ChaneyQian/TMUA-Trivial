---
database: TMUA
qid: 20132101211119
id: BeyondHorizonS1-Mock-P1-Q19
paper: TMUA Mock
year:
number: Q19
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
All the letters of the word PESSIMISTIC are to be arranged so that no two S's, no two I's, and S and I do not occur together. The number of such arrangements is
$$\mathbf{A} \quad 1800$$
$$\mathbf{B} \quad 5480$$
$$\mathbf{C} \quad 4800$$
$$\mathbf{D} \quad 1200$$
$$\mathbf{E} \quad 2400$$
$$\mathbf{F} \quad 1801$$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
The word has $11$ letters: three S's, three I's, and the five distinct letters P, E, M, T, C. The three conditions together say that no two of the six letters taken from $\{S, I\}$ may be adjacent to one another, so those six letters must be separated by the other five. Arrange the five distinct letters first, which can be done in $5! = 120$ ways; this creates exactly $6$ gaps, counting the two ends. Each gap may hold at most one of the six S/I letters, and there are exactly six of them, so every gap is filled with exactly one, and the only remaining choice is which three of the six gaps receive an S:
$$\binom{6}{3} = 20$$
The total is $120 \times 20 = 2400$. The answer is E. Option D is exactly half of this and is the trap for anyone who divides once more by a factor of $2$ on account of the repeated letters, which have already been accounted for by choosing gaps rather than permuting the S's and I's.
