---
database: TMUA
qid: 20132101212114
id: BeyondHorizonS2-Mock-P1-Q14
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
The equation in $x$
$$8x^4 - 16x^3 + 8x^2 + k = 0$$
has four real solutions:
$$\mathbf{A} \quad \text{when } -30 < k < 4$$
$$\mathbf{B} \quad \text{when } 4 < k < 30$$
$$\mathbf{C} \quad \text{when } -2.5 < k < 0$$
$$\mathbf{D} \quad \text{when } 0 < k < 2.5$$
$$\mathbf{E} \quad \text{when } 0 < k < 0.5$$
$$\mathbf{F} \quad \text{when } -0.5 < k < 0$$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
The quartic part factorises as $8x^4 - 16x^3 + 8x^2 = 8x^2(x^2 - 2x + 1) = 8\big[x(x - 1)\big]^2$, so the equation reads $8u^2 = -k$ with $u = x^2 - x$. Real solutions need $-k \geq 0$, and then $u = \pm\sqrt{-k/8}$. Each value of $u$ feeds back into $x^2 - x - u = 0$, whose discriminant is $1 + 4u$. For $u = +\sqrt{-k/8} \geq 0$ that discriminant is positive and two real roots appear. For $u = -\sqrt{-k/8}$ the discriminant $1 - 4\sqrt{-k/8}$ is positive only when $\sqrt{-k/8} < \frac{1}{4}$, i.e. $-k < \frac{1}{2}$. Combining the two branches, four real solutions require $0 < -k < \frac{1}{2}$, that is
$$-0.5 < k < 0.$$
The endpoint $k = 0$ must be excluded, since there the equation is $8x^2(x - 1)^2 = 0$ with only the two distinct roots $x = 0$ and $x = 1$. A numerical check confirms four real roots at $k = -0.4$ and only two at $k = -0.5$ or $k = -0.6$. The answer is F. Option E is the same interval with the sign of $k$ reversed, where there are no real roots at all.
