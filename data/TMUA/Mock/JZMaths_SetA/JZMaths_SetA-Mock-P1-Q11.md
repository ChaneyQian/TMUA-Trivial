---
database: TMUA
qid: 20132101205111
id: JZMaths_SetA-Mock-P1-Q11
paper: TMUA Mock
year:
number: Q11
section: Multiple Choice
difficulty: 7.5
topics: []
subtopics: []
tags: [Polynomial Expansions]
status: 已入库
---

## 题目
In the expansion of $(a + bx)^7$, the coefficient of $x^5$ plus twice the coefficient of $x^4$ is the same as five times the coefficient of $x^3$. Given that $a$ and $b$ are positive integers, find the smallest possible value of $ab$.
$$ \mathbf{A} \quad 3 $$
$$ \mathbf{B} \quad 5 $$
$$ \mathbf{C} \quad 6 $$
$$ \mathbf{D} \quad 10 $$
$$ \mathbf{E} \quad 15 $$
$$ \mathbf{F} \quad 16 $$
$$ \mathbf{G} \quad 9 $$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
The relevant binomial coefficients in $(a + bx)^7$ are
$$ \binom{7}{3}a^4b^3 = 35a^4b^3, \quad \binom{7}{4}a^3b^4 = 35a^3b^4, \quad \binom{7}{5}a^2b^5 = 21a^2b^5 $$
for $x^3$, $x^4$, $x^5$ respectively. Apply the given conditions we get:
$$ 21a^2b^5 + 2(35a^3b^4) = 5(35a^4b^3), $$
which simplifies to:
$$ 3b^2 + 10ab - 25a^2 = 0, $$
which factorises as $(3b - 5a)(b + 5a) = 0$. Since $a, b > 0$ the second factor is positive and so cannot be zero, so $3b = 5a$. The smallest possible $ab$ is clearly when $a = 3$ and $b = 5$, and $ab = 15$.
