---
database: GMAT
qid: 90020712300
id: ALG-PS-Q23
paper: GMAT Algebra PS Diagnostic
year: 0
number: Q23
section: Problem Solving
band: HARD
level: LEVEL 5
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
What is the value of $4^{3^{2^{1^{2^{3^4} } } } }$?

$$
\mathbf{A} \quad 2,144
$$

$$
\mathbf{B} \quad 262,142
$$

$$
\mathbf{C} \quad 262,144
$$

$$
\mathbf{D} \quad 262,146
$$

$$
\mathbf{E} \quad 262,148
$$

## 备注

### 我的备注

### AI备注

## 答案
C

## 解析
**Official Solution:**

To evaluate $4^{3^{2^{1^{2^{3^4}}}}}$, we need to remember the rule for working with stacked exponents, which is to begin with the highest exponent and work our way down. For example, $a^{m^n}$ means we first compute $m^n$ and then use that result as the exponent for $a$. Therefore, $a^{m^n} = a^{(m^n)}$. On the other hand, if we have $(a^m)^n$, we compute $a^m$ first and then raise the result to the power of $n$, so $(a^m)^n=a^{mn}$.

Let's evaluate the exponents of 4 in our expression. Since $1^{2^{3^4}}$ equals 1, we can ignore it completely, which means we will be left with $4^{3^2}$.

Using the exponent rule, $4^{3^2} = 4^9$.

Since the GMAT is a timed test, we may not have the luxury of actually computing the value of $4^9$. Instead, we need to use some shortcuts to arrive at the answer. Fortunately, we can notice that the units digit of each answer choice is different, and if we can determine the units digit of $4^9$, we can identify the correct answer.

The units digit of $4^k$, where $k$ is a positive integer, alternates between 4 and 6 for odd and even values of $k$, respectively. Since 9 is an odd number, the units digit of $4^9$ is 4.

We can now eliminate any answer choices that do not end in 4. The only answer choice that ends in 4 is C, so our answer is $4^{3^{2^{1^{2^{3^4}}}}} = 262,144$.

Answer: C
