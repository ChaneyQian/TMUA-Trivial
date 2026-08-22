---
database: TMUA
qid: 20132101211210
id: BeyondHorizonS1-Mock-P2-Q10
paper: TMUA Mock
year:
number: Q10
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Let $S$ be the set of all numbers of the form $4^n-3n-1$, where $n=1,2,3,\dots$. Let $T$ be the set of all numbers of the form $9(n-1)$, where $n=1,2,3,\dots$. Only one of the following statements is correct. Which one is it?
$$\mathbf{A} \quad \text{Each number in } S \text{ is also in } T.$$
$$\mathbf{B} \quad \text{Each number in } T \text{ is also in } S.$$
$$\mathbf{C} \quad \text{Every number in } S \text{ is in } T \text{ and every number in } T \text{ is in } S.$$
$$\mathbf{D} \quad \text{There are numbers in } S \text{ which are not in } T \text{ and there are numbers in } T \text{ which are not in } S.$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
The set $T$ is simply the set of non-negative multiples of $9$. Expanding $4^n=(1+3)^n$ by the binomial theorem gives
$$4^n-3n-1=\sum_{j=0}^{n}\binom{n}{j}3^{j}-3n-1=\sum_{j=2}^{n}\binom{n}{j}3^{j},$$
because the $j=0$ and $j=1$ terms are exactly $1$ and $3n$. Every surviving term carries a factor $3^j$ with $j\geq 2$, hence is divisible by $9$, so every element of $S$ is a non-negative multiple of $9$ and $S\subseteq T$. The reverse inclusion fails, since $S=\{0,9,54,243,1008,\dots\}$ grows far too quickly to contain $18$, so B and C are false, and D is false because it asserts elements of $S$ outside $T$. The answer is A.
