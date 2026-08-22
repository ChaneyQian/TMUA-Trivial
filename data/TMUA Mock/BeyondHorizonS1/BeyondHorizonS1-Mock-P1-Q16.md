---
database: TMUA
qid: 20132101211116
id: BeyondHorizonS1-Mock-P1-Q16
paper: TMUA Mock
year:
number: Q16
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The inequality $\sqrt{x+6} \geq x$ is satisfied for real $x$ if and only if
$$\mathbf{A} \quad -3 \leq x \leq 3$$
$$\mathbf{B} \quad -2 \leq x \leq 3$$
$$\mathbf{C} \quad -6 \leq x \leq 3$$
$$\mathbf{D} \quad 0 \leq x \leq 6$$
$$\mathbf{E} \quad -6 < x < 6$$
$$\mathbf{F} \quad 0 < x < 3$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
For the square root to be real we need $x \geq -6$. On the part of that range where $x < 0$ the left-hand side is non-negative while the right-hand side is negative, so the inequality holds automatically and every $x$ in $[-6, 0)$ is a solution. For $x \geq 0$ both sides are non-negative, so squaring is reversible:
$$x + 6 \geq x^2 \iff x^2 - x - 6 \leq 0 \iff (x-3)(x+2) \leq 0$$
which gives $-2 \leq x \leq 3$, and intersecting with $x \geq 0$ leaves $0 \leq x \leq 3$. Putting the two pieces together, the solution set is $-6 \leq x \leq 3$. The answer is C. Option B is the trap for anyone who squares immediately and keeps only the roots of the quadratic, forgetting that the domain reaches down to $-6$.
