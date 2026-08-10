---
database: TMUA
qid: 20132101205204
id: JZMaths_SetA-Mock-P2-Q4
paper: TMUA Mock
year:
number: Q4
section: Multiple Choice
difficulty: 5.5
topics: [Logic and Proof, Number Theory]
subtopics: [Logic, Divisibility]
tags: [Logic Counterexample]
status: 已入库
---

## 题目
Consider the following statement:

If a positive integer $N$ has the property that $N^2$ is divisible by $12$, then $N$ is divisible by $12$.

Which of the following are counterexamples to this statement?

$$ \text{I} \quad N = 6 $$
$$ \text{II} \quad N = 8 $$
$$ \text{III} \quad N = 18 $$
$$ \text{IV} \quad N = 24 $$

$$ \mathbf{A} \quad \text{none of them} $$
$$ \mathbf{B} \quad \text{I only} $$
$$ \mathbf{C} \quad \text{II only} $$
$$ \mathbf{D} \quad \text{I and III only} $$
$$ \mathbf{E} \quad \text{I, II and III only} $$
$$ \mathbf{F} \quad \text{II and IV only} $$
$$ \mathbf{G} \quad \text{I, III and IV only} $$
$$ \mathbf{H} \quad \text{I, II, III and IV} $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
A counterexample to "if $P$ then $Q$" is a value for which $P$ holds but $Q$ fails. Here $P$ is "$N^2$ is divisible by $12$" and $Q$ is "$N$ is divisible by $12$".

Another useful way to think about this is that the statement is only making a claim about those $N$ with property $N^2$ is divisible by $12$.

**I:** $N = 6$. $N^2 = 36 = 12 \cdot 3$, so $P$ holds. $12 \nmid 6$, so $Q$ fails. **Counterexample.**

**II:** $N = 8$. $N^2 = 64$, and $64 = 12 \cdot 5 + 4$, so $12 \nmid 64$. Then $P$ is false, so this $N$ does not qualify: the statement does not apply to it, and it is not a counterexample.

**III:** $N = 18$. $N^2 = 324 = 12 \cdot 27$, so $P$ holds. $12 \nmid 18$, so $Q$ fails. **Counterexample.**

**IV:** $N = 24$. $N^2 = 576 = 12 \cdot 48$, so $P$ holds. But $24 = 12 \cdot 2$, so $Q$ also holds. The implication is satisfied here, so this is not a counterexample.

Only **I** and **III** are counterexamples.
