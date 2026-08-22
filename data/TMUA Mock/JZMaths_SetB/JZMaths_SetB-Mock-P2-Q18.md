---
database: TMUA
qid: 20132101206218
id: JZMaths_SetB-Mock-P2-Q18
paper: TMUA Mock
year:
number: Q18
section: Multiple Choice
difficulty: 8.5
topics: [Logic and Proof, Calculus]
subtopics: [Logic, Integration]
tags: [Logic-Deduction, Integration]
status: 已入库
---

## 题目
Let $f$ and $g$ be polynomials. Consider the following four statements.

I: If $f'(x)\geq g'(x)$ for all $x\geq 0$ and $f(0)\geq g(0)$, then $f(x)\geq g(x)$ for all $x\geq 0$.

II: If $f(x)\geq g(x)$ for all $x\geq 0$, then
$$ \int_0^x t f(t)\,dt \geq \int_0^x t g(t)\,dt $$
for all $x\geq 0$.

III: If
$$ \int_0^x f(t)\,dt \geq \int_0^x g(t)\,dt $$
for all $x\geq 0$, then $f(x)\geq g(x)$ for all $x\geq 0$.

IV: If
$$ \int_0^x f(t)\,dt \geq \int_0^x g(t)\,dt $$
for all $x\geq 0$, then
$$ \int_0^x t^2 f(t)\,dt \geq \int_0^x t^2 g(t)\,dt $$
for all $x\geq 0$.

Which of the statements are true?

$$ \mathbf{A} \quad \text{None of them} $$
$$ \mathbf{B} \quad \text{I only} $$
$$ \mathbf{C} \quad \text{II only} $$
$$ \mathbf{D} \quad \text{III only} $$
$$ \mathbf{E} \quad \text{IV only} $$
$$ \mathbf{F} \quad \text{I and II only} $$
$$ \mathbf{G} \quad \text{II and III only} $$
$$ \mathbf{H} \quad \text{I and III only} $$
$$ \mathbf{I} \quad \text{all except I} $$
$$ \mathbf{J} \quad \text{all except II} $$
$$ \mathbf{K} \quad \text{all except III} $$
$$ \mathbf{L} \quad \text{all except IV} $$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
Let $h(x)=f(x)-g(x)$.

I is true: the hypotheses give $h'(x)\geq 0$ and $h(0)\geq 0$, so $h(x)\geq h(0)\geq 0$ for all $x\geq 0$.

II is true: if $h(t)\geq 0$ and $0\leq t\leq x$, then $t h(t)\geq 0$, so its integral is non-negative.

For III and IV, take $g(x)=0$ and $f(x)=(x-1)(x-2)$. Then

$$ \int_0^x f(t)\,dt=\frac{x(2x^2-9x+12)}{6}\geq 0 \qquad (x\geq 0), $$

because the quadratic factor has negative discriminant and positive leading coefficient. However, $f(x)<0$ for $1<x<2$, so III is false. Also,

$$ \int_0^2 t^2 f(t)\,dt=-\frac{4}{15}<0, $$

so IV is false. Thus only I and II are true.
