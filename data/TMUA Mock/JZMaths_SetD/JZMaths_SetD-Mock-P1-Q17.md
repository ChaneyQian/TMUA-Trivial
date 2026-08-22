---
database: TMUA
qid: 20132101208117
id: JZMaths_SetD-Mock-P1-Q17
paper: TMUA Mock
year:
number: Q17
section: Multiple Choice
difficulty: 8
topics: [Sequences and Series, Polynomial]
subtopics: [Recurrence Relations, Symmetric and Cyclic Polynomials]
tags: [General-Algebra, Polynomial-Expansions]
status: 已入库
---

## 题目
A real number $x$ satisfies
$$x^2 - 3x + 1 = 0.$$
For each non-negative integer $n$, define
$$p_n = x^n + \frac{1}{x^n}.$$
Find the value of $p_6$.

You may find it helpful to consider a recurrence relation of the form $p_n = 3p_{n-1} + kp_{n-2}$ for some constant $k$.
$$ \mathbf{A} \quad 322 $$
$$ \mathbf{B} \quad 123 $$
$$ \mathbf{C} \quad 312 $$
$$ \mathbf{D} \quad 151 $$
$$ \mathbf{E} \quad 276 $$
$$ \mathbf{F} \quad 258 $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
**Remark:** If a question says, **You may find it helpful**, this is often a euphemism for, **If you do not use this, you are unlikely to get very far!** So, although it may sound optional, you would be wise to follow the hint.

Since $x^2 - 3x + 1 = 0$ and $x \neq 0$, dividing by $x$ gives
$$x + \frac{1}{x} = 3.$$
For $n \ge 2$,
$$3p_{n-1} = \left(x + \frac{1}{x}\right) \left(x^{n-1} + \frac{1}{x^{n-1}}\right)$$
$$= x^n + x^{n-2} + \frac{1}{x^{n-2}} + \frac{1}{x^n}$$
$$= p_n + p_{n-2}.$$
Therefore,
$$p_n = 3p_{n-1} - p_{n-2},$$
so $k = -1$.

The initial values are $p_0 = 2$ and $p_1 = x + \frac{1}{x} = 3$.

We can now apply the recurrence repeatedly:
$$p_2 = 3p_1 - p_0 = 3(3) - 2 = 7,$$
$$p_3 = 3p_2 - p_1 = 3(7) - 3 = 18,$$
$$p_4 = 3p_3 - p_2 = 3(18) - 7 = 47,$$
$$p_5 = 3p_4 - p_3 = 3(47) - 18 = 123,$$
$$p_6 = 3p_5 - p_4 = 3(123) - 47 = 322.$$
Hence
$$p_6 = 322.$$
