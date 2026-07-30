---
database: TMUA
qid: 20132101205110
id: JZMaths_SetA-Mock-P1-Q10
paper: TMUA Mock
year:
number: Q10
section: Multiple Choice
difficulty: 7.5
topics: []
subtopics: []
tags: [Differentiation]
status: 已入库
---

## 题目
The function
$$ f(x) = \frac{1}{4}x^{4/3} + \sqrt[3]{x} + \frac{3}{\sqrt[3]{x^2}} $$
is defined for all $x \neq 0$. The complete set of values of $x$ for which $f$ is increasing is given by

$$ \mathbf{A} \quad -3 \leq x < 0, \ x \geq 2 $$
$$ \mathbf{B} \quad x \leq -3, \ 0 < x \leq 2 $$
$$ \mathbf{C} \quad x \geq 2 $$
$$ \mathbf{D} \quad -3 < x < 0, \ x > 2 $$
$$ \mathbf{E} \quad -3 \leq x \leq 2, \ x \neq 0 $$
$$ \mathbf{F} \quad -3 \leq x \leq 0, \ x \geq 2 $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Write $f(x) = \frac{1}{4}x^{4/3} + x^{1/3} + 3x^{-2/3}$. Differentiating term by term:

$$ f'(x) = \frac{1}{3}x^{1/3} + \frac{1}{3}x^{-2/3} - 2x^{-5/3}. $$

Factor out $\frac{1}{3}x^{-5/3}$ (the lowest power):

$$ f'(x) = \frac{1}{3}x^{-5/3}(x^2 + x - 6) = \frac{1}{3}x^{-5/3}(x + 3)(x - 2). $$

The function is increasing where $f'(x) \geq 0$, but this is one rather daunting looking inequality! Can we divide out $x^{-5/3}$? No, because even though it cannot be zero, as $x \neq 0$, it can still be both positive (if $x > 0$) or negative (if $x < 0$).

A good way to determine the overall sign of $f'(x)$ in this case, is by considering the values of $x$ for which $f'(x)$ changes sign. For example consider what happens around $x = 2$, the value of the other two factors: $x^{-5/3}(x + 3)$, around $x = 2$, is not close to zero, and do not vary much around $x = 2$, so we can treat them as 'constant' for purpose of sign change around $x = 2$. But $x - 2$ changes sign on either side of $x = 2$.

Similarly, $f'(x)$ changes sign at $x=-3$, $0$, and $2$. The sign change at $0$ comes from $x^{-5/3}$, which is positive for $x>0$ and negative for $x<0$.

For large positive $x$, $f'(x)$ is positive. Following the sign changes therefore gives

$$ -3\leq x<0,\qquad x\geq 2. $$

The endpoints $-3$ and $2$ are included, while $x=0$ is excluded because $f$ is not defined there.
