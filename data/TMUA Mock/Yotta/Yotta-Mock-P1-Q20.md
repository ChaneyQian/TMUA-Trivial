---
database: TMUA
qid: 20132101203120
id: Yotta-Mock-P1-Q20
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
The function $F(x)$, where $x$ is a non-negative real number, is the result of subtracting the integer part of $x$ from $x$. For example, $F(3) = 0$, $F(5.43) = 0.43$, $F(\pi) = 0.14159265...$.
Find an expression for:
$$ \int_{0}^{\sqrt{k}} F(x^2) \,dx $$
where $k$ is a positive integer.

$$
\mathbf{A} \quad \frac{1}{3}k^{\frac{3}{2}} - F(\frac{1}{3}k^{\frac{3}{2}})
$$

$$
\mathbf{B} \quad \frac{1}{3}k^{\frac{3}{2}} - \sum_{n=0}^{k} n(\sqrt{n+1} - \sqrt{n})
$$

$$
\mathbf{C} \quad \frac{1}{3}k^{\frac{3}{2}} + \sum_{n=0}^{k-1} n(\sqrt{n+1} - \sqrt{n})
$$

$$
\mathbf{D} \quad \frac{1}{3}k^{\frac{3}{2}} - \sum_{n=0}^{k-1} n(\sqrt{n+1} + \sqrt{n})
$$

$$
\mathbf{E} \quad \frac{1}{3}k^{\frac{3}{2}} + (\sum_{n=0}^{k-1} \sqrt{n}) + (k-1)\sqrt{k}
$$

$$
\mathbf{F} \quad \frac{1}{3}k^{\frac{3}{2}} + (\sum_{n=0}^{k-1} \sqrt{n}) + (1-k)\sqrt{k}
$$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
Split the fractional part into the value minus its integer part:

$$ \int_{0}^{\sqrt{k}} F(x^{2})\,dx = \int_{0}^{\sqrt{k}} x^{2}\,dx - \int_{0}^{\sqrt{k}} \lfloor x^{2} \rfloor\,dx = \frac{1}{3}k^{3/2} - \int_{0}^{\sqrt{k}} \lfloor x^{2} \rfloor\,dx $$

On $\sqrt{n} \leq x < \sqrt{n+1}$ we have $\lfloor x^{2} \rfloor = n$, and these intervals tile $[0, \sqrt{k}]$ for $n = 0, 1, \dots, k-1$. Hence

$$ \int_{0}^{\sqrt{k}} \lfloor x^{2} \rfloor\,dx = \sum_{n=0}^{k-1} n\left(\sqrt{n+1} - \sqrt{n}\right) $$

Split the sum and reindex the first part with $m = n+1$:

$$ \sum_{n=0}^{k-1} n\sqrt{n+1} - \sum_{n=0}^{k-1} n\sqrt{n} = \sum_{m=1}^{k} (m-1)\sqrt{m} - \sum_{n=1}^{k-1} n\sqrt{n} = (k-1)\sqrt{k} - \sum_{n=0}^{k-1} \sqrt{n} $$

Substituting back,

$$ \int_{0}^{\sqrt{k}} F(x^{2})\,dx = \frac{1}{3}k^{3/2} + \left(\sum_{n=0}^{k-1}\sqrt{n}\right) + (1-k)\sqrt{k} $$

The answer is F.
