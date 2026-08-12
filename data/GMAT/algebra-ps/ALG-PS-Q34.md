---
database: GMAT
qid: 90020713400
id: ALG-PS-Q34
paper: GMAT Algebra PS Diagnostic
year: 0
number: Q34
section: Problem Solving
band: VERY HARD
level: LEVEL 7
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Mbappe withdraws $\dfrac{100}{x}\%$ of the amount in his account each time he visits the bank, where $x$ is an integer greater than 1. If, after 5 visits, he has less than $\dfrac{1}{x}^{th}$ of the initial amount left in the bank, what is the range of possible values for $x$?

$$
\mathbf{A} \quad 1
$$

$$
\mathbf{B} \quad 2
$$

$$
\mathbf{C} \quad 3
$$

$$
\mathbf{D} \quad 4
$$

$$
\mathbf{E} \quad 5
$$

## 备注

### 我的备注

### AI备注

## 答案
B

## 解析
**Official Solution:**

Since $\frac{100}{x}\%$ of the money is withdrawn each time, after each visit, $(1 - \frac{100}{x}*\frac{1}{100})= (1 - \frac{1}{x})$ of the previous amount will remain in the bank. For example, if 10% is withdrawn each time, after each visit, $(1 - 10*\frac{1}{100})= (1 - \frac{1}{10})=\frac{9}{10}$ of the previous amount will remain in the bank.

Assuming the initial amount in the bank is A, then after 5 visits, the amount would be $A(1 - \frac{1}{x})^5$. We are told that this is less than $\frac{1}{x}$ of the initial amount, so we have:

$A(1 - \frac{1}{x})^5 < A*\frac{1}{x}$

$(1 - \frac{1}{x})^5 < \frac{1}{x}$

$(\frac{x-1}{x})^5 < \frac{1}{x}$

$\frac{(x-1)^5}{x^5} < \frac{1}{x}$

$(x-1)^5 < x^4$

As $x$ increases, the left-hand side of the inequality grows faster than the right-hand side, so the inequality will only hold for smaller values of $x$. Let's test some values. For $x = 5$, the inequality does not hold: $4^5 > 5^4$. However, if $x$ is 4 or less, it does hold. Since $x$ is an integer greater than 1, it can be 2, 3, or 4, making the range of possible values for $x$ equal to $4 - 2 = 2$.

Answer: B
