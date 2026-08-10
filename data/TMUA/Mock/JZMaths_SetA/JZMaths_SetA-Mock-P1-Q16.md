---
database: TMUA
qid: 20132101205116
id: JZMaths_SetA-Mock-P1-Q16
paper: TMUA Mock
year:
number: Q16
section: Multiple Choice
difficulty: 7.5
topics: [Function, Algebra (Basic)]
subtopics: [Exponentials and Logarithms, Algebra Manipulation]
tags: [Exponentials and Logarithms]
status: 已入库
---

## 题目
Find the maximum value of the function
$$ f(x) = \frac{1}{4^x + 4^{-x} - 2(2^x + 2^{-x}) + 8}. $$

$$ \mathbf{A} \quad \frac{1}{8} $$
$$ \mathbf{B} \quad \frac{1}{6} $$
$$ \mathbf{C} \quad \frac{1}{5} $$
$$ \mathbf{D} \quad \frac{1}{4} $$
$$ \mathbf{E} \quad 5 $$
$$ \mathbf{F} \quad 6 $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
First we need to notice that $4^x + 4^{-x}$ is very close to the square of $2^x + 2^{-x}$, and so this question smells like a completing the square to find max/min question.

On closer inspection: $(2^x + 2^{-x})^2 = 4^x + 2 + 4^{-x}$, therefore, let $u = 2^x + 2^{-x}$, the denominator of the function is transformed to $u^2 - 2u + 6 = (u - 1)^2 + 5$. Therefore, at first sight, you may be led to believe that the maximum of $f(x)$ is when the square is 0. However, this occurs when $u = 1$, and **can $u$ be 1? No!**

$u = 2^x + 2^{-x}$, when $x = 0$, $u = 2$, as $x$ increases, the $2^x$ part rapidly tends to infinite, and the $2^{-x}$ part goes to 0. since the $2^x$ clearly goes to infinity faster than $2^{-x}$ go to 0, overall, its not hard to see the sum of the two increases as $x$ increases from 0. Also, $u$ is an even function ($u(x) = u(-x)$), and so it is symmetrical about $x = 0$, therefore we establish the range of $u$ to be from 2 to infinity.

To maxmize $f$, we want to minimize its denominator, and this now happens at minimum of $(u - 1)^2$, which occurs at $u = 2$, which gives the denominator of 6, and the maximum of f is $\frac{1}{6}$.
