---
database: TMUA
qid: 20132101205220
id: JZMaths_SetA-Mock-P2-Q20
paper: TMUA Mock
year:
number: Q20
section: Multiple Choice
difficulty: 8.5
topics: [Trigonometry, Logic and Proof]
subtopics: [Trigonometric Equations, Graphical Arguments]
tags: [General-Trigonometry, Trig-Equation-Number-of-Solutions]
status: 已入库
---

## 题目
Given that $p$ is an integer, find the minimum value of $p$ such that the equation
$$ \sqrt{\frac{1 + \sin x}{1 - \sin 2x}} = \sqrt{\frac{1 + \sin 2x}{1 - \sin x}} $$
has exactly 16 solutions in the interval $0^\circ \le x < p^\circ$.
$$ \mathbf{A} \quad 540 $$
$$ \mathbf{B} \quad 541 $$
$$ \mathbf{C} \quad 720 $$
$$ \mathbf{D} \quad 721 $$
$$ \mathbf{E} \quad 900 $$
$$ \mathbf{F} \quad 901 $$
$$ \mathbf{G} \quad 1080 $$
$$ \mathbf{H} \quad 1081 $$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
The equation is equivalent to
$$ \sqrt{1 - \sin^2 x} = \sqrt{1 - \sin^2 2x} , $$

or

$$ \sqrt{\cos^2 x} = \sqrt{\cos^2 2x} , $$

which is the same as

$$ |\cos x| = |\cos 2x| . $$

Yes yes, this is another question that I am reminding students the same old $\sqrt{x^2} \ne x$, but equals to $|x|$!

![[Image/JZMaths_SetA-Mock-P2-Q20-fig1.png]]

Now consider the graphs of $y=|\cos x|$ and $y=|\cos 2x|$. Both graphs repeat every $180^\circ$, so it is enough to count the intersections in one interval of length $180^\circ$.

On $0^\circ \leq x < 180^\circ$, the graph of $y=|\cos x|$ makes one V-shape, while $y=|\cos 2x|$ makes two V-shapes. From the graph, they intersect 3 times in each interval of the form

$$ 180m^\circ \leq x < 180(m+1)^\circ. $$

The excluded denominator cases do not remove any of these intersections, because when $\sin x=1$ or $\sin 2x=1$, the equation $|\cos x|=|\cos 2x|$ is not satisfied.

Therefore, in every $180^\circ$ block there are exactly 3 solutions. In the interval

$$ 0^\circ \leq x < 900^\circ, $$

there are 5 complete blocks, so there are

$$ 5\cdot 3=15 $$

solutions.

The next block starts at $900^\circ$, and at this point both graphs have value 1, so $x=900^\circ$ is the next solution. Since the interval is $0^\circ \leq x < p^\circ$, we need $p>900$ to include this solution.

Therefore the minimum integer value of $p$ is $901$.
