---
database: TMUA
qid: 20132101207209
id: JZMaths_SetC-Mock-P2-Q9
paper: TMUA Mock
year:
number: Q9
section: Multiple Choice
difficulty: 6.5
topics: [Polynomial, Number Theory, Algebra (Basic)]
subtopics: [Polynomials, Diophantine Equations, Algebra Manipulation]
tags: [Graphs-of-Functions, Polynomial-Expansions]
status: 已入库
---

## 题目
How many ordered pairs of integers $(x, y)$ satisfy

$$ (x+y)(x^2-xy+y^2)(x-y)(x^2+xy+y^2) = 63? $$

$$ \mathbf{A} \quad 0 $$
$$ \mathbf{B} \quad 1 $$
$$ \mathbf{C} \quad 2 $$
$$ \mathbf{D} \quad 3 $$
$$ \mathbf{E} \quad 4 $$
$$ \mathbf{F} \quad 6 $$
$$ \mathbf{G} \quad 8 $$
$$ \mathbf{H} \quad \text{infinitely many} $$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
Apply the identities $a^3+b^3 = (a+b)(a^2-ab+b^2)$ and $a^3-b^3 = (a-b)(a^2+ab+b^2)$ in turn, or otherwise expand:

$$ (x+y)(x^2-xy+y^2)(x-y)(x^2+xy+y^2) = (x^3+y^3)(x^3-y^3) = x^6-y^6! $$

So the equation is $x^6 - y^6 = 63$. starting from $1^6 = 1$, $2^6 = 64$, the integer sixth powers increase in value very rapidly, and difference of consecutive integer powers of 6 increases rapidly, so the only possibilty is $2^6 - 1^6 = 63$. Which, when possible signs are taken into account, yields four integer pairs: $(2, 1)$, $(2, -1)$, $(-2, 1)$, $(-2, -1)$.

**Remark:** If you didn't know the identity, upon expanding $(x+y)(x^2-xy+y^2)$ to get $x^3+y^3$, you can immediately deduce $(x-y)(x^2+xy+y^2) = x^3-y^3$, because this is just the first expansion with $y$ replaced by $-y$.
