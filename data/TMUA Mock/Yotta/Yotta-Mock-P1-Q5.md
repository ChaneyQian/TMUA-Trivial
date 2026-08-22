---
database: TMUA
qid: 20132101203105
id: Yotta-Mock-P1-Q5
paper: TMUA Mock
year:
number: Q5
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Let $u_n = 2u_{n-1} + 7u_{n-2}$, where $u_1 = 4$ and $u_2 = 12$. What does the value of $\frac{u_k}{u_{k-1}}$ tend towards as $k$ tends towards infinity?

$$
\mathbf{A} \quad 2
$$

$$
\mathbf{B} \quad \sqrt{3}
$$

$$
\mathbf{C} \quad \sqrt{5} + 1
$$

$$
\mathbf{D} \quad 7
$$

$$
\mathbf{E} \quad 9
$$

$$
\mathbf{F} \quad 1 + 2\sqrt{2}
$$

$$
\mathbf{G} \quad -1 + \sqrt{3}
$$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
A linear recurrence $u_{n} = 2u_{n-1} + 7u_{n-2}$ has characteristic equation

$$ \lambda^{2} - 2\lambda - 7 = 0 \implies \lambda = \frac{2 \pm \sqrt{4 + 28}}{2} = 1 \pm 2\sqrt{2} $$

so $u_{n} = A\lambda_{1}^{n} + B\lambda_{2}^{n}$ with $\lambda_{1} = 1 + 2\sqrt{2} \approx 3.83$ and $\lambda_{2} = 1 - 2\sqrt{2} \approx -1.83$.

Since $|\lambda_{1}| > |\lambda_{2}|$, the first term dominates as $n$ grows, provided $A \neq 0$. Fitting $u_{1} = 4$ and $u_{2} = 12$ gives a non-zero $A$ (if $A$ were $0$ the sequence would be $B\lambda_{2}^{n}$, whose ratio $u_{2}/u_{1}$ would be $\lambda_{2} < 0$, but here $u_{2}/u_{1} = 3 > 0$). Hence

$$ \frac{u_{k}}{u_{k-1}} = \frac{A\lambda_{1}^{k} + B\lambda_{2}^{k}}{A\lambda_{1}^{k-1} + B\lambda_{2}^{k-1}} \to \lambda_{1} = 1 + 2\sqrt{2} $$

The answer is F.
