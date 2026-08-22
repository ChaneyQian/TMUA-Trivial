---
database: TMUA
qid: 20132101212104
id: BeyondHorizonS2-Mock-P1-Q4
paper: TMUA Mock
year:
number: Q4
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The function $\dfrac{2 - x}{2\sqrt[3]{x^2}}$ is defined for all $x \neq 0$. The complete set of values of $x$ for which the function is decreasing is
$$\mathbf{A} \quad x \leq -4,\ x > 0$$
$$\mathbf{B} \quad -1 \leq x < 0$$
$$\mathbf{C} \quad x \leq 2$$
$$\mathbf{D} \quad x \geq 2$$
$$\mathbf{E} \quad -1 \leq x \leq 2$$
$$\mathbf{F} \quad x \leq -1,\ x \geq 2$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Split the quotient into powers of $x$: $f(x) = \frac{2 - x}{2x^{2/3}} = x^{-2/3} - \frac{1}{2}x^{1/3}$. Differentiating term by term,
$$f'(x) = -\frac{2}{3}x^{-5/3} - \frac{1}{6}x^{-2/3} = -\frac{1}{6}x^{-5/3}(4 + x) = -\frac{x + 4}{6\,x^{5/3}}.$$
For $x > 0$ the denominator $6x^{5/3}$ is positive and $x + 4 > 0$, so $f'(x) < 0$ for every positive $x$. For $x < 0$ the cube root makes $x^{5/3}$ negative, so $f'(x) < 0$ needs $x + 4 < 0$, i.e. $x < -4$; at $x = -4$ the derivative is zero, which is the boundary of the decreasing interval. The function is therefore decreasing on $x \leq -4$ and on $x > 0$. The answer is A. Options C to F all come from treating $2\sqrt[3]{x^2}$ as though it were a positive constant and solving inequalities in $2 - x$ alone.
