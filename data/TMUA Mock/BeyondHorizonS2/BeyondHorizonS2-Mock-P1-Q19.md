---
database: TMUA
qid: 20132101212119
id: BeyondHorizonS2-Mock-P1-Q19
paper: TMUA Mock
year:
number: Q19
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The smallest value of
$$I(a) = \int_{0}^{1} \left(x^2 - 2a\right)^2 dx,$$
as $a$ varies, is
$$\mathbf{A} \quad \frac{5}{21}$$
$$\mathbf{B} \quad \frac{6}{41}$$
$$\mathbf{C} \quad \frac{8}{23}$$
$$\mathbf{D} \quad 1$$
$$\mathbf{E} \quad \frac{9}{22}$$
$$\mathbf{F} \quad \frac{4}{45}$$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
Expand the square and integrate term by term, treating $a$ as a constant:
$$I(a) = \int_{0}^{1}\left(x^4 - 4a x^2 + 4a^2\right)dx = \frac{1}{5} - \frac{4a}{3} + 4a^2.$$
This is an upward quadratic in $a$, minimised where $I'(a) = 8a - \frac{4}{3} = 0$, i.e. at $a = \frac{1}{6}$. Substituting back,
$$I\!\left(\frac{1}{6}\right) = \frac{1}{5} - \frac{4}{3}\cdot\frac{1}{6} + 4\cdot\frac{1}{36} = \frac{1}{5} - \frac{2}{9} + \frac{1}{9} = \frac{1}{5} - \frac{1}{9} = \frac{4}{45}.$$
The answer is F. Option D is the trap of choosing $a$ so that the bracket vanishes at an endpoint instead of genuinely minimising the integral.
