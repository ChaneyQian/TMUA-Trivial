---
database: TMUA
qid: 20132101204017
id: Zack-Mock-Q17
paper: TMUA Mock
year:
number: Q17
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Solve:
$$ \log_{x-2} 9 = \log_x 81 $$

$$
\mathbf{A} \quad x = 1
$$

$$
\mathbf{B} \quad x = 4
$$

$$
\mathbf{C} \quad x = 1 \text{ and } x = 4
$$

$$
\mathbf{D} \quad \text{No real solutions}
$$

$$
\mathbf{E} \quad \text{All of the above}
$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Write both sides in terms of $\ln 9$. Since $81 = 9^{2}$,

$$ \log_{x-2}9 = \frac{\ln 9}{\ln(x-2)}, \qquad \log_{x}81 = \frac{2\ln 9}{\ln x} $$

Cancelling $\ln 9$ and cross-multiplying gives $\ln x = 2\ln(x-2)$, so

$$ x = (x-2)^{2} \implies x^{2}-5x+4 = 0 \implies (x-1)(x-4) = 0 $$

Now check the bases, which is where this question is decided. A logarithm base must be positive and not equal to $1$, so we need $x-2>0$ and $x>0$: that is $x>2$. The candidate $x=1$ fails outright (its base would be $x-2 = -1$), leaving only $x=4$.

The answer is B. Option C is the trap for anyone who solves the quadratic without checking the bases.
