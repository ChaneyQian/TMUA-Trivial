---
database: TMUA
qid: 20132101207114
id: JZMaths_SetC-Mock-P1-Q14
paper: TMUA Mock
year:
number: Q14
section: Multiple Choice
difficulty: 7
topics: [Calculus, Polynomial, Logic and Proof]
subtopics: [Differentiation Application, Solution of Equations, Graphical Arguments, Differentiation]
tags: [Differentiation, General-Number-of-Solutions]
status: 已入库
---

## 题目
The function $f$ is defined for all real $x$ by
$$ f(x) = \frac{1}{4}x^4 - \frac{1}{3}kx^3 - k^2x^2 + k, $$
where $k$ is a real constant. Given that the equation $f(x) = 0$ has four distinct real roots, what are the possible values of $k$?
$$ \mathbf{A} \quad k > \sqrt[3]{\frac{12}{5}} $$
$$ \mathbf{B} \quad k < -\sqrt[3]{\frac{12}{5}} \quad \text{or} \quad k > \sqrt[3]{\frac{12}{5}} $$
$$ \mathbf{C} \quad k > \sqrt[3]{\frac{3}{8}} $$
$$ \mathbf{D} \quad k < 0 \quad \text{or} \quad k > \sqrt[3]{\frac{12}{5}} $$
$$ \mathbf{E} \quad 0 < k < \sqrt[3]{\frac{12}{5}} $$
$$ \mathbf{F} \quad k > \sqrt{\frac{12}{5}} $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Differentiate: $f'(x) = x^3 - kx^2 - 2k^2x = x(x + k)(x - 2k)$.

If $k = 0$, then $f(x) = \frac{1}{4}x^4$, so $f(x) = 0$ does not have four distinct real roots.

Now suppose $k \neq 0$. The stationary points occur at $x = -k$, $x = 0$, and $x = 2k$. They are minimum, maximum and minimum respectively. For 4 distinct roots, we must have the minimums below $x$-axis and maximum above $x$-axis.

Start with maximum at $x = 0$, $f(0) = k$, so we must have $k > 0$.

Next, both local minima must be below the $x$-axis.

At $x = -k$,
$$ f(-k) = \frac{1}{4}k^4 + \frac{1}{3}k^4 - k^4 + k = k - \frac{5}{12}k^4, $$
