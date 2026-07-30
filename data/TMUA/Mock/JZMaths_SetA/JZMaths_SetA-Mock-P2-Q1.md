---
database: TMUA
qid: 20132101205201
id: JZMaths_SetA-Mock-P2-Q1
paper: TMUA Mock
year:
number: Q1
section: Multiple Choice
difficulty: 5.5
topics: []
subtopics: []
tags: [Logic Sufficiency, Differentiation]
status: 已入库
---

## 题目
Consider the equation $x^3 - 3px^2 + 4 = 0$, where $p$ is a real parameter.

Which of the following is a **sufficient** but **not necessary** condition on $p$ for this equation to have exactly one real root?

$$ \mathbf{A} \quad p > 1 $$
$$ \mathbf{B} \quad p > -1 $$
$$ \mathbf{C} \quad 0 < p < 2 $$
$$ \mathbf{D} \quad -2 < p < 2 $$
$$ \mathbf{E} \quad |p| < 1 $$
$$ \mathbf{F} \quad p^2 < 2 $$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
Let $f(x) = x^3 - 3px^2 + 4$. Then $f'(x) = 3x^2 - 6px = 3x(x - 2p)$, with stationary points at $x = 0$ and $x = 2p$, and stationary values

$$ f(0) = 4, \qquad f(2p) = 8p^3 - 12p^3 + 4 = 4 - 4p^3. $$

For a cubic with positive leading coefficient, exactly one real root occurs if and only if both stationary values are strictly positive (or both strictly negative). Since $f(0) = 4 > 0$ here, the condition reduces to $f(2p) > 0$, i.e. $4 - 4p^3 > 0 \iff p < 1$. The configuration is shown below.

![[Image/JZMaths_SetA-Mock-P2-Q1-fig1.png]]
