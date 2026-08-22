---
database: TMUA
qid: 20132101202104
id: Zetta-Mock-P1-Q4
paper: TMUA Mock
year:
number: Q4
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
You are given that
$$ p(x) = -6 + x + x^2 + x^3 + x^4 + x^5 + \dots $$
Find the value of $x$ such that $p(x) = 0$

$$
\mathbf{A} \quad -\frac{1}{7}
$$

$$
\mathbf{B} \quad -\frac{1}{6}
$$

$$
\mathbf{C} \quad \frac{8}{7}
$$

$$
\mathbf{D} \quad \frac{1}{7}
$$

$$
\mathbf{E} \quad \frac{6}{7}
$$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
Everything after the $-6$ is a geometric series with first term $x$ and ratio $x$, which converges only for $|x|<1$:

$$ p(x) = -6 + \frac{x}{1-x} $$

Setting $p(x)=0$ gives $\dfrac{x}{1-x}=6$, so $x = 6-6x$ and $x=\dfrac{6}{7}$.

Since $\left|\tfrac67\right|<1$ the series does converge there, so this is genuine. The answer is E. (Note that $\frac{8}{7}$ would also satisfy the algebra but lies outside the interval of convergence, so $p$ is not even defined there.)
