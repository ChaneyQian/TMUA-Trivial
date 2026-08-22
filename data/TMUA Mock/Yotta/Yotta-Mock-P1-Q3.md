---
database: TMUA
qid: 20132101203103
id: Yotta-Mock-P1-Q3
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
Let $f_0(x) = x$, and $f_{n+1}(x) = |f_n(x) - k|$ for non-negative integers $n$, and real number $k$. Let $\alpha$ and $\beta$ respectively equal the least and greatest values of $x$ for which $f_n(x) = 0$. Find the value of:
$$ \int_{\alpha}^{\beta} f_n(x) \,dx $$
for $n > 0$, in terms of $n$ and $k$.

$$
\mathbf{A} \quad nk^2
$$

$$
\mathbf{B} \quad nk^2 - k^2
$$

$$
\mathbf{C} \quad kn^2
$$

$$
\mathbf{D} \quad nk
$$

$$
\mathbf{E} \quad k(n - 1)^2
$$

$$
\mathbf{F} \quad nk^2 - 1
$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Work out the first few cases with $k > 0$ to see the pattern. Since $f_{1}(x) = |x-k|$ vanishes only at $x = k$, we get $\alpha = \beta = k$ and the integral is $0$.

For $f_{2}(x) = \bigl||x-k| - k\bigr|$ the zeros are at $x = 0$ and $x = 2k$, so $\alpha = 0$ and $\beta = 2k$. Between them the graph is two triangles of base $k$ and height $k$, giving area $2 \cdot \frac{1}{2}k^{2} = k^{2}$.

In general, applying $|\cdot - k|$ once more reflects the graph about the line $y = k$ and drops it by $k$: each existing "tooth" splits into two, and the outer zeros move out by $k$ on each side. So $f_{n}$ has $\alpha = -(n-2)k$ and $\beta = nk$ for $n \geq 2$, and the region between them consists of $2(n-1)$ triangles each of base $k$ and height $k$. Therefore

$$ \int_{\alpha}^{\beta} f_{n}(x)\,dx = 2(n-1) \cdot \frac{1}{2}k^{2} = (n-1)k^{2} = nk^{2} - k^{2} $$

This also gives $0$ at $n = 1$, agreeing with the case above. The answer is B.
