---
database: TMUA
qid: 20132101209213
id: JZMaths_SetE-Mock-P2-Q13
paper: TMUA Mock
year:
number: Q13
section: Multiple Choice
difficulty: 7
topics: []
subtopics: []
tags: [Polynomial Expansions]
status: 已入库
---

## 题目
For some positive integer $n$, three consecutive coefficients in the expansion of $(1 + x)^n$ are in the ratio $1 : 3 : 5$. What is the value of $n$?
$$ \mathbf{A} \quad 5 $$
$$ \mathbf{B} \quad 7 $$
$$ \mathbf{C} \quad 12 $$
$$ \mathbf{D} \quad 15 $$
$$ \mathbf{E} \quad 18 $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Suppose the three consecutive coefficients are
$$ \binom{n}{r}, \quad \binom{n}{r+1}, \quad \binom{n}{r+2}. $$
Since their ratio is $1 : 3 : 5$,
$$ \frac{\binom{n}{r+1}}{\binom{n}{r}} = \frac{n - r}{r + 1} = 3, $$
so $n = 4r + 3$.

Also,
$$ \frac{\binom{n}{r+2}}{\binom{n}{r+1}} = \frac{n - r - 1}{r + 2} = \frac{5}{3}. $$
Substituting $n = 4r + 3$ gives
$$ \frac{3r + 2}{r + 2} = \frac{5}{3}, $$
so $9r + 6 = 5r + 10$, giving $r = 1$. Therefore
$$ n = 4(1) + 3 = 7. $$
The answer is 7.
