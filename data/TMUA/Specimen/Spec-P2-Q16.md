---
database: TMUA
qid: 90010221600
id: Spec-P2-Q16
paper: TMUA P2
year:
number: Q16
section: Reasoning
difficulty: 0
topics: []
subtopics: []
tags:
  - specimen
status: 已入库
---

## 题目
The sequence $a_n$ is given by the rule:

$$
\begin{aligned}
a_1 &= 2 \\
a_{n+1} &= a_n + (-1)^n \text{ for } n \geq 1
\end{aligned}
$$

What is

$$
\sum_{n=1}^{100} a_n
$$

$$
\mathbf{A} \quad 150
$$

$$
\mathbf{B} \quad 250
$$

$$
\mathbf{C} \quad -4750
$$

$$
\mathbf{D} \quad 5150
$$

$$
\mathbf{E} \quad 4\left(1 - \left(\dfrac{1}{2}\right)^{100}\right)
$$

$$
\mathbf{F} \quad 4\left(\left(\dfrac{3}{2}\right)^{100} - 1\right)
$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
We start by calculating the first few terms of the sequence:

$$
a _ {1} = 2
$$

$$
a _ {2} = 2 + (- 1) ^ {1} = 1
$$

$$
a _ {3} = 1 + (- 1) ^ {2} = 2
$$

$$
a _ {4} = 2 + (- 1) ^ {3} = 1
$$

$$
a _ {5} = 1 + (- 1) ^ {4} = 2
$$

The pattern is now clear: every pair of terms is 2, 1 and sums to 3. So $\textstyle \sum _ { n = 1 } ^ { 1 0 0 } a _ { n }$ is the sum of 50 pairs of terms, each of which sums to 3. Hence

$$
\sum_ {n = 1} ^ {1 0 0} a _ {n} = 5 0 \times 3 = 1 5 0
$$

and the answer is A.

Commentary: Note that this is not an arithmetic series, as there is not a common difference (that is, equal difference) between consecutive terms, and neither is it a geometric series. So we cannot use the formulae for the sum of an arithmetic or geometric series.
