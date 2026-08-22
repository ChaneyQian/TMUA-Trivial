---
database: TMUA
qid: 20132101206107
id: JZMaths_SetB-Mock-P1-Q7
paper: TMUA Mock
year:
number: Q7
section: Multiple Choice
difficulty: 6.5
topics: [Miscellaneous Pure, Function, Logic and Proof]
subtopics: [Inequalities, Absolute Value Functions, Graphical Arguments]
tags: [Inequalities]
status: 已入库
---

## 题目
Given $-3 < x < 3$, find the total length of the intervals in which

$$ \sqrt{(x - 2)^2} \leq x^2 - 3x. $$

$$ \mathbf{A} \quad 4 - \sqrt{3} $$
$$ \mathbf{B} \quad 3 $$
$$ \mathbf{C} \quad 5 - \sqrt{2} $$
$$ \mathbf{D} \quad \sqrt{2} + 1 $$
$$ \mathbf{E} \quad \sqrt{3} + 2 $$
$$ \mathbf{F} \quad 6 - 2\sqrt{3} $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Yes here is another example of the infamous $\sqrt{x^2} \neq x$ but is equal to $|x|$ question, by the time you are done with my mocks, this will be hard to forget!

Since $\sqrt{(x - 2)^2} = |x - 2|$, we need $|x - 2| \leq x^2 - 3x$. The two graphs are shown below.

![[Image/JZMaths_SetB-Mock-P1-Q7-fig1.png]]

From the graphs, it becomes immediately clear that we only need to find the intersection between the left arm $2-x$ and $x^2-3x$. Solving $2-x=x^2-3x$, gives $x=1\pm\sqrt{3}$, so the relevant solution is $x=1-\sqrt{3}$. Note that we don't need to find the intersection of the right arm of V with the quadratic, because that clearly that intersection occurs for $x>3$.

Therefore, using the graphs and the intersection at $x=1-\sqrt{3}$, we deduce the interval is $-3<x\leq 1-\sqrt{3}$, and its length is $(1-\sqrt{3})-(-3)=4-\sqrt{3}$.
