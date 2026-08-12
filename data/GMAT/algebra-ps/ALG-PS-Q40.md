---
database: GMAT
qid: 90020714000
id: ALG-PS-Q40
paper: GMAT Algebra PS Diagnostic
year: 0
number: Q40
section: Problem Solving
band: VERY HARD
level: LEVEL 8
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
If $n$ is an integer greater than 1, what is the value of $10*\sqrt[n]{10*\sqrt[n]{10*\sqrt[n]{10*\sqrt[n]{...}}}}$, where the given expression extends to an infinite number of roots?

$$
\mathbf{A} \quad 10
$$

$$
\mathbf{B} \quad 10^{\frac{1}{n}}
$$

$$
\mathbf{C} \quad 10^{\frac{n-1}{n}}
$$

$$
\mathbf{D} \quad 10^{\frac{n}{n-1}}
$$

$$
\mathbf{E} \quad 10^{n}
$$

## 备注

### 我的备注

### AI备注

## 答案
D

## 解析
**Official Solution:**

Let $x=10*\sqrt[n]{10*\sqrt[n]{10*\sqrt[n]{10*\sqrt[n]{...}}}}$

Now, re-write above as $x=10*\sqrt[n]{(10*\sqrt[n]{10*\sqrt[n]{10*\sqrt[n]{...})}}}$.

Since the expression extends to an infinite number of roots, then the expression in brackets would also equal to $x$. Thus we can replace the expression in brackets with $x$ and rewrite the expression as: $x=10*\sqrt[n]{x}$

Take above to the $n^{th}$ power:

$x^n=10^n*x$

$x^{n-1}=10^n$

Take $n-1^{th}$ root:

$x=10^{\frac{n}{n-1}}$

Answer: D
