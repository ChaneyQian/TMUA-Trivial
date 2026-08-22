---
database: TMUA
qid: 20132101208102
id: JZMaths_SetD-Mock-P1-Q2
paper: TMUA Mock
year:
number: Q2
section: Multiple Choice
difficulty: 6
topics: [Trigonometry, Function]
subtopics: [Trigonometric Equations, Absolute Value Functions]
tags: [General-Trigonometry, General-Number-of-Solutions]
status: 已入库
---

## 题目
How many solutions are there to the equation
$$ |\tan x| + \frac{1}{\tan x} = 3 \quad \text{for } \quad 0^\circ \le x \le 360^\circ? $$
$$ \mathbf{A} \quad 2 $$
$$ \mathbf{B} \quad 4 $$
$$ \mathbf{C} \quad 5 $$
$$ \mathbf{D} \quad 6 $$
$$ \mathbf{E} \quad 8 $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Let $t = \tan x$, where $t \neq 0$. The equation becomes
$$ |t| + \frac{1}{t} = 3. $$

If $t > 0$, then $t + \frac{1}{t} = 3$, so $t^2 - 3t + 1 = 0$. This quadratic has two positive roots, you can see this by sketching suitable graphs, such as $y = 1$ and $y = 3t - t^2$, there is no need to solve the equation for $t$. Each root gives two values of $x$ for $0^\circ \le x \le 360^\circ$. Hence there are $4$ solutions.

If $t < 0$, then $-t + \frac{1}{t} = 3$, so $t^2 + 3t - 1 = 0$. This quadratic has one negative root, which gives two values of $x$ in the given interval. Hence there are $2$ more solutions.

Therefore, the total number of solutions is $4 + 2 = 6$.
