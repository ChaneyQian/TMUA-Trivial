---
database: TMUA
qid: 20132101214114
id: BeyondHorizonS4-Mock-P1-Q14
paper: TMUA Mock
year:
number: Q14
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The number of ways in which three non-negative integers $n_1, n_2, n_3$ can be chosen such that $n_1 + n_2 + n_3 = 10$ is
$$\mathbf{A} \quad 66$$
$$\mathbf{B} \quad 55$$
$$\mathbf{C} \quad 10^3$$
$$\mathbf{D} \quad \frac{10!}{3!2!1!}$$
$$\mathbf{E} \quad \frac{9!}{3!2!1!}$$
$$\mathbf{F} \quad 10^2$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
This is the standard stars-and-bars count. Represent the total as ten identical stars and separate them into three ordered groups using two bars; every arrangement of the twelve symbols corresponds to exactly one ordered triple, and allowing empty groups is precisely the non-negativity condition. Hence the count is
$$\binom{12}{2} = 66.$$
The answer is A. Option B, $55 = \binom{11}{2}$, is the same formula applied to a total of $9$ rather than $10$, which is the usual off-by-one slip here.
