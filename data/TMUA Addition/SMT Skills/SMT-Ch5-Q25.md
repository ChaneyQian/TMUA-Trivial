---
database: MAT
qid: 90020332500
id: SMT-Ch5-Q25
paper: SMT Skills Ch5
year:
number: Q25
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
Given that $x, y$ and $z$ are positive real numbers, the equations
$$ 4\log_z x = y, \quad \log_x z = y, \quad x + \log_y z = 0 $$

(a) have no solutions for $x, y$ and $z$.
(b) have a unique solution for $x$ but not for $y$ and $z$.
(c) have unique solutions for $x$ and $y$ but infinitely many solutions for $z$.
(d) have unique solutions for $x$ and $z$ but infinitely many solutions for $y$.
(e) have a unique solution for $x, y$ and $z$.

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 5 章 Functions 章末 MAT style 第 25 题；解析为书后官方 worked solution。

## 答案
E

## 解析
From $4\log_{z}x = y,\ \ x^{4} = z^{y}$ A

From $\log_{x}z = y,\ \ {z = x}^{y}$ B

From $x + \log_{y}z = 0,\ \ z = y^{- x}$ C

Since $x$, $y$ and $z$ all feature as the base of a logarithm, all three must be positive.

Substituting B into A gives $x^{4} = \left( x^{y} \right)^{y}$ so $x^{y^{2}} = x^{4}$ and $y^{2} = 4$ so $y = 2$ since $y > 0$

A becomes $x^{4} = z^{2}$, B becomes ${z = x}^{2}$ and C becomes $z = 2^{- x}$ i.e. $z = \frac{1}{2^{x}}$

Substituting $z = \frac{1}{2^{x}}$ into ${z = x}^{2}$ gives $x^{2} = \frac{1}{2^{x}}$

To see if this gives unique values for $x$, the graphs of $y = \frac{1}{2^{x}}$ and $y = x^{2}$ can be sketched

![[Image/SMT-sol-image19.png]]

There is one solution for $x > 0$ (negative values can be ignored since you know that $x > 0$)

As there is a unique value for $x$, since ${z = x}^{2}$, there is also a unique value for $z$.

$x,\ y$ and $z$ all have unique solutions.

The correct answer is (e)
