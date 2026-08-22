---
database: TMUA
qid: 20132101212120
id: BeyondHorizonS2-Mock-P1-Q20
paper: TMUA Mock
year:
number: Q20
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Let
$$f(x) = (\tan x)^{3/2} - 3\tan x + \sqrt{\tan x}$$
Consider the three integrals
$$I_1 = \int_{0}^{1} f(x)\,dx, \qquad I_2 = \int_{0.3}^{1.3} f(x)\,dx, \qquad I_3 = \int_{0.5}^{1.5} f(x)\,dx$$
Then,
$$\mathbf{A} \quad I_1 > I_2 > I_3$$
$$\mathbf{B} \quad I_2 > I_1 > I_3$$
$$\mathbf{C} \quad I_3 > I_1 > I_2$$
$$\mathbf{D} \quad I_1 > I_3 > I_2$$
$$\mathbf{E} \quad I_2 > I_3 > I_1$$
$$\mathbf{F} \quad I_3 > I_2 > I_1$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
All three ranges lie inside $\left[0, \frac{\pi}{2}\right)$, where $\tan x \geq 0$, so the substitution $s = \sqrt{\tan x}$ is legitimate and $f = s^3 - 3s^2 + s = s\left(s^2 - 3s + 1\right)$. The bracket vanishes at $s = \frac{3 \pm \sqrt{5}}{2}$, i.e. at $s \approx 0.382$ and $s \approx 2.618$, so $f > 0$ for $0 < s < 0.382$, $f < 0$ for $0.382 < s < 2.618$ and $f > 0$ again beyond that. Translating back through $\tan x = s^2$, the sign pattern in $x$ is positive on $(0, 0.145)$, negative on $(0.145, 1.426)$ and positive on $\left(1.426, \frac{\pi}{2}\right)$, where the final positive stretch is steep because $\tan x$ blows up there.

Compare the integrals through their differences. Since $I_2 - I_1 = \int_{1}^{1.3} f - \int_{0}^{0.3} f$, and $[1, 1.3]$ sits deep in the negative region while $[0, 0.3]$ straddles the small positive bump and contributes almost nothing, $I_2 < I_1$. Likewise $I_3 - I_2 = \int_{1.3}^{1.5} f - \int_{0.3}^{0.5} f$, in which the first piece is positive on balance because the steep positive tail past $1.426$ outweighs the negative part before it, while the second piece is negative; hence $I_3 > I_2$. Finally $I_3 - I_1 = \int_{1}^{1.5} f - \int_{0}^{0.5} f$, where the first piece is strongly negative and the second only slightly so, giving $I_3 < I_1$. Numerical evaluation confirms this, with $I_1 \approx -0.550$, $I_2 \approx -1.097$ and $I_3 \approx -0.880$, so $I_1 > I_3 > I_2$. The answer is D. The trap is to assume $f$ is positive and conclude that the interval reaching the largest values of $\tan x$ must give the largest integral, which reverses the true order.
