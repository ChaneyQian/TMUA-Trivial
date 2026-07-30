---
database: TMUA
qid: 90010212000
id: Spec-P1-Q20
paper: TMUA P1
year:
number: Q20
section: Applications
difficulty: 0
topics: []
subtopics: []
tags:
  - specimen
status: 已入库
---

## 题目
The coefficient of $x^{2}$ in the expansion of $(4 - x^{2})[(1 + 2x + 3x^{2})^{6} - (1 + 4x^{3})^{5}]$ is

$$
\mathbf {A} \quad 28
$$

$$
\mathbf {B} \quad 72
$$

$$
\mathbf {C} \quad 78
$$

$$
\mathbf {D} \quad 192
$$

$$
\mathbf {E} \quad 240
$$

$$
\mathbf {F} \quad 310
$$

$$
\mathbf {G} \quad 312
$$

## 备注

### 我的备注

### AI备注


## 答案
G

## 解析
We expand each of the terms up to the term in $x ^ { 2 }$ using the binomial theorem:

$$
\begin{array}{r l} (1 + 2 x + 3 x ^ {2}) ^ {6} & = 1 + 6 (2 x + 3 x ^ {2}) + 1 5 (2 x + 3 x ^ {2}) ^ {2} + \dots \\ & = 1 + 1 2 x + 1 8 x ^ {2} + 1 5 (4 x ^ {2} + \dots) + \dots \\ & = 1 + 1 2 x + 7 8 x ^ {2} + \dots \end{array}
$$

$$
(1 + 4 x ^ {3}) ^ {5} = 1 + 5 (4 x ^ {3}) + \dots = 1 + \dots
$$

so the whole expression is

$$
\begin{array}{r l} (4 - x ^ {2}) [ (1 + 2 x + 3 x ^ {2}) ^ {6} - (1 + 4 x ^ {3}) ^ {5} ] & = (4 - x ^ {2}) [ (1 + 1 2 x + 7 8 x ^ {2} + \dots) - (1 + \dots) ] \\ & = (4 - x ^ {2}) (1 2 x + 7 8 x ^ {2} + \dots) \\ & = 4 (1 2 x + 7 8 x ^ {2} + \dots) - \dots \\ & = 4 8 x + 3 1 2 x ^ {2} + \dots \end{array}
$$

so the coefficient of $x ^ { 2 }$ is 312, and the answer is G.

