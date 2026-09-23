---
database: TMUA
qid: 90020230300
id: SMT-Ch5-Q3
paper: SMT Skills Ch5
year:
number: Q3
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
style: TMUA
solution_source: 书后解答
answer_verified: true
status: 已入库
---

## 题目
The sequence of functions $f_1(x), f_2(x), f_3(x), \dots$ is defined as follows.
$f_1(x) = 2x$
$f_{n+1}(x) = 2xf'_n(x)$ for $n \ge 1$
where $f'_n(x)$ is the first derivative of $f_n(x)$ with respect to $x$.
What is the value of $\sum_{r=1}^{50} f_r(x)$?

$$\mathbf{A} \quad x\left(2^{49} - 1\right)$$

$$\mathbf{B} \quad x\left(2^{50} - 1\right)$$

$$\mathbf{C} \quad 2^{49} x$$

$$\mathbf{D} \quad 2^{50} x$$

$$\mathbf{E} \quad \frac{x(2^{49} - 1)}{2}$$

$$\mathbf{F} \quad \frac{x(2^{50} - 1)}{2}$$

$$\mathbf{G} \quad 2x(2^{49} - 1)$$

$$\mathbf{H} \quad 2x(2^{50} - 1)$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 5 章 Functions 章末 TMUA style 第 3 题；解析为书后官方 worked solution。
- **书后答案印的是 C，已订正为 H。** 书后解答自己推出 $\sum = 2x(2^{50}-1)$，那正是选项 H，只是末句字母写错。

## 答案
H

## 解析
$f_{1}(x) = 2x$, $f_{2}(x) = 2x \times 2 = 4x$, $f_{3}(x) = 2x \times 4 = 8x$, $f_{4}(x) = 2x \times 8 = 16x$

$$
\sum_{1}^{50}{f_{r}(x)} = 2x + 4x + 8x + 16x + \ldots +
$$

Geometric series with $a = 2x$ and $r = 2$ so $n = 50$ terms

$$
\sum_{1}^{50}{f_{r}(x)} = \frac{2x\left( 2^{50} - 1 \right)}{2 - 1} = 2x\left( 2^{50} - 1 \right)
$$

The correct answer is C.
