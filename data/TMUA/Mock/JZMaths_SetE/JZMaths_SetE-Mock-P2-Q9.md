---
database: TMUA
qid: 20132101209209
id: JZMaths_SetE-Mock-P2-Q9
paper: TMUA Mock
year:
number: Q9
section: Multiple Choice
difficulty: 7
topics: []
subtopics: []
tags: [Integration, Differentiation]
status: 已入库
---

## 题目
For real $t$, define
$$
A(t) = \int_{-1}^1 |x^2 - t| \,dx.
$$
Find the minimum possible value of $A(t)$.
$$ \mathbf{A} \quad \frac{1}{4} $$
$$ \mathbf{B} \quad \frac{1}{3} $$
$$ \mathbf{C} \quad \frac{1}{2} $$
$$ \mathbf{D} \quad \frac{2}{3} $$
$$ \mathbf{E} \quad \frac{3}{4} $$
$$ \mathbf{F} \quad 1 $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
If $t < 0$ or $t > 1$, moving $t$ towards the interval $[0, 1]$ decreases the integral, so the minimum occurs with $0 \le t \le 1$.

For $0 \le t \le 1$, the graphs $y = x^2$ and $y = t$ intersect at $x = \pm \sqrt{t}$. By symmetry,

$$
A(t) = 2 \left( \int_0^{\sqrt{t}} (t - x^2) \,dx + \int_{\sqrt{t}}^1 (x^2 - t) \,dx \right).
$$

Evaluating the integrals gives
$$
A(t) = \frac{2}{3} - 2t + \frac{8}{3}t^{3/2}.
$$

Therefore,
$$
A'(t) = -2 + 4\sqrt{t}.
$$

Setting $A'(t) = 0$ gives $\sqrt{t} = \frac{1}{2}$, so $t = \frac{1}{4}$. Since $A'(t) < 0$ before this value and $A'(t) > 0$ afterwards, this gives the minimum.

Finally find $A$ at $t = \frac{1}{4}$,
$$
A\left(\frac{1}{4}\right) = \frac{1}{2}.
$$
