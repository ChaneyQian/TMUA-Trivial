---
database: TMUA
qid: 90020210200
id: SMT-Ch3-Q2
paper: SMT Skills Ch3
year:
number: Q2
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
The coefficient of $x^{11}$ in the expansion of $(2 + x^2 + x^3)^8$ is equal to $28$ times the coefficient of $x^2$ in $(2 + ax)^6$. Find all the possible values of the constant $a$.

$$\mathbf{A} \quad \pm \sqrt{2}$$

$$\mathbf{B} \quad \pm 2\sqrt{7}$$

$$\mathbf{C} \quad \pm \frac{1}{2}$$

$$\mathbf{D} \quad \pm \frac{1}{4}$$

$$\mathbf{E} \quad \pm 1$$

$$\mathbf{F} \quad \pm 2$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 3 章 Algebra 章末 TMUA style 第 2 题；解析为书后官方 worked solution。

## 答案
E

## 解析
Thinking of the ways in which $x^{11}$ terms can be obtained from $\left( 2 + x^{2} + x^{3} \right)^{8}$:
$\left( x^{3} \right)^{3}\left( x^{2} \right)^{1} \times 2^{4} \equiv 16x^{11}$ happens $\begin{pmatrix}
8 \
3
\end{pmatrix}\begin{pmatrix}
5 \
1
\end{pmatrix} = \frac{8 \times 7 \times 6}{3!} \times 5 = 56 \times 5 = 280$ times;
$\left( x^{3} \right)^{1}\left( x^{2} \right)^{4} \times 2^{3} \equiv 8x^{11}$ happens $\begin{pmatrix}
8 \
1
\end{pmatrix}\begin{pmatrix}
7 \
4
\end{pmatrix} = 8 \times \frac{7 \times 6 \times 5}{3!} = 8 \times 35 = 280$ times.
It follow that the coefficient of $x^{11}$ is $280 \times 16 + 280 \times 8 = 280 \times 24$.

The coefficient of $x^{2}$ in $(2 + ax)^{6}$ is $\begin{pmatrix}
6 \
2
\end{pmatrix} \times 2^{4} \times a^{2} = \frac{6 \times 5}{2!} \times 16 \times a^{2} = 240a^{2}$.

So $280 \times 24 = 28 \times 240a^{2} \Leftrightarrow 10 = 10a^{2} \Leftrightarrow a^{2} = 1 \Leftrightarrow a = \pm 1$.

The answer is E.
