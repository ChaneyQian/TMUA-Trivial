---
database: TMUA
qid: 20132101211214
id: BeyondHorizonS1-Mock-P2-Q14
paper: TMUA Mock
year:
number: Q14
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Evaluate the integral:
$$\int_{-0.5}^{2.5} 2^{\lfloor x\rfloor}\,dx$$
where $\lfloor x\rfloor$ is the floor of $x$.
$$\mathbf{A} \quad 5$$
$$\mathbf{B} \quad \frac{13}{4}$$
$$\mathbf{C} \quad \frac{1}{4}$$
$$\mathbf{D} \quad \frac{15}{2}$$
$$\mathbf{E} \quad \frac{21}{4}$$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
The integrand is a step function, constant on each interval between consecutive integers, so the integral is a sum of rectangle areas. On $[-0.5,0)$ the floor is $-1$ and the integrand is $\tfrac12$ over a width of $\tfrac12$, contributing $\tfrac14$; on $[0,1)$ the integrand is $1$ over width $1$, contributing $1$; on $[1,2)$ it is $2$ over width $1$, contributing $2$; and on $[2,2.5]$ it is $4$ over width $\tfrac12$, contributing $2$. Adding the four pieces gives $\tfrac14+1+2+2=\tfrac{21}{4}$. The answer is E.
