---
database: TMUA
qid: 20132101100111
id: Spec-P1-Q11
paper: TMUA P1
year:
number: Q11
section: Applications
difficulty: 0
topics: []
subtopics: []
tags:
  - specimen
status: 已入库
---

## 题目
The sum of the roots of the equation $2^{2x} - 8 \times 2^x + 15 = 0$ is

$$
\mathbf {A} \quad 3
$$

$$
\mathbf {B} \quad 8
$$

$$
\mathbf {C} \quad 2\log_{10}2
$$

$$
\mathbf {D} \quad \log_{10}\left(\frac{15}{4}\right)
$$

$$
\mathbf {E} \quad \frac{\log_{10}15}{\log_{10}2}
$$
## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
Writing $y = 2 ^ { x }$ , the equation becomes $y ^ { 2 } - 8 y + 1 5 = 0$ , which factorises to give $( y - 3 ) ( y - 5 ) = 0$ Thus $y = 3$ or $y = 5 ,$ , so $2 ^ { x } = 3$ or $2 ^ { x } = 5$

The given options all use logarithms to base 10, so we will take logarithms of these two equations to base 10. The first gives $: \log _ { 1 0 } 2 = \log _ { 1 0 } 3$ , so $x = { \frac { \log _ { 1 0 } 3 } { \log _ { 1 0 } 2 } } .$ . Likewise, the second equation gives $x = { \frac { \log _ { 1 0 } 5 } { \log _ { 1 0 } 2 } }$ . Finally, we can add these to obtain

$$
\frac {\log_ {1 0} 3}{\log_ {1 0} 2} + \frac {\log_ {1 0} 1 5}{\log_ {1 0} 2} = \frac {\log_ {1 0} (3 \times 5}{\log_ {1 0} 2} = \frac {\log_ {1 0} 1 5}{\log_ {1 0} 2}
$$

and the answer is option E.

An alternative is to take logarithms to base 2, giving the roots as $\log_{2} 3$ and $\log_{2} 5$. These sum to $\log _ { 2 } 1 5$ Unfortunately, this is not one of the options offered, as they are all given using logarithms to base 10. If you know the change of base rule for logarithms, though, which states that $\log _ { a } b = { \frac { \log _ { c } b } { \log _ { c } a } }$ , you can put $c = 1 0$ to obtain the correct option.
