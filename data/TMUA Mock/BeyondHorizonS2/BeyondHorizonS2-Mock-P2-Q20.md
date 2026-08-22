---
database: TMUA
qid: 20132101212220
id: BeyondHorizonS2-Mock-P2-Q20
paper: TMUA Mock
year:
number: Q20
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
A base-10 three-digit number $n$ is selected at random. Which of the following is closest to the probability that the base-9 representation and the base-11 representation of $n$ are both three-digit numerals?
$$\mathbf{A} \quad 0.3$$
$$\mathbf{B} \quad 0.4$$
$$\mathbf{C} \quad 0.5$$
$$\mathbf{D} \quad 0.6$$
$$\mathbf{E} \quad 0.7$$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
The sample space is the $900$ integers from $100$ to $999$. A number has a three-digit base-9 numeral exactly when $9^2 \leq n \leq 9^3 - 1$, that is $81 \leq n \leq 728$, and a three-digit base-11 numeral exactly when $11^2 \leq n \leq 11^3 - 1$, that is $121 \leq n \leq 1330$. Intersecting both of these with $100 \leq n \leq 999$ leaves $121 \leq n \leq 728$, a run of $728 - 121 + 1 = 608$ integers. The probability is
$$\frac{608}{900} \approx 0.676,$$
which is nearer to $0.7$ than to $0.6$. The answer is E.
