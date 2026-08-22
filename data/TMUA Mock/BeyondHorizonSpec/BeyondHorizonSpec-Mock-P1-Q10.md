---
database: TMUA
qid: 20132101215110
id: BeyondHorizonSpec-Mock-P1-Q10
paper: TMUA Mock
year:
number: Q10
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
We flip a coin continuously until we either see HHH or THH. If we see HHH before THH we win, otherwise we lose. What is the probability of winning?
$$\mathbf{A} \quad \frac{1}{2}$$
$$\mathbf{B} \quad \frac{3}{8}$$
$$\mathbf{C} \quad \frac{1}{8}$$
$$\mathbf{D} \quad \frac{5}{12}$$
$$\mathbf{E} \quad \frac{1}{4}$$
$$\mathbf{F} \quad \frac{3}{4}$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
The key observation is that HHH can only ever win on the first three tosses. Suppose a tail has occurred at some point before HHH is completed. Any later occurrence of HHH would have to contain two consecutive heads somewhere after that tail, and the very first time two consecutive heads appear after a tail the pattern THH is already complete, so the game has ended in a loss before HHH could form. Winning therefore requires the first three tosses to be HHH, which happens with probability $\left(\frac{1}{2}\right)^3 = \frac{1}{8}$. The answer is C.
