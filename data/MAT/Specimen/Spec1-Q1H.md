---
database: MAT
qid: 90010300108
id: Spec1-Q1H
paper: MAT Specimen 1
year: 2009
number: Q1H
section: Multiple Choice
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: [重复题]
duplicate_of: MAT/2005/05-Q1C.md
status: 已入库
---
## 题目
Given that
$$
\log_{10} 2 = 0.3010 \text{ to 4 d.p.} \quad \text{and that} \quad 10^{0.2} < 2
$$
it is possible to deduce that
(a) $2^{100}$ begins in a $1$ and is $30$ digits long;
(b) $2^{100}$ begins in a $2$ and is $30$ digits long;
(c) $2^{100}$ begins in a $1$ and is $31$ digits long;
(d) $2^{100}$ begins in a $2$ and is $31$ digits long.

## 备注

### 我的备注

### AI备注
本题与 `MAT/2005/05-Q1C.md` 是同一道题——牛津样卷是从 1996–2006 历年真题里挑题拼成的。已打 `重复题` 标签、排除出组卷池，避免随机组卷时同题出现两次。本条保留的价值在于**解析是原卷官方版**（Dr. Richard Earl），而孪生题的解析是自撰的。

## 答案
C

## 解析
We are given that
$$
\log_{10} 2 = 0.3010\ldots \quad \text{and that} \quad 10^{0.2} < 2.
$$
So
$$
\log_{10} 2^{100} = 100 \log_{10} 2 = 30.10\ldots
$$
Hence
$$
2^{100} = 10^{30.10\ldots} = 10^{0.10\ldots} \times 10^{30}.
$$
This means that $2^{100}$ is $31$ digits long, with its first digit being determined by $10^{0.10\ldots}$. As
$$
10^{0.10\ldots} < 10^{0.2} < 2
$$
that first digit is less than $2$ and so must be a $1$. This shows the answer is (c).
