---
database: TMUA
qid: 20132101205202
id: JZMaths_SetA-Mock-P2-Q2
paper: TMUA Mock
year:
number: Q2
section: Multiple Choice
difficulty: 5.5
topics: [Calculus, Algebra (Basic)]
subtopics: [Differentiation, Algebra Manipulation]
tags: [Differentiation]
status: 已入库
---

## 题目
What is the gradient of the curve
$$ y = \frac{(\sqrt{x} + 2)^3}{x\sqrt{x}} $$
at the point where $x = 4$?
$$ \mathbf{A} \quad -\frac{5}{2} $$
$$ \mathbf{B} \quad -\frac{3}{2} $$
$$ \mathbf{C} \quad -\frac{7}{2} $$
$$ \mathbf{D} \quad \frac{7}{2} $$
$$ \mathbf{E} \quad \frac{5}{2} $$
$$ \mathbf{F} \quad \frac{3}{2} $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Expand the numerator using the binomial expansion:

$$ (\sqrt{x} + 2)^3 = x^{3/2} + 6x + 12\sqrt{x} + 8. $$

Divide each term by $x\sqrt{x} = x^{3/2}$ to put $y$ in power form:

$$ y = 1 + 6x^{-1/2} + 12x^{-1} + 8x^{-3/2}. $$

Differentiate term by term:

$$ \frac{dy}{dx} = -3x^{-3/2} - 12x^{-2} - 12x^{-5/2}. $$

At $x = 4$ we have $4^{-3/2} = \frac{1}{8}$, $4^{-2} = \frac{1}{16}$, $4^{-5/2} = \frac{1}{32}$, so

$$ \frac{dy}{dx} = -\frac{3}{8} - \frac{3}{4} - \frac{3}{8} = -\frac{3}{2}. $$
