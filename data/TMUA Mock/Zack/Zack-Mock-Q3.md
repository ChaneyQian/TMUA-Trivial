---
database: TMUA
qid: 20132101204003
id: Zack-Mock-Q3
paper: TMUA Mock
year:
number: Q3
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Let $x$ and $y$ be real numbers such that $x^2 + y^2 = 49$. What is the greatest value of $12x - 5y$?

$$
\mathbf{A} \quad 91
$$

$$
\mathbf{B} \quad 84
$$

$$
\mathbf{C} \quad 104
$$

$$
\mathbf{D} \quad 89
$$

$$
\mathbf{E} \quad 87
$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
The constraint $x^{2}+y^{2}=49$ is a circle of radius $7$, so write $x = 7\cos\theta$, $y = 7\sin\theta$. Then

$$ 12x-5y = 7\left(12\cos\theta-5\sin\theta\right) $$

Any expression $a\cos\theta+b\sin\theta$ has maximum $\sqrt{a^{2}+b^{2}}$, and here $\sqrt{12^{2}+(-5)^{2}} = \sqrt{169} = 13$. Hence the greatest value is

$$ 7\times13 = 91 $$

The answer is A. (Equivalently, by Cauchy–Schwarz, $12x-5y \leq \sqrt{12^{2}+5^{2}}\sqrt{x^{2}+y^{2}} = 13\cdot7$.)
