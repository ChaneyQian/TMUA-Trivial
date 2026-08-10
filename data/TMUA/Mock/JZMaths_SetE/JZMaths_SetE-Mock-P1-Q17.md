---
database: TMUA
qid: 20132101209117
id: JZMaths_SetE-Mock-P1-Q17
paper: TMUA Mock
year:
number: Q17
section: Multiple Choice
difficulty: 7.5
topics: [Miscellaneous Pure]
subtopics: [Inequalities]
tags: [General Algebra]
status: 已入库
---

## 题目
Positive real numbers $a$, $b$ and $c$ satisfy $a + b + c = 6$. Find the maximum value of $a^2bc$.

You may find the following inequality for positive real numbers $x$ and $y$ useful:
$$ xy \le \left( \frac{x + y}{2} \right)^2, $$
with equality if and only if $x = y$.

$$ \mathbf{A} \quad 20 $$
$$ \mathbf{B} \quad 24 $$
$$ \mathbf{C} \quad 36 $$
$$ \mathbf{D} \quad \frac{81}{4} $$
$$ \mathbf{E} \quad 18 $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Applying the given inequality to $b$ and $c$ gives
$$ bc \le \left( \frac{b + c}{2} \right)^2 = \left( \frac{6 - a}{2} \right)^2. $$

Therefore
$$ a^2bc \le \left( \frac{a(6 - a)}{2} \right)^2. $$

Applying the inequality again, this time to $a$ and $6 - a$, gives
$$ a(6 - a) \le \left( \frac{a + (6 - a)}{2} \right)^2 = 9, $$
therefore
$$ \left( \frac{a(6 - a)}{2} \right)^2 \le \left( \frac{9}{2} \right)^2. $$

Hence
$$ a^2bc \le \left( \frac{a(6 - a)}{2} \right)^2 \le \left( \frac{9}{2} \right)^2 = \frac{81}{4}. $$

Equality occurs when $b = c$ and $a = 6 - a$. Thus $a = 3$ and $b = c = \frac{3}{2}$, so equality is attainable.

Therefore the maximum value is $\frac{81}{4}$.
