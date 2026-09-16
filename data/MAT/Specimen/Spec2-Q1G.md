---
database: MAT
qid: 90010310107
id: Spec2-Q1G
paper: MAT Specimen 2
year: 2009
number: Q1G
section: Multiple Choice
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: [重复题]
duplicate_of: MAT/2005/05-Q1H.md
status: 已入库
---
## 题目
The four digit number $2652$ is such that any two consecutive digits from it make a multiple of $13$. Another number $N$ has this same property, is $100$ digits long, and begins in a $9$. What is the last digit of $N$?
(a) $2$
(b) $3$
(c) $6$
(d) $9$

## 备注

### 我的备注

### AI备注
本题与 `MAT/2005/05-Q1H.md` 是同一道题——牛津样卷是从 1996–2006 历年真题里挑题拼成的。已打 `重复题` 标签、排除出组卷池，避免随机组卷时同题出现两次。本条保留的价值在于**解析是原卷官方版**（Dr. Richard Earl），而孪生题的解析是自撰的。

## 答案
D

## 解析
The two-digit multiples of $13$ are
$$
13,\ 26,\ 39,\ 52,\ 65,\ 78,\ 91.
$$
So if $N$ begins with a $9$ its first two digits must be $91$, its second and third must be $13$, its third and fourth $39$, its fourth and fifth $91$, etc. We can see that $N$ must begin
$$
913913913\ldots
$$
Going through this repeating pattern of $913$ for $100$ digits we will have $33$ lots of $913$ making up the first $99$ digits, and the $100$th digit will be a $9$. The answer is (d).
