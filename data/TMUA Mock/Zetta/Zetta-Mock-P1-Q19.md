---
database: TMUA
qid: 20132101202119
id: Zetta-Mock-P1-Q19
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
Find the number of integer values of $k$ in the range $-500 \leq k \leq 500$ for which the equation $\log(kx) = 2 \log(x + 2)$ has exactly one real solution.

$$
\mathbf{A} \quad 499
$$

$$
\mathbf{B} \quad 500
$$

$$
\mathbf{C} \quad 501
$$

$$
\mathbf{D} \quad 502
$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Both logarithms need positive arguments: $kx>0$ and $x+2>0$. Where those hold, the equation is $kx = (x+2)^{2}$, i.e.

$$ x^{2}+(4-k)x+4 = 0 $$

Write $f(x) = x^{2}+(4-k)x+4$ and note $f(0)=4>0$ and $f(-2) = 2k$.

**If $k<0$**, the sign condition $kx>0$ forces $x<0$, so we need roots in $(-2,0)$. Here $f(-2)=2k<0$ while $f(0)=4>0$, so exactly one root lies in $(-2,0)$; the other lies below $-2$ and is rejected. Every one of the $500$ values $k=-500,\dots,-1$ therefore gives exactly one solution.

**If $k>0$**, we need roots with $x>0$. The discriminant is $(4-k)^{2}-16 = k(k-8)$, so real roots need $k \geq 8$. At $k=8$ there is a repeated root $x=2>0$ — exactly one solution. For $k>8$ both roots are positive and distinct (their product is $4$ and their sum $k-4>0$), giving two solutions, which is too many. For $0<k<8$ there are none.

So $k=8$ is the only positive value that works, and the count is $500+1 = 501$.

The answer is C.
