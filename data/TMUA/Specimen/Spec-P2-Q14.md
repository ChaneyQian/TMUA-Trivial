---
database: TMUA
qid: 90010221400
id: Spec-P2-Q14
paper: TMUA P2
year:
number: Q14
section: Reasoning
difficulty: 0
topics: []
subtopics: []
tags:
  - specimen
status: 已入库
---

## 题目
The graph of the polynomial function

$$
y = ax^5 + bx^4 + cx^3 + dx^2 + ex + f,
$$

is sketched, where $a$, $b$, $c$, $d$, $e$, and $f$ are real constants with $a \neq 0$.

Which one of the following is **not** possible?

$$
\mathbf{A} \quad \text{The graph has two local minima and two local maxima.}
$$

$$
\mathbf{B} \quad \text{The graph has one local minimum and two local maxima.}
$$

$$
\mathbf{C} \quad \text{The graph has one local minimum and one local maximum.}
$$

$$
\mathbf{D} \quad \text{The graph has no local minima or local maxima.}
$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
We can work out the locations of the local maxima and minima by solving $\begin{array} { r } { { \frac { \mathrm { d } y } { \mathrm { d } x } } = 0 } \end{array}$ . We have

$$
\frac {\mathrm{d} y}{\mathrm{d} x} = 5 a x ^ {4} + 4 b x ^ {3} + 3 c x ^ {2} + 2 d x + e,
$$

which is a quartic (a degree 4 polynomial). This can have at most 4 roots, so there are at most 4 stationary points.

This does not seem to help us that much, as all of the options have at most 4 stationary points! We also observe that we are starting with a degree 5 polynomial, so if $a > 0$ , y tends to +∞ as x tends to +∞ and y tends to −∞ as x tends to −∞. Similarly, if $a < 0$ , we have the reverse of this. If we now try sketching the four possibilities offered, we will see what happens:

A Two local minima and two local maxima might look like this:

![[Image/Spec-P2-Q14-sol1.jpg]]

This seems plausible.

B One local minimum and two local maxima might look like this:

![[Image/Spec-P2-Q14-sol2.jpg]]

This is not possible, because y tends to −∞ both when x tends to $+ \infty$ and to −∞.

C One local minimum and one local maximum might look like this:

![[Image/Spec-P2-Q14-sol3.jpg]]

This seems plausible; there is no requirement that the quartic $\begin{array} { r } { { \frac { \mathrm { d } y } { \mathrm { d } x } } = 0 } \end{array}$ has four real roots, so there need not be exactly four stationary points.

D The curve $y = x ^ { 5 }$ has no local minima or local maxima (though it does have a point of inflection at the origin), so this is certainly possible.

So the only one which is not possible is B.

If we want to construct explicit examples of A and C, we could start by choosing $\frac { \mathrm { d } y } { \mathrm { d } x }$ as a quartic which has exactly four real roots (such as $( x - 1 ) ( x - 2 ) ( x - 3 ) ( x - 4 ) )$ or exactly two real roots (such as $( x ^ { 2 } + 1 ) ( x - 1 ) ( x - 2 ) )$ and then integrating it to obtain our desired function. Similarly, if we wanted to find an example for D which has no stationary points at all, we could integrate a function such as $( x ^ { 2 } + 1 ) ^ { 2 }$
