---
database: TMUA
qid: 20132101206114
id: JZMaths_SetB-Mock-P1-Q14
paper: TMUA Mock
year:
number: Q14
section: Multiple Choice
difficulty: 7.5
topics: [Trigonometry, Logic and Proof]
subtopics: [Trigonometric Equations, Trigonometry, Graphical Arguments]
tags: [General Trigonometry, Trig Equation Number of Solutions]
status: 已入库
---

## 题目
How many solutions does the equation
$$ \sqrt{1 - \cos^2(2x)} = \left( x - \frac{3\pi}{4} \right) \cos(2x) $$
have for $x$ in the interval $0 < x < \pi$?
$$ \mathbf{A} \quad 0 $$
$$ \mathbf{B} \quad 1 $$
$$ \mathbf{C} \quad 2 $$
$$ \mathbf{D} \quad 3 $$
$$ \mathbf{E} \quad 4 $$
$$ \mathbf{F} \quad 5 $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Since $\sqrt{1 - \cos^2(2x)} = |\sin(2x)|$, the equation becomes
$$ |\sin(2x)| = \left( x - \frac{3\pi}{4} \right) \cos(2x). $$
Values of $x$ for which $\sin 2x$ and $\cos 2x$ equal to zero do not coincide at all. Therefore we can ignore any $x$ which make $\cos 2x$ zero, and hence we can divide by $\cos 2x$. Another way to say this is that values of $x$ for which $\cos 2x$ is zero can be checked and verified as not solutions to the equation, so we can immediately exclude them first, then $\cos 2x$ is now non-zero. Therefore we may divide by $\cos(2x)$, giving
$$ \frac{|\sin(2x)|}{\cos(2x)} = x - \frac{3\pi}{4}. $$
For $0 < x < \frac{\pi}{2}$, we have $\sin(2x) > 0$, so
$$ \frac{|\sin(2x)|}{\cos(2x)} = \tan(2x). $$

For $\frac{\pi}{2}<x<\pi$, we have $\sin(2x)<0$, so
$$
\frac{|\sin(2x)|}{\cos(2x)}=-\tan(2x).
$$

Now sketch
$$
y=\frac{|\sin(2x)|}{\cos(2x)}
$$
as a piecewise function: $\tan 2x$ between $0$ to $\pi/2$, and $-\tan 2x$ between $\pi/2$ to $\pi$.

Then sketch
$$
y=x-\frac{3\pi}{4}
$$
on the same axes.

![[Image/JZMaths_SetB-Mock-P1-Q14-fig1.png]]

It becomes immediately clear there are 3 intersection points, and so 3 solutions.
