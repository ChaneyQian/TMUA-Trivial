---
database: TMUA
qid: 90010221700
id: Spec-P2-Q17
paper: TMUA P2
year:
number: Q17
section: Reasoning
difficulty: 0
topics:
  - Logic and Proof
subtopics:
  - Logic
tags:
  - specimen
status: 已入库
---

## 题目
Let $S$ be a set of positive integers, for example $S$ could consist of 3, 4, and 8.

A positive integer $n$ is called an $S$-number **if and only if** for every factor $m$ of $n$ with $m > 1$, the number $m$ is a multiple of some number in $S$.

So in the above example, 9 is an $S$-number; this is because the factors of 9 greater than 1 are 3 and 9, and each of these is a multiple of 3.

Positive integer $n$ is therefore **not** an $S$-number **if and only if**

$$
\mathbf{A} \quad \text{for }\textbf{every}\text{ (positive) factor } m \text{ of } n \text{ with } m > 1,\\
\text{there is a number in } S \text{ which is not a factor of } m.
$$

$$
\mathbf{B} \quad \text{for }\textbf{every}\text{ (positive) factor } m \text{ of } n \text{ with } m > 1,\\
\text{there is no number in } S \text{ which is a factor of } m.
$$

$$
\mathbf{C} \quad \text{for }\textbf{every}\text{ (positive) factor } m \text{ of } n \text{ with } m > 1,\\
\text{every number in } S \text{ is a factor of } m.
$$

$$
\mathbf{D} \quad \text{for }\textbf{some}\text{ (positive) factor } m \text{ of } n \text{ with } m > 1,\\
\text{there is a number in } S \text{ which is not a factor of } m.
$$

$$
\mathbf{E} \quad \text{for }\textbf{some}\text{ (positive) factor } m \text{ of } n \text{ with } m > 1,\\
\text{there is no number in } S \text{ which is a factor of } m.
$$

$$
\mathbf{F} \quad \text{for }\textbf{some}\text{ (positive) factor } m \text{ of } n \text{ with } m > 1,\\
\text{every number in } S \text{ is a factor of } m.
$$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
We are being asked to negate the statement ‘n is an S-number’, that is, to negate the statement

for every factor m of n with $m > 1$ , the number m is a multiple of some number in S.

The negation of ‘for every m, P’ is ‘there exists m such that not P’, a negation is

there exists a factor m of n with m > 1 such that it is not the case that the number m is a multiple of some number in S.

(Note that ‘a factor m of n with m > 1’ is the condition on the numbers m which are being considered by the ‘for every’, so it is not changed by the negation.) ‘There exists’ is the same as ‘for some’, so the correct answer is either D, E or F.

We next need to simplify the second half of our new statement, namely ‘it is not the case that the number m is a multiple of some number in S’. If it is not the case that ‘the number m is a multiple of some number in S’, then it must be that m is not a multiple of any number in S, or equivalently, that no number in S is a factor of m.

Therefore a full negation is

for some factor m of n with $m > 1$ , there is no number in S which is a factor of $m$

so the correct answer is E.
