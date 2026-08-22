---
database: TMUA
qid: 20132101215120
id: BeyondHorizonSpec-Mock-P1-Q20
paper: TMUA Mock
year:
number: Q20
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Consider the area bounded by the graphs of the following equations:
$$
\begin{aligned}
x^2 - y^2 &= 1 \\
x^2 - y^2 &= -1 \\
y - \sqrt{3} &= x + 2 \\
-y - \sqrt{3} &= x + 2 \\
y - \sqrt{3} &= -x + 2 \\
-y - \sqrt{3} &= -x + 2
\end{aligned}
$$
What is the area of the enclosed region? You are given that the area bound by the curve $x^2 - y^2 = 1$ and the line $x = 2$ is $2\sqrt{3} - \ln(2 + \sqrt{3})$.
$$\mathbf{A} \quad 1 + 1\ln(1 + \sqrt{3})$$
$$\mathbf{B} \quad 1 + 2\ln(2 + \sqrt{3})$$
$$\mathbf{C} \quad 2 + \ln(2 + \sqrt{3})$$
$$\mathbf{D} \quad 2 + 2\ln(2 + \sqrt{3})$$
$$\mathbf{E} \quad 1 + 2\ln(1 + \sqrt{3})$$
$$\mathbf{F} \quad 2 + 4\ln(2 + \sqrt{3})$$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
The two hyperbolas together carve out the region $|x^2 - y^2| \leq 1$, a cross-shaped set hugging the two diagonals, while the four lines rearrange to $y = x + (2+\sqrt{3})$, $y = -x - (2+\sqrt{3})$, $y = -x + (2+\sqrt{3})$ and $y = x - (2+\sqrt{3})$, bounding a square with vertices $(\pm(2+\sqrt{3}), 0)$ and $(0, \pm(2+\sqrt{3}))$. Each of the four arms of the cross is cut off by the side of the square perpendicular to it. Now rotate by $45^\circ$ with $u = \frac{x+y}{\sqrt{2}}$ and $v = \frac{x-y}{\sqrt{2}}$; this is an isometry, so areas are unchanged. Then $x^2 - y^2 = (x+y)(x-y) = 2uv$, so the hyperbola condition becomes $|uv| \leq \frac{1}{2}$, while the four lines become $u = \pm k$ and $v = \pm k$ with $k = \frac{2+\sqrt{3}}{\sqrt{2}}$. The region is now the part of the square $|u| \leq k$, $|v| \leq k$ lying between the branches $uv = \pm\frac{1}{2}$, and by symmetry it is four copies of its first-quadrant piece. In that quadrant the boundary $v = \frac{1}{2u}$ meets $v = k$ at $u_0 = \frac{1}{2k}$, so the piece has area
$$k u_0 + \int_{u_0}^{k} \frac{du}{2u} = \frac{1}{2} + \frac{1}{2}\ln\frac{k}{u_0} = \frac{1}{2} + \frac{1}{2}\ln\left(2k^2\right).$$
Since $2k^2 = (2+\sqrt{3})^2$, this equals $\frac{1}{2} + \ln(2+\sqrt{3})$, and multiplying by 4 gives a total area of $2 + 4\ln(2+\sqrt{3})$. The answer is F.
