---
database: TMUA
qid: 20132101203220
id: Yotta-Mock-P2-Q20
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
Solve these simultaneous equations to find the real numbers $x, y$ and $z$. Hence find $x + y^2 + z^3$.
$$ x^2 + 6y + 10 = 0 $$
$$ 3y^2 + 6z + 5 = -1 $$
$$ 40x - 5z^2 = 70 $$

$$
\mathbf{A} \quad 4
$$

$$
\mathbf{B} \quad 6
$$

$$
\mathbf{C} \quad 10
$$

$$
\mathbf{D} \quad 12
$$

$$
\mathbf{E} \quad 14
$$

$$
\mathbf{F} \quad 16
$$

$$
\mathbf{G} \quad \text{No solution exists}
$$

## 备注

### 我的备注

### AI备注


## 答案
G

## 解析
Rewrite the three equations so that everything is on one side:

$$ x^{2} + 6y + 10 = 0, \qquad 3y^{2} + 6z + 6 = 0, \qquad z^{2} - 8x + 14 = 0 $$

(the second from $3y^{2} + 6z + 5 = -1$, the third from dividing $40x - 5z^{2} = 70$ by $-5$).

If a real solution existed it would satisfy all three, hence also their sum:

$$ x^{2} - 8x + 3y^{2} + 6y + z^{2} + 6z + 30 = 0 $$

Completing the square in each variable,

$$ \left[(x-4)^{2} - 16\right] + 3\left[(y+1)^{2} - 1\right] + \left[(z+3)^{2} - 9\right] + 30 = 0 $$

$$ (x-4)^{2} + 3(y+1)^{2} + (z+3)^{2} = -2 $$

The left-hand side is a sum of non-negative terms and so is at least $0$, while the right-hand side is negative. This is impossible, so no real $x$, $y$, $z$ satisfy the system and the quantity $x + y^{2} + z^{3}$ is undefined.

The answer is G.
