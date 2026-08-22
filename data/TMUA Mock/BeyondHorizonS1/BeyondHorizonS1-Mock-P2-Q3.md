---
database: TMUA
qid: 20132101211203
id: BeyondHorizonS1-Mock-P2-Q3
paper: TMUA Mock
year:
number: Q3
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
A club with $x$ members is organized into four committees according to the following rules:
> (i) Each member belongs to exactly two committees.
>
> (ii) Each pair of committees has exactly one member in common.

Then:
$$\mathbf{A} \quad x=4$$
$$\mathbf{B} \quad x=6$$
$$\mathbf{C} \quad x=8$$
$$\mathbf{D} \quad x \text{ cannot be determined from the given information.}$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
By rule (i) every member sits on exactly two committees, so each member determines exactly one unordered pair of committees. Two distinct members cannot determine the same pair, because then that pair of committees would share two members, contradicting rule (ii); and every pair of committees must be determined by some member, since by rule (ii) each pair has a member in common. The map from members to pairs of committees is therefore a bijection, so $x$ equals the number of pairs chosen from four committees, namely $\binom{4}{2}=6$. The answer is B.
