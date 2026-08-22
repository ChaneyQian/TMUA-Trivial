---
database: TMUA
qid: 20132101203209
id: Yotta-Mock-P2-Q9
paper: TMUA Mock
year:
number: Q9
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
It is given that $\int u \frac{dv}{dx} \,dx = uv - \int v \frac{du}{dx} \,dx$. Here is an attempt to prove $0 = 1$:
1. Let $u = \frac{1}{x}$ and $\frac{dv}{dx} = 1$
2. $\frac{du}{dx} = -\frac{1}{x^2}$ and $v = x$
3. $\int \frac{1}{x} \,dx = 1 + \int \frac{1}{x} \,dx$
4. $\int \frac{1}{x} \,dx = 1 + \int \frac{1}{x} \,dx$. Therefore, $0 = 1$. QED.

$$
\mathbf{A} \quad \text{The proof is incorrect, and the first error is on line 1.}
$$

$$
\mathbf{B} \quad \text{The proof is incorrect, and the first error is on line 2.}
$$

$$
\mathbf{C} \quad \text{The proof is incorrect, and the first error is on line 3.}
$$

$$
\mathbf{D} \quad \text{The proof is incorrect, and the first error is on line 4.}
$$

$$
\mathbf{E} \quad \text{The proof is fully correct.}
$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Lines 1 and 2 are legitimate choices and correct derivatives: with $u = \frac{1}{x}$ and $\frac{dv}{dx} = 1$ we do get $\frac{du}{dx} = -\frac{1}{x^{2}}$ and $v = x$.

Line 3 applies the formula correctly:

$$ \int \frac{1}{x}\,dx = \frac{1}{x}\cdot x - \int x\left(-\frac{1}{x^{2}}\right)dx = 1 + \int \frac{1}{x}\,dx $$

so line 3 is a true statement, not an error.

The error is line 4, where $\int \frac{1}{x}\,dx$ is cancelled from both sides to leave $0 = 1$. An indefinite integral is not a single function but a family differing by an arbitrary constant, so the two occurrences need not be the same function; their difference is an arbitrary constant, not necessarily $0$. Read correctly, line 3 says only that the constant absorbs the $1$.

The answer is D.
