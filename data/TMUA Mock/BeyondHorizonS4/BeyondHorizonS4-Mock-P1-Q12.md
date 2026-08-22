---
database: TMUA
qid: 20132101214112
id: BeyondHorizonS4-Mock-P1-Q12
paper: TMUA Mock
year:
number: Q12
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Find the value of
$$\int_1^5 \frac{4 - 3x}{x\sqrt{x}}\,dx$$
$$\mathbf{A} \quad \frac{14\sqrt{5} - 38}{\sqrt{5}}$$
$$\mathbf{B} \quad -\frac{95}{16}$$
$$\mathbf{C} \quad \frac{15\sqrt{5} - 38}{\sqrt{5}}$$
$$\mathbf{D} \quad -2$$
$$\mathbf{E} \quad -\frac{1}{2}$$
$$\mathbf{F} \quad \frac{9}{4}$$
$$\mathbf{G} \quad \frac{14\sqrt{5} - 38}{\sqrt{3}}$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Since $x\sqrt{x} = x^{3/2}$, the integrand splits into $4x^{-3/2} - 3x^{-1/2}$, whose antiderivative is $-8x^{-1/2} - 6x^{1/2}$. Evaluating between the limits,
$$\left[-\frac{8}{\sqrt{x}} - 6\sqrt{x}\right]_1^5 = \left(-\frac{8}{\sqrt{5}} - 6\sqrt{5}\right) - (-8 - 6) = 14 - \frac{8}{\sqrt{5}} - 6\sqrt{5}.$$
Putting this over the common denominator $\sqrt{5}$ gives $\frac{14\sqrt{5} - 8 - 30}{\sqrt{5}} = \frac{14\sqrt{5} - 38}{\sqrt{5}}$, which is about $-2.994$. The answer is A. Options C and G are decoys differing only in the numerator's leading coefficient and in the surd in the denominator, and option D, $-2$, is close enough numerically to catch anyone who estimates instead of evaluating.
