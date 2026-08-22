---
database: TMUA
qid: 20132101211106
id: BeyondHorizonS1-Mock-P1-Q6
paper: TMUA Mock
year:
number: Q6
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
How many integer pairs $(x,y)$ satisfy the equation
$$x^2 + 6x + y^2 = 4$$
$$\mathbf{A} \quad 2$$
$$\mathbf{B} \quad 4$$
$$\mathbf{C} \quad 6$$
$$\mathbf{D} \quad 8$$
$$\mathbf{E} \quad 10$$
$$\mathbf{F} \quad 12$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Completing the square turns the equation into
$$(x+3)^2 + y^2 = 13$$
so with $a = x+3$ and $b = y$ we need all integer solutions of $a^2 + b^2 = 13$. The only way to write $13$ as a sum of two squares is $4 + 9$, so $\{|a|, |b|\} = \{2, 3\}$. That gives $(a,b) = (\pm 2, \pm 3)$ and $(\pm 3, \pm 2)$, four sign choices in each family, hence $8$ pairs. Since $x = a - 3$ is an integer whenever $a$ is, all eight survive. The answer is D. Option B is the trap for anyone who counts only one of the two families.
