---
database: TMUA
qid: 20132101213216
id: BeyondHorizonS3-Mock-P2-Q16
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
The mean, median, unique mode, and range of a collection of eight integers are all equal to 8. The largest integer that can be an element of this collection is
$$\mathbf{A} \quad 11$$
$$\mathbf{B} \quad 12$$
$$\mathbf{C} \quad 13$$
$$\mathbf{D} \quad 14$$
$$\mathbf{E} \quad 15$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
List the eight integers in increasing order as $a_1 \leq a_2 \leq \cdots \leq a_8$. The mean being $8$ gives total $64$; the median being $8$ gives $a_4 + a_5 = 16$; the range being $8$ gives $a_8 = a_1 + 8$; and the unique mode is $8$.

To make $a_8$ as large as possible we must make $a_1$ as large as possible, since $a_8 = a_1 + 8$.

Try $a_8 = 15$, so $a_1 = 7$. The remaining six entries sum to $64 - 7 - 15 = 42$, an average of exactly $7$, and each is at least $a_1 = 7$; hence all six equal $7$. But then the median is $\tfrac{7+7}{2} = 7 \neq 8$, and the mode would be $7$. So $15$ is impossible.

Try $a_8 = 14$, so $a_1 = 6$. The collection
$$6,\; 6,\; 6,\; 8,\; 8,\; 8,\; 8,\; 14$$
has sum $64$ so mean $8$; median $\tfrac{8+8}{2} = 8$; range $14 - 6 = 8$; and $8$ occurs four times against three occurrences of $6$, so $8$ is the unique mode. All four conditions hold, so $14$ is attainable. The answer is D.
