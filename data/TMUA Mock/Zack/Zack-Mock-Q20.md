---
database: TMUA
qid: 20132101204020
id: Zack-Mock-Q20
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
Given that CB is an arc formed from the circle of radius $a$ centred at A, and AB and AC are defined similarly, what is the area of the shape ABC in terms of $a$?

![[Image/Zack-Mock-Q20-fig1.png]]

$$
\mathbf{A} \quad \frac{a^2}{2} \left( \pi - 3\tan\frac{\pi}{6} \right)
$$

$$
\mathbf{B} \quad \frac{a^2}{2} \left( \pi - 3\tan\frac{\pi}{3} \right)
$$

$$
\mathbf{C} \quad \frac{a^2}{2} \left( \pi - 3\sin\frac{\pi}{6} \right)
$$

$$
\mathbf{D} \quad \frac{a^2}{2} \left( \pi - 3\sin\frac{\pi}{3} \right)
$$

$$
\mathbf{E} \quad 3a^2\pi \tan\left(\frac{\pi}{6}\right)
$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
![[Image/Zack-Mock-Q20-sol1.png]]

Each arc has radius $a$ and is centred at the opposite vertex, so $AB = BC = CA = a$ and triangle $ABC$ is equilateral with angles $\tfrac{\pi}{3}$. The shape is a Reuleaux triangle.

Take the three sectors of radius $a$ and angle $\tfrac{\pi}{3}$, one centred at each vertex. Together they cover the whole shape, but the central triangle gets covered three times instead of once — so their total equals the shape plus two extra copies of the triangle:

$$ 3\cdot\frac12 a^{2}\cdot\frac{\pi}{3} = [\text{shape}] + 2\cdot\frac{\sqrt3}{4}a^{2} $$

$$ [\text{shape}] = \frac{\pi a^{2}}{2}-\frac{\sqrt3}{2}a^{2} = \frac{a^{2}}{2}\left(\pi-\sqrt3\right) $$

Finally, $\sqrt3 = 3\cdot\dfrac{1}{\sqrt3} = 3\tan\dfrac{\pi}{6}$, so this is $\dfrac{a^{2}}{2}\left(\pi-3\tan\dfrac{\pi}{6}\right)$.

The answer is A.
