---
database: TMUA
qid: 20132101205211
id: JZMaths_SetA-Mock-P2-Q11
paper: TMUA Mock
year:
number: Q11
section: Multiple Choice
difficulty: 7
topics: [Logic and Proof, Calculus]
subtopics: [Logic, Graphical Arguments, Integration, Integral Identity]
tags: [Integration, Logic Equivalence]
status: 已入库
---

## 题目
$P$: $k$ is an integer multiple of $\pi$.

$Q$: $\int_0^k \left(\cos x + \cos^3(2x)\right) \, dx = 0$.

Which of the following best describes the logical relationship between $P$ and $Q$?

$$ \mathbf{A} \quad P \text{ is necessary and sufficient for } Q. $$
$$ \mathbf{B} \quad P \text{ is necessary but not sufficient for } Q. $$
$$ \mathbf{C} \quad P \text{ is sufficient but not necessary for } Q. $$
$$ \mathbf{D} \quad P \text{ is neither necessary nor sufficient for } Q. $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Consider the graph of $\cos x$, we can deduce from the graph that $\int_0^k \cos x dx = 0$ if and only if $k$ is a multiple of $\pi$.

Consider the graph of $\cos 2x$, we can deduce from the graph that $\int_0^k \cos(2x)dx = 0$ if and only if $k$ is a multiple of $\frac{\pi}{2}$, and therefore $\int_0^k \cos^3(2x)dx = 0$ also if and only if $k$ is a multiple of $\frac{\pi}{2}$.

Together, it is clear that $P$ is sufficient for $Q$.

![[Image/JZMaths_SetA-Mock-P2-Q11-fig1.png]]

Now, let's consider if it is possible for $Q$ to be true while $k$ is not a multiple of $\pi$. The answer is no:

Because we can observe from the graphs that $\int_0^\pi \left(\cos x + \cos^3(2x)\right) \, dx = \int_\pi^{2\pi} \left(\cos x + \cos^3(2x)\right) \, dx = 0$, and likewise we can see that every integral of inteval length $\pi$, starting at a multiple of $\pi$ is $0$.
This, together with observing the graph, it becomes clear that $P$ is also necessary for $Q$.
