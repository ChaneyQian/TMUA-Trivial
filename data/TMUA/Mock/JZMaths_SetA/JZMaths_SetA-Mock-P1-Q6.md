---
database: TMUA
qid: 20132101205106
id: JZMaths_SetA-Mock-P1-Q6
paper: TMUA Mock
year:
number: Q6
section: Multiple Choice
difficulty: 6.5
topics: []
subtopics: []
tags: [Graphs of Functions, General Functions]
status: 已入库
---

## 题目
Given
$$ g(x) = \frac{3}{4} \left( \sin \left( \frac{3}{2}x + \frac{\pi}{6} \right) + \cos \left( \frac{\pi}{3} - \frac{3}{2}x \right) + 2 \right), $$
find the product of the maximum and minimum value of
$$ 4g(x) - (g(x))^2 - 3. $$
$$ \mathbf{A} \quad -3 $$
$$ \mathbf{B} \quad 0 $$
$$ \mathbf{C} \quad 1 $$
$$ \mathbf{D} \quad 3 $$
$$ \mathbf{E} \quad 2 $$
$$ \mathbf{F} \quad -1 $$
$$ \mathbf{G} \quad 6 $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
If you ever see a scary looking function such as $g(x)$, there is most likly a **catch**, and in this case, there **is** one!

Notice that the arguments of the sin and cos in $g(x)$ adds
$$ \left(\frac{3}{2}x + \frac{\pi}{6}\right) + \left(\frac{\pi}{3} - \frac{3}{2}x\right) $$
exactly to $\pi/2$, therefore they are identical. (Using the identity: $\sin x = \cos(\pi/2 - x)$). Therefore, for example:
$$ g(x) = \frac{3}{4} \left( 2 \cdot \sin \left( \frac{3}{2}x + \frac{\pi}{6} \right) + 2 \right). $$
Now, the only thing we need to work out about $g(x)$ is its range, which is now $\{ 0 \leq g(x) \leq 3 \}$, since it is just a scaled and translated single sin function.

Lastly, let $X=g(x)$. Then

$$ 4g(x)-(g(x))^2-3=4X-X^2-3=1-(X-2)^2. $$

Restricting to $0\leq X\leq 3$, the maximum is $1$ and the minimum is $-3$, so their product is $-3$.
