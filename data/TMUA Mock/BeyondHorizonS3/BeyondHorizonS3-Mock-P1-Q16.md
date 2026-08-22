---
database: TMUA
qid: 20132101213116
id: BeyondHorizonS3-Mock-P1-Q16
paper: TMUA Mock
year:
number: Q16
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The letters of the word "MOTHER" are permuted, and all the permutations so formed are arranged in alphabetical order as in a dictionary. Then the number of permutations which come before the word "MOTHER" is
$$\mathbf{A} \quad 503$$
$$\mathbf{B} \quad 93$$
$$\mathbf{C} \quad \frac{6!}{2} - 1$$
$$\mathbf{D} \quad 308$$
$$\mathbf{E} \quad 245$$
$$\mathbf{F} \quad 182$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
The six letters E, H, M, O, R, T are distinct, so counting the words that precede MOTHER is a matter of fixing the prefix position by position. Words beginning with E or H come first, contributing $2 \times 5! = 240$. Among those beginning with M, the second letter may be E or H before reaching O, contributing $2 \times 4! = 48$. With MO fixed the remaining pool is $\{E, H, R, T\}$ and the third letter may be E, H or R before reaching T, contributing $3 \times 3! = 18$. With MOT fixed the pool is $\{E, H, R\}$ and only E precedes H, contributing $1 \times 2! = 2$. With MOTH fixed, E is already the smallest of $\{E, R\}$, so nothing more is added. The total is $240 + 48 + 18 + 2 = 308$. The answer is D. Option E is the trap for anyone who omits the block of words starting with H.
