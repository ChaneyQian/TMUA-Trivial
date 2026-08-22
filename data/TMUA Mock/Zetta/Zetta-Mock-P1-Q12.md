---
database: TMUA
qid: 20132101202112
id: Zetta-Mock-P1-Q12
paper: TMUA Mock
year:
number: Q12
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Xander rolls 3 fair six-sided dice. Given that at least 2 of them show a 3, what is the probability the third also shows a 3?

$$
\mathbf{A} \quad \frac{3}{8}
$$

$$
\mathbf{B} \quad \frac{3}{16}
$$

$$
\mathbf{C} \quad \frac{1}{3}
$$

$$
\mathbf{D} \quad \frac{1}{18}
$$

$$
\mathbf{E} \quad \frac{1}{6}
$$

$$
\mathbf{F} \quad \frac{1}{2}
$$

$$
\mathbf{G} \quad \frac{1}{16}
$$

## 备注

### 我的备注

### AI备注


## 答案
G

## 解析
This is a conditional probability, so count outcomes in the conditioning event.

Exactly two threes: choose which die is not a three ($3$ ways), it shows one of $5$ other faces, so

$$ P(\text{exactly two }3\text{s}) = 3\cdot\left(\frac16\right)^{2}\cdot\frac56 = \frac{15}{216} $$

All three threes: $P = \left(\frac16\right)^{3} = \dfrac{1}{216}$.

So $P(\text{at least two}) = \dfrac{15+1}{216} = \dfrac{16}{216}$, and

$$ P(\text{all three}\mid\text{at least two}) = \frac{1/216}{16/216} = \frac{1}{16} $$

The answer is G. The tempting wrong answer is $\tfrac16$ — that would be right only if the question named which two dice showed threes.
