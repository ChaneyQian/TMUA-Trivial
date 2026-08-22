---
database: TMUA
qid: 20132101204014
id: Zack-Mock-Q14
paper: TMUA Mock
year:
number: Q14
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
How many sets of positive integers $(a, b, c)$ with $a \leq b \leq c$ satisfy
$$ \frac{1}{a} + \frac{1}{b} + \frac{1}{c} = 1? $$

$$
\mathbf{A} \quad 1
$$

$$
\mathbf{B} \quad 2
$$

$$
\mathbf{C} \quad 3
$$

$$
\mathbf{D} \quad 4
$$

$$
\mathbf{E} \quad 0
$$

$$
\mathbf{F} \quad \infty
$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Since $a \leq b \leq c$, the largest of the three reciprocals is $\tfrac1a$, so $\tfrac3a \geq 1$, giving $a \leq 3$; and $\tfrac1a<1$ forces $a \geq 2$. So $a \in \{2,3\}$.

**$a=3$**: then $\tfrac1b+\tfrac1c = \tfrac23$ with $b \geq 3$, and $\tfrac2b \geq \tfrac23$ gives $b \leq 3$. So $b=3$, $c=3$: the solution $(3,3,3)$.

**$a=2$**: then $\tfrac1b+\tfrac1c = \tfrac12$ with $b \geq 2$, and $\tfrac2b \geq \tfrac12$ gives $b \leq 4$; also $\tfrac1b<\tfrac12$ gives $b \geq 3$. So $b=3$ gives $c=6$, and $b=4$ gives $c=4$.

The three solutions are $(3,3,3)$, $(2,4,4)$ and $(2,3,6)$.

The answer is C.
