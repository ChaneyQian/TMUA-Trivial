---
database: TMUA
qid: 20132101202114
id: Zetta-Mock-P1-Q14
paper: TMUA Mock
year:
number: Q14
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The graph of $\tan(x^2 + y^2) = 1$ is shown below (angles in radians).

![[Image/Zetta-Mock-P1-Q14-fig1.png]]

The graph consists of a central circle surrounded by infinitely many **annuluses** or rings.
The central circle has area $C$ and each annulus has the same constant area $A$.
What is $\frac{A}{C}$?
[An *annulus* is the region between two concentric circles (like a ring)]

$$
\mathbf{A} \quad 4
$$

$$
\mathbf{B} \quad \frac{1}{2}
$$

$$
\mathbf{C} \quad \pi^2
$$

$$
\mathbf{D} \quad \frac{3}{4\pi}
$$

$$
\mathbf{E} \quad \frac{\pi^2 + 1}{4\pi}
$$

$$
\mathbf{F} \quad \frac{1}{\pi}
$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
![[Image/Zetta-Mock-P1-Q14-sol1.png]]

The equation $\tan(x^{2}+y^{2})=1$ holds exactly when

$$ x^{2}+y^{2} = \frac{\pi}{4}+k\pi, \qquad k = 0,1,2,\dots $$

so the picture is a family of concentric circles whose **squared** radii form an arithmetic progression with common difference $\pi$.

The central disc has radius $\sqrt{\pi/4}$, so $C = \pi\cdot\dfrac{\pi}{4} = \dfrac{\pi^{2}}{4}$.

The ring between consecutive circles has area

$$ A = \pi\left[\left(\frac{\pi}{4}+(k+1)\pi\right)-\left(\frac{\pi}{4}+k\pi\right)\right] = \pi\cdot\pi = \pi^{2} $$

independent of $k$ — which is exactly why the question can call it a constant. Hence

$$ \frac{A}{C} = \frac{\pi^{2}}{\pi^{2}/4} = 4 $$

The answer is A.
