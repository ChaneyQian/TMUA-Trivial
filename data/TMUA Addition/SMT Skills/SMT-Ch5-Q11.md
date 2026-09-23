---
database: TMUA
qid: 90020231100
id: SMT-Ch5-Q11
paper: SMT Skills Ch5
year:
number: Q11
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
style: TMUA
solution_source: 书后解答
status: 已入库
---

## 题目
Evaluate $\int_{-1}^1 (1 - |x|)(1 - x) \, \text{d}x$.

$$\mathbf{A} \quad \frac{1}{3}$$

$$\mathbf{B} \quad \frac{2}{3}$$

$$\mathbf{C} \quad 0$$

$$\mathbf{D} \quad 1$$

$$\mathbf{E} \quad \frac{4}{3}$$

$$\mathbf{F} \quad \frac{7}{3}$$

$$\mathbf{G} \quad \frac{8}{3}$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 5 章 Functions 章末 TMUA style 第 11 题；解析为书后官方 worked solution。

## 答案
D

## 解析
Let $y = \left( 1 - |x| \right)(1 - x)$

For $x < 0$, $y = \left( 1 - ( - x) \right)(1 - x) = (1 + x)(1 - x) = 1 - x^{2}$

For $x \geq 0$, $y = (1 - x)(1 - x) = (1 - x)^{2}$

![[Image/SMT-sol-image17.png]]

$$
\int_{- 1}^{1}{\left( 1 - |x| \right)(1 - x)}\ dx = \int_{- 1}^{0}\left( 1 - x^{2} \right)\ dx + \int_{0}^{1}(1 - x)^{2}\ dx
$$

$$
= \left\lbrack x - \frac{1}{3}x^{3} \right\rbrack_{- 1}^{0} + \left\lbrack x - x^{2} + \frac{1}{3}x^{3} \right\rbrack_{0}^{1} = 0 - \left( - 1 + \frac{1}{3} \right) + 1 - 1 + \frac{1}{3} - 0 = 1
$$

The correct answer is D
