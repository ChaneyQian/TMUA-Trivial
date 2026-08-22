---
database: TMUA
qid: 20132101212115
id: BeyondHorizonS2-Mock-P1-Q15
paper: TMUA Mock
year:
number: Q15
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The number of pairs of positive integers $x, y$ which solve the equation
$$x^3 + 6x^2y + 12xy^2 + 8y^3 = 2^{27}$$
is
$$\mathbf{A} \quad 0$$
$$\mathbf{B} \quad 2^5$$
$$\mathbf{C} \quad 2^8 - 1$$
$$\mathbf{D} \quad 2^9 + 2$$
$$\mathbf{E} \quad 2^7$$
$$\mathbf{F} \quad 2^6 - 1$$
$$\mathbf{G} \quad 2^8 + 1$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
The left-hand side is a perfect cube: $x^3 + 6x^2y + 12xy^2 + 8y^3 = (x + 2y)^3$. Since $2^{27} = \left(2^9\right)^3$ and the real cube root is unique, the equation is equivalent to
$$x + 2y = 512.$$
For positive integers, $y$ may take any value with $x = 512 - 2y \geq 1$; because $x$ is automatically even this means $512 - 2y \geq 2$, i.e. $1 \leq y \leq 255$. Each such $y$ gives exactly one $x$, so there are $255 = 2^8 - 1$ pairs. The answer is C. Option G counts the extra pair $y = 256$, $x = 0$, which is excluded because $x$ must be positive.
