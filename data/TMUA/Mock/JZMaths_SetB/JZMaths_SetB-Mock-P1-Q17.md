---
database: TMUA
qid: 20132101206117
id: JZMaths_SetB-Mock-P1-Q17
paper: TMUA Mock
year:
number: Q17
section: Multiple Choice
difficulty: 8
topics: [Calculus]
subtopics: [Integration, Integral Identity]
tags: [Integration, Transformation-of-Graphs]
status: 已入库
---

## 题目
Evaluate
$$ \int_{0}^{\pi/2} \frac{1}{1 + \tan x} dx. $$

You may find the identity
$$ \tan \left( \frac{\pi}{2} - x \right) = \frac{1}{\tan x} $$
useful.

$$ \mathbf{A} \quad \frac{\pi}{2} $$
$$ \mathbf{B} \quad \frac{\pi}{4} $$
$$ \mathbf{C} \quad \frac{\pi}{2\sqrt{2}} $$
$$ \mathbf{D} \quad \frac{\pi}{4\sqrt{2}} $$
$$ \mathbf{E} \quad \frac{\pi}{3} $$
$$ \mathbf{F} \quad \frac{\pi}{6} $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Let

$$ I = \int_{0}^{\pi/2} \frac{1}{1 + \tan x} dx. $$

In order to use the given identity, we need to introduce $\tan(\pi/2 - x)$. The best way to achieve this is through a reflection along $x = \pi/4$. See my remark at the end for more details on this. This changes $x$ into $\frac{\pi}{2} - x$, but leaves the interval $0 \le x \le \frac{\pi}{2}$ unchanged. Hence

$$ I = \int_{0}^{\pi/2} \frac{1}{1 + \tan \left( \frac{\pi}{2} - x \right)} dx. $$

Now using the identity

$$ \tan \left( \frac{\pi}{2} - x \right) = \frac{1}{\tan x}, $$

we get
$$
I=\int_0^{\pi/2}\frac{1}{1+\frac{1}{\tan x}}\,dx.
$$
So
$$
I=\int_0^{\pi/2}\frac{\tan x}{1+\tan x}\,dx.
$$
Adding this to the original expression for $I$ gives
$$
2I=\int_0^{\pi/2}1\,dx=\frac{\pi}{2}.
$$
Therefore
$$
I=\frac{\pi}{4}.
$$

**Remark:** The solution leans heavily on the fact that in general
$$
\int_a^b f(x)\,dx=\int_a^b f(a+b-x)\,dx.
$$
This can be understood as a reflection in the vertical line $x=\frac{a+b}{2}$, this is the midpoint of the interval $a$ to $b$. Under this reflection, a point with coordinate $x$ is sent to $a+b-x$. The interval $a\leq x\leq b$ is unchanged by this reflection, so the total area under the graph is unchanged. Hence replacing $f(x)$ by $f(a+b-x)$ gives the same integral.
