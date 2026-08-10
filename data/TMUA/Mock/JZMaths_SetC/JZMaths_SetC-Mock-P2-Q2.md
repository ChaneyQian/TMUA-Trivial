---
database: TMUA
qid: 20132101207202
id: JZMaths_SetC-Mock-P2-Q2
paper: TMUA Mock
year:
number: Q2
section: Multiple Choice
difficulty: 5.5
topics: [Logic and Proof, Miscellaneous Pure]
subtopics: [Logic, Inequalities]
tags: [Inequalities]
status: 已入库
---

## 题目
Let $x$, $y$, $z$ be real numbers with $x \geq y$. Which of the following statements **must** be true?

1. $x^3 \geq y^3$
2. $x^2 \geq y^2$
3. $xz \geq yz$
4. $xz^2 \geq yz^2$

$$ \mathbf{A} \quad \text{none of them} $$
$$ \mathbf{B} \quad \text{1 only} $$
$$ \mathbf{C} \quad \text{4 only} $$
$$ \mathbf{D} \quad \text{1 and 2 only} $$
$$ \mathbf{E} \quad \text{1 and 3 only} $$
$$ \mathbf{F} \quad \text{1 and 4 only} $$
$$ \mathbf{G} \quad \text{2 and 4 only} $$
$$ \mathbf{H} \quad \text{1, 2 and 4 only} $$
$$ \mathbf{I} \quad \text{1, 3 and 4 only} $$
$$ \mathbf{J} \quad \text{1, 2, 3 and 4} $$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
**Statement 1:** $x^3 \geq y^3$. The function $t \mapsto t^3$ is strictly increasing on all of $\mathbb{R}$, so $x \geq y \Rightarrow x^3 \geq y^3$. **True**.

**Statement 2:** $x^2 \geq y^2$. Squaring is **not** monotonic on $\mathbb{R}$. Counterexample: $x = 1$, $y = -2$. Then $x \geq y$ but $x^2 = 1 < 4 = y^2$. **False**.

**Statement 3:** $xz \geq yz$. Multiplying an inequality by $z$ preserves its direction only when $z \geq 0$. Counterexample: $x = 1$, $y = 0$, $z = -1$. Then $xz = -1 < 0 = yz$. **False**.

**Statement 4:** $xz^2 \geq yz^2$. Here the multiplier is $z^2 \geq 0$, therefore $x \geq y \Rightarrow xz^2 \geq yz^2$. **True**.

Only statements 1 and 4 must hold.
