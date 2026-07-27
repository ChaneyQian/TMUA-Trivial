---
database: TMUA
qid: 20150211400
id: Spec-P1-Q14
paper: TMUA P1
year: 2015
number: Q14
section: Applications
difficulty: 0
topics: []
subtopics: []
tags:
  - specimen
status: 已入库
---

## 题目
$a$, $b$, $x$, and $y$ are real and positive.
$a$ and $b$ are constants.
$x$ and $y$ are related.
A graph of $\log y$ against $\log x$ is drawn.
For which one of the following relationships will this graph be a straight line?
$$
\mathbf {A} \quad y^{b} = a^{x}
$$

$$
\mathbf {B} \quad y = ab^{x}
$$

$$
\mathbf {C} \quad y^{2} = a + x^{b}
$$

$$
\mathbf {D} \quad y = ax^{b}
$$

$$
\mathbf {E} \quad y^{x} = a^{b}
$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
If the graph is a straight line, then we must have

$$
(\log y) = m (\log x) + c
$$

for some $m$ and $c$; this is just the usual straight-line equation with $x$ and $y$ replaced by $\log x$ and $\log y$.

This can be written as

$$
\log y = \log (x ^{m}) + c.
$$

If we now write $c = \log C$ for some $C$, then this becomes

$$
\log y = \log x ^{m} + \log C = \log (C x ^{m}).
$$

Exponentiating both sides gives

$$
y = C x ^{m}
$$

which is in the form of option D.

An alternative to writing $c = \log C$ is just to exponentiate the equation $\log y = \log (x ^{m}) + c$. If we suppose that the base of the logarithms is $k$, then this gives

$$
y = x ^{m} k ^{c}
$$

(using $k^{u + v} = k^{u} k^{v}$ and $k^{\log u} = u$ for any $u$ and $v$). Since $k^{c}$ is a constant, this equation can be rewritten as $y = a x^{m}$ where $a = k^{c}$, and we again obtain option D.
