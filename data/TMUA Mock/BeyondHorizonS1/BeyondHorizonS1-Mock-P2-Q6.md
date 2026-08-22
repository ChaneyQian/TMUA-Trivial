---
database: TMUA
qid: 20132101211206
id: BeyondHorizonS1-Mock-P2-Q6
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
If the product of an odd number of odd integers is of the form $4n+1$, then:
$$\mathbf{A} \quad \text{an even number of them must always be of the form } 4n+1;$$
$$\mathbf{B} \quad \text{an odd number of them must always be of the form } 4n+3;$$
$$\mathbf{C} \quad \text{an odd number of them must always be of the form } 4n+1;$$
$$\mathbf{D} \quad \text{none of the above statements is true.}$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Every odd integer is congruent to $1$ or $3$ modulo $4$, so write $t$ for the total number of factors, $a$ for how many are of the form $4n+1$ and $b$ for how many are of the form $4n+3$, giving $a+b=t$. Modulo $4$ the product is congruent to $3^{b}$, and since $3^2\equiv 1$, the product is $\equiv 1$ precisely when $b$ is even and $\equiv 3$ when $b$ is odd. The hypothesis that the product has the form $4n+1$ therefore forces $b$ to be even, which rules out B, and the hypothesis that $t$ is odd then gives $a=t-b=\text{odd}-\text{even}=\text{odd}$. So an odd number of the factors are of the form $4n+1$, which also rules out A. The answer is C.
