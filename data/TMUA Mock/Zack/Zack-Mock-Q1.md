---
database: TMUA
qid: 20132101204001
id: Zack-Mock-Q1
paper: TMUA Mock
year:
number: Q1
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Let $a_n$ be the area bounded by the curves $x = y$, $x^2 + y^2 = n$ and the positive x-axis. What is $\sum_{n=1}^{100} a_n$?

$$
\mathbf{A} \quad \frac{250\pi}{2}
$$

$$
\mathbf{B} \quad \frac{50\pi}{4}
$$

$$
\mathbf{C} \quad \frac{5050\pi}{8}
$$

$$
\mathbf{D} \quad \frac{3805\pi}{8}
$$

$$
\mathbf{E} \quad 150\sqrt{2}\pi
$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
![[Image/Zack-Mock-Q1-sol1.png]]

The three boundaries are the line $x=y$, the circle $x^{2}+y^{2}=n$ of radius $\sqrt{n}$, and the positive $x$-axis. So $a_{n}$ is a circular **sector** running from angle $0$ to angle $\frac{\pi}{4}$ — the angle is the same for every $n$, only the radius changes.

A sector of radius $\rho$ and angle $\theta$ has area $\tfrac12\rho^{2}\theta$, so

$$ a_{n} = \tfrac12 \cdot n \cdot \frac{\pi}{4} = \frac{n\pi}{8} $$

Summing is then just a triangular number:

$$ \sum_{n=1}^{100} a_{n} = \frac{\pi}{8}\sum_{n=1}^{100} n = \frac{\pi}{8}\cdot\frac{100\cdot101}{2} = \frac{5050\pi}{8} $$

The answer is C.
