---
database: TMUA
qid: 20132101206202
id: JZMaths_SetB-Mock-P2-Q2
paper: TMUA Mock
year:
number: Q2
section: Multiple Choice
difficulty: 5.5
topics: []
subtopics: []
tags: [Logic Deduction, General Algebra]
status: 已入库
---

## 题目
A student is asked to solve the equation
$$ \frac{\sqrt{x^3 + x^2 - x + 2}}{x + 2} = 1. $$

The student writes:

**Step (1):** Multiply both sides by $x + 2$ to obtain
$$ \sqrt{x^3 + x^2 - x + 2} = x + 2. $$

**Step (2):** Subtract both sides by 2 to get
$$ \sqrt{x^3 + x^2 - x} = x. $$

**Step (3):** Square both sides to obtain
$$ x^3 + x^2 - x = x^2. $$

**Step (4):** Rearrange to obtain
$$ x^3 - x = 0. $$

**Step (5):** Factorise to obtain
$$ x(x - 1)(x + 1) = 0. $$

**Step (6):** Deduce
$$ x = -1, 0, 1. $$

Which one of the following statements is correct?

$$ \mathbf{A} \quad \text{The final answers for } x \text{ are wrong, and the first error appears in Step (1).} $$
$$ \mathbf{B} \quad \text{The final answers for } x \text{ are wrong, and the first error appears in Step (2).} $$
$$ \mathbf{C} \quad \text{The final answers for } x \text{ are wrong, and the first error appears in Step (3).} $$
$$ \mathbf{D} \quad \text{The final answers for } x \text{ are wrong, and the first error appears in Step (4).} $$
$$ \mathbf{E} \quad \text{The final answers for } x \text{ are wrong, and the first error appears in Step (5).} $$

$$ \mathbf{F} \quad \text{The final answers for } x \text{ are wrong, and the first error appears in Step (6).} $$
$$ \mathbf{G} \quad \text{The final answers for } x \text{ are correct, and there is no error in the student's working.} $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
The original equation has denominator $x + 2$, so $x \neq -2$. Therefore multiplying both sides by $x + 2$ in Step (1) is valid.

Step (2) is also valid, giving
$$ \sqrt{x^3 + x^2 - x} = x. $$

However, this equation also tells us that $x \geq 0$, since the left hand side is a square root.

In Step (3), squaring both sides gives

$$ x^3 + x^2 - x = x^2, $$

which simplifies to

$$ x^3 - x = 0. $$

But this squaring step can introduce extra solutions, because there may be values of $x$ for which one side is say $-k$ and the other side is $k$, so that when squared, they appear to equal, but $-k \neq k$. So any values found later must be checked in the original equation.

Solving the cubic gives

$$ x(x - 1)(x + 1) = 0, $$

so $x = -1, 0, 1$.

Check these in $\sqrt{x^3 + x^2 - x} = x$. When $x = -1$, we get $1 = -1$, which is false. When $x = 0$, we get $0 = 0$, which is true. When $x = 1$, we get $1 = 1$, which is true.

So the final answers are wrong, and the first error appears in Step (3).
