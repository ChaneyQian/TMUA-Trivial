---
database: TMUA
qid: 20132101215118
id: BeyondHorizonSpec-Mock-P1-Q18
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
Twelve students of distinct heights are lining up for a picture. It is required that two shortest students stand in the center positions and the remaining students line up such that the heights strictly ascend outwards. How many ways are there for the students to line up?
$$\mathbf{A} \quad \binom{10}{5}$$
$$\mathbf{B} \quad \binom{12}{6}$$
$$\mathbf{C} \quad 2\binom{10}{5}$$
$$\mathbf{D} \quad 2\binom{12}{6}$$
$$\mathbf{E} \quad 4\binom{10}{5}$$
$$\mathbf{F} \quad 4\binom{12}{6}$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
The line has twelve places, and the condition splits it into a left half of six places and a right half of six, with heights increasing as one moves outwards from the middle in each direction. Once we decide which six students occupy the left half and which six occupy the right half, the order within each half is completely forced, so the only freedom lies in the split. The extra requirement that the two shortest students take the two central places says exactly that one of them heads each half: the shortest student overall goes to one side and the second shortest to the other. There are 2 ways to decide which of those two goes left, and then the remaining ten students must be split five to the left and five to the right, in $\binom{10}{5}$ ways. Hence the total is $2\binom{10}{5}$. The answer is C.
