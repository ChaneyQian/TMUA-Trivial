---
database: TMUA
qid: 20132101213107
id: BeyondHorizonS3-Mock-P1-Q7
paper: TMUA Mock
year:
number: Q7
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Three boys of class I, 4 boys of class II and 5 boys of class III sit in a row. The number of ways they can sit, so that boys of the same class sit together is
$$\mathbf{A} \quad 3!4!5!$$
$$\mathbf{B} \quad \frac{(12)!}{3!4!5!}$$
$$\mathbf{C} \quad (3!)^2 4!5!$$
$$\mathbf{D} \quad 3 \times 4!5!$$
$$\mathbf{E} \quad (4!)^2 5!6!$$
$$\mathbf{F} \quad 3!(4!)^2 5!$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Treat each class as a single block, since its members must be consecutive. There are three blocks, so they can be ordered along the row in $3!$ ways. Within the blocks the boys may be permuted freely and independently: $3!$ ways inside the class I block, $4!$ inside class II and $5!$ inside class III. Multiplying gives $3! \times 3! \times 4! \times 5! = (3!)^2 4! 5!$. The answer is C. Option A is the trap for anyone who counts the internal arrangements but forgets that the three blocks themselves can be permuted, which contributes the second factor of $3!$.
