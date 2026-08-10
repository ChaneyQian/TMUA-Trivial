---
database: TMUA
qid: 20132101206202
id: JZMaths_SetB-Mock-P2-Q2
paper: TMUA Mock
year:
number: Q2
section: Multiple Choice
difficulty: 5.5
topics: [Logic and Proof, Algebra (Basic)]
subtopics: [Logic, Algebra Manipulation]
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
**源书勘误（2026-08-09 修正，已核对原卷）**：原卷 `jz_mock_b_p2_solution.pdf` 第 5 页印答案 **C**，并写「Step (2) is also valid」。实际 Step (2) 把 $-2$ 移入了根号内（$\sqrt{A} - 2 \neq \sqrt{A-2}$），这才是第一处错误，故答案应为 **B**。原卷其后对 $x = 0, 1$ 的检验用的是 Step (2) 产生的错误方程 $\sqrt{x^3+x^2-x} = x$；代回**原**方程可见 $x = 0$ 给出 $\frac{\sqrt{2}}{2} \neq 1$、$x = 1$ 给出 $\frac{\sqrt{3}}{3} \neq 1$，两者都不是解。原方程真解为 $x = 1 \pm \sqrt{2}$。本库已按正确数学修改答案与解析，与原卷不同。

## 答案
B

## 解析
The original equation has denominator $x + 2$, so $x \neq -2$. Therefore multiplying both sides by $x + 2$ in Step (1) is valid, giving

$$ \sqrt{x^3 + x^2 - x + 2} = x + 2. $$

**Step (2) is where the first error occurs.** Subtracting 2 from both sides gives

$$ \sqrt{x^3 + x^2 - x + 2} - 2 = x, $$

and the 2 cannot be moved inside the square root: in general $\sqrt{A} - 2 \neq \sqrt{A - 2}$. The step as written therefore replaces the equation by a different one, and everything after it solves the wrong equation.

Solving correctly from Step (1): squaring both sides gives

$$ x^3 + x^2 - x + 2 = (x + 2)^2 = x^2 + 4x + 4, $$

so

$$ x^3 - 5x - 2 = 0. $$

Since $x = -2$ is a root of this cubic, it factorises as

$$ (x + 2)(x^2 - 2x - 1) = 0. $$

The root $x = -2$ is excluded by the denominator, so $x = 1 \pm \sqrt{2}$. Both satisfy $x + 2 > 0$, and substituting back confirms both are genuine solutions of the original equation.

The student's answers $x = -1, 0, 1$ are therefore all wrong — for instance $x = 0$ gives $\frac{\sqrt{2}}{2} \neq 1$ — and the first error appears in Step (2).
