---
database: TMUA
qid: 20132101212219
id: BeyondHorizonS2-Mock-P2-Q19
paper: TMUA Mock
year:
number: Q19
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The set of all real numbers $x$ for which
$$\log_{2004}(\log_{2003}(\log_{2002}(\log_{2001} x)))$$
is defined is $\{x \mid x > c\}$. What is the value of $c$?
$$\mathbf{A} \quad 0$$
$$\mathbf{B} \quad 2001^{2002}$$
$$\mathbf{C} \quad 2002^{2003}$$
$$\mathbf{D} \quad 2003^{2004}$$
$$\mathbf{E} \quad 2001^{2002^{2003}}$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Work from the outside inwards, each logarithm requiring its argument to be strictly positive. The outermost one needs $\log_{2003}(\log_{2002}(\log_{2001} x)) > 0$, which means $\log_{2002}(\log_{2001} x) > 1$, which means $\log_{2001} x > 2002$, which means
$$x > 2001^{2002}.$$
Each of the weaker inner conditions, namely $\log_{2001} x > 1$ and $x > 1$ and $x > 0$, is implied by this one, so the domain is exactly $\{x \mid x > 2001^{2002}\}$ and $c = 2001^{2002}$. The answer is B.
