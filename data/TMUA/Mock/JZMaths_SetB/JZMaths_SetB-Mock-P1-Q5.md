---
database: TMUA
qid: 20132101206105
id: JZMaths_SetB-Mock-P1-Q5
paper: TMUA Mock
year:
number: Q5
section: Multiple Choice
difficulty: 6.5
topics: [Calculus]
subtopics: [Integration, Integral Identity]
tags: [Integration, Transformation-of-Graphs]
status: 已入库
---

## 题目
The function $f$ is continuous for all real $x$, and
$$ I = \int_1^5 f(x) \, dx. $$
Which one of the following is **necessarily** equal to $I$?
$$ \mathbf{A} \quad \int_{-2}^2 [f(x+3) + x^2] \, dx $$
$$ \mathbf{B} \quad \int_{-2}^2 [f(x+3) + x^3] \, dx $$
$$ \mathbf{C} \quad \int_{-2}^2 [f(x-3) + x^3] \, dx $$
$$ \mathbf{D} \quad \int_{-2}^2 [f(x-3) + x^2] \, dx $$
$$ \mathbf{E} \quad \int_{-1}^3 f(x-2) dx $$
$$ \mathbf{F} \quad \int_{-1}^3 [f(x+2) + x^2] \, dx $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
The graph of $y = f(x+3)$ is the graph of $y = f(x)$ translated 3 units to the left. Therefore, the area under $y = f(x+3)$ from $x = -2$ to $x = 2$ is equal to the area under $y = f(x)$ from $x = 1$ to $x = 5$. So
$$ \int_{-2}^2 f(x+3) \, dx = I. $$
Also, the graph of $y = x^3$ has rotational symmetry about the origin, so the signed area from $x = -2$ to $x = 2$ is 0. Hence
$$ \int_{-2}^2 x^3 \, dx = 0. $$

Therefore
$$
\int_{-2}^2 \left[f(x+3)+x^3\right] \, dx = I + 0 = I.
$$

The other options either add a positive $x^2$ term, or use a horizontal translation of $f$ over the wrong interval.
