---
database: TMUA
qid: 90020270500
id: SMT-Ch9-Q5
paper: SMT Skills Ch9
year:
number: Q5
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
style: TMUA
solution_source: 书后解答
status: 已入库
---

## 题目
$ABCD$ is a trapezium with side $AB$ parallel to side $CD$. The lengths of sides $AD$ and $BC$ are both $6$ units. The diagonal $AC$ is of length $8$ units and makes an angle of $\alpha$ with both of sides $AB$ and $CD$ as shown in the diagram.

![[Image/SMT-Ch9-Q5-fig1.png]]

Given that the area of triangle $ACD$ is five times the area of triangle $ABC$, find the value of $\cos\alpha$.

$$\mathbf{A} \quad \sqrt{\frac{14}{3}}$$

$$\mathbf{B} \quad \frac{3}{4}$$

$$\mathbf{C} \quad \frac{3\sqrt{35}}{20}$$

$$\mathbf{D} \quad \frac{\sqrt{42}}{7}$$

$$\mathbf{E} \quad \frac{7\sqrt{42}}{48}$$

$$\mathbf{F} \quad \frac{\sqrt{28}}{6}$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 9 章 Trigonometry 章末 TMUA style 第 5 题；解析为书后官方 worked solution。

## 答案
C

## 解析
Because $AB$ is parallel to $CD$ and $AC$ is a transversal, the angles $BAC$ and $ACD$ are alternate angles and automatically equal — that is the single angle $\alpha$ marked at both ends of the diagonal.

Both triangles have $AC = 8$ as one side of the angle $\alpha$, so

$$[ABC] = \frac{1}{2} \times AB \times 8 \times \sin\alpha, \qquad [ACD] = \frac{1}{2} \times CD \times 8 \times \sin\alpha,$$

and the condition $[ACD] = 5[ABC]$ says simply $CD = 5\,AB$. Write $AB = b$, so $CD = 5b$.

Now apply the cosine rule twice. In triangle $ABC$, the angle $\alpha$ at $A$ is between sides $b$ and $8$, opposite $BC = 6$; in triangle $ACD$, the angle $\alpha$ at $C$ is between sides $5b$ and $8$, opposite $AD = 6$:

$$\begin{aligned}
36 &= b^2 + 64 - 16 b\cos\alpha \
36 &= (5b)^2 + 64 - 16(5b)\cos\alpha.
\end{aligned}$$

Both statements say that the number in question is a root of the same quadratic,

$$z^2 - (16\cos\alpha)\,z + 28 = 0,$$

once with $z = b$ and once with $z = 5b$. Since $b \neq 5b$, these are its two distinct roots, so by the sum and product of roots

$$b \times 5b = 28, \qquad b + 5b = 16\cos\alpha.$$

The first gives $b^2 = \frac{28}{5}$, so $b = \sqrt{\frac{28}{5}} = \frac{2\sqrt{7}}{\sqrt{5}}$, and the second then gives

$$\cos\alpha = \frac{6b}{16} = \frac{3b}{8} = \frac{3}{8} \times \frac{2\sqrt{7}}{\sqrt{5}} = \frac{3\sqrt{7}}{4\sqrt{5}} = \frac{3\sqrt{35}}{20}.$$

![[Image/SMT-Ch9-Q5-sol1.png]]

The trapezium above is drawn to scale from these values: $b = \sqrt{\frac{28}{5}} \approx 2.366$, $CD \approx 11.83$ and $\alpha \approx 27.45^\circ$. It really does have $AD = BC = 6$, $AC = 8$, $AB \parallel CD$ and $[ACD] = 5[ABC]$.

The correct answer is (C).

Option A, $\sqrt{\frac{14}{3}} \approx 2.16$, can be discarded on sight: a cosine cannot exceed $1$.

> ⚠️ **与书末 Answers 附录不一致** —— 附录给 D（$\frac{\sqrt{42}}{7} \approx 0.926$），本解得 C（$\frac{3\sqrt{35}}{20} \approx 0.887$）。
> 裁决计算：取 $\alpha = \arccos\frac{3\sqrt{35}}{20}$、$A = (0,0)$、$C = (8,0)$、$B = A + b(\cos\alpha, \sin\alpha)$、$D = C - 5b(\cos\alpha, \sin\alpha)$，直接算得
> $AD = BC = 6.000$、$AC = 8$、$\vec{AB} \parallel \vec{DC}$、$[ACD] : [ABC] = 5.000$，四个条件全部满足；若改用 $\cos\alpha = \frac{\sqrt{42}}{7}$ 则 $AD = BC = 6$ 无法同时成立。
> sympy 联立上面两条余弦定理方程，在 $b > 0$ 下的唯一解就是 $b = \frac{2\sqrt{35}}{5}$、$\cos\alpha = \frac{3\sqrt{35}}{20}$。

> ⚠️ **原书插图与题设条件矛盾（勿照图量角）** —— 原书 Ch09 分册 p19 的图按 $\alpha \approx 34^\circ$ 绘制，量得 $AB \approx 2.63$、$CD \approx 10.63$，比值约 $4.04$ 而非 $5$。
> 该图本身是自洽的梯形（$AD = BC = 6$、$AC = 8$ 都对），因为 $2.63$ 与 $10.63$ 恰是 $z^2 - 16z\cos 34^\circ + 28 = 0$ 的两根；它只是没有满足面积条件，属于示意图。本解全程不依赖图中角度。

### MAT style questions
