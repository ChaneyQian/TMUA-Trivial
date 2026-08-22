---
database: TMUA
qid: 20132101204016
id: Zack-Mock-Q16
paper: TMUA Mock
year:
number: Q16
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
A sheep called Shaun lives in a circular pen of radius 8. His position inside the pen is random. What is the probability that Shaun is within 1m of a side of the pen?

$$
\mathbf{A} \quad \frac{1}{2}
$$

$$
\mathbf{B} \quad \frac{49}{64}
$$

$$
\mathbf{C} \quad \frac{7}{8}
$$

$$
\mathbf{D} \quad \frac{15}{64}
$$

$$
\mathbf{E} \quad \frac{1}{8}
$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
![[Image/Zack-Mock-Q16-sol1.png]]

"Within $1$ m of a side" means within $1$ m of the boundary circle, which is the annulus between radius $7$ and radius $8$. Since Shaun's position is uniform over the pen, the probability is the ratio of areas:

$$ \frac{\pi\left(8^{2}-7^{2}\right)}{\pi\cdot8^{2}} = \frac{64-49}{64} = \frac{15}{64} $$

The answer is D. Option E ($\tfrac18$) is the trap — that is the ratio of the *widths* $\tfrac{1}{8}$, but area does not scale linearly with radius, and the outer ring holds far more of the pen than its width suggests.
