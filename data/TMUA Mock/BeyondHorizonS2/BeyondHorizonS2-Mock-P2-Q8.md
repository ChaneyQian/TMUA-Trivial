---
database: TMUA
qid: 20132101212208
id: BeyondHorizonS2-Mock-P2-Q8
paper: TMUA Mock
year:
number: Q8
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Let $A_1, A_2, A_3$ be three points on a straight line. Let $B_1, B_2, B_3, B_4, B_5$ be five points on a straight line parallel to the first one. Each of the three points on the first line is joined by a straight line to each of the five points on the second line. Further, no three or more of these joining lines meet at a point except possibly at the $A$'s or the $B$'s. Then the number of points of intersections of the joining lines lying between the two given straight lines is
$$\mathbf{A} \quad 30$$
$$\mathbf{B} \quad 25$$
$$\mathbf{C} \quad 35$$
$$\mathbf{D} \quad 20$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
An intersection lying strictly between the two parallel lines is produced by two joining segments that share neither endpoint, so it is determined by a choice of two distinct points among the $A$'s together with two distinct points among the $B$'s. Given such a quadruple, exactly one of the two ways of pairing the chosen $A$'s with the chosen $B$'s produces segments that cross between the lines, so each quadruple contributes exactly one interior intersection, and the general-position hypothesis guarantees that these points are all distinct. The count is therefore
$$\binom{3}{2}\binom{5}{2} = 3 \times 10 = 30.$$
The answer is A.
