---
database: GMAT
qid: 90020713200
id: ALG-PS-Q32
paper: GMAT Algebra PS Diagnostic
year: 0
number: Q32
section: Problem Solving
band: VERY HARD
level: LEVEL 7
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
If $\dfrac{|x| - 2}{|x - 2|}= 1$, then which of the following must be true?

I. $|x| > 2$
II. $x^2 < 1$
III. $x^3 > 0$

$$
\mathbf{A} \quad I\text{ only}
$$

$$
\mathbf{B} \quad II\text{ only}
$$

$$
\mathbf{C} \quad III\text{ only}
$$

$$
\mathbf{D} \quad I\text{ and }III\text{ only}
$$

$$
\mathbf{E} \quad \text{None}
$$

## 备注

### 我的备注

### AI备注

## 答案
D

## 解析
**Official Solution:**

Note that $\frac{|x| - 2}{|x - 2|} = 1$ implies that both $x$ and $x - 2$ must be positive. In this case, the left-hand side becomes $\frac{x - 2}{x - 2}$, which equals 1. For both $x$ and $x - 2$ to be positive, $x$ must be greater than 2. Therefore, $\frac{|x| - 2}{|x - 2|} = 1$ implies that $x > 2$.

Alternatively, we can derive the same conclusion using the following algebraic manipulations:

$\frac{|x| - 2}{|x - 2|} = 1$

Cross-multiply:

$|x| - 2= |x - 2|$;

$|x|= |x - 2|+2$

Square both sides (we can do this safely since both sides of the equation are positive):

$x^2 = x^2 - 4x + 4 + 4|x-2| + 4$

$x - 2 = |x-2|$

The above implies that $x - 2 > 0$ (recall that $|a| = a$ when $a \geq 0$).

Now, $x - 2 > 0$ means that $x > 2$.

So, the question essentially asks if $x > 2$, then which of the following must be true?

I. $|x| > 2$. Since the possible values of $x$ are such that $x > 2$, $|x| > 2$ will always be true. So, this option is always true.

II. $x^2 < 1$. This option is never true because if $x > 2$, then $x^2$ will be greater than 1, not less than 1.

III. $x^3 > 0$. Since $x$ is positive ($x > 2$), the cube of $x$ will always be greater than 0. Thus, this option is always true.

Answer: D
