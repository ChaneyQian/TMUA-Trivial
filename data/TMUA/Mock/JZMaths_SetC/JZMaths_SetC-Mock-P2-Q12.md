---
database: TMUA
qid: 20132101207212
id: JZMaths_SetC-Mock-P2-Q12
paper: TMUA Mock
year:
number: Q12
section: Multiple Choice
difficulty: 7
topics: [Logic and Proof, Function]
subtopics: [Proof, Functional Equations]
tags: [Logic-Counterexample, Graphs-of-Functions]
status: 已入库
---

## 题目
A student makes the following **claim**:

If $f$ is a real-valued function such that, for some constant $a$, $\frac{f(x) + f(-x)}{2} = a$ for all real values of $x$, then there exists a constant $k$ such that $f(x) = kx + a$ for all real values of $x$.

Examine their **claim** above, and determine which of the following is true?

$$ \mathbf{A} \quad \text{The \textbf{claim} is true.} $$
$$ \mathbf{B} \quad f(x) = 2x + 1 \text{ is a counterexample to the claim.} $$
$$ \mathbf{C} \quad f(x) = \sin x \text{ is a counterexample to the claim.} $$
$$ \mathbf{D} \quad f(x) = \tan x \text{ is a counterexample to the claim.} $$
$$ \mathbf{E} \quad f(x) = \cos x \text{ is a counterexample to the claim.} $$
$$ \mathbf{F} \quad f(x) = -x \text{ is a counterexample to the claim.} $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
A counterexample must satisfy the assumption of the if, but fail the then conclusion.

For (C), if $f(x) = \sin x$, then

$$ \frac{f(x) + f(-x)}{2} = \frac{\sin x + \sin(-x)}{2} = 0. $$

So the assumption is true with $a = 0$. However, $\sin x$ is cleary not of the form $kx + 0$, so (C) is a counterexample, and this statement is correct, so it is the answer.

For completeness, let's check the rest.

For (B), if $f(x) = 2x + 1$, then

$$ \frac{f(x) + f(-x)}{2} = \frac{(2x + 1) + (-2x + 1)}{2} = 1. $$

So the assumption is true with $a = 1$. However, $f(x) = 2x + 1$ is of the form $kx + a$, with $k = 2$ and $a = 1$. So (B) is not a counterexample.
