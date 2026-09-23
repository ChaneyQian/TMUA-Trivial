---
database: TMUA
qid: 90020230700
id: SMT-Ch5-Q7
paper: SMT Skills Ch5
year:
number: Q7
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
Find the non-zero solution to the equation $\frac{3^{(16^x)}}{81^{(4^x)}} = \frac{1}{27}$

$$\mathbf{A} \quad \log_4 3$$

$$\mathbf{B} \quad 2\log_4 3$$

$$\mathbf{C} \quad 1$$

$$\mathbf{D} \quad 2$$

$$\mathbf{E} \quad \log_3 4$$

$$\mathbf{F} \quad 2\log_3 4$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 5 章 Functions 章末 TMUA style 第 7 题；解析为书后官方 worked solution。

## 答案
A

## 解析
$\frac{3^{16^{x}}}{81^{4^{x}}} = \frac{1}{27}$

$$
\frac{3^{\left( 4^{2} \right)^{x}}}{\left( 3^{4} \right)^{4^{x}}} = 3^{- 3}
$$

$$
\frac{3^{4^{2x}}}{3^{4^{x + 1}}} = 3^{- 3}
$$

$$
3^{\left( 4^{2x} - 4^{x + 1} \right)} = 3^{- 3}
$$

$$
4^{2x} - 4^{x + 1} = - 3
$$

$$
4^{2x} - 4 \times 4^{x} + 3 = 0
$$

Let $a = 4^{x}$

$$
a^{2} - 4a + 3 = 0
$$

$$
(a - 1)(a - 3) = 0
$$

$a = 1\ \ \overset{\Leftrightarrow}{\ }\ 4^{x} = 1\ \ \overset{\Leftrightarrow}{\ }\ x = 0$ but non-zero solution required

$$
a = 3\ \ \overset{\Leftrightarrow}{\ }\ 4^{x} = 3\ \ \overset{\Leftrightarrow}{\ }\ x = \log_{4}3
$$

The correct answer is A
