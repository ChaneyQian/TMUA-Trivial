---
database: TMUA
qid: 20132101204009
id: Zack-Mock-Q9
paper: TMUA Mock
year:
number: Q9
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Find the coefficient of $x^{15}$ in the expansion of $(2x^3 + 3x + 4x^5)^5$.

$$
\mathbf{A} \quad 11280
$$

$$
\mathbf{B} \quad 9920
$$

$$
\mathbf{C} \quad 8462
$$

$$
\mathbf{D} \quad 12482
$$

$$
\mathbf{E} \quad 10592
$$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
Choosing $a$ copies of $2x^{3}$, $b$ copies of $3x$ and $c$ copies of $4x^{5}$ from the five brackets requires

$$ a+b+c = 5, \qquad 3a+b+5c = 15 $$

Subtracting the first from the second gives $2a+4c = 10$, i.e. $a+2c = 5$. With $a,b,c \geq 0$ that leaves three cases.

- $c=0,\ a=5,\ b=0$: multinomial coefficient $\dfrac{5!}{5!} = 1$, term $2^{5} = 32$.
- $c=1,\ a=3,\ b=1$: coefficient $\dfrac{5!}{3!\,1!\,1!} = 20$, term $2^{3}\cdot3\cdot4 = 96$, contribution $1920$.
- $c=2,\ a=1,\ b=2$: coefficient $\dfrac{5!}{1!\,2!\,2!} = 30$, term $2\cdot3^{2}\cdot4^{2} = 288$, contribution $8640$.

Adding: $32+1920+8640 = 10592$.

The answer is E.
