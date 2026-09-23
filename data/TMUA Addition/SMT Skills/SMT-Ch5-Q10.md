---
database: TMUA
qid: 90020231000
id: SMT-Ch5-Q10
paper: SMT Skills Ch5
year:
number: Q10
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
style: TMUA
solution_source: 书后解答
status: 已入库
---

## 题目
The curve $y = ax^2 + 3$ passes through the points $(2, \log_2 p)$ and $(-1 + \log_2 p, 11)$ where $p$ is a positive real number.
Find the value of $p$.

$$\mathbf{A} \quad \frac{1}{32}$$

$$\mathbf{B} \quad \frac{1}{16}$$

$$\mathbf{C} \quad \frac{1}{4}$$

$$\mathbf{D} \quad 1$$

$$\mathbf{E} \quad 4$$

$$\mathbf{F} \quad 16$$

$$\mathbf{G} \quad 32$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 5 章 Functions 章末 TMUA style 第 10 题；解析为书后官方 worked solution。

## 答案
G

## 解析
$y = ax^{2} + 3$ $\left( 2,\log_{2}p \right)$ $\left( - 1 + \log_{2}p,11 \right)$

Using $\left( 2,\log_{2}p \right)$: $\log_{2}p = 4a + 3$ A

Using $\left( - 1 + \log_{2}p,11 \right)$: $11 = a\left( - 1 + \log_{2}p \right)^{2} + 3\ \overset{\Leftrightarrow}{\ }\ a\left( - 1 + \log_{2}p \right)^{2} = 8$ B

Substituting A into B:

$a( - 1 + 4a + 3)^{2} = 8$

$a(2a + 1)^{2} = 2$

$4a^{3} + 4a^{2} + a - 2 = 0$

Using the factor theorem with $a = \frac{1}{2}$:

$\frac{4}{8} + \frac{4}{4} + \frac{1}{2} - 2 = \frac{1}{2} + 1 + \frac{1}{2} - 2 = 0$ so $(2a - 1)$ is a factor

$(2a - 1)\left( 2a^{2} + ka + 2 \right) \equiv 4a^{3} + 4a^{2} + a - 2$

Equating coefficients of $a^{2}$: $2k - 2 = 4\ \ \overset{\Leftrightarrow}{\ }\ \ k = 3$

$(2a - 1)\left( 2a^{2} + 3a + 2 \right) = 0$

For the quadratic factor, the discriminant $\mathrm{\Delta} = 9 - 16$ shows that there are no further real solutions and the only real solution is $a = \frac{1}{2}$.

Substituting this into A: $\log_{2}p = 2 + 3 = 5$ so $p = 2^{5} = 32$

The correct answer is G
