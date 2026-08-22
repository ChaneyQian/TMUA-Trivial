---
database: TMUA
qid: 20132101207111
id: JZMaths_SetC-Mock-P1-Q11
paper: TMUA Mock
year:
number: Q11
section: Multiple Choice
difficulty: 7
topics: [Trigonometry]
subtopics: [Trigonometric Equations]
tags: [General-Trigonometry, Sequences-and-Series]
status: 已入库
---

## 题目
Find the sum of all distinct solutions to

$$ \sin(5x + 90^\circ) = \cos 4x $$

for $0 \le x \le 360^\circ$, where $x$ is measured in degrees.

$$ \mathbf{A} \quad 900 $$
$$ \mathbf{B} \quad 1800 $$
$$ \mathbf{C} \quad 1440 $$
$$ \mathbf{D} \quad 1080 $$
$$ \mathbf{E} \quad 2160 $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Using $\sin X = \cos(90^\circ - X)$, this is an identity from GCSE maths! We get

$$ \sin(5x + 90^\circ) = \cos(90^\circ - (5x + 90^\circ)). $$

So

$$ \cos(-5x) = \cos 4x. $$

Since $\cos(-5x) = \cos 5x$, the equation becomes

$$ \cos 5x = \cos 4x. $$

This is an equation not so different to say $\cos 5x = 0.5$. Therefore either

$$ 5x = 4x + 360^\circ n $$

or

$$ 5x = -4x + 360^\circ n. $$

From the first equation,

$$ x = 360^\circ n. $$

For $0 \le x \le 360^\circ$, this gives $x = 0^\circ$ and $x = 360^\circ$.

From the second equation,

$$ 9x = 360^\circ n, $$

so

$$ x = 40^\circ n. $$

For $0 \le x \le 360^\circ$, this gives

$$ x = 0^\circ, 40^\circ, 80^\circ, \dots, 360^\circ. $$

This already includes the solutions from the first equation.

These solutions form an arithmetic sequence with first term $0^\circ$, last term $360^\circ$, and 10 terms. Hence their sum is

$$ \frac{10}{2}(0^\circ + 360^\circ) = 1800^\circ. $$
