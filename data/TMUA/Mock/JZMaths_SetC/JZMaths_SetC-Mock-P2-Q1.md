---
database: TMUA
qid: 20132101207201
id: JZMaths_SetC-Mock-P2-Q1
paper: TMUA Mock
year:
number: Q1
section: Multiple Choice
difficulty: 5.5
topics: [Logic and Proof, Number Theory]
subtopics: [Logic, Divisibility]
tags: [Logic Deduction]
status: 已入库
---

## 题目
Let $n$ denote a positive integer. Consider the following three statements.

I. For every $n$, if $n^2$ is divisible by $12$, then $n$ is divisible by $6$.

II. For every $n$, if $n^2$ is divisible by $12$, then $n$ is divisible by $12$.

III. There exists an $n$ such that $n^2$ is divisible by $12$ but $n$ is not divisible by $12$.

Which of the statements are true?

$$ \mathbf{A} \quad \text{I only} $$
$$ \mathbf{B} \quad \text{II only} $$
$$ \mathbf{C} \quad \text{III only} $$
$$ \mathbf{D} \quad \text{I and II only} $$
$$ \mathbf{E} \quad \text{II and III only} $$
$$ \mathbf{F} \quad \text{I and III only} $$
$$ \mathbf{G} \quad \text{all of them} $$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
The notation: $a|n$ means $n$ is divisible by $a$.

**Statement I** If $n^2$ is divisible by $12 = 4 \times 3$, then $n^2$ is divisible by both $3$ and $4$. Since $3$ is prime, $3 \mid n^2$ forces $3 \mid n$. Also $4 \mid n^2$ forces $n$ to be even, so $2 \mid n$. Hence $n$ is divisible by both $2$ and $3$, that is by $6$, so statement I is true.

**Statement II** Take $n = 6$, so $n^2 = 36 = 12 \times 3$ is divisible by $12$, yet $6$ is not divisible by $12$. So II is false.

**Statement III** That same example makes statement III true.

So I and III hold and II fails.
