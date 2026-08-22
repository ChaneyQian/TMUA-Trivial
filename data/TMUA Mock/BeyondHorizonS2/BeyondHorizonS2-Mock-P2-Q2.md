---
database: TMUA
qid: 20132101212202
id: BeyondHorizonS2-Mock-P2-Q2
paper: TMUA Mock
year:
number: Q2
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Consider the statement: $x(\alpha - x) < y(\alpha - y)$ for all $x, y$ with $0 < x < y < 1$. The statement is true
$$\mathbf{A} \quad \text{if and only if } \alpha \geq 2$$
$$\mathbf{B} \quad \text{if and only if } \alpha > 2$$
$$\mathbf{C} \quad \text{if and only if } \alpha \leq -1$$
$$\mathbf{D} \quad \text{if and only if } \alpha \geq -1$$
$$\mathbf{E} \quad \text{if and only if } \alpha \leq 2$$
$$\mathbf{F} \quad \text{for no values of } \alpha$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Put $f(t) = t(\alpha - t)$, so that the claim is that $f$ is strictly increasing on the interval $(0, 1)$. Subtracting and factorising,
$$f(y) - f(x) = \alpha(y - x) - (y^2 - x^2) = (y - x)\bigl(\alpha - (x + y)\bigr).$$
Since $y - x > 0$ for every admissible pair, the inequality $f(x) < f(y)$ holds exactly when $\alpha > x + y$. As $x$ and $y$ run over all pairs with $0 < x < y < 1$, the sum $x + y$ takes every value in the open interval $(0, 2)$ and never attains $2$, so requiring $\alpha > x + y$ for every such pair is the same as requiring $\alpha \geq 2$. In particular $\alpha = 2$ does work, which rules out the strict version in option B. The answer is A.
