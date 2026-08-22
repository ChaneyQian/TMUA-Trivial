---
database: TMUA
qid: 20132101212118
id: BeyondHorizonS2-Mock-P1-Q18
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
If $(\log_3 x)(\log_4 x)(\log_5 x) = (\log_3 x)(\log_4 x) + (\log_4 x)(\log_5 x) + (\log_5 x)(\log_3 x)$ and $x \neq 1$, then $x$ is
$$\mathbf{A} \quad 10$$
$$\mathbf{B} \quad 100$$
$$\mathbf{C} \quad 50$$
$$\mathbf{D} \quad 60$$
$$\mathbf{E} \quad 80$$
$$\mathbf{F} \quad 90$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Because $x \neq 1$, none of $\log_3 x$, $\log_4 x$, $\log_5 x$ is zero, so both sides may be divided by the product $(\log_3 x)(\log_4 x)(\log_5 x)$. Each term on the right loses two of its factors and leaves the reciprocal of the third:
$$1 = \frac{1}{\log_5 x} + \frac{1}{\log_3 x} + \frac{1}{\log_4 x} = \log_x 5 + \log_x 3 + \log_x 4 = \log_x 60.$$
Hence $x^1 = 60$, i.e. $x = 60$. The answer is D. The trap is to combine the three bases additively, or to assume base $10$ by reflex and pick A; the correct combination is the product $3 \times 4 \times 5$.
