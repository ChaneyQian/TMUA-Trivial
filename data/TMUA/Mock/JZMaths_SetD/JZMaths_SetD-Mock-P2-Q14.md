---
database: TMUA
qid: 20132101208214
id: JZMaths_SetD-Mock-P2-Q14
paper: TMUA Mock
year:
number: Q14
section: Multiple Choice
difficulty: 7.5
topics: [Calculus, Function, Sequences and Series]
subtopics: [Integration, "Floor, Ceiling and Fractional Part Functions", Integral Identity, Sequences and Series]
tags: [Integration, Logic Deduction]
status: 已入库
---

## 题目
For a real number $x$, let $\{x\}$ denote the fractional part of $x$. For example, $\{1.2\} = 0.2$ and $\{-1.5\} = 0.5$.

A sequence $(a_n)$ is defined by $a_1 = \frac{1}{2}$ and
$$ a_{n+1} = a_n \int_0^1 |4\{nx\} - 2| \, dx $$
for each positive integer $n$.

What is the value of
$$ \sum_{n=1}^\infty a_n? $$

$$ \mathbf{A} \quad 1 $$
$$ \mathbf{B} \quad 2 $$
$$ \mathbf{C} \quad 4 $$
$$ \mathbf{D} \quad 12 $$
$$ \mathbf{E} \quad \frac{9}{2} $$
$$ \mathbf{F} \quad \infty $$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
As $x$ runs from $0$ to $1$, the fractional part $\{nx\}$ repeatedly increases from $0$ to $1$, completing this pattern exactly $n$ times.

Hence the graph of $|4\{nx\} - 2|$ consists of $n$ identical V-shaped sections. Each section has width $\frac{1}{n}$ and height $2$, so its area is
$$ \frac{1}{2} \times \frac{1}{n} \times 2 = \frac{1}{n}. $$

Therefore,
$$ \int_0^1 |4\{nx\} - 2| \, dx = n \left(\frac{1}{n}\right) = 1. $$

The recurrence becomes $a_{n+1} = a_n$. Since $a_1 = \frac{1}{2}$, we have $a_n = \frac{1}{2}$ for every positive integer $n$.
Therefore the terms do not tend to $0$, so the infinite series $\sum_{n=1}^\infty a_n$ diverges to infinity.
