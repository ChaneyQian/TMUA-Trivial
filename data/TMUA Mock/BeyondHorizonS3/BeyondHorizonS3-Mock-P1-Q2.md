---
database: TMUA
qid: 20132101213102
id: BeyondHorizonS3-Mock-P1-Q2
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
Let $d_1, d_2, \ldots, d_k$ be all the factors of a positive integer $n$ including $1$ and $n$. Suppose $d_1 + d_2 + \cdots + d_k = 72$. Find the value of
$$\frac{1}{d_1} + \frac{1}{d_2} + \cdots + \frac{1}{d_k}$$
$$\mathbf{A} \quad \frac{k^2}{72}$$
$$\mathbf{B} \quad \frac{72}{k}$$
$$\mathbf{C} \quad \frac{72}{n}$$
$$\mathbf{D} \quad \frac{72}{k^2}$$
$$\mathbf{E} \quad \frac{72}{n^2}$$
$$\mathbf{F} \quad \text{cannot be found from the given information}$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
The divisors of $n$ pair up under $d \mapsto n/d$: if $d$ divides $n$ then so does $n/d$, and this map is a bijection of the divisor set onto itself. Hence $\frac{1}{d_i} = \frac{n/d_i}{n}$, and summing over all $i$ turns the reciprocal sum into $\frac{1}{n}\sum_i \frac{n}{d_i}$, where the sum on the right runs over exactly the same list of divisors as the original sum, merely reordered. Therefore $\sum_i \frac{1}{d_i} = \frac{1}{n}\sum_i d_i = \frac{72}{n}$. Concretely, for $n = 30$ the divisor sum is $72$ and the reciprocal sum is $\frac{1+2+3+5+6+10+15+30}{30} = \frac{72}{30}$, as claimed. The answer is C. Option F is the trap for anyone who thinks $n$ is not pinned down by the data — it need not be, but the requested value depends only on $n$ symbolically, which is all the options ask for.
