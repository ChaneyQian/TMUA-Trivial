---
database: MAT
qid: 90010300109
id: Spec1-Q1I
paper: MAT Specimen 1
year: 2009
number: Q1I
section: Multiple Choice
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: [重复题]
duplicate_of: MAT/1997/97-Q1G.md
status: 已入库
---
## 题目
The power of $x$ which has the greatest coefficient in the expansion of $\left(1 + \dfrac{1}{2}x\right)^{10}$ is
(a) $x^{2}$
(b) $x^{3}$
(c) $x^{5}$
(d) $x^{10}$

## 备注

### 我的备注

### AI备注
本题与 `MAT/1997/97-Q1G.md` 是同一道题——牛津样卷是从 1996–2006 历年真题里挑题拼成的。已打 `重复题` 标签、排除出组卷池，避免随机组卷时同题出现两次。本条保留的价值在于**解析是原卷官方版**（Dr. Richard Earl），而孪生题的解析是自撰的。

差异：1997 原卷用罗马数字选项 (i)–(iv)，本卷改为 (a)–(d)，内容与顺序一致。

## 答案
B

## 解析
This question could be approached by simply working out the $11$ coefficients. More systematically we know that the coefficient of $x^{k}$ in $(1 + x/2)^{10}$ is
$$
c_{k} = \frac{10!}{k!\,(10 - k)!}\left(\frac{1}{2}\right)^{k}.
$$
Note that
$$
\frac{c_{k+1}}{c_{k}} = \frac{10!}{(k + 1)!\,(9 - k)!} \times \frac{k!\,(10 - k)!}{10!} \times \frac{2^{k}}{2^{k+1}} = \frac{10 - k}{2(k + 1)}.
$$
From this we can see that $c_{k+1}/c_{k} > 1$, i.e. that the $c_{k}$ are growing, if
$$
10 - k > 2k + 2 \implies 8 > 3k
$$
which means $k \leqslant 2$. So the $c_{k}$ grow up to $c_{3}$ and then decrease thereafter — that is, the answer is (b).
