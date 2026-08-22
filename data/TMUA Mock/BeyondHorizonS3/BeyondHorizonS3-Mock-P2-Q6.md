---
database: TMUA
qid: 20132101213206
id: BeyondHorizonS3-Mock-P2-Q6
paper: TMUA Mock
year:
number: Q6
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
(*) is the statement that the functions
$$f(x) = b^{ax}$$
$$g(x) = b^{x^a}$$
$$h(x) = b^{a^x}$$
are all defined and increasing for $x > 0$. Find the range of $a$ and $b$ for which (*) is true.
$$\mathbf{A} \quad a > 0 \text{ and } b > 0$$
$$\mathbf{B} \quad a < 0 \text{ and } b > 1$$
$$\mathbf{C} \quad a > 1 \text{ and } b > 0$$
$$\mathbf{D} \quad a > 1 \text{ and } b > 1$$
$$\mathbf{E} \quad a > 0 \text{ and } 0 < b < 1$$
$$\mathbf{F} \quad a = 1 \text{ and } b > 0$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
First deal with definedness. For $b^{(\cdot)}$ to make sense for arbitrary real exponents we need $b > 0$. In $h(x) = b^{a^x}$ the inner expression $a^x$ must itself be defined for all real $x > 0$, which forces $a > 0$; a negative $a$ makes $a^{1/2}$ undefined over the reals.

Now impose "increasing". Writing each function as $b^{u(x)} = e^{u(x)\ln b}$, the derivative is $u'(x)\ln b \cdot b^{u(x)}$, and since $b^{u(x)} > 0$ the sign is that of $u'(x)\ln b$.

For $f$, $u(x) = ax$ and $u'(x) = a > 0$, so we need $\ln b > 0$, i.e. $b > 1$. For $g$, $u(x) = x^a$ and $u'(x) = a x^{a-1} > 0$ for $x > 0$, which gives the same condition $b > 1$ and nothing new. For $h$, $u(x) = a^x$ and $u'(x) = a^x \ln a$, so we need $\ln a \cdot \ln b > 0$; since $\ln b > 0$ already, this forces $\ln a > 0$, i.e. $a > 1$.

Conversely, if $a > 1$ and $b > 1$ then all three derivatives are positive for $x > 0$, so all three functions are defined and increasing there. The answer is D.
