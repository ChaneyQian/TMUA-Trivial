---
database: TMUA
qid: 20132101205210
id: JZMaths_SetA-Mock-P2-Q10
paper: TMUA Mock
year:
number: Q10
section: Multiple Choice
difficulty: 7
topics: [Logic and Proof]
subtopics: [Logic, Graphical Arguments]
tags: [Logic-Deduction, Inequalities]
status: 已入库
---

## 题目
The region $R$ in the $(x,y)$-plane consists of all points satisfying **both**

$$ |y - x^2| < 2 \qquad \text{and} \qquad x + y < 4. $$

Which of the following claims about points in $R$ are true?

**I**: For every $(x,y) \in R$, $y \le 6$.

**II**: For every $(x,y) \in R$, $y > -2$.

**III**: For every $(x,y) \in R$, $x \le 2$.

$$ \mathbf{A} \quad \text{None of them} $$
$$ \mathbf{B} \quad \text{I only} $$
$$ \mathbf{C} \quad \text{II only} $$
$$ \mathbf{D} \quad \text{III only} $$
$$ \mathbf{E} \quad \text{I and II only} $$
$$ \mathbf{F} \quad \text{I and III only} $$
$$ \mathbf{G} \quad \text{II and III only} $$
$$ \mathbf{H} \quad \text{I, II and III} $$

## 备注

### 我的备注

### AI备注


## 答案
G

## 解析
Rewrite the defining conditions of $R$ as

$$ x^2 - 2 < y < x^2 + 2 \qquad \text{and} \qquad y < 4 - x. $$

Rewrite further as

$$ x^2 - 2 < y \qquad \text{and} \qquad y < x^2 + 2 \qquad \text{and} \qquad y < 4 - x. $$

A sketch of the region now makes it immediate that **II** is true, since the minimum of $x^2 - 2$ is $-2$. For **I** and **III**, we need to find the intersection points of $x^2 - 2$ and $4 - x$.

$$ x^2 - 2 = 4 - x \quad \Leftrightarrow \quad x = 2, -3. $$

Therefore **III** is true.

Next, when $x = -3$, $y = 7$. This point itself is not in the region, but it is on the boundary, so there are points in $R$ with $y$-coordinate between $6$ and $7$. Therefore **I** is false.
