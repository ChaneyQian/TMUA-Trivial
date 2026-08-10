---
database: TMUA
qid: 20132101207119
id: JZMaths_SetC-Mock-P1-Q19
paper: TMUA Mock
year:
number: Q19
section: Multiple Choice
difficulty: 7.5
topics: [Trigonometry, Geometry]
subtopics: [Sine and Cosine Rule, Euclid Geometry]
tags: [General Trigonometry, Geometry]
status: 已入库
---

## 题目
A triangle $ABC$ has $AB = x$, $BC = 2$, and $\angle BAC = 30^{\circ}$. Find the range of values of $x$ for which there are two non-congruent possible triangles satisfying these conditions, and in both triangles $\angle ABC$ is acute.
$$ \mathbf{A} \quad 0 < x < 2 $$
$$ \mathbf{B} \quad 2 < x < 4 $$
$$ \mathbf{C} \quad 2 < x < 2\sqrt{3} $$
$$ \mathbf{D} \quad 2\sqrt{3} < x < 4 $$
$$ \mathbf{E} \quad x > 2\sqrt{3} $$
$$ \mathbf{F} \quad 0 < x < 2\sqrt{3} $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Let $\angle ACB = C$. By the sine rule:
$$ \frac{2}{\sin 30^{\circ}} = \frac{x}{\sin C} \quad \Rightarrow \quad \sin C = \frac{x}{4}. $$

For there to be two non-congruent possible triangles, $\sin C = \frac{x}{4}$ must give two possible values of $C$.

Let the smaller possible value of $C$ be $\theta$, where $0^{\circ} < \theta < 90^{\circ}$. Then the two possible values of $C$ are $\theta$ and $180^{\circ} - \theta$.

For the triangle with $C = \theta$, where $0^{\circ} < \theta < 90^{\circ}$, we must have:
$$ 0 < \sin \theta < 1 \quad \Rightarrow \quad 0 < \frac{x}{4} < 1 \quad \Rightarrow \quad x < 4. $$

For the triangle with $C = 180^{\circ} - \theta$, to ensure the triangle is valid, we need the angle at $B$ to be positive:
$$ B = 180^{\circ} - 30^{\circ} - (180^{\circ} - \theta) = \theta - 30^{\circ} > 0 \quad \Rightarrow \quad \theta > 30^{\circ}. $$

Since $\sin \theta = \frac{x}{4}$, this gives
$$ \frac{x}{4} > \frac{1}{2} \quad \Rightarrow \quad x > 2. $$

Therefore, together $2 < x < 4$.

Now impose the condition that $\angle ABC$ is acute in both triangles.

If $C = 180^{\circ} - \theta$, then $B = \theta - 30^{\circ}$, which is automatically acute when $30^{\circ} < \theta < 90^{\circ}$.

If $C = \theta$, then
$$ B = 180^{\circ} - 30^{\circ} - \theta = 150^{\circ} - \theta. $$

For this to be acute, we need
$$ 150^{\circ} - \theta < 90^{\circ}, $$

so $\theta > 60^{\circ}$. Since $\sin \theta = \frac{x}{4}$, this gives
$$ \frac{x}{4} > \frac{\sqrt{3}}{2} \quad \Rightarrow \quad x > 2\sqrt{3}. $$

Combining this with previous conditions on $x$, we obtain
$$ 2\sqrt{3} < x < 4. $$
