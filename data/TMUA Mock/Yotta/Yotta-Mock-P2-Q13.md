---
database: TMUA
qid: 20132101203213
id: Yotta-Mock-P2-Q13
paper: TMUA Mock
year:
number: Q13
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
A word is *good* **if and only if** it consists of no letters other than A,B,C,D.
Examples: AABDC or CCCB or AB or ABDBCDA. How many 5-letter *good* words have at least one A and at least one C? (order matters, so ABCDA and ADCBA are distinct)

$$
\mathbf{A} \quad 0
$$

$$
\mathbf{B} \quad 32
$$

$$
\mathbf{C} \quad 160
$$

$$
\mathbf{D} \quad 256
$$

$$
\mathbf{E} \quad 570
$$

$$
\mathbf{F} \quad 813
$$

$$
\mathbf{G} \quad 1024
$$

$$
\mathbf{H} \quad 1280
$$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
There are $4^{5} = 1024$ good words of length $5$ in total. Count those that fail the requirement and subtract.

By inclusion–exclusion, the number of words missing an $A$ or missing a $C$ (or both) is

$$ 3^{5} + 3^{5} - 2^{5} = 243 + 243 - 32 = 454 $$

the two $3^{5}$ terms counting words drawn from $\{B,C,D\}$ and from $\{A,B,D\}$, and $2^{5}$ correcting for the words over $\{B,D\}$ counted twice.

So the number with at least one $A$ and at least one $C$ is

$$ 1024 - 454 = 570 $$

The answer is E.
