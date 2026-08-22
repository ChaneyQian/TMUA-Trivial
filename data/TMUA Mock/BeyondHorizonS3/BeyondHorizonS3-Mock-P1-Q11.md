---
database: TMUA
qid: 20132101213111
id: BeyondHorizonS3-Mock-P1-Q11
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
A rectangle is drawn in the region enclosed by the curves $p$ and $q$, where
$$p(x) = 10 - 3x^2$$
$$q(x) = x^2 - 3$$
such that the sides of the rectangle are parallel to the $x$- and $y$-axes. What is the maximum possible area of the rectangle?
$$\mathbf{A} \quad \frac{26}{9}$$
$$\mathbf{B} \quad \frac{26\sqrt{39}}{9}$$
$$\mathbf{C} \quad \frac{5\sqrt{39}}{3}$$
$$\mathbf{D} \quad \frac{10\sqrt{6}}{3}$$
$$\mathbf{E} \quad 5\sqrt{39}$$
$$\mathbf{F} \quad 10\sqrt{6}$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
The curves cross where $10 - 3x^2 = x^2 - 3$, i.e. $4x^2 = 13$, so the region spans $|x| \leq \frac{\sqrt{13}}{2}$ with $p$ on top. Suppose the rectangle occupies $a \leq x \leq b$ and let $m = \max(|a|,|b|)$. The top edge cannot rise above $\min p$ on that interval, which is $p(m) = 10 - 3m^2$ because $p$ decreases as $|x|$ grows, and the bottom edge cannot fall below $\max q = q(m) = m^2 - 3$. So the height is at most $13 - 4m^2$ while the width is at most $2m$, both bounds being attained by the symmetric rectangle on $-m \leq x \leq m$. Maximising $A(m) = 2m(13 - 4m^2) = 26m - 8m^3$ gives $A'(m) = 26 - 24m^2 = 0$, so $m^2 = \frac{13}{12}$ and $m = \frac{\sqrt{39}}{6}$. Then $13 - 4m^2 = \frac{26}{3}$ and $A = 2 \cdot \frac{\sqrt{39}}{6} \cdot \frac{26}{3} = \frac{26\sqrt{39}}{9} \approx 18.04$. The answer is B. Option A is the trap for anyone who computes the optimal height $\frac{26}{3}$ or the factor $\frac{26}{9}$ and forgets to multiply by the width.
