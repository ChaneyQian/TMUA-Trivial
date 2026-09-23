---
database: TMUA
qid: 90020260100
id: SMT-Ch8-Q1
paper: SMT Skills Ch8
year:
number: Q1
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
The sequence $t_n$ is given by:
$$ t_1 = 1000 $$
$$ t_{n+1} = 1000\sqrt[3]{t_n} $$
The value of $t_{100}$ is $10^a$ where $a$ is equal to

$$\mathbf{A} \quad \frac{3^{100} - 3}{2 \times 3^{99}}$$

$$\mathbf{B} \quad \frac{3^{101} - 3}{2 \times 3^{99}}$$

$$\mathbf{C} \quad \frac{3^{101} + 1}{3^{100}}$$

$$\mathbf{D} \quad \frac{3^{101} + 3}{2 \times 3^{99}}$$

$$\mathbf{E} \quad \frac{3^{100} + 3}{2 \times 3^{99}}$$

$$\mathbf{F} \quad \frac{3^{101} - 1}{3^{100}}$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 8 章 Sequences and series 章末 TMUA style 第 1 题；解析为书后官方 worked solution。

## 答案
B

## 解析
Everything in sight is a power of $10$, so write $t_n = 10^{c_n}$. Then $t_1 = 10^3$ gives $c_1 = 3$, and

$$t_{n+1} = 1000\,\sqrt[3]{t_n} = 10^3 \times 10^{c_n/3}$$

so

$$c_{n+1} = 3 + \frac{c_n}{3}.$$

This is a linear recurrence whose fixed point is given by $c = 3 + \frac{c}{3}$, i.e. $c = \frac{9}{2}$. Subtracting the fixed point turns it into a geometric sequence:

$$c_{n+1} - \frac{9}{2} = 3 + \frac{c_n}{3} - \frac{9}{2} = \frac{1}{3}\left(c_n - \frac{9}{2}\right).$$

Since $c_1 - \frac{9}{2} = -\frac{3}{2}$, this gives $c_n - \frac{9}{2} = -\frac{3}{2}\left(\frac{1}{3}\right)^{n-1}$, so

$$c_{100} = \frac{9}{2} - \frac{3}{2} \times \frac{1}{3^{99}} = \frac{9 \times 3^{99} - 3}{2 \times 3^{99}} = \frac{3^{101} - 3}{2 \times 3^{99}}.$$

The correct answer is (B).

Option D is the same expression with the sign of the correction reversed; it exceeds $\frac{9}{2}$, whereas every term of $c_n$ is below $\frac{9}{2}$ because the sequence increases towards it from $c_1 = 3$.
