---
database: TMUA
qid: 20132101212216
id: BeyondHorizonS2-Mock-P2-Q16
paper: TMUA Mock
year:
number: Q16
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The function $f(x)$ is defined as follows:
$$f(z) = a_0 + a_1 x + a_n x^n, \quad a_i \in Z$$
Which of the following is true?
$$\mathbf{A} \quad \text{There exists some odd } n \text{ such that there exists some } a_0, a_1, \ldots, a_n \text{ such that } f(\sqrt{2} + \sqrt{3}) = 0$$
$$\mathbf{B} \quad \text{If } f(\sqrt{2} + \sqrt{3}) = 0 \text{, then } f(\sqrt{2} - \sqrt{3}) = 0$$
$$\mathbf{C} \quad \text{For every even } n \text{, there exists some } a_0, a_1, \ldots, a_n \text{ such that } f(\sqrt{2} + \sqrt{3}) = 0$$
$$\mathbf{D} \quad \text{For every odd } n \text{, there exists some } a_0, a_1, \ldots, a_n \text{ such that } f(\sqrt{2} + \sqrt{5}) = 0$$
TODO(待校对): 原卷题干把函数名写成 $f(z)$（应为 $f(x)$），且多项式只印出 $a_0 + a_1x + a_nx^n$ 三项、中间项的省略号缺失。此处按原卷原样转写。

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Let $\theta = \sqrt{2} + \sqrt{3}$. Then $\theta^2 = 5 + 2\sqrt{6}$, so $(\theta^2 - 5)^2 = 24$ and $\theta$ is a root of the integer polynomial
$$p(x) = x^4 - 10x^2 + 1,$$
which is irreducible over the rationals and is therefore the minimal polynomial of $\theta$. Its four roots are $\pm\sqrt{2} \pm \sqrt{3}$, and in particular $\sqrt{2} - \sqrt{3}$ is one of them. Now if any polynomial $f$ with integer coefficients satisfies $f(\theta) = 0$, then $p$ divides $f$ over the rationals, so every root of $p$ is also a root of $f$; in particular $f(\sqrt{2} - \sqrt{3}) = 0$. This makes B true, and the argument works whether the printed definition is read literally as a three-term expression or as an abbreviation for a general integer polynomial. Option D fails already at $n = 1$, since no linear polynomial with integer coefficients can have the irrational root $\sqrt{2} + \sqrt{5}$, and option C fails at $n = 2$, since the minimal polynomial of $\theta$ has degree $4$ and no non-zero quadratic can vanish at $\theta$. Option A fails under the printed three-term reading, because for odd $n$ the power $\theta^n$ lies in the span of $\sqrt{2}$ and $\sqrt{3}$, for instance $\theta^3 = 11\sqrt{2} + 9\sqrt{3}$ and $\theta^5 = 109\sqrt{2} + 89\sqrt{3}$, so an equation $a_0 + a_1\theta + a_n\theta^n = 0$ forces $a_0 = 0$ together with $a_1 + 11a_n = 0$ and $a_1 + 9a_n = 0$, whose only solution is the trivial one. The answer is B.
