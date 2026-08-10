---
database: TMUA
qid: 20132101208220
id: JZMaths_SetD-Mock-P2-Q20
paper: TMUA Mock
year:
number: Q20
section: Multiple Choice
difficulty: 8.5
topics: [Calculus, Polynomial, Logic and Proof]
subtopics: [Differentiation Application, Polynomials, Graphical Arguments]
tags: [Graphs of Functions, Differentiation, General Number of Solutions]
status: 已入库
---

## 题目
Let

$$ y = ax^7 + bx^6 + cx^5 + dx^4 + ex^3 + fx^2 + gx + h, \qquad a 
e 0, $$

where $a, b, c, d, e, f, g, h$ are real numbers. Call a point on the graph an **inflection with zero gradient** if $\frac{dy}{dx} = 0$ there but $\frac{dy}{dx}$ does not change sign as $x$ passes through it.

Which one of the following triples (number of local minima, number of local maxima, number of inflections with zero gradient) **is possible** for some choice of the real coefficients?

You may find it useful to recall that $\frac{dy}{dx}$ changes sign at a local maximum or minimum, but does not change sign at a stationary point of inflection.

$$ \mathbf{A} \quad (0, 0, 4) $$
$$ \mathbf{B} \quad (2, 2, 2) $$
$$ \mathbf{C} \quad (2, 3, 0) $$
$$ \mathbf{D} \quad (3, 3, 1) $$
$$ \mathbf{E} \quad (1, 1, 3) $$
$$ \mathbf{F} \quad (2, 1, 1) $$
$$ \mathbf{G} \quad (2, 2, 1) $$

## 备注

### 我的备注

### AI备注


## 答案
G

## 解析
Since $y$ is a polynomial of degree 7, its derivative $\frac{dy}{dx}$ is a polynomial of degree 6.

Consider the graph of $\frac{dy}{dx}$. Its roots are the points where it meets the $x$-axis.

At a local maximum or minimum of $y$, $\frac{dy}{dx}$ changes sign, so its graph crosses the $x$-axis. In the factorised form of $\frac{dy}{dx}$, the corresponding factor must therefore be $(x - r)^m$, where $m$ is **odd** and $r$ is the $x$-coordinate of the point.

At an inflection with zero gradient, $\frac{dy}{dx}$ does not change sign, so its graph touches the $x$-axis and turns back. The corresponding factor must therefore be $(x - r)^m$, where $m$ is **even** and $r$ is the $x$-coordinate of the point.

Hence each local maximum or minimum uses at least one root of $\frac{dy}{dx}$, while each inflection with zero gradient uses at least two.

Also, since $\frac{dy}{dx}$ has even degree, it has the same sign as $x \to -\infty$ and as $x \to \infty$. Therefore the number of changes from positive to negative must equal the number of changes from negative to positive, so the number of local maxima must equal the number of local minima.

Now check the options.

$(0, 0, 4)$ requires at least $2 \cdot 4 = 8$ roots of $\frac{dy}{dx}$, impossible.

$(2, 2, 2)$ requires at least $2 + 2 + 2 \cdot 2 = 8$ roots of $\frac{dy}{dx}$, impossible.

$(2, 3, 0)$ has unequal numbers of local minima and local maxima, impossible.

$(3, 3, 1)$ requires at least $3 + 3 + 2 = 8$ roots of $\frac{dy}{dx}$, impossible.

$(1, 1, 3)$ requires at least $1 + 1 + 2 \cdot 3 = 8$ roots of $\frac{dy}{dx}$, impossible.

$(2, 1, 1)$ has unequal numbers of local minima and local maxima, impossible.

But $(2, 2, 1)$ requires at least

$$ 2 + 2 + 2 = 6 $$

roots of $\frac{dy}{dx}$, which is possible for a degree 6 derivative.

For example, $\frac{dy}{dx}$ could have four simple roots causing two local minima and two local maxima, and one double root giving one inflection with zero gradient.

So the possible triple is $(2, 2, 1)$.
