---
database: TMUA
qid: 20132101211105
id: BeyondHorizonS1-Mock-P1-Q5
paper: TMUA Mock
year:
number: Q5
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
How many solutions does this equation have in the interval $0 \leq x \leq 2\pi$?
$$\sin(\cos(\sin(x))) = \cos(\sin(\cos(x)))$$
$$\mathbf{A} \quad 0$$
$$\mathbf{B} \quad 1$$
$$\mathbf{C} \quad 2$$
$$\mathbf{D} \quad 4$$
$$\mathbf{E} \quad 8$$
$$\mathbf{F} \quad 16$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Write $s = |\sin x|$, so that $|\cos x| = \sqrt{1-s^2}$. Because cosine is even, $\cos(\sin x) = \cos(s)$, and because $\sin$ is even about the same reflection, $\sin(\cos x)$ enters only through its absolute value too, so the whole equation depends on $x$ only through $s$. Define
$$F(s) = \sin(\cos s) - \cos\left(\sin\sqrt{1-s^2}\right)$$
As $s$ increases from $0$ to $1$, $\cos s$ decreases and stays inside $[\cos 1, 1] \subset [0, \pi/2]$, so the first term strictly decreases. At the same time $\sqrt{1-s^2}$ decreases, so $\sin\sqrt{1-s^2}$ decreases and its cosine increases; the second term therefore strictly increases. Hence $F$ is strictly decreasing on $[0,1]$. Its endpoint values are
$$F(0) = \sin 1 - \cos(\sin 1) \approx 0.841 - 0.666 > 0, \qquad F(1) = \sin(\cos 1) - 1 \approx 0.514 - 1 < 0$$
so there is exactly one $s^* \in (0,1)$ with $F(s^*) = 0$. Finally, for a value $s^*$ strictly between $0$ and $1$ the equation $|\sin x| = s^*$ has four solutions in $[0, 2\pi]$, namely two from $\sin x = s^*$ and two from $\sin x = -s^*$. The answer is D. The trap is to assume, from the familiar inequality $\sin(\cos x) < \cos(\sin x)$, that the two sides never meet and answer A.
