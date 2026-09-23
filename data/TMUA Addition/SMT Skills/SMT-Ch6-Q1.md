---
database: TMUA
qid: 90020240100
id: SMT-Ch6-Q1
paper: SMT Skills Ch6
year:
number: Q1
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
Find the value of $\int_{-1}^1 \frac{(x^2 - 2)^2}{\sqrt[3]{x}} \, \text{d}x$.

$$\mathbf{A} \quad 0$$

$$\mathbf{B} \quad 1$$

$$\mathbf{C} \quad 2$$

$$\mathbf{D} \quad 3$$

$$\mathbf{E} \quad \frac{3}{7}$$

$$\mathbf{F} \quad 12$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 6 章 Calculus 章末 TMUA style 第 1 题；解析为书后官方 worked solution。

## 答案
A

## 解析
You could compute this directly, although this is fiddly and it is easy to make a mistake.
It is always worth making a quick check first of all to see if there is any other easier approach.

Let $f(x) = \frac{\left( x^{2} - 2 \right)^{2}}{\sqrt[3]{x}}$. Then $f( - x) = \frac{\left( ( - x)^{2} - 2 \right)^{2}}{\sqrt[3]{- x}} = \frac{\left( x^{2} - 2 \right)^{2}}{- \sqrt[3]{x}} = - f(x)$. Any function, $f(x)$, such that $f( - x) = - f(x)$, is called an odd function. Although this is not currently included on school syllabuses, it is helpful to know a bit about odd and even functions, and why they are useful.
In particular, the graph of any odd function, $y = f(x)$, since if $(x,\ y)$ is a point on the graph then so is $\left( - x,\ f( - x) = - f(x) = - y \right)$, has rotational symmetry of order two about the origin. This means that $\int_{- a}^{a}{f(x)}\ dx = 0$ for any odd function and any real value of $a$, since the area to the right of the $y$-axis is the negative of the area to the left.

As soon as you realise the above, you instantly know that the answer must be zero. The answer is A.

The integral is actually an improper integral (consider what happens when $x = 0$ in $\frac{\left( x^{2} - 2 \right)^{2}}{\sqrt[3]{x}}$).
