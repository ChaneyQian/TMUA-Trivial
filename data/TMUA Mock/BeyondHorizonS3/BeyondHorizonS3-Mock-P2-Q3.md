---
database: TMUA
qid: 20132101213203
id: BeyondHorizonS3-Mock-P2-Q3
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
Find the highest power of $x$ in
$$\left[\left((2x^5+6)^4 + (4x^6+3)^3\right)^7 + \left((2x^4+3x^5)^5 - (x^7-6)^4\right)^5\right]^{10}$$
$$\mathbf{A} \quad 1200$$
$$\mathbf{B} \quad 1300$$
$$\mathbf{C} \quad 1400$$
$$\mathbf{D} \quad 1500$$
$$\mathbf{E} \quad 1600$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Work outwards, tracking the leading term at each stage, since the only way the degree could drop is if two leading terms cancelled.

In the first inner bracket, $(2x^5+6)^4$ has degree $20$ with leading term $16x^{20}$, while $(4x^6+3)^3$ has degree $18$. The sum therefore has leading term $16x^{20}$, and raising to the seventh power gives leading term $16^7 x^{140}$.

In the second inner bracket, $(2x^4+3x^5)^5$ has degree $25$, while $(x^7-6)^4$ has degree $28$ with leading term $x^{28}$. Subtracting, the leading term is $-x^{28}$, and raising to the fifth power gives $(-1)^5 x^{140} = -x^{140}$.

Both summands thus have degree $140$, so we must check that they do not cancel: the coefficients are $16^7 = 268435456$ and $-1$, whose sum is $268435455 \neq 0$. Hence the square bracket has degree $140$, and the tenth power has degree $140 \times 10 = 1400$. The answer is C.
