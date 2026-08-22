---
database: TMUA
qid: 20132101214119
id: BeyondHorizonS4-Mock-P1-Q19
paper: TMUA Mock
year:
number: Q19
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Let $A$ be a point on the circle with the equation $x^2 + y^2 = 4$, and let $B$ be a point on the circle with the equation $x^2 + y^2 = 9$. If the angle between the vectors representing the points $A$ and $B$ is $30^\circ$, what is the distance between the points $A$ and $B$?
$$\mathbf{A} \quad \sqrt{13}$$
$$\mathbf{B} \quad 6\sqrt{3}$$
$$\mathbf{C} \quad \sqrt{3}$$
$$\mathbf{D} \quad \sqrt{13 - 6\sqrt{3}}$$
$$\mathbf{E} \quad \sqrt{13 + 6\sqrt{3}}$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
The two circles are concentric at the origin with radii $2$ and $3$, so treating $A$ and $B$ as position vectors we have $|A| = 2$, $|B| = 3$ and the angle between them is $30^\circ$. The triangle $OAB$ then gives, by the cosine rule,
$$|AB|^2 = 2^2 + 3^2 - 2 \cdot 2 \cdot 3\cos 30^\circ = 13 - 12 \cdot \frac{\sqrt{3}}{2} = 13 - 6\sqrt{3},$$
so the distance is $\sqrt{13 - 6\sqrt{3}} \approx 1.61$. The answer is D. Option E has the sign of the cosine term reversed, which would be the distance for an angle of $150^\circ$; option A drops the cosine term altogether, as if the two vectors were perpendicular.
