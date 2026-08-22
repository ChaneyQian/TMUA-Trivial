---
database: TMUA
qid: 20132101213110
id: BeyondHorizonS3-Mock-P1-Q10
paper: TMUA Mock
year:
number: Q10
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The curve $y = 2x^3 - 9x + 5$ has turning points at $x = \alpha$ and $x = \beta$, where $\beta > \alpha$. Find
$$\int_{\alpha}^{\beta} 2x^3 - 9x + 5 \, dx$$
$$\mathbf{A} \quad -16\sqrt{2}$$
$$\mathbf{B} \quad -20$$
$$\mathbf{C} \quad -20 + 12\sqrt{2}$$
$$\mathbf{D} \quad 0$$
$$\mathbf{E} \quad 5\sqrt{2}$$
$$\mathbf{F} \quad 5\sqrt{6}$$
$$\mathbf{G} \quad 20\sqrt{2}$$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
Differentiating gives $\frac{dy}{dx} = 6x^2 - 9$, which vanishes at $x = \pm\sqrt{\frac{3}{2}} = \pm\frac{\sqrt{6}}{2}$. So the limits are $\alpha = -\frac{\sqrt{6}}{2}$ and $\beta = \frac{\sqrt{6}}{2}$, an interval symmetric about the origin. The integrand splits into the odd part $2x^3 - 9x$ and the constant $5$; the odd part integrates to zero over a symmetric interval, so only the constant survives and the integral equals $5(\beta - \alpha) = 5\sqrt{6}$. The answer is F. Option D is the trap for anyone who assumes the whole integrand is odd and gets zero, forgetting the $+5$.
