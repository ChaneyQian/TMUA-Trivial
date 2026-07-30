---
database: TMUA
qid: 20132101206112
id: JZMaths_SetB-Mock-P1-Q12
paper: TMUA Mock
year:
number: Q12
section: Multiple Choice
difficulty: 7.5
topics: []
subtopics: []
tags: [Polynomial Expansions]
status: 已入库
---

## 题目
In the expansion of $(1 + x)^n$, the coefficients of three consecutive terms are in the ratio $1 : 2 : 3$. Find $n$.
$$ \mathbf{A} \quad 9 $$
$$ \mathbf{B} \quad 10 $$
$$ \mathbf{C} \quad 11 $$
$$ \mathbf{D} \quad 12 $$
$$ \mathbf{E} \quad 13 $$
$$ \mathbf{F} \quad 14 $$
$$ \mathbf{G} \quad 15 $$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
Let the three consecutive terms involve $x^{r-1}, x^r, x^{r+1}$, so that

$$ \binom{n}{r-1} : \binom{n}{r} : \binom{n}{r+1} = 1 : 2 : 3. $$

Using

$$ \frac{\binom{n}{r}}{\binom{n}{r-1}} = \frac{n - r + 1}{r}, $$

the two ratios give

$$ \frac{n - r + 1}{r} = 2 \qquad \text{and} \qquad \frac{n - r}{r + 1} = \frac{3}{2}. $$

The first rearranges to $n + 1 = 3r$ and the second to $2n = 5r + 3$. Solving simultaneously gives $r = 5$ and $n = 14$.
