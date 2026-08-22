---
database: TMUA
qid: 20132101211110
id: BeyondHorizonS1-Mock-P1-Q10
paper: TMUA Mock
year:
number: Q10
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Let $p(x)$ be a continuous function which is positive for all $x$ and
$$\int_2^3 p(x)\, dx = c \int_0^2 p\left( \frac{x+4}{2} \right) dx.$$
Then
$$\mathbf{A} \quad c = 4$$
$$\mathbf{B} \quad c = -\frac{1}{4}$$
$$\mathbf{C} \quad c = \frac{1}{4}$$
$$\mathbf{D} \quad c = 2$$
$$\mathbf{E} \quad c = -\frac{1}{2}$$
$$\mathbf{F} \quad c = \frac{1}{2}$$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
Substitute $u = \frac{x+4}{2}$ in the integral on the right, so that $x = 2u - 4$ and $dx = 2\,du$. The limits $x = 0$ and $x = 2$ become $u = 2$ and $u = 3$, giving
$$\int_0^2 p\left( \frac{x+4}{2} \right) dx = 2\int_2^3 p(u)\, du$$
The stated identity therefore reads $\int_2^3 p = 2c \int_2^3 p$. Since $p$ is positive and continuous, $\int_2^3 p \neq 0$, so it may be cancelled to give $2c = 1$, that is $c = \tfrac12$. The answer is F. Option D is the trap for anyone who reads off the Jacobian $2$ without noticing it sits on the wrong side of the equation.
