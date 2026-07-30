---
database: TMUA
qid: 20132101207101
id: JZMaths_SetC-Mock-P1-Q1
paper: TMUA Mock
year:
number: Q1
section: Multiple Choice
difficulty: 5
topics: []
subtopics: []
tags: [Integration]
status: 已入库
---

## 题目
Find
$$ \int_{-1}^1 1 + 2x + 3x^2 + 4x^3 + ... + 11x^{10} dx. $$
$$ \mathbf{A} \quad 11 $$
$$ \mathbf{B} \quad 10 $$
$$ \mathbf{C} \quad 12 $$
$$ \mathbf{D} \quad 22 $$
$$ \mathbf{E} \quad 0 $$
$$ \mathbf{F} \quad 2 $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
The odd powered terms such as $4x^3$ integrate to $0$ over $[-1, 1]$ since they are odd functions.

So we only need to consider the even powers:

$$ \int_{-1}^1 1 + 3x^2 + 5x^4 + 7x^6 + 9x^8 + 11x^{10} dx. $$

For each even power term $(r + 1)x^r$, where $r = 0, 2, 4, 6, 8, 10$, we have

$$ \int_{-1}^1 (r + 1)x^r dx = 2 \int_0^1 (r + 1)x^r dx = 2[x^{r+1}]_0^1 = 2. $$

There are $6$ even power terms, so the integral is $6 \cdot 2 = 12$.
