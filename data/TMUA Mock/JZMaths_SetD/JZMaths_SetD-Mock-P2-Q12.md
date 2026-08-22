---
database: TMUA
qid: 20132101208212
id: JZMaths_SetD-Mock-P2-Q12
paper: TMUA Mock
year:
number: Q12
section: Multiple Choice
difficulty: 7
topics: [Function, Miscellaneous Pure]
subtopics: [Iterated Functions, Combinatorics]
tags: [Logic-Deduction, Inequalities]
status: 已入库
---

## 题目
Let $f$ be a function with domain $\{1, 2, 3, 4\}$ and range contained in $\{1, 2, 3, 4\}$. For how many such functions is
$$ f(f(x)) = x $$
for every $x$ in the domain of $f$?

$$ \mathbf{A} \quad 1 $$
$$ \mathbf{B} \quad 4 $$
$$ \mathbf{C} \quad 7 $$
$$ \mathbf{D} \quad 9 $$
$$ \mathbf{E} \quad 10 $$
$$ \mathbf{F} \quad 15 $$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
First, let's show that the range must be $\{1, 2, 3, 4\}$. Suppose not, and that some $a \in \{1, 2, 3, 4\}$ is not in the range of $f$. Taking $x = a$ in $f(f(x)) = x$ gives $f(f(a)) = a$. Since $f(a)$ is an element of the domain, $f(f(a))$ is an output of $f$. Thus $a$ is in the range of $f$, a contradiction. Hence the range must be exactly $\{1, 2, 3, 4\}$.

Also, each element must either map to itself, or be interchanged with one other element. For example, if $f(1) = 2$, then $f(f(1)) = 1$ gives $f(2) = 1$.

There are three cases.

Case 1: all four elements map to themselves, there is $1$ function.

Case 2: exactly one pair is interchanged, there are $\binom{4}{2} = 6$ choices for that pair.

Case 3: two pairs are interchanged, choose the element paired with the number $1$, there are clearly $3$ ways, after which the remaining two elements must be paired.

Therefore the total number of functions is $1 + 6 + 3 = 10$.
