---
database: TMUA
qid: 20132101202115
id: Zetta-Mock-P1-Q15
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
Given that x is in radians, write
$$ \sin(2 \arctan(x)) $$
without using trigonometric functions.

$$
\mathbf{A} \quad \frac{1}{\sqrt{1 + x^2}}
$$

$$
\mathbf{B} \quad \frac{1 + x^2}{\sqrt{2x}}
$$

$$
\mathbf{C} \quad \frac{x}{\sqrt{1 + x^2}}
$$

$$
\mathbf{D} \quad \frac{2x}{1 + x^2}
$$

$$
\mathbf{E} \quad \frac{1}{\sqrt{2x}}
$$

$$
\mathbf{F} \quad \frac{2x}{1 - x^2}
$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Let $\theta = \arctan x$, so $\tan\theta = x$ with $\theta\in\left(-\tfrac{\pi}{2},\tfrac{\pi}{2}\right)$. Drawing the right triangle with opposite $x$ and adjacent $1$ gives hypotenuse $\sqrt{1+x^{2}}$, hence

$$ \sin\theta = \frac{x}{\sqrt{1+x^{2}}}, \qquad \cos\theta = \frac{1}{\sqrt{1+x^{2}}} $$

(both signs work out because $\cos\theta>0$ on that interval). The double angle formula then gives

$$ \sin(2\theta) = 2\sin\theta\cos\theta = \frac{2x}{1+x^{2}} $$

The answer is D. Option F is $\tan(2\arctan x)$ — the wrong double angle formula.
