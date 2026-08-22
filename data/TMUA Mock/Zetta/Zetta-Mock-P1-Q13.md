---
database: TMUA
qid: 20132101202113
id: Zetta-Mock-P1-Q13
paper: TMUA Mock
year:
number: Q13
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
In the cube $ABCDEFGH$ with opposite vertices $C$ and $E$, $J$ and $I$ are the midpoints of segments $\overline{FB}$ and $\overline{HD}$, respectively. Let $R$ be the ratio of the area of the cross-section $EJCI$ to the area of one of the faces of the cube. What is $R^2$?

![[Image/Zetta-Mock-P1-Q13-fig1.png]]

$$
\mathbf{A} \quad \frac{5}{4}
$$

$$
\mathbf{B} \quad \frac{4}{3}
$$

$$
\mathbf{C} \quad \frac{3}{2}
$$

$$
\mathbf{D} \quad \frac{25}{16}
$$

$$
\mathbf{E} \quad \frac{9}{4}
$$

$$
\mathbf{F} \quad \frac{7}{4}
$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
![[Image/Zetta-Mock-P1-Q13-sol1.png]]

Put the cube in coordinates with side $1$: $A(0,0,0)$, $B(1,0,0)$, $C(1,1,0)$, $D(0,1,0)$ and $E(0,0,1)$, $F(1,0,1)$, $G(1,1,1)$, $H(0,1,1)$, so that $C$ and $E$ are indeed opposite. Then $J\left(1,0,\tfrac12\right)$ and $I\left(0,1,\tfrac12\right)$.

First check $EJCI$ is planar: $\overrightarrow{EJ}+\overrightarrow{EI} = (1,0,-\tfrac12)+(0,1,-\tfrac12) = (1,1,-1) = \overrightarrow{EC}$, so it is a parallelogram. Both sides have length $\sqrt{1+\tfrac14} = \tfrac{\sqrt5}{2}$, so it is a **rhombus**, and the area of a rhombus is half the product of its diagonals:

$$ EC = \sqrt{3} \ \ (\text{a space diagonal}), \qquad JI = \left|(1,-1,0)\right| = \sqrt{2} \ \ (\text{a face diagonal}) $$

$$ [EJCI] = \tfrac12\sqrt3\cdot\sqrt2 = \frac{\sqrt6}{2} $$

A face has area $1$, so $R = \dfrac{\sqrt6}{2}$ and $R^{2} = \dfrac{6}{4} = \dfrac{3}{2}$.

The answer is C.
