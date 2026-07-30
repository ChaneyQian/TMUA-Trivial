---
database: TMUA
qid: 20132101209208
id: JZMaths_SetE-Mock-P2-Q8
paper: TMUA Mock
year:
number: Q8
section: Multiple Choice
difficulty: 6.5
topics: []
subtopics: []
tags: [Logic Deduction, General Trigonometry]
status: 已入库
---

## 题目
Consider triangles $ABC$ such that $AB = 1$, $\sin A = \frac{1}{3}$ and $\cos C = x$.

What is the greatest possible value of $x$ for which there is **exactly one** distinct triangle satisfying these conditions?

$$ \mathbf{A} \quad \frac{1}{3} $$
$$ \mathbf{B} \quad \frac{\sqrt{2}}{3} $$
$$ \mathbf{C} \quad \frac{2}{3} $$
$$ \mathbf{D} \quad \frac{2\sqrt{2}}{3} $$
$$ \mathbf{E} \quad \frac{1 + \sqrt{2}}{3} $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Here is the intuition for this question.

For there to be two distinct triangles, $\sin A = \frac{1}{3}$ is ambiguous in $A$, since $\sin A = \sin(180^\circ - A)$. To find the answer to this question quickly, it is useful to think of $A$ as approximately $20^\circ$. Then $A$ could also be $160^\circ$. Therefore, for there to be two distinct triangles, $C$ can be upto, not include $20^\circ$; otherwise, two of the angles would already exceed $180^\circ$. Hence, the smallest value of $C$ for which there is only one triangle is $20^\circ$. Since $\cos C$ is decreasing between $0^\circ$ and $180^\circ$, the greatest value of $\cos C = x$ therefore occurs when $C = 20^\circ$, or whatever the actual value of $A$ is. In other words, the answer is $\cos A$, of the acute version of $A$.

Now let's formally prove it.

Let $\alpha = \sin^{-1}\left(\frac{1}{3}\right)$. Then the possible values of $A$ are $\alpha$ and $180^\circ - \alpha$.

For a fixed $x = \cos C$, there is exactly one value of $C$ in $0^\circ < C < 180^\circ$.

If $A = \alpha$, a triangle exists when $C < 180^{\circ} - \alpha$. If $A = 180^{\circ} - \alpha$, a triangle exists when $C < \alpha$.

Hence there is exactly one triangle when $\alpha \le C < 180^{\circ} - \alpha$. Since $\cos C$ decreases as $C$ increases, the greatest value of $x$ occurs when $C = \alpha$.

Therefore,
$$
x = \cos \alpha = \sqrt{1 - \frac{1}{9}} = \frac{2\sqrt{2}}{3}.
$$
