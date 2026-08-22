---
database: TMUA
qid: 20132101213213
id: BeyondHorizonS3-Mock-P2-Q13
paper: TMUA Mock
year:
number: Q13
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Suppose $n \geq 2$ is a fixed positive integer and $f(x) = x^n|x|$, $x \in R$. Then
$$\mathbf{A} \quad f \text{ is differentiable everywhere only when } n \text{ is even}$$
$$\mathbf{B} \quad f \text{ is differentiable everywhere except at 0 if } n \text{ is odd}$$
$$\mathbf{C} \quad f \text{ is differentiable everywhere}$$
$$\mathbf{D} \quad \text{none of the above is true}$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Away from the origin $|x|$ is smooth, being $x$ on $(0,\infty)$ and $-x$ on $(-\infty,0)$, so $f$ is certainly differentiable at every $x \neq 0$ for any $n$. The only point in question is $x = 0$.

At the origin use the definition of the derivative directly:
$$\lim_{x \to 0} \frac{f(x) - f(0)}{x - 0} = \lim_{x \to 0} \frac{x^n |x|}{x} = \lim_{x \to 0} x^{n-1}|x|.$$
Since $n \geq 2$ we have $n - 1 \geq 1$, so $x^{n-1}|x| \to 0$ as $x \to 0$ from either side. The limit exists and equals $0$, so $f'(0) = 0$.

This calculation never used the parity of $n$, so $f$ is differentiable everywhere for every $n \geq 2$. Options A and B both wrongly make the conclusion depend on whether $n$ is even or odd, and since C is true, D is false. The answer is C.
