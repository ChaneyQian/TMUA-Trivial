---
database: TMUA
qid: 20132101213106
id: BeyondHorizonS3-Mock-P1-Q6
paper: TMUA Mock
year:
number: Q6
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
If $2\log(\alpha - 2\beta) = \log(\alpha) + \log(\beta)$, find the value of $\frac{\alpha}{\beta}$.
$$\mathbf{A} \quad 1$$
$$\mathbf{B} \quad 2$$
$$\mathbf{C} \quad 3$$
$$\mathbf{D} \quad 4$$
$$\mathbf{E} \quad \text{1 and 4}$$
$$\mathbf{F} \quad \text{2 and 3}$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
For the three logarithms to be defined we need $\alpha > 0$, $\beta > 0$ and, crucially, $\alpha - 2\beta > 0$. Under those conditions the equation reads $\log(\alpha - 2\beta)^2 = \log(\alpha\beta)$, so $(\alpha - 2\beta)^2 = \alpha\beta$. Dividing through by $\beta^2$ and writing $t = \frac{\alpha}{\beta}$ gives $(t-2)^2 = t$, i.e. $t^2 - 5t + 4 = 0$, whose roots are $t = 1$ and $t = 4$. Now apply the domain condition: $\alpha - 2\beta > 0$ means $t > 2$, which kills $t = 1$ (there $\alpha - 2\beta = -\beta < 0$) and keeps $t = 4$. Checking $t = 4$: with $\alpha = 4\beta$ we get $\alpha - 2\beta = 2\beta$ and $2\log(2\beta) = \log(4\beta^2) = \log(4\beta \cdot \beta)$, which is correct. The answer is D. Option E is the trap, offering both algebraic roots to anyone who never checks that the logarithm's argument is positive.
