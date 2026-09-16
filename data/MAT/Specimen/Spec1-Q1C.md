---
database: MAT
qid: 90010300103
id: Spec1-Q1C
paper: MAT Specimen 1
year: 2009
number: Q1C
section: Multiple Choice
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: [重复题]
duplicate_of: MAT/2004/04-Q1D.md
status: 已入库
---
## 题目
What is the reflection of the point $(3, 4)$ in the line $3x + 4y = 50$?
(a) $(9, 12)$
(b) $(6, 8)$
(c) $(12, 16)$
(d) $(16, 12)$

## 备注

### 我的备注

### AI备注
本题与 `MAT/2004/04-Q1D.md` 是同一道题——牛津样卷是从 1996–2006 历年真题里挑题拼成的。已打 `重复题` 标签、排除出组卷池，避免随机组卷时同题出现两次。本条保留的价值在于**解析是原卷官方版**（Dr. Richard Earl），而孪生题的解析是自撰的。

## 答案
A

## 解析
![[Image/Spec1-Q1C-sol1.png]]
The gradient of the line $L$, with equation $3x + 4y = 50$, is $-3/4$ and so a normal to the line has gradient $4/3$. So the normal $N$ to the line through $(3, 4)$ has equation
$$
y - 4 = \frac{4}{3}(x - 3).
$$
This normal $N$ meets $L$ when
$$
3x + 16 + \frac{16}{3}(x - 3) = 50 \implies 25x = 150 \implies (x, y) = (6, 8).
$$
The vector from $(3, 4)$ along $N$ to $(6, 8)$ on $L$ is $(3, 4)$. Following this vector again to the mirror image gives $(9, 12)$ and we see the answer is (a).
