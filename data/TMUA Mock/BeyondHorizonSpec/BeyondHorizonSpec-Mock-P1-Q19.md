---
database: TMUA
qid: 20132101215119
id: BeyondHorizonSpec-Mock-P1-Q19
paper: TMUA Mock
year:
number: Q19
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Suppose a coin is flipped 7 times and the outcomes are recorded. Find the probability that any head has at least 1 adjacent head. For example, with 4 flips, TTHH, TTTT, and HHHH are valid, but HTHH, and TTTH are not valid.
$$\mathbf{A} \quad \frac{34}{128}$$
$$\mathbf{B} \quad \frac{35}{128}$$
$$\mathbf{C} \quad \frac{36}{128}$$
$$\mathbf{D} \quad \frac{37}{128}$$
$$\mathbf{E} \quad \frac{38}{128}$$
$$\mathbf{F} \quad \frac{39}{128}$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
The condition says that no block of consecutive heads has length exactly 1: every run of heads must be at least two long. Count such strings by a recursion on the length $n$, classifying by how the string ends. Let $a_n$ count valid strings ending in a tail, $b_n$ those ending in a run of exactly one head, and $c_n$ those ending in a run of two or more heads. Appending a tail is allowed only after a tail or a completed run, appending a head to a tail-ending string starts a new run of length one, and appending a head to any head-ending string produces a run of length at least two, so
$$a_n = a_{n-1} + c_{n-1}, \qquad b_n = a_{n-1}, \qquad c_n = b_{n-1} + c_{n-1}.$$
Starting from $a_1 = 1$, $b_1 = 1$, $c_1 = 0$ and iterating gives $(a_n, b_n, c_n)$ equal to $(1,1,1)$, $(2,1,2)$, $(4,2,3)$, $(7,4,5)$, $(12,7,9)$ and finally $(21,12,16)$ at $n = 7$. The valid strings are those ending in a tail or in a completed run, so there are $a_7 + c_7 = 21 + 16 = 37$ of them out of $2^7 = 128$ equally likely outcomes. The answer is D.
