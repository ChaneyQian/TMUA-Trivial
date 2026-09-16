---
database: TMUA
qid: 90010210600
id: Spec-P1-Q6
paper: TMUA P1
year:
number: Q6
section: Applications
difficulty: 0
topics: []
subtopics: []
tags:
  - Specimen
status: 已入库
---

## 题目
It is given that $x + 2$ is a factor of $x^{3} + 4cx^{2} + x(c + 1)^{2} - 6$ . 

The sum of the possible values of $c$ is
$$
\mathbf {A} \quad -10
$$

$$
\mathbf {B} \quad -6
$$

$$
\mathbf {C} \quad 0
$$

$$
\mathbf {D} \quad 6
$$

$$
\mathbf {E} \quad 10
$$

## 备注

### 我的备注

### AI备注


ℹ️ 2026-08-15 核 官方 Specimen Paper 1 Solutions（Version 1.1, Nov 2020） p8：末句「the product of the roots is the constant, which is 7」原册即印 7（c²−6c+8 的常数项是 8）。转写忠实，属原册错误，未改。
## 答案
D

## 解析
Since $x + 2$ is a factor, substituting $x = - 2$ into the polynomial must yield zero by the factor theorem:

$$
(- 2) ^ {3} + 4 c (- 2) ^ {2} + (- 2) (c + 1) ^ {2} - 6 = 0.
$$

Simplifying gives

$$
- 8 + 1 6 c - 2 (c ^ {2} + 2 c + 1) - 6 = 0
$$

so

$$
- 2 c ^ {2} + 1 2 c - 1 6 = 0.
$$

Dividing by −2 now gives

$$
c ^ {2} - 6 c + 8 = 0
$$

so $( c - 2 ) ( c - 4 ) = 0$ and the roots are $c = 2$ and $c = 4$ , with a sum of 6. Hence the answer is D. We could also find the sum of the roots directly from the quadratic $c ^ { 2 } - 6 c + 8 = 0$ without solving it: if the roots are ${ c = p }$ and $c = q .$ , then the quadratic can be written as $( c - p ) ( c - q ) = 0 .$ , which expands to $c ^ { 2 } - ( p + q ) c + p q = 0$ . So the sum of the roots is the negative of the c coefficient, which is $6 ,$ and the product of the roots is the constant, which is 7.
