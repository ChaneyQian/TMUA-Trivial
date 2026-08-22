---
database: TMUA
qid: 20132101211108
id: BeyondHorizonS1-Mock-P1-Q8
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
There are seven greeting cards, each of a different colour, and seven envelopes of the same seven colours. The number of ways in which the cards can be put in the envelopes, so that exactly four of the cards go into the envelopes of the right colours, is
$$\mathbf{A} \quad \binom{7}{3}$$
$$\mathbf{B} \quad 2\binom{7}{3}$$
$$\mathbf{C} \quad (3!)\binom{4}{3}$$
$$\mathbf{D} \quad (3!)\binom{7}{3}\binom{4}{3}$$
$$\mathbf{E} \quad (3!)\binom{7}{3}$$
$$\mathbf{F} \quad (4!)\binom{7}{3}$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
First choose which four cards are correctly placed, which can be done in $\binom{7}{4} = \binom{7}{3}$ ways. The remaining three cards must then all be wrong, so they must be deranged among their three envelopes. The number of derangements of three objects is
$$D_3 = 3!\left(1 - \frac{1}{1!} + \frac{1}{2!} - \frac{1}{3!}\right) = 2$$
which one can also see directly: the only fixed-point-free permutations of three items are the two $3$-cycles. Multiplying gives $2\binom{7}{3} = 70$ arrangements. The answer is B. Option E is the trap for anyone who allows all $3! = 6$ permutations of the remaining cards, which would also count cases with five, six or seven correct placements.
