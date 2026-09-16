---
database: TMUA
qid: 20132101212212
id: BeyondHorizonS2-Mock-P2-Q12
paper: TMUA Mock
year:
number: Q12
section: Multiple Choice
difficulty: 0
topics: [Polynomial, Calculus]
subtopics: [Solution of Equations, Differentiation Application]
tags: [Root-Counting, Turning-Points, Factorisation]
status: 已入库
---

## 题目
How many positive real roots does this equation have?
$$x^4 - 2\sqrt{2}x^3 + 2x^2 - 4x = 0.$$
$$\mathbf{A} \quad 0$$
$$\mathbf{B} \quad 1$$
$$\mathbf{C} \quad 2$$
$$\mathbf{D} \quad 3$$
$$\mathbf{E} \quad 4$$

## 备注

### 我的备注

### AI备注
- **键对拍（2026-09-11，键源 tmua.fyi）**：键给 **C**（2 个正根），库记 **B**（1 个）。**库是对的，键错。**
  $x^4-2\sqrt2x^3+2x^2-4x = x\,[\,x(x-\sqrt2)^2-4\,]$，而 $x(x-\sqrt2)^2$ 在 $x>0$ 上先升到 $\frac{8\sqrt2}{27}\approx0.42$、
  回落到 0、再单调升到 $\infty$，与 4 只交一次（$x\approx2.644$）。数值扫描 $(0,20]$ 亦只有 1 个变号点。站上题面与库内转写逐字一致，不是抄错。

## 答案
B

## 解析
Factor out $x$ to get $x\left(x^3 - 2\sqrt{2}x^2 + 2x - 4\right) = 0$. The root $x = 0$ is not positive, so everything depends on the cubic $g(x) = x^3 - 2\sqrt{2}x^2 + 2x - 4$. Its derivative $g'(x) = 3x^2 - 4\sqrt{2}x + 2$ has discriminant $32 - 24 = 8 > 0$, so $g$ has a local maximum at $x = \frac{\sqrt{2}}{3}$ and a local minimum at $x = \sqrt{2}$. The local maximum value $g\left(\frac{\sqrt{2}}{3}\right)$ is about $-3.58$, so the graph is already below the axis at its highest point on the left branch. Consequently $g$ crosses zero exactly once, on the increasing branch to the right of $x = \sqrt{2}$; numerically $g(2) \approx -3.31$ and $g(3) \approx 3.54$, which places that single crossing between $2$ and $3$. Hence the quartic has exactly one positive real root. The answer is B.
