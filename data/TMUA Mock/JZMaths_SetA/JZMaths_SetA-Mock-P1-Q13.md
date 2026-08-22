---
database: TMUA
qid: 20132101205113
id: JZMaths_SetA-Mock-P1-Q13
paper: TMUA Mock
year:
number: Q13
section: Multiple Choice
difficulty: 7.5
topics: [Polynomial, Logic and Proof, Algebra (Basic)]
subtopics: [Solution of Equations, Graphical Arguments, Algebra Manipulation]
tags: [Differentiation, General-Number-of-Solutions]
status: 已入库
---

## 题目
Find the set of values of $a$ for which the equation

$$ x^4 - 4ax^3 + 4a^2x^2 - a = 0 $$

has exactly 4 distinct real solutions.

$$ \mathbf{A} \quad a > 1 $$
$$ \mathbf{B} \quad |a| > 2 $$
$$ \mathbf{C} \quad a > 2 $$
$$ \mathbf{D} \quad a > \frac{1}{2} $$
$$ \mathbf{E} \quad a > \frac{3}{2} $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
**Method 1**

Rewrite the equation as

$$ x^2(x - 2a)^2 - a = 0, $$

hence

$$ x^2(x - 2a)^2 = a. $$

The left-hand side is always non-negative, and $a = 0$ leads to 1 solution, therefore $a > 0$ for there to be 4 real solutions.

Take square roots:

$$ x(x - 2a) = \pm\sqrt{a}, $$

results in two quadratic equations: $x(x - 2a) = \sqrt{a}$ and $x(x - 2a) = -\sqrt{a}$.

Now a good way to proceed, is to consider the graph if $y = x(x - 2a)$, which immediately reveals:

(i) The two equations cannot share any roots unless $a = 0$, and we have $a > 0$ therefore this cannot be the case.

(ii) Since $a>0$, the equation $x(x-2a)=\sqrt a$ definitely has two distinct roots.

(iii) For $x(x-2a)=-\sqrt a$ to have two distinct roots, the minimum turning point of $x(x-2a)$, which is $(a,-a^2)$, must lie below $y=-\sqrt a$.

Thus the remaining requirement is

$$ -a^2<-\sqrt a \quad\Longleftrightarrow\quad a^2>\sqrt a. $$

Both sides are positive, so squaring gives the equivalent condition

$$ a^4>a\quad\Longleftrightarrow\quad a^3>1\quad\Longleftrightarrow\quad a>1. $$
