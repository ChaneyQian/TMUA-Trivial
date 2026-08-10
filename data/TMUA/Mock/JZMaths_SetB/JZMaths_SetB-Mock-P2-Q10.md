---
database: TMUA
qid: 20132101206210
id: JZMaths_SetB-Mock-P2-Q10
paper: TMUA Mock
year:
number: Q10
section: Multiple Choice
difficulty: 7
topics: [Logic and Proof, Trigonometry]
subtopics: [Logic, Trigonometric Equations]
tags: [General Trigonometry, Logic Sufficiency]
status: 已入库
---

## 题目
The equation

$$ \sin x (1 - \cos^2 x) = k \sin x $$

has exactly $n$ distinct solutions in $[0, 2\pi]$, where $k$ is a real constant.

Which of the following statements are true?

I $\quad 0 < k < 1$ **if** $n = 7$.

II $\quad n = 3$ **only if** $k < 0$ or $k > 1$.

III $\quad n = 5$ and $k \neq 1$ cannot both be true.

$$ \mathbf{A} \quad \text{Statement I is the only true statement.} $$
$$ \mathbf{B} \quad \text{Statement II is the only true statement.} $$
$$ \mathbf{C} \quad \text{Statement III is the only true statement.} $$
$$ \mathbf{D} \quad \text{Statements I and III are the only true statements.} $$
$$ \mathbf{E} \quad \text{Statements I and II are the only true statements.} $$
$$ \mathbf{F} \quad \text{Statements II and III are the only true statements.} $$
$$ \mathbf{G} \quad \text{All three statements are true.} $$
$$ \mathbf{H} \quad \text{None of them are true.} $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
The equation can be transformed to $\sin x(\sin^2 x - k) = 0$, and be careful not to incorrectly divide out by $\sin x$.

Hence either $\sin x = 0$ or $\sin^2 x = k$. On $[0, 2\pi]$, $\sin x = 0$ gives $x = 0, \pi, 2\pi$, so this always gives $3$ solutions. Now a good way to continue is to systematically consider cases of $k$ that lead to different number of solutions.

Now consider $\sin^2 x = k$.

If $k<0$, there are no solutions from $\sin^2x=k$, so $n=3$.

If $k=0$, the equation $\sin^2x=0$ gives the same three solutions already counted, so $n=3$.

If $0<k<1$, the equation $\sin^2x=k$ gives 4 additional solutions, so $n=7$.

If $k=1$, the equation $\sin^2x=1$ gives $x=\frac{\pi}{2},\frac{3\pi}{2}$, so $n=5$.

If $k>1$, there are no solutions from $\sin^2x=k$, so $n=3$.

Therefore:
$$
n=7\Leftrightarrow 0<k<1,
$$
$$
n=5\Leftrightarrow k=1,
$$
$$
n=3\Leftrightarrow k\leq 0\text{ or }k>1.
$$

Statement I is true.

Statement II is false, since $k=0$ also gives $n=3$, thus $k<0$ or $k>1$ is not wholly necessary.

Statement III is true, since $n=5$ forces $k=1$, so $n=5$ and $k\neq 1$ cannot both be true. This uses the fact that $P\Rightarrow Q$ is equivalent to saying that $P$ and not $Q$ cannot both be true.

So statements I and III are true.
