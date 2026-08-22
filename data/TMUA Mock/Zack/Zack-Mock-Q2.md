---
database: TMUA
qid: 20132101204002
id: Zack-Mock-Q2
paper: TMUA Mock
year:
number: Q2
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The symbol $\{x\}$ denotes the fractional part of $x$. For example $\{10.4\} = 0.4$, $\{2\} = 0$. Given that $f(x) = 5x^3 + 2x^2 + 8x + 1$, find
$$ \int_{0}^{n} f(\{x\} + 1) \,dx $$
where $n$ is a positive integer.

$$
\mathbf{A} \quad \frac{425n}{13}
$$

$$
\mathbf{B} \quad \frac{1}{2}n(n + 1)
$$

$$
\mathbf{C} \quad \frac{83n}{12}
$$

$$
\mathbf{D} \quad \frac{437n}{12}
$$

$$
\mathbf{E} \quad 15n^2 + 4n + 8
$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
The integrand $f(\{x\}+1)$ is **periodic with period $1$**, because $\{x\}$ resets every unit interval. So the integral over $[0,n]$ is $n$ copies of the integral over $[0,1]$.

On $[0,1)$ we have $\{x\}=x$, so substituting $u = x+1$ turns that single period into

$$ \int_{0}^{1} f(x+1)\,dx = \int_{1}^{2} f(u)\,du = \int_{1}^{2}\left(5u^{3}+2u^{2}+8u+1\right)du $$

$$ = \left[\frac{5u^{4}}{4}+\frac{2u^{3}}{3}+4u^{2}+u\right]_{1}^{2} = \left(20+\frac{16}{3}+16+2\right)-\left(\frac54+\frac23+4+1\right) $$

$$ = 33+\frac{14}{3}-\frac54 = 33+\frac{56-15}{12} = \frac{437}{12} $$

Multiplying by the $n$ periods gives $\dfrac{437n}{12}$.

The answer is D.
