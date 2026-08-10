---
database: TMUA
qid: 20132101205117
id: JZMaths_SetA-Mock-P1-Q17
paper: TMUA Mock
year:
number: Q17
section: Multiple Choice
difficulty: 7.5
topics: [Trigonometry, Logic and Proof]
subtopics: [Trigonometric Equations, Graphical Arguments]
tags: [General Trigonometry, Inequalities]
status: 已入库
---

## 题目
Let $0 \leq x \leq 2\pi$. Find the total length of the intervals on which $\sin(7x) \geq \cos(14x)$.
$$ \mathbf{A} \quad \frac{\pi}{12} $$
$$ \mathbf{B} \quad \frac{\pi}{6} $$
$$ \mathbf{C} \quad \frac{\pi}{3} $$
$$ \mathbf{D} \quad \frac{2\pi}{3} $$
$$ \mathbf{E} \quad \frac{5\pi}{12} $$
$$ \mathbf{F} \quad \frac{\pi}{2} $$
$$ \mathbf{G} \quad \frac{7\pi}{12} $$
$$ \mathbf{H} \quad \frac{4\pi}{3} $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
A very important point to observe about this question is that $\sin(7x)$ has 7 **full** periods in the interval $0$ to $2\pi$, while $\cos(14x)$ has 14 **full** periods in the interval. Therefore, if we only care about the **length** of the interval for which the inequality is true, it is equivalent to solve $\sin x \geq \cos 2x$.

**Hint:** If you find it hard to see why the two problems gives the same solution, try sketching graphs of $\sin x$ and $\cos 2x$ on same plot, then graphs of $\sin 2x$ and $\cos 4x$ on another plot.

So it is enough to solve $\sin x \geq \cos 2x$. Easiest way to solve it, is to **sketch** the two graphs on the same plot, you can see that they have intersection at $\pi/6$, which is easily verified too, both give value $0.5$ at $\pi/6$. The other intersection can be found by symmetry at $x = 5\pi/6$.

![[Image/JZMaths_SetA-Mock-P1-Q17-fig1.png]]

From the graph, $\sin x$ is above $\cos 2x$ between the two intersection points. Hence the required total length is

$$ \frac{5\pi}{6}-\frac{\pi}{6}=\frac{2\pi}{3}. $$
