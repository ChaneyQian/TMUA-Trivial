---
database: TMUA
qid: 20132101100119
id: Spec-P1-Q19
paper: TMUA P1
year:
number: Q19
section: Applications
difficulty: 0
topics: []
subtopics: []
tags:
  - specimen
status: 已入库
---

## 题目
A geometric series has first term 4 and common ratio $r$ , where $0 < r < 1$ .

The first, second, and fourth terms of this geometric series form three successive terms of an arithmetic series. 

The sum to infinity of the geometric series is
$$
\mathbf {A} \quad \frac{1}{2} (\sqrt{5} - 1)
$$

$$
\mathbf {B} \quad 2(3 - \sqrt{5})
$$

$$
\mathbf {C} \quad 2(1 + \sqrt{5})
$$

$$
\mathbf {D} \quad 2(3 + \sqrt{5})
$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
The first four terms are $4 , \ 4 r , \ 4 r ^ { 2 }$ and $4 r ^ { 3 }$ . We are also given that 4, 4r and $4 r ^ { 3 }$ are three successive terms of an arithmetic series. We thus have

$$
\begin{array}{c} {4 r = 4 + d} \\ {4 r ^ {3} = 4 + 2 d} \end{array}
$$

where d is the common difference of this arithmetic series.

Therefore $d = 4 ( r - 1 )$ from the first equation, and $d = 4 r ( r ^ { 2 } - 1 )$ on subtracting the two equations.

Equating these expressions for d gives

$$
4 (r - 1) = 4 r (r ^ {2} - 1)
$$

so $r - 1 = r ( r - 1 ) ( r + 1 )$ on factorising and dividing by 4.

Since $0 < r < 1$ , we can divide by r − 1 to obtain $1 = r ( r + 1 ) $ , so $r ^ { 2 } + r - 1 = 0$ . The solutions to this quadratic are

$$
r = \frac {- 1 \pm \sqrt {1 ^ {2} + 4}}{2} = \frac {- 1 \pm \sqrt {5}}{2}.
$$

Since $r > 0$ , we have $r = { \frac { - 1 + { \sqrt { 5 } } } { 2 } }$ , and so the sum to infinity (given by the standard formula $\begin{array} { r } { S _ { \infty } = \frac { a } { 1 - r } ) } \end{array}$ is

$$
{ \begin{array}{r l} {{\frac {4}{1 - {\frac {- 1 + {\sqrt {5}}}{2}}}}} & {= {\frac {8}{2 - (- 1 + {\sqrt {5}})}}} \\ & {= {\frac {8}{3 - {\sqrt {5}}}}} \\ & {= {\frac {8 (3 + {\sqrt {5}})}{9 - 5}}} \\ & {= 2 (3 + {\sqrt {5}})} \end{array} }
$$

and the answer is D.
