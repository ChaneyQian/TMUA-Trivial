---
database: MAT
qid: 90020332900
id: SMT-Ch5-Q29
paper: SMT Skills Ch5
year:
number: Q29
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
style: MAT
solution_source: 书后解答
status: 已入库
---

## 题目
For a real number $x$ we denote by $\lfloor x \rfloor$ the largest integer less than or equal to $x$.

	Let $n$ be a natural number. The integral $\int_0^n 2^x - \lfloor 2^x \rfloor \, \text{d}x$ equals

***

(a) $n(2^n - 1) - \log_2((2^n - 1)!)$
(b) $n2^n - \log_2((2^n)!) $
(c) $n + \log_2((2^n - 1)!)$
(d) $(2^n - 1) + \log_2\left(\frac{(2^n - 1)!}{n}\right)$
(e) $n + \log_2((2^n)!)$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 5 章 Functions 章末 MAT style 第 29 题；解析为书后官方 worked solution。

## 答案
C

## 解析
The integral can be written as a difference of two integrals

$$
\int_{0}^{n}2^{n}\ dx - \int_{0}^{n}\left\lfloor 2^{x} \right\rfloor\ dx
$$

The first integral can be considered to be the area of a rectangle of base $n$ units and height $2^{n}$ units

$$
\int_{0}^{n}2^{n}\ dx = n2^{n}
$$

When $x = 0$, $2^{x} = 1$

For $0 \leq x < 1$, $1 \leq 2^{x} < 2$ so $\left\lfloor 2^{x} \right\rfloor = 1$

For $1 \leq x < \log_{2}3$, $2 \leq 2^{x} < 3$ so $\left\lfloor 2^{x} \right\rfloor = 2$

For $\log_{2}3 \leq x < \log_{2}4$, $3 \leq 2^{x} < 4$ so $\left\lfloor 2^{x} \right\rfloor = 3$

For $\log_{2}4 \leq x < \log_{2}5$, $4 \leq 2^{x} < 5$ so $\left\lfloor 2^{x} \right\rfloor = 4$

Since $n$ is a natural number, it follows that the value of $x$ at the upper limit is $\log_{2}2^{n}$

For $\log_{2}\left( 2^{n} - 1 \right) \leq x < \log_{2}2^{n}$, $\left( 2^{n} - 1 \right) \leq 2^{x} < 2^{n}$ so $\left\lfloor 2^{x} \right\rfloor = \left( 2^{n} - 1 \right)$

The integral will be the sum of several rectangular areas

![[Image/SMT-sol-image20.png]]

It is a good idea to express the base length of each rectangle entirely in terms of logarithms to base 2.

Rectangle 1 has an area of $1 \times \left( \log_{2}2 - \log_{2}1 \right)$

Rectangle 2 has an area of $2 \times \left( \log_{2}3 - \log_{2}2 \right)$

Rectangle 3 has an area of $3 \times \left( \log_{2}4 - \log_{2}3 \right)$

The final rectangle has an area of $\left( 2^{n} - 1 \right)\left( \log_{2}2^{n} - \log_{2}\left( 2^{n} - 1 \right) \right)$

$$
\int_{0}^{n}\left\lfloor 2^{x} \right\rfloor\ dx = \left( \log_{2}2 - \log_{2}1 \right) + 2\left( \log_{2}3 - \log_{2}2 \right) + \left( \log_{2}4 - \log_{2}3 \right) + \ldots + \left( 2^{n} - 1 \right)\left( \log_{2}2^{n} - \log_{2}\left( 2^{n} - 1 \right) \right)
$$

$= - \log_{2}1 - \log_{2}2 - \log_{2}3 - \ldots - \log_{2}\left( 2^{n} - 1 \right) + \left( 2^{n} - 1 \right)\log_{2}2^{n}$

$= - \left( \log_{2}1 + \log_{2}2 + \log_{2}3 + \ldots + \log_{2}\left( 2^{n} - 1 \right) \right) + n\left( 2^{n} - 1 \right)$

$= n\left( 2^{n} - 1 \right) - \log_{2}\left( \left( 2^{n} - 1 \right)! \right)$

$$
\int_{0}^{n}{2^{n} -}\left\lfloor 2^{x} \right\rfloor\ dx = n2^{n} - n\left( 2^{n} - 1 \right) + \log_{2}\left( \left( 2^{n} - 1 \right)! \right) = n + \log_{2}\left( \left( 2^{n} - 1 \right)! \right)
$$

The correct answer is (c)

There is a quick way to answer the question by selecting simple values for $n$. Two of the options are written with this in mind. Using $n = 1$ gives options (a), (b) and (d) as well as (c).

Using $n = 2$ gives option (d) as well as (c). Using $n = 3$ would identify (c) as correct.
