---
database: TMUA
qid: 20132101215111
id: BeyondHorizonSpec-Mock-P1-Q11
paper: TMUA Mock
year:
number: Q11
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
A triangle is cut from the corner of a rectangle. The resulting pentagon has sides of length 12, 15, 17, 20 and 30, though not necessarily in that order. What is the area of the pentagon?
$$\mathbf{A} \quad 530$$
$$\mathbf{B} \quad 540$$
$$\mathbf{C} \quad 550$$
$$\mathbf{D} \quad 560$$
$$\mathbf{E} \quad 570$$
$$\mathbf{F} \quad 580$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Let the rectangle have width $W$ and height $H$, and let the removed corner triangle be right-angled with legs $a$ along the width and $b$ along the height. The pentagon then has sides $W$, $H$, $W-a$, $H-b$ and the hypotenuse $c = \sqrt{a^2+b^2}$. So among the five given lengths, two are full sides of the rectangle, two are the shortened sides, and the fifth is the hypotenuse of a right triangle whose legs are the two corresponding differences. Testing differences, $20 - 12 = 8$ and $30 - 15 = 15$ give $8^2 + 15^2 = 64 + 225 = 289 = 17^2$, and 17 is precisely the remaining length. Hence $W = 20$, $H = 30$, $a = 8$, $b = 15$, $c = 17$, and the area is
$$20 \times 30 - \tfrac{1}{2}(8)(15) = 600 - 60 = 540.$$
The answer is B.
