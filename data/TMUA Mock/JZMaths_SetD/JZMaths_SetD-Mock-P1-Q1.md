---
database: TMUA
qid: 20132101208101
id: JZMaths_SetD-Mock-P1-Q1
paper: TMUA Mock
year:
number: Q1
section: Multiple Choice
difficulty: 5.5
topics: [Sequences and Series]
subtopics: [Binomial Theorem]
tags: [Polynomial-Expansions]
status: 已入库
---

## 题目
Find the coefficient of $x^4$ in the expansion of
$$ \left(2 - x + \frac{x^2}{2}\right)^5. $$
$$ \mathbf{A} \quad 50 $$
$$ \mathbf{B} \quad 60 $$
$$ \mathbf{C} \quad 70 $$
$$ \mathbf{D} \quad 80 $$
$$ \mathbf{E} \quad 90 $$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
One of a few standard questions. I may decide to replace it with a **non-standard** question at a later date, so take it easy for now!

Using the binomial expansion,
$$ \left((2 - x) + \frac{x^2}{2}\right)^5 = (2 - x)^5 + 5(2 - x)^4 \left(\frac{x^2}{2}\right) + 10(2 - x)^3 \left(\frac{x^2}{2}\right)^2 + \cdots. $$

Only these three terms can contribute to the coefficient of $x^4$. Their contributions are
$$ (2 - x)^5: \binom{5}{4} 2 (-x)^4 = 10x^4, $$
$$ 5(2 - x)^4 \left(\frac{x^2}{2}\right): 5 \binom{4}{2} 2^2 (-x)^2 \left(\frac{x^2}{2}\right) = 60x^4, $$
$$ 10(2 - x)^3 \left(\frac{x^2}{2}\right)^2: 10 \cdot 2^3 \left(\frac{x^4}{4}\right) = 20x^4. $$

Therefore, the coefficient of $x^4$ is
$$ 10 + 60 + 20 = 90. $$
