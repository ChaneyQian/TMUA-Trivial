---
database: TMUA
qid: 20132101211216
id: BeyondHorizonS1-Mock-P2-Q16
paper: TMUA Mock
year:
number: Q16
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
For how many integers $n$ is $\frac{n}{20-n}$ the square of an integer?
$$\mathbf{A} \quad 1$$
$$\mathbf{B} \quad 2$$
$$\mathbf{C} \quad 3$$
$$\mathbf{D} \quad 4$$
$$\mathbf{E} \quad 10$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Set $\frac{n}{20-n}=k^2$ with $k$ a non-negative integer; solving for $n$ gives $n(1+k^2)=20k^2$, hence
$$n=\frac{20k^2}{1+k^2}=20-\frac{20}{1+k^2},$$
so $n$ is an integer exactly when $1+k^2$ divides $20$. The divisors of $20$ are $1,2,4,5,10,20$, and $1+k^2$ matches only for $k^2\in\{0,1,4,9\}$, since $k^2=3$ and $k^2=19$ are not squares. These give $k=0,1,2,3$ and correspondingly $n=0,10,16,18$, all of which are legitimate as none makes the denominator zero. Negative $n$ can be discarded because then $20-n>0$ and the quotient would be negative, hence never a square. That is four values in total. The answer is D.
