---
database: TMUA
qid: 20132101203118
id: Yotta-Mock-P1-Q18
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
45 people are standing in a line. How many ways are there to choose 17 of them such that no two chosen people are next to each other, and order doesn't matter?

$$
\mathbf{A} \quad \frac{45!}{28!17!}
$$

$$
\mathbf{B} \quad \frac{43!}{26!17!}
$$

$$
\mathbf{C} \quad \frac{28!}{17!11!}
$$

$$
\mathbf{D} \quad \frac{29!}{17!12!}
$$

$$
\mathbf{E} \quad \frac{17!12!}{8!}
$$

$$
\mathbf{F} \quad \frac{2^{17}45!}{12!}
$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Line up the $45 - 17 = 28$ people who are *not* chosen. They create $29$ gaps — one before the first, one after the last, and $27$ between consecutive people. Dropping a chosen person into a gap, at most one per gap, guarantees no two chosen people are adjacent, and every valid selection arises exactly once this way.

So the count is the number of ways to pick $17$ of the $29$ gaps:

$$ \binom{29}{17} = \frac{29!}{17!\,12!} $$

(In general, choosing $k$ non-adjacent objects from a row of $n$ gives $\binom{n-k+1}{k}$.) The answer is D.
