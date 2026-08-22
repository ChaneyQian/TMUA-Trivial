---
database: TMUA
qid: 20132101202101
id: Zetta-Mock-P1-Q1
paper: TMUA Mock
year:
number: Q1
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Given that
$$ \int_{1}^{a} (ax + 2) \,dx = \frac{5\sqrt{2}}{2} - 2 $$
Find the value of $a$

$$
\mathbf{A} \quad 2
$$

$$
\mathbf{B} \quad \sqrt{2}
$$

$$
\mathbf{C} \quad \sqrt{2} + 1
$$

$$
\mathbf{D} \quad \sqrt{2} - 1
$$

$$
\mathbf{E} \quad 1.5
$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Integrate first, treating $a$ as a constant:

$$ \int_{1}^{a}(ax+2)\,dx = \left[\frac{ax^{2}}{2}+2x\right]_{1}^{a} = \frac{a^{3}}{2}+2a-\frac{a}{2}-2 $$

Setting this equal to $\frac{5\sqrt{2}}{2}-2$, the $-2$ cancels from both sides and

$$ \frac{a^{3}}{2}+\frac{3a}{2} = \frac{5\sqrt{2}}{2} \implies a^{3}+3a = 5\sqrt{2} $$

The left side is strictly increasing in $a$, so there is at most one real root. Testing $a=\sqrt{2}$ gives $2\sqrt{2}+3\sqrt{2}=5\sqrt{2}$, so $a=\sqrt{2}$ is the unique solution.

The answer is B.
