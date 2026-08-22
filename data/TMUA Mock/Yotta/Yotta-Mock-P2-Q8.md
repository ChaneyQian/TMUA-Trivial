---
database: TMUA
qid: 20132101203208
id: Yotta-Mock-P2-Q8
paper: TMUA Mock
year:
number: Q8
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Find a counterexample, if it exists, to the statement:
$\int_{0}^{1} f(x) \,dx$ is equal to the area enclosed by $f(x)$, the $x$-axis, $x = 0$ and $x = 1$ **if** $f(x)$ is defined for $0 \leq x \leq 1$

$$
\mathbf{A} \quad f(x) = (x - 2)^2
$$

$$
\mathbf{B} \quad f(x) = (\sin(x) + 1)(\sin(x) - 1)
$$

$$
\mathbf{C} \quad f(x) = \ln(x)
$$

$$
\mathbf{D} \quad f(x) = 1 - x
$$

$$
\mathbf{E} \quad f(x) = \cos(x)
$$

$$
\mathbf{F} \quad \text{The statement is incorrect, but none of the above are counterexamples}
$$

$$
\mathbf{G} \quad \text{The statement is correct, so none of the above are counterexamples}
$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
The claim is that the value of $\int_{0}^{1} f$ always equals the *area* between the graph and the $x$-axis. That fails as soon as $f$ dips below the axis, because the integral counts such regions negatively while area counts them positively. So a counterexample must be defined on the whole of $[0,1]$ and take negative values there.

Option B is exactly that: $(\sin x + 1)(\sin x - 1) = \sin^{2}x - 1 = -\cos^{2}x$, which is negative throughout $[0,1]$ (as $\cos x \neq 0$ there). Its integral is negative while the enclosed area is positive, so the statement fails.

The other options do not work. $(x-2)^{2}$, $1-x$ and $\cos x$ are all non-negative on $[0,1]$, so for them the integral does equal the area. And $\ln x$ is undefined at $x = 0$, so it never satisfies the hypothesis "$f(x)$ is defined for $0 \leq x \leq 1$" and cannot be a counterexample to it.

The answer is B.
