---
database: TMUA
qid: 20132101207120
id: JZMaths_SetC-Mock-P1-Q20
paper: TMUA Mock
year:
number: Q20
section: Multiple Choice
difficulty: 8.5
topics: []
subtopics: []
tags: [Exponentials and Logarithms, Polynomial Expansions]
status: 已入库
---

## 题目
The function $f$ is defined by

$$ f(x) = \ln \left( \frac{1+x}{1-x} \right), \qquad -1 < x < 1. $$

Solve

$$ f(x) = 4f\left( \frac{1}{\sqrt{2}} \right). $$

It may be helpful to first find constants $a$ and $b$ such that, for $u, v \in (-1, 1)$,

$$ f \left( \frac{u+v}{1+uv} \right) = af(u) + bf(v). $$

$$ \mathbf{A} \quad \frac{3\sqrt{2}}{4} $$
$$ \mathbf{B} \quad \frac{8\sqrt{2}}{9} $$
$$ \mathbf{C} \quad \frac{4\sqrt{2}}{5} $$
$$ \mathbf{D} \quad \frac{12\sqrt{2}}{17} $$
$$ \mathbf{E} \quad \frac{5\sqrt{2}}{7} $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
First lets find $a$ and $b$. We have

$$ f \left( \frac{u+v}{1+uv} \right) = \ln \left( \frac{1 + \frac{u+v}{1+uv}}{1 - \frac{u+v}{1+uv}} \right) = \ln \left( \frac{(1+u)(1+v)}{(1-u)(1-v)} \right). $$

So

$$ f \left( \frac{u+v}{1+uv} \right) = \ln \left( \frac{1+u}{1-u} \right) + \ln \left( \frac{1+v}{1-v} \right) = f(u) + f(v). $$

Therefore $a=1$ and $b=1$.
