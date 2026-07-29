---
database: TMUA
qid: 20132101100203
id: Spec-P2-Q3
paper: TMUA P2
year:
number: Q3
section: Reasoning
difficulty: 0
topics: []
subtopics: []
tags:
  - specimen
status: 已入库
---

## 题目
Consider the following attempt to solve an equation. The steps have been numbered for reference.

$$
\begin{array}{rl}
\sqrt{x+5} = x+3 & \\
 & \searrow \text{(1)} \\
x+5 = x^2+6x+9 & \\
 & \searrow \text{(2)} \\
x^2+5x+4 = 0 & \\
 & \searrow \text{(3)} \\
(x+4)(x+1) = 0 & \\
\\
x=-4 \text{ or } x=-1 &
\end{array}
$$

Which one of the following statements is true?

$$
\mathbf {A} \quad \text{Both −4 and −1 are solutions of the equation.}
$$

$$
\mathbf {B} \quad \text{Neither −4 nor −1 are solutions of the equation.}
$$

$$
\mathbf {C} \quad \text{One solution is correct and the incorrect solution arises as a result of step (1).}
$$

$$
\mathbf {D} \quad \text{One solution is correct and the incorrect solution arises as a result of step (2).}
$$

$$
\mathbf {E} \quad \text{One solution is correct and the incorrect solution arises as a result of step (3).}
$$
## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
We can determine whether $x = - 4 { \mathrm { ~ a n d } } / { \mathrm { o r ~ } } x = - 1$ are solutions by substituting them back into the original equation.

Substituting $x = - 4 { \mathrm { ~ g i v e s ~ } } { \sqrt { x + 5 } } = { \sqrt { - 4 + 5 } } = 1 { \mathrm { ~ a n d ~ } } x + 3 = - 4 + 3 = - 1$ , so this is not a solution.

Substituting x = −1 gives x + 5 = −1 + 5 = 2 and x + 3 = −1 + 3 = 2, so this is a solution.

Where does x = −4 arise?

Working backwards, once we have reached the line $( x + 4 ) ( x + 1 ) = 0$ , it is clear that there are the two proposed solutions.

The previous line is just the expansion of this; the equations $x ^ { 2 } + 5 x + 4 = 0 { \mathrm { ~ a n d ~ } } ( x + 4 ) ( x + 1 ) = 0$ are algebraically equivalent, so step (3) is fine.

Likewise, $x + 5 = x ^ { 2 } + 6 x + 9$ is algebraically equivalent to these, obtained by a simple rearrangement, so step (2) is fine. And indeed, x = −4 is a solution to this equation, as is easy to check.

Therefore the extra solution was introduced at step (1), when we squared the equation: on the first line, x = −4 gives the incorrect −1 = 1, while squaring this gives the correct 1 = 1. Hence the correct answer is C.

We can go further, though, and ask how we could correct the solution. If we introduce implication symbols between pairs of lines, it will be clearer what is happening. The symbol $^ 6 \Longleftrightarrow ^ { \prime }$ indicates that this line is equivalent to the previous line, while ‘ =⇒ ’ indicates that this line follows from the previous line, but not vice versa.

The argument now reads as follows:

$$
\begin{array}{r l r} & & {\sqrt {x + 5} = x + 3} \\ & {\Longrightarrow} & {x + 5 = x ^ {2} + 6 x + 9} \\ & {\Longleftrightarrow} & {x ^ {2} + 5 x + 4 = 0} \\ & {\Longleftrightarrow} & {(x + 4) (x + 1) = 0} \\ & {\Longleftrightarrow} & {x = - 4 \mathrm{or} x = - 1} \end{array}
$$

The first line is only a one-way implication, as $a ^ { 2 } = b ^ { 2 }$ does not imply that $a = b ,$ , for example if a = 1 and b = −1 (as in our case).

Since not every line is an ‘if and only if’ implication, all we can say is the following: if the original equation is true, then x = −4 or x = −1. However, this argument does not show that if $x = - 4 \ \mathrm { o r } \ x = - 1$ , then the original equation is true. So to correctly complete the argument, we must check whether these possibilities satisfy the original equation.
