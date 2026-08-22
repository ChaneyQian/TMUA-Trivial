---
database: TMUA
qid: 20132101215109
id: BeyondHorizonSpec-Mock-P1-Q9
paper: TMUA Mock
year:
number: Q9
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
We have a deck of cards. Select 2 cards. What is the probability that cards do not have the same value (for instance, choosing two 3s or two Aces)?
$$\mathbf{A} \quad \frac{11}{17}$$
$$\mathbf{B} \quad \frac{12}{17}$$
$$\mathbf{C} \quad \frac{13}{17}$$
$$\mathbf{D} \quad \frac{14}{17}$$
$$\mathbf{E} \quad \frac{15}{17}$$
$$\mathbf{F} \quad \frac{16}{17}$$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
It is easier to compute the complement. Fix the first card; whatever it is, three of the remaining 51 cards share its value, so the probability of a matching pair is $\frac{3}{51} = \frac{1}{17}$. Equivalently, the 13 values each supply $\binom{4}{2} = 6$ matching pairs, giving $\frac{13 \times 6}{\binom{52}{2}} = \frac{78}{1326} = \frac{1}{17}$. The required probability is therefore $1 - \frac{1}{17} = \frac{16}{17}$. The answer is F.
