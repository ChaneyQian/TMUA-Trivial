---
database: TMUA
qid: 20132101209201
id: JZMaths_SetE-Mock-P2-Q1
paper: TMUA Mock
year:
number: Q1
section: Multiple Choice
difficulty: 5.5
topics: []
subtopics: []
tags: [Differentiation, Logic Deduction]
status: 已入库
---

## 题目
Let $t$ be a real number, and define
$$ f(x) = x^3 - 3tx + 1. $$

Consider the following statements.

P: $f$ is increasing on the interval $[-1, 1]$.

Q: The equation $f(x) = 1$ has exactly one solution in the interval $[-1, 1]$.

$$ \mathbf{A} \quad \text{P is sufficient but not necessary for Q} $$
$$ \mathbf{B} \quad \text{P is necessary but not sufficient for Q} $$
$$ \mathbf{C} \quad \text{P is necessary and sufficient for Q} $$
$$ \mathbf{D} \quad \text{P is neither sufficient nor necessary for Q} $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
$$ f'(x) = 3x^2 - 3t = 3(x^2 - t). $$

For $f$ to be increasing on $[-1, 1]$, we need $x^2 - t \ge 0$ for every $x$ in $[-1, 1]$, so $t \le 0$.

Next, for Q:
$$ f(x) = 1 \quad \Longleftrightarrow \quad x^3 - 3tx = 0 \quad \Longleftrightarrow \quad x(x^2 - 3t) = 0. $$

There is always the solution $x = 0$. Extra solutions occur exactly when $0 \le t \le \frac{1}{3}$. Therefore Q is true when $t < 0$, when $t = 0$, and when $t > \frac{1}{3}$; in other words, when $t \le 0$ or $t > \frac{1}{3}$.

Thus P implies Q, but Q does not imply P, or the correct statement is: P is sufficient but not necessary for Q.
