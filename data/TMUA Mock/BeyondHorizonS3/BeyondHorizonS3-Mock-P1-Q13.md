---
database: TMUA
qid: 20132101213113
id: BeyondHorizonS3-Mock-P1-Q13
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
A club with $x$ members is organized into four committees according to the following rules:

1. Each member belongs to exactly two committees.
2. Each pair of committees has exactly one member in common.

Then
$$\mathbf{A} \quad x = 4$$
$$\mathbf{B} \quad x = 6$$
$$\mathbf{C} \quad x = 8$$
$$\mathbf{D} \quad x \text{ cannot be determined from the given information}$$
$$\mathbf{E} \quad x = 10$$
$$\mathbf{F} \quad x = 12$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Each member sits on exactly two committees, so every member determines a unique unordered pair of committees — the pair he belongs to. Conversely, rule 2 says every pair of committees contains exactly one common member, and that member is on both, hence is the member assigned to that pair. This sets up a bijection between club members and pairs of committees, so $x = \binom{4}{2} = 6$. The construction is realisable: label the members by the pairs $\{1,2\}, \{1,3\}, \{1,4\}, \{2,3\}, \{2,4\}, \{3,4\}$ and put each on the two committees named in its label, giving four committees of three members each. The answer is B. Option D is the trap for anyone who suspects the conditions are too loose to pin the number down.
