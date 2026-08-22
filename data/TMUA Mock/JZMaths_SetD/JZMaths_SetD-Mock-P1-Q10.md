---
database: TMUA
qid: 20132101208110
id: JZMaths_SetD-Mock-P1-Q10
paper: TMUA Mock
year:
number: Q10
section: Multiple Choice
difficulty: 6.5
topics: [Polynomial, Algebra (Basic)]
subtopics: [Factor and Remainder Theorem, Polynomials, Algebra Manipulation]
tags: [Remainder-Theorem, Polynomial-Expansions]
status: 已入库
---

## 题目
Given that $x^2 - 4x + 1$ is a factor of
$$ 2x^4 - 11x^3 + bx^2 + cx + 6, $$
what is the value of $b+c$?

$$ \mathbf{A} \quad -47 $$
$$ \mathbf{B} \quad -27 $$
$$ \mathbf{C} \quad -7 $$
$$ \mathbf{D} \quad 13 $$
$$ \mathbf{E} \quad 47 $$
$$ \mathbf{F} \quad 53 $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Since $x^2 - 4x + 1$ is a factor and the quartic has leading coefficient 2 and constant term 6, write
$$ 2x^4 - 11x^3 + bx^2 + cx + 6 = (x^2 - 4x + 1)(2x^2 + px + q). $$

Expanding the right-hand side gives
$$ 2x^4 + (p-8)x^3 + (q - 4p + 2)x^2 + (p - 4q)x + q. $$

Comparing coefficients:
$$ x^0: \quad q = 6, $$
$$ x^3: \quad p - 8 = -11 \implies p = -3, $$
$$ x^2: \quad b = q - 4p + 2 = 6 + 12 + 2 = 20, $$
$$ x^1: \quad c = p - 4q = -3 - 24 = -27. $$

Therefore $b+c = 20 + (-27) = -7$.

**Remark:** The roots of $x^2 - 4x + 1$ are $x = 2 \pm \sqrt{3}$, so direct substitution would not be wise!
