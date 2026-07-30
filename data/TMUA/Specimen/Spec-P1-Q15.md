---
database: TMUA
qid: 90010211500
id: Spec-P1-Q15
paper: TMUA P1
year:
number: Q15
section: Applications
difficulty: 0
topics: []
subtopics: []
tags:
  - specimen
status: 已入库
---

## 题目
The smallest possible value of $\int_0^1 (x - a)^2 dx$ as $a$ varies is

$$
\mathbf {A} \quad \frac{1}{12}
$$

$$
\mathbf {B} \quad \frac{1}{3}
$$

$$
\mathbf {C} \quad \frac{1}{2}
$$

$$
\mathbf {D} \quad \frac{7}{12}
$$

$$
\mathbf {E} \quad 2
$$
## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
We start by evaluating the integral to obtain

$$
\begin{array}{r l} \int_ {0} ^ {1} (x - a) ^ {2} \mathrm{d} x & = \int_ {0} ^ {1} x ^ {2} - 2 a x + a ^ {2} \mathrm{d} x \\ & = \left[ \frac {1}{3} x ^ {3} - a x ^ {2} + a ^ {2} x \right] _ {0} ^ {1} \\ & = \frac {1}{3} - a + a ^ {2} \end{array}
$$

We can now complete the square on this final expression to obtain

$$
(a - \frac {1}{2}) ^ {2} - (\frac {1}{2}) ^ {2} + \frac {1}{3} = (a - \frac {1}{2}) ^ {2} + \frac {1}{1 2}
$$

and so the smallest possible value is $\textstyle { \frac { 1 } { 1 2 } }$ , which is option $\mathrm { A }$ .

We could alternatively have used calculus to find the stationary point of ${ \textstyle { \frac { 1 } { 3 } } } - a + a ^ { 2 }$ (by differentiating with respect to $a )$ , and then noting that this is a local minimum, and that the function is greater than this at all other points.
