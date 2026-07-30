---
database: TMUA
qid: 20132101208208
id: JZMaths_SetD-Mock-P2-Q8
paper: TMUA Mock
year:
number: Q8
section: Multiple Choice
difficulty: 7
topics: []
subtopics: []
tags: [Logic Deduction, Logic Sufficiency]
status: 已入库
---

## 题目
A TMUA question asks candidates to identify which one of the conditions below is a **sufficient but not necessary** condition for some statement $P$, concerning a real number $x$, to hold.

Friedrich Gauss, sitting the exam, noticed to his delight that the examiner has designed the question poorly, and the correct option can be deduced without knowing or examining $P$ in the slightest!

Which is the correct option?
$$ \mathbf{A} \quad |x - 2| < 2 $$
$$ \mathbf{B} \quad x^2 - 5x + 6 < 0 $$
$$ \mathbf{C} \quad \log(x - 2) \text{ is defined} $$
$$ \mathbf{D} \quad |x - 2| < 1 $$
$$ \mathbf{E} \quad x \text{ can be any real number} $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Let a condition be called correct if it is sufficient but not necessary for $P$.

Suppose condition $Q$ is correct, and condition $R$ implies $Q$. Then

$$ R \implies Q \implies P, $$

so $R$ is also sufficient for $P$.

Also, since $Q$ is not necessary for $P$, there is some value of $x$ for which $P$ is true but $Q$ is false. Since $R \implies Q$, this same value also makes $R$ false. Hence $R$ is also not necessary for $P$.

Therefore, if one option is implied by another option, the weaker option cannot be the **unique** correct answer.

Now rewrite the options:
$$ |x - 2| < 2 \iff 0 < x < 4, $$
$$ x^2 - 5x + 6 < 0 \iff (x - 2)(x - 3) < 0 \iff 2 < x < 3, $$
$$ \log(x - 2) \text{ is defined} \iff x > 2, $$
$$ |x - 2| < 1 \iff 1 < x < 3. $$

The condition $2 < x < 3$ implies each of the following:

$$ 0 < x < 4, \qquad x > 2, \qquad 1 < x < 3, \qquad x \in \mathbb{R}. $$

So if any of those four conditions were correct, then $2 < x < 3$ would also be correct. That would give more than one correct option, which is impossible.

Hence all the other options are eliminated, and the only possible correct option is $\mathbf{B}$.
