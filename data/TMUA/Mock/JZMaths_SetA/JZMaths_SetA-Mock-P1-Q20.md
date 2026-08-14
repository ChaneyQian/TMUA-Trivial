---
database: TMUA
qid: 20132101205120
id: JZMaths_SetA-Mock-P1-Q20
paper: TMUA Mock
year:
number: Q20
section: Multiple Choice
difficulty: 8
topics: [Sequences and Series, Algebra (Basic)]
subtopics: [Recurrence Relations, AP GP, Algebra Manipulation]
tags: [Sequences-and-Series, General-Algebra]
status: 已入库
---

## 题目
A sequence of real numbers $(a_n)$ is defined by $a_1 = 2$ and the recurrence

$$ a_{n+1}(a_n - 1) = \frac{1}{2}a_n^2 - a_n + \frac{1}{2} \qquad (n \geq 1). $$

Find the value of

$$ \sum_{n=1}^\infty (a_n + 1). $$

$$ \mathbf{A} \quad 0 $$
$$ \mathbf{B} \quad 4 $$
$$ \mathbf{C} \quad \frac{5}{2} $$
$$ \mathbf{D} \quad 6 $$
$$ \mathbf{E} \quad 8 $$
$$ \mathbf{F} \quad \frac{9}{4} $$
$$ \mathbf{G} \quad \frac{5}{4} $$
$$ \mathbf{H} \quad \infty $$
$$ \mathbf{I} \quad -\infty $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
It's looking rather complicated...However, here is the first clue, The sum is to infinity! There is a most likely candidate in this case: **convergent geometric sequence**, that is if the answer is finite, $(a_n + 1)$ could be a convergent geometric sequence. Keep this in mind while we simplify the recurrence relation, which obviously is a good starting point.

First, we notice the right-hand side is a square, and factorise it:

$$ a_{n+1}(a_n - 1) = \frac{1}{2}a_n^2 - a_n + \frac{1}{2} = \frac{1}{2}(a_n - 1)^2. $$

Dividing by $a_n-1$ (and verifying afterwards that it is never zero) gives

$$ a_{n+1}=\frac12(a_n-1). $$

Adding $1$ to both sides,

$$ a_{n+1}+1=\frac12(a_n-1)+1=\frac12(a_n+1). $$

Thus $(a_n+1)$ is geometric with common ratio $\frac12$ and first term $a_1+1=3$. In particular,

$$ a_n+1=3\left(\frac12\right)^{n-1}, $$

which also confirms that $a_n-1$ is never zero for a positive integer $n$, so the earlier division is valid.

Finally,

$$ \sum_{n=1}^{\infty}(a_n+1)=\frac{3}{1-\frac12}=6. $$
