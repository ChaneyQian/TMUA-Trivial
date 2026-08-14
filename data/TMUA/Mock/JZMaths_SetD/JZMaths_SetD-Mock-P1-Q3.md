---
database: TMUA
qid: 20132101208103
id: JZMaths_SetD-Mock-P1-Q3
paper: TMUA Mock
year:
number: Q3
section: Multiple Choice
difficulty: 6
topics: [Function, Algebra (Basic)]
subtopics: [Absolute Value Functions, Functions, Algebra Manipulation]
tags: [General-Functions]
status: 已入库
---

## 题目
The functions $f$ and $g$ are defined for all real $x$ by
$$ f(x) = |x - 2| + |x + 2| $$
and
$$ g(x) = x^2 - 2x + 4. $$

The function $h$ is defined by
$$ h(x) = g(f(x)). $$

What is the minimum value of $h(x)$?
$$ \mathbf{A} \quad 10 $$
$$ \mathbf{B} \quad 11 $$
$$ \mathbf{C} \quad 12 $$
$$ \mathbf{D} \quad 13 $$
$$ \mathbf{E} \quad 14 $$
$$ \mathbf{F} \quad 15 $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Since $f(x) = |x - 2| + |x + 2|$ is the sum of the distances from $x$ to $2$ and $-2$, we have $f(x) \ge 4$, with equality for $-2 \le x \le 2$.

Also,
$$ g(t) = t^2 - 2t + 4 = (t - 1)^2 + 3. $$

For $t \ge 4$, $g(t)$ is increasing. Therefore, $g(f(x))$ is minimised when $f(x) = 4$.

Hence the minimum value is $g(4) = 16 - 8 + 4 = 12$.
