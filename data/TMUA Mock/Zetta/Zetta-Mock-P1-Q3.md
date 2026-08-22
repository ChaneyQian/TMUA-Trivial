---
database: TMUA
qid: 20132101202103
id: Zetta-Mock-P1-Q3
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
What are the solution(s) to
$$ \ln(x^2 + 4x - 90) = \ln(-2x + 1) $$
For all real $x$?

$$
\mathbf{A} \quad 13, 7
$$

$$
\mathbf{B} \quad -13, 7
$$

$$
\mathbf{C} \quad -13, -7
$$

$$
\mathbf{D} \quad -13
$$

$$
\mathbf{E} \quad 7
$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Since $\ln$ is one-to-one, the equation forces $x^{2}+4x-90 = -2x+1$, but **only where both arguments are positive** — that side condition is the whole question.

$$ x^{2}+6x-91 = 0 \implies (x+13)(x-7)=0 $$

so the candidates are $x=-13$ and $x=7$.

The right-hand argument needs $-2x+1>0$, i.e. $x<\tfrac12$. That kills $x=7$ immediately. For $x=-13$ we get $-2(-13)+1 = 27 > 0$ and $x^{2}+4x-90 = 169-52-90 = 27 > 0$, so both logarithms are defined and equal.

Only $x=-13$ survives, so the answer is D.
