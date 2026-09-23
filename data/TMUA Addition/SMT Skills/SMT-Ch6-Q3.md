---
database: TMUA
qid: 90020240300
id: SMT-Ch6-Q3
paper: SMT Skills Ch6
year:
number: Q3
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
A function $f$ is such that $\int_0^4 f(x) \, \text{d}x = 10$,
$\int_{-1}^4 f(x) \, \text{d}x = 13 \text{ and } \int_{-4}^3 f(-x) \, \text{d}x = 2$.
The value of $\int_{-3}^0 f(x) \, \text{d}x$ is

$$\mathbf{A} \quad 2$$

$$\mathbf{B} \quad 3$$

$$\mathbf{C} \quad 5$$

$$\mathbf{D} \quad 8$$

$$\mathbf{E} \quad 11$$

$$\mathbf{F} \quad 12$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 6 章 Calculus 章末 TMUA style 第 3 题；解析为书后官方 worked solution。

## 答案
D

## 解析
The last of the three equations can also be written as $\int_{- 3}^{4}{f(x)\ dx = 2}$, since drawing the graph of $y = f( - x)$ from $x = - 4$ to $x = 3$ is the same as drawing the graph of $y = f(x)$ from $x = 4$ to $x = - 3$, so the areas are the same.

$$
\int_{- 1}^{0}{f(x)}\ dx = 13 - 10 = 3
$$

$$
\int_{- 3}^{- 1}{f(x)\ dx} = \int_{- 3}^{4}{f(x)\ dx} - \int_{- 1}^{4}{f(x)\ dx} = 2 - 13 = - 11
$$

$$
\int_{- 3}^{0}{f(x)\ dx} = \int_{- 3}^{- 1}{f(x)\ dx} + \int_{- 1}^{0}{f(x)}\ dx = - 11 + 3 = - 8
$$

So

$$
- \int_{- 3}^{0}{f(x)}\ dx = 8
$$

Then $\int_{- 3}^{0}{f(x)}\ dx = \int_{- 3}^{4}{f(x)}\ dx - \int_{0}^{4}{f(x)}\ dx = 2 - 10 = - 8$. The answer is D.
