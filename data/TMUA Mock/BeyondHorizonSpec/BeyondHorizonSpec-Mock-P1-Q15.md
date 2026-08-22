---
database: TMUA
qid: 20132101215115
id: BeyondHorizonSpec-Mock-P1-Q15
paper: TMUA Mock
year:
number: Q15
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The curve defined by
$$y = \frac{ax+b}{cx+d}$$
(where $a, b, c, d \neq 0$) is symmetric about the line $y = -x$. Which condition must hold for the coefficients?
$$\mathbf{A} \quad a + b = 0$$
$$\mathbf{B} \quad a + d = 0$$
$$\mathbf{C} \quad a - b = 0$$
$$\mathbf{D} \quad a - d = 0$$
$$\mathbf{E} \quad b + c = 0$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Reflection in the line $y = -x$ sends the point $(x, y)$ to $(-y, -x)$, so the curve is symmetric about that line exactly when $(-y, -x)$ satisfies the equation whenever $(x, y)$ does. Clearing denominators, the original curve is $cxy + dy - ax - b = 0$. Substituting $x \mapsto -y$ and $y \mapsto -x$ gives $c(-y)(-x) + d(-x) - a(-y) - b = 0$, that is $cxy + ay - dx - b = 0$. The two equations describe the same curve only if corresponding coefficients agree, and comparing the $y$ terms gives $d = a$, the $x$ terms giving the same condition. So the required relation is $a - d = 0$. As a check, $y = \frac{x+1}{2x+1}$ has centre $\left(-\frac{1}{2}, \frac{1}{2}\right)$, which lies on $y = -x$, and one of its two axes of symmetry is precisely $y = -x$. The answer is D.
