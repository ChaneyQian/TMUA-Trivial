---
database: TMUA
qid: 20132101208111
id: JZMaths_SetD-Mock-P1-Q11
paper: TMUA Mock
year:
number: Q11
section: Multiple Choice
difficulty: 7
topics: [Calculus, Function, Polynomial]
subtopics: [Differentiation Application, Functions, Algebraic Functions, Solution of Equations]
tags: [General-Number-of-Solutions, Graphs-of-Functions]
status: 已入库
---

## 题目
Let $f(x) = -x^3 + kx^2 + 3$, where $k$ is a real constant. Suppose that $f(x) = 0$ has exactly 3 distinct real roots.

Which of the following equations must also have exactly 3 distinct real roots?

I $\quad$ $-f(x) + a = 0$, where $a$ is an arbitrary real constant

II $\quad$ $5 - 2f(2 - 3x) = 0$

III $\quad$ $f(-|x|) - 3 = 0$

$$ \mathbf{A} \quad \text{I only} $$
$$ \mathbf{B} \quad \text{II only} $$
$$ \mathbf{C} \quad \text{III only} $$
$$ \mathbf{D} \quad \text{I and III only} $$
$$ \mathbf{E} \quad \text{I and II only} $$
$$ \mathbf{F} \quad \text{all of them} $$
$$ \mathbf{G} \quad \text{II and III only} $$
$$ \mathbf{H} \quad \text{none of them} $$

## 备注

### 我的备注

### AI备注


## 答案
G

## 解析
We have $f'(x) = x(2k - 3x)$, so the stationary points are at $x=0$ and $x=\frac{2k}{3}$.

Since $f(0) = 3 > 0$ and $f(x) = 0$ has three distinct real roots, $x=0$ must be the local maximum and the other stationary point must be a local minimum below the $x$-axis. Hence $\frac{2k}{3} < 0$, so $k < 0$.

Equation I need not have three distinct real roots, since $a$ can be chosen sufficiently large that both stationary values of $-f(x) + a$ are positive, giving only one real root.

For II, let $u = 2 - 3x$. Then
$$ 5 - 2f(2 - 3x) = 0 \quad \Longleftrightarrow \quad f(u) = \frac{5}{2}. $$
The local maximum value is 3 and the local minimum value is negative. Since $0 < \frac{5}{2} < 3$, the line $y = \frac{5}{2}$ intersects the graph three times. As $u = 2 - 3x$ is one-to-one, II has three distinct real roots.

For III,
$$ f(-|x|) - 3 = |x|^3 + kx^2 = x^2(|x| + k). $$
Since $k < 0$, the equation has the three distinct roots $x = 0$, $x = k$ and $x = -k$.

Therefore, II and III only must have exactly three distinct real roots.
